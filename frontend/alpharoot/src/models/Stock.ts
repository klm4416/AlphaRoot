export class Industry {
  public id: number;
  public name: string;
  public code: string;
  public description?: string;

  constructor(id: number, name: string, code: string, description?: string) {
    this.id = id;
    this.name = name;
    this.code = code;
    this.description = description;
  }

  public toJSON(): any {
    return {
      id: this.id,
      name: this.name,
      code: this.code,
      description: this.description
    };
  }

  public static fromJSON(json: any): Industry {
    return new Industry(json.id, json.name, json.code, json.description);
  }
}

export class Stock {
  public id: number;
  public ticker: string;
  public name: string;
  public marketCap?: number;
  public dividendYield?: number;
  public currentPrice?: number;
  public industry: Industry;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(
    id: number,
    ticker: string,
    name: string,
    industry: Industry,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
    marketCap?: number,
    dividendYield?: number,
    currentPrice?: number
  ) {
    this.id = id;
    this.ticker = ticker;
    this.name = name;
    this.industry = industry;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.marketCap = marketCap;
    this.dividendYield = dividendYield;
    this.currentPrice = currentPrice;
  }

  // 비즈니스 로직 메서드들
  public updatePrice(newPrice: number): void {
    this.currentPrice = newPrice;
    this.updatedAt = new Date();
  }

  public getFormattedPrice(): string {
    if (!this.currentPrice) return 'N/A';
    return new Intl.NumberFormat('ko-KR').format(this.currentPrice) + '원';
  }

  public getFormattedMarketCap(): string {
    if (!this.marketCap) return 'N/A';
    const trillion = this.marketCap / 1000000000000;
    return trillion.toFixed(1) + '조원';
  }

  public getFormattedDividendYield(): string {
    if (!this.dividendYield) return 'N/A';
    return this.dividendYield.toFixed(1) + '%';
  }

  public isPriceAvailable(): boolean {
    return this.currentPrice !== undefined && this.currentPrice > 0;
  }

  public isHighDividendStock(): boolean {
    return this.dividendYield !== undefined && this.dividendYield >= 3.0;
  }

  public getLargeCapCategory(): 'large' | 'mid' | 'small' | 'unknown' {
    if (!this.marketCap) return 'unknown';
    const trillion = this.marketCap / 1000000000000;
    
    if (trillion >= 10) return 'large';
    if (trillion >= 1) return 'mid';
    return 'small';
  }

  public getDisplayInfo(): { name: string; ticker: string; industry: string } {
    return {
      name: this.name,
      ticker: this.ticker,
      industry: this.industry.name
    };
  }

  public toJSON(): any {
    return {
      id: this.id,
      ticker: this.ticker,
      name: this.name,
      marketCap: this.marketCap,
      dividendYield: this.dividendYield,
      currentPrice: this.currentPrice,
      industry: this.industry.toJSON(),
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString()
    };
  }

  public static fromJSON(json: any): Stock {
    return new Stock(
      json.id,
      json.ticker,
      json.name,
      Industry.fromJSON(json.industry),
      new Date(json.createdAt),
      new Date(json.updatedAt),
      json.marketCap,
      json.dividendYield,
      json.currentPrice
    );
  }
} 