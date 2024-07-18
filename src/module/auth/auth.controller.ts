import { Body, Controller, Post } from '@nestjs/common';
import { LoginPayload, loginPayloadSchema } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from '../common/validation/zod-validation.pipe';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('login')
    login(@Body(new ZodValidationPipe(loginPayloadSchema)) authPayload: LoginPayload) {
        return this.authService.signIn(authPayload);
    }
}
