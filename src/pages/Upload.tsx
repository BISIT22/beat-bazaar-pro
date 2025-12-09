import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { genres, musicalKeys } from '@/data/mockData';
import { Upload as UploadIcon, Music, ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function Upload() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addBeat } = useData();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priceRub, setPriceRub] = useState('');
  const [priceUsd, setPriceUsd] = useState('');
  const [currency, setCurrency] = useState<'RUB' | 'USD'>('RUB');
  const [genre, setGenre] = useState('');
  const [tags, setTags] = useState('');
  const [bpm, setBpm] = useState('');
  const [key, setKey] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [audioUrl, setAudioUrl] = useState('');

  if (!user || user.role !== 'seller') {
    return (
      <Layout>
        <div className="w-full px-6 py-20 text-center">
          <h2 className="text-2xl font-display font-bold mb-4">Недоступно</h2>
          <p className="text-muted-foreground mb-6">Загрузка битов доступна только продавцам</p>
          <Link to="/"><Button variant="gradient">На главную</Button></Link>
        </div>
      </Layout>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !priceRub || !priceUsd || !genre || !bpm || !key) {
      toast({ title: 'Заполните все поля', variant: 'destructive' });
      return;
    }

    addBeat({
      sellerId: user.id,
      sellerName: user.name,
      title,
      description,
      coverUrl: coverUrl || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
      audioUrl: audioUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      priceRub: Number(priceRub),
      priceUsd: Number(priceUsd),
      currency,
      genre,
      tags: tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean),
      bpm: Number(bpm),
      key,
    });

    toast({ title: 'Бит загружен!', description: title });
    navigate('/profile');
  };

  return (
    <Layout>
      <div className="w-full px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/profile"><Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button></Link>
            <div>
              <h1 className="text-3xl font-display font-bold">Загрузить бит</h1>
              <p className="text-muted-foreground">Заполните информацию о вашем бите</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2"><Label>Название *</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Midnight Trap" required /></div>
              <div className="space-y-2"><Label>Жанр *</Label>
                <Select value={genre} onValueChange={setGenre}><SelectTrigger><SelectValue placeholder="Выберите жанр" /></SelectTrigger>
                  <SelectContent>{genres.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2"><Label>Описание</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Опишите ваш бит..." rows={3} /></div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2"><Label>Цена (₽) *</Label><Input type="number" value={priceRub} onChange={(e) => setPriceRub(e.target.value)} placeholder="2500" required /></div>
              <div className="space-y-2"><Label>Цена ($) *</Label><Input type="number" value={priceUsd} onChange={(e) => setPriceUsd(e.target.value)} placeholder="30" required /></div>
              <div className="space-y-2"><Label>Основная валюта</Label>
                <Select value={currency} onValueChange={(v) => setCurrency(v as 'RUB' | 'USD')}><SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="RUB">Рубли</SelectItem><SelectItem value="USD">Доллары</SelectItem></SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2"><Label>BPM *</Label><Input type="number" value={bpm} onChange={(e) => setBpm(e.target.value)} placeholder="140" required /></div>
              <div className="space-y-2"><Label>Тональность *</Label>
                <Select value={key} onValueChange={setKey}><SelectTrigger><SelectValue placeholder="Выберите" /></SelectTrigger>
                  <SelectContent>{musicalKeys.map(k => <SelectItem key={k} value={k}>{k}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2"><Label>Теги (через запятую)</Label><Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="trap, dark, 808" /></div>
            <div className="space-y-2"><Label>URL обложки</Label><Input value={coverUrl} onChange={(e) => setCoverUrl(e.target.value)} placeholder="https://..." /></div>
            <div className="space-y-2"><Label>URL аудио (MP3)</Label><Input value={audioUrl} onChange={(e) => setAudioUrl(e.target.value)} placeholder="https://..." /></div>

            <Button type="submit" variant="gradient" size="lg" className="w-full gap-2"><UploadIcon className="w-5 h-5" />Загрузить бит</Button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
