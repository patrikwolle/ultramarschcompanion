type Numeric = number;

export interface BaseMessage {
  id: string;
  date: string;
  length: Numeric;
  height: Numeric;
  bikeLength: Numeric;
  bikeHeight: Numeric;
  imageUrl: string;
  confirmed: boolean;
  noteCount: number;
}
