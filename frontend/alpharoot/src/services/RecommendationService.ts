import { Recommendation, RecommendationType } from '../models/Recommendation';
import { User } from '../models/User';
import { Stock } from '../models/Stock';
import { StockService } from './StockService';
import { AuthService } from './AuthService';

export class RecommendationService {
  private static instance: RecommendationService;
  private recommendations: Recommendation[] = [];
  private stockService: StockService;
  private authService: AuthService;

  private constructor() {
    this.stockService = StockService.getInstance();
    this.authService = AuthService.getInstance();
    this.initializeMockRecommendations();
  }

  // 싱글톤 패턴 구현
  public static getInstance(): RecommendationService {
    if (!RecommendationService.instance) {
      RecommendationService.instance = new RecommendationService();
    }
    return RecommendationService.instance;
  }

  // 목 추천 데이터 초기화
  private initializeMockRecommendations(): void {
    const stocks = this.stockService.getAllStocks();
    const mockUser = new User(1, 'test@example.com', '테스트 사용자');

    this.recommendations = [
      new Recommendation(
        1,
        mockUser,
        stocks[0], // 삼성전자
        RecommendationType.BUY,
        75000,
        85,
        '반도체 슈퍼사이클과 메모리 수요 증가로 인한 실적 개선이 예상됩니다. AI 및 데이터센터 확산으로 HBM 메모리 수요가 급증하고 있으며, 삼성전자는 이 분야의 선도기업으로 자리잡고 있습니다.',
        new Date(Date.now() - 86400000), // 1일 전
        new Date(Date.now() - 86400000)
      ),
      new Recommendation(
        2,
        mockUser,
        stocks[1], // SK하이닉스
        RecommendationType.BUY,
        140000,
        78,
        'HBM(High Bandwidth Memory) 시장에서의 강력한 입지와 NVIDIA와의 파트너십으로 인한 수혜가 예상됩니다. AI 칩 수요 증가에 따른 고부가가치 메모리 반도체 매출 성장이 지속될 것으로 보입니다.',
        new Date(Date.now() - 172800000), // 2일 전
        new Date(Date.now() - 172800000)
      ),
      new Recommendation(
        3,
        mockUser,
        stocks[2], // NAVER
        RecommendationType.HOLD,
        200000,
        72,
        '네이버클라우드플랫폼(NCP)의 성장과 하이퍼클로바X의 상용화가 긍정적이나, 광고 시장의 불확실성과 경쟁 심화로 단기적 성장에는 제약이 있을 것으로 판단됩니다. 중장기적으로는 AI 기술력을 바탕으로 한 새로운 수익원 창출이 기대됩니다.',
        new Date(Date.now() - 259200000), // 3일 전
        new Date(Date.now() - 259200000)
      ),
      new Recommendation(
        4,
        mockUser,
        stocks[3], // 카카오
        RecommendationType.HOLD,
        50000,
        65,
        '카카오페이와 카카오뱅크의 금융 사업 성장이 긍정적이지만, 규제 리스크와 대주주 지분 매각 이슈가 부담 요인입니다. 플랫폼 기반의 안정적인 수익 구조를 바탕으로 중장기 성장 가능성은 유지되고 있습니다.',
        new Date(Date.now() - 345600000), // 4일 전
        new Date(Date.now() - 345600000)
      )
    ];
  }

  // 사용자의 모든 추천 조회
  public getRecommendationsForUser(userId: number): Recommendation[] {
    return this.recommendations.filter(rec => rec.user.id === userId);
  }

  // 현재 사용자의 추천 조회
  public getCurrentUserRecommendations(): Recommendation[] {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return [];
    return this.getRecommendationsForUser(currentUser.id);
  }

  // 미결정 추천 조회
  public getPendingRecommendations(userId: number): Recommendation[] {
    return this.getRecommendationsForUser(userId).filter(rec => rec.isPendingDecision());
  }

  // 수락된 추천 조회
  public getAcceptedRecommendations(userId: number): Recommendation[] {
    return this.getRecommendationsForUser(userId).filter(rec => rec.isAccepted === true);
  }

  // 거절된 추천 조회
  public getRejectedRecommendations(userId: number): Recommendation[] {
    return this.getRecommendationsForUser(userId).filter(rec => rec.isAccepted === false);
  }

  // 추천 타입별 조회
  public getRecommendationsByType(userId: number, type: RecommendationType): Recommendation[] {
    return this.getRecommendationsForUser(userId).filter(rec => rec.type === type);
  }

  // 고신뢰도 추천 조회
  public getHighConfidenceRecommendations(userId: number): Recommendation[] {
    return this.getRecommendationsForUser(userId).filter(rec => rec.isHighConfidence());
  }

  // 특정 주식에 대한 추천 조회
  public getRecommendationsForStock(userId: number, stockId: number): Recommendation[] {
    return this.getRecommendationsForUser(userId).filter(rec => rec.stock.id === stockId);
  }

