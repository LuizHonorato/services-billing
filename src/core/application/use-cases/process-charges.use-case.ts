import ProcessChargesDto from '../dtos/process-charges.dto';
import fs from 'node:fs';
import csv from 'csv-parser';
import { Transform, Writable } from 'node:stream';
import Charge from '@/core/domain/entities/charge.entity';
import ProcessChargesInputPort from '@/core/ports/in/process-charges.input-port';
import { inject, injectable } from 'tsyringe';
import CacheClientOutputPort from '@/core/ports/out/cache-client.output-port';
import MailNotificationOutputPort from '@/core/ports/out/mail-notification.output-port';
import ProcessChargeException from '@/core/shared/exceptions/process-charge.exception';
import ChargeInputData from '../dtos/charge-input-data.dto';
import ChargeValidation from '@/core/domain/validations/charge.validation';

@injectable()
export default class ProcessChargesUseCase implements ProcessChargesInputPort {
  private readonly BATCH_SIZE = 1000;

  constructor(
    @inject('CacheClientOutputPort')
    private readonly cacheClientOutputPort: CacheClientOutputPort,
    @inject('MailNotificationOutputPort')
    private readonly mailNotificationOutputPort: MailNotificationOutputPort,
  ) {}

  async execute(input: ProcessChargesDto): Promise<void> {
    const { file, customerId } = input;

    const readableStream = fs.createReadStream(file.path, {
      highWaterMark: 64 * 1024,
    });
    const transformToObject = csv({ separator: ',' });
    const transformToString = new Transform({
      objectMode: true,
      transform(chunk, encoding, callback) {
        callback(null, JSON.stringify(chunk));
      },
    });

    const lastProcessedLine = await this.loadCheckpoint(customerId);
    let currentLine = 0;
    let batch: ChargeInputData[] = [];

    const writableStremFile = new Writable({
      write: async (chunk, encoding, callback) => {
        currentLine++;

        if (currentLine <= lastProcessedLine) {
          return callback();
        }

        const stringifyer = chunk.toString();
        const rowData = JSON.parse(stringifyer) as ChargeInputData;

        const chargeValidation = new ChargeValidation();

        const { errors } = chargeValidation.validate(rowData);

        if (errors.length > 0) {
          await this.saveCheckpoint(customerId, currentLine);
          return callback(
            new ProcessChargeException(
              `Error processing charge on line ${currentLine}: ${errors.join(', ')}`,
              400,
            ),
          );
        }

        batch.push(rowData);

        if (batch.length >= this.BATCH_SIZE) {
          try {
            await this.processBatch(batch, customerId, currentLine);
            batch = [];
          } catch (error) {
            callback(error);
          }
        }

        callback();
      },
    });

    const startHour = Date();

    return new Promise((resolve, reject) => {
      readableStream
        .pipe(transformToObject)
        .pipe(transformToString)
        .pipe(writableStremFile)
        .on('close', async () => {
          if (batch.length > 0) {
            try {
              await this.processBatch(batch, customerId, currentLine);
            } catch (error) {
              reject(error);
              return;
            }
          }

          console.log('Iniciou', startHour);
          console.log('Acabou', Date());
          fs.unlinkSync(file.path);
          await this.cacheClientOutputPort.delete(customerId);
          resolve();
        })
        .on('error', async error => {
          await this.saveCheckpoint(customerId, currentLine);
          reject(error);
        });
    });
  }

  private async processBatch(
    batch: ChargeInputData[],
    customerId: string,
    currentLine: number,
  ): Promise<void> {
    try {
      for (const rowData of batch) {
        const { name, governmentId, email, debtAmount, debtDueDate, debtId } =
          rowData;

        const charge = new Charge({
          name,
          email,
          government_id: Number(governmentId),
          debt_due_date: new Date(debtDueDate),
          debt_amount: Number(debtAmount),
          debt_id: debtId,
        });

        const document = charge.generateDocument();

        await this.mailNotificationOutputPort.sendMail({
          to: {
            name: charge.name,
            email: charge.email,
          },
          from: {
            name: 'Equipe de cobrança',
            email: 'contato@services-billing.com',
          },
          subject: 'Seu boleto chegou!',
          attachments: [
            {
              filename: document,
            },
          ],
        });
      }

      await this.saveCheckpoint(customerId, currentLine);
    } catch (error) {
      await this.saveCheckpoint(customerId, currentLine);
      throw new ProcessChargeException(
        error.message || 'Internal Server Error',
        error.statusCode || 500,
      );
    }
  }

  private async loadCheckpoint(customerId: string): Promise<number> {
    return Number(this.cacheClientOutputPort.get(customerId)) || 0;
  }

  private async saveCheckpoint(customerId: string, currentLine: number) {
    await this.cacheClientOutputPort.set(customerId, String(currentLine));
  }
}
