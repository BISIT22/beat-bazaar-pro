import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Plus, Trash2, Edit2, Save, X, Newspaper } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function Admin() {
  const { user } = useAuth();
  const { news, addNews, updateNews, deleteNews } = useData();
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('');
  const [author, setAuthor] = useState('');

  if (!user || user.role !== 'admin') {
    return (
      <Layout>
        <div className="w-full px-6 py-20 text-center">
          <h2 className="text-2xl font-display font-bold mb-4">Доступ запрещён</h2>
          <p className="text-muted-foreground mb-6">Админ-панель доступна только администраторам</p>
          <Link to="/"><Button variant="gradient">На главную</Button></Link>
        </div>
      </Layout>
    );
  }

  const resetForm = () => {
    setTitle(''); setDescription(''); setImageUrl(''); setCategory(''); setAuthor('');
    setIsAdding(false); setEditingId(null);
  };

  const handleAdd = () => {
    if (!title || !description) { toast({ title: 'Заполните обязательные поля', variant: 'destructive' }); return; }
    addNews({ title, description, imageUrl: imageUrl || 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=400&fit=crop', category: category || 'Новости', author: author || 'Редакция' });
    toast({ title: 'Новость добавлена' });
    resetForm();
  };

  const handleUpdate = () => {
    if (!editingId) return;
    updateNews(editingId, { title, description, imageUrl, category, author });
    toast({ title: 'Новость обновлена' });
    resetForm();
  };

  const handleEdit = (item: typeof news[0]) => {
    setEditingId(item.id); setTitle(item.title); setDescription(item.description);
    setImageUrl(item.imageUrl); setCategory(item.category); setAuthor(item.author);
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    deleteNews(id);
    toast({ title: 'Новость удалена' });
  };

  return (
    <Layout>
      <div className="w-full px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold">Админ-панель</h1>
              <p className="text-muted-foreground">Управление новостями</p>
            </div>
            <Button onClick={() => { resetForm(); setIsAdding(true); }} variant="gradient" className="gap-2">
              <Plus className="w-4 h-4" />Добавить новость
            </Button>
          </div>

          {(isAdding || editingId) && (
            <div className="glass-card rounded-xl p-6 mb-8 animate-slide-up">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-display font-semibold">{editingId ? 'Редактирование' : 'Новая новость'}</h3>
                <Button variant="ghost" size="icon" onClick={resetForm}><X className="w-4 h-4" /></Button>
              </div>
              <div className="grid gap-4">
                <div><Label>Заголовок *</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
                <div><Label>Описание *</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} /></div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div><Label>Категория</Label><Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Новости" /></div>
                  <div><Label>Автор</Label><Input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Редакция" /></div>
                  <div><Label>URL изображения</Label><Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} /></div>
                </div>
                <Button onClick={editingId ? handleUpdate : handleAdd} variant="gradient" className="gap-2"><Save className="w-4 h-4" />{editingId ? 'Сохранить' : 'Добавить'}</Button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {news.map(item => (
              <div key={item.id} className="glass-card rounded-xl p-4 flex gap-4 items-center">
                <img src={item.imageUrl} alt={item.title} className="w-20 h-14 rounded object-cover" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{item.title}</h4>
                  <p className="text-xs text-muted-foreground">{item.category} • {item.author}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}><Edit2 className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            ))}
            {news.length === 0 && (
              <div className="text-center py-12">
                <Newspaper className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Новостей пока нет</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
