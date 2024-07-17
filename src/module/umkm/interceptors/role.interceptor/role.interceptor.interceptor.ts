import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class RoleInterceptorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return next.handle().pipe(
      map((data) => {
        if (user.role !== 'admin') {
          if (Array.isArray(data)) {
            return data.map((item) => this.omitKelengkapanSurat(item));
          } else {
            return this.omitKelengkapanSurat(data);
          }
        }
        return data;
      }),
    );
  }

  private omitKelengkapanSurat(data: any) {
    const { kelengkapanSurat, ...rest } = data;
    return rest;
  }
}
