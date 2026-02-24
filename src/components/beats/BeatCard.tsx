import { Beat } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { usePlayer } from '@/contexts/PlayerContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Heart, ShoppingCart, Star, Music } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface BeatCardProps {
  beat: Beat;
  onPlay?: () => void;
}

export function BeatCard({ beat, onPlay }: BeatCardProps) {
  const { user, getUserById } = useAuth();
  const { addToCart, cart, toggleFavorite, isFavorite, getUserRating, rateBeat, collaborations } = useData();
  const { currentBeat, isPlaying, play, pause } = usePlayer();

  const isCurrentBeat = currentBeat?.id === beat.id;
  const isInCart = cart.some(item => item.beatId === beat.id);
  const isFav = isFavorite(beat.id);
  const userRating = getUserRating(beat.id);

  const beatCollab = collaborations.find(c => c.beatId === beat.id);
  const collaboratorNames = beatCollab
    ? beatCollab.collaborators
        .filter(id => id !== beat.sellerId)
        .map(id => getUserById(id))
        .filter((u): u is NonNullable<ReturnType<typeof getUserById>> => Boolean(u))
        .map(u => u.name)
    : [];

  const handlePlayClick = () => {
    if (!user) {
      toast({
        title: 'Авторизуйтесь',
        description: 'Войдите в аккаунт, чтобы слушать музыку',
        variant: 'destructive',
      });
      return;
    }

    if (isCurrentBeat && isPlaying) {
      pause();
    } else {
      play(beat);
    }
    onPlay?.();
  };

  const handleAddToCart = () => {
    if (!user) {
      toast({
        title: 'Авторизуйтесь',
        description: 'Войдите в аккаунт, чтобы добавить в корзину',
        variant: 'destructive',
      });
      return;
    }

    if (user.role !== 'buyer') {
      toast({
        title: 'Недоступно',
        description: 'Только покупатели могут добавлять биты в корзину',
        variant: 'destructive',
      });
      return;
    }

    addToCart(beat);
    toast({
      title: 'Добавлено в корзину',
      description: beat.title,
    });
  };

  const handleToggleFavorite = () => {
    if (!user) {
      toast({
        title: 'Авторизуйтесь',
        description: 'Войдите в аккаунт, чтобы добавить в избранное',
        variant: 'destructive',
      });
      return;
    }

    toggleFavorite(beat.id);
  };

  const handleRate = (value: number) => {
    if (!user) {
      toast({
        title: 'Авторизуйтесь',
        description: 'Войдите в аккаунт, чтобы ставить оценки',
        variant: 'destructive',
      });
      return;
    }
    if (user.role !== 'buyer') {
      toast({
        title: 'Недоступно',
        description: 'Оценки доступны только покупателям',
        variant: 'destructive',
      });
      return;
    }
    rateBeat(beat.id, value);
    toast({
      title: 'Оценка сохранена',
      description: `Вы поставили ${value} из 5`,
    });
  };

  return (
    <div className="group glass-card rounded-xl overflow-hidden hover:border-primary/30 transition-all duration-300 animate-fade-in">
      {/* Cover */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={beat.coverUrl}
          alt={beat.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Play button */}
        <button
          onClick={handlePlayClick}
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-all duration-300",
            "opacity-0 group-hover:opacity-100",
            isCurrentBeat && isPlaying && "opacity-100"
          )}
        >
          <div className={cn(
            "w-14 h-14 rounded-full gradient-primary flex items-center justify-center glow transition-transform",
            "hover:scale-110"
          )}>
            {isCurrentBeat && isPlaying ? (
              <Pause className="w-6 h-6 text-primary-foreground" />
            ) : (
              <Play className="w-6 h-6 text-primary-foreground ml-1" />
            )}
          </div>
        </button>

        {/* Favorite button */}
        <button
          onClick={handleToggleFavorite}
          className={cn(
            "absolute top-3 right-3 p-2 rounded-full transition-all duration-300",
            "bg-background/50 backdrop-blur-sm hover:bg-background/70",
            isFav ? "text-accent" : "text-foreground opacity-0 group-hover:opacity-100"
          )}
        >
          <Heart className={cn("w-5 h-5", isFav && "fill-current")} />
        </button>

        {/* Genre badge */}
        <Badge className="absolute top-3 left-3 bg-background/50 backdrop-blur-sm text-foreground border-0">
          {beat.genre}
        </Badge>
      </div>

      {/* Info */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-display font-semibold text-lg truncate group-hover:text-primary transition-colors">
            {beat.title}
          </h3>
          <p className="text-sm text-muted-foreground truncate">{beat.sellerName}</p>
          {collaboratorNames.length > 0 && (
            <p className="text-xs text-accent mt-0.5 truncate">
              Коллаборация с {collaboratorNames.join(', ')}
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-warning fill-warning" />
            <span>{beat.rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Music className="w-3.5 h-3.5" />
            <span>{beat.plays}</span>
          </div>
          <span>{beat.bpm} BPM</span>
          <span>{beat.key}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {beat.tags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">
              #{tag}
            </Badge>
          ))}
        </div>

        {/* Rating */}
        <div className="flex items-center justify-between border border-border/60 rounded-lg px-3 py-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Star className="w-4 h-4 text-warning fill-warning" />
            <span className="font-medium text-foreground">{beat.rating.toFixed(1)}</span>
            <span className="text-xs">({beat.ratingCount})</span>
          </div>
          {user?.role === 'buyer' && (
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => handleRate(value)}
                  className="p-1"
                  title={`Поставить ${value}`}
                >
                  <Star
                    className={cn(
                      "w-4 h-4",
                      (userRating ?? 0) >= value ? "text-warning fill-warning" : "text-muted-foreground"
                    )}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Price & Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex flex-col">
            <span className="text-lg font-bold gradient-text">
              {beat.currency === 'RUB' ? `₽${beat.priceRub}` : `$${beat.priceUsd}`}
            </span>
            <span className="text-xs text-muted-foreground">
              {beat.currency === 'RUB' ? `$${beat.priceUsd}` : `₽${beat.priceRub}`}
            </span>
          </div>

          {user?.role === 'buyer' && (
            <Button
              variant={isInCart ? "secondary" : "gradient"}
              size="sm"
              onClick={handleAddToCart}
              disabled={isInCart}
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              {isInCart ? 'В корзине' : 'Купить'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
