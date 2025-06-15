# AlphaRoot Frontend - 객체지향 구조

AI 기반 주식 추천 서비스 AlphaRoot의 React 프론트엔드 애플리케이션입니다.
**객체지향 프로그래밍 패러다임**을 적용하여 구현되었습니다.

## 🎯 객체지향 구조 특징

### 1. 클래스 기반 컴포넌트
- 모든 React 컴포넌트를 **클래스 컴포넌트**로 구현
- 생명주기 메서드를 활용한 체계적인 상태 관리
- 메서드 바인딩을 통한 명확한 스코프 관리

### 2. 도메인 모델 클래스
```typescript
// 비즈니스 로직이 포함된 도메인 모델
export class Stock {
  public updatePrice(newPrice: number): void
  public getFormattedPrice(): string
  public getFormattedMarketCap(): string
  public isHighDividendStock(): boolean
  // ... 더 많은 메서드들
}
```

### 3. 서비스 레이어 패턴
- **싱글톤 패턴**을 적용한 서비스 클래스들
- 비즈니스 로직의 캡슐화
- 데이터 액세스와 비즈니스 규칙의 분리

```typescript
// 싱글톤 서비스 패턴
export class AuthService {
  private static instance: AuthService;
  
  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }
}
```

## 📁 프로젝트 구조

```
frontend/alpharoot/src/
├── models/                     # 도메인 모델 클래스
│   ├── User.ts                # 사용자 모델
│   ├── Stock.ts               # 주식 & 산업 모델
│   └── Recommendation.ts      # 추천 모델
├── services/                   # 서비스 레이어
│   ├── AuthService.ts         # 인증 서비스
│   ├── StockService.ts        # 주식 데이터 서비스
│   └── RecommendationService.ts # 추천 서비스
├── pages/                      # 페이지 컴포넌트 (클래스)
│   ├── Login.tsx              # 로그인 페이지
│   ├── Register.tsx           # 회원가입 페이지
│   ├── Dashboard.tsx          # 대시보드
│   └── StockDetail.tsx        # 주식 상세 페이지
├── styles/                     # CSS 모듈
└── App.tsx                    # 메인 앱 (클래스)
```

## 🔧 기술 스택

- **React 19.1.0** (클래스 컴포넌트)
- **TypeScript** (객체지향 타입 시스템)
- **React Router DOM** (라우팅)
- **CSS Modules** (스타일링)

## 🏗️ 아키텍처 패턴

### 1. MVC 패턴
- **Model**: 도메인 모델 클래스 (`models/`)
- **View**: React 클래스 컴포넌트 (`pages/`)
- **Controller**: 서비스 클래스 (`services/`)

### 2. 계층화 아키텍처
```
┌─────────────────────┐
│   Presentation      │ ← React 클래스 컴포넌트
│      Layer          │
├─────────────────────┤
│    Business         │ ← 서비스 클래스
│     Layer           │
├─────────────────────┤
│     Domain          │ ← 도메인 모델 클래스
│     Layer           │
└─────────────────────┘
```

### 3. 디자인 패턴
- **싱글톤 패턴**: 서비스 클래스
- **팩토리 패턴**: 모델 인스턴스 생성
- **옵저버 패턴**: 상태 변경 알림

## 🚀 시작하기

### 환경 요구사항
- Node.js 18+
- npm 또는 yarn

### 설치 및 실행
```bash
# 의존성 설치
npm install

# 개발 서버 시작
npm start

# 빌드
npm run build
```

### 개발 환경 설정
```bash
# TypeScript 컴파일 확인
npx tsc --noEmit

# 코드 스타일 검사
npm run lint
```

## 🎨 주요 기능

### 1. 사용자 인증
- 클래스 기반 로그인/회원가입 컴포넌트
- AuthService를 통한 인증 상태 관리
- 보호된 라우트 시스템

### 2. AI 주식 추천
- RecommendationService를 통한 추천 로직
- 추천 수락/거절 기능
- 신뢰도 기반 시각화

### 3. 주식 정보
- StockService를 통한 주식 데이터 관리
- 실시간 가격 정보 (시뮬레이션)
- 상세 재무 정보 및 공시

