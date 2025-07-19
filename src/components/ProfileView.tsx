import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { useFavorites } from '@/hooks/useFavorites';
import { User, Save, Trash2, Heart, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const ProfileView = () => {
  const { user, updateProfile } = useAuth();
  const { favorites, clearAllFavorites } = useFavorites();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    username: user?.username || ''
  });

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
    toast({
      title: 'Profile Updated',
      description: 'Your profile has been updated successfully'
    });
  };

  const handleReset = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      username: user?.username || ''
    });
    setIsEditing(false);
  };

  const handleClearListeningHistory = () => {
    localStorage.removeItem('podcast-progress');
    toast({
      title: 'Listening History Cleared',
      description: 'All your listening progress has been reset'
    });
  };

  const handleClearFavorites = () => {
    clearAllFavorites();
    toast({
      title: 'Favorites Cleared',
      description: 'All your favorite episodes have been removed'
    });
  };

  const getListeningStats = () => {
    const progress = JSON.parse(localStorage.getItem('podcast-progress') || '[]');
    const completed = progress.filter((p: any) => p.completed).length;
    const inProgress = progress.filter((p: any) => !p.completed && p.currentTime > 0).length;
    
    return { completed, inProgress, total: progress.length };
  };

  const stats = getListeningStats();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-3 rounded-full">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Manage your account details</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={handleReset}>
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Full Name</Label>
                  <p className="font-medium">{user?.name}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Username</Label>
                  <p className="font-medium">@{user?.username}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Email</Label>
                <p className="font-medium">{user?.email}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Member Since</Label>
                <p className="font-medium">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
              <Button onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Your Listening Stats</CardTitle>
          <CardDescription>Track your podcast journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{favorites.length}</div>
              <div className="text-sm text-muted-foreground">Favorites</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.inProgress}</div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Listened</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Access to Favorites */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Recent Favorites
          </CardTitle>
          <CardDescription>Your most recently added favorite episodes</CardDescription>
        </CardHeader>
        <CardContent>
          {favorites.length > 0 ? (
            <div className="space-y-3">
              {favorites.slice(0, 5).map((favorite) => (
                <div key={favorite.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{favorite.episodeTitle}</p>
                    <p className="text-sm text-muted-foreground">
                      {favorite.showTitle} - Season {favorite.seasonNumber}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(favorite.addedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
              {favorites.length > 5 && (
                <p className="text-sm text-muted-foreground text-center">
                  And {favorites.length - 5} more...
                </p>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              No favorites yet. Start adding episodes you love!
            </p>
          )}
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>Reset or clear your data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="outline"
              onClick={handleClearListeningHistory}
              className="flex-1"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Listening History
            </Button>
            <Button
              variant="outline"
              onClick={handleClearFavorites}
              className="flex-1"
            >
              <Heart className="h-4 w-4 mr-2" />
              Clear Favorites
            </Button>
          </div>
          <Separator />
          <div className="text-sm text-muted-foreground">
            <p><strong>Clear Listening History:</strong> Removes all progress tracking for episodes you've listened to.</p>
            <p><strong>Clear Favorites:</strong> Removes all episodes from your favorites list.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};