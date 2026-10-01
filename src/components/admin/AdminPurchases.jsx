import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingCart,
  Download,
  Search,
  Filter,
  CreditCard,
  BookOpen,
  FileText,
  CheckCircle,
  Clock,
  User,
  Users,
  Check,
  Receipt,
  FileSpreadsheet,
  Package,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { format } from 'date-fns';
import { useAdminPurchases } from '@/hooks/useAdminPurchases';
import { downloadInvoicePdf } from '@/utils/generateInvoicePdf';
import { exportPurchasesToCsv } from '@/utils/exportCsv';
import { toast } from 'sonner';

const AdminPurchases = () => {
  const { data, isLoading } = useAdminPurchases();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [downloadingId, setDownloadingId] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const transactions = data?.transactions || [];
  const metrics = data?.metrics || {
    totalRevenue: 0,
    totalOrders: 0,
    courseSalesCount: 0,
    notesSalesCount: 0,
    testsSalesCount: 0,
    uniqueBuyersCount: 0,
  };

  // Filter real transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      // Search
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        t.studentName?.toLowerCase().includes(query) ||
        t.itemTitle?.toLowerCase().includes(query) ||
        t.orderId?.toLowerCase().includes(query) ||
        t.paymentId?.toLowerCase().includes(query) ||
        t.category?.toLowerCase().includes(query);

      // Type
      const matchesType =
        typeFilter === 'all' ||
        (typeFilter === 'course' && t.itemType === 'Course') ||
        (typeFilter === 'notes' &&
          (t.itemType === 'Notes' || t.itemType === 'Notes Folder')) ||
        (typeFilter === 'tests' &&
          (t.itemType === 'Test Series' || t.itemType === 'Test Series Bundle'));

      // Date
      let matchesDate = true;
      if (dateFilter !== 'all' && t.createdAt) {
        const itemDate = new Date(t.createdAt);
        const now = new Date();
        if (dateFilter === 'today') {
          matchesDate = itemDate.toDateString() === now.toDateString();
        } else if (dateFilter === 'week') {
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(now.getDate() - 7);
          matchesDate = itemDate >= oneWeekAgo;
        } else if (dateFilter === 'month') {
          const oneMonthAgo = new Date();
          oneMonthAgo.setMonth(now.getMonth() - 1);
          matchesDate = itemDate >= oneMonthAgo;
        }
      }

      return matchesSearch && matchesType && matchesDate;
    });
  }, [transactions, searchQuery, typeFilter, dateFilter]);

  // Reset to first page whenever search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, typeFilter, dateFilter, pageSize]);

  // Calculate pagination slice
  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedTransactions = useMemo(() => {
    return filteredTransactions.slice(startIndex, startIndex + pageSize);
  }, [filteredTransactions, startIndex, pageSize]);

  const handleDownloadInvoice = async (item) => {
    try {
      setDownloadingId(item.id);
      downloadInvoicePdf({
        orderId: item.orderId,
        paymentId: item.paymentId,
        studentName: item.studentName,
        userId: item.userId,
        itemTitle: item.itemTitle,
        itemType: item.itemType,
        category: item.category,
        amount: item.amount,
        pointsDiscount: item.pointsDiscount,
        date: item.createdAt,
        status: item.status,
      });
      toast.success(`Invoice downloaded for Order #${item.orderId.slice(-8)}`);
    } catch (err) {
      toast.error('Failed to generate PDF invoice: ' + err.message);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleExportCsv = () => {
    try {
      exportPurchasesToCsv(
        filteredTransactions,
        `Ruchi_Classes_Purchases_${format(new Date(), 'yyyy-MM-dd')}.csv`
      );
      toast.success('Purchases CSV report exported successfully!');
    } catch (err) {
      toast.error('Failed to export CSV: ' + err.message);
    }
  };



  const getItemBadge = (type) => {
    switch (type) {
      case 'Course':
        return (
          <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-semibold">
            <BookOpen className="w-3 h-3 mr-1" /> Course
          </Badge>
        );
      case 'Notes':
      case 'Notes Folder':
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] font-semibold">
            <FileText className="w-3 h-3 mr-1" /> Notes Pack
          </Badge>
        );
      case 'Test Series':
      case 'Test Series Bundle':
        return (
          <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px] font-semibold">
            <CheckCircle className="w-3 h-3 mr-1" /> Test Series
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="text-[10px]">
            <Package className="w-3 h-3 mr-1" /> Package
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Real Metrics KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-2xl p-4 md:p-5 shadow-sm relative overflow-hidden group hover:border-primary/40 transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="font-black text-lg">₹</span>
            </div>
            <Badge variant="secondary" className="bg-primary/10 text-primary text-[10px]">
              Revenue
            </Badge>
          </div>
          <p className="text-xl md:text-3xl font-black text-foreground">
            ₹{metrics.totalRevenue.toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-muted-foreground font-medium mt-1">Real Total Revenue</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-card border border-border rounded-2xl p-4 md:p-5 shadow-sm relative overflow-hidden group hover:border-primary/40 transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-600 text-[10px]">
              Orders
            </Badge>
          </div>
          <p className="text-xl md:text-3xl font-black text-foreground">{metrics.totalOrders}</p>
          <p className="text-xs text-muted-foreground font-medium mt-1">Total Completed Orders</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-2xl p-4 md:p-5 shadow-sm relative overflow-hidden group hover:border-primary/40 transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 text-[10px]">
              Courses
            </Badge>
          </div>
          <p className="text-xl md:text-3xl font-black text-foreground">
            {metrics.courseSalesCount}
          </p>
          <p className="text-xs text-muted-foreground font-medium mt-1">Course Enrollments</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card border border-border rounded-2xl p-4 md:p-5 shadow-sm relative overflow-hidden group hover:border-primary/40 transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 text-[10px]">
              Students
            </Badge>
          </div>
          <p className="text-xl md:text-3xl font-black text-foreground">
            {metrics.uniqueBuyersCount}
          </p>
          <p className="text-xs text-muted-foreground font-medium mt-1">Paying Students</p>
        </motion.div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-4">
        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search student, course, notes, order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs h-10 rounded-xl"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[140px] text-xs h-10 rounded-xl">
                <SelectValue placeholder="Item Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="course">Courses</SelectItem>
                <SelectItem value="notes">Notes</SelectItem>
                <SelectItem value="tests">Test Series</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[130px] text-xs h-10 rounded-xl">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Past 7 Days</SelectItem>
                <SelectItem value="month">Past 30 Days</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setTypeFilter('all');
                setDateFilter('all');
              }}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Reset
            </Button>

            {/* Global Export Button */}
            <Button
              onClick={handleExportCsv}
              variant="outline"
              size="sm"
              className="rounded-xl border-border hover:border-primary/50 text-xs gap-2 font-bold h-10 shrink-0"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Real Purchases Table Card */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-secondary/40 text-muted-foreground font-semibold border-b border-border">
                <tr>
                  <th className="px-4 py-3.5">Student</th>
                  <th className="px-4 py-3.5">Purchased Item</th>
                  <th className="px-4 py-3.5">Type</th>
                  <th className="px-4 py-3.5">Amount</th>
                  <th className="px-4 py-3.5">Order / Payment ID</th>
                  <th className="px-4 py-3.5">Date & Time</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-muted-foreground">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      Loading real transactions from database...
                    </td>
                  </tr>
                ) : filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center text-muted-foreground">
                      <ShoppingCart className="w-10 h-10 mx-auto text-muted-foreground/30 mb-2" />
                      <p className="font-bold text-sm text-foreground">No purchases found in database</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Purchases made by students will appear here in real-time.
                      </p>
                    </td>
                  </tr>
                ) : (
                  paginatedTransactions.map((tx) => (
                    <tr key={tx.id || tx.orderId} className="hover:bg-secondary/20 transition-colors">
                      {/* Student Name */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <Avatar className="w-7 h-7">
                            <AvatarImage src={tx.studentAvatar} />
                            <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                              {tx.studentName.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-bold text-foreground text-xs">{tx.studentName}</p>
                            <p className="text-[10px] text-muted-foreground font-mono">
                              ID: {tx.userId?.substring(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Item Title */}
                      <td className="px-4 py-3 max-w-[200px]">
                        <p className="font-semibold text-foreground truncate" title={tx.itemTitle}>
                          {tx.itemTitle}
                        </p>
                        <p className="text-[10px] text-muted-foreground truncate">{tx.category}</p>
                      </td>

                      {/* Type Badge */}
                      <td className="px-4 py-3">{getItemBadge(tx.itemType)}</td>

                      {/* Amount */}
                      <td className="px-4 py-3">
                        <span className="font-black text-foreground text-sm">
                          ₹{tx.amount}
                        </span>
                      </td>

                      {/* Order & Payment ID */}
                      <td className="px-4 py-3">
                        <div className="font-mono text-[10px]">
                          <p className="text-foreground truncate max-w-[130px]" title={tx.orderId}>
                            {tx.orderId}
                          </p>
                          <p className="text-muted-foreground truncate max-w-[130px]" title={tx.paymentId}>
                            {tx.paymentId}
                          </p>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap text-[11px]">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-muted-foreground/60" />
                          {format(new Date(tx.createdAt), 'dd MMM yyyy, HH:mm')}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <Badge
                          variant="secondary"
                          className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] font-semibold"
                        >
                          <Check className="w-3 h-3 mr-1" />
                          {tx.status}
                        </Badge>
                      </td>

                      {/* Download Invoice Button */}
                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={downloadingId === tx.id}
                          onClick={() => handleDownloadInvoice(tx)}
                          className="rounded-xl border-border hover:border-primary hover:bg-primary/10 hover:text-primary text-[11px] h-8 px-2.5 gap-1.5 font-bold shadow-xs"
                          title="Download official PDF receipt/invoice"
                        >
                          <Download className="w-3 h-3" />
                          PDF
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer with Full Pagination */}
          <div className="p-3 bg-secondary/30 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground px-4">
            <div className="flex items-center gap-3">
              <span>
                Showing{' '}
                <strong className="text-foreground">
                  {filteredTransactions.length === 0 ? 0 : startIndex + 1}
                </strong>
                -
                <strong className="text-foreground">
                  {Math.min(startIndex + pageSize, filteredTransactions.length)}
                </strong>{' '}
                of{' '}
                <strong className="text-foreground">{filteredTransactions.length}</strong> records
              </span>

              {/* Page size selector */}
              <div className="flex items-center gap-1.5 ml-2">
                <span className="text-[11px]">Rows:</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="bg-card border border-border text-foreground text-xs rounded-lg px-2 py-1 outline-none focus:border-primary"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                {/* First Page */}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-lg"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(1)}
                  title="First Page"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </Button>

                {/* Prev Page */}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-lg"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  title="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                {/* Page Number Display */}
                <div className="flex items-center gap-1 px-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((page) => {
                      // Show current page, edges, and adjacent pages
                      return (
                        page === 1 ||
                        page === totalPages ||
                        Math.abs(page - currentPage) <= 1
                      );
                    })
                    .map((page, index, array) => {
                      const showEllipsis = index > 0 && page - array[index - 1] > 1;
                      return (
                        <div key={page} className="flex items-center">
                          {showEllipsis && <span className="px-1 text-muted-foreground">...</span>}
                          <Button
                            variant={currentPage === page ? 'default' : 'outline'}
                            size="sm"
                            className={`h-8 w-8 p-0 rounded-lg text-xs font-bold ${
                              currentPage === page
                                ? 'bg-primary text-primary-foreground'
                                : 'text-foreground'
                            }`}
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </Button>
                        </div>
                      );
                    })}
                </div>

                {/* Next Page */}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-lg"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  title="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>

                {/* Last Page */}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-lg"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                  title="Last Page"
                >
                  <ChevronsRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPurchases;
