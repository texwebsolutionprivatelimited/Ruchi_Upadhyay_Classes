import { useState } from 'react';
import { Settings, Bell, Moon, Globe, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useSettings } from '@/hooks/useSettings';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
const SettingsModal = () => {
    const { settings, loading, updateSettings } = useSettings();
    const { profile, updateProfile } = useAuth();
    const [open, setOpen] = useState(false);
    const [username, setUsername] = useState(profile?.username || '');
    const [saving, setSaving] = useState(false);
    const handleSaveProfile = async () => {
        if (!username.trim()) {
            toast.error('Username cannot be empty');
            return;
        }
        setSaving(true);
        await updateProfile({ username: username.trim() });
        setSaving(false);
    };
    if (loading) {
        return (<Button variant="outline" size="icon" disabled>
        <Loader2 className="w-5 h-5 animate-spin"/>
      </Button>);
    }
    return (<Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="w-5 h-5"/>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5"/>
            Settings
          </DialogTitle>
          <DialogDescription>
            Manage your account settings and preferences
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Profile Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <User className="w-4 h-4"/>
              Profile
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="flex gap-2">
                <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username"/>
                <Button onClick={handleSaveProfile} disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 animate-spin"/> : 'Save'}
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          {/* Notifications Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Bell className="w-4 h-4"/>
              Notifications
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notif">Email Notifications</Label>
              <Switch id="email-notif" checked={settings?.email_notifications ?? true} onCheckedChange={(checked) => updateSettings({ email_notifications: checked })}/>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="push-notif">Push Notifications</Label>
              <Switch id="push-notif" checked={settings?.push_notifications ?? true} onCheckedChange={(checked) => updateSettings({ push_notifications: checked })}/>
            </div>
          </div>

          <Separator />

          {/* Appearance Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Moon className="w-4 h-4"/>
              Appearance
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode">Dark Mode</Label>
              <Switch id="dark-mode" checked={settings?.dark_mode ?? false} onCheckedChange={(checked) => updateSettings({ dark_mode: checked })}/>
            </div>
          </div>

          <Separator />

          {/* Language Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Globe className="w-4 h-4"/>
              Language
            </div>
            <Select value={settings?.language ?? 'en'} onValueChange={(value) => updateSettings({ language: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select language"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">Hindi</SelectItem>
                <SelectItem value="bn">Bengali</SelectItem>
                <SelectItem value="ta">Tamil</SelectItem>
                <SelectItem value="te">Telugu</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </DialogContent>
    </Dialog>);
};
export default SettingsModal;
