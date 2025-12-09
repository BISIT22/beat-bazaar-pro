import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { User, Wallet, Music, ShoppingBag, Edit2, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const { getSellerBeats, getSellerPurchases, getBuyerPurchases, beats } = useData();
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  if (!user) {
    return (
      <Layout>
        <div className="w-full px-6 py-20 text-center">
          <h2 className="text-2xl font-display font-bold mb-4">Авторизуйтесь</h2>
          <Link to="/login"><Button variant="gradient">Войти</Button></Link>
        </div>
      </Layout>
    );
  }

  const sellerBeats = user.role === 'seller' ? getSellerBeats(user.id) : [];
  const sellerPurchases = user.role === 'seller' ? getSellerPurchases(user.id) : [];
  const buyerPurchases = user.role === 'buyer' ? getBuyerPurchases(user.id) : [];

  const totalEarnedRub = sellerPurchases.filter(p => p.currency === 'RUB').reduce((sum, p) => sum + p.priceRub, 0);
  const totalEarnedUsd = sellerPurchases.filter(p => p.currency === 'USD').reduce((sum, p) => sum + p.priceUsd, 0);
  const totalSpentRub = buyerPurchases.filter(p => p.currency === 'RUB').reduce((sum, p) => sum + p.priceRub, 0);
  const totalSpentUsd = buyerPurchases.filter(p => p.currency === 'USD').reduce((sum, p) => sum + p.priceUsd, 0);

  const handleSave = () => {
    updateUser({ name, bio, avatar });
    setIsEditing(false);
    toast({ title: 'Профиль обновлён' });
  };

  return (
    <Layout>
      <div className="w-full px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="glass-card rounded-2xl p-8 mb-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center overflow-hidden flex-shrink-0">
                {avatar ? <img src={avatar} alt={name} className="w-full h-full object-cover" /> : <User className="w-12 h-12 text-muted-foreground" />}
              </div>
              
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <div><Label>Имя</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
                    <div><Label>Аватар (URL)</Label><Input value={avatar} onChange={(e) => setAvatar(e.target.value)} placeholder="https://..." /></div>
                    <div><Label>О себе</Label><Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} /></div>
                    <Button onClick={handleSave} variant="gradient" className="gap-2"><Save className="w-4 h-4" />Сохранить</Button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-2xl font-display font-bold">{user.name}</h1>
                      <span className="px-2 py-1 rounded-full text-xs bg-primary/20 text-primary capitalize">
                        {user.role === 'seller' ? 'Продавец' : user.role === 'buyer' ? 'Покупатель' : 'Админ'}
                      </span>
                    </div>
                    <p className="text-muted-foreground mb-4">{user.bio || 'Нет описания'}</p>
                    <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="gap-2"><Edit2 className="w-4 h-4" />Редактировать</Button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="glass-card rounded-xl p-4 text-center">
              <Wallet className="w-6 h-6 mx-auto mb-2 text-success" />
              <p className="text-2xl font-bold">₽{user.walletRub.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Баланс (₽)</p>
            </div>
            <div className="glass-card rounded-xl p-4 text-center">
              <Wallet className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">${user.walletUsd.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Баланс ($)</p>
            </div>
            {user.role === 'seller' ? (
              <>
                <div className="glass-card rounded-xl p-4 text-center">
                  <Music className="w-6 h-6 mx-auto mb-2 text-accent" />
                  <p className="text-2xl font-bold">{sellerBeats.length}</p>
                  <p className="text-xs text-muted-foreground">Загружено</p>
                </div>
                <div className="glass-card rounded-xl p-4 text-center">
                  <ShoppingBag className="w-6 h-6 mx-auto mb-2 text-warning" />
                  <p className="text-2xl font-bold">{sellerPurchases.length}</p>
                  <p className="text-xs text-muted-foreground">Продано</p>
                </div>
              </>
            ) : (
              <>
                <div className="glass-card rounded-xl p-4 text-center">
                  <ShoppingBag className="w-6 h-6 mx-auto mb-2 text-accent" />
                  <p className="text-2xl font-bold">{buyerPurchases.length}</p>
                  <p className="text-xs text-muted-foreground">Куплено</p>
                </div>
                <div className="glass-card rounded-xl p-4 text-center">
                  <p className="text-lg font-bold">₽{totalSpentRub} / ${totalSpentUsd}</p>
                  <p className="text-xs text-muted-foreground">Потрачено</p>
                </div>
              </>
            )}
          </div>

          {/* Content */}
          {user.role === 'seller' && (
            <div className="glass-card rounded-xl p-6">
              <h2 className="text-xl font-display font-bold mb-4">Мои биты</h2>
              {sellerBeats.length > 0 ? (
                <div className="space-y-3">
                  {sellerBeats.map(beat => (
                    <div key={beat.id} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50">
                      <img src={beat.coverUrl} alt={beat.title} className="w-12 h-12 rounded object-cover" />
                      <div className="flex-1"><p className="font-medium">{beat.title}</p><p className="text-xs text-muted-foreground">{beat.salesCount} продаж</p></div>
                      <span className="text-sm font-medium">₽{beat.priceRub}</span>
                    </div>
                  ))}
                </div>
              ) : <p className="text-muted-foreground">Вы ещё не загрузили биты</p>}
            </div>
          )}

          {user.role === 'buyer' && (
            <div className="glass-card rounded-xl p-6">
              <h2 className="text-xl font-display font-bold mb-4">Мои покупки</h2>
              {buyerPurchases.length > 0 ? (
                <div className="space-y-3">
                  {buyerPurchases.map(purchase => {
                    const beat = beats.find(b => b.id === purchase.beatId);
                    return beat ? (
                      <div key={purchase.id} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50">
                        <img src={beat.coverUrl} alt={beat.title} className="w-12 h-12 rounded object-cover" />
                        <div className="flex-1"><p className="font-medium">{beat.title}</p><p className="text-xs text-muted-foreground">{beat.sellerName}</p></div>
                        <span className="text-sm">{purchase.currency === 'RUB' ? `₽${purchase.priceRub}` : `$${purchase.priceUsd}`}</span>
                      </div>
                    ) : null;
                  })}
                </div>
              ) : <p className="text-muted-foreground">Вы ещё не купили биты</p>}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
