import { Html, Line, Stars, useTexture } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { AnimatePresence, motion } from "framer-motion";
import {
  Accessibility, ChevronLeft, ChevronRight, Eye, Fingerprint,
  FlaskConical, Languages, MapPin, Thermometer, Timer,
  Users, Volume2, Waves, Wind, X, ZoomIn,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Suspense, useMemo, useRef, useState } from "react";
import * as THREE from "three";


// ─── FOTO IMPORTS UIT ASSETS ──────────────────────────────────────────────────
import imgAdrienGerlache  from "../assets/3141_adrien-de-gerlache.jpg";
import imgBelgica1        from "../assets/3142_belgica.jpg";
import imgBelgica2        from "../assets/3146_belgica.jpg";
import imgAntwerpen1897   from "../assets/5311_belgica-in-antwerpen-1897.jpg";
import imgInspectie       from "../assets/5316_inspectie-van-de-belgica.jpg";
import imgAntwerpenInca   from "../assets/5318_belgica-in-antwerpen.jpg";
import imgIsfjord         from "../assets/5322_isfjord.jpg";
import imgBelgica3        from "../assets/5602_belgica.jpg";
import imgScheepsplan     from "../assets/5603_scheepsplan.jpg";
import imgOostende        from "../assets/8995_de-belgica-in-oostende-in-1905.jpg";
import imgHerinneringskrt from "../assets/9398_herinneringskaart.jpg";
import imgBemanning       from "../assets/9399_bemanning-van-de-belgica.jpg";
import imgAmundsen        from "../assets/12496_roald-amundsen.jpg";
import imgLecointe        from "../assets/12498_george-lecointe.jpg";
import imgArctowski       from "../assets/12499_henryck-arctowski.jpg";
import imgCook            from "../assets/12500_frederick-albert-cook.jpg";
import imgRacovitza       from "../assets/12501_emile-racovitza.jpg";
import imgGerlache2       from "../assets/12504_adrien-de-gerlache.jpg";
import imgDanco           from "../assets/12513_emile-danco.jpg";
import imgKaart1          from "../assets/32321_lecointe-1903-kaart-1.jpg";
import imgKaart2          from "../assets/32322_lecointe-1903-kaart-2.jpg";
import imgArcFig2         from "../assets/32666_arctowski-en-thoulet-1901-fig-2.jpg";
import imgExpoAntarctica  from "../assets/beelden-uit-de-expo-antarctica.avif";

// ─── Wolkenvrije NASA Blue Marble texture ─────────────────────────────────────
const EARTH_TEXTURE_URL = "https://unpkg.com/three-globe@2.31.0/example/img/earth-blue-marble.jpg";

// ─── Types ────────────────────────────────────────────────────────────────────
type AccessibilityTag = "wheelchair" | "audio" | "low-sensory" | "sign-language" | "braille";
type Era = "historic" | "modern";

type ExpeditionStop = {
  id: string;
  era: Era;
  name: string;
  label: string;
  date: string;
  foundedYear?: number;
  lat: number;
  lon: number;
  progress: number;
  temperature: string;
  wind: string;
  duration: string;
  note: string;
  facts: string[];
  photos: string[];
  accessibility: AccessibilityTag[];
};

type Passage = {
  label: string;
  name: string;
  date: string;
  temperature: string;
  wind: string;
  duration: string;
};

type GlobeSceneProps = {
  progress: number;
  selectedEra: Era;
  historicProgress: number;
  modernProgress: number;
  activeStops: ExpeditionStop[];
  onHotspotClick: (stop: ExpeditionStop) => void;
  lightboxOpen: boolean;
};

type FootstepData = {
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
  isLeft: boolean;
};

// ─── Expeditiedata — Historisch (1897-1899) & Modern (1957-heden) ────────────
const expeditionStops: ExpeditionStop[] = [
  // ── HISTORISCHE ERA ────────────────────────────────────────────────────────
  {
    id: "antwerp-depart",
    era: "historic",
    name: "Antwerpen",
    label: "Vertrekhaven",
    date: "16 aug 1897",
    lat: 51.2194, lon: 4.4025, progress: 0,
    temperature: "7°C", wind: "12 kn", duration: "Week 0",
    note: "De Belgica verlaat Antwerpen onder leiding van Adrien de Gerlache. Een bemanning van veertien man en zeven wetenschappers gaat de poolgeschiedenis in als eerste expeditie die de zuidpool bereikt.",
    facts: [
      "Eerste Belgische wetenschappelijke poolexpeditie ooit",
      "Route via Madeira, Rio de Janeiro en Vuurland naar Antarctica",
      "Roald Amundsen diende als eerste stuurman aan boord",
    ],
    photos: [imgAntwerpen1897, imgAntwerpenInca, imgAdrienGerlache, imgInspectie, imgBemanning, imgScheepsplan],
    accessibility: ["wheelchair", "audio", "low-sensory", "sign-language"],
  },
  {
    id: "gerlache-strait",
    era: "historic",
    name: "Straat van de Gerlache",
    label: "Ontdekking & Naamgeving",
    date: "jan – feb 1898",
    lat: -65.2, lon: -64.2, progress: 0.55,
    temperature: "−15°C", wind: "38 kn", duration: "26 weken",
    note: "De Belgica verkent en brengt als eerste de zeestraat in kaart die later de naam van haar kapitein draagt. De bemanning ontdekt een netwerk van kanalen en eilanden in een van de meest spectaculaire landschappen op aarde.",
    facts: [
      "De zeestraat werd vernoemd naar expeditieleidder Adrien de Gerlache",
      "Eerste gedetailleerde hydrografische kaart van het Antarctische Schiereiland",
      "Lecointe voerde astronomische metingen uit voor precieze navigatiekaarten",
    ],
    photos: [imgIsfjord, imgBelgica3, imgGerlache2, imgRacovitza, imgAmundsen, imgKaart2],
    accessibility: ["wheelchair", "audio", "low-sensory"],
  },
  {
    id: "bellingshausen",
    era: "historic",
    name: "Bellingshausenzee",
    label: "Overwintering in het Pakijs",
    date: "feb 1898 — mar 1899",
    lat: -71.0, lon: -89.5, progress: 1.0,
    temperature: "−43°C", wind: "68 kn", duration: "377 dagen",
    note: "De Belgica raakt gevangen in het pakijs van de Bellingshausenzee en overwintert als eerste bemanning ooit in de eeuwige poolnacht onder de zuidpoolcirkel. 377 dramatische dagen van wetenschappelijk onderzoek, honger en psychische uitputting.",
    facts: [
      "Eerste gedwongen overwintering ooit onder de zuidpoolcirkel — 377 dagen",
      "Cook en Amundsen hielpen de bemanning door psychische crises tijdens de poolnacht",
      "Eerste continue meteorologische en magnetische metingen in het Antarctische pakijs",
    ],
    photos: [imgAmundsen, imgCook, imgLecointe, imgArctowski, imgRacovitza, imgDanco],
    accessibility: ["wheelchair", "audio", "low-sensory", "sign-language"],
  },

  // ── MODERNE ERA ────────────────────────────────────────────────────────────
  {
    id: "boudewijn",
    era: "modern",
    name: "Basis Koning Boudewijn",
    label: "Fase 1: 1957–1967",
    date: "1957–1967",
    foundedYear: 1957,
    lat: -70.4, lon: 12.0, progress: 0.3,
    temperature: "−25°C", wind: "45 kn", duration: "10 jaar",
    note: "Opgericht door Gaston de Gerlache — zoon van Adrien de Gerlache — tijdens het Internationaal Geofysisch Jaar. België keert terug naar Antarctica, zestig jaar na de Belgica-expeditie, met een permanente wetenschappelijke basis.",
    facts: [
      "Gebouwd op het ijs van de Prinses Ragnhildkust, Dronning Maudland",
      "Fokus op atmosferisch onderzoek, glaciologie en geomagnetisme",
      "Logistieke aanvoer via Kaapstad en vervolgbases aan de kust",
    ],
    photos: [imgBelgica1, imgBelgica3, imgScheepsplan, imgInspectie, imgKaart1, imgHerinneringskrt],
    accessibility: ["wheelchair", "audio"],
  },
  {
    id: "elisabeth",
    era: "modern",
    name: "Prinses Elisabethbasis",
    label: "Fase 2: 2007–heden",
    date: "2007–heden",
    foundedYear: 2007,
    lat: -71.9, lon: 23.3, progress: 1.0,
    temperature: "−35°C", wind: "38 kn", duration: "permanent",
    note: "Het Princess Elisabeth Antarctica Station is het eerste zero-emissie poolonderzoeksstation ter wereld, volledig op wind- en zonne-energie. Het eert de nalatenschap van de vroege pioniers met hypermodern klimaatonderzoek in een van de meest afgelegen plaatsen op aarde.",
    facts: [
      "Eerste zero-emissie poolstation ter wereld — volledig op hernieuwbare energie",
      "Opgericht door de International Polar Foundation onder leiding van Alain Hubert",
      "Jaarlijkse internationale wetenschappelijke expedities op het gebied van klimaatverandering",
    ],
    photos: [imgExpoAntarctica, imgGerlache2, imgKaart2, imgOostende, imgIsfjord, imgHerinneringskrt],
    accessibility: ["wheelchair", "audio", "low-sensory", "sign-language", "braille"],
  },
];

