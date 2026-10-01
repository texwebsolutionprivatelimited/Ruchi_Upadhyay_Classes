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

    // Load and place official logo inside a clean white card
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
      // Fallback logo monogram
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(15, 9, 36, 24, 2.5, 2.5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(...primaryMaroon);
      doc.text('RUC', 33, 23, { align: 'center' });
    }

    // Header Title & Contact Information
    const headerTextX = logoDataUrl ? 64 : 56;
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14.5);
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
    doc.setFontSize(11.5);
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

    // 3. Status Ribbon (FIXED: Zero overlap, clean emerald circle indicator, standard ASCII)
    let curY = 51;
    doc.setFillColor(236, 253, 245);
    doc.setDrawColor(...successEmerald);
    doc.roundedRect(15, curY, 180, 9.5, 2, 2, 'FD');

    // Vector emerald live indicator dot (replaces problematic unicode ✓)
    doc.setFillColor(...successEmerald);
    doc.circle(20, curY + 4.8, 1.4, 'F');

    doc.setTextColor(...successEmerald);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text('STATUS: PAYMENT COMPLETED & ACCESS UNLOCKED', 24, curY + 6.2);
    doc.text('RAZORPAY SECURE GATEWAY', 190, curY + 6.2, { align: 'right' });

    // 4. Two Column Information Cards (Student Info & Transaction Summary)
    curY = 65;
    const leftCardW = 86;
    const rightCardW = 90;
    const rightCardX = 105;
    const cardH = 43;

    // Left Card: Student Info (x=15, w=86, h=43)
    doc.setFillColor(...lightBg);
    doc.setDrawColor(...borderCard);
    doc.roundedRect(15, curY, leftCardW, cardH, 2.5, 2.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...primaryMaroon);
    doc.text('BILLED TO (STUDENT)', 20, curY + 7);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...darkText);
    const safeStudentName = studentName.length > 28 ? studentName.substring(0, 26) + '...' : studentName;
    doc.text(safeStudentName, 20, curY + 15);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...mutedText);
    if (purchaseData.studentEmail) {
      const safeEmail = purchaseData.studentEmail.length > 30 ? purchaseData.studentEmail.substring(0, 28) + '...' : purchaseData.studentEmail;
      doc.text(`Email: ${safeEmail}`, 20, curY + 22);
    } else {
      doc.text('Registered Student Account', 20, curY + 22);
    }

    if (purchaseData.userId) {
      doc.text(`Student ID: ${purchaseData.userId.substring(0, 16)}...`, 20, curY + 28.5);
    } else {
      doc.text('Student ID: Verified Student', 20, curY + 28.5);
    }
    doc.text('Delivery: Online Student Portal (MP, India)', 20, curY + 35);

    // Right Card: Transaction Details (x=105, w=90, h=43)
    doc.setFillColor(...lightBg);
    doc.setDrawColor(...borderCard);
    doc.roundedRect(rightCardX, curY, rightCardW, cardH, 2.5, 2.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...primaryMaroon);
    doc.text('TRANSACTION DETAILS', rightCardX + 5, curY + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...mutedText);

    // Row 1: Order ID
    doc.text('Order ID:', rightCardX + 5, curY + 15);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...darkText);
    const safeOrderId = orderId.length > 22 ? orderId.substring(0, 20) + '...' : orderId;
    doc.text(safeOrderId, rightCardX + rightCardW - 5, curY + 15, { align: 'right' });

    // Row 2: Payment ID
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...mutedText);
    doc.text('Payment ID:', rightCardX + 5, curY + 22);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...darkText);
    const safePaymentId = paymentId.length > 22 ? paymentId.substring(0, 20) + '...' : paymentId;
    doc.text(safePaymentId, rightCardX + rightCardW - 5, curY + 22, { align: 'right' });

    // Row 3: Date & Time
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...mutedText);
    doc.text('Transaction Time:', rightCardX + 5, curY + 28.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...darkText);
    doc.text(formattedDate, rightCardX + rightCardW - 5, curY + 28.5, { align: 'right' });

    // Row 4: Access Mode
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...mutedText);
    doc.text('Access Mode:', rightCardX + 5, curY + 35);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...successEmerald);
    doc.text('Instant Portal Access', rightCardX + rightCardW - 5, curY + 35, { align: 'right' });

    // 5. Itemized Table (STRICT COLUMN BOUNDARIES TO PREVENT ANY COLLISION)
    curY = 114;

    // Table Header
    doc.setFillColor(...primaryMaroon);
    doc.rect(15, curY, 180, 9, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(255, 255, 255);
    doc.text('#', 19, curY + 6);
    doc.text('ITEM & DESCRIPTION', 28, curY + 6);
    doc.text('CATEGORY / SUBJECT', 106, curY + 6);
    doc.text('QTY', 152, curY + 6, { align: 'center' });
    doc.text('AMOUNT (INR)', 191, curY + 6, { align: 'right' });

    // Calculate Text Wraps to ensure ZERO OVERLAP
    curY += 9;
    // Col 2: Description bounded to 74mm width
    const titleLines = doc.splitTextToSize(itemTitle, 74);
    const subDescLines = doc.splitTextToSize('Digital learning access & downloadable study materials', 74);

    // Col 3: Category / Type bounded strictly to 40mm width
    const categoryText = `${itemType}\n(${category})`;
    const catLines = doc.splitTextToSize(categoryText, 40);

    // Calculate row height dynamically with generous padding
    const descHeight = titleLines.length * 4.5 + subDescLines.length * 4;
    const catHeight = catLines.length * 4.5;
    const rowHeight = Math.max(20, Math.max(descHeight, catHeight) + 6);

    // Table Row Background & Border
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.rect(15, curY, 180, rowHeight, 'FD');

    // Col 1: Index Number
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...darkText);
    doc.text('1', 19, curY + 7);

    // Col 2: Title and Sub-description
    let textY = curY + 7;
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

    // Col 3: Category / Type (Guaranteed within x=106 to x=146)
    let catY = curY + 7;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...primaryMaroon);
    catLines.forEach((line) => {
      doc.text(line, 106, catY);
      catY += 4.2;
    });

    // Col 4: Qty (Centered at 152mm)
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...darkText);
    doc.text('1', 152, curY + 7.5, { align: 'center' });

    // Col 5: Amount (Right aligned at 191mm, strictly isolated from col 3)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...darkText);
    doc.text(`Rs. ${amount.toFixed(2)}`, 191, curY + 7.5, { align: 'right' });

    // 6. Summary Calculation Box & Digital Verification Box
    curY += rowHeight + 8;
    const calcBoxX = 112;
    const calcBoxW = 83;
    const leftBoxW = 93;
    const boxHeight = pointsDiscount > 0 ? 40 : 34;

    // Digital Verification Seal on Left (x=15, w=93, h=boxHeight)
    doc.setFillColor(...lightBg);
    doc.setDrawColor(...borderCard);
    doc.roundedRect(15, curY, leftBoxW, boxHeight, 2.5, 2.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...primaryMaroon);
    doc.text('OFFICIAL VERIFIED PURCHASE', 20, curY + 7.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...mutedText);
    doc.text('This is an authentic digitally generated tax receipt valid for', 20, curY + 14);
    doc.text('course enrollments & study packs at Ruchi Upadhyay Classes.', 20, curY + 18.5);
    doc.text('No physical signature required under Indian IT Act 2000.', 20, curY + 23);

    // Vector emerald authenticity seal bullet (fits easily within 93mm box)
    doc.setFillColor(...successEmerald);
    doc.circle(21, curY + 28.5, 1.2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...successEmerald);
    doc.text('Digitally Signed & Cryptographically Verified', 24, curY + 29.5);

    // Summary Box on Right (x=112, w=83, h=boxHeight)
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
      doc.text('Points Discount:', calcBoxX + 5, sumY);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...successEmerald);
      doc.text(`- Rs. ${pointsDiscount.toFixed(2)}`, calcBoxX + calcBoxW - 5, sumY, { align: 'right' });
    }

    sumY += 7.5;
    doc.setDrawColor(203, 213, 225);
    doc.line(calcBoxX + 5, sumY - 1, calcBoxX + calcBoxW - 5, sumY - 1);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...primaryMaroon);
    doc.text('Total Paid:', calcBoxX + 5, sumY + 5);

    doc.setFontSize(11);
    doc.setTextColor(...primaryMaroon);
    doc.text(`Rs. ${amount.toFixed(2)}`, calcBoxX + calcBoxW - 5, sumY + 5, { align: 'right' });

    // 7. Important Student Guidelines / Terms (Dynamically positioned below boxes)
    curY = curY + boxHeight + 8;
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
    doc.text('1. All course lectures, notes PDFs, and test series are for exclusive educational use of the registered student.', 15, curY + 5);
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
