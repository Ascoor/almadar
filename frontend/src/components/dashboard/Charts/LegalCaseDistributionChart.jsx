import React, { useState, useEffect } from 'react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getLegalCaseRadarData } from "@/features/dashboard/api/dashboard"; // استدعاء البيانات من API

const LegalCaseRadarChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getLegalCaseRadarData(); // استرجاع البيانات من API
        setData(result);
      } catch (error) {
        console.error("Error fetching radar chart data:", error);
      }
    };
    fetchData();
  }, []);

  if (!data.length) return <div>Loading...</div>;

  return (
    <div className="chart-container bg-card p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold text-center mb-4">Legal Case Distribution by Category (Radar)</h2>
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="category" />
          <PolarRadiusAxis angle={30} domain={[0, 1500]} />
          <Radar name="Cases" dataKey="value" stroke="#4caf50" fill="#4caf50" fillOpacity={0.6} />
          <Tooltip />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LegalCaseRadarChart;
