export interface IMultipartFile {
  fieldname: string;
  originalname: string;
  enconding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}
