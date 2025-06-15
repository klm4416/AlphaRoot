import { Stock, Industry } from '../models/Stock';

export class StockService {
  private static instance: StockService;
  private industries: Industry[] = [];
  private stocks: Stock[] = [];

  private constructor() {
    this.initializeMockData();
  }

  // 싱글톤 패턴 구현
  public static getInstance(): StockService {
    if (!StockService.instance) {
      StockService.instance = new StockService();
    }
    return StockService.instance;
  }

  // 목 데이터 초기화
  private initializeMockData(): void {
    // 산업 데이터 초기화
    this.industries = [
      new Industry(1, 'IT', 'IT', '정보기술 및 소프트웨어'),
      new Industry(2, '바이오', 'BIO', '바이오 및 제약'),
      new Industry(3, '금융', 'FIN', '금융 및 보험'),
      new Industry(4, '반도체', 'SEMI', '반도체 및 전자부품'),
      new Industry(5, '자동차', 'AUTO', '자동차 및 부품'),
      new Industry(6, '화학', 'CHEM', '화학 및 소재'),
      new Industry(7, '에너지', 'ENERGY', '에너지 및 전력'),
      new Industry(8, '통신', 'TELECOM', '통신 및 미디어')
    ];

    // 주식 데이터 초기화
    const itIndustry = this.industries.find(i => i.code === 'IT')!;
    const bioIndustry = this.industries.find(i => i.code === 'BIO')!;
    const semiIndustry = this.industries.find(i => i.code === 'SEMI')!;
    const autoIndustry = this.industries.find(i => i.code === 'AUTO')!;

    this.stocks = [
      new Stock(1, '005930', '삼성전자', semiIndustry, new Date(), new Date(), 592000000000000, 2.1, 71000),
      new Stock(2, '000660', 'SK하이닉스', semiIndustry, new Date(), new Date(), 89000000000000, 1.8, 122000),
      new Stock(3, '035420', 'NAVER', itIndustry, new Date(), new Date(), 31000000000000, 0.5, 185000),
      new Stock(4, '035720', '카카오', itIndustry, new Date(), new Date(), 19000000000000, 0.3, 43000),
      new Stock(5, '207940', '삼성바이오로직스', bioIndustry, new Date(), new Date(), 105000000000000, 0.0, 875000),
      new Stock(6, '005380', '현대차', autoIndustry, new Date(), new Date(), 42000000000000, 3.2, 197000)
    ];
  }

  // 모든 산업 반환
  public getAllIndustries(): Industry[] {
    return [...this.industries];
  }

  // 모든 주식 반환
  public getAllStocks(): Stock[] {
    return [...this.stocks];
  }

  // ID로 주식 조회
  public getStockById(id: number): Stock | null {
    return this.stocks.find(stock => stock.id === id) || null;
  }

  // 티커로 주식 조회
  public getStockByTicker(ticker: string): Stock | null {
    return this.stocks.find(stock => stock.ticker === ticker) || null;
  }

  // 산업별 주식 조회
  public getStocksByIndustry(industryCode: string): Stock[] {
    return this.stocks.filter(stock => stock.industry.code === industryCode);
  }

  // 배당 수익률이 높은 주식 조회
  public getHighDividendStocks(minYield: number = 2.0): Stock[] {
    return this.stocks.filter(stock => stock.isHighDividendStock() && (stock.dividendYield || 0) >= minYield);
  }

  // 대형주 조회
  public getLargeCapStocks(): Stock[] {
    return this.stocks.filter(stock => stock.getLargeCapCategory() === 'large');
  }

  // 주식 검색
  public searchStocks(query: string): Stock[] {
    const lowerQuery = query.toLowerCase();
    return this.stocks.filter(stock => 
      stock.name.toLowerCase().includes(lowerQuery) ||
      stock.ticker.toLowerCase().includes(lowerQuery) ||
      stock.industry.name.toLowerCase().includes(lowerQuery)
    );
  }

