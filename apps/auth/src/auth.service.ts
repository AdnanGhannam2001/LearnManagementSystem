import { DatabaseService } from '@database';
import { Injectable } from '@nestjs/common';
import { AuthenticateRequest, ClaimsAuthorizeRequest, LoginRequest, RegisterRequest, RoleAuthorizeRequest, VerifyEmailRequest } from '@protobuf/auth';

@Injectable()
export class AuthService {
  constructor(private readonly db: DatabaseService) { }

  register(request: RegisterRequest) { }

  verifyEmail(request: VerifyEmailRequest) { }

  login(request: LoginRequest) { }

  authenticate(request: AuthenticateRequest) { }

  roleAuthorize(request: RoleAuthorizeRequest) { }

  claimsAuthorize(request: ClaimsAuthorizeRequest) { }
}
