import { useLocation, useNavigate, useParams } from "react-router-dom";
import InvestigationActionDetailsSmart from "@/features/investigations/components/InvestigationActionDetailsSmart";

export default function InvestigationActionDetailsPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const initial = location.state || null;

  return (
    <InvestigationActionDetailsSmart
      id={id}
      selected={initial}
      onClose={() => navigate(-1)}
    />
  );
}
