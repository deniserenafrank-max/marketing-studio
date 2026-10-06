// A drawn map of the Houston-north service area: county outline, Lake Conroe, the roads
// people actually drive (I-45, 105, 1488, 249) and the seven towns. Decorative mirror of the
// chip radiogroup; keyboard users pick towns with the chips.
import { TOWNS, OFF_MAP } from '../content/copy.js';

export function mapSVG() {
  const pins = TOWNS.map((t) => `
    <g class="map-pin" data-pin="${t.id}" transform="translate(${t.x} ${t.y})">
      <circle class="pin-hit" r="5" fill="transparent"/>
      <circle class="pin-head" r="2.2"/>
      <text x="${t.x > 50 ? 3.6 : -3.6}" y="1.2" text-anchor="${t.x > 50 ? 'start' : 'end'}" font-size="3.4">${t.name}</text>
    </g>`).join('');
  return `<svg viewBox="0 0 100 100" role="img" aria-label="Map of the Houston-north service area with the seven towns Denise works. Pick a town with the buttons beside the map.">
    <path class="map-county" d="M18 22 70 14 82 30 84 52 76 74 58 80 40 86 22 78 14 56 12 36z"/>
    <path class="map-lake" d="M34 23c3-2 7-1 9 2 2 4 1 8 3 11 2 4 3 8 1 11-2 2-6 2-9 0-3-3-4-7-5-11-1-4-2-10 1-13z"/>
    <text class="map-label" x="38" y="51" font-size="2.4" text-anchor="middle">Lake Conroe</text>
    <path class="map-road map-road-major" d="M52 0 54 20 56 44 58 62 60 78 62 100"/>
    <text class="map-label" x="57" y="30" font-size="2.6">I-45</text>
    <path class="map-road" d="M10 42 27 40 56 44 90 40"/>
    <text class="map-label" x="72" y="40" font-size="2.4">105</text>
    <path class="map-road" d="M22 72 31 66 55 69 74 64"/>
    <text class="map-label" x="43" y="66.5" font-size="2.4">1488</text>
    <path class="map-road" d="M20 90 35 77 44 64"/>
    <text class="map-label" x="25" y="84" font-size="2.4">249</text>
    <circle class="map-houston" cx="63" cy="97" r="1.4"/>
    <text class="map-label" x="66" y="98" font-size="2.6">Houston</text>
    ${pins}
    <g class="map-pin map-pin-off" data-pin="${OFF_MAP.id}" transform="translate(${OFF_MAP.x} ${OFF_MAP.y})">
      <circle class="pin-hit" r="6" fill="transparent"/>
      <circle class="pin-head" r="2.2"/>
      <text x="3.6" y="1.2" font-size="3">${OFF_MAP.name}</text>
      <text class="map-label" x="3.6" y="5" font-size="2.2">off the map</text>
    </g>
  </svg>`;
}
