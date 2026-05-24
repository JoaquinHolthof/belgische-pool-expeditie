import { Html, Line, OrbitControls, Stars, useTexture } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { AnimatePresence, motion } from "framer-motion";
import {
  Accessibility, ChevronRight, Eye, Fingerprint,
  FlaskConical, Languages, MapPin, Thermometer, Timer,
  Users, Volume2, Waves, Wind, X,
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
type HotspotId = "antwerp" | "belgica" | "boudewijn" | "elisabeth";

type ExpeditionStop = {
  id: HotspotId;
  name: string;
  label: string;
  date: string;
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
  activeStop: ExpeditionStop | null;
  onHotspotClick: (stop: ExpeditionStop) => void;
};

type FootstepData = {
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
  isLeft: boolean;
};

// ─── Expeditiedata ────────────────────────────────────────────────────────────
const expeditionStops: ExpeditionStop[] = [
  {
    id: "antwerp",
    name: "Antwerpen",
    label: "Vertrekhaven",
    date: "16 aug 1897",
    lat: 51.2194, lon: 4.4025, progress: 0.04,
    temperature: "7°C", wind: "12 kn", duration: "0 weken",
    note: "De Belgica verlaat Antwerpen onder leiding van Adrien de Gerlache. Een bemanning van veertien man en zeven wetenschappers gaat de poolgeschiedenis in.",
    facts: [
      "Eerste Belgische wetenschappelijke poolexpeditie",
      "Route via Atlantische Oceaan naar het zuiden",
      "Roald Amundsen diende als eerste stuurman",
    ],
    photos: [imgAntwerpen1897, imgAntwerpenInca, imgAdrienGerlache, imgInspectie, imgBemanning, imgScheepsplan],
    accessibility: ["wheelchair", "audio", "low-sensory", "sign-language"],
  },
 {
    id: "belgica",
    name: "De Belgica Expeditie",
    label: "Fase 1: 1897 - 1899",
    date: "16 aug 1897",
    lat: -64.05, lon: -62.97, progress: 0.04, 
    temperature: "−43°C", wind: "68 kn", duration: "377 dagen",
    note: "De allereerste expeditie ooit die gedwongen overwintert in het Antarctische pakijs onder leiding van Adrien de Gerlache. De bemanning gaat hiermee de poolgeschiedenis in.",
    facts: [
      "Eerste overwintering ooit onder de Zuidpoolcirkel aan boord van de Belgica",
      "Roald Amundsen diende als eerste stuurman en Frederick Cook als arts",
      "Cruciale eerste meteorologische en magnetische observaties verzameld",
    ],
    photos: [imgAntwerpen1897, imgAdrienGerlache, imgBemanning, imgBelgica2, imgCook, imgAmundsen],
    accessibility: ["wheelchair", "audio", "low-sensory", "sign-language"],
  },
  {
    id: "boudewijn",
    name: "Basis Koning Boudewijn",
    label: "Fase 2: 1958 - 1967",
    date: "1 jan 1958",
    lat: -70.4, lon: 12.0, progress: 0.55,
    temperature: "−25°C", wind: "45 kn", duration: "9 jaar",
    note: "Opgericht door Gaston de Gerlache (zoon van) tijdens het Internationaal Geofysisch Jaar. Dit markeerde de terugkeer van België naar wetenschappelijk onderzoek op de Zuidpool.",
    facts: [
      "Gebouwd op het ijs van de Prinses Ragnhildkust",
      "Focus op atmosferisch onderzoek, meteorologie en glaciologie",
      "Logistiek ondersteund via cruciale tussenstops in de haven van Kaapstad",
    ],
    photos: [imgBelgica1, imgBelgica3, imgLecointe, imgInspectie, imgScheepsplan, imgKaart1],
    accessibility: ["wheelchair", "audio"],
  },
  {
    id: "elisabeth",
    name: "Princess Elisabeth Antarctica",
    label: "Fase 3: 2007 - Heden",
    date: "heden",
    lat: -71.9, lon: 35.0, progress: 0.985,
    temperature: "−35°C", wind: "38 kn", duration: "permanent",
    note: "Het Belgische Princess Elisabeth Antarctica Station is het eerste zero-emissie poolonderzoeksstation ter wereld. Het eert de nalatenschap van de vroege pioniers met hypermodern klimaatonderzoek.",
    facts: [
      "Eerste zero-emissie poolstation ter wereld, volledig op wind- en zonne-energie",
      "Opgericht door de International Polar Foundation onder leiding van Alain Hubert",
      "Moderne gateway voor internationale wetenschappers via de luchthaven van Kaapstad",
    ],
    photos: [imgExpoAntarctica, imgGerlache2, imgKaart2, imgHerinneringskrt, imgOostende, imgIsfjord],
    accessibility: ["wheelchair", "audio", "low-sensory", "sign-language", "braille"],
  },
];

const passages: Array<Passage & { from: number }> = [
  { from: 0,     label: "Vertrekhaven",       name: "Antwerpen",   date: "aug 1897", temperature: "7°C",   wind: "12 kn", duration: "Week 0" },
  { from: 0.22,  label: "Atlantische passage", name: "Zuidwaarts",  date: "sep 1897", temperature: "18°C",  wind: "28 kn", duration: "6 weken" },
  { from: 0.48,  label: "Bevoorrading",        name: "Kaapstad",    date: "okt 1897", temperature: "15°C",  wind: "24 kn", duration: "12 weken" },
  { from: 0.72,  label: "Zuidelijke Oceaan",   name: "Stormzone",   date: "dec 1897", temperature: "2°C",   wind: "54 kn", duration: "20 weken" },
  { from: 0.92,  label: "Pakijsgevangenschap", name: "Antarctica",  date: "feb 1898", temperature: "−43°C", wind: "68 kn", duration: "377 dagen" },
  { from: 0.965, label: "Antarctica Landfase", name: "Wandelroute", date: "1899",     temperature: "−38°C", wind: "42 kn", duration: "—" },
];

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

function makeArcPoints(stops: ExpeditionStop[]) {
  // Only render the historic sea route: Antwerpen → De Belgica Expeditie.
  // Koning Boudewijn (1958) and Princess Elisabeth (2007) are separate
  // historical milestones from different eras and are NOT connected by a line.
  const segments: [ExpeditionStop, ExpeditionStop][] = [
    [stops[0], stops[1]],
  ];
  return segments.flatMap(([start, end], si) =>
    Array.from({ length: 72 }, (_, i) => {
      const t = i / 71;
      const sv = latLonToVector3(start.lat, start.lon, 2.1).normalize();
      const ev = latLonToVector3(end.lat, end.lon, 2.1).normalize();
      const angle = sv.angleTo(ev);
      const sin = Math.sin(angle);
      const p = sv
        .clone()
        .multiplyScalar(Math.sin((1 - t) * angle) / sin)
        .add(ev.clone().multiplyScalar(Math.sin(t * angle) / sin))
        .normalize();
      const alt = 2.11 + Math.sin(t * Math.PI) * 0.18;
      return p.multiplyScalar(alt + si * 0.003);
    }),
  );
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

function getPassage(progress: number): Passage {
  return passages.reduce<Passage>(
    (cur, p) => (progress >= p.from ? p : cur),
    passages[0],
  );
}

// ─── Land phase constants ──────────────────────────────────────────────────────
const LAND_START = 0.965;
// Princess Elisabeth Station (Utsteinen, Koningin Maudland)
const STATION_LAT = -71.9, STATION_LON = 35.0;
// Local Antarctic traverse: from Basis Koning Boudewijn (1958, coast of
// Prinses Ragnhildkust) to Princess Elisabeth Station (2007, inland Utsteinen).
// Both sit on the Dronning Maud Land continental shelf — the footstep path
// therefore stays entirely on the Antarctic landmass and never crosses ocean.
const LANDING_LAT = -70.4, LANDING_LON = 12.0;
const NUM_FOOTSTEPS = 34;

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
function EarthGlobe({ progress, activeStop, onHotspotClick }: GlobeSceneProps) {
  const earthMap    = useTexture(EARTH_TEXTURE_URL);
  const groupRef    = useRef<THREE.Group>(null);
  const pathPoints  = useMemo(() => makeArcPoints(expeditionStops), []);

  // Individual halo refs per hotspot for independent pulsing (4: 3 sea + station)
  const haloRefs  = useRef<(THREE.Mesh | null)[]>([null, null, null, null]);
  const halo2Refs = useRef<(THREE.Mesh | null)[]>([null, null, null, null]);

  const earthMaterial = useMemo(() => {
    earthMap.colorSpace = THREE.SRGBColorSpace;
    return new THREE.ShaderMaterial({
      uniforms: { earthMap: { value: earthMap } },
      vertexShader: EARTH_VERT,
      fragmentShader: EARTH_FRAG,
    });
  }, [earthMap]);

  const atmosphereMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
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

  // Sea route fills 0 → boudewijnStop.progress so the Antwerp→Belgica arc is
  // complete before the dashed inter-era flight lines appear.
  const visiblePath = useMemo(() => {
    const capped = Math.min(progress / expeditionStops[2].progress, 1);
    const count  = Math.max(2, Math.ceil(pathPoints.length * capped));
    return pathPoints.slice(0, count);
  }, [pathPoints, progress]);

  // Stabiele referenties voor landfase (eenmalig berekend)

  const antPeakData = useMemo(() =>
    ANT_PEAKS.map(pk => ({
      pos:  latLonToVector3(pk.lat, pk.lon, 2.0),
      quat: new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        latLonToVector3(pk.lat, pk.lon, 1.0).normalize(),
      ),
      h: pk.h,
      r: pk.r,
    })), []);

  // 3D landmark data voor Princess Elisabeth Station
  const stationLandmarkData = useMemo(() => ({
    pos:  latLonToVector3(STATION_LAT, STATION_LON, 2.145),
    quat: new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      latLonToVector3(STATION_LAT, STATION_LON, 1).normalize(),
    ),
  }), []);

  // Dashed inter-era flight arcs between Antarctic milestones.
  // Different eras / locations — drawn as airline-style dashed great circles.
  const belgicaStop   = expeditionStops[1];
  const boudewijnStop = expeditionStops[2];
  const elisabethStop = expeditionStops[3];
  const belgicaToBoudewijn = useMemo(
    () => makeGreatCircle(belgicaStop.lat, belgicaStop.lon, boudewijnStop.lat, boudewijnStop.lon, 0.22),
    [],
  );
  const boudewijnToElisabeth = useMemo(
    () => makeGreatCircle(boudewijnStop.lat, boudewijnStop.lon, elisabethStop.lat, elisabethStop.lon, 0.06, 36),
    [],
  );

  useFrame(({ camera, clock }) => {
    // Globe rotation: when a hotspot is active, snap to its exact coordinates.
    // Otherwise follow the sea route, then pan from Boudewijn to Elisabeth.
    if (groupRef.current) {
      let focusVec: THREE.Vector3;
      const boudewijnV = latLonToVector3(boudewijnStop.lat, boudewijnStop.lon, 2.1).normalize();
      const elisabethV = latLonToVector3(elisabethStop.lat, elisabethStop.lon, 2.1).normalize();

      if (activeStop) {
        focusVec = latLonToVector3(activeStop.lat, activeStop.lon, 2.1).normalize();
      } else if (progress >= boudewijnStop.progress) {
        // Pan smoothly from Boudewijn → Elisabeth as timeline advances
        const t = THREE.MathUtils.clamp(
          (progress - boudewijnStop.progress) / (elisabethStop.progress - boudewijnStop.progress),
          0, 1,
        );
        focusVec = boudewijnV.clone().lerp(elisabethV, t).normalize();
      } else {
        const idx = Math.min(
          pathPoints.length - 1,
          Math.max(0, Math.floor((progress / boudewijnStop.progress) * (pathPoints.length - 1))),
        );
        focusVec = pathPoints[idx].clone().normalize();
      }
      const target = new THREE.Quaternion().setFromUnitVectors(focusVec, new THREE.Vector3(0, 0, 1));
      groupRef.current.quaternion.slerp(target, 0.085);
    }

    // Camera zoom: gentle along sea route, then zoom-in on Antarctica.
    // Zoom is capped at the depth reached at progress=0.8 — beyond that the
    // camera keeps rotating to follow hotspots but never zooms further in.
    let targetZ: number;
    if (progress < boudewijnStop.progress) {
      const t = progress / boudewijnStop.progress;
      targetZ = THREE.MathUtils.lerp(6.65, 5.6, 1 - Math.pow(1 - t, 2.25));
    } else {
      const zoomProgress = Math.min(progress, 0.8);
      const t = THREE.MathUtils.clamp(
        (zoomProgress - boudewijnStop.progress) / (1 - boudewijnStop.progress),
        0, 1,
      );
      targetZ = THREE.MathUtils.lerp(5.6, 2.9, 1 - Math.pow(1 - t, 1.8));
    }

    // Smoothly re-center X/Y so an active hotspot always appears screen-center.
    // OrbitControls can drift X/Y; lerping back to 0 counteracts that.
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, 0, 0.06);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0, 0.06);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.075);
    camera.lookAt(0, 0, 0);

    // Pulsing halo rings — ripple effect, staggered per hotspot
    const t = clock.elapsedTime;
    haloRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const phase = t * 2.4 + i * 1.1;
      const s = 1 + Math.sin(phase) * 0.32;
      mesh.scale.setScalar(s);
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.18 + Math.sin(phase) * 0.10;
    });
    halo2Refs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const phase = t * 2.4 + i * 1.1 + Math.PI; // opposite phase
      const s = 1 + Math.sin(phase) * 0.28;
      mesh.scale.setScalar(s);
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.08 + Math.sin(phase) * 0.06;
    });
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 3, 4]} intensity={2.2} color="#fff8f0" />
      <pointLight position={[-4, -2, 3]} intensity={2.8} color="#2255ff" />

      {/* Stars */}
      <Stars radius={100} depth={40} count={2200} factor={3.5} fade speed={0.14} />

      {/* Atmosphere glow (outside the group so it doesn't rotate) */}
      <mesh>
        <sphereGeometry args={[2.18, 64, 64]} />
        <primitive object={atmosphereMaterial} attach="material" />
      </mesh>

      {/* Earth group (rotates to follow route) */}
      <group ref={groupRef}>
        {/* Globe */}
        <mesh>
          <sphereGeometry args={[2, 128, 128]} />
          <primitive object={earthMaterial} attach="material" />
        </mesh>

        {/* Sea route: Antwerpen → De Belgica Expeditie (solid red) */}
        {visiblePath.length >= 2 && (
          <>
            <Line points={visiblePath} color="#ef4444" lineWidth={3.5} transparent opacity={0.92} />
            <Line points={visiblePath} color="#ff8080" lineWidth={10} transparent opacity={0.22} />
          </>
        )}

        {/* Inter-era flight arcs (dashed) — appear when timeline reaches them */}
        {progress + 0.035 >= boudewijnStop.progress && (
          <Line
            points={belgicaToBoudewijn}
            color="#fca5a5"
            lineWidth={2}
            transparent
            opacity={0.78}
            dashed
            dashSize={0.08}
            gapSize={0.06}
          />
        )}
        {progress + 0.035 >= elisabethStop.progress && (
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

        {/* Hotspot markers */}
        {(() => {
          // Determine which single label to show:
          // 1. If a hotspot is clicked → show that stop's label.
          // 2. Otherwise → show the label of the highest-progress stop that
          //    the slider has reached (i.e. the "current" stop on the timeline).
          // Never more than one label in the DOM at a time.
          const timelineStop = expeditionStops.reduce<ExpeditionStop | null>(
            (best, s) =>
              progress + 0.035 >= s.progress && (!best || s.progress > best.progress)
                ? s : best,
            null,
          );
          const labelStopId = activeStop ? activeStop.id : (timelineStop?.id ?? null);

          return expeditionStops.map((stop, i) => {
            const available = progress + 0.035 >= stop.progress;
            const active    = activeStop?.id === stop.id;
            const pos       = latLonToVector3(stop.lat, stop.lon, 2.28);
            const isStation = stop.id === "elisabeth";
            const coreColor = isStation ? (active ? "#7dd3fc" : "#38bdf8") : (active ? "#ff8080" : "#ef4444");
            const haloColor = isStation ? "#38bdf8" : "#ef4444";
            const showLabel = available && stop.id === labelStopId;

            const labelOffset: Record<HotspotId, [number, number, number]> = {
              antwerp:   [0,  0.30, 0],
              belgica:   [0,  0.30, 0],
              boudewijn: [0,  0.38, 0],
              elisabeth: [0, -0.30, 0],
            };

            return (
              <group key={stop.id} position={pos} visible={available} onClick={() => onHotspotClick(stop)}>
                {/* Outer ripple halo */}
                <mesh ref={(el) => { halo2Refs.current[i] = el; }}>
                  <sphereGeometry args={[0.22, 32, 32]} />
                  <meshBasicMaterial color={haloColor} transparent opacity={0.10} />
                </mesh>
                {/* Inner ripple halo */}
                <mesh ref={(el) => { haloRefs.current[i] = el; }}>
                  <sphereGeometry args={[0.155, 32, 32]} />
                  <meshBasicMaterial color={haloColor} transparent opacity={0.20} />
                </mesh>
                {/* Core dot */}
                <mesh>
                  <sphereGeometry args={[active ? 0.075 : 0.062, 32, 32]} />
                  <meshBasicMaterial color={coreColor} />
                </mesh>
                {/* Label — always in DOM when available; opacity-transition hides inactive ones */}
                {available && (
                  <Html center position={labelOffset[stop.id]} className="pointer-events-none select-none">
                    <div
                      className="rounded-md border border-white/20 bg-black/60 px-3 py-1 backdrop-blur-sm"
                      style={{
                        whiteSpace: "nowrap",
                        textAlign: "center",
                        opacity: showLabel ? 1 : 0,
                        transition: "opacity 0.35s ease",
                      }}
                    >
                      <span className="text-xs font-semibold uppercase tracking-wider text-white">
                        {stop.name}
                      </span>
                    </div>
                  </Html>
                )}
              </group>
            );
          });
        })()}

        {/* ── Antarctische bergtoppen — fade in vanaf progress 0.88 ── */}
        {antPeakData.map((pk, i) => {
          const opacity = THREE.MathUtils.clamp((progress - 0.88) * 10, 0, 1);
          return (
            <group key={`peak-${i}`} position={pk.pos} quaternion={pk.quat}>
              {/* Donkere rotsbasis */}
              <mesh>
                <coneGeometry args={[pk.r * 1.15, pk.h * 0.55, 6]} />
                <meshBasicMaterial color="#6b8ca8" transparent opacity={opacity * 0.52} />
              </mesh>
              {/* IJssneeuw-toplaag (hogere, smalle kegel) */}
              <mesh position={[0, pk.h * 0.22, 0]}>
                <coneGeometry args={[pk.r * 0.62, pk.h * 0.55, 5]} />
                <meshBasicMaterial color="#deeef8" transparent opacity={opacity * 0.72} />
              </mesh>
              {/* Glanzende piek (scherpe punt) */}
              <mesh position={[0, pk.h * 0.58, 0]}>
                <coneGeometry args={[pk.r * 0.22, pk.h * 0.30, 4]} />
                <meshBasicMaterial color="#f0f8ff" transparent opacity={opacity * 0.85} />
              </mesh>
            </group>
          );
        })}

        {/* ── Princess Elisabeth Station 3D landmark ── */}
        {(() => {
          const opacity = THREE.MathUtils.clamp((progress - LAND_START) * 10, 0, 1);
          if (opacity <= 0) return null;
          return (
            <group
              key="pe-station"
              position={stationLandmarkData.pos}
              quaternion={stationLandmarkData.quat}
            >
              {/* Vier stalen pijlers */}
              {([-0.022, -0.007, 0.007, 0.022] as const).map((x, i) => (
                <mesh key={i} position={[x, 0.011, 0]}>
                  <cylinderGeometry args={[0.0028, 0.0035, 0.022, 6]} />
                  <meshBasicMaterial color="#94a3b8" transparent opacity={opacity * 0.88} />
                </mesh>
              ))}
              {/* Hoofdgebouw — aerodynamisch langwerpig (oost-west georiënteerd) */}
              <mesh position={[0, 0.024, 0]}>
                <boxGeometry args={[0.068, 0.013, 0.028]} />
                <meshBasicMaterial color="#7dd3fc" transparent opacity={opacity * 0.78} />
              </mesh>
              {/* Zonnepanelen-dak licht hellend (zonoptimalisatie) */}
              <mesh position={[0, 0.033, 0.004]} rotation={[0.30, 0, 0]}>
                <boxGeometry args={[0.065, 0.003, 0.034]} />
                <meshBasicMaterial color="#bae6fd" transparent opacity={opacity * 0.65} />
              </mesh>
              {/* Windturbines (twee kleine cylinders) */}
              {([-0.025, 0.025] as const).map((x, i) => (
                <mesh key={i} position={[x, 0.046, 0]}>
                  <cylinderGeometry args={[0.0018, 0.0018, 0.020, 8]} />
                  <meshBasicMaterial color="#e2e8f0" transparent opacity={opacity * 0.75} />
                </mesh>
              ))}
              {/* Gloeiend beacon (ijs-blauw) */}
              <mesh position={[0, 0.052, 0]}>
                <sphereGeometry args={[0.010, 16, 16]} />
                <meshBasicMaterial color="#38bdf8" transparent opacity={opacity * 0.70} />
              </mesh>
              {/* Buitenste halo-ring */}
              <mesh position={[0, 0.052, 0]}>
                <sphereGeometry args={[0.018, 16, 16]} />
                <meshBasicMaterial color="#7dd3fc" transparent opacity={opacity * 0.22} />
              </mesh>
            </group>
          );
        })()}

        {/* Footstep walking path removed — all milestones are now connected
            by dashed sea/flight arcs (ships in 1897, aircraft from 1958). */}
      </group>

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        rotateSpeed={0.22}
        minPolarAngle={0.95}
        maxPolarAngle={2.1}
      />
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
  const [progress, setProgress]     = useState(0);
  const [activeStop, setActiveStop] = useState<ExpeditionStop | null>(null);
  const currentPassage              = getPassage(progress);

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
              activeStop={activeStop}
              onHotspotClick={setActiveStop}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* ════════════════════════════════════════════
          CREW ATLAS LINK — top-right corner
      ════════════════════════════════════════════ */}
      <div className="pointer-events-auto absolute right-8 top-8 z-20 lg:right-10">
        <Link
          to="/crew"
          aria-label="Bekijk de bemanning en wetenschappelijke atlas"
          className="flex h-11 items-center gap-2.5 rounded-full border border-white/15 bg-black/38 px-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/62 backdrop-blur-sm transition-all duration-200 hover:border-white/28 hover:bg-white/12 hover:text-white/90 focus:outline-none focus:ring-2 focus:ring-white/25 active:scale-95"
        >
          <Users className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Crew & Science Atlas</span>
          <span className="sm:hidden">Atlas</span>
        </Link>
      </div>

      {/* ════════════════════════════════════════════
          HEADER — top-left corner
      ════════════════════════════════════════════ */}
      <header className="pointer-events-none absolute left-0 top-0 z-20 px-10 py-9 md:px-12 md:py-10">
        {/* Supertitle — route breadcrumb */}
        <p className="text-[10px] font-semibold uppercase tracking-[0.44em] text-white/55">
          Antwerpen — Kaapstad — Antarctica
        </p>
        {/* Main title — large, ultra-light, museum presence */}
        <h1 className="mt-2 text-5xl font-thin uppercase leading-none tracking-[0.0em] md:text-7xl">
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
          RIGHT PANEL — hotspot detail
          (slides in from extreme right)
      ════════════════════════════════════════════ */}
      <AnimatePresence mode="wait">
        {activeStop && (
          <motion.aside
            key={activeStop.id}
            initial={{ opacity: 0, x: 56 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 56 }}
            transition={{ type: "spring", stiffness: 140, damping: 26 }}
            className="museum-panel absolute right-8 top-1/2 z-30 flex max-h-[82vh] w-[min(340px,calc(100vw-4rem))] -translate-y-1/2 flex-col overflow-hidden rounded-xl lg:right-10 lg:w-[360px]"
          >
            {/* Header band */}
            <div className="flex-none border-b border-white/10 px-6 pt-6 pb-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  {/* Label pill — colored badge, not plain text */}
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-red-400/30 bg-red-400/12 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.28em] text-red-300">
                    <MapPin className="h-2.5 w-2.5" aria-hidden="true" />
                    {activeStop.label}
                  </span>
                  {/* Location name — larger, museum-weight */}
                  <h2 className="mt-2.5 text-3xl font-extralight uppercase leading-tight tracking-widest text-white">
                    {activeStop.name}
                  </h2>
                  <p className="mt-1 text-[11px] font-semibold tracking-[0.22em] text-white/52">{activeStop.date}</p>
                </div>
                {/* Close button — min 44×44px touch target */}
                <button
                  aria-label="Sluit detailpaneel"
                  onClick={() => setActiveStop(null)}
                  className="pointer-events-auto mt-0.5 flex h-11 w-11 flex-none items-center justify-center rounded-full border border-white/15 bg-white/8 text-white/55 transition duration-200 hover:border-white/30 hover:bg-white/15 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/25 active:scale-95"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

              {/* Data snapshots */}
              <div className="grid grid-cols-3 gap-2">
                <DataCard
                  icon={<Thermometer className="h-3 w-3" />}
                  label="Temp"
                  value={activeStop.temperature}
                />
                <DataCard
                  icon={<Wind className="h-3 w-3" />}
                  label="Wind"
                  value={activeStop.wind}
                />
                <DataCard
                  icon={<Timer className="h-3 w-3" />}
                  label="Duur"
                  value={activeStop.duration}
                />
              </div>

              {/* Toelichting — WCAG AA contrast: text-white/75 ≈ 6.2:1 on dark bg */}
              <p className="text-sm font-normal leading-7 text-white/75">
                {activeStop.note}
              </p>

              {/* Foto-galerij */}
              <div>
                <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.34em] text-white/52">
                  Historische foto's
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {activeStop.photos.map((photo, index) => (
                    <button
                      key={index}
                      className="pointer-events-auto group relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10 bg-white/5 transition duration-200 hover:border-white/30 hover:shadow-lg hover:shadow-black/45 focus:outline-none focus:ring-2 focus:ring-red-400/60 active:scale-[0.97]"
                    >
                      <img
                        src={photo}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover object-center transition duration-300 group-hover:scale-105 group-hover:brightness-110"
                      />
                      {/* Hover overlay — depth cue */}
                      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition duration-200 group-hover:opacity-100" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Feiten */}
              <div>
                <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.34em] text-white/52">
                  Historische feiten
                </p>
                <div className="space-y-0">
                  {activeStop.facts.map((fact) => (
                    <div key={fact} className="flex gap-3 border-t border-white/8 py-2.5">
                      <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                      <p className="text-sm font-normal leading-6 text-white/72">{fact}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Toegankelijkheidsbadges ── */}
              {activeStop.accessibility.length > 0 && (
                <div>
                  <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.34em] text-white/52">
                    Toegankelijkheid
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {activeStop.accessibility.map((tag) => {
                      const badges: Record<AccessibilityTag, { icon: React.ReactNode; label: string; cls: string }> = {
                        wheelchair:       { icon: <Accessibility className="h-3 w-3" />, label: "Rolstoel",     cls: "text-sky-300 border-sky-400/30 bg-sky-400/10" },
                        audio:            { icon: <Volume2 className="h-3 w-3" />,       label: "Audio",        cls: "text-amber-300 border-amber-400/30 bg-amber-400/10" },
                        "low-sensory":    { icon: <Eye className="h-3 w-3" />,            label: "Laag-sensorisch", cls: "text-emerald-300 border-emerald-400/30 bg-emerald-400/10" },
                        "sign-language":  { icon: <Languages className="h-3 w-3" />,      label: "Gebarentaal", cls: "text-violet-300 border-violet-400/30 bg-violet-400/10" },
                        braille:          { icon: <Fingerprint className="h-3 w-3" />,    label: "Braille",     cls: "text-pink-300 border-pink-400/30 bg-pink-400/10" },
                      };
                      const b = badges[tag];
                      return (
                        <span
                          key={tag}
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] ${b.cls}`}
                        >
                          {b.icon}
                          {b.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════════════
          BOTTOM — tijdlijn, full 21:9 width
      ════════════════════════════════════════════ */}
      <footer className="pointer-events-none absolute inset-x-0 bottom-0 z-20">
        {/* Gradient fade from bottom */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />

        <div className="relative px-10 pb-8 pt-28 md:px-12">
          {/* Progress row */}
          <div className="mb-5 flex items-end justify-between gap-6">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.40em] text-white/52">
                Tijdlijn route
              </p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentPassage.label}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="mt-1.5 text-[22px] font-extralight tracking-wide text-white"
                >
                  {currentPassage.label}
                </motion.p>
              </AnimatePresence>
            </div>
            <div className="flex items-center gap-3">
              <Waves className="h-4 w-4 text-blue-400/50" />
              <span className="text-3xl font-extralight tabular-nums text-white">
                {Math.round(progress * 100)}
                <span className="text-lg font-light text-white/45">%</span>
              </span>
            </div>
          </div>

          {/* ── Slider ── */}
          <input
            aria-label="Expeditie tijdlijn"
            className="expedition-range pointer-events-auto"
            min="0"
            max="100"
            type="range"
            value={Math.round(progress * 100)}
            style={{ "--progress": `${progress * 100}%` } as React.CSSProperties}
            onChange={(e) => {
              const v = Number(e.currentTarget.value) / 100;
              setProgress(v);
              if (activeStop && v + 0.035 < activeStop.progress) setActiveStop(null);
            }}
          />

          {/* Timeline date labels */}
          <div className="mt-2 flex justify-between">
            {passages.map((p) => (
              <span
                key={p.from}
                className="text-[8px] font-semibold uppercase tracking-[0.22em] text-white/38"
              >
                {p.date}
              </span>
            ))}
          </div>

          {/* Stop buttons — min 44px touch target each */}
          <div className="mt-4 flex justify-between">
            {expeditionStops.map((stop) => {
              const reached = progress + 0.035 >= stop.progress;
              return (
                <button
                  key={stop.id}
                  onClick={() => {
                    setProgress(stop.progress);
                    setActiveStop(stop);
                  }}
                  className="pointer-events-auto group flex min-h-[44px] flex-col items-center justify-center gap-1.5 rounded-lg px-2 py-1 transition duration-200 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/20 active:scale-95"
                >
                  <MapPin
                    className="h-4 w-4 transition-colors duration-200"
                    style={{ color: reached ? "#ef4444" : "rgba(255,255,255,0.22)" }}
                  />
                  <span
                    className="text-[9px] font-semibold uppercase tracking-[0.24em] transition-colors duration-200"
                    style={{
                      color: reached ? "rgba(255,255,255,0.82)" : "rgba(255,255,255,0.30)",
                    }}
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
