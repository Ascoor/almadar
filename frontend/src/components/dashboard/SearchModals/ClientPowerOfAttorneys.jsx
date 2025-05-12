import  { useState, useEffect } from 'react';
import { getPowerOfAttorneysByClient } from '../../../services/api/clients';
import AddEditAttorneysModal from '../../Attorneys/AddEditAttorneysModal';
import { getAttorneyTypes, deletePowerAttorney } from '../../../services/api/powerAttorneys';
import TableComponent from '../../common/TableComponent'; // Assuming you have a TableComponent
import { useNavigate } from 'react-router-dom'; // Import useNavigate
 
const ClientPowerOfAttorneys = ({ activeTab, selectedClient }) => {
  const [attorneys, setAttorneys] = useState([]);
  const [attorneyTypes, setAttorneyTypes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAttorney, setSelectedAttorney] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  // جلب قائمة التوكيلات
  const fetchAttorneys = async () => {
    if (!selectedClient) return;

    setIsLoading(true);
    try {
      const response = await getPowerOfAttorneysByClient(selectedClient.id);
      if (Array.isArray(response.data)) {
        setAttorneys(response.data);
      } else {
        setAttorneys([]);
      }
    } catch (error) {
      console.error("Error fetching attorneys:", error);
      setAttorneys([]);
    } finally {
      setIsLoading(false);
    }
  };

  // جلب أنواع التوكيلات
  const fetchAttorneyTypes = async () => {
    try {
      const response = await getAttorneyTypes();
      if (Array.isArray(response.data)) {
        setAttorneyTypes(response.data);
      } else {
        setAttorneyTypes([]);
      }
    } catch (error) {
      console.error("Error fetching attorney types:", error);
      setAttorneyTypes([]);
    }
  };

  useEffect(() => {
    fetchAttorneys();
    fetchAttorneyTypes();
  }, [selectedClient]);

  const handleEdit = (id) => {
    const attorney = attorneys.find((attorney) => attorney.id === id);
    setSelectedAttorney(attorney);
    setIsEditing(true);
    setShowModal(true); // Open the modal
  };

  const handleDelete = async (attorneyId) => {
    try {
      await deletePowerAttorney(attorneyId);
      setAttorneys((prevState) => prevState.filter((attorney) => attorney.id !== attorneyId));
    } catch (error) {
      console.error('Error deleting attorney:', error);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'سارى':
        return 'bg-green-500 text-white';
      case 'ملغى':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const headers = [
    { key: 'slug', text: 'الرقم بالمكتب' },
    { key: 'attorney_number', text: 'رقم التصديق' },
    { key: 'attorney_date_start', text: 'التاريخ' },
    { key: 'attorney_type', text: 'النوع', render: (attorney) => attorney.attorney_type?.name },
    { key: 'title', text: 'الفئة' },
    { key: 'status', text: 'الحالة', render: (attorney) => <span className={`px-2 py-1 rounded-full ${getStatusClass(attorney.status)}`}>{attorney.status}</span> },
 
  ];

  const handleAddClick = () => { 
    setIsEditing(false);
    setShowModal(true);
  };

  // إغلاق المودال 
    const handleModalClose = () => {
      setShowModal(false);
      setSelectedAttorney(null); // إعادة تعيين بيانات التوكيل المحدد
      setIsEditing(false); // التأكد من أن الحالة تعود إلى وضع الإضافة
      fetchAttorneys(); // تحديث قائمة التوكيلات
    };
    
  const customRenderers = {
    status: (attorney) => <span className={`px-2 py-1 rounded-full ${getStatusClass(attorney.status)}`}>{attorney.status}</span>,
    attorney_type: (attorney) => attorney.attorney_type?.name,
 
  };


  return (
    <div>
      {activeTab === "clientPowerOfAttorneys" && (
        <div className="min-h-screen p-4">
          <div className="text-center justify-center mt-4">
            <h1 className="text-2xl text-center font-bold text-gray-500 dark:text-gray-100">
              توكيلات العميل
            </h1>
            <h2 className="text-2xl text-center font-bold text-gray-800 dark:text-almadar-orange-light">
              {selectedClient ? selectedClient.name : ""}
            </h2>
          </div>

          <div className="flex justify-start items-center mb-4">
            <button
              onClick={handleAddClick}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              إضافة توكيل جديد
            </button>
          </div>

          {isLoading ? (
            <p>جارٍ التحميل...</p>
          ) : attorneys.length === 0 ? (
            <p>لا توجد توكيلات لهذا العميل.</p>
          ) : (
            <TableComponent
              data={attorneys}
              headers={headers}
              customRenderers={customRenderers}
              onDelete={handleDelete}
      
              onEdit={handleEdit}
            />
          )}
        </div>
      )}
  {/* Modal for Add/Edit Attorney */}
  <AddEditAttorneysModal
        showModal={showModal}
        setShowModal={handleModalClose}
        attorney={selectedAttorney}
        isEditing={isEditing}
        attorneyTypes={attorneyTypes}
        selectedClient={selectedClient}
        onSaved={fetchAttorneys}
      />
    </div>
  );
};

export default ClientPowerOfAttorneys;