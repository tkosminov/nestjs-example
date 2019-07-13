declare module 'graphql-upload' {
  import { ReadStream } from 'fs';
  import { GraphQLScalarType } from 'graphql';

  interface IFileUploadType {
    filename: string;
    mimetype: string;
    encoding: string;
    createReadStream: () => ReadStream;
  }

  type FileUpload = Promise<IFileUploadType>;
}
