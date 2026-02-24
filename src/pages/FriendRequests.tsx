import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { User, Check, X, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function FriendRequests() {
  const { user, getUserById } = useAuth();
  const { 
    friends,
    acceptFriendRequest,
    rejectFriendRequest,
    getFriends,
  } = useData();
  
  const [incomingRequests, setIncomingRequests] = useState<any[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    
    // Filter incoming friend requests (others sent to current user)
    const incoming = friends.filter(f => 
      f.friendId === user.id && f.status === 'pending'
    );
    
    // Filter outgoing friend requests (current user sent to others)
    const outgoing = friends.filter(f => 
      f.userId === user.id && f.status === 'pending'
    );
    
    setIncomingRequests(incoming);
    setOutgoingRequests(outgoing);
  }, [friends, user]);

  const handleAccept = (requestId: string) => {
    acceptFriendRequest(requestId);
    toast({ 
      title: 'Запрос принят', 
      description: 'Вы приняли запрос в друзья', 
    });
  };

  const handleReject = (requestId: string) => {
    rejectFriendRequest(requestId);
    toast({ 
      title: 'Запрос отклонен', 
      description: 'Вы отклонили запрос в друзья', 
    });
  };

  if (!user) {
    return (
      <Layout>
        <div className="w-full px-6 py-20 text-center">
          <h2 className="text-2xl font-display font-bold mb-4">Авторизуйтесь</h2>
          <p className="text-muted-foreground mb-6">Для просмотра друзей и запросов необходимо войти в аккаунт</p>
        </div>
      </Layout>
    );
  }

  const userFriends = getFriends(user.id);

  return (
    <Layout>
      <div className="w-full px-6 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Друзья</h1>
            <p className="text-muted-foreground">
              Входящие и исходящие запросы, а также список ваших друзей
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Incoming Requests */}
            <div className="glass-card rounded-2xl p-6 lg:col-span-1">
              <h2 className="text-xl font-display font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Входящие ({incomingRequests.length})
              </h2>
              
              {incomingRequests.length > 0 ? (
                <div className="space-y-4">
                  {incomingRequests.map((request) => {
                    const sender = getUserById(request.userId);
                    if (!sender) return null;
                    
                    return (
                      <div 
                        key={request.id} 
                        className="glass-card rounded-xl p-4 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                            {sender.avatar ? (
                              <img src={sender.avatar} alt={sender.name} className="w-full h-full object-cover" />
                            ) : (
                              <User className="w-5 h-5 text-muted-foreground" />
                            )}
                          </div>
                          
                          <div>
                            <p className="font-medium">{sender.name}</p>
                            <p className="text-sm text-muted-foreground">{sender.email}</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => handleAccept(request.id)}
                            className="h-8 w-8"
                            title="Принять"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="icon" 
                            onClick={() => handleReject(request.id)}
                            className="h-8 w-8"
                            title="Отклонить"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Нет входящих запросов
                </div>
              )}
            </div>

            {/* Outgoing Requests */}
            <div className="glass-card rounded-2xl p-6 lg:col-span-1">
              <h2 className="text-xl font-display font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Исходящие ({outgoingRequests.length})
              </h2>
              
              {outgoingRequests.length > 0 ? (
                <div className="space-y-4">
                  {outgoingRequests.map((request) => {
                    const receiver = getUserById(request.friendId);
                    if (!receiver) return null;
                    
                    return (
                      <div 
                        key={request.id} 
                        className="glass-card rounded-xl p-4 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                            {receiver.avatar ? (
                              <img src={receiver.avatar} alt={receiver.name} className="w-full h-full object-cover" />
                            ) : (
                              <User className="w-5 h-5 text-muted-foreground" />
                            )}
                          </div>
                          
                          <div>
                            <p className="font-medium">{receiver.name}</p>
                            <p className="text-sm text-muted-foreground">{receiver.email}</p>
                          </div>
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                          Ожидание ответа
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Нет исходящих запросов
                </div>
              )}
            </div>

            {/* Friends list */}
            <div className="glass-card rounded-2xl p-6 lg:col-span-1">
              <h2 className="text-xl font-display font-semibold mb-4">
                Друзья ({userFriends.length})
              </h2>

              {userFriends.length > 0 ? (
                <div className="space-y-3">
                  {userFriends.map(friendRelation => {
                    const otherUserId = friendRelation.userId === user.id
                      ? friendRelation.friendId
                      : friendRelation.userId;
                    const friendUser = getUserById(otherUserId);
                    if (!friendUser) return null;

                    return (
                      <div
                        key={friendRelation.id}
                        className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50"
                      >
                        <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                          {friendUser.avatar ? (
                            <img src={friendUser.avatar} alt={friendUser.name} className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{friendUser.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{friendUser.email}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Пока нет друзей. Добавьте пользователей через вкладку «Пользователи».
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}