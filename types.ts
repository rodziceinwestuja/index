
export type Page = 'home' | 'wizard';

export interface Broker {
  name: string;
  desc: string;
  link: string;
}

export interface ChartDataPoint {
  name: string;
  invested: number;
  saved: number;
  realValue: number;
}