// Module-level filtered views — vermijdt herberekening bij elke render
const historicStops = expeditionStops.filter(s => s.era === "historic");
const modernStops   = expeditionStops.filter(s => s.era === "modern");

// Label-offsets per stop id (boven of onder de marker op de globe)
const HOTSPOT_LABEL_OFFSET: Record<string, [number, number, number]> = {
  "antwerp-depart":  [0,  0.30, 0],
  "gerlache-strait": [0,  0.30, 0],
  "bellingshausen":  [0, -0.32, 0],
  "boudewijn":       [0,  0.38, 0],
  "elisabeth":       [0, -0.30, 0],
};

// ── Passages per era ──────────────────────────────────────────────────────────
const historicPassages: Array<Passage & { from: number }> = [
  { from: 0,    label: "Vertrekhaven",           name: "Antwerpen",     date: "aug 1897", temperature: "7°C",   wind: "12 kn", duration: "Week 0" },
  { from: 0.20, label: "Atlantische passage",    name: "Zuidwaarts",    date: "sep 1897", temperature: "18°C",  wind: "28 kn", duration: "6 weken" },
  { from: 0.40, label: "Kaapstad",               name: "Tussenstop",    date: "nov 1897", temperature: "15°C",  wind: "24 kn", duration: "14 weken" },
  { from: 0.55, label: "Straat van de Gerlache", name: "Ontdekking",    date: "jan 1898", temperature: "−15°C", wind: "38 kn", duration: "22 weken" },
  { from: 0.88, label: "Bellingshausenzee",      name: "Overwintering", date: "1898–1899",temperature: "−43°C", wind: "68 kn", duration: "377 dagen" },
];

const modernPassages: Array<Passage & { from: number }> = [
  { from: 0,    label: "Voorbereiding IGY",      name: "Intern. Geofysisch Jaar",  date: "1957",       temperature: "—",    wind: "—",    duration: "—" },
  { from: 0.30, label: "Basis Koning Boudewijn", name: "Eerste Moderne Basis",     date: "1957–1967",  temperature: "−25°C",wind: "45 kn",duration: "10 jaar" },
  { from: 0.90, label: "Prinses Elisabethbasis", name: "Zero-emissie Station",     date: "2007–heden", temperature: "−35°C",wind: "38 kn",duration: "permanent" },
];

function getHistoricPassage(progress: number): Passage {
  return historicPassages.reduce<Passage>(
    (cur, p) => (progress >= p.from ? p : cur),
    historicPassages[0],
  );
}

function getModernPassage(progress: number): Passage {
  return modernPassages.reduce<Passage>(
    (cur, p) => (progress >= p.from ? p : cur),
    modernPassages[0],
  );
}

// ── Unified timeline mapping ──────────────────────────────────────────────────
// First 40 % of the slider covers the historic era (1897-1899).
// Remaining 60 % covers the modern era (1957-2026).
const HISTORIC_END = 0.40;

function unifiedToEra(p: number): { era: Era; historicProgress: number; modernProgress: number } {
  if (p <= HISTORIC_END) {
    return { era: "historic", historicProgress: p / HISTORIC_END, modernProgress: 0 };
  }
  return { era: "modern", historicProgress: 1, modernProgress: (p - HISTORIC_END) / (1 - HISTORIC_END) };
}

