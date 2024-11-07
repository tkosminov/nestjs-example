import { Injectable } from '@nestjs/common';
import fs from 'fs';
import { FileUpload } from 'graphql-upload-ts';
import hasha from 'hasha';
import path from 'path';
import { Readable } from 'stream';
import { slugify } from 'transliteration';

import { LoggerStore } from '../../logger/logger.store';
import { IJwtPayload } from '../../oauth/user/user.entity';
import { UPLOAD_DIR } from '../upload.constants';

@Injectable()
export class UploadGraphQLService {
  public async save(file: FileUpload, _logger_store: LoggerStore, _current_user: IJwtPayload) {
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR);
    }

    const file_stream = file.createReadStream();
    const buffer = await this.streamToBuffer(file_stream);

    const hash_sum = hasha(buffer, { algorithm: 'sha256' });

    const file_dir = path.resolve(UPLOAD_DIR, hash_sum);
    const file_name = slugify(file.filename.toLowerCase());
    const full_path = path.resolve(UPLOAD_DIR, hash_sum, file_name);

    if (!fs.existsSync(file_dir)) {
      fs.mkdirSync(file_dir);
    }

    await this.saveFile(full_path, buffer);

    return {
      url: `/uploads/${hash_sum}/${file_name}`,
    };
  }

  private async streamToBuffer(stream: Readable): Promise<Buffer> {
    const buffer = [];

    return new Promise((resolve, reject) =>
      stream
        .on('error', (error) => reject(error))
        .on('data', (data: never) => buffer.push(data))
        .on('end', () => resolve(Buffer.concat(buffer)))
    );
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
