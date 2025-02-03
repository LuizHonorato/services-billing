import fs from 'node:fs';
import path from 'node:path';
import ProcessChargesUseCase from '@/core/application/use-cases/process-charges.use-case';
import ProcessChargesDto from '@/core/application/dtos/process-charges.dto';
import MockMailNotification from '@/core/tests/mocks/mail-notification.mock';
import MockCacheClient from '@/core/tests/mocks/cache-client.mock';

describe('ProcessChargesUseCase', () => {
  let useCase: ProcessChargesUseCase;
  let mockCacheClient: MockCacheClient;
  let mockMailNotification: MockMailNotification;

  beforeEach(() => {
    mockMailNotification = new MockMailNotification();
    mockCacheClient = new MockCacheClient();
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
    jest
      .spyOn(mockMailNotification, 'sendMail')
      .mockResolvedValueOnce(undefined);

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
