import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Beat, NewsItem, Purchase, FavoriteItem, Rating, CartItem, Friend, Collaboration, Notification } from '@/types';
import { initialBeats, initialNews, initialPurchases, initialFavorites, initialRatings, initialFriends, initialCollaborations, initialNotifications } from '@/data/mockData';
import { saveAudioBlob, saveWavBlob, deleteAudioBlobs, getAudioObjectUrl } from '@/lib/audio-store';
import { useAuth } from './AuthContext';

type NewBeatInput = Omit<
  Beat,
  'id' | 'createdAt' | 'rating' | 'ratingCount' | 'salesCount' | 'plays' | 'audioUrl' | 'wavUrl'
> & {
  audioUrl?: string;
  wavUrl?: string;
  audioFile?: File | null;
  wavFile?: File | null;
};

interface DataContextType {
  beats: Beat[];
  news: NewsItem[];
  purchases: Purchase[];
  favorites: FavoriteItem[];
  ratings: Rating[];
  cart: CartItem[];
  friends: Friend[];
  collaborations: Collaboration[];
  notifications: Notification[];
  addBeat: (beat: NewBeatInput) => Promise<{success: boolean, beatId: string}>;
  updateBeat: (id: string, updates: Partial<Beat>) => void;
  deleteBeat: (id: string) => void;
  addNews: (news: Omit<NewsItem, 'id' | 'createdAt'>) => void;
  updateNews: (id: string, updates: Partial<NewsItem>) => void;
  deleteNews: (id: string) => void;
  addToCart: (beat: Beat) => void;
  removeFromCart: (beatId: string) => void;
  clearCart: () => void;
  purchaseCart: (currency: 'RUB' | 'USD') => { success: boolean; error?: string };
  toggleFavorite: (beatId: string) => void;
  isFavorite: (beatId: string) => boolean;
  rateBeat: (beatId: string, rating: number) => void;
  getUserRating: (beatId: string) => number | null;
  incrementPlays: (beatId: string) => void;
  addFriend: (userId: string, friendId: string) => void;
  removeFriend: (friendId: string) => void;
  acceptFriendRequest: (requestId: string) => void;
  rejectFriendRequest: (requestId: string) => void;
  getFriends: (userId: string) => Friend[];
  isFriend: (userId: string, friendId: string) => boolean;
  addCollaboration: (beatId: string, collaborators: string[]) => void;
  getCollaborations: (userId: string) => Collaboration[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => void;
  markNotificationAsRead: (notificationId: string) => void;
  deleteNotification: (notificationId: string) => void;
  getUnreadNotifications: (userId: string) => Notification[];
  getAllNotifications: (userId: string) => Notification[];
  getSellerBeats: (sellerId: string) => Beat[];
  getSellerPurchases: (sellerId: string) => Purchase[];
  getBuyerPurchases: (buyerId: string) => Purchase[];
  getPurchasedBeat: (beatId: string) => Beat | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const BEATS_KEY = 'beatmarket_beats';
const NEWS_KEY = 'beatmarket_news';
const PURCHASES_KEY = 'beatmarket_purchases';
const FAVORITES_KEY = 'beatmarket_favorites';
const RATINGS_KEY = 'beatmarket_ratings';
const CART_KEY = 'beatmarket_cart';
const FRIENDS_KEY = 'beatmarket_friends';
const COLLABORATIONS_KEY = 'beatmarket_collaborations';
const NOTIFICATIONS_KEY = 'beatmarket_notifications';

// Биты, которые нужно полностью удалить из системы
const REMOVED_BEAT_IDS: string[] = [];

export function DataProvider({ children }: { children: ReactNode }) {
  const { user, users, updateUserWallet, updateUser: updateUserFromAuth } = useAuth();
  
  const [beats, setBeats] = useState<Beat[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const parseSafe = <T,>(key: string, fallback: T): T => {
    const stored = localStorage.getItem(key);
    if (!stored) return fallback;
    try {
      return JSON.parse(stored) as T;
    } catch (error) {
      console.warn(`Failed to parse ${key} from localStorage, resetting`, error);
      localStorage.removeItem(key);
      return fallback;
    }
  };

  const setItemSafe = (key: string, value: unknown) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Failed to persist ${key}`, error);
    }
  };

  // Initialize data from localStorage or manifest in /public/audio
  useEffect(() => {
    const loadData = async () => {
      const storedBeats = parseSafe<Beat[]>(BEATS_KEY, []).filter(
        (b) => !REMOVED_BEAT_IDS.includes(b.id)
      );

      if (storedBeats.length > 0) {
        setBeats(storedBeats);
      } else {
        try {
          const res = await fetch('/audio/manifest.json');
          if (res.ok) {
            const manifestBeats = (await res.json()) as Beat[];
            const filtered = manifestBeats.filter(b => !REMOVED_BEAT_IDS.includes(b.id));
            setBeats(filtered.length > 0 ? filtered : initialBeats);
          } else {
            setBeats(initialBeats);
          }
        } catch (error) {
          console.warn('Failed to load /audio/manifest.json, falling back to initialBeats', error);
          setBeats(initialBeats);
        }
      }

      const purchasesData = parseSafe<Purchase[]>(PURCHASES_KEY, initialPurchases).filter(
        (p) => !REMOVED_BEAT_IDS.includes(p.beatId)
      );
      const favoritesData = parseSafe<FavoriteItem[]>(FAVORITES_KEY, initialFavorites).filter(
        (f) => !REMOVED_BEAT_IDS.includes(f.beatId)
      );
      const ratingsData = parseSafe<Rating[]>(RATINGS_KEY, initialRatings).filter(
        (r) => !REMOVED_BEAT_IDS.includes(r.beatId)
      );
      const friendsData = parseSafe<Friend[]>(FRIENDS_KEY, initialFriends);
      const collaborationsData = parseSafe<Collaboration[]>(COLLABORATIONS_KEY, initialCollaborations);
      const notificationsData = parseSafe<Notification[]>(NOTIFICATIONS_KEY, initialNotifications);

      setNews(parseSafe(NEWS_KEY, initialNews));
      setPurchases(purchasesData);
      setFavorites(favoritesData);
      setRatings(ratingsData);
      setFriends(friendsData);
      setCollaborations(collaborationsData);
      setNotifications(notificationsData);
    };

    loadData();
  }, []);

  // Load cart for current user
  useEffect(() => {
    if (user) {
      const cartKey = `${CART_KEY}_${user.id}`;
      const cartData = parseSafe<CartItem[]>(cartKey, []).filter(
        (item) => !REMOVED_BEAT_IDS.includes(item.beatId)
      );
      setCart(cartData);
    } else {
      setCart([]);
    }
  }, [user]);

  // Sync to localStorage
  useEffect(() => {
    if (beats.length > 0) setItemSafe(BEATS_KEY, beats);
  }, [beats]);

  useEffect(() => {
    if (news.length > 0) setItemSafe(NEWS_KEY, news);
  }, [news]);

  useEffect(() => {
    setItemSafe(PURCHASES_KEY, purchases);
  }, [purchases]);

  useEffect(() => {
    setItemSafe(FAVORITES_KEY, favorites);
  }, [favorites]);

  useEffect(() => {
    setItemSafe(RATINGS_KEY, ratings);
  }, [ratings]);

  useEffect(() => {
    setItemSafe(FRIENDS_KEY, friends);
  }, [friends]);

  useEffect(() => {
    setItemSafe(COLLABORATIONS_KEY, collaborations);
  }, [collaborations]);

  useEffect(() => {
    setItemSafe(NOTIFICATIONS_KEY, notifications);
  }, [notifications]);

  useEffect(() => {
    if (user) {
      const cartKey = `${CART_KEY}_${user.id}`;
      setItemSafe(cartKey, cart);
    }
  }, [cart, user]);

  const addBeat = async (beat: NewBeatInput) => {
    const newBeatId = `beat-${Date.now()}`;

    if (beat.audioFile) {
      await saveAudioBlob(newBeatId, beat.audioFile);
    }
    if (beat.wavFile) {
      await saveWavBlob(newBeatId, beat.wavFile);
    }

    const newBeat: Beat = {
      ...beat,
      audioUrl: beat.audioFile ? `idb://${newBeatId}` : beat.audioUrl || '',
      wavUrl: beat.wavFile ? `idb-wav://${newBeatId}` : beat.wavUrl,
      id: newBeatId,
      createdAt: new Date().toISOString(),
      rating: 0,
      ratingCount: 0,
      salesCount: 0,
      plays: 0,
    };

    setBeats(prev => [newBeat, ...prev]);
    
    return { success: true, beatId: newBeatId };
  };

  const updateBeat = (id: string, updates: Partial<Beat>) => {
    setBeats(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const deleteBeat = (id: string) => {
    setBeats(prev => prev.filter(b => b.id !== id));
    setFavorites(prev => prev.filter(f => f.beatId !== id));
    setRatings(prev => prev.filter(r => r.beatId !== id));
    setCart(prev => prev.filter(c => c.beatId !== id));
    deleteAudioBlobs(id).catch(() => undefined);
  };

  const addNews = (newsItem: Omit<NewsItem, 'id' | 'createdAt'>) => {
    const newNews: NewsItem = {
      ...newsItem,
      id: `news-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setNews(prev => [newNews, ...prev]);
  };

  const updateNews = (id: string, updates: Partial<NewsItem>) => {
    setNews(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n));
  };

  const deleteNews = (id: string) => {
    setNews(prev => prev.filter(n => n.id !== id));
  };

  const addToCart = (beat: Beat) => {
    if (!user) return;
    
    const exists = cart.some(item => item.beatId === beat.id);
    if (!exists) {
      setCart(prev => [...prev, { beatId: beat.id, beat, addedAt: new Date().toISOString() }]);
    }
  };

  const removeFromCart = (beatId: string) => {
    setCart(prev => prev.filter(item => item.beatId !== beatId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const purchaseCart = (currency: 'RUB' | 'USD'): { success: boolean; error?: string } => {
    if (!user || cart.length === 0) {
      return { success: false, error: 'Корзина пуста' };
    }

    const totalRub = cart.reduce((sum, item) => sum + item.beat.priceRub, 0);
    const totalUsd = cart.reduce((sum, item) => sum + item.beat.priceUsd, 0);

    if (currency === 'RUB' && user.walletRub < totalRub) {
      return { success: false, error: 'Недостаточно рублей на счёте' };
    }
    if (currency === 'USD' && user.walletUsd < totalUsd) {
      return { success: false, error: 'Недостаточно долларов на счёте' };
    }

    // Create purchases
    const newPurchases: Purchase[] = cart.map(item => ({
      id: `purchase-${Date.now()}-${item.beatId}`,
      beatId: item.beatId,
      buyerId: user.id,
      sellerId: item.beat.sellerId,
      priceRub: item.beat.priceRub,
      priceUsd: item.beat.priceUsd,
      currency,
      purchasedAt: new Date().toISOString(),
    }));

    setPurchases(prev => [...prev, ...newPurchases]);

    // Update beat sales count
    cart.forEach(item => {
      updateBeat(item.beatId, { salesCount: item.beat.salesCount + 1 });
      
      // Transfer money to seller
      const rubAmount = currency === 'RUB' ? item.beat.priceRub : 0;
      const usdAmount = currency === 'USD' ? item.beat.priceUsd : 0;
      updateUserWallet(item.beat.sellerId, rubAmount, usdAmount);
    });

    // Deduct from buyer
    if (currency === 'RUB') {
      updateUserWallet(user.id, -totalRub, 0);
    } else {
      updateUserWallet(user.id, 0, -totalUsd);
    }

    clearCart();
    return { success: true };
  };

  const toggleFavorite = (beatId: string) => {
    if (!user) return;
    
    const exists = favorites.some(f => f.beatId === beatId && f.userId === user.id);
    if (exists) {
      setFavorites(prev => prev.filter(f => !(f.beatId === beatId && f.userId === user.id)));
    } else {
      setFavorites(prev => [...prev, { beatId, userId: user.id, addedAt: new Date().toISOString() }]);
    }
  };

  const isFavorite = (beatId: string) => {
    if (!user) return false;
    return favorites.some(f => f.beatId === beatId && f.userId === user.id);
  };

  const rateBeat = (beatId: string, rating: number) => {
    if (!user) return;
    
    const existingRating = ratings.find(r => r.beatId === beatId && r.userId === user.id);
    
    if (existingRating) {
      setRatings(prev => prev.map(r => 
        r.id === existingRating.id ? { ...r, rating } : r
      ));
    } else {
      setRatings(prev => [...prev, {
        id: `rating-${Date.now()}`,
        beatId,
        userId: user.id,
        rating,
        createdAt: new Date().toISOString(),
      }]);
    }

    // Update beat average rating
    const beatRatings = ratings.filter(r => r.beatId === beatId);
    const newAvg = (beatRatings.reduce((sum, r) => sum + r.rating, 0) + rating) / (beatRatings.length + 1);
    updateBeat(beatId, { rating: newAvg, ratingCount: beatRatings.length + 1 });
  };

  const getUserRating = (beatId: string): number | null => {
    if (!user) return null;
    const rating = ratings.find(r => r.beatId === beatId && r.userId === user.id);
    return rating ? rating.rating : null;
  };

  const incrementPlays = (beatId: string) => {
    const beat = beats.find(b => b.id === beatId);
    if (beat) {
      updateBeat(beatId, { plays: beat.plays + 1 });
    }
  };

  const getSellerBeats = (sellerId: string) => beats.filter(b => b.sellerId === sellerId);
  
  const getSellerPurchases = (sellerId: string) => purchases.filter(p => p.sellerId === sellerId);
  
  const getBuyerPurchases = (buyerId: string) => purchases.filter(p => p.buyerId === buyerId);
  
  const getPurchasedBeat = (beatId: string) => beats.find(b => b.id === beatId);

  const addFriend = (userId: string, friendId: string) => {
    // Check if friend request already exists
    const existingRequest = friends.find(f => 
      (f.userId === userId && f.friendId === friendId) || 
      (f.userId === friendId && f.friendId === userId)
    );
    
    if (existingRequest) {
      // If request exists, just return
      return;
    }
    
    const newFriend: Friend = {
      id: `friend-${Date.now()}-${userId}-${friendId}`,
      userId,
      friendId,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    
    setFriends(prev => [...prev, newFriend]);
    
    // Add notification for the friend request
    const requestingUser = users.find(u => u.id === userId);
    if (requestingUser) {
      addNotification({
        userId: friendId, // recipient
        type: 'friend_request',
        title: 'Запрос в друзья',
        message: `Пользователь ${requestingUser.name} хочет добавить вас в друзья`,
        senderId: userId,
        relatedId: newFriend.id,
      });
    }
  };

  const removeFriend = (requestId: string) => {
    setFriends(prev => prev.filter(f => f.id !== requestId));
  };

  const acceptFriendRequest = (requestId: string) => {
    setFriends(prev => 
      prev.map(f => 
        f.id === requestId ? { ...f, status: 'accepted' } : f
      )
    );
    
    // Find the friend request to get the sender and receiver
    const friendRequest = friends.find(f => f.id === requestId);
    if (friendRequest) {
      // Add notification to the sender that their request was accepted
      const acceptingUser = users.find(u => u.id === friendRequest.userId || u.id === friendRequest.friendId);
      const otherUserId = friendRequest.userId === user?.id ? friendRequest.friendId : friendRequest.userId;
      
      if (acceptingUser) {
        addNotification({
          userId: otherUserId, // notify the original sender
          type: 'friend_accepted',
          title: 'Запрос в друзья принят',
          message: `Пользователь ${acceptingUser.name} принял ваш запрос в друзья`,
          senderId: user?.id,
          relatedId: requestId,
        });
      }
    }
  };
  
  const rejectFriendRequest = (requestId: string) => {
    const friendRequest = friends.find(f => f.id === requestId);
    
    setFriends(prev => prev.filter(f => f.id !== requestId));
    
    // Add notification to the sender that their request was rejected
    if (friendRequest) {
      const rejectingUser = users.find(u => u.id === friendRequest.userId || u.id === friendRequest.friendId);
      const otherUserId = friendRequest.userId === user?.id ? friendRequest.friendId : friendRequest.userId;
      
      if (rejectingUser) {
        addNotification({
          userId: otherUserId, // notify the original sender
          type: 'friend_rejected',
          title: 'Запрос в друзья отклонен',
          message: `Пользователь ${rejectingUser.name} отклонил ваш запрос в друзья`,
          senderId: user?.id,
          relatedId: requestId,
        });
      }
    }
  };

  const getFriends = (userId: string) => {
    return friends.filter(f => 
      (f.userId === userId || f.friendId === userId) && 
      f.status === 'accepted'
    );
  };

  const isFriend = (userId: string, friendId: string) => {
    return friends.some(f => 
      ((f.userId === userId && f.friendId === friendId) || 
       (f.userId === friendId && f.friendId === userId)) && 
      f.status === 'accepted'
    );
  };

  const addCollaboration = (beatId: string, collaborators: string[]) => {
    // Check if collaboration already exists
    const existingCollab = collaborations.find(c => c.beatId === beatId);
    
    if (existingCollab) {
      // Update existing collaboration
      setCollaborations(prev => 
        prev.map(c => 
          c.beatId === beatId ? { ...c, collaborators } : c
        )
      );
    } else {
      const newCollaboration: Collaboration = {
        id: `collab-${Date.now()}-${beatId}`,
        beatId,
        collaborators,
        createdAt: new Date().toISOString(),
      };
      
      setCollaborations(prev => [...prev, newCollaboration]);
      
      // Add notifications to collaborators
      const requestingUser = users.find(u => u.id === user?.id);
      collaborators.forEach(collaboratorId => {
        if (collaboratorId !== user?.id) { // Don't notify the user who initiated the collaboration
          addNotification({
            userId: collaboratorId,
            type: 'collaboration_invite',
            title: 'Приглашение к коллаборации',
            message: `Пользователь ${requestingUser?.name} пригласил вас к коллаборации над треком`,
            senderId: user?.id,
            relatedId: newCollaboration.id,
          });
        }
      });
    }
  };

  const getCollaborations = (userId: string) => {
    return collaborations.filter(c => c.collaborators.includes(userId));
  };
  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}-${notification.userId}`,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    
    setNotifications(prev => [...prev, newNotification]);
  };
  
  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
  };
  
  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };
  
  const getUnreadNotifications = (userId: string) => {
    return notifications.filter(notif => notif.userId === userId && !notif.isRead);
  };
  
  const getAllNotifications = (userId: string) => {
    return notifications.filter(notif => notif.userId === userId);
  };
  
  return (
    <DataContext.Provider value={{
      beats,
      news,
      purchases,
      favorites,
      ratings,
      cart,
      friends,
      collaborations,
      notifications,
      addBeat,
      updateBeat,
      deleteBeat,
      addNews,
      updateNews,
      deleteNews,
      addToCart,
      removeFromCart,
      clearCart,
      purchaseCart,
      toggleFavorite,
      isFavorite,
      rateBeat,
      getUserRating,
      incrementPlays,
      addFriend,
      removeFriend,
      acceptFriendRequest,
      rejectFriendRequest,
      getFriends,
      isFriend,
      addCollaboration,
      getCollaborations,
      addNotification,
      markNotificationAsRead,
      deleteNotification,
      getUnreadNotifications,
      getAllNotifications,
      getSellerBeats,
      getSellerPurchases,
      getBuyerPurchases,
      getPurchasedBeat,
    }}>


      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
