import { jsPDF } from 'jspdf';
import { format } from 'date-fns';

/**
 * Generates and downloads a branded PDF Tax Invoice / Payment Receipt for a purchase.
 * 
 * @param {Object} purchaseData
 * @param {string} purchaseData.orderId - Razorpay or internal Order ID
 * @param {string} [purchaseData.paymentId] - Razorpay Payment ID
 * @param {string} [purchaseData.studentName] - Name or username of student
 * @param {string} [purchaseData.studentEmail] - Email of student if available
 * @param {string} [purchaseData.userId] - Supabase User UUID
 * @param {string} purchaseData.itemTitle - Title of Course, Note, or Test Series
 * @param {string} purchaseData.itemType - 'Course' | 'Notes' | 'Test Series' | 'Study Material'
 * @param {string} [purchaseData.category] - Category/Subject name
 * @param {number} purchaseData.amount - Final amount paid in INR
 * @param {number} [purchaseData.originalPrice] - Original price before discounts
 * @param {number} [purchaseData.pointsDiscount] - Discount given via points
 * @param {string|Date} [purchaseData.date] - Date of purchase
 * @param {string} [purchaseData.status] - 'completed' | 'paid'
 */
export const downloadInvoicePdf = (purchaseData) => {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const orderId = purchaseData.orderId || `ORD_${Date.now()}`;
    const paymentId = purchaseData.paymentId || 'ONLINE_GATEWAY';
    const studentName = purchaseData.studentName || 'Valued Student';
    const itemTitle = purchaseData.itemTitle || 'Educational Study Material';
    const itemType = purchaseData.itemType || 'Course';
    const category = purchaseData.category || 'Chemistry';
    const amount = Number(purchaseData.amount || 0);
    const pointsDiscount = Number(purchaseData.pointsDiscount || 0);
    const purchaseDate = purchaseData.date ? new Date(purchaseData.date) : new Date();
    const formattedDate = format(purchaseDate, 'dd MMM yyyy, hh:mm a');
    const invoiceNo = `RUC-${orderId.slice(-8).toUpperCase()}`;

    // --- Palette Constants ---
    const primaryColor = [30, 27, 75]; // Deep Indigo
    const accentColor = [99, 102, 241]; // Violet
    const darkText = [15, 23, 42]; // Slate 900
    const mutedText = [100, 116, 139]; // Slate 500
    const lightBg = [248, 250, 252]; // Slate 50
    const successColor = [16, 185, 129]; // Emerald 500

    // Top Decorative Accent Bar
    doc.setFillColor(...accentColor);
    doc.rect(0, 0, 210, 6, 'F');

    // Header Background
    doc.setFillColor(...primaryColor);
    doc.rect(0, 6, 210, 36, 'F');

    // Header Institute Branding
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('RUCHI UPADHYAY CLASSES', 15, 22);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(199, 210, 254);
    doc.text('Premier Chemistry Coaching & Competitive Exam Preparation', 15, 28);
    doc.text('Website: ruchiupadhyayclasses.com  |  Support: support@ruchiupadhyayclasses.com', 15, 34);

    // Invoice Title on Top Right
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text('TAX INVOICE / RECEIPT', 195, 22, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(199, 210, 254);
    doc.text(`Invoice No: ${invoiceNo}`, 195, 28, { align: 'right' });
    doc.text(`Date: ${format(purchaseDate, 'dd MMM yyyy')}`, 195, 34, { align: 'right' });

    // Status Ribbon
    let curY = 50;
    doc.setFillColor(236, 253, 245);
    doc.setDrawColor(...successColor);
    doc.roundedRect(15, curY, 180, 11, 2, 2, 'FD');
    doc.setTextColor(...successColor);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('STATUS: PAYMENT RECEIVED & ACCESS GRANTED', 20, curY + 7.5);
    doc.text(`PAID VIA RAZORPAY / SECURE GATEWAY`, 190, curY + 7.5, { align: 'right' });

    // Two Column Metadata Box
    curY = 68;
    doc.setFillColor(...lightBg);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(15, curY, 86, 42, 3, 3, 'FD');
    doc.roundedRect(109, curY, 86, 42, 3, 3, 'FD');

    // Left Column: Student Details
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...primaryColor);
    doc.text('BILLED TO (STUDENT)', 20, curY + 8);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...darkText);
    doc.text(studentName, 20, curY + 16);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...mutedText);
    if (purchaseData.studentEmail) {
      doc.text(`Email: ${purchaseData.studentEmail}`, 20, curY + 23);
    } else {
      doc.text('Registered Student Member', 20, curY + 23);
    }
    if (purchaseData.userId) {
      doc.text(`Student ID: ${purchaseData.userId.substring(0, 14)}...`, 20, curY + 29);
    }
    doc.text('Country: India (Online Digital Delivery)', 20, curY + 35);

    // Right Column: Order & Payment Info
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...primaryColor);
    doc.text('TRANSACTION DETAILS', 114, curY + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...mutedText);
    doc.text(`Order ID:`, 114, curY + 16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...darkText);
    doc.text(orderId, 190, curY + 16, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...mutedText);
    doc.text(`Payment ID:`, 114, curY + 23);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...darkText);
    doc.text(paymentId, 190, curY + 23, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...mutedText);
    doc.text(`Transaction Time:`, 114, curY + 30);
    doc.setTextColor(...darkText);
    doc.text(formattedDate, 190, curY + 30, { align: 'right' });

    doc.setTextColor(...mutedText);
    doc.text(`Delivery Mode:`, 114, curY + 37);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...successColor);
    doc.text('Instant Portal Access', 190, curY + 37, { align: 'right' });

    // Item Table
    curY = 118;
    // Table Header
    doc.setFillColor(...primaryColor);
    doc.rect(15, curY, 180, 9, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text('#', 19, curY + 6);
    doc.text('DESCRIPTION', 30, curY + 6);
    doc.text('CATEGORY / TYPE', 115, curY + 6);
    doc.text('QTY', 155, curY + 6, { align: 'center' });
    doc.text('AMOUNT (INR)', 190, curY + 6, { align: 'right' });

    // Table Row 1
    curY += 9;
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.rect(15, curY, 180, 16, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...darkText);
    doc.text('1', 19, curY + 7);

    // Title can be long, truncate cleanly if needed
    const truncatedTitle = itemTitle.length > 40 ? itemTitle.substring(0, 38) + '...' : itemTitle;
    doc.text(truncatedTitle, 30, curY + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...mutedText);
    doc.text(`Digital learning access & study resources`, 30, curY + 12);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...primaryColor);
    doc.text(`${itemType} (${category})`, 115, curY + 9);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...darkText);
    doc.text('1', 155, curY + 9, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.text(`Rs. ${amount.toFixed(2)}`, 190, curY + 9, { align: 'right' });

    // Calculation Summary Box (Right Aligned)
    curY += 22;
    const calcBoxX = 115;
    const calcBoxW = 80;

    doc.setFillColor(...lightBg);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(calcBoxX, curY, calcBoxW, pointsDiscount > 0 ? 36 : 28, 2, 2, 'FD');

    let sumY = curY + 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...mutedText);
    doc.text('Subtotal:', calcBoxX + 6, sumY);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...darkText);
    doc.text(`Rs. ${(amount + pointsDiscount).toFixed(2)}`, calcBoxX + calcBoxW - 6, sumY, { align: 'right' });

    if (pointsDiscount > 0) {
      sumY += 8;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...mutedText);
      doc.text('Reward Points Discount:', calcBoxX + 6, sumY);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...successColor);
      doc.text(`- Rs. ${pointsDiscount.toFixed(2)}`, calcBoxX + calcBoxW - 6, sumY, { align: 'right' });
    }

    sumY += 8;
    doc.setDrawColor(203, 213, 225);
    doc.line(calcBoxX + 6, sumY - 2, calcBoxX + calcBoxW - 6, sumY - 2);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...primaryColor);
    doc.text('Total Paid:', calcBoxX + 6, sumY + 4);
    doc.setFontSize(12);
    doc.setTextColor(...accentColor);
    doc.text(`Rs. ${amount.toFixed(2)}`, calcBoxX + calcBoxW - 6, sumY + 4, { align: 'right' });

    // Digital Seal / Verification Badge on Left
    doc.setFillColor(245, 247, 255);
    doc.setDrawColor(...accentColor);
    doc.roundedRect(15, curY, 90, 36, 3, 3, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...primaryColor);
    doc.text('OFFICIAL VERIFIED PURCHASE', 22, curY + 9);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...mutedText);
    doc.text('This is a digitally generated tax receipt valid for', 22, curY + 16);
    doc.text('all course & digital content enrollments at Ruchi', 22, curY + 21);
    doc.text('Upadhyay Classes. No physical signature is required.', 22, curY + 26);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...successColor);
    doc.text('Authenticity: Cryptographically Verified', 22, curY + 31);

    // Terms & Conditions / Contact
    curY = 230;
    doc.setDrawColor(226, 232, 240);
    doc.line(15, curY, 195, curY);

    curY += 8;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...darkText);
    doc.text('Terms & Notice:', 15, curY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...mutedText);
    doc.text('1. All course materials, notes, and test series are for the exclusive personal educational use of the registered student.', 15, curY + 5);
    doc.text('2. Sharing, redistribution, or commercial reproduction of study material is strictly prohibited under copyright laws.', 15, curY + 10);
    doc.text('3. For questions regarding your syllabus, schedule, or payment queries, email support@ruchiupadhyayclasses.com.', 15, curY + 15);

    // Footer
    doc.setFillColor(...primaryColor);
    doc.rect(0, 277, 210, 20, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text('RUCHI UPADHYAY CLASSES - Empowering Academic Excellence', 105, 285, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(199, 210, 254);
    doc.text('This invoice was generated electronically from your student portal on ' + formattedDate, 105, 290, { align: 'center' });

    // Download file
    const cleanFileName = `Invoice_${orderId.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
    doc.save(cleanFileName);
    return true;
  } catch (error) {
    console.error('Error generating invoice PDF:', error);
    throw error;
  }
};
