import { FileText } from 'lucide-react';
import API_CONFIG from '@/config/config';

export default function ArchiveCard({ file, onPreview }) {
  const handlePreview = () => {
    if (onPreview) onPreview(file);
  };

  return (
    <div className="p-4 border rounded bg-white shadow-sm space-y-2">
      <div className="flex items-center gap-3">
        <FileText className="text-red-500 w-6 h-6" />
        <div className="flex-1">
          <h3 className="text-blue-600 font-semibold truncate">{file.number || 'بدون رقم'}</h3>
          <h4 className="text-blue-600 font-semibold truncate">{file.title || 'بدون عنوان'}</h4>
          <p className="text-xs text-gray-500 truncate">{file.extracted_text?.slice(0, 60) || 'لا يوجد نص'}</p>
        </div>
        {file.file_type && (
          <span className="text-[10px] text-gray-500 border px-1 rounded">
            {file.file_type}
          </span>
        )}
      </div>
      {file.file_path && (
        <p className="text-[10px] text-gray-400 truncate">{file.file_path}</p>
      )}
      <div className="flex justify-between text-sm">
        <button onClick={handlePreview} className="text-green-600 hover:underline">
          معاينة
        </button>
        <a
          href={`${API_CONFIG.baseURL}/storage/${file.file_path}`}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 hover:underline"
        >
          تحميل
        </a>
      </div>
    </div>
  );
}
