import React from 'react';
import { Download, ExternalLink } from 'lucide-react';

export default function PDFViewer({ fileUrl, isRtl = true }) {
  const openInNewTab = () => {
    window.open(fileUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="space-y-4">
      <div className="flex flex-wrap gap-2 justify-between items-center bg-white p-2 rounded shadow">
        <span className="text-sm text-gray-600">
          {isRtl ? 'معاينة الملف في بيئة معزولة' : 'Isolated PDF preview'}
        </span>

        <div className="flex gap-2">
          <a
            href={fileUrl}
            download
            className="text-gray-700 hover:text-blue-600 inline-flex items-center gap-1"
            rel="noopener noreferrer"
          >
            <Download className="h-4 w-4" />
            {isRtl ? 'تنزيل' : 'Download'}
          </a>
          <button
            type="button"
            onClick={openInNewTab}
            className="text-gray-700 hover:text-blue-600 inline-flex items-center gap-1"
          >
            <ExternalLink className="h-4 w-4" />
            {isRtl ? 'فتح في تبويب جديد' : 'Open in new tab'}
          </button>
        </div>
      </div>

      <div className="bg-white p-4 border rounded shadow-md overflow-hidden">
        <iframe
          src={fileUrl}
          title={isRtl ? 'معاينة PDF' : 'PDF preview'}
          className="w-full h-[70vh]"
          loading="lazy"
          sandbox="allow-same-origin allow-downloads allow-forms allow-popups"
          referrerPolicy="no-referrer"
        >
          {isRtl
            ? 'المستعرض لا يدعم معاينة ملفات PDF. يمكنك تنزيل الملف وفتحه محليًا.'
            : 'Your browser does not support inline PDF previews. Please download the file instead.'}
        </iframe>
      </div>
    </div>
  );
}
