import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UserDto } from './dtos/user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from '@app/auth';
import { Credential } from '@app/auth/interfaces/credential.interface';
import { compare, hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
    private authService: AuthService,
  ) {}

  async signIn(userInfo: Partial<UserDto>): Promise<Credential> {
    const user = await this.repository.findOne({
      where: { username: userInfo.username },
    });

    if (!user || !(await compare(userInfo.password, user.password))) {
      throw new ForbiddenException('Incorrect username or password');
    }

    const payload = { sub: user.id, username: user.username };
    return this.authService.generateJwtToken(payload);
  }

  async refreshToken(token: string) {
    return this.authService.executeRefreshToken(token);
  }

  async genUser(): Promise<void> {
    const testUser: Omit<User, 'id'> = {
      username: 'joey',
      password: '123',
    };

    testUser.password = await hash(testUser.password, 10);
    await this.repository.save(testUser).catch((err) => {
      if (err.code === 23505) {
        throw new BadRequestException('User has already existed');
      }
    });
  }

  async getCurrentUser(): Promise<UserDto> {
    const currentUserId: string = this.authService.userIdentity.id;

    return this.repository.findOneByOrFail({
      id: currentUserId,
    });
  }

  async logout(credential: Credential): Promise<void> {
    await Promise.all(
      Object.values(credential).map((token) =>
        this.authService.revokeToken(token),
      ),
    );
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), ms);
    });
  }
}
