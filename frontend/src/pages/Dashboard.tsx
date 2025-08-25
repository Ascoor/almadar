import { motion } from 'framer-motion';

export default function Dashboard() {
  return (
    <div className="p-4 lg:p-6 grid gap-4 lg:gap-6">
      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Monthly Cases', value: '1,236' },
          { label: 'Success Rate', value: '63%' },
          { label: 'Contracts Volume', value: '€ 3.2M' },
          { label: 'Sessions (wk)', value: '58' },
        ].map((k, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-2xl shadow-md p-4"
          >
            <p className="text-sm text-muted">{k.label}</p>
            <p className="mt-1 text-2xl font-semibold">{k.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts + Libya map shell */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-2xl shadow-md p-4 xl:col-span-2">
          <h3 className="font-medium">Monthly Cases</h3>
          <div className="mt-4 h-64 rounded-xl bg-[image:var(--gradient-card)]" />
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-md p-4">
          <h3 className="font-medium">Libya Map</h3>
          <div className="mt-4 h-64 rounded-xl bg-map-gradient" />
        </div>
      </div>
    </div>
  );
}
