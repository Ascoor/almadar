import React from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Filter, RotateCcw } from "lucide-react";
 
import   {DashboardClock}   from "@/components/dashboard";
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

  const selectClass = "glass rounded-xl px-4 py-2 text-sm border-0 focus:ring-2 focus:ring-primary/50 transition-all";
  const buttonClass = "glass rounded-xl px-4 py-2 text-sm hover:bg-primary/10 transition-all flex items-center gap-2";
  const resetClass = "gradient-primary text-primary-foreground rounded-xl px-4 py-2 text-sm font-medium hover:opacity-90 transition-all flex items-center gap-2";

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6 flex flex-wrap items-center gap-3 p-4 glass rounded-2xl"
    >
      <DashboardClock />
      <div className="flex items-center gap-2">
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

      <div className="flex items-center gap-2">
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

      <div className="flex items-center gap-2">
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

      <div className="flex items-center gap-2 ml-auto">
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