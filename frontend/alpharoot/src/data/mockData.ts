import { Industry, Stock, Recommendation, Financial, Disclosure, User } from '../types';

export const mockIndustries: Industry[] = [
  { id: 1, name: '정보기술', code: 'IT', description: 'IT 및 소프트웨어 기업' },
  { id: 2, name: '바이오헬스케어', code: 'BIO', description: '바이오 및 제약 기업' },
  { id: 3, name: '금융', code: 'FIN', description: '은행 및 금융서비스' },
  { id: 4, name: '반도체', code: 'SEMI', description: '반도체 제조 및 설계' },
  { id: 5, name: '자동차', code: 'AUTO', description: '자동차 제조 및 부품' },
  { id: 6, name: '화학', code: 'CHEM', description: '화학 및 석유화학' },
  { id: 7, name: '건설', code: 'CONST', description: '건설 및 건설자재' },
  { id: 8, name: '유통', code: 'RETAIL', description: '유통 및 소매업' }
];

export const mockStocks: Stock[] = [
  {
    id: 1,
    ticker: '005930',
    name: '삼성전자',
    marketCap: 450000000000000,
    dividendYield: 2.3,
    currentPrice: 75000,
    industry: mockIndustries[3], // 반도체
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 2,
    ticker: '000660',
    name: 'SK하이닉스',
    marketCap: 85000000000000,
    dividendYield: 1.5,
    currentPrice: 125000,
    industry: mockIndustries[3], // 반도체
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 3,
    ticker: '035420',
    name: 'NAVER',
    marketCap: 85000000000000,
    dividendYield: 0.8,
    currentPrice: 205000,
    industry: mockIndustries[0], // IT
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 4,
    ticker: '035720',
    name: '카카오',
    marketCap: 32000000000000,
    dividendYield: 0.0,
    currentPrice: 45000,
    industry: mockIndustries[0], // IT
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 5,
    ticker: '207940',
    name: '삼성바이오로직스',
    marketCap: 95000000000000,
    dividendYield: 0.2,
    currentPrice: 785000,
    industry: mockIndustries[1], // 바이오
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 6,
    ticker: '005380',
    name: '현대차',
    marketCap: 55000000000000,
    dividendYield: 3.2,
    currentPrice: 245000,
    industry: mockIndustries[4], // 자동차
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  }
];

export const mockFinancials: Financial[] = [
  {
    id: 1,
    stockId: 1, // 삼성전자
    year: 2023,
    quarter: 4,
    revenue: 67000000000000,
    netIncome: 6500000000000,
    totalAssets: 427000000000000,
    totalDebt: 45000000000000,
    equity: 325000000000000,
    peRatio: 16.5,
    pbRatio: 1.2,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    stockId: 2, // SK하이닉스
    year: 2023,
    quarter: 4,
    revenue: 18000000000000,
    netIncome: 1200000000000,
    totalAssets: 65000000000000,
    totalDebt: 8000000000000,
    equity: 42000000000000,
    peRatio: 22.5,
    pbRatio: 1.8,
    createdAt: '2024-01-01T00:00:00Z'
  }
];

export const mockDisclosures: Disclosure[] = [
  {
    id: 1,
    stockId: 1,
    title: '2023년 4분기 실적발표',
    content: '2023년 4분기 연결기준 매출액 67조원, 영업이익 6.5조원을 기록했습니다.',
    disclosureDate: '2024-01-25T09:00:00Z',
    disclosureType: '실적공시',
    createdAt: '2024-01-25T09:00:00Z'
  },
  {
    id: 2,
    stockId: 1,
    title: '신규 파운드리 투자 계획 발표',
    content: 'AI 칩 수요 증가에 대응하기 위한 대규모 파운드리 투자 계획을 발표했습니다.',
    disclosureDate: '2024-01-20T14:30:00Z',
    disclosureType: '투자계획',
    createdAt: '2024-01-20T14:30:00Z'
  }
];

export const mockRecommendations: Recommendation[] = [
  {
    id: 1,
    userId: 1,
    stock: mockStocks[0], // 삼성전자
    reason: 'AI 칩 수요 증가와 메모리 반도체 사이클 회복으로 인한 실적 개선이 예상됩니다. 현재 밸류에이션이 상대적으로 저평가되어 있어 매수 추천합니다.',
    confidenceScore: 0.85,
    recommendationType: 'buy',
    targetPrice: 85000,
    createdAt: '2024-01-15T10:00:00Z',
    isAccepted: true
  },
  {
    id: 2,
    userId: 1,
    stock: mockStocks[2], // NAVER
    reason: '클라우드 사업 성장과 AI 서비스 확장이 긍정적입니다. 검색 광고 시장 회복과 함께 안정적인 성장이 기대됩니다.',
    confidenceScore: 0.78,
    recommendationType: 'buy',
    targetPrice: 230000,
    createdAt: '2024-01-15T10:05:00Z',
    isAccepted: null
  },
  {
    id: 3,
    userId: 1,
    stock: mockStocks[5], // 현대차
    reason: '전기차 시장 확대와 인도 및 미국 시장에서의 판매 증가가 기대됩니다. 배당수익률도 매력적입니다.',
    confidenceScore: 0.72,
    recommendationType: 'buy',
    targetPrice: 280000,
    createdAt: '2024-01-15T10:10:00Z',
    isAccepted: false
  },
  {
    id: 4,
    userId: 1,
    stock: mockStocks[1], // SK하이닉스
    reason: 'HBM(고대역폭메모리) 수요 급증과 AI 서버용 메모리 시장 확대로 실적 개선이 예상됩니다.',
    confidenceScore: 0.88,
    recommendationType: 'buy',
    targetPrice: 145000,
    createdAt: '2024-01-15T10:15:00Z',
    isAccepted: null
  }
];

export const mockUser: User = {
  id: 1,
  email: 'test@example.com',
  name: '김투자',
  isActive: true,
  createdAt: '2024-01-01T00:00:00Z',
  lastLogin: '2024-01-15T09:30:00Z'
};

// 유틸리티 함수들
export const getStockById = (id: number): Stock | undefined => {
  return mockStocks.find(stock => stock.id === id);
};

export const getFinancialsByStockId = (stockId: number): Financial[] => {
  return mockFinancials.filter(financial => financial.stockId === stockId);
};

export const getDisclosuresByStockId = (stockId: number): Disclosure[] => {
  return mockDisclosures.filter(disclosure => disclosure.stockId === stockId);
};

export const getRecommendationsByUserId = (userId: number): Recommendation[] => {
  return mockRecommendations.filter(rec => rec.userId === userId);
};

// 포맷팅 유틸리티
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ko-KR').format(price) + '원';
};

export const formatMarketCap = (marketCap: number): string => {
  const trillion = marketCap / 1000000000000;
  return trillion.toFixed(1) + '조원';
};

export const formatPercentage = (value: number): string => {
  return value.toFixed(1) + '%';
}; 