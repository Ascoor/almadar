import React from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, CheckCircle, Clock, XCircle } from "lucide-react";
import {  useLanguage } from "@/context/LanguageContext";

const statusIcons = {
  "Open": Clock,
  "InProgress": Clock,
  "Closed": CheckCircle,
  "Won": CheckCircle,
  "Lost": XCircle
};

const statusColors = {
  "Open": "text-amber-500",
  "InProgress": "text-blue-500", 
  "Closed": "text-gray-500",
  "Won": "text-emerald-500",
  "Lost": "text-red-500"
};

export default function CompactTable({ rows = [] }) {
  const { lang, dir ,t} = useLanguage();
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50">
              <th className={`${dir === 'rtl' ? 'text-right' : 'text-left'} p-4 font-semibold text-muted-foreground`}>
                {t('title_header', lang)}
              </th>
              <th className={`${dir === 'rtl' ? 'text-right' : 'text-left'} p-4 font-semibold text-muted-foreground`}>
                {t('type', lang)}
              </th>
              <th className={`${dir === 'rtl' ? 'text-right' : 'text-left'} p-4 font-semibold text-muted-foreground`}>
                {t('region', lang)}
              </th>
              <th className={`${dir === 'rtl' ? 'text-right' : 'text-left'} p-4 font-semibold text-muted-foreground`}>
                {t('status', lang)}
              </th>
              <th className={`${dir === 'rtl' ? 'text-right' : 'text-left'} p-4 font-semibold text-muted-foreground`}>
                {t('date', lang)}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const StatusIcon = statusIcons[row.status] || Clock;
              const statusColor = statusColors[row.status] || "text-gray-500";
              
              return (
                <motion.tr 
                  key={row.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-border/30 hover:bg-muted/20 transition-colors"
                >
                  <td className="p-4">
                    <div className="font-medium">{row.title}</div>
                    {row.description && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {row.description}
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-muted-foreground">{row.type}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      {row.region}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className={`flex items-center gap-2 ${statusColor}`}>
                      <StatusIcon className="w-4 h-4" />
                      {t(row.status.toLowerCase(), lang)}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {row.date}
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}