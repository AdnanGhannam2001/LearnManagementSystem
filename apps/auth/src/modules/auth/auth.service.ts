import { DatabaseService } from '@database';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthenticateRequest, ClaimsAuthorizeRequest, LoginRequest, RegisterRequest, RoleAuthorizeRequest, VerifyEmailRequest } from '@protobuf/auth';
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

  async login(request: LoginRequest) {
    const user = await this.usersService.findOneOrThrow({
      where: { email: request.email }
    });

    if (!this.compare(request.password, user.password)) {
      throw new BadRequestException('Password is wrong');
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
