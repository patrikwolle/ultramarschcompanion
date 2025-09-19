type Numeric = number;

interface BaseMessage {
  id: number;                // bei "toBeProofed" aus data-meldung-id
  date: string;
  length: Numeric;
  height: Numeric;
  bikeLength: Numeric;
  bikeHeight: Numeric;
  imageUrl: string;
  noteCount: number;
  status?: string;           // z.B. "wird geprüft"
}

export interface ProcessedMessage extends BaseMessage {}
export interface ToBeProofedMessage extends BaseMessage {}

export interface ExtractedMessages {
  processedMessages: ProcessedMessage[];
  toBeProofed: ToBeProofedMessage[];
}
