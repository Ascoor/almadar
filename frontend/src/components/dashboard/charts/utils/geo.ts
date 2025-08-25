import { feature } from 'topojson-client';

const iso3to2Map: Record<string, string> = {
  EGY: 'EG',
  USA: 'US',
};

export function iso3To2(iso3: string): string | undefined {
  return iso3to2Map[iso3];
}

export function iso2To3(iso2: string): string | undefined {
  const entry = Object.entries(iso3to2Map).find(([, v]) => v === iso2);
  return entry ? entry[0] : undefined;
}

/**
 * Loads world topojson and converts it to GeoJSON features with ISO3 ids.
 */
export async function loadWorldTopo(): Promise<any[]> {
  const topo = await fetch(
    'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'
  ).then((r) => r.json());
  const features: any[] = feature(topo, topo.objects.countries).features as any[];
  return features.map((f) => ({ ...f, id: f.properties.iso_a3 }));
}
