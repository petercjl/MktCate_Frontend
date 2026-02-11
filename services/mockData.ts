import { AnalysisResult, AnalysisItem, TaskStatus, StepDetail } from '../types';

// Helper to generate random products
const generateProducts = (count: number, basePrice: number): any[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `prod_${Math.random().toString(36).substr(2, 9)}`,
    name: `示例商品 ${i + 1} - 这是一个测试商品名称长标题示例`,
    image_url: `https://picsum.photos/200/200?random=${Math.random()}`,
    product_url: `//item.taobao.com/item.htm?id=${10000 + i}`,
    current_price: parseFloat((basePrice * (0.8 + Math.random() * 0.4)).toFixed(2)),
    original_price: parseFloat((basePrice * 1.5).toFixed(2)),
    buyers: Math.floor(Math.random() * 5000),
    shop_name: Math.random() > 0.5 ? '官方旗舰店' : '专营店',
    shop_type: Math.random() > 0.5 ? '旗舰店' : '非金牌店铺',
    platform: Math.random() > 0.6 ? '天猫' : '淘宝',
    filtered: false
  }));
};

export const MOCK_HISTORY: AnalysisItem[] = [
  { id: '1', keyword: '烧烤盘', status: 'completed', created_at: '2026-02-11T09:00:00Z', product_count: 276 },
  { id: '2', keyword: '无线鼠标', status: 'completed', created_at: '2026-02-10T14:30:00Z', product_count: 150 },
  { id: '3', keyword: '露营灯', status: 'failed', created_at: '2026-02-09T11:20:00Z' },
];

