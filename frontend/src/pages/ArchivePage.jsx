import { useEffect, useState } from "react";
import { getArchiveFiles } from "../services/api/archives";
import { FaFolder, FaFolderOpen, FaChevronDown, FaChevronLeft, FaFilePdf } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";

export default function ArchivePage() {
  const [archives, setArchives] = useState({});
  const [loading, setLoading] = useState(true);
  const [openFolders, setOpenFolders] = useState({}); // لتتبع المجلدات المفتوحة

  useEffect(() => {
    loadArchives();
  }, []);

  const loadArchives = async () => {
    try {
      const res = await getArchiveFiles();
      const files = res?.data?.data || [];

      const grouped = files.reduce((acc, file) => {
        if (!acc[file.model_type]) {
          acc[file.model_type] = [];
        }
        acc[file.model_type].push(file);
        return acc;
      }, {});

      setArchives(grouped);
    } catch (error) {
      console.error(error);
      toast.error("فشل تحميل الملفات 😥");
    } finally {
      setLoading(false);
    }
  };

  const toggleFolder = (modelType) => {
    setOpenFolders(prev => ({
      ...prev,
      [modelType]: !prev[modelType],
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh] text-almadar-green dark:text-almadar-yellow text-lg font-bold">
        جاري التحميل...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <ToastContainer />
      <h1 className="text-3xl font-bold text-center text-almadar-green dark:text-almadar-yellow">
        الأرشيف
      </h1>

      {Object.keys(archives).length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400">
          لا توجد ملفات حالياً.
        </div>
      ) : (
        Object.entries(archives).map(([modelType, files]) => (
          <div key={modelType} className="space-y-4">
            {/* عنوان المجلد */}
            <div
              onClick={() => toggleFolder(modelType)}
              className="flex items-center gap-2 text-xl font-semibold text-almadar-green dark:text-almadar-yellow cursor-pointer"
            >
              {openFolders[modelType] ? <FaFolderOpen /> : <FaFolder />}
              {openFolders[modelType] ? (
                <FaChevronDown className="ml-2" />
              ) : (
                <FaChevronLeft className="ml-2" />
              )}
              <span>{getModelTypeLabel(modelType)}</span>
            </div>

            {/* عرض الملفات داخل المجلد */}
            {openFolders[modelType] && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pl-6">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="p-4 border rounded-lg bg-white dark:bg-gray-800 hover:shadow-lg transition flex items-center gap-4"
                  >
                    <FaFilePdf className="text-red-500 text-2xl" />
                    <div className="flex-1">
                      <a
                        href={`${import.meta.env.VITE_API_URL}/storage/${file.file_path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline block"
                      >
                        {file.title || "ملف بدون عنوان"}
                      </a>
                      <p className="text-sm text-gray-400 mt-1 truncate">
                        {file.extracted_text
                          ? file.extracted_text.substring(0, 60) + "..."
                          : "لا يوجد نص مستخرج"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

// ✅ تحويل model_type إلى اسم واضح للمستخدم
function getModelTypeLabel(modelType) {
  switch (modelType) {
    case "Contract":
      return "عقود";
    case "Consultation":
      return "استشارات";
    case "Case":
      return "قضايا";
    default:
      return modelType;
  }
}
