import fs from 'node:fs';
import CacheClientOutputPort from '@/core/ports/out/cache-client.output-port';
import MailNotificationOutputPort from '@/core/ports/out/mail-notification.output-port';
import ProcessChargesUseCase from '@/core/application/use-cases/process-charges.use-case';
import ProcessChargesDto from '@/core/application/dtos/process-charges.dto';
import { writeFailedMockCsv, writeMockCsv } from '@/core/tests/mocks/file.mock';
import { Readable } from 'node:stream';

describe('ProcessChargesUseCase', () => {
  let useCase: ProcessChargesUseCase;
  let mockCacheClient: jest.Mocked<CacheClientOutputPort>;
  let mockMailNotification: jest.Mocked<MailNotificationOutputPort>;

  beforeEach(() => {
    mockCacheClient = {
      get: jest.fn(),
      set: jest.fn(),
      delete: jest.fn(),
    };
    mockMailNotification = {
      sendMail: jest.fn(),
    };

    useCase = new ProcessChargesUseCase(mockCacheClient, mockMailNotification);
  });

  it('should process the charges and send email notifications successfully', async () => {
    // 🔧 ARRANGE
    const customerId = 'customer123';
    const dto: ProcessChargesDto = {
      file: {
        fieldname: 'file',
      } as Express.Multer.File,
      customerId,
    };

    const { headers, records } = writeMockCsv();

    const mockReadableStream = Readable.from(`${headers}\n${records}`);

    jest
      .spyOn(fs, 'createReadStream')
      .mockReturnValue(mockReadableStream as unknown as fs.ReadStream);

    jest.spyOn(mockCacheClient, 'get').mockResolvedValueOnce('0');
    jest.spyOn(mockMailNotification, 'sendMail').mockResolvedValueOnce();

    jest.spyOn(fs, 'unlinkSync').mockImplementation();

    // 🚀 ACT
    await useCase.execute(dto);

    // 👀 ASSERT
    expect(mockCacheClient.get).toHaveBeenCalledWith(customerId);
    expect(mockCacheClient.set).toHaveBeenCalledWith(
      customerId,
      expect.any(String),
    );
    expect(mockMailNotification.sendMail).toHaveBeenCalled();
  });

  it('should throw a ProcessChargeException if a charge is invalid', async () => {
    // 🔧 ARRANGE
    const customerId = 'customer123';

    const dto: ProcessChargesDto = {
      file: {
        fieldname: 'file',
      } as Express.Multer.File,
      customerId,
    };

    const { headers, records } = writeFailedMockCsv();

    const mockReadableStream = Readable.from(`${headers}\n${records}`);

    jest
      .spyOn(fs, 'createReadStream')
      .mockReturnValue(mockReadableStream as unknown as fs.ReadStream);

    mockCacheClient.get.mockResolvedValue('0');

    jest.spyOn(fs, 'unlinkSync').mockImplementation();

    // 🚀 ACT
    await useCase.execute(dto);

    // 👀 ASSERT
    expect(mockCacheClient.get).toHaveBeenCalledWith(customerId);
    expect(mockCacheClient.set).toHaveBeenCalledWith(
      customerId,
      expect.any(String),
    );
    expect(mockMailNotification.sendMail).not.toHaveBeenCalled();
  });
});
