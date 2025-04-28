import { useState, useEffect } from "react";

export default function ContractModal({ isOpen, onClose, onSave, initialData = {} }) {
  const [formData, setFormData] = useState({
    type: '',
    number: '',
    value: '',
    startDate: '',
    endDate: '',
    notes: '',
    attachment: '',
    category: '',
    status: 'ساري',
    summary: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        type: initialData.type || '',
        number: initialData.number || '',
        value: initialData.value || '',
        startDate: initialData.startDate || '',
        endDate: initialData.endDate || '',
        notes: initialData.notes || '',
        attachment: initialData.attachment || '',
        category: initialData.category || '',
        status: initialData.status || 'ساري',
        summary: initialData.summary || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
        <h2 className="text-xl font-semibold mb-4">{initialData?.number ? "تعديل عقد" : "إضافة عقد"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="type" placeholder="نوع العقد" value={formData.type} onChange={handleChange} className="w-full border rounded p-2" required />
          <input type="text" name="number" placeholder="رقم العقد" value={formData.number} onChange={handleChange} className="w-full border rounded p-2" required />
          <input type="text" name="value" placeholder="القيمة" value={formData.value} onChange={handleChange} className="w-full border rounded p-2" />
          <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full border rounded p-2" />
          <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="w-full border rounded p-2" />
          <input type="text" name="notes" placeholder="ملاحظات" value={formData.notes} onChange={handleChange} className="w-full border rounded p-2" />
          <input type="url" name="attachment" placeholder="رابط المرفق" value={formData.attachment} onChange={handleChange} className="w-full border rounded p-2" />
          <input type="text" name="category" placeholder="تصنيف العقد" value={formData.category} onChange={handleChange} className="w-full border rounded p-2" />
          <select name="status" value={formData.status} onChange={handleChange} className="w-full border rounded p-2">
            <option value="ساري">ساري</option>
            <option value="منتهي">منتهي</option>
            <option value="مفسوخ">مفسوخ</option>
          </select>
          <textarea name="summary" placeholder="ملخص العقد" value={formData.summary} onChange={handleChange} className="w-full border rounded p-2" rows="3"></textarea>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
              إلغاء
            </button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              حفظ
            </button>
          </div>
        </form>

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✖
        </button>
      </div>
    </div>
  );
}
