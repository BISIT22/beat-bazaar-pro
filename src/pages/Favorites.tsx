import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { BeatCard } from '@/components/beats/BeatCard';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Heart, ArrowLeft, Music } from 'lucide-react';

export default function Favorites() {
  const { user } = useAuth();
  const { beats, favorites } = useData();

  if (!user) {
    return (
      <Layout>
        <div className="w-full px-6 py-20 text-center">
          <h2 className="text-2xl font-display font-bold mb-4">Авторизуйтесь</h2>
          <p className="text-muted-foreground mb-6">
            Войдите в аккаунт, чтобы просмотреть избранное
          </p>
          <Link to="/login">
            <Button variant="gradient">Войти</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const userFavorites = favorites.filter(f => f.userId === user.id);
  const favoriteBeats = userFavorites
    .map(f => beats.find(b => b.id === f.beatId))
    .filter(Boolean);

  return (
    <Layout>
      <div className="w-full px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link to="/beats">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-1">Избранное</h1>
              <p className="text-muted-foreground">
                {favoriteBeats.length} {favoriteBeats.length === 1 ? 'бит' : 'битов'} в избранном
              </p>
            </div>
          </div>

          {/* Beats grid */}
          {favoriteBeats.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favoriteBeats.map((beat, index) => (
                beat && (
                  <div key={beat.id} style={{ animationDelay: `${index * 0.05}s` }}>
                    <BeatCard beat={beat} />
                  </div>
                )
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
                <Heart className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-2">Избранное пусто</h3>
              <p className="text-muted-foreground mb-6">
                Добавляйте биты в избранное, нажимая на сердечко
              </p>
              <Link to="/beats">
                <Button variant="gradient" className="gap-2">
                  <Music className="w-4 h-4" />
                  Перейти к битам
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
