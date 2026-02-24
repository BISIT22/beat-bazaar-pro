import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { User, Search, UserPlus, UserMinus, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function Users() {
  const { user, users: allUsers } = useAuth();
  const { 
    friends,
    getFriends,
    addFriend,
    removeFriend,
    getCollaborations,
  } = useData();
  
  const [searchQuery, setSearchQuery] = useState('');

  if (!user) {
    return (
      <Layout>
        <div className="w-full px-6 py-20 text-center">
          <h2 className="text-2xl font-display font-bold mb-4">Авторизуйтесь</h2>
          <p className="text-muted-foreground mb-6">Для просмотра списка пользователей необходимо войти в аккаунт</p>
        </div>
      </Layout>
    );
  }

  // Filter users based on search query and exclude current user
  const filteredUsers = allUsers.filter(u => 
    u.id !== user.id && 
    (u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     u.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Get current user's friends
  const currentUserFriends = getFriends(user.id);

  const handleAddFriend = (friendId: string) => {
    if (!user) return;
    
    addFriend(user.id, friendId);
    toast({ 
      title: 'Заявка отправлена', 
      description: 'Заявка в друзья отправлена пользователю', 
    });
  };

  const handleRemoveFriend = (friendId: string) => {
    // Find the friendship record to get the ID
    const friendship = currentUserFriends.find(f => 
      (f.userId === user.id && f.friendId === friendId) || 
      (f.userId === friendId && f.friendId === user.id)
    );
    
    if (friendship) {
      removeFriend(friendship.id);
      toast({ 
        title: 'Удалено из друзей', 
        description: 'Пользователь удален из друзей', 
      });
    }
  };

  return (
    <Layout>
      <div className="w-full px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Пользователи</h1>
            <p className="text-muted-foreground">
              Найдите других пользователей и добавьте их в друзья
            </p>
          </div>

          {/* Search */}
          <div className="glass-card rounded-2xl p-6 mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Поиск по имени или email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Users list */}
          <div className="space-y-4">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((u) => {
                const userFriendship = friends.find(f => 
                  (f.userId === user.id && f.friendId === u.id) ||
                  (f.userId === u.id && f.friendId === user.id)
                );
                const userIsFriend = userFriendship && userFriendship.status === 'accepted';
                const isPendingRequest = userFriendship && userFriendship.status === 'pending';
                const userHasCollaborations = getCollaborations(u.id).length > 0;

                return (
                  <div 
                    key={u.id} 
                    className="glass-card rounded-xl p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                        {u.avatar ? (
                          <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-6 h-6 text-muted-foreground" />
                        )}
                      </div>
                      
                      <div>
                        <p className="font-medium">{u.name}</p>
                        <p className="text-sm text-muted-foreground">{u.email}</p>
                        <div className="flex gap-2 mt-1">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            u.role === 'seller' 
                              ? 'bg-blue-500/20 text-blue-500' 
                              : u.role === 'buyer'
                                ? 'bg-green-500/20 text-green-500'
                                : 'bg-purple-500/20 text-purple-500'
                          }`}>
                            {u.role === 'seller' ? 'Продавец' : u.role === 'buyer' ? 'Покупатель' : 'Админ'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {userIsFriend ? (
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleRemoveFriend(u.id)}
                          className="gap-1"
                        >
                          <UserMinus className="w-4 h-4" />
                          Удалить из друзей
                        </Button>
                      ) : isPendingRequest ? (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          disabled
                          className="gap-1"
                        >
                          <Clock className="w-4 h-4" />
                          Запрос отправлен
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleAddFriend(u.id)}
                          className="gap-1"
                        >
                          <UserPlus className="w-4 h-4" />
                          Добавить в друзья
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
                  <User className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-display font-semibold mb-2">Пользователи не найдены</h3>
                <p className="text-muted-foreground">
                  {searchQuery 
                    ? 'Попробуйте изменить параметры поиска' 
                    : 'Нет доступных пользователей для отображения'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}