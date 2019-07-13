import { Injectable } from '@nestjs/common';

import { FileUpload } from 'graphql-upload';

import AdmZip from 'adm-zip';
import { execFile } from 'child_process';
import fs from 'fs';
import hasha from 'hasha';
import path from 'path';
import { Readable } from 'stream';
import { slugify } from 'transliteration';

import { IExecCommand } from './interface/exec_command.interface';
import { IFileInFs } from './interface/file_in_fs.interface';
import { IPdfConvertResult } from './interface/pdf_convert_result.interface';

/**
 * Папка в которую загружаются файлы.
 */
const uploadDir = __dirname + '/../../uploads';

/**
 * Типы файлов которые можно разархивировать.
 */
const zipMimetypes = ['application/zip', 'application/x-zip-compressed'];

/**
 * Типы файлов которые можно преобразовать в пдф.
 */
const officeMimetypes = [
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // pptx
  'application/msword', // doc
  'application/vnd.ms-excel', // xlx
  'application/vnd.ms-powerpoint', // ppt
  'application/vnd.oasis.opendocument.text', // odt
  'application/vnd.oasis.opendocument.spreadsheet', // ods
  'application/vnd.oasis.opendocument.presentation', // odp
  'application/rtf', // rtf
];

/**
 * Типы изображений которые можно пережать.
 */
const imagesMimetypes = ['image/jpeg', 'image/bmp', 'image/png'];

// tslint:disable: no-feature-envy

@Injectable()
export class UploadService {
  /**
   * Возвращает размер файла или папки в байтах.
   * @param {string} filePath путь к файлу или к папке
   * @returns {number} number
   */
  private getFileOrDirSizeInBytes(filePath: string): number {
    let size = 0;

    const stats = fs.statSync(filePath);

    if (stats.isFile()) {
      size += stats.size;
    } else if (stats.isDirectory()) {
      // tslint:disable-next-line: no-map-without-usage
      fs.readdirSync(filePath).map(child => {
        size += this.getFileOrDirSizeInBytes(`${filePath}/${child}`);
      });
    }

    return size;
  }

  /**
   * Удаляет папку или файл.
   * @param {string} filePath путь к файлу или к папке
   * @returns {void} void
   */
  private deleteDirOrFile(filePath: string): void {
    const stats = fs.statSync(filePath);

    if (stats.isFile()) {
      fs.unlinkSync(filePath);
    } else if (stats.isDirectory()) {
      // tslint:disable-next-line: no-map-without-usage
      fs.readdirSync(filePath).map(child => {
        this.deleteDirOrFile(`${filePath}/${child}`);
      });

      fs.rmdirSync(filePath);
    }

    return;
  }

