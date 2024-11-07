import { Injectable } from '@nestjs/common';
import fs from 'fs';
import hasha from 'hasha';
import path from 'path';
import { slugify } from 'transliteration';

import { LoggerStore } from '../../logger/logger.store';
import { IJwtPayload } from '../../oauth/user/user.entity';
import { UPLOAD_DIR } from '../upload.constants';

export interface IFile {
  readonly filename: string;
  readonly originalname: string;
  readonly encoding?: string;
  readonly mimetype: string;
  readonly buffer: Buffer;
  readonly size: number;
}

@Injectable()
export class UploadRestService {
  public async save(file: IFile, _logger_store: LoggerStore, _current_user: IJwtPayload) {
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR);
    }

    const hash_sum = hasha(file.buffer, { algorithm: 'sha256' });

    const file_dir = path.resolve(UPLOAD_DIR, hash_sum);
    const file_name = slugify(file.originalname.toLowerCase());
    const full_path = path.resolve(UPLOAD_DIR, hash_sum, file_name);

    if (!fs.existsSync(file_dir)) {
      fs.mkdirSync(file_dir);
    }

    await this.saveFile(full_path, file.buffer);

    return {
      url: `/uploads/${hash_sum}/${file_name}`,
    };
  }

  private async saveFile(file_path: string, file: Buffer): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.mkdir(path.dirname(file_path), { recursive: true }, (error_mkdir: Error) => {
        if (error_mkdir) {
          reject(error_mkdir);
        }

        fs.writeFile(file_path, file, (error_write: Error) => {
          if (error_write) {
            reject(error_write);
          }

          resolve();
        });
      });
    });
  }
}
