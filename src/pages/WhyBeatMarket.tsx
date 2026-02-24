import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Headphones, ShieldCheck, Sparkles, Users, Wallet } from 'lucide-react';

export default function WhyBeatMarket() {
  return (
    <Layout>
      <div className="w-full px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-primary/80">
              Почему именно BeatMarket
            </p>
            <h1 className="text-3xl md:text-4xl font-display font-bold">
              Маркетплейс битов, который продаёт не файлы — а готовые хиты
            </h1>
            <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
              BeatMarket создан как учебный, но максимально приближенный к реальному
              продюсерскому маркетплейсу проект. Он показывает, как может выглядеть
              удобная платформа для покупки и продажи битов: от первого прослушивания
              до безопасной оплаты и совместных релизов.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-card rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Headphones className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-display font-semibold">Фокус на прослушивании</h2>
              <p className="text-sm text-muted-foreground">
                Современный плеер, плейлисты, счётчик прослушиваний и система рейтингов —
                всё, что нужно, чтобы продюсер мог показать свой материал, а артист быстро
                нашёл «свой» звук.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-emerald-400" />
              </div>
              <h2 className="text-xl font-display font-semibold">Прозрачная экономика</h2>
              <p className="text-sm text-muted-foreground">
                Виртуальный кошелёк, баланс в ₽ и $, история покупок и продаж, автоматическое
                распределение средств между продавцом и покупателем — модель, близкая к
                реальной платформе.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-sky-400" />
              </div>
              <h2 className="text-xl font-display font-semibold">Сообщество и друзья</h2>
              <p className="text-sm text-muted-foreground">
                Система друзей, заявки, уведомления и совместные треки. BeatMarket показывает,
                как можно строить вокруг маркетплейса живое комьюнити продюсеров и артистов.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-violet-400" />
              </div>
              <h2 className="text-xl font-display font-semibold">Коллаборации как стандарт</h2>
              <p className="text-sm text-muted-foreground">
                При загрузке бита можно отметить соавторов из списка друзей. Такой трек
                появляется в профилях всех участников и подчёркивается как коллаборация —
                как в настоящих релизах.
              </p>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 space-y-4">
            <h2 className="text-xl font-display font-semibold">
              Учебный проект с продакшн-подходом
            </h2>
            <p className="text-sm text-muted-foreground">
              BeatMarket разработан как курсовой проект, но архитектура, интерфейс и сценарии
              использования спроектированы так, как если бы это был реальный коммерческий
              сервис. Здесь есть работа с локальным хранилищем, моделирование покупок,
              система ролей (покупатель, продавец, админ), а также полноценный UX для
              поиска и прослушивания битов.
            </p>
            <p className="text-sm text-muted-foreground">
              Страница «Почему BeatMarket?» создана как презентационный лендинг: она помогает
              быстро объяснить идею продукта, его ценность для разных ролей и показать
              уровень проработки проекта.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              Готовы посмотреть, как это работает в действии?
            </div>
            <div className="flex gap-3">
              <Link to="/beats">
                <Button variant="gradient" className="gap-2">
                  <Headphones className="w-4 h-4" />
                  Перейти к битам
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline">
                  Создать аккаунт
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

