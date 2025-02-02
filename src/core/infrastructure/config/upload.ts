import * as path from 'node:path';

const tmpFolderName = 'tmp';

const uploadsFolderName = 'uploads';

const tmpFolder = path.resolve(
  __dirname,
  '..',
  '..',
  '..',
  '..',
  tmpFolderName,
);

interface IUploadConfig {
  tmpFolderName: string;
  uploadsFolderName: string;
  tmpFolder: string;
  uploadFolder: string;
}

export const uploadConfig = {
  tmpFolderName,
  tmpFolder,
  uploadsFolderName,
  uploadFolder: path.resolve(tmpFolder, uploadsFolderName),
} as IUploadConfig;
