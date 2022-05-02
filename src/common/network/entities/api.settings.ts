export class ApiSettings {
  timeout?: number;
  skipRedirects?: boolean;
  responseType?: 'arraybuffer' | 'json';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  headers: any = {};
  verbose?: boolean = true;

  constructor(init?: Partial<ApiSettings>) {
    Object.assign(this, init);
  }
}
