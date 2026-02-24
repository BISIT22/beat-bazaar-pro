import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { User, Wallet, Music, ShoppingBag, Edit2, Save, Plus, Download, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { getAudioObjectUrl, getWavObjectUrl } from '@/lib/audio-store';

export default function Profile() {
  const { user, updateUser, updateUserWallet, getUserById } = useAuth();
  const { getSellerBeats, getSellerPurchases, getBuyerPurchases, beats, deleteBeat, updateBeat, getCollaborations } = useData();
  
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

  const userCollaborations = getCollaborations(user.id);
  const collaborationBeats = userCollaborations
    .map(collab => beats.find(b => b.id === collab.beatId))
    .filter((b): b is typeof beats[number] => Boolean(b));

  const getBeatCollaboratorNames = (beatId: string) => {
    const collab = userCollaborations.find(c => c.beatId === beatId);
    if (!collab) return [];
    return collab.collaborators
      .filter(id => id !== user.id)
      .map(id => getUserById(id))
      .filter((u): u is NonNullable<ReturnType<typeof getUserById>> => Boolean(u))
      .map(u => u.name);
  };

  const totalEarnedRub = sellerPurchases.filter(p => p.currency === 'RUB').reduce((sum, p) => sum + p.priceRub, 0);
  const totalEarnedUsd = sellerPurchases.filter(p => p.currency === 'USD').reduce((sum, p) => sum + p.priceUsd, 0);
  const totalSpentRub = buyerPurchases.filter(p => p.currency === 'RUB').reduce((sum, p) => sum + p.priceRub, 0);
  const totalSpentUsd = buyerPurchases.filter(p => p.currency === 'USD').reduce((sum, p) => sum + p.priceUsd, 0);

  const handleSave = () => {
    const updates: Partial<User> = { name, bio, avatar };
    
    // If the name has changed, update the user and the seller names of their beats
    if (user && user.name !== name) {
      // Get all the user's beats to update their seller names
      const userBeats = getSellerBeats(user.id);
      userBeats.forEach(beat => {
        updateBeat(beat.id, { sellerName: name });
      });
    }
    
    updateUser(updates);
    setIsEditing(false);
    toast({ title: 'Профиль обновлён' });
  };

  const handleDeleteBeat = (beatId: string, title: string) => {
    deleteBeat(beatId);
    toast({ title: 'Бит удалён', description: title });
  };

  const handleTopUp = (currency: 'RUB' | 'USD') => {
    if (!user) return;
    const rubDelta = currency === 'RUB' ? 5000 : 0;
    const usdDelta = currency === 'USD' ? 50 : 0;
    updateUserWallet(user.id, rubDelta, usdDelta);
    toast({
      title: 'Баланс пополнен',
      description: currency === 'RUB' ? `+₽${rubDelta}` : `+$${usdDelta}`,
    });
  };

  const sanitizeFileName = (title: string, ext: string) =>
    `${title.replace(/[^\w\d-_]+/g, '_')}.${ext}`;

  const resolveDownloadUrl = async (beat: typeof beats[number], type: 'mp3' | 'wav') => {
    const url = type === 'mp3' ? beat.audioUrl : beat.wavUrl;
    if (!url) return undefined;

    if (url.startsWith('idb://')) {
      return getAudioObjectUrl(beat.id);
    }
    if (url.startsWith('idb-wav://')) {
      return getWavObjectUrl(beat.id);
    }
    return url;
  };

  const handleDownload = async (beat: typeof beats[number], type: 'mp3' | 'wav') => {
    try {
      const url = await resolveDownloadUrl(beat, type);
      if (!url) {
        toast({ title: 'Файл недоступен', variant: 'destructive' });
        return;
      }

      const a = document.createElement('a');
      a.href = url;
      a.download = sanitizeFileName(beat.title, type);
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      if (url.startsWith('blob:')) {
        setTimeout(() => URL.revokeObjectURL(url), 2000);
      }
    } catch (error) {
      console.error(error);
      toast({ title: 'Ошибка скачивания', variant: 'destructive' });
    }
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
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="glass-card rounded-xl p-4 text-center relative">
              <Wallet className="w-6 h-6 mx-auto mb-2 text-success" />
              <p className="text-2xl font-bold">₽{user.walletRub.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Баланс (₽)</p>
              {user.role === 'buyer' && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-3 right-3 h-8 w-8"
                  onClick={() => handleTopUp('RUB')}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              )}
            </div>
            <div className="glass-card rounded-xl p-4 text-center relative">
              <Wallet className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">${user.walletUsd.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Баланс ($)</p>
              {user.role === 'buyer' && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-3 right-3 h-8 w-8"
                  onClick={() => handleTopUp('USD')}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              )}
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
                  {sellerBeats.map(beat => {
                    const collaboratorNames = getBeatCollaboratorNames(beat.id);
                    return (
                      <div key={beat.id} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50">
                        <img src={beat.coverUrl} alt={beat.title} className="w-12 h-12 rounded object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{beat.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {beat.salesCount} продаж
                          </p>
                          {collaboratorNames.length > 0 && (
                            <p className="text-xs text-accent mt-1 truncate">
                              Коллаборация с {collaboratorNames.join(', ')}
                            </p>
                          )}
                        </div>
                        <span className="text-sm font-medium">₽{beat.priceRub}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteBeat(beat.id, beat.title)}
                          className="text-muted-foreground hover:text-destructive"
                          title="Удалить бит"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground">Вы ещё не загрузили биты</p>
              )}
            </div>
          )}

          {collaborationBeats.length > 0 && (
            <div className="glass-card rounded-xl p-6 mt-6">
              <h2 className="text-xl font-display font-bold mb-4">Коллаборации</h2>
              <div className="space-y-3">
                {collaborationBeats.map(beat => {
                  const collaboratorNames = getBeatCollaboratorNames(beat.id);
                  return (
                    <div key={beat.id} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50">
                      <img src={beat.coverUrl} alt={beat.title} className="w-12 h-12 rounded object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{beat.title}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          Автор: {beat.sellerName}
                        </p>
                        {collaboratorNames.length > 0 && (
                          <p className="text-xs text-accent mt-1 truncate">
                            Коллаборация с {collaboratorNames.join(', ')}
                          </p>
                        )}
                      </div>
                      <span className="text-sm font-medium">₽{beat.priceRub}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {user.role === 'buyer' && (
            <div className="glass-card rounded-xl p-6">
              <h2 className="text-xl font-display font-bold mb-4">Мои покупки</h2>
              {buyerPurchases.length > 0 ? (
                <div className="space-y-3">
                  {buyerPurchases.map(purchase => {
                    const beat = beats.find(b => b.id === purchase.beatId);
                    if (!beat) return null;
                    return (
                      <div
                        key={purchase.id}
                        className="flex flex-col md:flex-row md:items-center gap-3 p-3 rounded-lg bg-secondary/50"
                      >
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <img
                            src={beat.coverUrl}
                            alt={beat.title}
                            className="w-12 h-12 rounded object-cover flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-medium truncate">{beat.title}</p>
                            <p className="text-xs text-muted-foreground truncate">{beat.sellerName}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {purchase.currency === 'RUB'
                                ? `Оплачено: ₽${purchase.priceRub}`
                                : `Оплачено: $${purchase.priceUsd}`}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Button size="sm" variant="outline" className="gap-1" onClick={() => handleDownload(beat, 'mp3')}>
                            <Download className="w-4 h-4" />
                            MP3
                          </Button>
                          {beat.wavUrl && (
                            <Button
                              size="sm"
                              variant="secondary"
                              className="gap-1"
                              onClick={() => handleDownload(beat, 'wav')}
                            >
                              <Download className="w-4 h-4" />
                              WAV
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground">Вы ещё не купили биты</p>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
