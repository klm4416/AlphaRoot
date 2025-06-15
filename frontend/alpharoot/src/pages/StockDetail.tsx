import React, { Component } from 'react';
import { useParams } from 'react-router-dom';
import { StockService } from '../services/StockService';
import { Stock } from '../models/Stock';
import styles from '../styles/StockDetail.module.css';

interface StockDetailState {
  stock: Stock | null;
  activeTab: 'overview' | 'financial' | 'disclosure';
  isLoading: boolean;
  error: string;
}

interface StockDetailProps {
  stockId: string;
}

// HOC to inject route params
function withRouter<T extends {}>(Component: React.ComponentType<T & StockDetailProps>) {
  return function WrappedComponent(props: Omit<T, keyof StockDetailProps>) {
    const params = useParams<{ id: string }>();
    return <Component {...(props as T)} stockId={params.id || ''} />;
  };
}

class StockDetailComponent extends Component<StockDetailProps, StockDetailState> {
  private stockService: StockService;

  constructor(props: StockDetailProps) {
    super(props);

    this.state = {
      stock: null,
      activeTab: 'overview',
      isLoading: true,
      error: ''
    };

    // 서비스 인스턴스 초기화
    this.stockService = StockService.getInstance();

    // 메서드 바인딩
    this.handleTabChange = this.handleTabChange.bind(this);
    this.goBack = this.goBack.bind(this);
  }

  // 컴포넌트 마운트 시 주식 데이터 로드
  async componentDidMount(): Promise<void> {
    await this.loadStockData();
  }

  // 주식 ID가 변경될 때 데이터 재로드
  async componentDidUpdate(prevProps: StockDetailProps): Promise<void> {
    if (prevProps.stockId !== this.props.stockId) {
      await this.loadStockData();
    }
  }

  // 주식 데이터 로드
  private async loadStockData(): Promise<void> {
    try {
      this.setState({ isLoading: true, error: '' });

      const stockId = parseInt(this.props.stockId);
      if (isNaN(stockId)) {
        throw new Error('올바르지 않은 주식 ID입니다.');
      }

      const stock = this.stockService.getStockById(stockId);
      
      if (!stock) {
        throw new Error('주식 정보를 찾을 수 없습니다.');
      }

      this.setState({
        stock,
        isLoading: false
      });

    } catch (error) {
      this.setState({
        error: error instanceof Error ? error.message : '주식 정보를 불러오는데 실패했습니다.',
        isLoading: false
      });
    }
  }

  // 탭 변경 핸들러
  private handleTabChange(tab: 'overview' | 'financial' | 'disclosure'): void {
    this.setState({ activeTab: tab });
  }

  // 뒤로가기
  private goBack(): void {
    window.history.back();
  }

  // 헤더 렌더링
  private renderHeader(): React.ReactElement {
    const { stock } = this.state;

    return (
      <header className={styles.header}>
        <button onClick={this.goBack} className={styles.backButton}>
          ← 뒤로가기
        </button>
        <div className={styles.stockInfo}>
          <h1>{stock?.name}</h1>
          <p className={styles.ticker}>{stock?.ticker}</p>
          <span className={styles.industry}>{stock?.industry.name}</span>
        </div>
      </header>
    );
  }

