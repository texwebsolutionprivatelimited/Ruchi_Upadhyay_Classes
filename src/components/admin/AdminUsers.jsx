import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Shield, ShieldCheck, ShieldX, User, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { useUsers, useAssignRole, useRemoveRole } from '@/hooks/useAdmin';
import { useAuth } from '@/contexts/AuthContext';

const AdminUsers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('user');
  const { user: currentUser } = useAuth();
  const { data: users, isLoading } = useUsers();
  const assignRole = useAssignRole();
  const removeRole = useRemoveRole();

  const filteredUsers = users?.filter(user => (user.username?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    user.id.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleOpenDialog = (user) => {
    setSelectedUser(user);
    setSelectedRole(user.role || 'user');
    setIsDialogOpen(true);
  };

  const handleAssignRole = async () => {
    if (!selectedUser)
      return;
    await assignRole.mutateAsync({ userId: selectedUser.id, role: selectedRole });
    setIsDialogOpen(false);
  };

  const handleRemoveRole = async (userId) => {
    if (userId === currentUser?.id) {
      alert("You cannot remove your own admin role!");
      return;
    }
    if (confirm('Are you sure you want to remove this user\'s role?')) {
      await removeRole.mutateAsync(userId);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return (<Badge className="bg-destructive/10 text-destructive border-destructive/20">
          <Crown className="w-3 h-3 mr-1" />
          Admin
        </Badge>);
      case 'moderator':
        return (<Badge className="bg-warning/10 text-warning border-warning/20">
          <ShieldCheck className="w-3 h-3 mr-1" />
          Moderator
        </Badge>);
      default:
        return (<Badge variant="secondary">
          <User className="w-3 h-3 mr-1" />
          User
        </Badge>);
    }
  };

  return (<div className="space-y-6">
    {/* Header */}
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold text-card-foreground">User Role Management</h2>
        <p className="text-sm text-muted-foreground">Assign admin or moderator roles to users</p>
      </div>
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search by username or ID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
      </div>
    </div>

    {/* Users Table/Cards */}
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary/50">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">User</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">User ID</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Role</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Joined</th>
              <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (<tr>
              <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                Loading users...
              </td>
            </tr>) : filteredUsers && filteredUsers.length > 0 ? (filteredUsers.map((user) => (<motion.tr key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-secondary/30 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user.avatar_url || ''} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user.username?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-card-foreground">
                      {user.username || 'Anonymous'}
                    </p>
                    {user.id === currentUser?.id && (<span className="text-xs text-muted-foreground">(You)</span>)}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <code className="text-xs bg-secondary px-2 py-1 rounded">
                  {user.id.substring(0, 8)}...
                </code>
              </td>
              <td className="px-6 py-4">
                {getRoleBadge(user.role)}
              </td>
              <td className="px-6 py-4 text-sm text-muted-foreground">
                {new Date(user.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleOpenDialog(user)}>
                    <Shield className="w-4 h-4 mr-2" />
                    Assign Role
                  </Button>
                  {user.role && user.id !== currentUser?.id && (<Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleRemoveRole(user.id)}>
                    <ShieldX className="w-4 h-4" />
                  </Button>)}
                </div>
              </td>
            </motion.tr>))) : (<tr>
              <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                No users found.
              </td>
            </tr>)}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-border">
        {isLoading ? (
          <div className="p-6 text-center text-muted-foreground">Loading users...</div>
        ) : filteredUsers && filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div key={user.id} className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10 border border-border">
                    <AvatarImage src={user.avatar_url || ''} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user.username?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-card-foreground">
                      {user.username || 'Anonymous'}
                    </p>
                    <p className="text-[10px] text-muted-foreground">Joined: {new Date(user.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                {getRoleBadge(user.role)}
              </div>

              <div className="flex items-center justify-between gap-2 border-t border-border/50 pt-3 mt-1">
                <code className="text-[10px] bg-secondary px-2 py-1 rounded">
                  ID: {user.id.substring(0, 12)}...
                </code>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="sm" onClick={() => handleOpenDialog(user)} className="h-8 px-3 text-[11px] font-bold">
                    <Shield className="w-3.5 h-3.5 mr-1.5" /> ROLE
                  </Button>
                  {user.role && user.id !== currentUser?.id && (
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive border-destructive/20" onClick={() => handleRemoveRole(user.id)}>
                      <ShieldX className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-muted-foreground">No users found.</div>
        )}
      </div>
    </div>

    {/* Assign Role Dialog */}
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Role</DialogTitle>
          <DialogDescription>
            Assign a role to {selectedUser?.username || 'this user'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
            <Avatar className="w-12 h-12">
              <AvatarImage src={selectedUser?.avatar_url || ''} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {selectedUser?.username?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{selectedUser?.username || 'Anonymous'}</p>
              <p className="text-sm text-muted-foreground">
                Current: {selectedUser?.role || 'No role assigned'}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Select Role</label>
            <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-destructive" />
                    Admin - Full access to all features
                  </div>
                </SelectItem>
                <SelectItem value="moderator">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-warning" />
                    Moderator - Limited admin access
                  </div>
                </SelectItem>
                <SelectItem value="user">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    User - Standard user access
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedRole === 'admin' && (<div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">
              <strong>Warning:</strong> Admin users have full access to all admin features including the ability to manage other users.
            </p>
          </div>)}
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>
          <Button variant="gradient" onClick={handleAssignRole} disabled={assignRole.isPending}>
            Assign Role
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  </div>);
};

export default AdminUsers;