  // 주식 가격 업데이트
  public updateStockPrice(stockId: number, newPrice: number): Stock | null {
    const stock = this.getStockById(stockId);
    if (stock) {
      stock.updatePrice(newPrice);
      return stock;
    }
    return null;
  }

  // 주식 정보 업데이트
  public updateStock(stockId: number, updates: Partial<Stock>): Stock | null {
    const stock = this.getStockById(stockId);
    if (stock) {
      if (updates.marketCap !== undefined) stock.marketCap = updates.marketCap;
      if (updates.dividendYield !== undefined) stock.dividendYield = updates.dividendYield;
      if (updates.currentPrice !== undefined) stock.updatePrice(updates.currentPrice);
      stock.updatedAt = new Date();
      return stock;
    }
    return null;
  }

  // 주식 추가
  public addStock(stockData: {
    ticker: string;
    name: string;
    industryCode: string;
    marketCap?: number;
    dividendYield?: number;
    currentPrice?: number;
  }): Stock | null {
    const industry = this.industries.find(i => i.code === stockData.industryCode);
    if (!industry) {
      throw new Error('해당 산업이 존재하지 않습니다.');
    }

    // 중복 티커 확인
    if (this.getStockByTicker(stockData.ticker)) {
      throw new Error('이미 존재하는 티커입니다.');
    }

    const newStock = new Stock(
      Date.now(), // 임시 ID
      stockData.ticker,
      stockData.name,
      industry,
      new Date(),
      new Date(),
      stockData.marketCap,
      stockData.dividendYield,
      stockData.currentPrice
    );

    this.stocks.push(newStock);
    return newStock;
  }

  // 주식 제거
  public removeStock(stockId: number): boolean {
    const index = this.stocks.findIndex(stock => stock.id === stockId);
    if (index !== -1) {
      this.stocks.splice(index, 1);
      return true;
    }
    return false;
  }

  // 시장 통계 계산
  public getMarketStatistics(): {
    totalStocks: number;
    totalMarketCap: number;
    averageDividendYield: number;
    industryDistribution: { [industry: string]: number };
  } {
    const totalStocks = this.stocks.length;
    const totalMarketCap = this.stocks.reduce((sum, stock) => sum + (stock.marketCap || 0), 0);
    
    const stocksWithDividend = this.stocks.filter(stock => stock.dividendYield !== undefined);
    const averageDividendYield = stocksWithDividend.length > 0 
      ? stocksWithDividend.reduce((sum, stock) => sum + (stock.dividendYield || 0), 0) / stocksWithDividend.length
      : 0;

    const industryDistribution: { [industry: string]: number } = {};
    this.stocks.forEach(stock => {
      const industryName = stock.industry.name;
      industryDistribution[industryName] = (industryDistribution[industryName] || 0) + 1;
    });

    return {
      totalStocks,
      totalMarketCap,
      averageDividendYield,
      industryDistribution
    };
  }

  // 상위 N개 주식 반환 (시가총액 기준)
  public getTopStocksByMarketCap(limit: number = 5): Stock[] {
    return this.stocks
      .filter(stock => stock.marketCap !== undefined)
      .sort((a, b) => (b.marketCap || 0) - (a.marketCap || 0))
      .slice(0, limit);
  }

  // 가격 변동률 계산 (실제로는 과거 데이터가 필요하지만 목 데이터로 시뮬레이션)
  public getPriceChangeSimulation(stockId: number): { price: number; change: number; changePercent: number } | null {
    const stock = this.getStockById(stockId);
    if (!stock || !stock.currentPrice) return null;

    // 목 데이터로 랜덤 변동률 생성 (-5% ~ +5%)
    const changePercent = (Math.random() - 0.5) * 10;
    const change = stock.currentPrice * (changePercent / 100);
    
    return {
      price: stock.currentPrice,
      change,
      changePercent
    };
  }
} 