import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Music, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { UserRole } from '@/types';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('buyer');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      setIsLoading(false);
      return;
    }

    const result = await register(email, password, name, role);
    
    if (result.success) {
      toast({
        title: 'Аккаунт создан!',
        description: 'Добро пожаловать на BeatMarket',
      });
      navigate('/');
    } else {
      setError(result.error || 'Ошибка регистрации');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center glow group-hover:scale-105 transition-transform">
              <Music className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-display font-bold gradient-text">BeatMarket</span>
          </Link>
        </div>

        {/* Form Card */}
        <div className="glass-card rounded-2xl p-8 animate-slide-up">
          <h1 className="text-2xl font-display font-bold text-center mb-2">Регистрация</h1>
          <p className="text-muted-foreground text-center mb-8">
            Создайте аккаунт, чтобы начать
          </p>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive mb-6">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Имя</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Ваше имя"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Минимум 6 символов"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label>Выберите роль</Label>
              <RadioGroup value={role} onValueChange={(value) => setRole(value as UserRole)}>
                <div className="grid grid-cols-2 gap-4">
                  <label
                    htmlFor="buyer"
                    className={`glass rounded-xl p-4 cursor-pointer transition-all ${
                      role === 'buyer' ? 'border-primary glow-sm' : 'hover:border-primary/50'
                    }`}
                  >
                    <RadioGroupItem value="buyer" id="buyer" className="sr-only" />
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-primary/20 flex items-center justify-center">
                        <User className="w-6 h-6 text-primary" />
                      </div>
                      <p className="font-medium">Покупатель</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Покупайте биты для своих треков
                      </p>
                    </div>
                  </label>
                  
                  <label
                    htmlFor="seller"
                    className={`glass rounded-xl p-4 cursor-pointer transition-all ${
                      role === 'seller' ? 'border-primary glow-sm' : 'hover:border-primary/50'
                    }`}
                  >
                    <RadioGroupItem value="seller" id="seller" className="sr-only" />
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-accent/20 flex items-center justify-center">
                        <Music className="w-6 h-6 text-accent" />
                      </div>
                      <p className="font-medium">Продавец</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Продавайте свои биты
                      </p>
                    </div>
                  </label>
                </div>
              </RadioGroup>
            </div>

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Создание...' : 'Создать аккаунт'}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Уже есть аккаунт?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Войти
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