function stopToUnified(stop: ExpeditionStop): number {
  return stop.era === "historic"
    ? stop.progress * HISTORIC_END
    : HISTORIC_END + stop.progress * (1 - HISTORIC_END);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function latLonToVector3(lat: number, lon: number, radius = 2.08) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

// Ketent door alle historische stops (3 segmenten × 60 punten = 180 totaal).
// De voortgang per segment wordt bepaald door stop.progress-waarden.
function makeArcPoints(stops: ExpeditionStop[]) {
  return stops.slice(0, -1).flatMap((start, i) => {
    const end = stops[i + 1];
    return Array.from({ length: 60 }, (_, j) => {
      const t = j / 59;
      const sv = latLonToVector3(start.lat, start.lon, 2.1).normalize();
      const ev = latLonToVector3(end.lat, end.lon, 2.1).normalize();
      const angle = sv.angleTo(ev);
      const sinA = Math.sin(angle);
      const p = sv
        .clone()
        .multiplyScalar(Math.sin((1 - t) * angle) / sinA)
        .add(ev.clone().multiplyScalar(Math.sin(t * angle) / sinA))
        .normalize();
      const alt = 2.11 + Math.sin(t * Math.PI) * 0.18;
      return p.multiplyScalar(alt);
    });
  });
}

function makeGreatCircle(
  startLat: number, startLon: number,
  endLat: number, endLon: number,
  arcHeight = 0.18,
  segments = 72,
) {
  const sv = latLonToVector3(startLat, startLon, 2.1).normalize();
  const ev = latLonToVector3(endLat, endLon, 2.1).normalize();
  const angle = sv.angleTo(ev);
  const sin = Math.sin(angle);
  return Array.from({ length: segments }, (_, i) => {
    const t = i / (segments - 1);
    const p = sv
      .clone()
      .multiplyScalar(Math.sin((1 - t) * angle) / sin)
      .add(ev.clone().multiplyScalar(Math.sin(t * angle) / sin))
      .normalize();
    const alt = 2.11 + Math.sin(t * Math.PI) * arcHeight;
    return p.multiplyScalar(alt);
  });
}

// ─── Station landmark constants ────────────────────────────────────────────────
const STATION_LAT = -71.9, STATION_LON = 23.3; // Prinses Elisabethbasis

// Antarctische bergtoppen langs de route (realistischer gespreide locaties)
const ANT_PEAKS = [
  // Schiereiland
  { lat: -64.8, lon: -64.2, h: 0.055, r: 0.016 },
  { lat: -65.5, lon: -64.8, h: 0.072, r: 0.020 },
  // Transantarctisch gebergte, westflank Weddellzee
  { lat: -67.2, lon: -60.0, h: 0.082, r: 0.019 },
  { lat: -68.6, lon: -57.5, h: 0.068, r: 0.017 },
  // Dronning Maud Land bergketens
  { lat: -71.0, lon:  -8.0, h: 0.090, r: 0.022 },
  { lat: -72.3, lon:   8.5, h: 0.078, r: 0.018 },
  { lat: -73.0, lon:  20.0, h: 0.062, r: 0.015 },
  // Vinson Massief (hoogste top Antarctica)
  { lat: -78.5, lon: -85.6, h: 0.118, r: 0.026 },
];

// ─── Globe Shaders ────────────────────────────────────────────────────────────
const EARTH_VERT = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 viewPos = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = viewPos.xyz;
    gl_Position = projectionMatrix * viewPos;
  }
`;

const EARTH_FRAG = /* glsl */ `
  uniform sampler2D earthMap;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    vec3 tex = texture2D(earthMap, vUv).rgb;
    float lum = dot(tex, vec3(0.299, 0.587, 0.114));

    // Antarctica: south pole = bottom of equirectangular map (vUv.y near 0)
    float antZone = smoothstep(0.22, 0.07, vUv.y);
    float iceDetect = smoothstep(0.58, 0.78, lum);
    float ice = max(antZone * smoothstep(0.32, 0.55, lum), iceDetect * smoothstep(0.14, 0.06, vUv.y));

    // Ocean detection: blue-dominant pixels
    float blueDom = (tex.b - max(tex.r, tex.g)) / (lum + 0.001);
    float isOcean = smoothstep(0.05, 0.22, blueDom) * (1.0 - ice);

    // Deep blue ocean palette
    vec3 deepOcean = mix(vec3(0.04, 0.10, 0.30), vec3(0.02, 0.06, 0.22), 1.0 - lum);
    vec3 ocean = mix(tex * 0.75, deepOcean, 0.72);

    // Land: natural earth tones, slight brightness boost
    vec3 land = tex * 1.22;
    land = clamp(land, 0.0, 1.0);

    // Pure ice white for Antarctica
    vec3 iceColor = vec3(0.94, 0.97, 1.0);

    // Compose layers
    vec3 color = mix(land, ocean, isOcean);
    color = mix(color, iceColor, ice);

    // Atmospheric Fresnel — soft blue glow at planet edge
    vec3 viewDir = normalize(-vViewPosition);
    float rim = pow(1.0 - max(dot(normalize(vNormal), viewDir), 0.0), 3.2);
    color += vec3(0.08, 0.30, 0.90) * rim * 1.4;

    gl_FragColor = vec4(color, 1.0);
  }
`;

// Separate atmosphere shader (additive glow sphere, slightly larger)
const ATMO_VERT = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 vp = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = vp.xyz;
    gl_Position = projectionMatrix * vp;
  }
`;
const ATMO_FRAG = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  void main() {
    vec3 viewDir = normalize(-vViewPosition);
    float rim = pow(1.0 - max(dot(normalize(vNormal), viewDir), 0.0), 2.4);
    gl_FragColor = vec4(0.12, 0.38, 1.0, rim * 0.38);
  }
