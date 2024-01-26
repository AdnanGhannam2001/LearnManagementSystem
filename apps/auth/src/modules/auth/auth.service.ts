import { DatabaseService } from '@database';
import { Injectable } from '@nestjs/common';
import { Action, AuthenticateRequest, AuthenticateResponse, AuthorizeResponse, ChangePasswordRequest, ClaimsAuthorizeRequest, LoginRequest, LoginResponse, ObjectType, RegisterRequest, RegisterResponse, RoleAuthorizeRequest, VerifyEmailRequest, VerifyEmailResponse } from '@protobuf/auth';
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

  claimsAuthorize(request: ClaimsAuthorizeRequest): AuthorizeResponse {
    const response = { error: undefined, allowed: undefined };

    switch (request.objectType) {
      case ObjectType.USER:
        response.allowed = this.ObjectUser(request);
        break;
      case ObjectType.NOTIFICATION:
        break;
      case ObjectType.SETTINGS:
        response.allowed = this.ObjectSettings(request);
        break;
      case ObjectType.APPLY_REQUEST:
        break;
      case ObjectType.COURSE:
        break;
      case ObjectType.UNIT:
        break;
      case ObjectType.LESSON:
        break;
      case ObjectType.FOLDER:
        break;
      case ObjectType.FILE:
        break;
      case ObjectType.QUIZ_QUESTION:
        break;
      case ObjectType.CHOISE:
        break;
      case ObjectType.COMMENT:
        break;
      case ObjectType.VOTE:
        break;
      case ObjectType.CHAT:
        break;
      case ObjectType.MESSAGE:
        break;
      case ObjectType.RESOURCE:
        break;
      case ObjectType.CART:
        break;
      case ObjectType.ROLLED:
        break;
      case ObjectType.PAYMENT:
        break;
      case ObjectType.MEMBER:
        break;
      case ObjectType.DONE:
        break;
      case ObjectType.RATE:
        break;
      case ObjectType.QUESTION:
        break;
      case ObjectType.ANNOUNCEMENT:
        break;
      case ObjectType.UNRECOGNIZED:
        break;
    }

    if (!response.allowed) {
      response.error = { code: 401, message: `You can't preform this action` };
    }

    return response;
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

  // Claims Authorization
  private async ObjectUser(options: ClaimsAuthorizeRequest): Promise<boolean> {
    switch (options.action) {
      case Action.READ:
        return true;
      case Action.UPDATE:
      case Action.DELETE:
        const obj = await this.db.user.findUnique({ where: { id: options.objectId }});
        return obj && 
          (options.user.id == options.objectId
          || this.hasHigherPermission(options.user.permission, obj.permission));
    }

    return false;
  }

  private ObjectSettings(options: ClaimsAuthorizeRequest): boolean {
    switch (options.action) {
      case Action.READ:
        return options.user.id == options.objectId;
      case Action.UPDATE:
        return options.user.id == options.objectId;
    }

    return false;
  }
}
