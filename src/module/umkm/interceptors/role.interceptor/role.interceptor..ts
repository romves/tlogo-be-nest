import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ExtractJwt } from 'passport-jwt';
import { Observable, map } from 'rxjs';

@Injectable()
export class OmitDataByRoleInterceptor implements NestInterceptor {
  jwtService: JwtService;
  constructor() {
    this.jwtService = new JwtService();
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);
    const role = this.extractRoleFromToken(token);

    return next.handle().pipe(
      map((response) => {
        if (role != 'ADMIN') {
          const omitted = this.omitKelengkapanSurat(response.data);

          return { ...response, data: omitted };
        }
        return response.data;
      }),
    );
  }

  private extractToken(request: any): string | null {
    try {
      const extractor = ExtractJwt.fromAuthHeaderAsBearerToken();
      return extractor(request);
    } catch (error) {
      return null;
    }
  }

  private extractRoleFromToken(token: string | null): string {
    if (!token) return '';

    const decoded = this.jwtService.decode(token) as { role?: string };
    return decoded?.role ?? '';
  }

  private omitKelengkapanSurat(data: any): any {
    if (!Array.isArray(data)) {
      return data;
    }

    return data.map((item) => {
      delete item.kelengkapan_surat;

      return item;
    });
  }
}
