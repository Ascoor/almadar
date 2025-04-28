import { useEffect, useState } from "react";
import { FaChevronDown, FaChevronRight, FaPlus } from "react-icons/fa";
import { getInvestigations, createInvestigationAction } from "@/services/api/investigations"; // تأكد المسار
import { toast } from "react-toastify";

export default function InvestigationsTabler() {
  const [investigations, setInvestigations] = useState([]);
  const [expandedInvestigationId, setExpandedInvestigationId] = useState(null);
  const [newAction, setNewAction] = useState({}); // بيانات الإجراء الجديد
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvestigations();
  }, []);

  const loadInvestigations = async () => {
    try {
      const res = await getInvestigations(); 
      setInvestigations(res?.data?.data || []);
    } catch (error) {
      console.error(error);
      toast.error("فشل تحميل التحقيقات");
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedInvestigationId(expandedInvestigationId === id ? null : id);
    setNewAction({}); // تصفير بيانات الإضافة عند التغيير
  };

  const handleAddAction = async (investigationId) => {
    try {
      await createInvestigationAction(investigationId, newAction);
      toast.success("تم إضافة الإجراء بنجاح");
      loadInvestigations();
      setExpandedInvestigationId(null); // إغلاق بعد الحفظ
    } catch (error) {
      console.error(error);
      toast.error("فشل في إضافة الإجراء");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40 text-almadar-green dark:text-almadar-yellow font-bold">
        جاري التحميل...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#046c4e] border-b-2 pb-2">
        التحقيقات
      </h1>

      {investigations.length === 0 ? (
        <p className="text-center text-gray-400">لا توجد تحقيقات حالياً.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-center border border-gray-300">
            <thead className="bg-[#e7f5f0] text-[#046c4e] font-semibold">
              <tr>
                <th>الموظف</th>
                <th>الجهة المحيلة</th>
                <th>الموضوع</th>
                <th>رقم القضية</th>
                <th>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {investigations.map((inv) => (
                <>
                  <tr
                    key={inv.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleExpand(inv.id)}
                  >
                    <td className="border px-2 py-3 flex items-center gap-2">
                      {expandedInvestigationId === inv.id ? (
                        <FaChevronDown />
                      ) : (
                        <FaChevronRight />
                      )}
                      {inv.employee_name}
                    </td>
                    <td className="border px-2 py-3">{inv.source}</td>
                    <td className="border px-2 py-3">{inv.subject}</td>
                    <td className="border px-2 py-3">{inv.case_number}</td>
                    <td className="border px-2 py-3 font-semibold text-red-600">{inv.status}</td>
                  </tr>

                  {expandedInvestigationId === inv.id && (
                    <tr>
                      <td colSpan="5" className="p-4 bg-gray-50">
                        {/* عرض الإجراءات */}
                        <h3 className="text-lg font-bold mb-3 text-[#046c4e]">الإجراءات المرتبطة</h3>

                        {inv.actions && inv.actions.length > 0 ? (
                          <table className="min-w-full text-xs mb-4">
                            <thead className="bg-gray-200">
                              <tr>
                                <th>التاريخ</th>
                                <th>نوع الإجراء</th>
                                <th>القائم بالإجراء</th>
                                <th>المطلوب</th>
                                <th>النتيجة</th>
                                <th>الحالة</th>
                              </tr>
                            </thead>
                            <tbody>
                              {inv.actions.map((act) => (
                                <tr key={act.id}>
                                  <td className="border px-2 py-1">{act.action_date}</td>
                                  <td className="border px-2 py-1">{act.action_type}</td>
                                  <td className="border px-2 py-1">{act.officer_name}</td>
                                  <td className="border px-2 py-1">{act.requirements || "-"}</td>
                                  <td className="border px-2 py-1">{act.results || "-"}</td>
                                  <td className="border px-2 py-1">{act.status}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <p className="text-gray-400 mb-4">لا توجد إجراءات بعد.</p>
                        )}

                        {/* إضافة إجراء جديد */}
                        <div className="border-t pt-4">
                          <h4 className="text-md font-semibold mb-2">➕ إضافة إجراء جديد:</h4>
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              handleAddAction(inv.id);
                            }}
                            className="grid grid-cols-2 gap-3"
                          >
                            <input
                              type="date"
                              placeholder="التاريخ"
                              className="border p-2 rounded"
                              required
                              onChange={(e) => setNewAction({ ...newAction, action_date: e.target.value })}
                            />
                            <input
                              type="text"
                              placeholder="نوع الإجراء"
                              className="border p-2 rounded"
                              required
                              onChange={(e) => setNewAction({ ...newAction, action_type: e.target.value })}
                            />
                            <input
                              type="text"
                              placeholder="اسم القائم بالإجراء"
                              className="border p-2 rounded"
                              required
                              onChange={(e) => setNewAction({ ...newAction, officer_name: e.target.value })}
                            />
                            <input
                              type="text"
                              placeholder="المطلوب (اختياري)"
                              className="border p-2 rounded"
                              onChange={(e) => setNewAction({ ...newAction, requirements: e.target.value })}
                            />
                            <input
                              type="text"
                              placeholder="النتيجة (اختياري)"
                              className="border p-2 rounded"
                              onChange={(e) => setNewAction({ ...newAction, results: e.target.value })}
                            />
                            <select
                              className="border p-2 rounded"
                              required
                              onChange={(e) => setNewAction({ ...newAction, status: e.target.value })}
                            >
                              <option value="">اختر الحالة</option>
                              <option value="pending">معلق</option>
                              <option value="in_review">قيد المراجعة</option>
                              <option value="done">منجز</option>
                            </select>

                            <div className="col-span-2 text-left">
                              <button
                                type="submit"
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                              >
                                حفظ الإجراء
                              </button>
                            </div>
                          </form>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
