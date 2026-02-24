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
import { genres, majorKeys, minorKeys } from '@/data/mockData';
import { Upload as UploadIcon, Music, ArrowLeft, Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function Upload() {
  const navigate = useNavigate();
  const { user, getUserById } = useAuth();
  const { addBeat, addCollaboration, getFriends } = useData();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priceRub, setPriceRub] = useState('');
  const [priceUsd, setPriceUsd] = useState('');
  const [currency, setCurrency] = useState<'RUB' | 'USD'>('RUB');
  const [genre, setGenre] = useState('');
  const [tags, setTags] = useState('');
  const [bpm, setBpm] = useState('');
  const [key, setKey] = useState('');
  const [tonalityType, setTonalityType] = useState<'major' | 'minor'>('major');
  const [coverUrl, setCoverUrl] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [wavFile, setWavFile] = useState<File | null>(null);
  const [collaborators, setCollaborators] = useState<string[]>([]);
  const [showCollaborators, setShowCollaborators] = useState(false);

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

  const friends = user ? getFriends(user.id) : [];

  const toggleCollaborator = (collaboratorId: string) => {
    setCollaborators((prev) =>
      prev.includes(collaboratorId)
        ? prev.filter((id) => id !== collaboratorId)
        : [...prev, collaboratorId],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !priceRub || !priceUsd || !genre || !bpm || !key || !audioFile) {
      toast({ title: 'Заполните все поля', variant: 'destructive' });
      return;
    }

    try {
      const result = await addBeat({
        sellerId: user.id,
        sellerName: user.name,
        title,
        description,
        coverUrl: coverUrl || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
        audioFile,
        wavFile,
        priceRub: Number(priceRub),
        priceUsd: Number(priceUsd),
        currency,
        genre,
        tags: tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean),
        bpm: Number(bpm),
        key,
      });

      // Add collaborators if any
      if (collaborators.length > 0) {
        // Include the seller's ID in the collaborators list
        const allCollaborators = [user.id, ...collaborators];
        addCollaboration(result.beatId, allCollaborators);
      }

      toast({ title: 'Бит загружен!', description: title });
      navigate('/profile');
    } catch (error) {
      console.error(error);
      toast({ title: 'Ошибка при сохранении файла', variant: 'destructive' });
    }
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
              <div className="space-y-2">
                <Label>Тональность *</Label>
                <div className="flex gap-2">
                  <Select value={tonalityType} onValueChange={(v: any) => setTonalityType(v as 'major' | 'minor')}>
                    <SelectTrigger className="w-1/3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="major">Major</SelectItem>
                      <SelectItem value="minor">Minor</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={key} onValueChange={setKey}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Выберите" />
                    </SelectTrigger>
                    <SelectContent>
                      {(tonalityType === 'major' ? majorKeys : minorKeys).map(k => (
                        <SelectItem key={k} value={k}>{k}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Теги (через запятую)</Label>
              <Input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="trap, dark, 808"
              />
            </div>
            <div className="space-y-2">
              <Label>URL обложки</Label>
              <Input
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label>Аудио (MP3) *</Label>
              <Input
                type="file"
                accept="audio/mpeg,audio/mp3"
                onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Загрузите MP3-файл, который будет использоваться для прослушивания и скачивания.
              </p>
            </div>
            <div className="space-y-2">
              <Label>Аудио (WAV, опционально)</Label>
              <Input
                type="file"
                accept="audio/wav"
                onChange={(e) => setWavFile(e.target.files?.[0] || null)}
              />
              <p className="text-xs text-muted-foreground">
                Если загрузить WAV, он будет доступен покупателю для скачивания вместе с MP3 после покупки.
              </p>
            </div>

            <div className="space-y-2">
              <Label
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setShowCollaborators(!showCollaborators)}
              >
                <Users className="w-4 h-4" />
                Коллаборации с друзьями
              </Label>
              {showCollaborators && (
                <div className="border rounded-lg p-4 bg-secondary">
                  {friends.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      У вас пока нет друзей. Добавьте пользователей во вкладке «Пользователи», чтобы выбирать их для коллабораций.
                    </p>
                  ) : (
                    <>
                      <p className="text-sm text-muted-foreground mb-3">
                        Выберите друзей, с которыми вы хотите сделать совместный трек.
                      </p>
                      <div className="space-y-2 max-h-48 overflow-auto">
                        {friends.map((relation) => {
                          if (!user) return null;
                          const otherUserId =
                            relation.userId === user.id ? relation.friendId : relation.userId;
                          const friendUser = getUserById(otherUserId);
                          if (!friendUser) return null;

                          const checked = collaborators.includes(friendUser.id);

                          return (
                            <label
                              key={relation.id}
                              className="flex items-center gap-3 p-2 rounded-lg bg-background/40 cursor-pointer hover:bg-background/60"
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleCollaborator(friendUser.id)}
                                className="h-4 w-4"
                              />
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                                  {friendUser.avatar ? (
                                    <img
                                      src={friendUser.avatar}
                                      alt={friendUser.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <Users className="w-4 h-4 text-muted-foreground" />
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-medium truncate">{friendUser.name}</p>
                                  <p className="text-xs text-muted-foreground truncate">
                                    {friendUser.email}
                                  </p>
                                </div>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
        <Button type="submit" variant="gradient" size="lg" className="w-full gap-2"><UploadIcon className="w-5 h-5" />Загрузить бит</Button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
