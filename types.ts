// API Response Types

export interface User {
  username: string;
  token: string;
}

export interface AnalysisItem {
  id: string;
  keyword: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  product_count?: number;
}

export interface StepDetail {
  step: number;
  name: string;
  status: 'pending' | 'processing' | 'completed';
  progress?: string;
}

export interface TaskStatus {
  task_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  current_step: number;
  total_steps: number;
  step_details: StepDetail[];
}

// Product & Analysis Data Types

export interface Product {
  id: string;
  name: string;
  image_url: string;
  product_url: string;
  current_price: number;
  original_price?: number;
  buyers?: number; // e.g. 2000
  shop_name: string;
  shop_type: string; // '旗舰店' | '专卖店' | '淘宝' etc.
  platform: '天猫' | '淘宝';
  filtered?: boolean;
}

export interface MarketStats {
  overview: {
    total_count: number;
    avg_price: number;
    median_price: number;
    min_price: number;
    max_price: number;
  };
  platform_distribution: Record<string, { count: number; ratio: number; avg_price: number }>;
  shop_type_distribution: Record<string, { count: number; ratio: number }>;
  position_distribution: Record<string, { count: number; ratio: number; avg_price: number }>;
  price_histogram: { range: string; count: number }[];
  province_distribution: { province: string; count: number }[];
  discount_stats: {
    avg_discount_rate: number;
    high_discount_ratio: number;
  };
}

export interface Category {
  id: string;
  name: string;
  description: string;
  count: number;
  ratio: number;
  avg_price: number;
  price_range: [number, number];
  key_features: string[];
  products: Product[];
}

export interface CategoryAnalysis {
  total_classified: number;
  category_count: number;
  categories: Category[];
  filtered_products?: {
    count: number;
    reason: string;
  };
}

export interface PriceBand {
  id: string;
  label: string;
  range: [number, number];
  count: number;
  ratio: number;
  stats: {
    avg_price: number;
    median_price: number;
    platform: Record<string, number>;
    shop_type: Record<string, number>;
    avg_discount: number;
    avg_buyers: number;
  };
  ai_analysis: string;
  products: Product[];
}

export interface PriceAnalysis {
  method: string;
  optimal_k: number;
  bands: PriceBand[];
  ai_recommendations: {
    summary: string;
    suggestions: string[];
  };
}

export interface AnalysisResult {
  id: string;
  keyword: string;
  market_stats: MarketStats;
  product_categories: CategoryAnalysis;
  price_bands: PriceAnalysis;
}
