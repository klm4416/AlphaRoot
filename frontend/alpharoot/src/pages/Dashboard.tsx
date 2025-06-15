import React, { Component } from 'react';
import { AuthService } from '../services/AuthService';
import { StockService } from '../services/StockService';
import { RecommendationService } from '../services/RecommendationService';
import { User } from '../models/User';
import { Stock } from '../models/Stock';
import { Recommendation } from '../models/Recommendation';
import styles from '../styles/Dashboard.module.css';

interface DashboardState {
  currentUser: User | null;
  activeTab: 'recommendations' | 'watchlist' | 'market';
  recommendations: Recommendation[];
  stocks: Stock[];
  isLoading: boolean;
  error: string;
}

export class Dashboard extends Component<{}, DashboardState> {
  private authService: AuthService;
  private stockService: StockService;
  private recommendationService: RecommendationService;

  constructor(props: {}) {
    super(props);

    // 서비스 인스턴스 초기화
    this.authService = AuthService.getInstance();
    this.stockService = StockService.getInstance();
    this.recommendationService = RecommendationService.getInstance();

    this.state = {
      currentUser: null,
      activeTab: 'recommendations',
      recommendations: [],
      stocks: [],
      isLoading: true,
      error: ''
    };

    // 메서드 바인딩
    this.handleTabChange = this.handleTabChange.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleAcceptRecommendation = this.handleAcceptRecommendation.bind(this);
    this.handleRejectRecommendation = this.handleRejectRecommendation.bind(this);
    this.navigateToStock = this.navigateToStock.bind(this);
  }

  // 컴포넌트 마운트 시 데이터 로드
  async componentDidMount(): Promise<void> {
    try {
      await this.loadUserData();
      await this.loadDashboardData();
    } catch (error) {
      this.setState({
        error: error instanceof Error ? error.message : '데이터 로드 중 오류가 발생했습니다.',
        isLoading: false
      });
    }
  }

  // 사용자 데이터 로드
  private async loadUserData(): Promise<void> {
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser) {
      // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
      window.location.href = '/login';
      return;
    }

