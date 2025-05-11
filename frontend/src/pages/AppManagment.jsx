import React from "react";
import VariableListCard from"@/components/Settings/VariableListCard"
import { Trash2 } from "lucide-react";
 

const VariablesDashboard = () => {
  const [contractTypes, setContractTypes] = React.useState([
    { label: "عقد داخلي" },
    { label: "عقد خارجي" },
  ]);

  const [categories, setCategories] = React.useState([
    { label: "إداري" },
    { label: "مالي" },
  ]);

  const [actions, setActions] = React.useState([
    { label: "استدعاء" },
    { label: "تحقيق" },
  ]);

  const handleDelete = (section, index) => {
    if (section === "أنواع العقود") {
      setContractTypes((prev) => prev.filter((_, i) => i !== index));
    } else if (section === "التصنيفات") {
      setCategories((prev) => prev.filter((_, i) => i !== index));
    } else if (section === "الإجراءات") {
      setActions((prev) => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-4">
      <VariableListCard title="أنواع العقود" variables={contractTypes} onDelete={handleDelete} />
      <VariableListCard title="التصنيفات" variables={categories} onDelete={handleDelete} />
      <VariableListCard title="الإجراءات" variables={actions} onDelete={handleDelete} />
    </div>
  );
};

export default VariablesDashboard;