  // 탭 네비게이션 렌더링
  private renderTabs(): React.ReactElement {
    const { activeTab } = this.state;

    return (
      <nav className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'overview' ? styles.active : ''}`}
          onClick={() => this.handleTabChange('overview')}
        >
          개요
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'financial' ? styles.active : ''}`}
          onClick={() => this.handleTabChange('financial')}
        >
          재무정보
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'disclosure' ? styles.active : ''}`}
          onClick={() => this.handleTabChange('disclosure')}
        >
          공시정보
        </button>
      </nav>
    );
  }

  // 개요 탭 렌더링
  private renderOverviewTab(): React.ReactElement {
    const { stock } = this.state;
    if (!stock) return <div>주식 정보가 없습니다.</div>;

    // 가격 변동 시뮬레이션
    const priceChange = this.stockService.getPriceChangeSimulation(stock.id);

    return (
      <div className={styles.tabContent}>
        <div className={styles.priceSection}>
          <div className={styles.currentPrice}>
            <h2>{stock.getFormattedPrice()}</h2>
            {priceChange && (
              <div className={`${styles.priceChange} ${priceChange.change > 0 ? styles.positive : styles.negative}`}>
                <span>{priceChange.change > 0 ? '+' : ''}{priceChange.change.toFixed(0)}원</span>
                <span>({priceChange.changePercent > 0 ? '+' : ''}{priceChange.changePercent.toFixed(2)}%)</span>
              </div>
            )}
          </div>
        </div>

        <div className={styles.keyMetrics}>
          <h3>주요 지표</h3>
          <div className={styles.metricsGrid}>
            <div className={styles.metric}>
              <span className={styles.metricLabel}>시가총액</span>
              <span className={styles.metricValue}>{stock.getFormattedMarketCap()}</span>
            </div>
            <div className={styles.metric}>
              <span className={styles.metricLabel}>배당수익률</span>
              <span className={styles.metricValue}>{stock.getFormattedDividendYield()}</span>
            </div>
            <div className={styles.metric}>
              <span className={styles.metricLabel}>업종</span>
              <span className={styles.metricValue}>{stock.industry.name}</span>
            </div>
            <div className={styles.metric}>
              <span className={styles.metricLabel}>상장일</span>
              <span className={styles.metricValue}>{stock.createdAt.toLocaleDateString('ko-KR')}</span>
            </div>
          </div>
        </div>

        <div className={styles.investmentPoints}>
          <h3>투자 포인트</h3>
          <ul>
            <li>업계 선도기업으로서의 강력한 시장 지위</li>
            <li>지속적인 기술 혁신과 R&D 투자</li>
            <li>안정적인 재무구조와 현금흐름</li>
            <li>글로벌 시장에서의 경쟁력</li>
          </ul>
        </div>

        <div className={styles.companyOverview}>
          <h3>기업 개요</h3>
          <p>
            {stock.name}은 {stock.industry.name} 분야의 대표적인 기업으로, 
            지속적인 성장과 혁신을 통해 시장에서 선도적인 위치를 확고히 하고 있습니다.
            안정적인 수익 구조와 강력한 기술력을 바탕으로 장기적인 성장 가능성을 보여주고 있습니다.
          </p>
        </div>
      </div>
    );
  }

  // 재무정보 탭 렌더링
  private renderFinancialTab(): React.ReactElement {
    const { stock } = this.state;
    if (!stock) return <div>주식 정보가 없습니다.</div>;

    // 목 재무 데이터 생성
    const mockFinancialData = {
      revenue: stock.name === '삼성전자' ? 2796810 : 364890,
      operatingIncome: stock.name === '삼성전자' ? 359990 : 45670,
      netIncome: stock.name === '삼성전자' ? 233210 : 32110,
      totalAssets: stock.name === '삼성전자' ? 4262340 : 231450,
      totalEquity: stock.name === '삼성전자' ? 3166970 : 156780,
      operatingMargin: stock.name === '삼성전자' ? 12.9 : 12.5,
      netMargin: stock.name === '삼성전자' ? 8.3 : 8.8,
      roe: stock.name === '삼성전자' ? 7.4 : 20.5,
      roa: stock.name === '삼성전자' ? 5.5 : 13.9
    };

    return (
      <div className={styles.tabContent}>
        <div className={styles.financialSection}>
          <h3>손익계산서 (단위: 억원)</h3>
          <table className={styles.financialTable}>
            <tbody>
              <tr>
                <td>매출액</td>
                <td>{mockFinancialData.revenue.toLocaleString()}</td>
              </tr>
              <tr>
                <td>영업이익</td>
                <td>{mockFinancialData.operatingIncome.toLocaleString()}</td>
              </tr>
              <tr>
                <td>당기순이익</td>
                <td>{mockFinancialData.netIncome.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className={styles.financialSection}>
          <h3>재무상태표 (단위: 억원)</h3>
          <table className={styles.financialTable}>
            <tbody>
              <tr>
                <td>총자산</td>
                <td>{mockFinancialData.totalAssets.toLocaleString()}</td>
              </tr>
              <tr>
                <td>총자본</td>
                <td>{mockFinancialData.totalEquity.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className={styles.financialSection}>
          <h3>주요 재무비율</h3>
          <table className={styles.financialTable}>
            <tbody>
              <tr>
                <td>영업이익률</td>
                <td>{mockFinancialData.operatingMargin}%</td>
              </tr>
              <tr>
                <td>순이익률</td>
                <td>{mockFinancialData.netMargin}%</td>
              </tr>
              <tr>
                <td>ROE</td>
                <td>{mockFinancialData.roe}%</td>
              </tr>
              <tr>
                <td>ROA</td>
                <td>{mockFinancialData.roa}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // 공시정보 탭 렌더링
  private renderDisclosureTab(): React.ReactElement {
    // 목 공시 데이터
    const mockDisclosures = [
      {
        id: 1,
        date: new Date(2024, 11, 20),
        title: '2024년 3분기 실적 발표',
        content: '매출액 및 영업이익 증가로 양호한 실적을 기록했습니다.'
      },
      {
        id: 2,
        date: new Date(2024, 11, 15),
        title: '신규 사업 투자 계획 공시',
        content: 'AI 및 반도체 분야 신규 투자 계획을 발표했습니다.'
      },
      {
        id: 3,
        date: new Date(2024, 10, 28),
        title: '주주총회 소집 공고',
        content: '정기 주주총회 개최 일정을 공지합니다.'
      }
    ];

    return (
      <div className={styles.tabContent}>
        <div className={styles.disclosureSection}>
          <h3>최근 공시정보</h3>
          <div className={styles.disclosureList}>
            {mockDisclosures.map(disclosure => (
              <div key={disclosure.id} className={styles.disclosureItem}>
                <div className={styles.disclosureDate}>
                  {disclosure.date.toLocaleDateString('ko-KR')}
                </div>
                <div className={styles.disclosureContent}>
                  <h4>{disclosure.title}</h4>
                  <p>{disclosure.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 메인 콘텐츠 렌더링
  private renderTabContent(): React.ReactElement {
    const { activeTab } = this.state;

    switch (activeTab) {
      case 'overview':
        return this.renderOverviewTab();
      case 'financial':
        return this.renderFinancialTab();
      case 'disclosure':
        return this.renderDisclosureTab();
      default:
        return this.renderOverviewTab();
    }
  }

  // 로딩 상태 렌더링
  private renderLoading(): React.ReactElement {
    return (
      <div className={styles.loading}>
        <p>주식 정보를 불러오는 중...</p>
      </div>
    );
  }

  // 에러 상태 렌더링
  private renderError(): React.ReactElement {
    const { error } = this.state;

    return (
      <div className={styles.error}>
        <h2>오류가 발생했습니다</h2>
        <p>{error}</p>
        <button onClick={this.goBack}>뒤로가기</button>
      </div>
    );
  }

  render(): React.ReactElement {
    const { isLoading, error, stock } = this.state;

    if (isLoading) {
      return this.renderLoading();
    }

    if (error || !stock) {
      return this.renderError();
    }

    return (
      <div className={styles.stockDetail}>
        {this.renderHeader()}
        {this.renderTabs()}
        <main className={styles.mainContent}>
          {this.renderTabContent()}
        </main>
      </div>
    );
  }
}

// HOC로 wrapped된 컴포넌트 export
export const StockDetail = withRouter(StockDetailComponent); 