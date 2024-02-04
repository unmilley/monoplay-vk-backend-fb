interface Base {
  name: string;
  owner: number;
  price: number;
  pledge: number;
  redemption: number;
  path: string;
  isPledged: boolean;
}

export interface Railroad extends Base {
  rent: number[];
}
export interface Company extends Base {
  rent: string[];
}

export interface Street extends Base {
  housePrice: number;
  rent: Rents;
  color: Color;
}
export type Streets = {
  [colorStreet in Color]: Street[];
};
export interface Rent {
  bought: boolean;
  count: number;
}

export type Rents = {
  [x in RentTitle]: Rent;
};
export type RentTitle = '1empty' | '2color' | '3houseOne' | '4houseTwo' | '5houseThree' | '6houseFour' | '7hotel';
export type Color = 'brown' | 'lightBlue' | 'pink' | 'orange' | 'red' | 'yellow' | 'green' | 'blue';

export interface Chance {
  earnings: number[];
  loss: Array<number | Loss>;
}

interface Loss {
  house: number;
  hotel: number;
}

export enum EDITION {
  ORIGINAL,
}

export interface Fields {
  streets: Street;
  chance: Chance;
  railroads: Railroad[];
  companies: Company[];
}

export interface Room extends Fields {
  title: string;
  admin: number;
  id: number;
  edition: EDITION;
  gamers: Record<number, Gamer>;
  dice?: number[];
}
export interface Gamer {
  id: number;
  isBankrupt: boolean;
  money: number;
  name: string;
}
