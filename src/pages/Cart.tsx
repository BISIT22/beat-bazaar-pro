import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { ShoppingCart, Trash2, ArrowLeft, Music, CreditCard } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Cart() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, removeFromCart, purchaseCart, clearCart } = useData();
  
  const [currency, setCurrency] = useState<'RUB' | 'USD'>('RUB');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!user) {
    return (
      <Layout>
        <div className="w-full px-6 py-20 text-center">
          <h2 className="text-2xl font-display font-bold mb-4">Авторизуйтесь</h2>
          <p className="text-muted-foreground mb-6">
            Войдите в аккаунт, чтобы просмотреть корзину
          </p>
          <Link to="/login">
            <Button variant="gradient">Войти</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  if (user.role !== 'buyer') {
    return (
      <Layout>
        <div className="w-full px-6 py-20 text-center">
          <h2 className="text-2xl font-display font-bold mb-4">Недоступно</h2>
          <p className="text-muted-foreground mb-6">
            Корзина доступна только для покупателей
          </p>
          <Link to="/beats">
            <Button variant="gradient">К битам</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const totalRub = cart.reduce((sum, item) => sum + item.beat.priceRub, 0);
  const totalUsd = cart.reduce((sum, item) => sum + item.beat.priceUsd, 0);

  const handlePurchase = async () => {
    setIsProcessing(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const result = purchaseCart(currency);
    
    if (result.success) {
      toast({
        title: 'Покупка успешна!',
        description: 'Биты добавлены в ваш профиль',
      });
      navigate('/profile');
    } else {
      toast({
        title: 'Ошибка',
        description: result.error,
        variant: 'destructive',
      });
    }
    
    setIsProcessing(false);
  };

  return (
    <Layout>
      <div className="w-full px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link to="/beats">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-1">Корзина</h1>
              <p className="text-muted-foreground">
                {cart.length} {cart.length === 1 ? 'бит' : 'битов'} в корзине
              </p>
            </div>
          </div>

          {cart.length > 0 ? (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart items */}
              <div className="lg:col-span-2 space-y-4">
                {cart.map(item => (
                  <div key={item.beatId} className="glass-card rounded-xl p-4 flex gap-4 animate-fade-in">
                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.beat.coverUrl}
                        alt={item.beat.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-semibold truncate">{item.beat.title}</h3>
                      <p className="text-sm text-muted-foreground truncate">{item.beat.sellerName}</p>
                      <div className="flex items-center gap-2 mt-2 text-sm">
                        <span className="text-primary font-medium">₽{item.beat.priceRub}</span>
                        <span className="text-muted-foreground">/</span>
                        <span className="text-muted-foreground">${item.beat.priceUsd}</span>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item.beatId)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                ))}

                <Button
                  variant="ghost"
                  onClick={clearCart}
                  className="text-muted-foreground"
                >
                  Очистить корзину
                </Button>
              </div>

              {/* Order summary */}
              <div className="lg:col-span-1">
                <div className="glass-card rounded-xl p-6 sticky top-24">
                  <h3 className="font-display font-semibold text-lg mb-6">Итого</h3>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Количество</span>
                      <span>{cart.length} шт.</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Сумма (₽)</span>
                      <span className="font-medium">₽{totalRub.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Сумма ($)</span>
                      <span className="font-medium">${totalUsd.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4 mb-6">
                    <label className="text-sm text-muted-foreground mb-2 block">
                      Валюта оплаты
                    </label>
                    <Select value={currency} onValueChange={(v) => setCurrency(v as 'RUB' | 'USD')}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="RUB">
                          Рубли (₽{user.walletRub.toLocaleString()})
                        </SelectItem>
                        <SelectItem value="USD">
                          Доллары (${user.walletUsd.toLocaleString()})
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-between items-center mb-6 p-3 rounded-lg bg-secondary">
                    <span className="font-medium">К оплате</span>
                    <span className="text-xl font-display font-bold gradient-text">
                      {currency === 'RUB' ? `₽${totalRub.toLocaleString()}` : `$${totalUsd.toLocaleString()}`}
                    </span>
                  </div>

                  <Button
                    variant="gradient"
                    size="lg"
                    className="w-full gap-2"
                    onClick={handlePurchase}
                    disabled={isProcessing}
                  >
                    <CreditCard className="w-5 h-5" />
                    {isProcessing ? 'Обработка...' : 'Оплатить'}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    Демо-режим: деньги списываются с вашего кошелька
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
                <ShoppingCart className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-2">Корзина пуста</h3>
              <p className="text-muted-foreground mb-6">
                Добавьте биты, чтобы оформить заказ
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
