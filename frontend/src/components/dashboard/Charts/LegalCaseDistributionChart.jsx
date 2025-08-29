import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import { getLegalCaseDistributionData } from "@/features/dashboard/api/dashboard";

export default function LegalCaseDistributionChart({ height = 240 }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const result = await getLegalCaseDistributionData();
        mounted && setData(result);
      } catch (e) {
        console.error("Error fetching legal case distribution data:", e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="text-muted-foreground text-sm">Loading...</span>
      </div>
    );
  }

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barCategoryGap="20%">
          <CartesianGrid strokeOpacity={0.1} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "12px",
              boxShadow: "var(--glass-shadow)",
              color: "hsl(var(--foreground))"
            }}
          />
          <Legend
            wrapperStyle={{
              fontSize: "12px",
              color: "hsl(var(--muted-foreground))"
            }}
          />
          <Bar dataKey="value" fill="url(#primaryGradient)" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

