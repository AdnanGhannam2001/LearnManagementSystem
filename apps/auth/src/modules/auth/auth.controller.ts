import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthServiceController, AuthServiceControllerMethods, AuthenticateRequest, ClaimsAuthorizeRequest, LoginRequest, RegisterRequest, RoleAuthorizeRequest, VerifyEmailRequest } from '@protobuf/auth';

@Controller()
@AuthServiceControllerMethods()
export class AuthController implements AuthServiceController {
  constructor(private readonly authService: AuthService) {}

  register(request: RegisterRequest) {
    return this.authService.register(request);
  }

  verifyEmail(request: VerifyEmailRequest) {
    return this.authService.verifyEmail(request);
  }

  login(request: LoginRequest) {
    return this.authService.login(request);
  }

  authenticate(request: AuthenticateRequest) {
    return this.authService.authenticate(request);
  }

  roleAuthorize(request: RoleAuthorizeRequest) {
    return this.authService.roleAuthorize(request);
  }

  claimsAuthorize(request: ClaimsAuthorizeRequest) {
    return this.authService.claimsAuthorize(request);
  }
}
