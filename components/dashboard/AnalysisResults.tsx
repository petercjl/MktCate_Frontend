import React, { useState } from 'react';
import { AnalysisResult } from '../../types';
import MarketStats from './tabs/MarketStats';
import ProductCategories from './tabs/ProductCategories';
import PriceBands from './tabs/PriceBands';

interface AnalysisResultsProps {
  result: AnalysisResult;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ result }) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'categories' | 'prices'>('stats');

  return (
    <div className="max-w-6xl mx-auto mt-6 px-4 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            分析报告: {result.keyword}
          </h1>
          <p className="text-slate-500 text-sm mt-1">ID: {result.id} • 生成于刚刚</p>
        </div>
        <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
          下载 PDF 报告
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6 sticky top-0 z-10">
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex-1 py-4 text-center font-medium text-sm transition-colors border-b-2 ${
              activeTab === 'stats' 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            市场统计
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`flex-1 py-4 text-center font-medium text-sm transition-colors border-b-2 ${
              activeTab === 'categories' 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            商品形态分类
          </button>
          <button
            onClick={() => setActiveTab('prices')}
            className={`flex-1 py-4 text-center font-medium text-sm transition-colors border-b-2 ${
              activeTab === 'prices' 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            价格带分析
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[500px]">
        {activeTab === 'stats' && <MarketStats data={result.market_stats} />}
        {activeTab === 'categories' && <ProductCategories data={result.product_categories} />}
        {activeTab === 'prices' && <PriceBands data={result.price_bands} />}
      </div>
    </div>
  );
};

export default AnalysisResults;
