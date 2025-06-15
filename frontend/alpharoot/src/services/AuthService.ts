import { User } from '../models/User';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;
  private readonly STORAGE_KEY = 'alpharoot_user';

  private constructor() {
    this.loadUserFromStorage();
  }

  // 싱글톤 패턴 구현
  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // 로그인 메서드
  public async login(credentials: LoginCredentials): Promise<User> {
    // 실제 구현에서는 API 호출
    // 현재는 목 데이터 사용
    if (credentials.email === 'test@example.com' && credentials.password === 'password') {
      const user = new User(
        1,
        credentials.email,
        '테스트 사용자',
        true,
        new Date(),
        new Date()
      );
      
      this.setCurrentUser(user);
      return user;
    }
    
    throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
  }

  // 회원가입 메서드
  public async register(userData: RegisterData): Promise<User> {
    // 실제 구현에서는 API 호출
    // 현재는 목 데이터 사용
    
    // 간단한 유효성 검사
    this.validateRegistrationData(userData);
    
    const user = new User(
      Date.now(), // 임시 ID
      userData.email,
      userData.name,
      true,
      new Date()
    );
    
    // 실제로는 서버에서 사용자 생성 후 로그인 처리
    return user;
  }

  // 로그아웃 메서드
  public logout(): void {
    this.currentUser = null;
    this.removeUserFromStorage();
  }

  // 현재 사용자 반환
  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  // 로그인 상태 확인
  public isAuthenticated(): boolean {
    return this.currentUser !== null && this.currentUser.isActive;
  }

  // 사용자 설정
  private setCurrentUser(user: User): void {
    this.currentUser = user;
    this.saveUserToStorage();
  }

  // 로컬 스토리지에 사용자 정보 저장
  private saveUserToStorage(): void {
    if (this.currentUser) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.currentUser.toJSON()));
    }
  }

  // 로컬 스토리지에서 사용자 정보 로드
  private loadUserFromStorage(): void {
    try {
      const userData = localStorage.getItem(this.STORAGE_KEY);
      if (userData) {
        const userJson = JSON.parse(userData);
        this.currentUser = User.fromJSON(userJson);
      }
    } catch (error) {
      console.error('사용자 정보 로드 실패:', error);
      this.removeUserFromStorage();
    }
  }

  // 로컬 스토리지에서 사용자 정보 제거
  private removeUserFromStorage(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // 회원가입 데이터 유효성 검사
  private validateRegistrationData(userData: RegisterData): void {
    if (!userData.name || userData.name.trim().length < 2) {
      throw new Error('이름은 2자 이상이어야 합니다.');
    }

    if (!userData.email || !this.isValidEmail(userData.email)) {
      throw new Error('올바른 이메일 주소를 입력해주세요.');
    }

    if (!userData.password || userData.password.length < 6) {
      throw new Error('비밀번호는 6자 이상이어야 합니다.');
    }
  }

  // 이메일 유효성 검사
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // 비밀번호 재설정 (향후 구현)
  public async resetPassword(email: string): Promise<void> {
    // 실제 구현에서는 API 호출
    console.log('비밀번호 재설정 요청:', email);
    throw new Error('아직 구현되지 않은 기능입니다.');
  }

  // 사용자 정보 업데이트
  public async updateUser(userData: Partial<RegisterData>): Promise<User> {
    if (!this.currentUser) {
      throw new Error('로그인이 필요합니다.');
    }

    // 실제 구현에서는 API 호출
    if (userData.name) {
      this.currentUser.name = userData.name;
    }
    
    this.saveUserToStorage();
    return this.currentUser;
  }
} 