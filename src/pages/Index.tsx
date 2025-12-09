import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { BeatCard } from '@/components/beats/BeatCard';
import { NewsCard } from '@/components/news/NewsCard';
import { Button } from '@/components/ui/button';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Music, ArrowRight, Headphones, TrendingUp, Users, Sparkles } from 'lucide-react';

export default function Index() {
  const { beats, news } = useData();
  const { user } = useAuth();

  const featuredBeats = beats.slice(0, 4);
  const latestNews = news.slice(0, 3);
  const topBeat = news[0];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative w-full px-6 py-20 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-[100px] animate-float" style={{ animationDelay: '-3s' }} />
        </div>

        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm">Маркетплейс музыкальных битов</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 animate-slide-up">
            Найди свой{' '}
            <span className="gradient-text">идеальный</span>
            <br />
            звук
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Тысячи профессиональных битов от лучших продюсеров. 
            Слушайте, выбирайте и создавайте хиты.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link to="/beats">
              <Button variant="gradient" size="xl" className="gap-2">
                <Headphones className="w-5 h-5" />
                Слушать биты
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            {!user && (
              <Link to="/register">
                <Button variant="outline" size="xl">
                  Создать аккаунт
                </Button>
              </Link>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-16 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-display font-bold gradient-text">{beats.length}+</div>
              <div className="text-sm text-muted-foreground mt-1">Битов</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-display font-bold gradient-text">50+</div>
              <div className="text-sm text-muted-foreground mt-1">Продюсеров</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-display font-bold gradient-text">1K+</div>
              <div className="text-sm text-muted-foreground mt-1">Покупок</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Beats */}
      <section className="w-full px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">Популярные биты</h2>
              <p className="text-muted-foreground">Самые востребованные треки на платформе</p>
            </div>
            <Link to="/beats">
              <Button variant="ghost" className="gap-2">
                Все биты
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredBeats.map((beat, index) => (
              <div key={beat.id} style={{ animationDelay: `${index * 0.1}s` }}>
                <BeatCard beat={beat} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="w-full px-6 py-16 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">Почему BeatMarket?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Мы создали удобную платформу для покупки и продажи музыки
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card rounded-2xl p-8 text-center hover:border-primary/30 transition-all duration-300">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl gradient-primary flex items-center justify-center glow-sm">
                <Music className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-3">Качественные биты</h3>
              <p className="text-muted-foreground">
                Все биты проходят модерацию и соответствуют профессиональным стандартам
              </p>
            </div>

            <div className="glass-card rounded-2xl p-8 text-center hover:border-primary/30 transition-all duration-300">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl gradient-primary flex items-center justify-center glow-sm">
                <TrendingUp className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-3">Выгодные цены</h3>
              <p className="text-muted-foreground">
                Прямые продажи от продюсеров без посредников и комиссий
              </p>
            </div>

            <div className="glass-card rounded-2xl p-8 text-center hover:border-primary/30 transition-all duration-300">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl gradient-primary flex items-center justify-center glow-sm">
                <Users className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-3">Сообщество</h3>
              <p className="text-muted-foreground">
                Присоединяйтесь к тысячам артистов и продюсеров
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="w-full px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">Новости</h2>
              <p className="text-muted-foreground">Последние обновления и статьи</p>
            </div>
            <Link to="/news">
              <Button variant="ghost" className="gap-2">
                Все новости
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Featured news */}
          {topBeat && (
            <div className="mb-8">
              <NewsCard news={topBeat} size="large" />
            </div>
          )}

          {/* Grid news */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestNews.slice(1).map((item) => (
              <NewsCard key={item.id} news={item} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="w-full px-6 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="glass-card rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[80px]" />
              </div>
              
              <div className="relative">
                <h2 className="text-2xl md:text-4xl font-display font-bold mb-4">
                  Готовы начать?
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                  Присоединяйтесь к BeatMarket сегодня и откройте для себя мир качественной музыки
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link to="/register">
                    <Button variant="gradient" size="lg">
                      Создать аккаунт
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline" size="lg">
                      Войти
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="w-full px-6 py-8 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Music className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold">BeatMarket</span>
          </div>
          
          <p className="text-sm text-muted-foreground">
            © 2024 BeatMarket. Курсовой проект.
          </p>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/beats" className="hover:text-foreground transition-colors">Биты</Link>
            <Link to="/news" className="hover:text-foreground transition-colors">Новости</Link>
            <Link to="/login" className="hover:text-foreground transition-colors">Вход</Link>
          </div>
        </div>
      </footer>
    </Layout>
  );
}
