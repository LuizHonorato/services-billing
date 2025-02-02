import fs from 'node:fs';
import path from 'node:path';
import CacheClientOutputPort from '@/core/ports/out/cache-client.output-port';
import MailNotificationOutputPort from '@/core/ports/out/mail-notification.output-port';
// import ProcessChargeException from '@/core/shared/exceptions/process-charge.exception';
import ProcessChargesUseCase from '@/core/application/use-cases/process-charges.use-case';
import ProcessChargesDto from '@/core/application/dtos/process-charges.dto';

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
        originalname: 'mock.csv',
        encoding: '7bit',
        mimetype: 'text/csv',
        buffer: null,
        size: 517,
        destination: path.resolve(
          __dirname,
          '..',
          '..',
          '..',
          'mocks',
          'mock.csv',
        ),
        filename: 'mock.csv',
        path: path.resolve(__dirname, '..', '..', '..', 'mocks', 'mock.csv'),
        stream: fs.createReadStream(
          path.resolve(__dirname, '..', '..', '..', 'mocks', 'mock.csv'),
        ),
      } as Express.Multer.File,
      customerId,
    };

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
        originalname: 'failed-mock.csv',
        encoding: '7bit',
        mimetype: 'text/csv',
        buffer: null,
        size: 517,
        destination: path.resolve(
          __dirname,
          '..',
          '..',
          '..',
          'mocks',
          'failed-mock.csv',
        ),
        filename: 'failed-mock.csv',
        path: path.resolve(
          __dirname,
          '..',
          '..',
          '..',
          'mocks',
          'failed-mock.csv',
        ),
        stream: fs.createReadStream(
          path.resolve(__dirname, '..', '..', '..', 'mocks', 'failed-mock.csv'),
        ),
      } as Express.Multer.File,
      customerId,
    };

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
