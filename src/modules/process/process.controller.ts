import crypto from 'crypto';
import { extname } from 'node:path';
import { uploadConfig } from '@/core/infrastructure/config/upload';
import ProcessChargesInputPort from '@/core/ports/in/process-charges.input-port';
import {
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { container } from 'tsyringe';
import ProcessChargesDocumentation from './decorators/process-charges.documentation';

@Controller('process')
export class ProcessController {
  @Post('charges/customer/:customerId')
  @ProcessChargesDocumentation()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: uploadConfig.tmpFolder,
        filename(request, file, callback) {
          const fileHash = crypto.randomBytes(10).toString('hex');
          const fileExtName = extname(file.originalname);
          const fileName = `${fileHash}.${fileExtName}`;

          return callback(null, fileName);
        },
      }),
    }),
  )
  @HttpCode(HttpStatus.NO_CONTENT)
  async processCharges(
    @Param('customerId') customerId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void> {
    const useCase: ProcessChargesInputPort = container.resolve(
      'ProcessChargesInputPort',
    );

    await useCase.execute({ file, customerId });
  }
}