  /**
   * Сохраняет файл.
   * @param {string} filePath путь для сохранения
   * @param {Buffer | any} file файл для сохранения
   * @returns {Promise<void>} Promise<void>
   */
  // tslint:disable-next-line: no-any
  private async saveFile(filePath: string, file: Buffer | any): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.mkdir(path.dirname(filePath), { recursive: true }, (errorMkdir: Error) => {
        if (errorMkdir) {
          reject(errorMkdir);
        }
        fs.writeFile(filePath, file, (errorWrite: Error) => {
          if (errorWrite) {
            reject(errorWrite);
          }
          resolve();
        });
      });
    });
  }

  /**
   * Извлекает содержимое архива.
   * @param {string }filePath путь к архиву
   * @returns {Promise<void[]>} Promise<void[]>
   */
  private async unzipFile(filePath: string): Promise<void[]> {
    const zip = new AdmZip(fs.readFileSync(filePath));
    const zipEntries = zip.getEntries();

    return await Promise.all(
      zipEntries.map(zipEntry => {
        const foldersCount = zipEntry.entryName.split('/').length;
        if (foldersCount < 10) {
          this.saveFile(`${path.dirname(filePath)}/${zipEntry.entryName}`, zipEntry.getData());
        }
      })
    );
  }

  /**
   * Исполняет команду.
   * @param {string} command команда
   * @param {string[]} args аргументы
   * @returns {Promise<IExecCommand>} Promise<IExecCommand>
   */
  private async execCommand(command: string, args: string[]): Promise<IExecCommand> {
    return new Promise((resolve, reject) => {
      execFile(command, args, { encoding: 'buffer' }, (err: Error, stdout: Buffer, stderr: Buffer) => {
        if (err) {
          reject(err);
        }
        return resolve({ stdout, stderr });
      });
    });
  }

  /**
   * Конвертирует указанный файл в pdf.
   * @param {string} filePath путь к файлу который надо конвертировать
   * @returns {Promise<IPdfConvertResult>} Promise<IPdfConvertResult>
   */
  private async convertFileToPdf(filePath: string): Promise<IPdfConvertResult> {
    const { stdout } = await this.execCommand('unoconv', ['-f', 'pdf', '--stdout', filePath]);

    const newFileName = `${path.parse(path.basename(filePath)).name}.pdf`;
    const newFilePath = path.resolve(path.dirname(filePath), newFileName);

    await this.saveFile(newFilePath, stdout);

    return {
      fileName: newFileName,
      fullPath: newFilePath,
    };
  }

  /**
   * Сохраняет дополнительные размеры картинки.
   * @param {string} filePath путь к оригинальной картинке
   * @returns {Promise<IExecCommand[]>} Promise<IExecCommand[]>
   */
  private async resizeImage(filePath: string): Promise<IExecCommand[]> {
    const baseFileName = path.parse(path.basename(filePath)).name;
    const baseFileExt = path.parse(path.basename(filePath)).ext;

    const sFilePath = path.resolve(path.dirname(filePath), `${baseFileName}_S.${baseFileExt}`);
    const mFilePath = path.resolve(path.dirname(filePath), `${baseFileName}_M.${baseFileExt}`);
    const xFilePath = path.resolve(path.dirname(filePath), `${baseFileName}_X.${baseFileExt}`);
    const xlFilePath = path.resolve(path.dirname(filePath), `${baseFileName}_XL.${baseFileExt}`);

    return await Promise.all([
      this.execCommand('convert', [filePath, '-resize', '24x24^', '-gravity', 'center', '-extent', '24x24', sFilePath]),
      this.execCommand('convert', [filePath, '-resize', '64x64^', '-gravity', 'center', '-extent', '64x64', mFilePath]),
      this.execCommand('convert', [
        filePath,
        '-resize',
        '160x160^',
        '-gravity',
        'center',
        '-extent',
        '160x160',
        xFilePath,
      ]),
      this.execCommand('convert', [
        filePath,
        '-resize',
        '600x600^',
        '-gravity',
        'center',
        '-extent',
        '600x600',
        xlFilePath,
      ]),
    ]);
  }

  /**
   *  Преобразует поток во временные данные.
   * @param {Readable} stream стрим
   * @returns {Promise<Buffer>} Promise<Buffer>
   */
  private async streamToBuffer(stream: Readable): Promise<Buffer> {
    const buffer = [];

    return new Promise((resolve, reject) =>
      stream
        .on('error', error => reject(error))
        .on('data', data => buffer.push(data))
        .on('end', () => resolve(Buffer.concat(buffer)))
    );
  }

  /**
   * Сохраняет файл на диск.
   * @param {FileUpload} file фаил для загрузки
   * @param {boolean} modifyNeed конвертировать/распоковать файл?
   * @returns {Promise<IFileInFs>} Promise<IFileInFs>
   */
  // tslint:disable-next-line: no-flag-args
  public async storeFileByFs(file: FileUpload, modifyNeed: boolean): Promise<IFileInFs> {
    const fileUpload = await file;
    const fileStream = fileUpload.createReadStream();

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    const buffer = await this.streamToBuffer(fileStream);
    const hashSum = await hasha(buffer, { algorithm: 'sha256' });

    let filename = slugify(fileUpload.filename);
    let fullPath = path.resolve(uploadDir, hashSum, filename);
    const fileDir = path.resolve(uploadDir, hashSum);

    if (!fs.existsSync(fileDir)) {
      fs.mkdirSync(fileDir);

      await this.saveFile(fullPath, buffer);

      if (modifyNeed) {
        if (zipMimetypes.indexOf(fileUpload.mimetype) !== -1) {
          await this.unzipFile(fullPath);
        } else if (imagesMimetypes.indexOf(fileUpload.mimetype) !== -1) {
          await this.resizeImage(fullPath);
        } else if (officeMimetypes.indexOf(fileUpload.mimetype) !== -1) {
          const convert = await this.convertFileToPdf(fullPath);

          filename = convert.fileName;
          fullPath = convert.fullPath;
        }
      }
    }

    const fileSize = this.getFileOrDirSizeInBytes(path.dirname(fullPath));

    return {
      originName: fileUpload.filename,
      fileName: filename,
      fullPath,
      filePath: `/uploads/${hashSum}/${filename}`,
      fileSize,
      fileMimetype: fileUpload.mimetype,
      hashSum,
    };
  }

  /**
   * Удаляет папку с загруженными файлами.
   * @param {string} hashSum хэш сумма
   * @returns {Promise<boolean>} Promise<boolean>
   */
  public async removeDirByFs(hashSum: string): Promise<boolean> {
    const dirPath = path.resolve(uploadDir, hashSum);

    if (fs.existsSync(dirPath)) {
      this.deleteDirOrFile(dirPath);
    }

    return true;
  }
}
