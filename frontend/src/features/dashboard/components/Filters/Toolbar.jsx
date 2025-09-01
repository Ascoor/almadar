import React from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Filter, RotateCcw } from "lucide-react";
 
import   {DashboardClock}   from "@/features/dashboard/components";
import { useLanguage } from "@/context/LanguageContext";

export default function Toolbar({ value, onChange }) {
  const { lang,t} = useLanguage();
  const [local, setLocal] = React.useState(value ?? { 
    period: "last-12m", 
    region: "ALL", 
    status: "ALL" 
  });

  React.useEffect(() => {
    onChange && onChange(local);
  }, [local, onChange]);

  const selectClass = "select rounded-xl px-4 py-2 text-sm transition-all";
  const buttonClass = "btn-primary rounded-xl px-4 py-2 text-sm transition-all flex items-center gap-2";
  const resetClass = "btn-primary rounded-xl px-4 py-2 text-sm font-medium transition-all flex items-center gap-2";

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6 flex flex-wrap items-center gap-3 p-4 card-soft rounded-2xl"
    >
      <div className="shrink-0">
        <DashboardClock size={112} sweepSeconds={false} />
      </div>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Calendar className="w-4 h-4 text-primary" />
        <select 
          className={selectClass}
          value={local.period} 
          onChange={e => setLocal(v => ({...v, period: e.target.value}))}
        >
          <option value="last-12m">{t('last12Months', lang)}</option>
          <option value="ytd">{t('yearToDate', lang)}</option>
          <option value="last-90d">{t('last90Days', lang)}</option>
        </select>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <MapPin className="w-4 h-4 text-primary" />
        <select 
          className={selectClass}
          value={local.region} 
          onChange={e => setLocal(v => ({...v, region: e.target.value}))}
        >
          <option value="ALL">{t('allRegions', lang)}</option>
          <option value="TRP">{t('tripoli', lang)}</option>
          <option value="BEN">{t('benghazi', lang)}</option>
          <option value="MIS">{t('misrata', lang)}</option>
          <option value="ZAW">{t('zawiya', lang)}</option>
          <option value="SBH">{t('sebha', lang)}</option>
        </select>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Filter className="w-4 h-4 text-primary" />
        <select 
          className={selectClass}
          value={local.status} 
          onChange={e => setLocal(v => ({...v, status: e.target.value}))}
        >
          <option value="ALL">{t('allStatuses', lang)}</option>
          <option value="Open">{t('open', lang)}</option>
          <option value="InProgress">{t('inProgress', lang)}</option>
          <option value="Won">{t('won', lang)}</option>
          <option value="Lost">{t('lost', lang)}</option>
          <option value="Closed">{t('closed', lang)}</option>
        </select>
      </div>

      <div className="flex items-center gap-2 ml-auto w-full sm:w-auto justify-end">
        <button 
          className={resetClass}
          onClick={() => setLocal({period: "last-12m", region: "ALL", status: "ALL"})}
        >
          <RotateCcw className="w-4 h-4" />
          {t('reset', lang)}
        </button>
      </div>
    </motion.div>
  );
}
