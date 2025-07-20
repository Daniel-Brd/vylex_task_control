import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users.module';
import { TasksModule } from './modules/tasks.module';

@Module({
  imports: [UsersModule, TasksModule],
})
export class AppModule {}
