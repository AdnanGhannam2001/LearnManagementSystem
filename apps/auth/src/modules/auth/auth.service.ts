import { DatabaseService } from '@database';
import { Injectable } from '@nestjs/common';
import { Action, AuthenticateRequest, AuthenticateResponse, AuthorizeResponse, ChangePasswordRequest, ClaimsAuthorizeRequest, LoginRequest, LoginResponse, ObjectType, RegisterRequest, RegisterResponse, RoleAuthorizeRequest, VerifyEmailRequest, VerifyEmailResponse } from '@protobuf/auth';
import { UsersService } from '../users/users.service';
import { createHash } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { Permissions } from '@prisma/client';
import { readFile } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class AuthService {
  constructor(private readonly db: DatabaseService,
              private readonly usersService: UsersService,
              private readonly jwt: JwtService) { }

  async register(request: RegisterRequest): Promise<RegisterResponse> {
    const activateCode = Math.random().toString(16).slice(2);

    const result = await this.usersService.create({
      data: {
        ...request,
        password: this.hashPassword(request.password),
        activateCode,
        settings: { create: { } },
        cart: { create: { } }
      }
    });

    if (result.error) {
      return { error: result.error };
    }

    return { success: { email: result.user.email, activateCode } };
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

    const result = await this.usersService.update({
      where: { id: user.id },
      data: {
        isActivated: true,
        activateCode: null
      }
    });

    if (result.error) {
      return { error: result.error };
    }
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

  async changePassword(request: ChangePasswordRequest) {
    const user = await this.usersService.findOne({
      where: { id: request.id }
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

    const result = await this.usersService.update({
      where: { id: request.id },
      data: { password: this.hashPassword(request.newPassword) }
    });

    if (result.error) {
      return { error: result.error };
    }
  }

  async authenticate(request: AuthenticateRequest): Promise<AuthenticateResponse> {
    if (!request.token) {
      return { error: { code: 403, message: "You have to be logged in" } };
    }

    try {
      const user = await this.extractUserFromToken(request.token);

      if (!user.isActivated) {
        throw new Error(`Your accound isn't activated, please verify your email`);
      }

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

  async claimsAuthorize(request: ClaimsAuthorizeRequest): Promise<AuthorizeResponse> {
    try {
      let filename = this.getEnumKey(ObjectType, request.objectType);
      const action = this.getEnumKey(Action, request.action);
      filename += `.${action}.sql`;

      console.log(filename)
      const file = await this.getSqlFile(filename);
      const count = await this.db.$executeRawUnsafe(file, request.user.id, request.objectId);

      if (!count) {
        return { error: { code: 401, message: `You can't preform this action` } };
      }
    } catch (error) { }

    return { allowed: true };
  }

  private hashPassword(password: string) {
    return createHash("sha256").update(password).digest("hex");
  }

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

  private hasHigherPermission(permission: string, minPermission: string) {
    const permissions = [
      Permissions.NormalUser,
      Permissions.Coach,
      Permissions.Moderator,
      Permissions.Admin,
      Permissions.Root
    ] as string[];
    
    return permissions.indexOf(permission) > permissions.indexOf(minPermission);
  }

  private getEnumKey(e: any, value: number) {
    const keys = Object.keys(e).filter(key => e[key] === value);
    return keys.length > 0 ? keys[0].toLocaleLowerCase() : null;
  }

  private getSqlFile(name: string) {
    return readFile(join(__dirname, `../../../libs/database/sql/${name}`), 'utf8');
  }
}
