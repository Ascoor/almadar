/** Country code is ISO3 (e.g., EGY, USA) */
export interface GeoPoint {
  iso3: string;
  lat: number;
  lon: number;
  value: number;
  label?: string;
}

export interface KPI {
  titleKey: string;
  value: number;
  deltaPct?: number;
  spark?: number[];
}

export interface TimePoint {
  date: string;
  series: Record<string, number>;
}

export interface ChoroplethDatum {
  iso3: string;
  metric: number;
}

export interface CategoryDatum {
  category: string;
  value: number;
  region?: string;
}

export interface Filters {
  dateFrom?: string;
  dateTo?: string;
  region?: string;
  countries?: string[];
  categories?: string[];
  search?: string;
}
