/**
 * Exports an array of purchase records to a downloadable CSV file.
 * 
 * @param {Array<Object>} purchases - List of purchases
 * @param {string} [filename] - Output file name
 */
export const exportPurchasesToCsv = (purchases, filename = 'Ruchi_Classes_Purchases_Report.csv') => {
  if (!purchases || purchases.length === 0) {
    alert('No purchase records to export');
    return;
  }

  const headers = [
    'Order ID',
    'Date',
    'Time',
    'Student Name',
    'User ID',
    'Item Type',
    'Item Title',
    'Category',
    'Amount (INR)',
    'Payment ID',
    'Status'
  ];

  const rows = purchases.map((p) => {
    const dateObj = p.createdAt || p.created_at ? new Date(p.createdAt || p.created_at) : new Date();
    const dateStr = dateObj.toLocaleDateString('en-IN');
    const timeStr = dateObj.toLocaleTimeString('en-IN');

    return [
      `"${(p.orderId || p.order_id || 'N/A').replace(/"/g, '""')}"`,
      `"${dateStr}"`,
      `"${timeStr}"`,
      `"${(p.studentName || p.username || 'Student').replace(/"/g, '""')}"`,
      `"${(p.userId || p.user_id || 'N/A').replace(/"/g, '""')}"`,
      `"${(p.itemType || 'Unknown').replace(/"/g, '""')}"`,
      `"${(p.itemTitle || p.title || 'Item').replace(/"/g, '""')}"`,
      `"${(p.category || 'General').replace(/"/g, '""')}"`,
      p.amount ?? 0,
      `"${(p.paymentId || p.payment_id || 'N/A').replace(/"/g, '""')}"`,
      `"${(p.status || 'completed').replace(/"/g, '""')}"`
    ];
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