### 4. 대시보드
- 탭 기반 네비게이션
- 반응형 카드 레이아웃
- 실시간 데이터 업데이트

## 🔐 인증 시스템

### 객체지향적 인증 처리
```typescript
// AuthService 사용 예시
const authService = AuthService.getInstance();

// 로그인
await authService.login({ email, password });

// 현재 사용자 조회
const currentUser = authService.getCurrentUser();

// 인증 상태 확인
if (authService.isAuthenticated()) {
  // 인증된 사용자 로직
}
```

## 📊 데이터 모델

### User 클래스
```typescript
class User {
  public updateLastLogin(): void
  public getDisplayName(): string
  public isRecentlyActive(): boolean
  public toJSON(): any
  public static fromJSON(json: any): User
}
```

### Stock 클래스
```typescript
class Stock {
  public updatePrice(newPrice: number): void
  public getFormattedPrice(): string
  public getFormattedMarketCap(): string
  public isHighDividendStock(): boolean
  public getLargeCapCategory(): string
}
```

### Recommendation 클래스
```typescript
class Recommendation {
  public accept(): void
  public reject(): void
  public getExpectedReturn(): number
  public isHighConfidence(): boolean
  public getTypeLabel(): string
}
```

## 🎯 데모 계정

**이메일**: test@example.com  
**비밀번호**: password

## 🔧 개발 가이드

### 새로운 모델 클래스 추가
```typescript
export class NewModel {
  // 1. 프로퍼티 정의
  public id: number;
  public name: string;

  // 2. 생성자
  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }

  // 3. 비즈니스 메서드
  public businessMethod(): void {
    // 로직 구현
  }

  // 4. 직렬화 메서드
  public toJSON(): any {
    return { id: this.id, name: this.name };
  }

  // 5. 역직렬화 메서드
  public static fromJSON(json: any): NewModel {
    return new NewModel(json.id, json.name);
  }
}
```

### 새로운 서비스 클래스 추가
```typescript
export class NewService {
  private static instance: NewService;
  
  private constructor() {
    // 초기화 로직
  }

  public static getInstance(): NewService {
    if (!NewService.instance) {
      NewService.instance = new NewService();
    }
    return NewService.instance;
  }

  public businessMethod(): any {
    // 비즈니스 로직 구현
  }
}
```

### 새로운 클래스 컴포넌트 추가
```typescript
export class NewComponent extends Component<Props, State> {
  private service: SomeService;

  constructor(props: Props) {
    super(props);
    this.state = { /* 초기 상태 */ };
    this.service = SomeService.getInstance();
    
    // 메서드 바인딩
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount(): void {
    // 초기화 로직
  }

  private handleClick(): void {
    // 이벤트 핸들러
  }

  render(): React.ReactElement {
    return <div>컴포넌트 내용</div>;
  }
}
```

## 🔄 상태 관리

### 클래스 컴포넌트에서의 상태 관리
- `this.state`를 통한 컴포넌트 상태
- `this.setState()`를 통한 상태 업데이트
- 생명주기 메서드를 활용한 사이드 이펙트 처리

### 서비스 레이어에서의 데이터 관리
- 싱글톤 패턴을 통한 전역 상태 관리
- 비즈니스 로직과 데이터의 캡슐화
- 모델 클래스를 통한 타입 안전성

## 🎨 스타일링

### CSS Modules 사용
- 컴포넌트별 스타일 캡슐화
- TypeScript와의 완벽한 통합
- 클래스 이름 충돌 방지

## 📈 향후 개선 사항

1. **상태 관리 라이브러리 통합**
   - Redux 또는 MobX를 활용한 글로벌 상태 관리

2. **테스트 코드 추가**
   - Jest를 활용한 유닛 테스트
   - 클래스 메서드별 테스트 케이스

3. **성능 최적화**
   - 클래스 컴포넌트 최적화
   - 메모이제이션 패턴 적용

4. **에러 핸들링 강화**
   - Error Boundary 구현
   - 전역 에러 처리 시스템

## 👨‍💻 개발자 정보

- **개발자**: 김지광
- **학번**: 22213056
- **소속**: 영남대학교
- **이메일**: 5244416@naver.com

## 📄 라이선스

이 프로젝트는 교육 목적으로 제작되었습니다. 