  // 추천 수락
  public acceptRecommendation(recommendationId: number): Recommendation | null {
    const recommendation = this.recommendations.find(rec => rec.id === recommendationId);
    if (recommendation) {
      recommendation.accept();
      return recommendation;
    }
    return null;
  }

  // 추천 거절
  public rejectRecommendation(recommendationId: number): Recommendation | null {
    const recommendation = this.recommendations.find(rec => rec.id === recommendationId);
    if (recommendation) {
      recommendation.reject();
      return recommendation;
    }
    return null;
  }

  // 새로운 추천 생성
  public createRecommendation(
    userId: number,
    stockId: number,
    type: RecommendationType,
    targetPrice: number,
    confidence: number,
    reasoning: string
  ): Recommendation | null {
    const user = this.authService.getCurrentUser();
    const stock = this.stockService.getStockById(stockId);
    
    if (!user || !stock || user.id !== userId) {
      return null;
    }

    const newRecommendation = new Recommendation(
      Date.now(), // 임시 ID
      user,
      stock,
      type,
      targetPrice,
      confidence,
      reasoning
    );

    this.recommendations.push(newRecommendation);
    return newRecommendation;
  }

  // 추천 삭제
  public deleteRecommendation(recommendationId: number): boolean {
    const index = this.recommendations.findIndex(rec => rec.id === recommendationId);
    if (index !== -1) {
      this.recommendations.splice(index, 1);
      return true;
    }
    return false;
  }

  // 추천 통계
  public getRecommendationStatistics(userId: number): {
    total: number;
    pending: number;
    accepted: number;
    rejected: number;
    byType: { [type: string]: number };
    averageConfidence: number;
    highConfidenceCount: number;
  } {
    const userRecommendations = this.getRecommendationsForUser(userId);
    
    const total = userRecommendations.length;
    const pending = userRecommendations.filter(rec => rec.isPendingDecision()).length;
    const accepted = userRecommendations.filter(rec => rec.isAccepted === true).length;
    const rejected = userRecommendations.filter(rec => rec.isAccepted === false).length;
    
    const byType: { [type: string]: number } = {};
    userRecommendations.forEach(rec => {
      const typeLabel = rec.getTypeLabel();
      byType[typeLabel] = (byType[typeLabel] || 0) + 1;
    });

    const averageConfidence = total > 0 
      ? userRecommendations.reduce((sum, rec) => sum + rec.confidence, 0) / total
      : 0;

    const highConfidenceCount = userRecommendations.filter(rec => rec.isHighConfidence()).length;

    return {
      total,
      pending,
      accepted,
      rejected,
      byType,
      averageConfidence,
      highConfidenceCount
    };
  }

  // 최근 추천 조회
  public getRecentRecommendations(userId: number, days: number = 7): Recommendation[] {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return this.getRecommendationsForUser(userId).filter(rec => rec.createdAt >= cutoffDate);
  }

  // 추천 검색
  public searchRecommendations(userId: number, query: string): Recommendation[] {
    const lowerQuery = query.toLowerCase();
    return this.getRecommendationsForUser(userId).filter(rec =>
      rec.stock.name.toLowerCase().includes(lowerQuery) ||
      rec.stock.ticker.toLowerCase().includes(lowerQuery) ||
      rec.reasoning.toLowerCase().includes(lowerQuery) ||
      rec.getTypeLabel().toLowerCase().includes(lowerQuery)
    );
  }

  // 포트폴리오 추천 (다양화를 위한 추천)
  public getPortfolioDiversificationRecommendations(userId: number): {
    recommendations: Recommendation[];
    reasoning: string;
  } {
    const acceptedRecommendations = this.getAcceptedRecommendations(userId);
    const currentIndustries = new Set(acceptedRecommendations.map(rec => rec.stock.industry.code));
    
    // 현재 포트폴리오에 없는 산업의 주식 추천
    const allStocks = this.stockService.getAllStocks();
    const diversificationStocks = allStocks.filter(stock => 
      !currentIndustries.has(stock.industry.code)
    );

    const user = this.authService.getCurrentUser();
    if (!user) return { recommendations: [], reasoning: '' };

    const diversificationRecommendations = diversificationStocks.slice(0, 2).map((stock, index) => 
      new Recommendation(
        Date.now() + index,
        user,
        stock,
        RecommendationType.BUY,
        (stock.currentPrice || 0) * 1.1,
        70,
        `포트폴리오 다양화를 위한 ${stock.industry.name} 섹터 추천입니다.`
      )
    );

    return {
      recommendations: diversificationRecommendations,
      reasoning: '현재 포트폴리오의 산업 집중도를 낮추고 리스크를 분산시키기 위한 추천입니다.'
    };
  }
} 