import React from 'react';
import { ExternalLink, Copy, Check } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    // Ensure URL is absolute for copying
    const url = product.product_url.startsWith('//') ? `https:${product.product_url}` : product.product_url;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayUrl = product.product_url.startsWith('//') ? `https:${product.product_url}` : product.product_url;

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      <div className="relative aspect-square bg-slate-100 overflow-hidden group">
        <img 
          src={product.image_url} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute top-2 left-2 flex gap-1">
           <span className={`text-xs px-2 py-0.5 rounded text-white ${product.platform === '天猫' ? 'bg-red-500' : 'bg-orange-500'}`}>
             {product.platform}
           </span>
           {product.shop_type === '旗舰店' && (
             <span className="text-xs px-2 py-0.5 rounded bg-indigo-600 text-white">旗舰店</span>
           )}
        </div>
      </div>
      
      <div className="p-3 flex-1 flex flex-col">
        <h3 className="text-sm text-slate-700 font-medium line-clamp-2 h-10 mb-2" title={product.name}>
          {product.name}
        </h3>
        
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-lg font-bold text-red-600">¥{product.current_price.toFixed(2)}</span>
          {product.original_price && (
            <span className="text-xs text-slate-400 line-through">¥{product.original_price.toFixed(2)}</span>
          )}
        </div>
        
        <div className="text-xs text-slate-500 mb-3 flex justify-between items-center">
          <span>{product.buyers ? `${product.buyers}人收货` : '少于10人收货'}</span>
          <span className="truncate max-w-[80px] text-right" title={product.shop_name}>{product.shop_name}</span>
        </div>

        <div className="mt-auto flex gap-2">
          <a 
            href={displayUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs py-1.5 rounded transition-colors"
          >
            <ExternalLink size={12} />
            查看
          </a>
          <button 
            onClick={handleCopy}
            className="flex items-center justify-center gap-1 bg-slate-50 hover:bg-slate-100 text-slate-600 px-3 py-1.5 rounded transition-colors border border-slate-200"
            title="复制链接"
          >
            {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
