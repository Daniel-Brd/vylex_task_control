import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users.module';
import { TasksModule } from './modules/tasks.module';
import { AuthModule } from './modules/auth.module';

@Module({
  imports: [UsersModule, TasksModule, AuthModule],
})
export class AppModule {}
