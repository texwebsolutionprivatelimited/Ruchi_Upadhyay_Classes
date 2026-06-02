import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import ChemistryLoader from '@/components/ui/ChemistryLoader';
export const ProtectedRoute = ({ children, requireAdmin = false }) => {
    const { user, loading: authLoading } = useAuth();
    const [isAdmin, setIsAdmin] = useState(null);
    const [checkingRole, setCheckingRole] = useState(true);
    useEffect(() => {
        const checkAdminRole = async () => {
            if (!user) {
                setCheckingRole(false);
                return;
            }
            if (!requireAdmin) {
                setCheckingRole(false);
                return;
            }
            try {
                const { data, error } = await supabase.rpc('has_role', {
                    _user_id: user.id,
                    _role: 'admin'
                });
                if (error) {
                    console.error('Error checking admin role:', error);
                    setIsAdmin(false);
                }
                else {
                    setIsAdmin(data);
                }
            }
            catch (error) {
                console.error('Error checking role:', error);
                setIsAdmin(false);
            }
            finally {
                setCheckingRole(false);
            }
        };
        checkAdminRole();
    }, [user, requireAdmin]);
    // Show loading while checking auth or role
    if (authLoading || checkingRole) {
        return (<div className="min-h-screen flex items-center justify-center bg-background">
        <ChemistryLoader size="lg" />
      </div>);
    }
    // Redirect to login if not authenticated
    if (!user) {
        return <Navigate to="/login" replace/>;
    }
    // Redirect to dashboard if not admin (when admin is required)
    if (requireAdmin && !isAdmin) {
        return <Navigate to="/profile" replace/>;
    }
    return <>{children}</>;
};
export default ProtectedRoute;
