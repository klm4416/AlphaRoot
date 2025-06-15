import { Stock } from './Stock';
import { User } from './User';

export enum RecommendationType {
  BUY = 'buy',
  SELL = 'sell',
  HOLD = 'hold'
}

export class Recommendation {
  public id: number;
  public user: User;
  public stock: Stock;
  public type: RecommendationType;
  public targetPrice: number;
  public confidence: number;
  public reasoning: string;
  public isAccepted?: boolean;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(
    id: number,
    user: User,
    stock: Stock,
    type: RecommendationType,
    targetPrice: number,
    confidence: number,
    reasoning: string,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
    isAccepted?: boolean
  ) {
    this.id = id;
    this.user = user;
    this.stock = stock;
    this.type = type;
    this.targetPrice = targetPrice;
    this.confidence = confidence;
    this.reasoning = reasoning;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.isAccepted = isAccepted;
  }

  // 비즈니스 로직 메서드들
  public accept(): void {
    this.isAccepted = true;
    this.updatedAt = new Date();
  }

  public reject(): void {
    this.isAccepted = false;
    this.updatedAt = new Date();
  }

  public getFormattedTargetPrice(): string {
    return new Intl.NumberFormat('ko-KR').format(this.targetPrice) + '원';
  }

  public getConfidenceLevel(): 'low' | 'medium' | 'high' {
    if (this.confidence >= 80) return 'high';
    if (this.confidence >= 60) return 'medium';
    return 'low';
  }

  public getExpectedReturn(): number {
    if (!this.stock.currentPrice) return 0;
    return ((this.targetPrice - this.stock.currentPrice) / this.stock.currentPrice) * 100;
  }

  public getFormattedExpectedReturn(): string {
    const returnRate = this.getExpectedReturn();
    const sign = returnRate > 0 ? '+' : '';
    return `${sign}${returnRate.toFixed(1)}%`;
  }

  public isHighConfidence(): boolean {
    return this.confidence >= 80;
  }

  public isPendingDecision(): boolean {
    return this.isAccepted === undefined;
  }

  public getTypeLabel(): string {
    switch (this.type) {
      case RecommendationType.BUY:
        return '매수';
      case RecommendationType.SELL:
        return '매도';
      case RecommendationType.HOLD:
        return '보유';
      default:
        return '알 수 없음';
    }
  }

  public getTypeColor(): string {
    switch (this.type) {
      case RecommendationType.BUY:
        return '#4CAF50';
      case RecommendationType.SELL:
        return '#f44336';
      case RecommendationType.HOLD:
        return '#FF9800';
      default:
        return '#757575';
    }
  }

  public isRecentRecommendation(): boolean {
    const daysSinceCreation = (Date.now() - this.createdAt.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceCreation <= 7;
  }

  public getSummary(): string {
    const stockName = this.stock.name;
    const typeLabel = this.getTypeLabel();
    const expectedReturn = this.getFormattedExpectedReturn();
    return `${stockName} ${typeLabel} 추천 (예상수익률: ${expectedReturn})`;
  }

  public toJSON(): any {
    return {
      id: this.id,
      user: this.user.toJSON(),
      stock: this.stock.toJSON(),
      type: this.type,
      targetPrice: this.targetPrice,
      confidence: this.confidence,
      reasoning: this.reasoning,
      isAccepted: this.isAccepted,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString()
    };
  }

  public static fromJSON(json: any): Recommendation {
    return new Recommendation(
      json.id,
      User.fromJSON(json.user),
      Stock.fromJSON(json.stock),
      json.type as RecommendationType,
      json.targetPrice,
      json.confidence,
      json.reasoning,
      new Date(json.createdAt),
      new Date(json.updatedAt),
      json.isAccepted
    );
  }
} 