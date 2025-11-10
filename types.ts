
export enum AppMode {
  Image = 'image',
  Vision = 'vision',
  File = 'file',
}

export type ResultData = {
  type: 'image' | 'text' | 'error';
  content: string;
};
