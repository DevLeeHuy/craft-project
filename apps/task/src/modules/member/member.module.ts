import { Module } from '@nestjs/common';
import { MemberController } from './controllers/member/member.controller';
import { MemberService } from './services/member/member.service';
import { AuthModule } from '@app/auth';

@Module({
  imports: [AuthModule],
  controllers: [MemberController],
  providers: [MemberService]
})
export class MemberModule {}
