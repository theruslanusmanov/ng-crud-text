export interface ItemEntity {
  id: string;
  content: string;
  modificators?: TextModificator[];
}

export interface TextModificator {
  annotation?: string;
  underline: boolean;
  color: string;
  start: string;
  end: string;
}
