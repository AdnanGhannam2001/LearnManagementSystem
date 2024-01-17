import { DatabaseService } from '@database';
import { Injectable } from '@nestjs/common';
import { AuthenticateRequest, ClaimsAuthorizeRequest, LoginRequest, LoginResponse, RegisterRequest, RoleAuthorizeRequest, VerifyEmailRequest } from '@protobuf/auth';
import { UsersService } from '../users/users.service';
import { createHash } from 'crypto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly db: DatabaseService,
              private readonly usersService: UsersService,
              private readonly jwt: JwtService) { }

  register(request: RegisterRequest) { return { email: "works" }; }

  verifyEmail(request: VerifyEmailRequest) { return {}; }

  async login(request: LoginRequest): Promise<LoginResponse> {
    const user = await this.usersService.findOne({
      where: { email: request.email }
    });

    if (!user) {
      return {
        error: {
          code: 404,
          message: "User is not found",
        }
      }
    }

    if (!this.compare(request.password, user.password)) {
      return {
        error: {
          code: 400,
          message: "Password is wrong",
        }
      }
    }

    const token = await this.generateToken({ id: user.id });

    return { token };
  }

  authenticate(request: AuthenticateRequest) { return { allowed: true }; }

  roleAuthorize(request: RoleAuthorizeRequest) { return { allowed: true }; }

  claimsAuthorize(request: ClaimsAuthorizeRequest) { return { allowed: true }; }

  private compare(plainText: string, hashed: string) {
    return createHash("sha256").update(plainText).digest("hex") == hashed;
  }

  private generateToken(payload: Object) {
    return this.jwt.signAsync(payload);
  }
}
