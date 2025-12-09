import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import LightPillar from '@/components/LightPillar';
import { Button } from '@/components/ui/button';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowRight, Headphones } from 'lucide-react';

export default function Index() {
  const { beats, news, purchases } = useData();
  const { user, users } = useAuth();
  const [expandedNewsId, setExpandedNewsId] = useState<string | null>(null);

  const buyersCount = users.filter((u) => u.role === 'buyer').length;
  const purchasesCount = purchases.length;

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative w-full min-h-screen px-6 py-20 overflow-hidden flex items-center">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <LightPillar
            topColor="#5227FF"
            bottomColor="#FF9FFC"
            intensity={1.0}
            rotationSpeed={0.3}
            glowAmount={0.005}
            pillarWidth={3.0}
            pillarHeight={0.4}
            noiseIntensity={0.5}
            pillarRotation={102}
            interactive={false}
            mixBlendMode="normal"
            className="w-full h-full pointer-events-none"
          />
        </div>

        <div className="relative max-w-6xl mx-auto text-center flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 animate-slide-up text-white">
            Найди свой{' '}
            <span className="gradient-text">идеальный</span>
            <br />
            звук
          </h1>

          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
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
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-16 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-display font-bold text-white">{beats.length}+</div>
              <div className="text-sm text-white/80 mt-1">Битов</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-display font-bold text-white">{buyersCount}+</div>
              <div className="text-sm text-white/80 mt-1">Покупателей</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-display font-bold text-white">{purchasesCount}+</div>
              <div className="text-sm text-white/80 mt-1">Покупок</div>
            </div>
          </div>

          <div className="mt-12 max-w-4xl mx-auto grid gap-4 sm:grid-cols-3">
            <Link to="/beats" className="block">
              <div className="glass-card rounded-2xl p-4 flex items-center justify-between hover:border-primary/30 transition-all">
                <div>
                  <p className="text-sm text-white/80">Перейти</p>
                  <h3 className="text-lg font-display font-semibold text-white">Популярные биты</h3>
                </div>
                <ArrowRight className="w-5 h-5 text-primary" />
              </div>
            </Link>
            <Link to="/beats" className="block">
              <div className="glass-card rounded-2xl p-4 flex items-center justify-between hover:border-primary/30 transition-all">
                <div>
                  <p className="text-sm text-white/80">Узнать</p>
                  <h3 className="text-lg font-display font-semibold text-white">Почему BeatMarket?</h3>
                </div>
                <ArrowRight className="w-5 h-5 text-primary" />
              </div>
            </Link>
            <Link to="/news" className="block">
              <div className="glass-card rounded-2xl p-4 flex items-center justify-between hover:border-primary/30 transition-all">
                <div>
                  <p className="text-sm text-white/80">Читать</p>
                  <h3 className="text-lg font-display font-semibold text-white">Новости</h3>
                </div>
                <ArrowRight className="w-5 h-5 text-primary" />
              </div>
            </Link>
          </div>

          <div className="mt-10 text-sm text-white/70 text-center w-full">
            © 2025 BeatMarket. Курсовой проект Паненкова Антона, группы Б-ИСиТ-42.
          </div>

        </div>
      </section>
    </Layout>
  );
}
