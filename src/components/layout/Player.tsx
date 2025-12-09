import { usePlayer } from '@/contexts/PlayerContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, ListMusic } from 'lucide-react';
import { cn } from '@/lib/utils';

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function Player() {
  const { user } = useAuth();
  const {
    currentBeat,
    isPlaying,
    currentTime,
    duration,
    volume,
    queue,
    toggle,
    seek,
    setVolume,
    next,
    previous,
  } = usePlayer();

  if (!user || !currentBeat) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/50">
      <div className="w-full px-6 py-3">
        {/* Progress bar */}
        <div className="mb-2">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={1}
            onValueChange={([value]) => seek(value)}
            className="cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          {/* Beat info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-secondary">
              <img
                src={currentBeat.coverUrl}
                alt={currentBeat.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-sm truncate">{currentBeat.title}</p>
              <p className="text-xs text-muted-foreground truncate">{currentBeat.sellerName}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={previous}
              className="text-muted-foreground hover:text-foreground"
            >
              <SkipBack className="w-5 h-5" />
            </Button>
            
            <Button
              variant="gradient"
              size="icon"
              onClick={toggle}
              className="w-12 h-12 rounded-full"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={next}
              disabled={queue.length === 0}
              className="text-muted-foreground hover:text-foreground"
            >
              <SkipForward className="w-5 h-5" />
            </Button>
          </div>

          {/* Time & Volume */}
          <div className="flex items-center gap-4 flex-1 justify-end">
            <span className="text-xs text-muted-foreground tabular-nums">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            <div className="hidden sm:flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setVolume(volume === 0 ? 0.7 : 0)}
                className="text-muted-foreground hover:text-foreground"
              >
                {volume === 0 ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </Button>
              <Slider
                value={[volume * 100]}
                max={100}
                step={1}
                onValueChange={([value]) => setVolume(value / 100)}
                className="w-24"
              />
            </div>

            {queue.length > 0 && (
              <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
                <ListMusic className="w-4 h-4" />
                <span>{queue.length}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
