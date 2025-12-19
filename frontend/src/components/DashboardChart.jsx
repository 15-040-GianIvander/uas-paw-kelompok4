import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

const data = [
  { name: 'Jan', revenue: 120000 },
  { name: 'Feb', revenue: 90000 },
  { name: 'Mar', revenue: 140000 },
  { name: 'Apr', revenue: 110000 },
  { name: 'May', revenue: 160000 },
  { name: 'Jun', revenue: 190000 },
];

function formatCurrency(v) {
  return v.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 });
}

export default function DashboardChart() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold">Pendapatan Tiket (6 Bulan Terakhir)</h3>
      </div>

      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#edf2f7" />
            <XAxis dataKey="name" tick={{ fill: '#475569' }} />
            <YAxis tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : v)} tick={{ fill: '#475569' }} />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Bar dataKey="revenue" fill="#2563eb" radius={[6,6,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
