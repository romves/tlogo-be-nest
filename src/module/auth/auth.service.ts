import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginPayload } from './dto/auth.dto';
import { PrismaService } from '../common/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signIn({ username, password }: LoginPayload) {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    console.log(user); 

    if (user && (await bcrypt.compareSync(password, user.password))) {
      return {
        message: 'success',
        data: {
          user: {
            id: user.id,
            username: user.username,
          },
          accessToken: this.jwtService.sign({ username }),
        },
      };
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
