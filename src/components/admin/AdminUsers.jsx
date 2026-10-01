import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Shield, 
  ShieldCheck, 
  ShieldX, 
  User, 
  Crown, 
  Trash2, 
  Ban, 
  UserCheck, 
  AlertTriangle,
  Mail,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useUsers, useAssignRole, useRemoveRole, useDeleteUser, useToggleBlockUser } from '@/hooks/useAdmin';
import { useAuth } from '@/contexts/AuthContext';

const AdminUsers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('user');

  // Delete confirmation modal state
  const [userToDelete, setUserToDelete] = useState(null);

  // Block/Unblock confirmation modal state
  const [userToToggleBlock, setUserToToggleBlock] = useState(null);

  const { user: currentUser } = useAuth();
  const { data: users, isLoading } = useUsers();
  const assignRole = useAssignRole();
  const removeRole = useRemoveRole();
  const deleteUser = useDeleteUser();
  const toggleBlockUser = useToggleBlockUser();

  // Helper to determine if a user is an admin or protected
  const isSuperAdmin = (u) => {
    if (!u) return false;
    return (
      u.role === 'admin' ||
      u.id === currentUser?.id ||
      u.email === 'ruchiclasses24@gmail.com' ||
      u.username?.toLowerCase() === 'admin'
    );
  };

  const filteredUsers = users?.filter(user => {
    const q = searchQuery.toLowerCase().trim();
    const matchUsername = user.username?.toLowerCase().includes(q);
    const matchId = user.id?.toLowerCase().includes(q);
    const matchEmail = user.email?.toLowerCase().includes(q);
    const matchRole = user.role?.toLowerCase().includes(q);
    return matchUsername || matchId || matchEmail || matchRole;
  });

  const totalUsersCount = users?.length || 0;
  const adminCount = users?.filter(u => isSuperAdmin(u))?.length || 0;
  const blockedCount = users?.filter(u => u.is_blocked)?.length || 0;

  const handleOpenRoleDialog = (user) => {
    if (isSuperAdmin(user)) {
      return; // Cannot change role of admin
    }
    setSelectedUser(user);
    setSelectedRole(user.role || 'user');
    setIsRoleDialogOpen(true);
  };

  const handleAssignRole = async () => {
    if (!selectedUser || isSuperAdmin(selectedUser)) return;
    await assignRole.mutateAsync({ userId: selectedUser.id, role: selectedRole });
    setIsRoleDialogOpen(false);
  };

  const handleRemoveRole = async (userId) => {
    const target = users?.find(u => u.id === userId);
    if (isSuperAdmin(target)) {
      alert("Admin accounts cannot have their role removed!");
      return;
    }
    if (confirm("Are you sure you want to remove this user's special role?")) {
      await removeRole.mutateAsync(userId);
    }
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete || isSuperAdmin(userToDelete)) return;
    try {
      await deleteUser.mutateAsync(userToDelete.id);
      setUserToDelete(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmToggleBlock = async () => {
    if (!userToToggleBlock || isSuperAdmin(userToToggleBlock)) return;
    try {
      await toggleBlockUser.mutateAsync({
        userId: userToToggleBlock.id,
        isBlocked: !userToToggleBlock.is_blocked
      });
      setUserToToggleBlock(null);
    } catch (err) {
      console.error(err);
    }
  };

  const getRoleBadge = (user) => {
    if (isSuperAdmin(user)) {
      return (
        <Badge className="bg-gradient-to-r from-amber-500 to-primary text-white border-none shadow-xs px-2 py-0.5 text-[10px] sm:text-xs font-bold flex items-center gap-1 shrink-0">
          <Crown className="w-3 h-3 fill-current shrink-0" />
          Super Admin
        </Badge>
      );
    }

    if (user.role === 'moderator') {
      return (
        <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 text-[10px] sm:text-xs font-medium shrink-0">
          <ShieldCheck className="w-3 h-3 mr-1 shrink-0" />
          Moderator
        </Badge>
      );
    }

    return (
      <Badge variant="secondary" className="font-normal text-[10px] sm:text-xs shrink-0">
        <User className="w-3 h-3 mr-1 shrink-0" />
        Student
      </Badge>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-hidden">
      {/* Header & Stats */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-card-foreground flex items-center gap-2">
            User Management & Roles
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Manage student roles, secure permissions, and manage user accounts.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name, ID, or email..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            className="pl-10 h-9 sm:h-10 text-xs rounded-xl w-full" 
          />
        </div>
      </div>

      {/* Mini Stats Badges - Optimized for small screens 320px+ */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-3">
        <div className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-secondary/50 border border-border text-[11px] sm:text-xs font-medium text-foreground">
          Total Users: <span className="font-bold text-primary ml-1">{totalUsersCount}</span>
        </div>
        <div className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] sm:text-xs font-medium text-amber-600 dark:text-amber-400">
          Admins: <span className="font-bold ml-1">{adminCount}</span>
        </div>
        {blockedCount > 0 && (
          <div className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-destructive/10 border border-destructive/20 text-[11px] sm:text-xs font-medium text-destructive">
            Blocked: <span className="font-bold ml-1">{blockedCount}</span>
          </div>
        )}
      </div>

      {/* Users Table / Cards Container */}
      <div className="bg-card rounded-xl sm:rounded-2xl border border-border shadow-xs overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/40 border-b border-border text-xs uppercase font-semibold text-muted-foreground">
              <tr>
                <th className="text-left px-6 py-4">User Details</th>
                <th className="text-left px-6 py-4">User ID</th>
                <th className="text-left px-6 py-4">Role</th>
                <th className="text-left px-6 py-4">Status</th>
                <th className="text-left px-6 py-4">Joined Date</th>
                <th className="text-right px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <span>Loading registered users...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers && filteredUsers.length > 0 ? (
                filteredUsers.map((user) => {
                  const admin = isSuperAdmin(user);
                  return (
                    <motion.tr 
                      key={user.id} 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      className={`transition-colors ${
                        admin 
                          ? 'bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-l-4 border-l-amber-500 hover:bg-amber-500/15' 
                          : user.is_blocked 
                            ? 'bg-destructive/5 hover:bg-destructive/10 opacity-80' 
                            : 'hover:bg-secondary/30'
                      }`}
                    >
                      {/* User Column */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className={`w-10 h-10 ${admin ? 'ring-2 ring-amber-500 ring-offset-2 ring-offset-background' : ''}`}>
                            <AvatarImage src={user.avatar_url || ''} />
                            <AvatarFallback className={admin ? "bg-amber-500 text-white font-bold" : "bg-primary/10 text-primary font-semibold"}>
                              {user.username?.charAt(0).toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-card-foreground">
                                {user.username || 'Anonymous'}
                              </p>
                              {user.id === currentUser?.id && (
                                <Badge variant="outline" className="text-[10px] py-0 px-1.5 bg-primary/10 text-primary border-primary/20">
                                  You
                                </Badge>
                              )}
                            </div>
                            {user.email ? (
                              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                <Mail className="w-3 h-3" /> {user.email}
                              </p>
                            ) : (
                              <p className="text-[11px] text-muted-foreground">Student Account</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* User ID Column with Admin Highlight */}
                      <td className="px-6 py-4">
                        {admin ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 font-mono text-xs font-bold shadow-xs">
                            <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            <span>{user.id.substring(0, 10)}...</span>
                          </div>
                        ) : (
                          <code className="text-xs font-mono bg-secondary/80 text-muted-foreground px-2 py-1 rounded border border-border">
                            {user.id.substring(0, 10)}...
                          </code>
                        )}
                      </td>

                      {/* Role Column */}
                      <td className="px-6 py-4">
                        {getRoleBadge(user)}
                      </td>

                      {/* Status Column */}
                      <td className="px-6 py-4">
                        {admin ? (
                          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-medium">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Active
                          </Badge>
                        ) : user.is_blocked ? (
                          <Badge variant="destructive" className="bg-destructive/15 text-destructive border-destructive/30 font-bold">
                            <Ban className="w-3 h-3 mr-1" /> Blocked
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-medium">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Active
                          </Badge>
                        )}
                      </td>

                      {/* Joined Date */}
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                      </td>

                      {/* Actions Column */}
                      <td className="px-6 py-4 text-right">
                        {admin ? (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-semibold select-none cursor-default">
                            <Lock className="w-3.5 h-3.5 text-amber-500" />
                            <span>Protected (Role Locked)</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            {/* Assign Role Button */}
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleOpenRoleDialog(user)}
                              className="h-8 text-xs font-medium"
                            >
                              <Shield className="w-3.5 h-3.5 mr-1 text-primary" />
                              Assign Role
                            </Button>

                            {/* Remove Role button if user has a role */}
                            {user.role && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 text-destructive hover:bg-destructive/10 text-xs px-2" 
                                onClick={() => handleRemoveRole(user.id)}
                                title="Remove Role"
                              >
                                <ShieldX className="w-3.5 h-3.5" />
                              </Button>
                            )}

                            {/* Block / Unblock Button */}
                            {user.is_blocked ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setUserToToggleBlock(user)}
                                className="h-8 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800"
                                title="Unblock user"
                              >
                                <UserCheck className="w-3.5 h-3.5 mr-1" />
                                Unblock
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setUserToToggleBlock(user)}
                                className="h-8 text-xs font-semibold text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/30 border-amber-300 dark:border-amber-800"
                                title="Block user"
                              >
                                <Ban className="w-3.5 h-3.5 mr-1" />
                                Block
                              </Button>
                            )}

                            {/* Delete User Button */}
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setUserToDelete(user)}
                              className="h-8 w-8 p-0 text-destructive hover:bg-destructive/15 hover:text-destructive"
                              title="Delete user permanently"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </td>
                    </motion.tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    No users matching "{searchQuery}" found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile / Tablet Card View (Specially responsive on 320px, 375px, 425px) */}
        <div className="block lg:hidden divide-y divide-border">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <span className="text-xs">Loading users...</span>
            </div>
          ) : filteredUsers && filteredUsers.length > 0 ? (
            filteredUsers.map((user) => {
              const admin = isSuperAdmin(user);
              return (
                <div 
                  key={user.id} 
                  className={`p-3 sm:p-4 space-y-2.5 transition-colors ${
                    admin 
                      ? 'bg-amber-500/10 border-l-4 border-l-amber-500' 
                      : user.is_blocked 
                        ? 'bg-destructive/5' 
                        : ''
                  }`}
                >
                  {/* Top: Avatar, Name & Role */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <Avatar className={`w-9 h-9 sm:w-11 sm:h-11 shrink-0 ${admin ? 'ring-2 ring-amber-500 ring-offset-2 ring-offset-background' : ''}`}>
                        <AvatarImage src={user.avatar_url || ''} />
                        <AvatarFallback className={admin ? "bg-amber-500 text-white font-bold" : "bg-primary/10 text-primary font-semibold"}>
                          {user.username?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="font-bold text-card-foreground text-xs sm:text-sm truncate max-w-[130px] xs:max-w-[180px]">
                            {user.username || 'Anonymous'}
                          </p>
                          {user.id === currentUser?.id && (
                            <Badge variant="outline" className="text-[9px] py-0 px-1 bg-primary/10 text-primary shrink-0">You</Badge>
                          )}
                        </div>
                        {user.email && (
                          <p className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1 truncate max-w-[140px] xs:max-w-[200px]">
                            <Mail className="w-2.5 h-2.5 shrink-0" /> <span className="truncate">{user.email}</span>
                          </p>
                        )}
                        <p className="text-[10px] text-muted-foreground">
                          Joined: {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0">
                      {getRoleBadge(user)}
                    </div>
                  </div>

                  {/* ID & Status */}
                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/50 text-xs">
                    <div>
                      {admin ? (
                        <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 font-mono text-[10px] sm:text-[11px] font-bold">
                          <Crown className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-500 shrink-0" />
                          <span>ID: {user.id.substring(0, 8)}...</span>
                        </div>
                      ) : (
                        <code className="text-[10px] bg-secondary px-1.5 py-0.5 rounded text-muted-foreground font-mono">
                          ID: {user.id.substring(0, 8)}...
                        </code>
                      )}
                    </div>

                    <div>
                      {user.is_blocked ? (
                        <Badge variant="destructive" className="text-[9px] sm:text-[10px] px-1.5 py-0.5 font-bold">
                          <Ban className="w-2.5 h-2.5 mr-0.5" /> Blocked
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[9px] sm:text-[10px] px-1.5 py-0.5 text-emerald-600 border-emerald-500/30">
                          Active
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Actions for Mobile - Perfectly fits 320px screen */}
                  <div className="pt-1">
                    {admin ? (
                      <div className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-[11px] font-semibold text-center w-full">
                        <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>Protected Admin (Role Locked)</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 w-full">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleOpenRoleDialog(user)} 
                          className="h-7 sm:h-8 flex-1 text-[10px] sm:text-xs font-semibold px-1"
                        >
                          <Shield className="w-3 h-3 mr-1 text-primary shrink-0" /> Role
                        </Button>

                        {user.is_blocked ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setUserToToggleBlock(user)}
                            className="h-7 sm:h-8 flex-1 text-[10px] sm:text-xs font-semibold text-emerald-600 border-emerald-300 dark:border-emerald-800 px-1"
                          >
                            <UserCheck className="w-3 h-3 mr-1 shrink-0" /> Unblock
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setUserToToggleBlock(user)}
                            className="h-7 sm:h-8 flex-1 text-[10px] sm:text-xs font-semibold text-amber-600 border-amber-300 dark:border-amber-800 px-1"
                          >
                            <Ban className="w-3 h-3 mr-1 shrink-0" /> Block
                          </Button>
                        )}

                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => setUserToDelete(user)}
                          className="h-7 w-7 sm:h-8 sm:w-8 text-destructive hover:bg-destructive/15 shrink-0 p-0"
                          title="Delete user"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-muted-foreground text-xs">No users found.</div>
          )}
        </div>
      </div>

      {/* 1. Assign Role Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent className="w-[94vw] max-w-md p-4 sm:p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Shield className="w-5 h-5 text-primary shrink-0" />
              Assign Role
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Assign elevated permissions to {selectedUser?.username || 'this user'}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 sm:space-y-4 py-2">
            <div className="flex items-center gap-2.5 p-2.5 sm:p-3 bg-secondary/50 rounded-xl border border-border">
              <Avatar className="w-10 h-10 sm:w-12 sm:h-12 shrink-0">
                <AvatarImage src={selectedUser?.avatar_url || ''} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs sm:text-sm">
                  {selectedUser?.username?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="font-semibold text-foreground text-xs sm:text-sm truncate">{selectedUser?.username || 'Anonymous'}</p>
                {selectedUser?.email && (
                  <p className="text-[11px] text-muted-foreground truncate">{selectedUser.email}</p>
                )}
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                  Current: <span className="font-semibold text-foreground uppercase">{selectedUser?.role || 'user'}</span>
                </p>
              </div>
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Select New Role
              </label>
              <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value)}>
                <SelectTrigger className="h-10 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">
                    <div className="flex items-center gap-2 text-xs">
                      <User className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <span>User / Student - Standard access</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="moderator">
                    <div className="flex items-center gap-2 text-xs">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span>Moderator - Content management</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="admin">
                    <div className="flex items-center gap-2 text-xs">
                      <Crown className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>Admin - Full administrative access</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedRole === 'admin' && (
              <div className="p-2.5 sm:p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-2 text-[11px] sm:text-xs text-amber-700 dark:text-amber-300">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-500 mt-0.5" />
                <span>
                  <strong>Caution:</strong> Admin users have full control over the platform.
                </span>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsRoleDialogOpen(false)} className="text-xs h-8">
              Cancel
            </Button>
            <Button variant="default" size="sm" onClick={handleAssignRole} disabled={assignRole.isPending} className="text-xs h-8">
              {assignRole.isPending ? 'Assigning...' : 'Save Role'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 2. Delete User Confirmation Dialog */}
      <Dialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <DialogContent className="w-[94vw] max-w-md p-4 sm:p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive text-base sm:text-lg">
              <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />
              Delete User Account?
            </DialogTitle>
            <DialogDescription className="text-xs">
              This action is permanent and cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="py-2.5">
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 space-y-1.5 text-xs text-card-foreground">
              <p>
                Are you sure you want to delete user <strong className="text-destructive break-all">{userToDelete?.username || userToDelete?.id}</strong>?
              </p>
              <ul className="text-[11px] text-muted-foreground list-disc list-inside space-y-0.5">
                <li>Profile, XP, and streak records will be removed</li>
                <li>Purchased courses, notes, and test records deleted</li>
              </ul>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setUserToDelete(null)} className="text-xs h-8">
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={handleConfirmDelete} 
              disabled={deleteUser.isPending}
              className="text-xs h-8"
            >
              {deleteUser.isPending ? 'Deleting...' : 'Delete Permanently'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 3. Block / Unblock User Confirmation Dialog */}
      <Dialog open={!!userToToggleBlock} onOpenChange={(open) => !open && setUserToToggleBlock(null)}>
        <DialogContent className="w-[94vw] max-w-md p-4 sm:p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
              {userToToggleBlock?.is_blocked ? (
                <>
                  <UserCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                  Unblock User
                </>
              ) : (
                <>
                  <Ban className="w-5 h-5 text-amber-500 shrink-0" />
                  Block User
                </>
              )}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {userToToggleBlock?.is_blocked 
                ? 'Restore platform access for this user.'
                : 'Restrict this user from accessing platform features.'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="py-2.5">
            <div className={`p-3 rounded-xl border space-y-1 text-xs ${
              userToToggleBlock?.is_blocked 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-300' 
                : 'bg-amber-500/10 border-amber-500/20 text-amber-800 dark:text-amber-300'
            }`}>
              <p>
                {userToToggleBlock?.is_blocked ? (
                  <>
                    Are you sure you want to <strong>unblock</strong> <strong>{userToToggleBlock?.username || 'this user'}</strong>? They will be allowed to log in and study normally.
                  </>
                ) : (
                  <>
                    Are you sure you want to <strong>block</strong> <strong>{userToToggleBlock?.username || 'this user'}</strong>? They will be signed out and cannot sign in until unblocked.
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setUserToToggleBlock(null)} className="text-xs h-8">
              Cancel
            </Button>
            <Button 
              variant={userToToggleBlock?.is_blocked ? "default" : "destructive"}
              size="sm"
              onClick={handleConfirmToggleBlock} 
              disabled={toggleBlockUser.isPending}
              className="text-xs h-8"
            >
              {toggleBlockUser.isPending ? 'Processing...' : userToToggleBlock?.is_blocked ? 'Confirm Unblock' : 'Confirm Block'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;
