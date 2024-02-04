import type { Company, Railroad, Street } from './database';

export interface PropertyConfirmation {
  userId: number;
  name: string;
  giving: string;
  street: Street[];
  railroad: Railroad[];
  company: Company[];
}

export interface ConfirmState {
  orderBy: Confirm;
  orderFor: Confirm;
  checked: boolean;
  id: number;
  boardId: number;
}

export interface Confirm {
  userId: number;
  name: string;
  giving?: string;
  names: string[];
  paths: string[];
}
