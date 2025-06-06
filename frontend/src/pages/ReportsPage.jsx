import React, { useState, useEffect } from 'react';
import { getActionReports } from '@/services/api/reports'; // استيراد دالة الحصول على البيانات من API
import { toast } from 'sonner';

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [contractType, setContractType] = useState('all'); // لفلاتر العقود: دولي / محلي
  const [employeeName, setEmployeeName] = useState('');
  const [procedureType, setProcedureType] = useState('');
  const [caseStatus, setCaseStatus] = useState('');
  const [selectedSection, setSelectedSection] = useState('all'); // للتحكم في الفلترة حسب الأقسام

  useEffect(() => {
    const loadReports = async () => {
      try {
        const response = await getActionReports({
          searchTerm,
          startDate,
          endDate,
          contractType,
          employeeName,
          procedureType,
          caseStatus,
          selectedSection,
        });
        setReports(response.data); // وضع البيانات في الحالة
      } catch (err) {
        toast.error('فشل تحميل البيانات');
      }
    };
    loadReports();
  }, [
    searchTerm,
    startDate,
    endDate,
    contractType,
    employeeName,
    procedureType,
    caseStatus,
    selectedSection,
  ]);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    if (name === 'startDate') setStartDate(value);
    else if (name === 'endDate') setEndDate(value);
  };
  const handleSectionChange = (e) => setSelectedSection(e.target.value);

  // فلاتر القسم الخاص بالعقود
  const handleContractTypeChange = (e) => setContractType(e.target.value);
  // فلاتر قسم التحقيقات
  const handleEmployeeNameChange = (e) => setEmployeeName(e.target.value);
  const handleProcedureTypeChange = (e) => setProcedureType(e.target.value);
  // فلاتر قسم القضايا
  const handleCaseStatusChange = (e) => setCaseStatus(e.target.value);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-10">
      <h2 className="text-2xl font-bold mb-4">التقارير والإجراءات</h2>

      {/* الفلاتر العامة */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <input
            type="text"
            placeholder="بحث عن اسم الشركة أو رقم العقد"
            value={searchTerm}
            onChange={handleSearchChange}
            className="border p-2 rounded w-1/3"
          />
          <div className="flex gap-4">
            <input
              type="date"
              name="startDate"
              value={startDate}
              onChange={handleDateChange}
              className="border p-2 rounded"
            />
            <input
              type="date"
              name="endDate"
              value={endDate}
              onChange={handleDateChange}
              className="border p-2 rounded"
            />
            <select
              value={selectedSection}
              onChange={handleSectionChange}
              className="border p-2 rounded"
            >
              <option value="all">كل الأقسام</option>
              <option value="contracts">العقود</option>
              <option value="investigations">التحقيقات</option>
              <option value="litigations">القضايا</option>
            </select>
          </div>
        </div>
      </div>

      {/* الفلاتر الخاصة بكل قسم */}
      {selectedSection === 'contracts' && (
        <div className="space-y-4">
          <div>
            <label>فئة العقد</label>
            <select
              value={contractType}
              onChange={handleContractTypeChange}
              className="border p-2 rounded w-full"
            >
              <option value="all">الكل</option>
              <option value="local">محلي</option>
              <option value="international">دولي</option>
            </select>
          </div>
        </div>
      )}

      {selectedSection === 'investigations' && (
        <div className="space-y-4">
          <div>
            <label>اسم الموظف</label>
            <input
              type="text"
              value={employeeName}
              onChange={handleEmployeeNameChange}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label>نوع الإجراء</label>
            <input
              type="text"
              value={procedureType}
              onChange={handleProcedureTypeChange}
              className="border p-2 rounded w-full"
            />
          </div>
        </div>
      )}

      {selectedSection === 'litigations' && (
        <div className="space-y-4">
          <div>
            <label>حالة الإجراء</label>
            <select
              value={caseStatus}
              onChange={handleCaseStatusChange}
              className="border p-2 rounded w-full"
            >
              <option value="">الكل</option>
              <option value="pending">معلق</option>
              <option value="completed">مكتمل</option>
              <option value="cancelled">ملغي</option>
            </select>
          </div>
        </div>
      )}

      {/* عرض التقارير في جدول */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">اسم الشركة</th>
              <th className="p-2 border">رقم العقد</th>
              <th className="p-2 border">القسم</th>
              <th className="p-2 border">تاريخ الإجراء</th>
              <th className="p-2 border">تعليقات</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id} className="odd:bg-gray-50">
                <td className="p-2 border">{report.companyName}</td>
                <td className="p-2 border">{report.contractNumber}</td>
                <td className="p-2 border">{report.section}</td>
                <td className="p-2 border">{report.actionDate}</td>
                <td className="p-2 border">{report.comments}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportsPage;