export const MOCK_ANALYSIS_RESULT: AnalysisResult = {
  id: '1',
  keyword: '烧烤盘',
  market_stats: {
    overview: {
      total_count: 276,
      avg_price: 89.5,
      median_price: 49.0,
      min_price: 3.79,
      max_price: 591.0
    },
    platform_distribution: {
      "天猫": { count: 181, ratio: 0.656, avg_price: 105.3 },
      "淘宝": { count: 95, ratio: 0.344, avg_price: 59.2 }
    },
    shop_type_distribution: {
      "旗舰店": { count: 115, ratio: 0.417 },
      "非金牌店铺": { count: 128, ratio: 0.464 },
      "专卖店": { count: 29, ratio: 0.105 },
      "专营店": { count: 4, ratio: 0.014 }
    },
    position_distribution: {
      "广告位": { count: 24, ratio: 0.087, avg_price: 156.8 },
      "自然位": { count: 252, ratio: 0.913, avg_price: 83.1 }
    },
    price_histogram: [
      { range: "0-10", count: 26 },
      { range: "10-30", count: 74 },
      { range: "30-50", count: 42 },
      { range: "50-100", count: 54 },
      { range: "100-200", count: 53 },
      { range: "200-500", count: 19 },
      { range: "500+", count: 8 }
    ],
    province_distribution: [
      { province: "浙江", count: 85 },
      { province: "广东", count: 62 },
      { province: "河北", count: 30 },
      { province: "江苏", count: 25 },
      { province: "上海", count: 15 }
    ],
    discount_stats: {
      avg_discount_rate: 0.65,
      high_discount_ratio: 0.32
    }
  },
  product_categories: {
    total_classified: 276,
    category_count: 3,
    categories: [
      {
        id: "cat_1",
        name: "户外卡式炉烤盘",
        description: "配合卡式炉使用的户外烤盘，通常为圆形或方形，材质多为麦饭石涂层。",
        count: 85,
        ratio: 0.308,
        avg_price: 35.6,
        price_range: [12.24, 89.0],
        key_features: ["卡式炉适配", "麦饭石/铸铁", "户外便携"],
        products: generateProducts(10, 35)
      },
      {
        id: "cat_2",
        name: "电烤盘/电烤炉",
        description: "插电使用的家用烤盘，一体式设计，功率较大。",
        count: 62,
        ratio: 0.224,
        avg_price: 128.5,
        price_range: [89.0, 399.0],
        key_features: ["插电即用", "无烟设计", "容量大"],
        products: generateProducts(8, 128)
      },
      {
        id: "cat_3",
        name: "铸铁/韩式烤盘",
        description: "传统铸铁材质或韩式设计，导热快，适合炭火或燃气。",
        count: 48,
        ratio: 0.174,
        avg_price: 45.2,
        price_range: [25.0, 120.0],
        key_features: ["铸铁耐用", "韩式风味", "需明火"],
        products: generateProducts(8, 45)
      }
    ],
    filtered_products: {
      count: 2,
      reason: "用户要求：不要带电的产品"
    }
  },
  price_bands: {
    method: "jenks_natural_breaks",
    optimal_k: 5,
    bands: [
      {
        id: "band_1",
        label: "低价带",
        range: [3.79, 15.0],
        count: 42,
        ratio: 0.152,
        stats: {
          avg_price: 9.8,
          median_price: 9.5,
          platform: { "天猫": 0.31, "淘宝": 0.69 },
          shop_type: { "旗舰店": 0.12, "非金牌店铺": 0.76 },
          avg_discount: 0.45,
          avg_buyers: 320
        },
        ai_analysis: "该价格带以淘宝C店为主，主要为配件或入门级简易产品，价格敏感度极高。",
        products: generateProducts(6, 9)
      },
      {
        id: "band_2",
        label: "中低价",
        range: [15.0, 45.0],
        count: 68,
        ratio: 0.246,
        stats: {
          avg_price: 28.5,
          median_price: 29.9,
          platform: { "天猫": 0.50, "淘宝": 0.50 },
          shop_type: { "旗舰店": 0.30, "非金牌店铺": 0.50 },
          avg_discount: 0.60,
          avg_buyers: 800
        },
        ai_analysis: "性价比极高的区间，走量产品集中地，竞争激烈。",
        products: generateProducts(6, 28)
      },
      {
        id: "band_3",
        label: "中价带",
        range: [45.0, 95.0],
        count: 72,
        ratio: 0.261,
        stats: {
          avg_price: 65.3,
          median_price: 68.0,
          platform: { "天猫": 0.62, "淘宝": 0.38 },
          shop_type: { "旗舰店": 0.45, "非金牌店铺": 0.35 },
          avg_discount: 0.72,
          avg_buyers: 580
        },
        ai_analysis: "市场主力价格带，品牌入门款与高配白牌混战，利润与销量平衡点。",
        products: generateProducts(6, 65)
      }
    ],
    ai_recommendations: {
      summary: "基于价格带分析，当前市场呈现哑铃型结构。",
      suggestions: [
        "中价带(45-95元)竞争最激烈，但市场容量最大，建议作为主推款定价区间。",
        "中高价带(95-189元)旗舰店占主导，品牌溢价空间大，适合打造差异化精品。",
        "低价带以淘宝C店为主，利润空间有限，不建议作为新品牌切入点。"
      ]
    }
  }
};

export const getMockTaskStatus = (step: number): TaskStatus => {
  const steps: StepDetail[] = [
    { step: 1, name: "数据清洗与预处理", status: step > 1 ? 'completed' : step === 1 ? 'processing' : 'pending' },
    { step: 2, name: "市场统计计算", status: step > 2 ? 'completed' : step === 2 ? 'processing' : 'pending' },
    { step: 3, name: "商品图片分类", status: step > 3 ? 'completed' : step === 3 ? 'processing' : 'pending', progress: step === 3 ? '45/276' : undefined },
    { step: 4, name: "价格带分析", status: step > 4 ? 'completed' : step === 4 ? 'processing' : 'pending' },
    { step: 5, name: "综合报告生成", status: step > 5 ? 'completed' : step === 5 ? 'processing' : 'pending' }
  ];

  return {
    task_id: "mock_task_123",
    status: step >= 6 ? 'completed' : 'processing',
    current_step: Math.min(step, 5),
    total_steps: 5,
    step_details: steps
  };
};