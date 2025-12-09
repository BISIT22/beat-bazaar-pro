import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Beat, NewsItem, Purchase, FavoriteItem, Rating, CartItem } from '@/types';
import { initialBeats, initialNews, initialPurchases, initialFavorites, initialRatings } from '@/data/mockData';
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
  addBeat: (beat: NewBeatInput) => Promise<void>;
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

// Биты, которые нужно полностью удалить из системы
const REMOVED_BEAT_IDS: string[] = [];

export function DataProvider({ children }: { children: ReactNode }) {
  const { user, updateUserWallet } = useAuth();
  
  const [beats, setBeats] = useState<Beat[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

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

      setNews(parseSafe(NEWS_KEY, initialNews));
      setPurchases(purchasesData);
      setFavorites(favoritesData);
      setRatings(ratingsData);
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

  return (
    <DataContext.Provider value={{
      beats,
      news,
      purchases,
      favorites,
      ratings,
      cart,
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
