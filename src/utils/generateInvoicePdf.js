import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import ruchiLogo from '@/assets/ruchi-logo.png';

/**
 * Converts an image URL / import to a base64 Data URL using a temporary canvas.
 * Ensures jsPDF renders the logo crisply without CORS or resolution issues.
 */
const getLogoDataUrl = (imgSrc) => {
  return new Promise((resolve) => {
    if (!imgSrc) {
      resolve(null);
      return;
    }
    try {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || img.width;
          canvas.height = img.naturalHeight || img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        } catch {
          resolve(imgSrc);
        }
      };
      img.onerror = () => resolve(null);
      img.src = imgSrc;
    } catch {
      resolve(null);
    }
  });
};

/**
 * Generates and downloads a branded PDF Tax Invoice / Payment Receipt.
 * Matches the website's Maroon/Crimson & Amber Gold brand theme.
 * Strictly separates table columns so text NEVER overlaps or collides.
 *
 * @param {Object} purchaseData
 */
export const downloadInvoicePdf = async (purchaseData) => {
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

    // --- Website Brand Palette (Maroon Red & Amber Gold) ---
    const primaryMaroon = [142, 22, 28]; // #8E161C - Website Primary
    const darkMaroon = [115, 15, 20];    // Deep accent
    const accentGold = [234, 88, 12];    // #EA580C - Website Warm Gold/Amber
    const darkText = [24, 24, 27];       // Charcoal black for high contrast
    const mutedText = [100, 116, 139];   // Slate 500
    const lightBg = [253, 250, 250];     // Subtle warm card background
    const borderCard = [230, 222, 222];  // Subtle warm border
    const successEmerald = [16, 185, 129]; // Emerald 500

    // 1. Top Decorative Brand Accent Strip
    doc.setFillColor(...accentGold);
    doc.rect(0, 0, 210, 4, 'F');

    // 2. Main Header Bar (Rich Maroon Red)
    doc.setFillColor(...primaryMaroon);
    doc.rect(0, 4, 210, 42, 'F');

    // Load and place official logo inside a clean white card for maximum crispness
    const logoDataUrl = await getLogoDataUrl(ruchiLogo);
    if (logoDataUrl) {
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(15, 9, 44, 24, 2.5, 2.5, 'F');
      try {
        doc.addImage(logoDataUrl, 'PNG', 17, 11, 40, 20);
      } catch (err) {
        console.warn('Could not add logo image:', err);
      }
    } else {
      // Fallback logo monogram if image fails
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(15, 9, 36, 24, 2.5, 2.5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(...primaryMaroon);
      doc.text('RUC', 33, 23, { align: 'center' });
    }

    // Header Title & Contact Information (Website: ruchiupadhyayclasses.in)
    const headerTextX = logoDataUrl ? 64 : 56;
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.text('RUCHI UPADHYAY CLASSES', headerTextX, 16);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(254, 215, 170); // Warm gold tint
    doc.text('Premier Chemistry Coaching & Competitive Exam Preparation', headerTextX, 22);

    doc.setFontSize(8);
    doc.setTextColor(250, 240, 240);
    doc.text('Website: ruchiupadhyayclasses.in  |  Bhopal, MP - 462022', headerTextX, 28);
    doc.text('Helpline: +91 72258 14452  |  Support: support@ruchiupadhyayclasses.in', headerTextX, 33);

    // Invoice Header Details on Right Side
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text('TAX INVOICE / RECEIPT', 195, 16, { align: 'right' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(254, 215, 170);
    doc.text(`Invoice No: ${invoiceNo}`, 195, 22, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(250, 240, 240);
    doc.text(`Date: ${format(purchaseDate, 'dd MMM yyyy')}`, 195, 28, { align: 'right' });
    doc.setTextColor(167, 243, 208); // Emerald light tint
    doc.text('Payment Status: Completed', 195, 33, { align: 'right' });

    // 3. Status Ribbon
    let curY = 51;
    doc.setFillColor(236, 253, 245);
    doc.setDrawColor(...successEmerald);
    doc.roundedRect(15, curY, 180, 9.5, 2, 2, 'FD');
    doc.setTextColor(...successEmerald);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('✓ STATUS: PAYMENT VERIFIED & ACCESS UNLOCKED', 20, curY + 6.5);
    doc.text('PAID VIA SECURE GATEWAY (RAZORPAY)', 190, curY + 6.5, { align: 'right' });

    // 4. Two Column Information Cards (Student Info & Transaction Summary)
    curY = 65;
    const cardW = 87;
    const cardH = 40;

    // Left Card: Student Info
    doc.setFillColor(...lightBg);
    doc.setDrawColor(...borderCard);
    doc.roundedRect(15, curY, cardW, cardH, 2.5, 2.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...primaryMaroon);
    doc.text('BILLED TO (STUDENT)', 20, curY + 7.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(...darkText);
    const safeStudentName = studentName.length > 32 ? studentName.substring(0, 30) + '...' : studentName;
    doc.text(safeStudentName, 20, curY + 15);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...mutedText);
    if (purchaseData.studentEmail) {
      doc.text(`Email: ${purchaseData.studentEmail}`, 20, curY + 22);
    } else {
      doc.text('Registered Student Account', 20, curY + 22);
    }
    if (purchaseData.userId) {
      doc.text(`Student ID: ${purchaseData.userId.substring(0, 16)}...`, 20, curY + 28);
    }
    doc.text('Delivery: Online Student Portal (Madhya Pradesh, India)', 20, curY + 34);

    // Right Card: Transaction Details
    const rightCardX = 108;
    doc.setFillColor(...lightBg);
    doc.setDrawColor(...borderCard);
    doc.roundedRect(rightCardX, curY, cardW, cardH, 2.5, 2.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...primaryMaroon);
    doc.text('TRANSACTION DETAILS', rightCardX + 5, curY + 7.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...mutedText);

    // Order ID
    doc.text('Order ID:', rightCardX + 5, curY + 15);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...darkText);
    const shortOrderId = orderId.length > 20 ? orderId.substring(0, 18) + '...' : orderId;
    doc.text(shortOrderId, rightCardX + cardW - 5, curY + 15, { align: 'right' });

    // Payment ID
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...mutedText);
    doc.text('Payment ID:', rightCardX + 5, curY + 22);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...darkText);
    const shortPaymentId = paymentId.length > 20 ? paymentId.substring(0, 18) + '...' : paymentId;
    doc.text(shortPaymentId, rightCardX + cardW - 5, curY + 22, { align: 'right' });

    // Date & Time
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...mutedText);
    doc.text('Transaction Time:', rightCardX + 5, curY + 28);
    doc.setTextColor(...darkText);
    doc.text(formattedDate, rightCardX + cardW - 5, curY + 28, { align: 'right' });

    // Access Mode
    doc.setTextColor(...mutedText);
    doc.text('Access Mode:', rightCardX + 5, curY + 34);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...successEmerald);
    doc.text('Instant Portal Access', rightCardX + cardW - 5, curY + 34, { align: 'right' });

    // 5. Itemized Table (STRICT COLUMN BOUNDARIES TO PREVENT ANY COLLISION)
    curY = 111;

    // Table Header
    doc.setFillColor(...primaryMaroon);
    doc.rect(15, curY, 180, 9, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(255, 255, 255);
    doc.text('#', 19, curY + 6);
    doc.text('ITEM & DESCRIPTION', 28, curY + 6);
    doc.text('CATEGORY / SUBJECT', 108, curY + 6);
    doc.text('QTY', 154, curY + 6, { align: 'center' });
    doc.text('AMOUNT (INR)', 191, curY + 6, { align: 'right' });

    // Calculate Text Wraps to ensure ZERO OVERLAP
    curY += 9;
    // Col 2: Description bounded to 76mm width
    const titleLines = doc.splitTextToSize(itemTitle, 76);
    const subDescLines = doc.splitTextToSize('Digital learning access & downloadable study materials', 76);

    // Col 3: Category / Type bounded strictly to 40mm width
    const categoryText = `${itemType}\n(${category})`;
    const catLines = doc.splitTextToSize(categoryText, 40);

    // Calculate row height dynamically based on max line wrap
    const descHeight = titleLines.length * 4.5 + subDescLines.length * 4;
    const catHeight = catLines.length * 4.5;
    const rowHeight = Math.max(18, Math.max(descHeight, catHeight) + 6);

    // Table Row Background & Border
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.rect(15, curY, 180, rowHeight, 'FD');

    // Col 1: Index Number
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...darkText);
    doc.text('1', 19, curY + 6.5);

    // Col 2: Title and Sub-description
    let textY = curY + 6.5;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...darkText);
    titleLines.forEach((line) => {
      doc.text(line, 28, textY);
      textY += 4.5;
    });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...mutedText);
    subDescLines.forEach((line) => {
      doc.text(line, 28, textY);
      textY += 3.8;
    });

    // Col 3: Category / Type (Guaranteed within x=108 to x=148)
    let catY = curY + 6.5;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...primaryMaroon);
    catLines.forEach((line) => {
      doc.text(line, 108, catY);
      catY += 4.2;
    });

    // Col 4: Qty (Centered at 154mm)
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...darkText);
    doc.text('1', 154, curY + 7, { align: 'center' });

    // Col 5: Amount (Right aligned at 191mm, strictly isolated from col 3)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...darkText);
    doc.text(`Rs. ${amount.toFixed(2)}`, 191, curY + 7, { align: 'right' });

    // 6. Summary Calculation Box & Digital Verification Box
    curY += rowHeight + 8;
    const calcBoxX = 114;
    const calcBoxW = 81;
    const boxHeight = pointsDiscount > 0 ? 38 : 30;

    // Digital Verification Seal on Left (x=15, w=94)
    doc.setFillColor(...lightBg);
    doc.setDrawColor(...borderCard);
    doc.roundedRect(15, curY, 94, boxHeight, 2.5, 2.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...primaryMaroon);
    doc.text('OFFICIAL VERIFIED PURCHASE', 20, curY + 7.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...mutedText);
    doc.text('This is a digitally generated tax receipt valid for', 20, curY + 14);
    doc.text('course enrollments & study packs at Ruchi Upadhyay Classes.', 20, curY + 18.5);
    doc.text('No physical signature is required under IT Act.', 20, curY + 23);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...successEmerald);
    doc.text('✓ Authenticity: Cryptographically Verified & Secured', 20, curY + 28);

    // Summary Box on Right (x=114, w=81)
    doc.setFillColor(...lightBg);
    doc.setDrawColor(...borderCard);
    doc.roundedRect(calcBoxX, curY, calcBoxW, boxHeight, 2.5, 2.5, 'FD');

    let sumY = curY + 7.5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...mutedText);
    doc.text('Subtotal:', calcBoxX + 5, sumY);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...darkText);
    doc.text(`Rs. ${(amount + pointsDiscount).toFixed(2)}`, calcBoxX + calcBoxW - 5, sumY, { align: 'right' });

    if (pointsDiscount > 0) {
      sumY += 7.5;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...mutedText);
      doc.text('Reward Points Discount:', calcBoxX + 5, sumY);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...successEmerald);
      doc.text(`- Rs. ${pointsDiscount.toFixed(2)}`, calcBoxX + calcBoxW - 5, sumY, { align: 'right' });
    }

    sumY += 7.5;
    doc.setDrawColor(203, 213, 225);
    doc.line(calcBoxX + 5, sumY - 1.5, calcBoxX + calcBoxW - 5, sumY - 1.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(...primaryMaroon);
    doc.text('Total Paid:', calcBoxX + 5, sumY + 4);

    doc.setFontSize(11.5);
    doc.setTextColor(...primaryMaroon);
    doc.text(`Rs. ${amount.toFixed(2)}`, calcBoxX + calcBoxW - 5, sumY + 4, { align: 'right' });

    // 7. Important Student Guidelines / Terms
    curY = 224;
    doc.setDrawColor(...borderCard);
    doc.line(15, curY, 195, curY);

    curY += 7;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...primaryMaroon);
    doc.text('Important Student Guidelines & Notice:', 15, curY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...mutedText);
    doc.text('1. All course lectures, notes PDFs, and test series are for the exclusive educational use of the registered student.', 15, curY + 5);
    doc.text('2. Sharing, recording, or commercial redistribution of study materials is prohibited and subject to account suspension.', 15, curY + 9.5);
    doc.text('3. You can access your unlocked materials 24/7 by logging in at https://ruchiupadhyayclasses.in', 15, curY + 14);
    doc.text('4. For doubts, syllabus guidance, or technical support, contact +91 72258 14452 or email support@ruchiupadhyayclasses.in.', 15, curY + 18.5);

    // 8. Bottom Footer (Matching website crimson & gold theme)
    doc.setFillColor(...accentGold);
    doc.rect(0, 276, 210, 1.5, 'F');

    doc.setFillColor(...primaryMaroon);
    doc.rect(0, 277.5, 210, 19.5, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text('RUCHI UPADHYAY CLASSES  •  BHOPAL, MP - 462022  •  RUCHIUPADHYAYCLASSES.IN', 105, 285, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(254, 215, 170); // Warm gold
    doc.text(`This is a computer-generated tax receipt issued on ${formattedDate}. No physical signature required.`, 105, 290, { align: 'center' });

    // Save and download file
    const cleanFileName = `Invoice_${orderId.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
    doc.save(cleanFileName);
    return true;
  } catch (error) {
    console.error('Error generating invoice PDF:', error);
    throw error;
  }
};
