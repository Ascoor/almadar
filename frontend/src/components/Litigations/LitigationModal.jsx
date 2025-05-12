import  { useState, useEffect } from "react";
import { toast } from "sonner";
import { createLitigation, updateLitigation } from "../../services/api/litigations";

const LitigationModal = ({ isOpen, onClose, initialData = null, reloadLitigations }) => {
  const [form, setForm] = useState({
    id: null,
    case_number: "",
    court: "",
    opponent: "",
    scope: "from",
    subject: "",
    filing_date: "",
    status: "open",
    notes: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && initialData) {
      setForm({
        id: initialData.id,
        case_number: initialData.case_number || "",
        court: initialData.court || "",
        opponent: initialData.opponent || "",
        scope: initialData.scope || "from",
        subject: initialData.subject || "",
        filing_date: initialData.filing_date ? initialData.filing_date.slice(0, 10) : "",
        status: initialData.status || "open",
        notes: initialData.notes || "",
      });
    } else {
      resetForm();
    }
  }, [isOpen, initialData]);

  const resetForm = () => {
    setForm({
      id: null,
      case_number: "",
      court: "",
      opponent: "",
      scope: "from",
      subject: "",
      filing_date: "",
      status: "open",
      notes: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = { ...form };

      if (form.id) {
        await updateLitigation(form.id, payload);
        toast.success("✅ تم تعديل الدعوى بنجاح");
      } else {
        await createLitigation(payload);
        toast.success("✅ تم إضافة الدعوى بنجاح");
      }

      reloadLitigations?.();
      onClose();
      resetForm();
    } catch (error) {
      const errors = error?.response?.data?.errors;
      if (errors) {
        Object.values(errors).forEach((msgs) => {
          msgs.forEach((msg) => toast.error(`❌ ${msg}`));
        });
      } else {
        toast.error("❌ فشل الحفظ. تحقق من البيانات.");
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
      <div className="bg-card text-card-foreground rounded-xl shadow-xl w-full max-w-3xl p-6 relative">
        {loading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-xl">
            <p className="text-lg font-semibold text-primary animate-pulse">
              جاري الحفظ...
            </p>
          </div>
        )}

        <h2 className="text-2xl font-bold mb-6 text-primary">
          {initialData ? "تعديل دعوى" : "إضافة دعوى"}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              label: "صفة الشركة",
              name: "scope",
              type: "select",
              options: [
                { value: "from", label: "من الشركة" },
                { value: "against", label: "ضد الشركة" },
              ],
            },
            { label: "رقم الدعوى", name: "case_number" },
            { label: "المحكمة", name: "court" },
            { label: "الخصم", name: "opponent" },
            { label: "الموضوع", name: "subject" },
            { label: "تاريخ رفع الدعوى", name: "filing_date", type: "date" },
            {
              label: "الحالة",
              name: "status",
              type: "select",
              options: [
                { value: "open", label: "مفتوحة" },
                { value: "in_progress", label: "قيد التنفيذ" },
                { value: "closed", label: "مغلقة" },
              ],
            },
          ].map(({ label, name, type = "text", options }) => (
            <div key={name}>
              <label className="block text-sm mb-1 text-muted-foreground">{label}</label>
              {type === "select" ? (
                <select
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                >
                  {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                />
              )}
            </div>
          ))}

          <div className="md:col-span-2">
            <label className="block text-sm mb-1 text-muted-foreground">ملاحظات</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
            />
          </div>

          <div className="md:col-span-2 flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-lg ${
                initialData ? "bg-primary" : "bg-success"
              } text-${initialData ? "primary-foreground" : "success-foreground"} hover:opacity-90 font-bold transition`}
            >
              {initialData ? "تحديث" : "إضافة"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LitigationModal;
