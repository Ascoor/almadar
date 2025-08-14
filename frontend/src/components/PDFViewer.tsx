import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Download, 
  ChevronLeft, 
  ChevronRight,
  Loader2 
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  file: string | File | Uint8Array;
  className?: string;
  showControls?: boolean;
  initialPage?: number;
  onLoadSuccess?: (pdf: any) => void;
  onLoadError?: (error: Error) => void;
}

export function PDFViewer({
  file,
  className,
  showControls = true,
  initialPage = 1,
  onLoadSuccess,
  onLoadError,
}: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(initialPage);
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
    onLoadSuccess?.({ numPages });
  };

  const onDocumentLoadError = (error: Error) => {
    setLoading(false);
    setError('فشل في تحميل الملف');
    onLoadError?.(error);
  };

  const goToPrevPage = () => {
    setPageNumber(Math.max(1, pageNumber - 1));
  };

  const goToNextPage = () => {
    setPageNumber(Math.min(numPages, pageNumber + 1));
  };

  const zoomIn = () => {
    setScale(Math.min(3, scale + 0.25));
  };

  const zoomOut = () => {
    setScale(Math.max(0.5, scale - 0.25));
  };

  const rotate = () => {
    setRotation((rotation + 90) % 360);
  };

  const downloadPDF = () => {
    if (typeof file === 'string') {
      const link = document.createElement('a');
      link.href = file;
      link.download = `document-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const goToPage = (page: number) => {
    const pageNum = Math.max(1, Math.min(numPages, page));
    setPageNumber(pageNum);
  };

  if (error) {
    return (
      <div className={cn("flex items-center justify-center h-96 border rounded-lg", className)}>
        <div className="text-center text-muted-foreground">
          <p className="text-lg font-medium">{error}</p>
          <p className="text-sm mt-2">تأكد من صحة الملف وحاول مرة أخرى</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {showControls && (
        <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToPrevPage} disabled={pageNumber <= 1}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={pageNumber}
                onChange={(e) => goToPage(Number(e.target.value))}
                className="w-16 text-center"
                min={1}
                max={numPages}
              />
              <span className="text-sm text-muted-foreground">من {numPages}</span>
            </div>
            
            <Button variant="outline" size="sm" onClick={goToNextPage} disabled={pageNumber >= numPages}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={zoomOut} disabled={scale <= 0.5}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            
            <span className="text-sm px-2 min-w-16 text-center">
              {Math.round(scale * 100)}%
            </span>
            
            <Button variant="outline" size="sm" onClick={zoomIn} disabled={scale >= 3}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            
            <Button variant="outline" size="sm" onClick={rotate}>
              <RotateCw className="h-4 w-4" />
            </Button>
            
            <Button variant="outline" size="sm" onClick={downloadPDF}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <div className="border rounded-lg overflow-auto bg-gray-100 dark:bg-gray-900">
        <div className="flex justify-center p-4">
          {loading && (
            <div className="flex items-center justify-center h-96">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="mr-2">جاري تحميل الملف...</span>
            </div>
          )}
          
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading=""
            error=""
            noData=""
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Page
                pageNumber={pageNumber}
                scale={scale}
                rotate={rotation}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="shadow-lg"
              />
            </motion.div>
          </Document>
        </div>
      </div>
    </div>
  );
}