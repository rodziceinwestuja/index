export type Page = 'home' | 'wizard' | 'parents-guide';

export interface Broker {
  name: string;
  desc: string;
  link: string;
  comingSoon?: boolean;
}

export interface ChartDataPoint {
  name: string;
  invested: number;
  saved: number;
  realValue: number;
}
