import { DatabaseService } from '@database';
import { Injectable } from '@nestjs/common';
import { AuthenticateRequest, AuthenticateResponse, ClaimsAuthorizeRequest, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, RoleAuthorizeRequest, VerifyEmailRequest, VerifyEmailResponse } from '@protobuf/auth';
import { UsersService } from '../users/users.service';
import { createHash } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { Permissions } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private readonly db: DatabaseService,
              private readonly usersService: UsersService,
              private readonly jwt: JwtService) { }

  async register(request: RegisterRequest): Promise<RegisterResponse> {
    const activateCode = Math.random().toString(16).slice(2);

    try {
      const user = await this.usersService.create({
        data: {
          ...request,
          activateCode,
          settings: { create: { } },
          cart: { create: { } }
        }
      });

      return { success: { email: user.email, activateCode } };
    } catch (error) {
      return { error: { code: 400, message: error.message } };
    }
  }

  async verifyEmail(request: VerifyEmailRequest): Promise<VerifyEmailResponse> {
    const user = await this.usersService.findOne({ where: { email: request.email } });

    if (!user) {
      return { error: { code: 404, message: "User not found" } };
    }

    if (user.isActivated) {
      return { error: { code: 400, message: "Account already activated" } };
    }

    if (request.code != user.activateCode) {
      return { error: { code: 400, message: "Code is wrong" } };
    }

    await this.usersService.update({ where: { id: user.id }, data: { isActivated: true } });
  }

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

  // TODO: Improve this and roleAuthorize
  async authenticate(request: AuthenticateRequest): Promise<AuthenticateResponse> {
    if (!request.token) {
      return { error: { code: 403, message: "You have to be logged in" } };
    }

    try {
      const user = await this.extractUserFromToken(request.token);

      return { user };
    } catch (error) {
      return { error: { code: 403, message: error.message } };
    }
  }

  async roleAuthorize(request: RoleAuthorizeRequest) {
    if (!this.hasPermission(request.user.permission, request.requiredPermissions)) {
      return { error: { code: 401, message: "You don't have the previlege to preform this action" } };
    }

    return { allowed: true };
  }

  claimsAuthorize(request: ClaimsAuthorizeRequest) { return { allowed: true }; }

  private compare(plainText: string, hashed: string) {
    return createHash("sha256").update(plainText).digest("hex") == hashed;
  }

  private generateToken(payload: Object) {
    return this.jwt.signAsync(payload);
  }

  private async extractUserFromToken(token: string) {
    const payload = await this.jwt.verifyAsync(token);

    if (!payload.id) {
      throw new Error("Invalid token");
    }

    const user = await this.usersService.findOne({ where: { id: payload.id } })

    if (!user) {
      throw new Error("The user is maybe deleted");
    }

    return user;
  }

  private hasPermission(permission: string, requiredPermissions: string[]) {
    return requiredPermissions.includes(permission);
  }
}
