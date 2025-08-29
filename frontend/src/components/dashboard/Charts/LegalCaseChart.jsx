import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Commercial', value: 1200 },
  { name: 'Criminal', value: 800 },
  { name: 'Labor', value: 500 },
  { name: 'Personal', value: 450 },
  { name: 'Administrative', value: 350 },
];

export default function LegalCaseChart() {
  return (
    <div className="card p-6 md:p-8 hover:shadow-dark transition-shadow duration-200">
      <h2 className="text-xl font-semibold mb-4">توزيع القضايا القانونية</h2>
      <ResponsiveContainer width="100%" height={360}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="name" stroke="hsl(var(--fg))" tick={{ fill: 'hsl(var(--fg))' }} />
          <YAxis stroke="hsl(var(--fg))" tick={{ fill: 'hsl(var(--fg))' }} />
          <Tooltip contentStyle={{ background: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }} />
          <Legend />
          <Bar dataKey="value" fill="hsl(var(--chart-1))" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

