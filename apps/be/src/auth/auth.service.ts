import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Session, SessionData } from 'express-session';
import { PrismaService } from '../prisma/prisma.service';
import {
  RegisterDto,
  LoginDto,
  AuthResponse,
  JwtPayload,
  RefreshTokenDto,
} from '@repo/api';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private async createSession(
    session: Session,
    userId: number,
    rememberMe: boolean = false,
  ): Promise<void> {
    session.userId = String(userId);
    session.rememberMe = rememberMe;

    // rememberMe가 true면 쿠키 유효기간을 7일로 설정
    if (rememberMe) {
      session.cookie.maxAge = 7 * 24 * 60 * 60 * 1000; // 7일
    } else {
      session.cookie.maxAge = undefined; // 세션 쿠키 (브라우저 닫으면 삭제)
    }
  }

  async register(
    registerDto: RegisterDto,
    session: Session & Partial<SessionData>,
  ): Promise<AuthResponse> {
    const { email, password, name, rememberMe } = registerDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    // 세션 생성
    await this.createSession(session, user.id, rememberMe);

    // JWT 토큰도 생성 (세션에 저장)
    const tokens = await this.generateTokens(user.id, user.email);
    session.accessToken = tokens.accessToken;
    session.refreshToken = tokens.refreshToken;

    const { password: _, refreshToken: __, ...userWithoutSensitive } = user;

    return new AuthResponse(
      tokens.accessToken,
      tokens.refreshToken,
      userWithoutSensitive,
    );
  }

  async login(
    loginDto: LoginDto,
    session: Session & Partial<SessionData>,
  ): Promise<AuthResponse> {
    const { email, password, rememberMe } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 세션 생성
    await this.createSession(session, user.id, rememberMe);

    // JWT 토큰도 생성 (세션에 저장)
    const tokens = await this.generateTokens(user.id, user.email);
    session.accessToken = tokens.accessToken;
    session.refreshToken = tokens.refreshToken;

    const { password: _, refreshToken: __, ...userWithoutSensitive } = user;

    return new AuthResponse(
      tokens.accessToken,
      tokens.refreshToken,
      userWithoutSensitive,
    );
  }

  async refreshTokens(
    refreshTokenDto: RefreshTokenDto,
    session: Session & Partial<SessionData>,
  ): Promise<AuthResponse> {
    const { refreshToken } = refreshTokenDto;

    try {
      const payload = this.jwtService.verify<JwtPayload>(refreshToken);

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // 새로운 토큰 생성
      const tokens = await this.generateTokens(user.id, user.email);

      // 세션 갱신
      session.accessToken = tokens.accessToken;
      session.refreshToken = tokens.refreshToken;

      const { password: _, refreshToken: __, ...userWithoutSensitive } = user;

      return new AuthResponse(
        tokens.accessToken,
        tokens.refreshToken,
        userWithoutSensitive,
      );
    } catch (_error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(session: Session & Partial<SessionData>): Promise<void> {
    return new Promise((resolve, reject) => {
      session.destroy((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async getCurrentUser(session: Session & Partial<SessionData>): Promise<any> {
    if (!session.userId) {
      throw new UnauthorizedException('No active session');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: Number(session.userId) },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { password: _, refreshToken: __, ...userWithoutSensitive } = user;
    return userWithoutSensitive;
  }

  private async generateTokens(
    userId: number,
    email: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: JwtPayload = { sub: userId, email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: '15m' }),
      this.jwtService.signAsync(payload, { expiresIn: '7d' }),
    ]);

    return { accessToken, refreshToken };
  }
}
