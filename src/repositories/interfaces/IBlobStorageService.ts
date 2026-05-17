export interface IBlobStorageService {
  upload(buffer: Buffer, filename: string, contentType: string): Promise<string>
  delete(filename: string): Promise<void>
  getUrl(filename: string): string
}
