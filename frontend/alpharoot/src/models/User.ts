export class User {
  public id: number;
  public email: string;
  public name: string;
  public isActive: boolean;
  public createdAt: Date;
  public lastLogin?: Date;

  constructor(
    id: number,
    email: string,
    name: string,
    isActive: boolean = true,
    createdAt: Date = new Date(),
    lastLogin?: Date
  ) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.lastLogin = lastLogin;
  }

  // 메서드들
  public updateLastLogin(): void {
    this.lastLogin = new Date();
  }

  public deactivate(): void {
    this.isActive = false;
  }

  public activate(): void {
    this.isActive = true;
  }

  public getDisplayName(): string {
    return this.name || this.email.split('@')[0];
  }

  public isRecentlyActive(): boolean {
    if (!this.lastLogin) return false;
    const daysSinceLogin = (Date.now() - this.lastLogin.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceLogin <= 7;
  }

  // JSON 직렬화를 위한 메서드
  public toJSON(): any {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      isActive: this.isActive,
      createdAt: this.createdAt.toISOString(),
      lastLogin: this.lastLogin?.toISOString()
    };
  }

  // JSON에서 객체 생성을 위한 정적 메서드
  public static fromJSON(json: any): User {
    return new User(
      json.id,
      json.email,
      json.name,
      json.isActive,
      new Date(json.createdAt),
      json.lastLogin ? new Date(json.lastLogin) : undefined
    );
  }
} 