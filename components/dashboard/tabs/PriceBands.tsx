import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';
import { PriceAnalysis } from '../../../types';
import ProductCard from '../../ProductCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface PriceBandsProps {
  data: PriceAnalysis;
}

const PriceBands: React.FC<PriceBandsProps> = ({ data }) => {
  const [expandedBand, setExpandedBand] = useState<string | null>(data.bands[2]?.id || null); // Default open middle band

  const chartData = data.bands.map(b => ({
    name: b.label,
    range: `${b.range[0]}-${b.range[1]}`,
    count: b.count,
    ratio: (b.ratio * 100).toFixed(1)
  }));

  const BAND_COLORS = ['#94a3b8', '#64748b', '#4f46e5', '#4338ca', '#312e81'];

  return (
    <div className="space-y-8">
      {/* 11.1 Chart */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">价格带分布 (Jenks Natural Breaks)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                contentStyle={{ borderRadius: '8px' }}
                cursor={{fill: '#f8fafc'}}
              />
              <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]}>
                 {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={BAND_COLORS[index % BAND_COLORS.length]} />
                  ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 11.2 Comparison Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
            <tr>
              <th className="px-6 py-3">价格带</th>
              <th className="px-6 py-3">区间 (元)</th>
              <th className="px-6 py-3">数量</th>
              <th className="px-6 py-3">占比</th>
              <th className="px-6 py-3">均价</th>
              <th className="px-6 py-3">店铺特征</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.bands.map((band) => (
              <tr key={band.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-3 font-medium text-slate-800">{band.label}</td>
                <td className="px-6 py-3 text-slate-500">{band.range[0]} - {band.range[1]}</td>
                <td className="px-6 py-3">{band.count}</td>
                <td className="px-6 py-3">{(band.ratio * 100).toFixed(1)}%</td>
                <td className="px-6 py-3">¥{band.stats.avg_price}</td>
                <td className="px-6 py-3 text-slate-500">
                  {Object.entries(band.stats.shop_type).sort((a: any, b: any) => b[1] - a[1])[0][0]}为主
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 11.3 Details */}
      <div className="space-y-4">
        {data.bands.map((band) => (
          <div key={band.id} className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
             <button 
              onClick={() => setExpandedBand(expandedBand === band.id ? null : band.id)}
              className={`w-full flex items-center justify-between p-4 transition-colors ${expandedBand === band.id ? 'bg-indigo-50' : 'bg-slate-50 hover:bg-slate-100'}`}
            >
              <div className="flex items-center gap-3">
                 {expandedBand === band.id ? <ChevronUp size={20} className="text-indigo-500" /> : <ChevronDown size={20} className="text-slate-400" />}
                 <h3 className={`font-bold ${expandedBand === band.id ? 'text-indigo-700' : 'text-slate-800'}`}>
                   {band.label} <span className="font-normal text-slate-500 ml-2">{band.range[0]}-{band.range[1]}元 ({band.count}件)</span>
                 </h3>
              </div>
            </button>

            {expandedBand === band.id && (
              <div className="p-6 border-t border-indigo-100">
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <div className="lg:col-span-2 space-y-4">
                       <div className="bg-slate-50 p-4 rounded border border-slate-200">
                          <h4 className="font-semibold text-slate-800 mb-2">🤖 AI 深度分析</h4>
                          <p className="text-slate-600 text-sm">{band.ai_analysis}</p>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white border border-slate-200 p-3 rounded">
                             <div className="text-xs text-slate-500">平均收货</div>
                             <div className="text-lg font-bold">{band.stats.avg_buyers}人</div>
                          </div>
                          <div className="bg-white border border-slate-200 p-3 rounded">
                             <div className="text-xs text-slate-500">平均折扣</div>
                             <div className="text-lg font-bold">{(band.stats.avg_discount * 100).toFixed(0)}%</div>
                          </div>
                       </div>
                    </div>
                    {/* Platform Dist Mini Chart */}
                    <div className="bg-white border border-slate-200 p-4 rounded flex flex-col justify-center">
                       <div className="text-sm font-semibold mb-2 text-center">平台分布</div>
                       <div className="flex items-end justify-center h-24 gap-4">
                          {Object.entries(band.stats.platform).map(([k, v]: [string, any]) => (
                             <div key={k} className="flex flex-col items-center w-12">
                                <div className="w-full bg-indigo-200 rounded-t" style={{height: `${v * 100}%`}}></div>
                                <span className="text-xs mt-1">{k}</span>
                             </div>
                          ))}
                       </div>
                    </div>
                 </div>

                 {/* Products */}
                 <h4 className="font-semibold text-slate-800 mb-4">典型商品</h4>
                 <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {band.products.map(p => (
                       <ProductCard key={p.id} product={p} />
                    ))}
                 </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 11.4 AI Recommendations */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 text-white shadow-lg">
        <div className="flex items-start gap-4">
           <div className="bg-white/20 p-2 rounded-lg">
              <Lightbulb className="text-yellow-300" size={24} />
           </div>
           <div>
              <h3 className="text-lg font-bold mb-2">AI 策略建议</h3>
              <p className="mb-4 text-indigo-100">{data.ai_recommendations.summary}</p>
              <ul className="space-y-2">
                 {data.ai_recommendations.suggestions.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm bg-white/10 p-2 rounded">
                       <span className="font-bold text-yellow-300">{i+1}.</span>
                       {s}
                    </li>
                 ))}
              </ul>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PriceBands;