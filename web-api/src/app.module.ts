import { Module } from '@nestjs/common';
import { FileModule } from './modules/file/file.module';
import { RootModule } from './modules/root/root.module';

@Module({
    imports: [RootModule, FileModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
