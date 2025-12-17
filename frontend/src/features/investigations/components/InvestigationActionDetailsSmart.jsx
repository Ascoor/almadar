import { useEffect, useRef, useState } from "react";
import GlobalSpinner from "@/components/common/Spinners/GlobalSpinner";
import { getInvestigationActionById } from "@/services/api/investigations";
import InvestigationActionDetailsCard from "@/features/investigations/components/InvestigationActionDetailsCard";

export default function InvestigationActionDetailsSmart({ actionId, selected, onClose }) {
  const [current, setCurrent] = useState(selected ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const lastFetched = useRef(null);

  useEffect(() => {
    if (selected) setCurrent(selected);
  }, [selected]);

  useEffect(() => {
    if (!actionId) return;

    const key = String(actionId);
    if (lastFetched.current === key) return;
    lastFetched.current = key;

    const controller = new AbortController();
setLoading(true);
setError("");

getInvestigationActionById(actionId, { signal: controller.signal })
  .then((res) => setCurrent(res.data?.data ?? res.data))
  .catch((err) => {
    if (err?.name === "CanceledError" || err?.code === "ERR_CANCELED") return;
    setCurrent(null);
    setError("لا توجد بيانات لهذا الإجراء أو لا تملك صلاحية.");
  })
  .finally(() => setLoading(false));

return () => controller.abort();

  }, [actionId]);

  if (loading && !current) return <GlobalSpinner />;
  if (!current) return <div className="p-6 text-center text-red-500">{error || "لا توجد بيانات"}</div>;

  return <InvestigationActionDetailsCard selected={current} onClose={onClose} />;
}
