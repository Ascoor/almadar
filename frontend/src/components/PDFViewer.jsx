import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

// تحديد الـ worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfViewer = ({ fileUrl }) => {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.2);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full">
      {/* أزرار التحكم */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setPageNumber((p) => Math.max(p - 1, 1))}
          disabled={pageNumber <= 1}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          ⬅ Prev
        </button>

        <span>
          Page {pageNumber} of {numPages || "…"}
        </span>

        <button
          onClick={() => setPageNumber((p) => Math.min(p + 1, numPages))}
          disabled={pageNumber >= numPages}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Next ➡
        </button>

        <button
          onClick={() => setScale((s) => s + 0.2)}
          className="ml-4 px-3 py-1 rounded bg-blue-200 hover:bg-blue-300"
        >
          ➕ Zoom
        </button>

        <button
          onClick={() => setScale((s) => Math.max(s - 0.2, 0.6))}
          className="px-3 py-1 rounded bg-blue-200 hover:bg-blue-300"
        >
          ➖ Zoom
        </button>
      </div>

      {/* عارض الـ PDF */}
      <div className="w-full flex justify-center overflow-auto border rounded bg-white shadow">
        <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={pageNumber} scale={scale} />
        </Document>
      </div>
    </div>
  );
};

export default PdfViewer;
