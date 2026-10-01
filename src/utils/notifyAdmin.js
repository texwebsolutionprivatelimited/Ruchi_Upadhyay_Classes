import { supabase } from '@/integrations/supabase/client';

/**
 * Notifies all admins whenever a student purchases a course, note, or test.
 * 
 * @param {Object} params
 * @param {string} params.studentName - Full name or username of student
 * @param {string} params.itemTitle - Title of course, notes folder, or test series
 * @param {string} params.itemType - 'Course' | 'Notes' | 'Test Series'
 * @param {number} params.amount - Price paid
 * @param {string} params.orderId - Order ID
 */
export const notifyAdminsAboutPurchase = async ({
  studentName,
  itemTitle,
  itemType,
  amount,
  orderId,
}) => {
  try {
    // 1. Fetch all admin users
    const { data: adminRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('role', 'admin');

    if (rolesError) {
      console.warn('Could not fetch admin roles for notification:', rolesError.message);
      return;
    }

    if (!adminRoles || adminRoles.length === 0) return;

    // 2. Prepare notifications for each admin
    const cleanStudent = studentName || 'A Student';
    const notifications = adminRoles.map((admin) => ({
      user_id: admin.user_id,
      title: `🛒 New Purchase: ${itemTitle}`,
      message: `${cleanStudent} just bought ${itemType} "${itemTitle}" for ₹${amount}. (Order: ${orderId})`,
      type: 'reward',
      is_read: false,
    }));

    const { error: insertError } = await supabase
      .from('notifications')
      .insert(notifications);

    if (insertError) {
      console.warn('Error inserting admin notification:', insertError.message);
    }
  } catch (err) {
    console.warn('Exception notifying admins:', err);
  }
};
