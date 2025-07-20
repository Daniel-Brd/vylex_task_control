import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users.module';
import { TasksModule } from './modules/tasks.module';
import { AuthModule } from './modules/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    UsersModule,
    TasksModule,
    AuthModule,
  ],
})
export class AppModule {}
