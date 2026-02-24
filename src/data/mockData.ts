import { User, Beat, NewsItem, Purchase, FavoriteItem, Rating } from '@/types';

// Demo users
export const initialUsers: User[] = [
  {
    id: 'admin-1',
    email: 'admin@beatmarket.ru',
    password: 'admin123',
    role: 'admin',
    name: 'Администратор',
    avatar: '',
    bio: 'Администратор платформы BeatMarket',
    walletRub: 100000,
    walletUsd: 1000,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'seller-1',
    email: 'producer@beatmarket.ru',
    password: 'seller123',
    role: 'seller',
    name: 'DJ Producer',
    avatar: '',
    bio: 'Профессиональный битмейкер с 5-летним опытом. Создаю биты в стилях Trap, Hip-Hop, R&B.',
    walletRub: 50000,
    walletUsd: 500,
    createdAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'seller-2',
    email: 'soundwave@beatmarket.ru',
    password: 'seller123',
    role: 'seller',
    name: 'SoundWave',
    avatar: '',
    bio: 'Электронная музыка и эксперименты со звуком.',
    walletRub: 25000,
    walletUsd: 250,
    createdAt: '2024-02-01T00:00:00Z',
  },
  {
    id: 'buyer-1',
    email: 'artist@beatmarket.ru',
    password: 'buyer123',
    role: 'buyer',
    name: 'Young Artist',
    avatar: '',
    bio: 'Начинающий рэпер в поисках уникального звучания.',
    walletRub: 10000,
    walletUsd: 150,
    createdAt: '2024-02-15T00:00:00Z',
  },
];

// Пустой список для старта: реальные биты грузятся из /public/audio/manifest.json или localStorage
export const initialBeats: Beat[] = [];

// Demo news
export const initialNews: NewsItem[] = [
  {
    id: 'news-1',
    title: 'Новая эра битмейкинга: тренды 2024',
    description: 'Обзор главных тенденций в мире продакшена. AI-инструменты, новые жанры и изменения в индустрии.',
    text: 'Обзор главных тенденций в мире продакшена. AI-инструменты, новые жанры и изменения в индустрии. Полная версия статьи доступна внутри карточки.',
    imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=400&fit=crop',
    category: 'Тренды',
    author: 'Редакция BeatMarket',
    createdAt: '2024-03-28T00:00:00Z',
  },
  {
    id: 'news-2',
    title: 'Топ-10 продюсеров месяца',
    description: 'Рейтинг самых продаваемых битмейкеров на платформе. Узнайте, кто создаёт хиты!',
    text: 'Рейтинг самых продаваемых битмейкеров на платформе. Узнайте, кто создаёт хиты! Полные детали рейтинга доступны при раскрытии карточки.',
    imageUrl: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&h=400&fit=crop',
    category: 'Рейтинг',
    author: 'Редакция BeatMarket',
    createdAt: '2024-03-25T00:00:00Z',
  },
  {
    id: 'news-3',
    title: 'Как продать свой первый бит',
    description: 'Полное руководство для начинающих продюсеров. От создания до продажи.',
    text: 'Полное руководство для начинающих продюсеров. От создания до продажи. Внутри карточки — более детальные шаги и советы.',
    imageUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&h=400&fit=crop',
    category: 'Гайд',
    author: 'DJ Producer',
    createdAt: '2024-03-20T00:00:00Z',
  },
  {
    id: 'news-4',
    title: 'Обновление платформы: новые функции',
    description: 'Рейтинги, избранное и улучшенный поиск теперь доступны всем пользователям.',
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=400&fit=crop',
    category: 'Новости',
    author: 'Редакция BeatMarket',
    createdAt: '2024-03-15T00:00:00Z',
  },
];

export const initialPurchases: Purchase[] = [];
export const initialFavorites: FavoriteItem[] = [];
export const initialRatings: Rating[] = [];
export const initialFriends: Friend[] = [];
export const initialCollaborations: Collaboration[] = [];
export const initialNotifications: Notification[] = [];

// Genres list
export const genres = [
  'Trap',
  'Hip-Hop',
  'R&B',
  'Pop',
  'Electronic',
  'Lo-Fi',
  'Drill',
  'Reggaeton',
  'Afrobeat',
  'Rock',
];

// Tags list
export const popularTags = [
  'dark',
  'melodic',
  'hard',
  'chill',
  'emotional',
  'aggressive',
  'summer',
  'oldschool',
  '808',
  'sample',
  'guitar',
  'piano',
  'synth',
  'minimal',
  'ambient',
];

// Musical keys
export const majorKeys = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
];

export const minorKeys = [
  'Cm', 'C#m', 'Dm', 'D#m', 'Em', 'Fm', 'F#m', 'Gm', 'G#m', 'Am', 'A#m', 'Bm'
];

export const musicalKeys = [
  'C', 'Cm', 'C#', 'C#m',
  'D', 'Dm', 'D#', 'D#m',
  'E', 'Em',
  'F', 'Fm', 'F#', 'F#m',
  'G', 'Gm', 'G#', 'G#m',
  'A', 'Am', 'A#', 'A#m',
  'B', 'Bm',
];
