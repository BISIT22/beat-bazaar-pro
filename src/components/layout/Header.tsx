import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { ShoppingCart, User, LogOut, Music, Settings, Heart } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import GlassSurface from '@/components/ui/glass-surface';

export function Header() {
  const { user, logout } = useAuth();
  const { cart, favorites } = useData();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const userFavorites = user ? favorites.filter(f => f.userId === user.id) : [];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 pointer-events-none">
      <div className="w-full max-w-6xl h-16 pointer-events-auto">
        <GlassSurface
          width="100%"
          height="100%"
          borderRadius={999}
          borderWidth={0.08}
          brightness={62}
          opacity={0.9}
          blur={14}
          displace={8}
          backgroundOpacity={0.12}
          saturation={1.35}
          distortionScale={-140}
          redOffset={6}
          greenOffset={12}
          blueOffset={20}
          mixBlendMode="screen"
          className="flex h-full w-full items-center gap-6 rounded-full border border-border/60 px-6 shadow-lg shadow-primary/10"
        >
          <div className="flex items-center gap-10 min-w-0">
            <Link to="/" className="flex items-center gap-3 group shrink-0">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center glow-sm group-hover:scale-105 transition-transform">
                <Music className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-display font-bold gradient-text">BeatMarket</span>
            </Link>

            {user && (
              <nav className="hidden md:flex items-center gap-8">
                <Link
                  to="/beats"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Биты
                </Link>
                <Link
                  to="/news"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Новости
                </Link>
                {user.role === 'seller' && (
                  <Link
                    to="/upload"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Загрузить бит
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Админ-панель
                  </Link>
                )}
              </nav>
            )}
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-3 shrink-0">
            {user ? (
              <>
                <Link to="/favorites" className="relative">
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                    <Heart className="w-5 h-5" />
                    {userFavorites.length > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center gradient-primary text-xs">
                        {userFavorites.length}
                      </Badge>
                    )}
                  </Button>
                </Link>

                {user.role === 'buyer' && (
                  <Link to="/cart" className="relative">
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                      <ShoppingCart className="w-5 h-5" />
                      {cart.length > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center gradient-primary text-xs">
                          {cart.length}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-2">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                      <span className="hidden sm:inline text-sm">{user.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 glass-card">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                      <div className="mt-2 flex gap-3 text-xs">
                        <span className="text-success">₽{user.walletRub.toLocaleString()}</span>
                        <span className="text-primary">${user.walletUsd.toLocaleString()}</span>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <User className="w-4 h-4 mr-2" />
                        Профиль
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="cursor-pointer">
                        <Settings className="w-4 h-4 mr-2" />
                        Настройки
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                      <LogOut className="w-4 h-4 mr-2" />
                      Выйти
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="ghost">Войти</Button>
                </Link>
                <Link to="/register">
                  <Button variant="gradient">Регистрация</Button>
                </Link>
              </div>
            )}
          </div>
        </GlassSurface>
      </div>
    </header>
  );
}