    this.setState({ currentUser });
  }

  // 대시보드 데이터 로드
  private async loadDashboardData(): Promise<void> {
    try {
      // 병렬로 데이터 로드
      const [recommendations, stocks] = await Promise.all([
        this.loadRecommendations(),
        this.loadStocks()
      ]);

      this.setState({
        recommendations,
        stocks,
        isLoading: false
      });
    } catch (error) {
      throw error;
    }
  }

  // 추천 데이터 로드
  private async loadRecommendations(): Promise<Recommendation[]> {
    return this.recommendationService.getCurrentUserRecommendations();
  }

  // 주식 데이터 로드
  private async loadStocks(): Promise<Stock[]> {
    return this.stockService.getAllStocks();
  }

  // 탭 변경 핸들러
  private handleTabChange(tab: 'recommendations' | 'watchlist' | 'market'): void {
    this.setState({ activeTab: tab });
  }

  // 로그아웃 핸들러
  private handleLogout(): void {
    this.authService.logout();
    window.location.href = '/login';
  }

  // 추천 수락 핸들러
  private handleAcceptRecommendation(recommendationId: number): void {
    const updatedRecommendation = this.recommendationService.acceptRecommendation(recommendationId);
    
    if (updatedRecommendation) {
      // 상태 업데이트
      this.setState(prevState => ({
        recommendations: prevState.recommendations.map(rec => 
          rec.id === recommendationId ? updatedRecommendation : rec
        )
      }));
    }
  }

  // 추천 거절 핸들러
  private handleRejectRecommendation(recommendationId: number): void {
    const updatedRecommendation = this.recommendationService.rejectRecommendation(recommendationId);
    
    if (updatedRecommendation) {
      // 상태 업데이트
      this.setState(prevState => ({
        recommendations: prevState.recommendations.map(rec => 
          rec.id === recommendationId ? updatedRecommendation : rec
        )
      }));
    }
  }

  // 주식 상세 페이지로 이동
  private navigateToStock(stockId: number): void {
    window.location.href = `/stock/${stockId}`;
  }

  // 헤더 렌더링
  private renderHeader(): React.ReactElement {
    const { currentUser } = this.state;

    return (
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>AlphaRoot</h1>
          <div className={styles.headerActions}>
            <span>안녕하세요, {currentUser?.getDisplayName()}님</span>
            <button
              className={styles.preferenceButton}
              onClick={() => window.location.href = '/preference'}
            >
              투자자 성향 분석
            </button>
            <button onClick={this.handleLogout} className={styles.logoutButton}>
              로그아웃
            </button>
          </div>
        </div>
      </header>
    );
  }

  // 사이드바 렌더링
  private renderSidebar(): React.ReactElement {
    const { activeTab } = this.state;

    return (
      <aside className={styles.sidebar}>
        <nav className={styles.nav}>
          <button
            className={`${styles.navButton} ${activeTab === 'recommendations' ? styles.active : ''}`}
            onClick={() => this.handleTabChange('recommendations')}
          >
            AI 추천
          </button>
          <button
            className={`${styles.navButton} ${activeTab === 'watchlist' ? styles.active : ''}`}
            onClick={() => this.handleTabChange('watchlist')}
          >
            관심종목
          </button>
          <button
            className={`${styles.navButton} ${activeTab === 'market' ? styles.active : ''}`}
            onClick={() => this.handleTabChange('market')}
          >
            시장현황
          </button>
        </nav>
      </aside>
    );
  }

  // 추천 카드 렌더링
  private renderRecommendationCard(recommendation: Recommendation): React.ReactElement {
    const stock = recommendation.stock;
    const isDecided = !recommendation.isPendingDecision();

    return (
      <div key={recommendation.id} className={styles.recommendationCard}>
        <div className={styles.cardHeader}>
          <h3 onClick={() => this.navigateToStock(stock.id)} className={styles.stockName}>
            {stock.name} ({stock.ticker})
          </h3>
          <span 
            className={styles.recommendationType}
            style={{ backgroundColor: recommendation.getTypeColor() }}
          >
            {recommendation.getTypeLabel()}
          </span>
        </div>

        <div className={styles.cardContent}>
          <div className={styles.priceInfo}>
            <div className={styles.priceItem}>
              <span className={styles.label}>현재가</span>
              <span className={styles.value}>{stock.getFormattedPrice()}</span>
            </div>
            <div className={styles.priceItem}>
              <span className={styles.label}>목표가</span>
              <span className={styles.value}>{recommendation.getFormattedTargetPrice()}</span>
            </div>
            <div className={styles.priceItem}>
              <span className={styles.label}>예상수익률</span>
              <span className={`${styles.value} ${recommendation.getExpectedReturn() > 0 ? styles.positive : styles.negative}`}>
                {recommendation.getFormattedExpectedReturn()}
              </span>
            </div>
          </div>

          <div className={styles.stockDetails}>
            <span>시가총액: {stock.getFormattedMarketCap()}</span>
            <span>배당수익률: {stock.getFormattedDividendYield()}</span>
            <span className={styles.industry}>{stock.industry.name}</span>
          </div>

          <div className={styles.confidence}>
            <span className={styles.confidenceLabel}>신뢰도</span>
            <div className={styles.confidenceBar}>
              <div 
                className={styles.confidenceProgress}
                style={{ width: `${recommendation.confidence}%` }}
              ></div>
            </div>
            <span className={styles.confidenceValue}>{recommendation.confidence}%</span>
          </div>

          <p className={styles.reasoning}>{recommendation.reasoning}</p>

          {!isDecided && (
            <div className={styles.cardActions}>
              <button 
                className={styles.acceptButton}
                onClick={() => this.handleAcceptRecommendation(recommendation.id)}
              >
                수락
              </button>
              <button 
                className={styles.rejectButton}
                onClick={() => this.handleRejectRecommendation(recommendation.id)}
              >
                거절
              </button>
            </div>
          )}

          {isDecided && (
            <div className={styles.decisionStatus}>
              <span className={`${styles.status} ${recommendation.isAccepted ? styles.accepted : styles.rejected}`}>
                {recommendation.isAccepted ? '수락됨' : '거절됨'}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // AI 추천 탭 렌더링
  private renderRecommendationsTab(): React.ReactElement {
    const { recommendations } = this.state;

    return (
      <div className={styles.tabContent}>
        <h2>AI 추천</h2>
        {recommendations.length === 0 ? (
          <div className={styles.emptyState}>
            <p>현재 추천이 없습니다.</p>
          </div>
        ) : (
          <div className={styles.recommendationsList}>
            {recommendations.map(recommendation => this.renderRecommendationCard(recommendation))}
          </div>
        )}
      </div>
    );
  }

  // 관심종목 탭 렌더링
  private renderWatchlistTab(): React.ReactElement {
    return (
      <div className={styles.tabContent}>
        <h2>관심종목</h2>
        <div className={styles.emptyState}>
          <p>관심종목 기능은 향후 업데이트 예정입니다.</p>
        </div>
      </div>
    );
  }

  // 시장현황 탭 렌더링
  private renderMarketTab(): React.ReactElement {
    const { stocks } = this.state;

    return (
      <div className={styles.tabContent}>
        <h2>시장현황</h2>
        <div className={styles.stockGrid}>
          {stocks.map(stock => (
            <div 
              key={stock.id} 
              className={styles.stockCard}
              onClick={() => this.navigateToStock(stock.id)}
            >
              <h3>{stock.name}</h3>
              <p className={styles.ticker}>{stock.ticker}</p>
              <div className={styles.stockInfo}>
                <span>현재가: {stock.getFormattedPrice()}</span>
                <span>시가총액: {stock.getFormattedMarketCap()}</span>
                <span>배당수익률: {stock.getFormattedDividendYield()}</span>
              </div>
              <span className={styles.industry}>{stock.industry.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 메인 콘텐츠 렌더링
  private renderMainContent(): React.ReactElement {
    const { activeTab } = this.state;

    switch (activeTab) {
      case 'recommendations':
        return this.renderRecommendationsTab();
      case 'watchlist':
        return this.renderWatchlistTab();
      case 'market':
        return this.renderMarketTab();
      default:
        return this.renderRecommendationsTab();
    }
  }

  // 로딩 상태 렌더링
  private renderLoading(): React.ReactElement {
    return (
      <div className={styles.loading}>
        <p>데이터를 불러오는 중...</p>
      </div>
    );
  }

  // 에러 상태 렌더링
  private renderError(): React.ReactElement {
    const { error } = this.state;

    return (
      <div className={styles.error}>
        <p>오류가 발생했습니다: {error}</p>
        <button onClick={() => window.location.reload()}>다시 시도</button>
      </div>
    );
  }

  render(): React.ReactElement {
    const { isLoading, error } = this.state;

    if (isLoading) {
      return this.renderLoading();
    }

    if (error) {
      return this.renderError();
    }

    return (
      <div className={styles.dashboard}>
        {this.renderHeader()}
        <div className={styles.dashboardContent}>
          {this.renderSidebar()}
          <main className={styles.mainContent}>
            {this.renderMainContent()}
          </main>
        </div>
      </div>
    );
  }
} 