import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { ProcessModule } from '@/modules/process/process.module';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { container } from 'tsyringe';

describe('ProcessController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ProcessModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/process/charges/customer/{id} (POST)', () => {
    const formData = new FormData();

    container.register('ProcessChargesInputPort', {
      useValue: {
        execute: jest.fn().mockResolvedValueOnce(undefined),
      },
    });

    formData.append(
      'file',
      path.resolve(
        __dirname,
        '..',
        'src',
        'core',
        'tests',
        'mocks',
        'mock.csv',
      ),
    );

    return request(app.getHttpServer())
      .post(`/process/charges/customer/${uuidv4()}`)
      .send(formData)
      .expect(204);
  });
});
