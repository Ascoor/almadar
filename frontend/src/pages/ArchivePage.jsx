import React, { useEffect, useState ,lazy,Suspense} from 'react';

import { getArchiveFiles } from '@/services/api/archives';
import { toast } from 'sonner';
import { FolderKanban, FolderOpenDot, ChevronsDown, ChevronsLeft, FileText } from 'lucide-react';
import API_CONFIG from '@/config/config';
import { ArchiveSection } from '@/assets/icons';

const SectionHeader = lazy(() => import('@/components/common/SectionHeader'));
const PDFViewer = lazy(() => import('@/components/PDFViewer'));
export default function ArchivePage() {
  const [archives, setArchives] = useState({});
  const [openFolders, setOpenFolders] = useState({});
  const [previewFile, setPreviewFile] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await getArchiveFiles();
        const files = res?.data?.data || [];
        const grouped = files.reduce((acc, file) => {
          acc[file.model_type] = acc[file.model_type] || [];
          acc[file.model_type].push(file);
          return acc;
        }, {});
        setArchives(grouped);
      } catch {
        toast.error('فشل تحميل الملفات');
      }
    })();
  }, []);

  const toggleFolder = (type) => {
    setOpenFolders(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const handlePdfPreview = (file) => {
    if (!file?.file_path) {
      toast.error('المسار غير متوفر للملف');
      return;
    }

    const fileUrl = `${API_CONFIG.baseURL}/open-pdf/${file.file_path}`;
    setPreviewFile(fileUrl);
  };

  return (
    <div className="p-6 space-y-8 overflow-y-auto max-h-screen">
     <Suspense fallback={<div className="text-center text-sm">تحميل العنوان...</div>}>
        <SectionHeader icon={ArchiveSection} listName="الأرشيف" />
      </Suspense>

      {Object.keys(archives).length === 0 ? (
        <p className="text-center text-gray-500">لا توجد ملفات حالياً.</p>
      ) : (
        Object.entries(archives).map(([type, files]) => (
          <div key={type}>
            <button onClick={() => toggleFolder(type)} className="flex items-center gap-2 text-xl font-semibold text-blue-700">
              {openFolders[type] ? <FolderOpenDot /> : <FolderKanban />}
              {openFolders[type] ? <ChevronsDown /> : <ChevronsLeft />}
              <span>{getLabel(type)}</span>
            </button>
            {openFolders[type] && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                {files.map((file) => (
                  <div key={file.id} className="p-4 border rounded bg-white shadow-sm space-y-2">
                    <div className="flex items-center gap-3">
                      <FileText className="text-red-500 w-6 h-6" />
                      <div className="flex-1">
                        <h3 className="text-blue-600 font-semibold truncate">{file.number || 'بدون رقم'}</h3>
                        <h4 className="text-blue-600 font-semibold truncate">{file.title || 'بدون عنوان'}</h4>
                        <p className="text-xs text-gray-500 truncate">{file.extracted_text?.slice(0, 60) || 'لا يوجد نص'}</p>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <button onClick={() => handlePdfPreview(file)} className="text-green-600 hover:underline">
                        معاينة
                      </button>
                      <a href={`${API_CONFIG.baseURL}/storage/${file.file_path}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                        تحميل
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
      {previewFile && (
        <div className="mt-10 bg-gray-100 p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">معاينة الملف</h3>
            <button onClick={() => setPreviewFile(null)} className="text-red-500 hover:underline">إغلاق</button>
          </div>
            <Suspense fallback={<div className="text-center text-sm">تحميل عارض PDF...</div>}>
            <PDFViewer fileUrl={previewFile} />
          </Suspense>
        </div>
      )}
    </div>
  );
}

function getLabel(type) {
  return {
    Contract: 'عقود',
    LegalAdvice: 'مشورة أو راي',
    Case: 'قضايا',
  }[type] || type;
}
