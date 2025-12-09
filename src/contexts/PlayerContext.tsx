import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';
import { Beat } from '@/types';
import { useAuth } from './AuthContext';
import { useData } from './DataContext';

interface PlayerContextType {
  currentBeat: Beat | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  queue: Beat[];
  play: (beat: Beat) => void;
  pause: () => void;
  toggle: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  next: () => void;
  previous: () => void;
  addToQueue: (beat: Beat) => void;
  clearQueue: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { incrementPlays } = useData();
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentBeat, setCurrentBeat] = useState<Beat | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.7);
  const [queue, setQueue] = useState<Beat[]>([]);
  const [hasCountedPlay, setHasCountedPlay] = useState(false);

  // Stop playback when user logs out
  useEffect(() => {
    if (!user) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      setCurrentBeat(null);
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      setQueue([]);
    }
  }, [user]);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = volume;

    const audio = audioRef.current;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (queue.length > 0) {
        const nextBeat = queue[0];
        setQueue(prev => prev.slice(1));
        play(nextBeat);
      } else {
        setIsPlaying(false);
        setCurrentTime(0);
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, []);

  // Count play after 30 seconds
  useEffect(() => {
    if (currentBeat && currentTime >= 30 && !hasCountedPlay) {
      incrementPlays(currentBeat.id);
      setHasCountedPlay(true);
    }
  }, [currentTime, currentBeat, hasCountedPlay, incrementPlays]);

  const play = (beat: Beat) => {
    if (!user || !audioRef.current) return;

    if (currentBeat?.id !== beat.id) {
      audioRef.current.src = beat.audioUrl;
      setCurrentBeat(beat);
      setHasCountedPlay(false);
    }
    
    audioRef.current.play();
    setIsPlaying(true);
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggle = () => {
    if (isPlaying) {
      pause();
    } else if (currentBeat) {
      audioRef.current?.play();
      setIsPlaying(true);
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const setVolume = (newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setVolumeState(newVolume);
    }
  };

  const next = () => {
    if (queue.length > 0) {
      const nextBeat = queue[0];
      setQueue(prev => prev.slice(1));
      play(nextBeat);
    }
  };

  const previous = () => {
    if (audioRef.current && currentTime > 3) {
      seek(0);
    }
  };

  const addToQueue = (beat: Beat) => {
    setQueue(prev => [...prev, beat]);
  };

  const clearQueue = () => {
    setQueue([]);
  };

  return (
    <PlayerContext.Provider value={{
      currentBeat,
      isPlaying,
      currentTime,
      duration,
      volume,
      queue,
      play,
      pause,
      toggle,
      seek,
      setVolume,
      next,
      previous,
      addToQueue,
      clearQueue,
    }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}
