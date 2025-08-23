// src/components/PDFViewer.jsx
import React, { useState, useEffect } from 'react';
import { DocumentViewer } from '@swapnachalla/document-viewer';
import '@swapnachalla/document-viewer/dist/index.css';
import * as XLSX from 'xlsx';
import { Download } from 'lucide-react';

export default function PDFViewer({ fileUrl, isRtl = true }) {
  const [sheetHtml, setSheetHtml] = useState(null);
  const isXlsx = fileUrl?.toLowerCase().endsWith('.xlsx');

  useEffect(() => {
    if (!isXlsx) return;
    setSheetHtml(null);
    fetch(fileUrl)
      .then((res) => res.arrayBuffer())
      .then((ab) => {
        const wb = XLSX.read(ab, { type: 'array' });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const html = XLSX.utils.sheet_to_html(sheet, { header: '', footer: '' });
        setSheetHtml(html);
      })
      .catch((e) => console.error('XLSX load error:', e));
  }, [fileUrl, isXlsx]);

  const downloadFile = () => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileUrl.split('/').pop() || 'document';
    link.click();
  };

  if (isXlsx) {
    return (
      <div dir={isRtl ? 'rtl' : 'ltr'} className="space-y-4">
        <div className="flex justify-end bg-white p-2 rounded shadow">
          <button onClick={downloadFile} className="text-gray-700 hover:text-blue-600">
            <Download />
          </button>
        </div>
        <div
          className="bg-white p-4 border rounded shadow-md overflow-auto"
          dangerouslySetInnerHTML={{ __html: sheetHtml || '' }}
        />
      </div>
    );
  }

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="space-y-4">
      <div className="bg-white p-4 border rounded shadow-md overflow-auto">
        <DocumentViewer
          key={fileUrl}
          id="viewer-1"
          initialUrl={fileUrl}
          onClose={() => {}}
        />
      </div>
    </div>
  );
}

