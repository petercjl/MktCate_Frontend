import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Grid, List } from 'lucide-react';
import { CategoryAnalysis } from '../../../types';
import ProductCard from '../../ProductCard';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface ProductCategoriesProps {
  data: CategoryAnalysis;
}

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const ProductCategories: React.FC<ProductCategoriesProps> = ({ data }) => {
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>(
    data.categories.reduce((acc, cat) => ({ ...acc, [cat.id]: true }), {})
  );
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const toggleCat = (id: string) => {
    setExpandedCats(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const pieData = data.categories.map(c => ({ name: c.name, value: c.count }));

  return (
    <div className="space-y-8">
      {/* 10.1 & 10.2 Header Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
        {/* Chart */}
        <div className="h-48 col-span-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={50}
                outerRadius={70}
                paddingAngle={5}
                dataKey="value"
              >
                 {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Category Legend Cards */}
        <div className="col-span-1 lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-3">
          {data.categories.map((cat, idx) => (
            <button
              key={cat.id}
              onClick={() => {
                const el = document.getElementById(cat.id);
                el?.scrollIntoView({ behavior: 'smooth' });
                setExpandedCats(prev => ({ ...prev, [cat.id]: true }));
              }}
              className="flex flex-col p-3 rounded bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors text-left"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span className="font-semibold text-slate-700 text-sm truncate">{cat.name}</span>
              </div>
              <div className="text-2xl font-bold text-slate-800">{cat.count} <span className="text-xs font-normal text-slate-400">({(cat.ratio * 100).toFixed(1)}%)</span></div>
            </button>
          ))}
        </div>
      </div>

      {/* 10.3 Category Details */}
      <div className="space-y-4">
        {data.categories.map((cat) => (
          <div key={cat.id} id={cat.id} className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            {/* Header */}
            <button 
              onClick={() => toggleCat(cat.id)}
              className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                 {expandedCats[cat.id] ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                 <h3 className="font-bold text-slate-800">{cat.name}</h3>
                 <span className="text-sm text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {cat.count}件 · 均价¥{cat.avg_price}
                 </span>
              </div>
            </button>

            {/* Content */}
            {expandedCats[cat.id] && (
              <div className="p-6 border-t border-slate-200">
                {/* AI Description Box */}
                <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mb-6">
                  <h4 className="text-indigo-900 font-semibold mb-2 flex items-center gap-2">
                    ✨ AI 分类说明
                  </h4>
                  <p className="text-indigo-800 text-sm leading-relaxed mb-3">{cat.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {cat.key_features.map((feature, i) => (
                      <span key={i} className="text-xs bg-white text-indigo-600 px-2 py-1 rounded border border-indigo-100">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Toolbar */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex gap-2 text-sm text-slate-500">
                     <span>排序:</span>
                     <button className="hover:text-indigo-600 font-medium">价格</button>
                     <span className="text-slate-300">|</span>
                     <button className="hover:text-indigo-600 font-medium">销量</button>
                  </div>
                  <div className="flex bg-slate-100 rounded p-1">
                    <button 
                      onClick={() => setViewMode('grid')}
                      className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      <Grid size={16} />
                    </button>
                    <button 
                      onClick={() => setViewMode('list')}
                      className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      <List size={16} />
                    </button>
                  </div>
                </div>

                {/* Products Grid */}
                <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-5' : 'grid-cols-1'}`}>
                  {cat.products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {data.filtered_products && (
         <div className="text-center text-slate-400 text-sm p-4 bg-slate-50 rounded-lg border border-dashed border-slate-300">
           {data.filtered_products.count} 个商品已隐藏 ({data.filtered_products.reason})
         </div>
      )}
    </div>
  );
};

export default ProductCategories;
