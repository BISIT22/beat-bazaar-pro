import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { User, Save, ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function Settings() {
  const navigate = useNavigate();
  const { user, updateUser, updateUserWallet } = useAuth();
  const { getSellerBeats, getSellerPurchases, getBuyerPurchases, beats, deleteBeat, updateBeat } = useData();
  
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
    toast({ title: 'Профиль обновлён' });
  };

  return (
    <Layout>
      <div className="w-full px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/profile"><Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button></Link>
            <div>
              <h1 className="text-3xl font-display font-bold">Настройки профиля</h1>
              <p className="text-muted-foreground">Измените информацию вашего профиля</p>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-8 space-y-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center overflow-hidden flex-shrink-0">
                {avatar ? <img src={avatar} alt={name} className="w-full h-full object-cover" /> : <User className="w-12 h-12 text-muted-foreground" />}
              </div>
              
              <div className="flex-1">
                <div className="space-y-4">
                  <div>
                    <Label>Имя</Label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div>
                    <Label>Аватар (URL)</Label>
                    <Input value={avatar} onChange={(e) => setAvatar(e.target.value)} placeholder="https://..." />
                  </div>
                  <div>
                    <Label>О себе</Label>
                    <Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} />
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={handleSave} variant="gradient" className="gap-2">
                      <Save className="w-4 h-4" />Сохранить изменения
                    </Button>
                    <Button onClick={() => navigate(-1)} variant="outline">
                      Отмена
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}