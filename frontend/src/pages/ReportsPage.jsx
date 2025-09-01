import React, { useState, useEffect } from 'react';
import { getActionReports } from '@/services/api/reports'; // استيراد دالة الحصول على البيانات من API
import { toast } from 'sonner';
import FormField from '@/components/form/FormField';
import ThemeToggle from '@/components/common/ThemeToggle';
import LanguageToggle from '@/components/common/LanguageToggle';
import { useLanguage } from '@/context/LanguageContext';

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
  const { lang } = useLanguage();

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
      <div className="flex justify-end gap-2">
        <LanguageToggle />
        <ThemeToggle />
      </div>
      <h2 className="text-2xl font-bold mb-4">
        {lang === 'ar' ? 'التقارير والإجراءات' : 'Reports & Actions'}
      </h2>

      {/* الفلاتر العامة */}
      <div className="space-y-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <FormField
            name="search"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder={{
              ar: 'بحث عن اسم الشركة أو رقم العقد',
              en: 'Search company or contract number',
            }}
            label={{ ar: 'بحث', en: 'Search' }}
            className="md:w-1/3"
          />
          <div className="flex gap-4 flex-1">
            <FormField
              type="date"
              name="startDate"
              value={startDate}
              onChange={handleDateChange}
              label={{ ar: 'من', en: 'From' }}
              className="flex-1"
            />
            <FormField
              type="date"
              name="endDate"
              value={endDate}
              onChange={handleDateChange}
              label={{ ar: 'إلى', en: 'To' }}
              className="flex-1"
            />
            <FormField
              type="select"
              name="selectedSection"
              value={selectedSection}
              onChange={handleSectionChange}
              label={{ ar: 'القسم', en: 'Section' }}
              options={[
                { value: 'all', label: { ar: 'كل الأقسام', en: 'All sections' } },
                { value: 'contracts', label: { ar: 'العقود', en: 'Contracts' } },
                { value: 'investigations', label: { ar: 'التحقيقات', en: 'Investigations' } },
                { value: 'litigations', label: { ar: 'القضايا', en: 'Litigations' } },
              ]}
              className="flex-1"
            />
          </div>
        </div>
      </div>

      {/* الفلاتر الخاصة بكل قسم */}
      {selectedSection === 'contracts' && (
        <div className="space-y-4">
          <FormField
            type="select"
            name="contractType"
            value={contractType}
            onChange={handleContractTypeChange}
            label={{ ar: 'فئة العقد', en: 'Contract Category' }}
            options={[
              { value: 'all', label: { ar: 'الكل', en: 'All' } },
              { value: 'local', label: { ar: 'محلي', en: 'Local' } },
              { value: 'international', label: { ar: 'دولي', en: 'International' } },
            ]}
          />
        </div>
      )}

      {selectedSection === 'investigations' && (
        <div className="space-y-4">
          <FormField
            name="employeeName"
            value={employeeName}
            onChange={handleEmployeeNameChange}
            label={{ ar: 'اسم الموظف', en: 'Employee Name' }}
          />
          <FormField
            name="procedureType"
            value={procedureType}
            onChange={handleProcedureTypeChange}
            label={{ ar: 'نوع الإجراء', en: 'Procedure Type' }}
          />
        </div>
      )}

      {selectedSection === 'litigations' && (
        <div className="space-y-4">
          <FormField
            type="select"
            name="caseStatus"
            value={caseStatus}
            onChange={handleCaseStatusChange}
            label={{ ar: 'حالة الإجراء', en: 'Procedure Status' }}
            options={[
              { value: '', label: { ar: 'الكل', en: 'All' } },
              { value: 'pending', label: { ar: 'معلق', en: 'Pending' } },
              { value: 'completed', label: { ar: 'مكتمل', en: 'Completed' } },
              { value: 'cancelled', label: { ar: 'ملغي', en: 'Cancelled' } },
            ]}
          />
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
