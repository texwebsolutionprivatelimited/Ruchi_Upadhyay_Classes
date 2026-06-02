import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Download, Award, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { format } from 'date-fns';
const CourseCertificate = ({ courseName, studentName, instructor, completionDate, courseId, }) => {
  const certificateRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const certificateNumber = `CERT-${courseId.slice(0, 8).toUpperCase()}-${format(completionDate, 'yyyyMMdd')}`;
  const downloadCertificate = async () => {
    if (!certificateRef.current)
      return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${courseName.replace(/\s+/g, '_')}_Certificate.pdf`);
    }
    catch (error) {
      console.error('Error generating certificate:', error);
    }
    finally {
      setIsDownloading(false);
    }
  };
  return (<Dialog open={isOpen} onOpenChange={setIsOpen}>
    <DialogTrigger asChild>
      <Button variant="outline" className="gap-2">
        <Award className="w-4 h-4" />
        View Certificate
      </Button>
    </DialogTrigger>
    <DialogContent className="max-w-4xl p-0 overflow-hidden">
      <DialogHeader className="p-4 md:p-6 pb-2 md:pb-6 border-b">
        <DialogTitle className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-lg md:text-xl font-bold">Course Completion Certificate</span>
          <Button onClick={downloadCertificate} disabled={isDownloading} className="w-full sm:w-auto gap-2 h-11 sm:h-auto font-bold">
            {isDownloading ? (<>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>) : (<>
              <Download className="w-4 h-4" />
              Download PDF
            </>)}
          </Button>
        </DialogTitle>
      </DialogHeader>

      <div className="p-4 overflow-auto">
        {/* Certificate Design */}
        <div ref={certificateRef} className="bg-white relative overflow-hidden" style={{
          width: '297mm',
          height: '210mm',
          transform: 'scale(0.35)',
          transformOrigin: 'top left',
          marginBottom: '-130mm',
        }}>
          {/* Decorative Border */}
          <div className="absolute inset-4 border-4 border-amber-600" />
          <div className="absolute inset-6 border-2 border-amber-400" />
          <div className="absolute inset-8 border border-amber-300" />

          {/* Corner Decorations */}
          <svg className="absolute top-12 left-12 w-24 h-24 text-amber-600" viewBox="0 0 100 100">
            <path d="M0,50 Q0,0 50,0 L50,10 Q10,10 10,50 Z" fill="currentColor" />
          </svg>
          <svg className="absolute top-12 right-12 w-24 h-24 text-amber-600 rotate-90" viewBox="0 0 100 100">
            <path d="M0,50 Q0,0 50,0 L50,10 Q10,10 10,50 Z" fill="currentColor" />
          </svg>
          <svg className="absolute bottom-12 left-12 w-24 h-24 text-amber-600 -rotate-90" viewBox="0 0 100 100">
            <path d="M0,50 Q0,0 50,0 L50,10 Q10,10 10,50 Z" fill="currentColor" />
          </svg>
          <svg className="absolute bottom-12 right-12 w-24 h-24 text-amber-600 rotate-180" viewBox="0 0 100 100">
            <path d="M0,50 Q0,0 50,0 L50,10 Q10,10 10,50 Z" fill="currentColor" />
          </svg>

          {/* Content */}
          <div className="relative h-full flex flex-col items-center justify-center px-16 py-12 text-center">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-center gap-4 mb-2">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                  <Award className="w-10 h-10 text-white" />
                </div>
              </div>
              <h1 className="text-5xl font-serif text-amber-800 tracking-wider">
                CERTIFICATE
              </h1>
              <p className="text-2xl text-amber-600 tracking-widest mt-2">
                OF COMPLETION
              </p>
            </div>

            {/* Decorative Line */}
            <div className="w-64 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent mb-8" />

            {/* Body */}
            <p className="text-xl text-gray-600 mb-4">This is to certify that</p>

            <h2 className="text-5xl font-serif text-gray-800 mb-6 font-bold">
              {studentName}
            </h2>

            <p className="text-xl text-gray-600 mb-4">
              has successfully completed the course
            </p>

            <h3 className="text-3xl font-semibold text-amber-700 mb-8 max-w-2xl leading-tight">
              "{courseName}"
            </h3>

            <p className="text-lg text-gray-500 mb-8">
              under the guidance of <span className="font-semibold text-gray-700">{instructor}</span>
            </p>

            {/* Decorative Line */}
            <div className="w-48 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mb-8" />

            {/* Date and Signature */}
            <div className="flex items-end justify-between w-full max-w-3xl mt-4">
              <div className="text-center">
                <div className="w-48 border-b-2 border-gray-400 mb-2" />
                <p className="text-lg text-gray-600">
                  {format(completionDate, 'MMMM dd, yyyy')}
                </p>
                <p className="text-sm text-gray-500">Date of Completion</p>
              </div>

              <div className="text-center">
                <div className="w-48 h-16 flex items-end justify-center">
                  <div className="w-20 h-20 rounded-full border-4 border-amber-600 flex items-center justify-center bg-amber-50">
                    <span className="text-amber-600 font-bold text-xs">VERIFIED</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="w-48 border-b-2 border-gray-400 mb-2" />
                <p className="text-lg font-script text-gray-700 italic">Ruchi Classes</p>
                <p className="text-sm text-gray-500">Authorized Signature</p>
              </div>
            </div>

            {/* Certificate Number */}
            <p className="absolute bottom-16 text-sm text-gray-400">
              Certificate ID: {certificateNumber}
            </p>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>);
};
export default CourseCertificate;
