export interface MultipartFile {
  fieldname: string;
  originalname: string;
  enconding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}
