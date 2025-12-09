import { ReactNode } from 'react';
import { Header } from './Header';
import { Player } from './Player';
import { useAuth } from '@/contexts/AuthContext';
import { usePlayer } from '@/contexts/PlayerContext';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user } = useAuth();
  const { currentBeat } = usePlayer();
  
  const hasPlayer = user && currentBeat;

  return (
    <div className="min-h-screen w-full bg-background">
      <Header />
      <main className={`pt-16 ${hasPlayer ? 'pb-28' : ''} w-full`}>
        {children}
      </main>
      <Player />
    </div>
  );
}
