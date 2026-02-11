import React from 'react';
import { 
  PieChart, Pie, Cell, Tooltip as ReTooltip, Legend, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ReferenceLine 
} from 'recharts';
import { MarketStats as MarketStatsType } from '../../../types';

interface MarketStatsProps {
  data: MarketStatsType;
}

const COLORS = ['#4f46e5', '#f97316', '#10b981', '#f43f5e'];
const PIE_COLORS = ['#3b82f6', '#f59e0b', '#ec4899', '#6366f1'];

const MarketStats: React.FC<MarketStatsProps> = ({ data }) => {
  const { overview, platform_distribution, shop_type_distribution, position_distribution, price_histogram, province_distribution } = data;

  // Transform object maps to arrays for Recharts
  const platformData = Object.entries(platform_distribution).map(([name, val]: [string, any]) => ({ name, value: val.count }));
  const shopData = Object.entries(shop_type_distribution).map(([name, val]: [string, any]) => ({ name, value: val.count }));
  const positionData = Object.entries(position_distribution).map(([name, val]: [string, any]) => ({ name, value: val.count }));

  return (
    <div className="space-y-6">
      {/* 9.1 Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: '商品总数', value: overview.total_count, unit: '件' },
          { label: '平均价格', value: `¥${overview.avg_price}`, unit: '' },
          { label: '价格中位数', value: `¥${overview.median_price}`, unit: '' },
          { label: '价格区间', value: `¥${overview.min_price} - ${overview.max_price}`, unit: '' },
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
            <div className="text-slate-500 text-sm mb-1">{item.label}</div>
            <div className="text-2xl font-bold text-slate-800">
              {item.value}<span className="text-xs font-normal text-slate-400 ml-1">{item.unit}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 9.2 Platform Distribution */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">平台分布</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ReTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 9.3 Shop Type Distribution */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">店铺类型分布</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={shopData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {shopData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <ReTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 9.5 Price Histogram */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm md:col-span-2">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">价格分布直方图</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={price_histogram} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="range" />
                <YAxis />
                <ReTooltip cursor={{ fill: '#f1f5f9' }} />
                <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} name="商品数量" />
                {/* Visual reference lines for context (simplified) */}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 9.6 Province Distribution */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">发货地 Top 5</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={province_distribution.slice(0, 5)} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="province" type="category" width={50} />
                <ReTooltip />
                <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} name="商品数量" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 9.4 Position Analysis */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">广告 vs 自然位</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={positionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <ReTooltip />
                <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} name="数量" barSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketStats;