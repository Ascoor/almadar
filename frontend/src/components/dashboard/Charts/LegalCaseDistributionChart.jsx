import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getLegalCaseDistributionData } from "@/features/dashboard/api/dashboard"; // Assuming API file

const LegalCaseDistributionChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getLegalCaseDistributionData(); // Get data from the API
        setData(result);
      } catch (error) {
        console.error("Error fetching legal case distribution data:", error);
      }
    };
    fetchData();
  }, []);

  if (!data.length) return <div className="text-center p-4">Loading...</div>;

  return (
    <div className="chart-container bg-card p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold text-center mb-4">Legal Case Distribution by Category</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LegalCaseDistributionChart; // Ensure this is exported correctly
