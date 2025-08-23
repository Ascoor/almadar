// src/components/PDFViewer.jsx

import React, { useState } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw, Download } from 'lucide-react';

export default function PDFViewer({ fileUrl, isRtl = true }) {
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);

  const downloadPdf = () => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = 'document.pdf';
    link.click();
  };

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-2 justify-between items-center bg-white p-2 rounded shadow">
        <div className="flex gap-2">
          <button
            onClick={() => setPageNumber((p) => Math.max(p - 1, 1))}
            disabled={pageNumber <= 1}
            className="text-gray-700 hover:text-blue-600"
          >
         <ChevronRight />  
          </button>
          <span className="text-sm px-2">
            {isRtl ? `الصفحة ${pageNumber}` : `Page ${pageNumber}`}
          </span>
          <button
            onClick={() => setPageNumber((p) => p + 1)}
            className="text-gray-700 hover:text-blue-600"
          >
             <ChevronLeft />
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setScale((s) => Math.min(s + 0.25, 3))}
            className="text-gray-700 hover:text-green-600"
          >
            <ZoomIn />
          </button>
          <button
            onClick={() => setScale((s) => Math.max(s - 0.25, 0.5))}
            className="text-gray-700 hover:text-red-600"
          >
            <ZoomOut />
          </button>
          <button
            onClick={() => setRotation((r) => (r + 90) % 360)}
            className="text-gray-700 hover:text-purple-600"
          >
            <RotateCw />
          </button>
          <button
            onClick={downloadPdf}
            className="text-gray-700 hover:text-blue-600"
          >
            <Download />
          </button>
        </div>
      </div>

      {/* PDF Document */}
      <div className="bg-white p-4 border rounded shadow-md overflow-auto">
        <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
          <Viewer
            fileUrl={fileUrl}
            defaultScale={scale}
            rotation={rotation}
          />
        </Worker>
      </div>
    </div>
  );
}
