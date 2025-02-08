/* eslint-disable @typescript-eslint/no-misused-promises */
import { Controller, Post, UploadedFile, UseInterceptors, Res, Get, Param, NotFoundException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { existsSync } from 'fs';
import { unlink } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import * as ffmpeg from 'fluent-ffmpeg';

@Controller('/api/files')
export class FileController {
    @Post()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                fileUpload: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @UseInterceptors(
        FileInterceptor('fileUpload', {
            storage: diskStorage({
                destination: './uploads',
                filename: (_, file, cb) => {
                    const uniqueId = uuidv4();
                    const filename = uniqueId + file.originalname.toLowerCase();
                    cb(null, filename);
                },
            }),
            fileFilter: (_, file, cb) => {
                if (file.mimetype === 'video/quicktime') {
                    cb(null, true);
                } else {
                    cb(new Error('Only .mov files are allowed!'), false);
                }
            },
        }),
    )
    async uploadAsync(@UploadedFile() file: Express.Multer.File) {
        const inputFile = file.path.toLowerCase();
        const outputFilePath = inputFile.replace('.mov', '.mp4');
        const fileKey = outputFilePath.split('/').pop();

        await new Promise<any>((resolve, reject) => {
            ffmpeg(inputFile)
                .videoCodec('libx264')
                .audioCodec('aac')
                .outputFormat('mp4')
                .save(outputFilePath)
                .on('end', async () => {
                    console.log('Conversion finished:', fileKey);
                    await unlink(inputFile);
                    resolve(fileKey);
                })
                .on('error', (error: Error) => {
                    console.error('Error converting file:', error);
                    reject(error);
                })
                .on('stderr', (stderrLine) => {
                    console.error('FFmpeg stderr:', stderrLine);
                });
        });

        return fileKey;
    }

    @Get('/:filename')
    downloadAsync(@Param('filename') filename: string, @Res() res: Response) {
        if (!filename) {
            throw new NotFoundException('No file was received');
        }

        const filePath = `./uploads/${filename}`;

        if (!existsSync(filePath)) {
            throw new NotFoundException('File not found');
        }

        res.sendFile(filePath, { root: './' }, (err) => {
            if (err) {
                res.status(500).send('Error while sending file');
            }
            void unlink(filePath);
        });
    }
}
