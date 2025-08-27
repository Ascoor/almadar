import fs from "fs";

const inFile = "public/geo/libya-adm1.geojson";
const outFile = "public/geo/libya-adm1.geojson"; // overwrite same file

const raw = JSON.parse(fs.readFileSync(inFile, "utf8"));
if (raw.type !== "FeatureCollection") throw new Error("Invalid GeoJSON");

const normalizeName = (p) =>
  p.name ?? p.NAME_1 ?? p.shapeName ?? p.admin1Name ?? p.adminName1 ?? p.region ?? p.subunit;

const normalizeId = (p) =>
  p.id ?? p.shapeID ?? p.HASC_1 ?? p.GID_1 ?? p.ADM1_PCODE ?? normalizeName(p);

raw.features = raw.features.map((f) => {
  const p = f.properties ?? {};
  const name_en = normalizeName(p);
  const id = normalizeId(p);
  return {
    ...f,
    properties: {
      id: String(id),
      name_en: String(name_en || "Unknown"),
      // placeholder for Arabic names in future
      name_ar: p.name_ar ?? null,
      // keep original
      __orig: p
    }
  };
});

fs.writeFileSync(outFile, JSON.stringify(raw));
console.log("✅ libya-adm1.geojson normalized: id, name_en, name_ar");
