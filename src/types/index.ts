export type UserRole = 'buyer' | 'seller' | 'admin';

export interface User {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  name: string;
  avatar?: string;
  bio?: string;
  walletRub: number;
  walletUsd: number;
  createdAt: string;
}

export interface Beat {
  id: string;
  sellerId: string;
  sellerName: string;
  title: string;
  description?: string;
  coverUrl: string;
  audioUrl: string;
  wavUrl?: string;
  priceRub: number;
  priceUsd: number;
  currency: 'RUB' | 'USD';
  genre: string;
  tags: string[];
  bpm: number;
  key: string;
  rating: number;
  ratingCount: number;
  salesCount: number;
  plays: number;
  createdAt: string;
}

export interface Purchase {
  id: string;
  beatId: string;
  buyerId: string;
  sellerId: string;
  priceRub: number;
  priceUsd: number;
  currency: 'RUB' | 'USD';
  purchasedAt: string;
}

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  text?: string;
  imageUrl: string;
  category: string;
  author: string;
  createdAt: string;
}

export interface CartItem {
  beatId: string;
  beat: Beat;
  addedAt: string;
}

export interface FavoriteItem {
  beatId: string;
  userId: string;
  addedAt: string;
}

export interface Rating {
  id: string;
  beatId: string;
  userId: string;
  rating: number;
  createdAt: string;
}

export interface Friend {
  id: string;
  userId: string;
  friendId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface Collaboration {
  id: string;
  beatId: string;
  collaborators: string[]; // array of user IDs
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string; // recipient of the notification
  type: 'friend_request' | 'friend_accepted' | 'friend_rejected' | 'collaboration_invite';
  title: string;
  message: string;
  senderId?: string; // who sent the notification
  relatedId?: string; // ID of related entity (friend request ID, etc.)
  isRead: boolean;
  createdAt: string;
}
