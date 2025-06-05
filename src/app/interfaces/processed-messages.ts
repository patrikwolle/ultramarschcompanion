export interface ProcessedMessages {
  id: number;
  date: string; // alternativ: Date, wenn du das direkt umwandelst
  length: number;
  height: number;
  bikeLength: number;
  bikeHeight: number;
  imageUrl: string;
  noteCount: number;
}
