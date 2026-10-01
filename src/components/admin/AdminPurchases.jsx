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
      setDownloadingId(item.id || item.orderId);
      await downloadInvoicePdf({
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
          <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-semibold shrink-0">
            <BookOpen className="w-3 h-3 mr-1" /> Course
          </Badge>
        );
      case 'Notes':
      case 'Notes Folder':
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] font-semibold shrink-0">
            <FileText className="w-3 h-3 mr-1" /> Notes Pack
          </Badge>
        );
      case 'Test Series':
      case 'Test Series Bundle':
        return (
          <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px] font-semibold shrink-0">
            <CheckCircle className="w-3 h-3 mr-1" /> Test Series
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="text-[10px] shrink-0">
            <Package className="w-3 h-3 mr-1" /> Package
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-hidden">
      {/* Real Metrics KPI Cards - Highly responsive 320px - 425px grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 shadow-xs relative overflow-hidden group hover:border-primary/40 transition-all"
        >
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="font-black text-sm sm:text-lg">₹</span>
            </div>
            <Badge variant="secondary" className="bg-primary/10 text-primary text-[9px] sm:text-[10px] px-1.5 py-0.5">
              Revenue
            </Badge>
          </div>
          <p className="text-base sm:text-xl md:text-3xl font-black text-foreground truncate">
            ₹{metrics.totalRevenue.toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] sm:text-xs text-muted-foreground font-medium mt-0.5 truncate">Total Revenue</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-card border border-border rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 shadow-xs relative overflow-hidden group hover:border-primary/40 transition-all"
        >
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
              <ShoppingCart className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
            </div>
            <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-600 text-[9px] sm:text-[10px] px-1.5 py-0.5">
              Orders
            </Badge>
          </div>
          <p className="text-base sm:text-xl md:text-3xl font-black text-foreground truncate">{metrics.totalOrders}</p>
          <p className="text-[10px] sm:text-xs text-muted-foreground font-medium mt-0.5 truncate">Completed Orders</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 shadow-xs relative overflow-hidden group hover:border-primary/40 transition-all"
        >
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
            </div>
            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 text-[9px] sm:text-[10px] px-1.5 py-0.5">
              Courses
            </Badge>
          </div>
          <p className="text-base sm:text-xl md:text-3xl font-black text-foreground truncate">
            {metrics.courseSalesCount}
          </p>
          <p className="text-[10px] sm:text-xs text-muted-foreground font-medium mt-0.5 truncate">Enrollments</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card border border-border rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 shadow-xs relative overflow-hidden group hover:border-primary/40 transition-all"
        >
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Users className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
            </div>
            <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 text-[9px] sm:text-[10px] px-1.5 py-0.5">
              Students
            </Badge>
          </div>
          <p className="text-base sm:text-xl md:text-3xl font-black text-foreground truncate">
            {metrics.uniqueBuyersCount}
          </p>
          <p className="text-[10px] sm:text-xs text-muted-foreground font-medium mt-0.5 truncate">Paying Students</p>
        </motion.div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-3 sm:space-y-4">
        {/* Controls Bar - Responsive for 320px, 375px, 425px */}
        <div className="flex flex-col gap-2.5 sm:gap-3">
          {/* Search Input */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search student, course, notes, order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs h-9 sm:h-10 rounded-xl w-full"
            />
          </div>

          {/* Filter Dropdowns and Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[115px] sm:w-[135px] text-xs h-9 sm:h-10 rounded-xl shrink-0">
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
              <SelectTrigger className="w-[105px] sm:w-[125px] text-xs h-9 sm:h-10 rounded-xl shrink-0">
                <SelectValue placeholder="Date" />
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
              className="text-xs text-muted-foreground hover:text-foreground h-9 px-2 sm:px-3 shrink-0"
            >
              Reset
            </Button>

            {/* Export CSV Button */}
            <Button
              onClick={handleExportCsv}
              variant="outline"
              size="sm"
              className="rounded-xl border-border hover:border-primary/50 text-xs gap-1.5 font-bold h-9 sm:h-10 px-2.5 sm:px-3.5 shrink-0 ml-auto"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden xs:inline">Export</span> CSV
            </Button>
          </div>
        </div>

        {/* Real Purchases Container: Desktop Table + Mobile Cards */}
        <div className="bg-card rounded-xl sm:rounded-2xl border border-border overflow-hidden shadow-xs">
          
          {/* 1. Desktop Table View (Hidden on mobile / tablet) */}
          <div className="hidden lg:block overflow-x-auto">
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
                      Loading transactions...
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
                              {tx.studentName?.charAt(0).toUpperCase() || 'S'}
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
                          disabled={downloadingId === (tx.id || tx.orderId)}
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

          {/* 2. Mobile / Tablet Card View (Specially optimized for 320px, 375px, 425px) */}
          <div className="block lg:hidden divide-y divide-border">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <span className="text-xs">Loading transactions...</span>
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <ShoppingCart className="w-8 h-8 mx-auto text-muted-foreground/30 mb-2" />
                <p className="font-bold text-xs text-foreground">No purchases found</p>
              </div>
            ) : (
              paginatedTransactions.map((tx) => (
                <div key={tx.id || tx.orderId} className="p-3.5 space-y-2.5 hover:bg-secondary/10 transition-colors">
                  {/* Top: Student Info + Amount */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Avatar className="w-8 h-8 shrink-0">
                        <AvatarImage src={tx.studentAvatar} />
                        <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                          {tx.studentName?.charAt(0).toUpperCase() || 'S'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-bold text-foreground text-xs truncate leading-tight">
                          {tx.studentName || 'Student'}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-mono truncate">
                          ID: {tx.userId?.substring(0, 8)}...
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-black text-foreground text-sm sm:text-base">
                        ₹{tx.amount}
                      </span>
                    </div>
                  </div>

                  {/* Middle: Item Details & Badges */}
                  <div className="bg-secondary/30 rounded-lg p-2.5 space-y-1.5 border border-border/50">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-foreground text-xs leading-snug line-clamp-1">
                        {tx.itemTitle}
                      </p>
                      {getItemBadge(tx.itemType)}
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground gap-2 pt-0.5">
                      <span className="truncate">{tx.category}</span>
                      <span className="flex items-center gap-1 shrink-0 font-medium">
                        <Clock className="w-2.5 h-2.5" />
                        {format(new Date(tx.createdAt), 'dd MMM, HH:mm')}
                      </span>
                    </div>
                  </div>

                  {/* Bottom: Order ID + Status + Download Button */}
                  <div className="flex items-center justify-between gap-2 pt-0.5">
                    <div className="min-w-0">
                      <code className="text-[10px] font-mono bg-secondary/80 px-1.5 py-0.5 rounded text-muted-foreground truncate block max-w-[150px]">
                        #{tx.orderId?.slice(-10) || tx.orderId}
                      </code>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <Badge
                        variant="secondary"
                        className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[9px] px-1.5 py-0.5 font-semibold"
                      >
                        <Check className="w-2.5 h-2.5 mr-0.5" />
                        {tx.status}
                      </Badge>

                      <Button
                        variant="outline"
                        size="sm"
                        disabled={downloadingId === (tx.id || tx.orderId)}
                        onClick={() => handleDownloadInvoice(tx)}
                        className="rounded-lg border-border hover:border-primary text-[10px] h-7 px-2 gap-1 font-bold shadow-2xs"
                      >
                        <Download className="w-2.5 h-2.5" />
                        PDF
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Table Footer with Full Responsive Pagination */}
          <div className="p-3 bg-secondary/30 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-muted-foreground px-3.5">
            <div className="flex items-center justify-between w-full sm:w-auto gap-2">
              <span className="text-[11px] sm:text-xs">
                Showing{' '}
                <strong className="text-foreground">
                  {filteredTransactions.length === 0 ? 0 : startIndex + 1}
                </strong>
                -
                <strong className="text-foreground">
                  {Math.min(startIndex + pageSize, filteredTransactions.length)}
                </strong>{' '}
                of{' '}
                <strong className="text-foreground">{filteredTransactions.length}</strong>
              </span>

              {/* Page size selector */}
              <div className="flex items-center gap-1 ml-auto sm:ml-2">
                <span className="text-[10px] sm:text-[11px]">Rows:</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="bg-card border border-border text-foreground text-xs rounded-lg px-1.5 py-0.5 outline-none focus:border-primary"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center gap-1 w-full sm:w-auto justify-center sm:justify-end">
                {/* First Page */}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(1)}
                  title="First Page"
                >
                  <ChevronsLeft className="w-3.5 h-3.5" />
                </Button>

                {/* Prev Page */}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  title="Previous Page"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </Button>

                {/* Page Indicator */}
                <span className="text-xs font-semibold px-2 text-foreground">
                  {currentPage} / {totalPages}
                </span>

                {/* Next Page */}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  title="Next Page"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>

                {/* Last Page */}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                  title="Last Page"
                >
                  <ChevronsRight className="w-3.5 h-3.5" />
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