`;

// ─── EarthGlobe scene component ───────────────────────────────────────────────
function EarthGlobe({
  progress, selectedEra, historicProgress, modernProgress,
  activeStops, onHotspotClick, lightboxOpen,
}: GlobeSceneProps) {
  const primaryStop = activeStops[0] ?? null;
  const earthMap   = useTexture(EARTH_TEXTURE_URL);
  const groupRef   = useRef<THREE.Group>(null);
  const pathPoints = useMemo(() => makeArcPoints(historicStops), []);

  // 6 stops: 4 historisch + 2 modern
  const haloRefs  = useRef<(THREE.Mesh | null)[]>([null, null, null, null, null]);
  const halo2Refs = useRef<(THREE.Mesh | null)[]>([null, null, null, null, null]);

  const earthMaterial = useMemo(() => {
    earthMap.colorSpace = THREE.SRGBColorSpace;
    return new THREE.ShaderMaterial({
      uniforms: { earthMap: { value: earthMap } },
      vertexShader: EARTH_VERT,
      fragmentShader: EARTH_FRAG,
    });
  }, [earthMap]);

  const atmosphereMaterial = useMemo(
    () => new THREE.ShaderMaterial({
      uniforms: {},
      vertexShader: ATMO_VERT,
      fragmentShader: ATMO_FRAG,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.FrontSide,
      depthWrite: false,
    }),
    [],
  );

  // Historische zeeroute: zichtbare punten o.b.v. historicProgress en stop.progress-segmenten
  const visiblePath = useMemo(() => {
    if (historicProgress <= 0) return [] as THREE.Vector3[];
    const SEGS = 60;
    let total = 0;
    for (let i = 0; i < historicStops.length - 1; i++) {
      const s0 = historicStops[i].progress;
      const s1 = historicStops[i + 1].progress;
      if (historicProgress <= s0) break;
      if (historicProgress >= s1) { total += SEGS; }
      else {
        total += Math.max(2, Math.ceil(SEGS * (historicProgress - s0) / (s1 - s0)));
        break;
      }
    }
    return pathPoints.slice(0, Math.min(total, pathPoints.length));
  }, [pathPoints, historicProgress]);

  const antPeakData = useMemo(() =>
    ANT_PEAKS.map(pk => ({
      pos:  latLonToVector3(pk.lat, pk.lon, 2.0),
      quat: new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        latLonToVector3(pk.lat, pk.lon, 1.0).normalize(),
      ),
      h: pk.h, r: pk.r,
    })), []);

  const stationLandmarkData = useMemo(() => ({
    pos:  latLonToVector3(STATION_LAT, STATION_LON, 2.145),
    quat: new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      latLonToVector3(STATION_LAT, STATION_LON, 1).normalize(),
    ),
  }), []);

  // Dashed arc tussen de twee moderne bases
  const boudewijnToElisabeth = useMemo(
    () => makeGreatCircle(modernStops[0].lat, modernStops[0].lon, modernStops[1].lat, modernStops[1].lon, 0.06, 36),
    [],
  );

  // Hotspot positions as stable [x,y,z] tuples anchored to the globe surface.
  // Computed once at mount — tuples avoid the Vector3-reference diffing quirk in R3F.
  const hotspotPositions = useMemo<[number, number, number][]>(
    () => expeditionStops.map(stop => {
      const v = latLonToVector3(stop.lat, stop.lon, 2.08);
      return [v.x, v.y, v.z];
    }),
    [],
  );

  useFrame(({ camera, clock }) => {
    if (groupRef.current) {
      const boudewijnV = latLonToVector3(modernStops[0].lat, modernStops[0].lon, 2.1).normalize();
      const elisabethV = latLonToVector3(modernStops[1].lat, modernStops[1].lon, 2.1).normalize();

      // Historic focus: current position on route path
      const pathIdx = Math.min(pathPoints.length - 1, Math.max(0, Math.floor(historicProgress * (pathPoints.length - 1))));
      const historicFocus = pathPoints.length > 0 ? pathPoints[pathIdx].clone().normalize() : new THREE.Vector3(0, 0, 1);

      // Modern focus: lerp between Boudewijn and Elisabeth
      const modernFocus = boudewijnV.clone().lerp(elisabethV, THREE.MathUtils.clamp(modernProgress, 0, 1)).normalize();

      // Blend weight: 0 = fully historic, 1 = fully modern.
      // Transition is spread over a ±7 % zone around HISTORIC_END so
      // the globe rotates continuously instead of snapping.
      const BLEND_HALF = 0.07;
      const eraBlend = THREE.MathUtils.clamp(
        (progress - (HISTORIC_END - BLEND_HALF)) / (BLEND_HALF * 2), 0, 1,
      );

      let focusVec: THREE.Vector3;
      if (primaryStop) {
        focusVec = latLonToVector3(primaryStop.lat, primaryStop.lon, 2.1).normalize();
      } else {
        focusVec = historicFocus.clone().lerp(modernFocus, eraBlend).normalize();
      }

      const target = new THREE.Quaternion().setFromUnitVectors(focusVec, new THREE.Vector3(0, 0, 1));
      groupRef.current.quaternion.slerp(target, 0.072);
    }

    // Camera zoom — also blended across the era boundary so zoom
    // transitions smoothly instead of jumping at HISTORIC_END.
    const historicZ = historicProgress < 0.55
      ? THREE.MathUtils.lerp(6.65, 5.2, 1 - Math.pow(1 - historicProgress / 0.55, 2.0))
      : THREE.MathUtils.lerp(5.2, 3.4, 1 - Math.pow(1 - THREE.MathUtils.clamp((historicProgress - 0.55) / 0.45, 0, 1), 1.8));
    const modernZ = THREE.MathUtils.lerp(5.2, 4.4, 1 - Math.pow(1 - THREE.MathUtils.clamp(modernProgress, 0, 1), 1.5));
    const ZOOM_BLEND_HALF = 0.07;
    const zoomBlend = THREE.MathUtils.clamp(
      (progress - (HISTORIC_END - ZOOM_BLEND_HALF)) / (ZOOM_BLEND_HALF * 2), 0, 1,
    );
    const targetZ = THREE.MathUtils.lerp(historicZ, modernZ, zoomBlend);

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, 0, 0.06);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0, 0.06);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.065);
    camera.lookAt(0, 0, 0);

    const t = clock.elapsedTime;
    haloRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const phase = t * 2.4 + i * 1.1;
      mesh.scale.setScalar(1 + Math.sin(phase) * 0.18);
      (mesh.material as THREE.MeshBasicMaterial).opacity = 0.14 + Math.sin(phase) * 0.08;
    });
    halo2Refs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const phase = t * 2.4 + i * 1.1 + Math.PI;
      mesh.scale.setScalar(1 + Math.sin(phase) * 0.14);
      (mesh.material as THREE.MeshBasicMaterial).opacity = 0.06 + Math.sin(phase) * 0.04;
    });
  });

  // Bergtoppen: faden in zodra Antarctica in beeld komt (beide eras)
  const peakOpacity = THREE.MathUtils.clamp(
    selectedEra === "modern"
      ? modernProgress * 3.5
      : (historicProgress - 0.72) * 8,
    0, 1,
  );

  // Station-landmark: alleen zichtbaar in moderne era
  const stationOpacity = selectedEra === "modern"
    ? THREE.MathUtils.clamp((modernProgress - 0.72) * 5, 0, 1)
    : 0;

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 3, 4]} intensity={2.2} color="#fff8f0" />
      <pointLight position={[-4, -2, 3]} intensity={2.8} color="#2255ff" />
      <Stars radius={100} depth={40} count={2200} factor={3.5} fade speed={0.14} />

      <mesh>
        <sphereGeometry args={[2.18, 64, 64]} />
        <primitive object={atmosphereMaterial} attach="material" />
      </mesh>

      <group ref={groupRef}>
        <mesh>
          <sphereGeometry args={[2, 128, 128]} />
          <primitive object={earthMaterial} attach="material" />
        </mesh>

        {/* Historische zeeroute (rood, solid) — alleen in historische era */}
        {selectedEra === "historic" && visiblePath.length >= 2 && (
          <>
            <Line points={visiblePath} color="#ef4444" lineWidth={3.5} transparent opacity={0.92} />
            <Line points={visiblePath} color="#ff8080" lineWidth={10}  transparent opacity={0.22} />
          </>
        )}

        {/* Moderne verbindingsboog (blauw, gestippeld) — alleen in moderne era */}
        {selectedEra === "modern" && modernProgress + 0.05 >= modernStops[0].progress && (
          <Line
            points={boudewijnToElisabeth}
            color="#7dd3fc"
            lineWidth={2}
            transparent
            opacity={0.82}
            dashed
            dashSize={0.05}
            gapSize={0.04}
          />
        )}

        {/* Hotspot markers — all stops anchored to globe surface via memoised tuples */}
        {(() => {
          const eraStops   = expeditionStops.filter(s => s.era === selectedEra);
          const eraProgress = selectedEra === "historic" ? historicProgress : modernProgress;

          // Last reached stop in the active era (with a tiny tolerance)
          const lastReached = eraStops.reduce<ExpeditionStop | null>(
            (best, s) => eraProgress + 0.06 >= s.progress && (!best || s.progress > best.progress) ? s : best,
            null,
          );
          // Next approaching stop: shown as a "destination" label up to 0.45 ahead
          const nextStop = eraStops.find(
            s => s.progress > eraProgress && s.progress <= eraProgress + 0.45,
          );
          const timelineStop = nextStop ?? lastReached;
          const labelStopId = activeStops.length > 0
            ? activeStops[0].id
            : (timelineStop?.id ?? null);

          return expeditionStops.map((stop, i) => {
            const stopProgress = stop.era === "historic" ? historicProgress : modernProgress;
            const reached  = stopProgress + 0.06 >= stop.progress;
            const active   = activeStops.some(s => s.id === stop.id);
            const dimmed   = stop.era !== selectedEra;
            const isModern = stop.era === "modern";

            const coreColor = isModern
              ? (active ? "#7dd3fc" : dimmed ? "#0e2f45" : "#38bdf8")
              : (active ? "#ff8080" : dimmed ? "#3b0a0a" : "#ef4444");
            const haloColor = isModern ? "#38bdf8" : "#ef4444";

            const showLabel = !dimmed && (reached || stop.id === labelStopId) && stop.id === labelStopId && !lightboxOpen && activeStops.length === 0;
            const offset    = HOTSPOT_LABEL_OFFSET[stop.id] ?? [0, 0.30, 0];

            return (
              <group key={stop.id} position={hotspotPositions[i]} onClick={() => onHotspotClick(stop)}>
                <mesh ref={(el) => { halo2Refs.current[i] = el; }}>
                  <sphereGeometry args={[0.13, 24, 24]} />
                  <meshBasicMaterial color={haloColor} transparent opacity={dimmed ? 0.02 : 0.09} />
                </mesh>
                <mesh ref={(el) => { haloRefs.current[i] = el; }}>
                  <sphereGeometry args={[0.09, 24, 24]} />
                  <meshBasicMaterial color={haloColor} transparent opacity={dimmed ? 0.03 : 0.18} />
                </mesh>
                <mesh>
                  <sphereGeometry args={[active ? 0.068 : 0.054, 24, 24]} />
                  <meshBasicMaterial color={coreColor} />
                </mesh>
                <Html center position={offset as [number, number, number]} className="pointer-events-none select-none">
                  <div
                    className="rounded-lg border border-white/22 bg-black/65 px-5 py-2 backdrop-blur-sm"
                    style={{
                      whiteSpace: "nowrap",
                      textAlign: "center",
                      opacity: showLabel ? 1 : 0,
                      transition: "opacity 0.45s ease",
                    }}
                  >
                    <span className="text-sm font-semibold uppercase tracking-wider text-white">
                      {stop.name}
                    </span>
                  </div>
                </Html>
              </group>
            );
          });
        })()}

        {/* Antarctische bergtoppen */}
        {antPeakData.map((pk, i) => (
          <group key={`peak-${i}`} position={pk.pos} quaternion={pk.quat}>
            <mesh>
              <coneGeometry args={[pk.r * 1.15, pk.h * 0.55, 6]} />
              <meshBasicMaterial color="#6b8ca8" transparent opacity={peakOpacity * 0.52} />
            </mesh>
            <mesh position={[0, pk.h * 0.22, 0]}>
              <coneGeometry args={[pk.r * 0.62, pk.h * 0.55, 5]} />
              <meshBasicMaterial color="#deeef8" transparent opacity={peakOpacity * 0.72} />
            </mesh>
            <mesh position={[0, pk.h * 0.58, 0]}>
              <coneGeometry args={[pk.r * 0.22, pk.h * 0.30, 4]} />
              <meshBasicMaterial color="#f0f8ff" transparent opacity={peakOpacity * 0.85} />
            </mesh>
          </group>
        ))}

        {/* Prinses Elisabethbasis 3D landmark — alleen moderne era */}
        {stationOpacity > 0 && (
          <group position={stationLandmarkData.pos} quaternion={stationLandmarkData.quat}>
            {([-0.022, -0.007, 0.007, 0.022] as const).map((x, i) => (
              <mesh key={i} position={[x, 0.011, 0]}>
                <cylinderGeometry args={[0.0028, 0.0035, 0.022, 6]} />
                <meshBasicMaterial color="#94a3b8" transparent opacity={stationOpacity * 0.88} />
              </mesh>
            ))}
            <mesh position={[0, 0.024, 0]}>
              <boxGeometry args={[0.068, 0.013, 0.028]} />
              <meshBasicMaterial color="#7dd3fc" transparent opacity={stationOpacity * 0.78} />
            </mesh>
            <mesh position={[0, 0.033, 0.004]} rotation={[0.30, 0, 0]}>
              <boxGeometry args={[0.065, 0.003, 0.034]} />
              <meshBasicMaterial color="#bae6fd" transparent opacity={stationOpacity * 0.65} />
            </mesh>
            {([-0.025, 0.025] as const).map((x, i) => (
              <mesh key={i} position={[x, 0.046, 0]}>
                <cylinderGeometry args={[0.0018, 0.0018, 0.020, 8]} />
                <meshBasicMaterial color="#e2e8f0" transparent opacity={stationOpacity * 0.75} />
              </mesh>
            ))}
            <mesh position={[0, 0.052, 0]}>
              <sphereGeometry args={[0.010, 16, 16]} />
              <meshBasicMaterial color="#38bdf8" transparent opacity={stationOpacity * 0.70} />
            </mesh>
            <mesh position={[0, 0.052, 0]}>
              <sphereGeometry args={[0.018, 16, 16]} />
              <meshBasicMaterial color="#7dd3fc" transparent opacity={stationOpacity * 0.22} />
            </mesh>
          </group>
        )}
      </group>

    </>
  );
}

// ─── Footprint shared geometry & color palette ────────────────────────────────
// Built once at module load — no GL context needed for Shape / EllipseCurve
const FOOTSTEP_SOLE_SHAPE = (() => {
  const shape = new THREE.Shape();
  shape.setFromPoints(
    new THREE.EllipseCurve(0, 0, 0.009, 0.016, 0, Math.PI * 2, false, 0).getPoints(24),
  );
  return shape;
})();
const _DARK_RED   = new THREE.Color("#991b1b");
const _BRIGHT_RED = new THREE.Color("#ef4444");

// ─── FootprintMesh ────────────────────────────────────────────────────────────
function FootprintMesh({
  position,
  quaternion,
  isLeft,
  opacity,
  color,
}: {
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
  isLeft: boolean;
  opacity: number;
  color: THREE.Color;
}) {
  // Heel arch offset: left heel tilts inward (+X), right heel tilts inward (-X)
  const heelX = isLeft ? 0.002 : -0.002;

  return (
    <group position={position} quaternion={quaternion}>
      {/*
        Rotate −90° around local X: the ShapeGeometry lives in the XY plane,
        which after this rotation becomes the XZ tangent plane of the globe.
        Result: sole lies perfectly flat on the surface.
        X (inner) → right direction   (across gait width)
        Y (inner) → backward direction (−Z outer = heel end)
        Z (inner) → outward normal    (lifted off surface)
      */}
      <group rotation={[-Math.PI / 2, 0, 0]}>
        {/* Sole — ellipse: short axis = gait width, long axis = travel direction */}
        <mesh>
          <shapeGeometry args={[FOOTSTEP_SOLE_SHAPE]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={opacity}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Heel — smaller circle at the back of the sole (+Y inner = heel end) */}
        <mesh position={[heelX, 0.010, 0]}>
          <circleGeometry args={[0.006, 16]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={opacity * 0.72}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </group>
  );
}

// ─── Globe loading fallback ───────────────────────────────────────────────────
function GlobeLoading() {
  return (
    <Html center>
      <div className="museum-glass px-5 py-3 text-xs font-medium uppercase tracking-[0.28em] text-white/60">
        Globe laden…
      </div>
    </Html>
  );
}

// ─── Reusable data-snapshot card ──────────────────────────────────────────────
function DataCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    /* min-h-[52px] guarantees WCAG touch-target height */
    <div className="flex min-h-[52px] flex-col justify-center gap-1 rounded-xl border border-white/12 bg-white/6 px-3.5 py-3">
      <span className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.26em] text-white/55">
        {icon}
        {label}
      </span>
      <span className="text-[15px] font-semibold leading-tight text-white">{value}</span>
    </div>
  );
}
// ─── Main touchwall ───────────────────────────────────────────────────────────
export function ExpeditionTouchwall() {
  const [progress, setProgress]       = useState(0);
  // Multi-user: up to 3 detail panels open simultaneously (newest first)
  const [activeStops, setActiveStops] = useState<ExpeditionStop[]>([]);
  const [lightbox, setLightbox]       = useState<{ photos: string[]; index: number } | null>(null);
  const touchStartX                   = useRef(0);

  const { era: selectedEra, historicProgress, modernProgress } = unifiedToEra(progress);
  const currentPassage = selectedEra === "historic"
    ? getHistoricPassage(historicProgress)
    : getModernPassage(modernProgress);

  function handleHotspotClick(stop: ExpeditionStop) {
    setProgress(stopToUnified(stop));
    setActiveStops(prev => {
      const alreadyOpen = prev.some(s => s.id === stop.id);
      // Toggle: clicking an open hotspot closes its panel
      if (alreadyOpen) return prev.filter(s => s.id !== stop.id);
      // Add newest to front, cap at 3 simultaneous panels
      return [stop, ...prev].slice(0, 3);
    });
  }

  function closePanel(stopId: string) {
    setActiveStops(prev => prev.filter(s => s.id !== stopId));
  }

  return (
    <main className="touchwall-shell relative isolate flex min-h-screen overflow-hidden text-white">

      {/* ── Full-screen globe canvas ── */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 6.65], fov: 39 }}
          dpr={[1, 1.8]}
          gl={{ antialias: true, powerPreference: "high-performance" }}
        >
          <Suspense fallback={<GlobeLoading />}>
            <EarthGlobe
              progress={progress}
              selectedEra={selectedEra}
              historicProgress={historicProgress}
              modernProgress={modernProgress}
              activeStops={activeStops}
              onHotspotClick={handleHotspotClick}
              lightboxOpen={lightbox !== null}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* ════════════════════════════════════════════
          CREW ATLAS LINK — center-right tab
          Venster-achtige knop, altijd binnen handbereik
          op een grote touchwall (verticaal gecentreerd)
      ════════════════════════════════════════════ */}
      <div className="pointer-events-auto absolute right-0 top-1/2 z-20 -translate-y-1/2">
        <Link
          to="/crew"
          aria-label="Bekijk de bemanning en wetenschappelijke atlas"
          className="museum-glass flex flex-col items-center gap-3 rounded-l-2xl border-r-0 px-5 py-8 text-white/70 transition-all duration-200 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/25 active:scale-[0.97]"
        >
          <Users className="h-5 w-5 shrink-0" aria-hidden="true" />
          <span
            className="text-[10px] font-semibold uppercase tracking-[0.26em]"
            style={{ writingMode: "vertical-lr" }}
          >
            Crewpagina
          </span>
        </Link>
      </div>

      {/* ════════════════════════════════════════════
          HEADER — top-left corner
      ════════════════════════════════════════════ */}
      <header className="pointer-events-none absolute left-0 top-0 z-20 px-10 py-9 md:px-12 md:py-10">
        {/* Supertitle — route breadcrumb */}
        <p className="text-[10px] font-semibold uppercase tracking-[0.44em] text-white/55">
          Antwerpen  — Antarctica
        </p>
        {/* Main title — large, ultra-light, museum presence */}
        <h1
          className="mt-2 text-5xl font-thin uppercase leading-none tracking-[0.0em] md:text-7xl"
          style={{
            textShadow:
              "0 2px 20px rgba(0,0,0,0.90), 0 0 60px rgba(0,0,0,0.65), 0 1px 4px rgba(0,0,0,0.95)",
          }}
        >
          Belgica Expedition
        </h1>
        {/* Date — tertiary metadata */}
        <p className="mt-2 text-[11px] font-medium tracking-[0.32em] text-white/42">
          1897 — 1899
        </p>
      </header>

      {/* ════════════════════════════════════════════
          LEFT PANEL — Huidige passage
          (extreme left, vertically centered)
      ════════════════════════════════════════════ */}
      <aside className="pointer-events-none absolute left-8 top-1/2 z-20 hidden -translate-y-1/2 md:block lg:left-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPassage.label}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="museum-glass w-56 rounded-xl p-5 lg:w-64"
          >
            {/* Section label — smallest hierarchy tier */}
            <p className="text-[9px] font-semibold uppercase tracking-[0.40em] text-white/52">
              Huidige passage
            </p>
            {/* Passage title — prominent, ultra-light */}
            <p className="mt-3 text-xl font-extralight leading-snug tracking-wide text-white">
              {currentPassage.label}
            </p>
            {/* Sub-location — secondary contrast */}
            <p className="mt-0.5 text-sm font-medium text-white/68">
              {currentPassage.name}
            </p>

            {/* Gradient divider — softer than solid */}
            <div className="my-4 h-px w-full bg-gradient-to-r from-transparent via-white/18 to-transparent" />

            {/* Data rows — improved contrast */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 font-medium text-white/58">
                  <Thermometer className="h-3.5 w-3.5 text-red-400" />
                  Temperatuur
                </span>
                <span className="font-semibold text-white">{currentPassage.temperature}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 font-medium text-white/58">
                  <Wind className="h-3.5 w-3.5 text-sky-400" />
                  Windkracht
                </span>
                <span className="font-semibold text-white">{currentPassage.wind}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 font-medium text-white/58">
                  <Timer className="h-3.5 w-3.5 text-white/48" />
                  Reisduur
                </span>
                <span className="font-semibold text-white">{currentPassage.duration}</span>
              </div>
            </div>

            <div className="mt-4 border-t border-white/10 pt-3">
              <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-white/40">
                {currentPassage.date}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </aside>

      {/* ════════════════════════════════════════════
          RIGHT PANELS — multi-user hotspot details
          Up to 3 panels open simultaneously, spread
          right-to-left so each user has their own view.
      ════════════════════════════════════════════ */}

      {/* Single backdrop — clicking it closes ALL open panels */}
      <AnimatePresence>
        {activeStops.length > 0 && (
          <motion.div
            key="hotspot-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="pointer-events-auto absolute inset-0 z-[29] cursor-pointer bg-black/30"
            onClick={() => setActiveStops([])}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeStops.map((activeStop, idx) => (
          <motion.aside
            key={activeStop.id}
            initial={{ opacity: 0, x: 56 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 56 }}
            transition={{ type: "spring", stiffness: 160, damping: 28 }}
            className="museum-panel absolute top-1/2 z-30 flex max-h-[82vh] w-[320px] -translate-y-1/2 flex-col overflow-hidden rounded-xl"
            style={{ right: `${52 + idx * 336}px` }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header band */}
            <div className="flex-none border-b border-white/10 px-5 pt-5 pb-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.28em] ${
                    activeStop.era === "modern"
                      ? "border-sky-400/30 bg-sky-400/12 text-sky-300"
                      : "border-red-400/30 bg-red-400/12 text-red-300"
                  }`}>
                    <MapPin className="h-2.5 w-2.5" aria-hidden="true" />
                    {activeStop.label}
                  </span>
                  <h2 className="mt-2 text-2xl font-extralight uppercase leading-tight tracking-widest text-white">
                    {activeStop.name}
                  </h2>
                  <p className="mt-1 text-[11px] font-semibold tracking-[0.22em] text-white/52">{activeStop.date}</p>
                  {activeStop.era === "modern" && activeStop.foundedYear && (
                    <div className="mt-2 rounded-lg border border-sky-400/20 bg-sky-400/8 px-3 py-1.5">
                      <p className="text-[10px] font-medium leading-snug text-sky-300/80">
                        Moderne basis, opgericht in {activeStop.foundedYear}
                      </p>
                    </div>
                  )}
                </div>
                <button
                  aria-label="Sluit detailpaneel"
                  onClick={() => closePanel(activeStop.id)}
                  className="pointer-events-auto mt-0.5 flex h-10 w-10 flex-none items-center justify-center rounded-full border border-white/15 bg-white/8 text-white/55 transition duration-200 hover:border-white/30 hover:bg-white/15 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/25 active:scale-95"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
              <div className="grid grid-cols-3 gap-2">
                <DataCard icon={<Thermometer className="h-3 w-3" />} label="Temp"  value={activeStop.temperature} />
                <DataCard icon={<Wind className="h-3 w-3" />}        label="Wind"  value={activeStop.wind} />
                <DataCard icon={<Timer className="h-3 w-3" />}       label="Duur"  value={activeStop.duration} />
              </div>

              <p className="text-sm font-normal leading-7 text-white/75">{activeStop.note}</p>

              <div>
                <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.34em] text-white/52">
                  {activeStop.era === "modern" ? "Documentatie" : "Historische foto's"}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {activeStop.photos.map((photo, index) => (
                    <button
                      key={index}
                      onClick={() => setLightbox({ photos: activeStop.photos, index })}
                      className="pointer-events-auto group relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10 bg-white/5 transition duration-200 hover:border-white/30 hover:shadow-lg hover:shadow-black/45 focus:outline-none focus:ring-2 focus:ring-red-400/60 active:scale-[0.97]"
                    >
                      <img src={photo} alt="" className="absolute inset-0 h-full w-full object-cover object-center transition duration-300 group-hover:scale-105 group-hover:brightness-110" />
                      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition duration-200 group-hover:opacity-100" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-200 group-hover:opacity-100">
                        <ZoomIn className="h-6 w-6 text-white drop-shadow-md" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.34em] text-white/52">
                  {activeStop.era === "modern" ? "Wetenschappelijke feiten" : "Historische feiten"}
                </p>
                <div className="space-y-0">
                  {activeStop.facts.map((fact) => (
                    <div key={fact} className="flex gap-3 border-t border-white/8 py-2.5">
                      <ChevronRight className={`mt-0.5 h-4 w-4 shrink-0 ${activeStop.era === "modern" ? "text-sky-400" : "text-red-400"}`} />
                      <p className="text-sm font-normal leading-6 text-white/72">{fact}</p>
                    </div>
                  ))}
                </div>
              </div>

              {activeStop.accessibility.length > 0 && (
                <div>
                  <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.34em] text-white/52">Toegankelijkheid</p>
                  <div className="flex flex-wrap gap-2">
                    {activeStop.accessibility.map((tag) => {
                      const badges: Record<AccessibilityTag, { icon: React.ReactNode; label: string; cls: string }> = {
                        wheelchair:      { icon: <Accessibility className="h-3 w-3" />, label: "Rolstoel",       cls: "text-sky-300 border-sky-400/30 bg-sky-400/10" },
                        audio:           { icon: <Volume2 className="h-3 w-3" />,       label: "Audio",          cls: "text-amber-300 border-amber-400/30 bg-amber-400/10" },
                        "low-sensory":   { icon: <Eye className="h-3 w-3" />,            label: "Laag-sensorisch",cls: "text-emerald-300 border-emerald-400/30 bg-emerald-400/10" },
                        "sign-language": { icon: <Languages className="h-3 w-3" />,      label: "Gebarentaal",    cls: "text-violet-300 border-violet-400/30 bg-violet-400/10" },
                        braille:         { icon: <Fingerprint className="h-3 w-3" />,    label: "Braille",        cls: "text-pink-300 border-pink-400/30 bg-pink-400/10" },
                      };
                      const b = badges[tag];
                      return (
                        <span key={tag} className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] ${b.cls}`}>
                          {b.icon}{b.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.aside>
        ))}
      </AnimatePresence>

      {/* ════════════════════════════════════════════
          LIGHTBOX — foto-viewer met slider
      ════════════════════════════════════════════ */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            key="lightbox-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center bg-black/92 backdrop-blur-lg"
            onClick={() => setLightbox(null)}
          >
            {/* Foto + counter — heranimt per index-wissel */}
            <AnimatePresence mode="wait">
              <motion.div
                key={lightbox.index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="relative mx-24 flex cursor-default flex-col items-center"
                onClick={(e) => e.stopPropagation()}
                onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
                onTouchEnd={(e) => {
                  const diff = touchStartX.current - e.changedTouches[0].clientX;
                  if (Math.abs(diff) > 60) {
                    if (diff > 0 && lightbox.index < lightbox.photos.length - 1)
                      setLightbox({ ...lightbox, index: lightbox.index + 1 });
                    else if (diff < 0 && lightbox.index > 0)
                      setLightbox({ ...lightbox, index: lightbox.index - 1 });
                  }
                }}
              >
                <img
                  src={lightbox.photos[lightbox.index]}
                  alt=""
                  className="max-h-[82vh] max-w-full rounded-xl object-contain shadow-2xl"
                />
                <p className="mt-4 text-sm font-medium tracking-[0.18em] text-white/50">
                  {lightbox.index + 1} / {lightbox.photos.length}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Sluit */}
            <button
              aria-label="Sluit foto"
              onClick={() => setLightbox(null)}
              className="pointer-events-auto absolute right-8 top-8 flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/80 backdrop-blur-sm transition hover:bg-white/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/25 active:scale-95"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Vorige */}
            {lightbox.index > 0 && (
              <button
                aria-label="Vorige foto"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightbox({ ...lightbox, index: lightbox.index - 1 });
                }}
                className="pointer-events-auto absolute left-8 top-1/2 -translate-y-1/2 flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/80 backdrop-blur-sm transition hover:bg-white/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/25 active:scale-95"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
            )}

            {/* Volgende */}
            {lightbox.index < lightbox.photos.length - 1 && (
              <button
                aria-label="Volgende foto"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightbox({ ...lightbox, index: lightbox.index + 1 });
                }}
                className="pointer-events-auto absolute right-8 top-1/2 -translate-y-1/2 flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/80 backdrop-blur-sm transition hover:bg-white/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/25 active:scale-95"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════════════
          BOTTOM — unified tijdlijn 1897–2026
      ════════════════════════════════════════════ */}
      <footer className="pointer-events-none absolute inset-x-0 bottom-0 z-20">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />

        <div className="relative px-10 pb-8 pt-28 md:px-12">
          {/* Progress row */}
          <div className="mb-5 flex items-end justify-between gap-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.40em] text-white/52">
                Tijdlijn  1897 – 2026
              </p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentPassage.label}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="mt-1.5 text-[26px] font-extralight tracking-wide text-white"
                >
                  {currentPassage.label}
                </motion.p>
              </AnimatePresence>
            </div>
            <div className="flex items-center gap-3">
              {/* Era badge — auto-switches with the slider */}
              <span className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] transition duration-300 ${
                selectedEra === "modern"
                  ? "border-sky-400/40 bg-sky-400/12 text-sky-300"
                  : "border-red-400/40 bg-red-400/12 text-red-300"
              }`}>
                {selectedEra === "modern" ? "Modern" : "Historisch"}
              </span>
              <Waves className="h-4 w-4 text-blue-400/50" />
              {/* Show the actual year instead of a percentage */}
              <span className="text-3xl font-extralight tabular-nums text-white">
                {selectedEra === "modern"
                  ? Math.round(1957 + modernProgress * (2026 - 1957))
                  : Math.round(1897 + historicProgress * 2)}
              </span>
            </div>
          </div>

          {/* ── Unified slider — colour follows era ── */}
          <div className={`expedition-range-wrapper${selectedEra === "modern" ? " expedition-range-wrapper--modern" : ""}`}>
            <input
              aria-label="Tijdlijn 1897–2026"
              className={`expedition-range pointer-events-auto${selectedEra === "modern" ? " expedition-range--modern" : ""}`}
              min="0"
              max="100"
              type="range"
              value={Math.round(progress * 100)}
              style={{ "--progress": `${progress * 100}%` } as React.CSSProperties}
              onChange={(e) => {
                const v = Number(e.currentTarget.value) / 100;
                setProgress(v);
                // Close panels for stops that are now behind the slider position
                setActiveStops(prev => prev.filter(s => v + 0.015 >= stopToUnified(s)));
              }}
            />
          </div>

          {/* Year anchors — left = 1897, right = 2026, gap marker centred */}
          <div className="relative mt-2 h-5">
            <span className="absolute left-0 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/38">
              1897
            </span>
            <span
              className="absolute -translate-x-1/2 text-[10px] font-semibold tracking-[0.18em] text-white/22"
              style={{ left: `${HISTORIC_END * 100}%` }}
            >
              1899 · · 1957
            </span>
            <span className="absolute right-0 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/38">
              2026
            </span>
          </div>

          {/* Stop buttons — all 6 stops at their proportional positions */}
          <div className="relative mt-4 h-14">
            {expeditionStops.map((stop, i) => {
              const pos      = stopToUnified(stop);
              const reached  = progress + 0.015 >= pos;
              const isModern = stop.era === "modern";
              const isFirst  = i === 0;
              const isLast   = i === expeditionStops.length - 1;
              return (
                <button
                  key={stop.id}
                  onClick={() => handleHotspotClick(stop)}
                  className="pointer-events-auto absolute flex flex-col items-center gap-1 rounded-lg px-1.5 py-1 transition duration-200 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/20 active:scale-95"
                  style={{
                    left: `${pos * 100}%`,
                    transform: isFirst ? "translateX(0)" : isLast ? "translateX(-100%)" : "translateX(-50%)",
                  }}
                >
                  <MapPin
                    className="h-4 w-4 shrink-0 transition-colors duration-200"
                    style={{ color: reached ? (isModern ? "#38bdf8" : "#ef4444") : "rgba(255,255,255,0.22)" }}
                  />
                  <span
                    className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.20em] transition-colors duration-200"
                    style={{ color: reached ? "rgba(255,255,255,0.78)" : "rgba(255,255,255,0.26)" }}
                  >
                    {stop.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </footer>
    </main>
  );
}
