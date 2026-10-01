import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAdminPurchases = () => {
  return useQuery({
    queryKey: ['admin-all-purchases'],
    queryFn: async () => {
      // 1. Fetch real student profiles from database
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, username, avatar_url, created_at');

      if (profilesError) {
        console.warn('Error fetching profiles in admin purchases:', profilesError.message);
      }
      const profileMap = new Map((profiles || []).map((p) => [p.user_id, p]));

      // 2. Query real purchases from 'purchases' table
      const { data: purchasesData, error: purchasesError } = await supabase
        .from('purchases')
        .select('*, course:courses(title, price, category), test:tests(title, price, category), note:notes(title, price, category)')
        .order('created_at', { ascending: false });

      if (purchasesError) {
        console.warn('Error fetching purchases table:', purchasesError.message);
      }

      // 3. Query real category purchases from 'category_purchases' table
      const { data: categoryData, error: categoryError } = await supabase
        .from('category_purchases')
        .select('*')
        .order('created_at', { ascending: false });

      if (categoryError) {
        console.warn('Error fetching category_purchases table:', categoryError.message);
      }

      // 4. Normalize purely real transactions
      const realTransactions = [];
      const seenOrderIds = new Set();

      // Process real rows from 'purchases'
      (purchasesData || []).forEach((p) => {
        const student = profileMap.get(p.user_id);
        const studentName = student?.username || p.username || 'Student';

        let itemType = 'Course';
        let itemTitle = 'Course Enrollment';
        let category = 'Academic';

        if (p.course) {
          itemType = 'Course';
          itemTitle = p.course.title;
          category = p.course.category || 'Courses';
        } else if (p.note) {
          itemType = 'Notes';
          itemTitle = p.note.title;
          category = p.note.category || 'Notes';
        } else if (p.test) {
          itemType = 'Test Series';
          itemTitle = p.test.title;
          category = p.test.category || 'Tests';
        }

        const orderId = p.order_id || `ORD_${p.id}`;
        if (!seenOrderIds.has(orderId)) {
          seenOrderIds.add(orderId);
          realTransactions.push({
            id: p.id,
            userId: p.user_id,
            studentName,
            studentAvatar: student?.avatar_url || null,
            itemType,
            itemTitle,
            category,
            amount: Number(p.amount || 0),
            orderId,
            paymentId: p.payment_id || 'N/A',
            status: p.status || 'completed',
            createdAt: p.created_at || p.paid_at || new Date().toISOString(),
            pointsDiscount: Number(p.points_discount || 0),
          });
        }
      });

      // Process real rows from 'category_purchases'
      (categoryData || []).forEach((cp) => {
        const student = profileMap.get(cp.user_id);
        const studentName = student?.username || 'Student';

        const isNotes = (cp.content_type || 'notes') === 'notes';
        const itemType = isNotes ? 'Notes Folder' : 'Test Series Bundle';
        const itemTitle = `${cp.category} ${isNotes ? 'Complete Notes Pack' : 'Full Test Series'}`;
        const orderId = cp.order_id || `CAT_${cp.id}`;

        if (!seenOrderIds.has(orderId)) {
          seenOrderIds.add(orderId);
          realTransactions.push({
            id: cp.id,
            userId: cp.user_id,
            studentName,
            studentAvatar: student?.avatar_url || null,
            itemType,
            itemTitle,
            category: cp.category || 'Package',
            amount: Number(cp.amount || 0),
            orderId,
            paymentId: cp.payment_id || 'N/A',
            status: cp.status || 'completed',
            createdAt: cp.created_at || new Date().toISOString(),
            pointsDiscount: 0,
          });
        }
      });

      // Sort newest first
      realTransactions.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      // 5. Calculate Real Metrics
      const totalRevenue = realTransactions.reduce((acc, curr) => acc + curr.amount, 0);
      const totalOrders = realTransactions.length;
      const courseSalesCount = realTransactions.filter((t) => t.itemType === 'Course').length;
      const notesSalesCount = realTransactions.filter(
        (t) => t.itemType === 'Notes' || t.itemType === 'Notes Folder'
      ).length;
      const testsSalesCount = realTransactions.filter(
        (t) => t.itemType === 'Test Series' || t.itemType === 'Test Series Bundle'
      ).length;
      const uniqueBuyersCount = new Set(realTransactions.map((t) => t.userId)).size;

      return {
        transactions: realTransactions,
        metrics: {
          totalRevenue,
          totalOrders,
          courseSalesCount,
          notesSalesCount,
          testsSalesCount,
          uniqueBuyersCount,
        },
      };
    },
    staleTime: 1000 * 20, // 20 seconds
  });
};
