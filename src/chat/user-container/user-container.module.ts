import { Module } from '@nestjs/common';
import { UserContainerService } from './user-container.service';

@Module({
  exports: [UserContainerService],
  providers: [UserContainerService],
})
export class UserContainerModule {}
