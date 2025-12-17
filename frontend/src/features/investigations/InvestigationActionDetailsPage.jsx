import { useLocation, useNavigate, useParams } from "react-router-dom";
import InvestigationActionDetailsSmart from "@/features/investigations/components/InvestigationActionDetailsSmart";

export default function InvestigationActionDetailsPage() {
  const  { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state || {};
  const initialSelected = state.selected || null;

  const handleClose = () => {
    if (state.from) {
      navigate(state.from, { state: { restoreScrollY: state.scrollY ?? 0 } });
      return;
    }
    if (window.history.length > 1) navigate(-1);
    else navigate("/legal/investigations");
  };

  return (

<InvestigationActionDetailsSmart
  actionId={id}
  selected={initialSelected}
  onClose={handleClose}
/>
  );
}
