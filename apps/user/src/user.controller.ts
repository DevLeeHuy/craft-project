import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dtos/user.dto';
import { AuthGuard } from '@app/auth/guards/auth/auth.guard';
import { AuthInterceptor } from '@app/auth/interceptors/auth/auth.interceptor';
import { Credential } from '@app/auth/interfaces/credential.interface';

@Controller({ path: 'users' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('sign-in')
  signIn(@Body() userInfo: UserDto): Promise<Credential> {
    return this.userService.signIn(userInfo);
  }

  @Post('refresh-token')
  refreshToken(@Body() body: Pick<Credential, 'refreshToken'>) {
    return this.userService.refreshToken(body.refreshToken);
  }

  @Post()
  genUser(): Promise<void> {
    return this.userService.genUser();
  }

  @Get('/me')
  @UseGuards(AuthGuard)
  @UseInterceptors(AuthInterceptor)
  getCurrentUser(): Promise<UserDto> {
    return this.userService.getCurrentUser();
  }

  @Post('/logout')
  logout(@Body() body: Credential): Promise<void> {
    return this.userService.logout(body);
  }
}
