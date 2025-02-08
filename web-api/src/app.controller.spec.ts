import { Test, TestingModule } from '@nestjs/testing';
import { FileController } from './modules/file/file.controller';

describe('AppController', () => {
    let fileController: FileController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [fileController],
            providers: [],
        }).compile();

        fileController = app.get<FileController>(fileController);
    });

    // describe('root', () => {
    //     it('should return "Hello World!"', () => {
    //         expect(uploadController.postAsync()).toBe('Hello World!');
    //     });
    // });
});
