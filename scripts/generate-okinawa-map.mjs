import { writeFile } from 'node:fs/promises';
// Geographic source: GSI Global Map Japan, converted by dataofjapan/land.
const response = await fetch('https://raw.githubusercontent.com/dataofjapan/land/master/japan.geojson');
if (!response.ok) throw new Error(`Coastline download: ${response.status}`);
const data = await response.json();
const feature = data.features.find((item) => item.properties.id === 47);
if (feature?.geometry.type !== 'MultiPolygon') throw new Error('Okinawa geometry missing');
const polygons = feature.geometry.coordinates;
// Equirectangular projection with longitude scaled at the regional central latitude.
function paths(bounds, box) {
  const [west, south, east, north] = bounds;
  const [x, y, width, height] = box;
  const cos = Math.cos((south + north) / 2 * Math.PI / 180);
  const scale = Math.min(width / ((east - west) * cos), height / (north - south));
  const ox = x + (width - (east - west) * cos * scale) / 2;
  const oy = y + (height - (north - south) * scale) / 2;
  return polygons.filter(poly => poly[0].every(([lon, lat]) => lon >= west && lon <= east && lat >= south && lat <= north)).map(poly =>
    poly.map(ring => ring.map(([lon, lat], i) => `${i ? 'L' : 'M'}${(ox + (lon - west) * cos * scale).toFixed(2)},${(oy + (north - lat) * scale).toFixed(2)}`).join(' ') + 'Z').join(' '));
}
const output = {
  source: '国土地理院「地球地図日本」（dataofjapan/landによるGeoJSON変換）を加工',
  sourceUrl: 'https://www.gsi.go.jp/kankyochiri/gm_jpn.html',
  polygonCount: polygons.length,
  main: paths([126.65, 25.95, 128.4, 27.35], [32, 44, 376, 324]),
  all: paths([122.85, 24, 131.5, 28], [28, 424, 384, 150]),
};
await writeFile(new URL('../src/data/okinawaCoastline.json', import.meta.url), JSON.stringify(output));
console.log(`Generated ${output.main.length} local and ${output.all.length} prefecture polygons`);
