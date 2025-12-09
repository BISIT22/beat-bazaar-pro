import { Layout } from '@/components/layout/Layout';
import { NewsCard } from '@/components/news/NewsCard';
import { useData } from '@/contexts/DataContext';
import { Newspaper } from 'lucide-react';

export default function News() {
  const { news } = useData();

  const featuredNews = news[0];
  const otherNews = news.slice(1);

  return (
    <Layout>
      <div className="w-full px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Новости</h1>
            <p className="text-muted-foreground">
              Последние новости и обновления платформы
            </p>
          </div>

          {news.length > 0 ? (
            <>
              {/* Featured news */}
              {featuredNews && (
                <div className="mb-8">
                  <NewsCard news={featuredNews} size="large" />
                </div>
              )}

              {/* News grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherNews.map((item, index) => (
                  <div key={item.id} style={{ animationDelay: `${index * 0.1}s` }}>
                    <NewsCard news={item} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
                <Newspaper className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-2">Новостей пока нет</h3>
              <p className="text-muted-foreground">
                Скоро здесь появятся свежие новости
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
