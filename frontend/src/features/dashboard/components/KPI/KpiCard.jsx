import React from "react";
import { motion } from "framer-motion";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function KpiCard({ 
  title, 
  value, 
  delta, 
  miniSeries = [], 
  delay = 0,
  icon: Icon
}) {
  const isPositive = delta >= 0;
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className="glass-card hover-scale"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="p-2 rounded-xl bg-primary/10">
              <Icon className="w-5 h-5 text-primary" />
            </div>
          )}
          <div>
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <h3 className="text-3xl font-extrabold section-title section-title-animate">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </h3>
          </div>
        </div>
        
        {typeof delta === "number" && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.3, type: "spring" }}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium ${
              isPositive 
                ? "bg-primary/10 text-[color:var(--primary)]" 
                : "bg-destructive/10 text-[color:var(--destructive)]"
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            {Math.abs(delta)}%
          </motion.div>
        )}
      </div>

      <div className="h-12 w-full min-w-0" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={miniSeries}>
            <Line 
              type="monotone" 
              dataKey="y" 
              dot={false} 
              stroke="var(--primary)" 
              strokeWidth={3}
              strokeDasharray="0"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
