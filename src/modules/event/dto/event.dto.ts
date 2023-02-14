export type Event = {
  id: number;
  createdDate: Date;
  version: number;
  aggregate: string;
  type: string;
  payload: any;
};
