import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Award,
  Anchor,
  Thermometer,
  TrendingDown,
  Users,
  Wind,
  Star,
  Skull,
} from "lucide-react";
import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────
type RoleType = "command" | "science" | "crew";
type FilterId = "all" | RoleType | "deceased";
type TabId = "crew" | "science" | "discoveries";

type CrewMember = {
  name: string;
  role: string;
  nationality: string;
  roleType: RoleType;
  bio: string;
  achievement: string;
  initials: string;
  deceased?: boolean;
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const crewMembers: CrewMember[] = [
  {
    name: "Adrien de Gerlache",
    role: "Commandant",
    nationality: "België",
    roleType: "command",
    initials: "AG",
    bio: "Visionair ontdekkingsreiziger die de expeditie organiseerde en financierde uit eigen middelen. Leidde de eerste Belgische poolexpeditie ooit naar de onbekende zuidelijke zeeën.",
    achievement: "Organisator van de eerste geplande overwintering in Antarctica",
  },
  {
    name: "Georges Lecointe",
    role: "Kapitein & Navigator",
    nationality: "België",
    roleType: "command",
    initials: "GL",
    bio: "Expert-navigator en astronoom die de Belgica door de gevaarlijke zuidelijke wateren loodste. Zijn nauwkeurige astronomische observaties legden de basis voor Antarctische cartografie.",
    achievement: "Nauwkeurige astronomische kartering van de Bellingshausenzee",
  },
  {
    name: "Roald Amundsen",
    role: "Eerste Stuurman",
    nationality: "Noorwegen",
    roleType: "command",
    initials: "RA",
    bio: "De briljante jonge Noorse zeeman leerde onschatbare pooloverlevingslessen aan boord van de Belgica. Veertien jaar later bereikte hij als eerste mens ooit de Zuidpool.",
    achievement: "Leerde cruciale pooloverlevingstechnieken die hem naar de Zuidpool brachten",
  },
  {
    name: "Frederick Cook",
    role: "Scheepsarts",
    nationality: "VS",
    roleType: "science",
    initials: "FC",
    bio: "Innovatieve arts die de bemanning redde van ernstige poolziekte door dagelijkse blootstelling aan vuurlicht en creatieve voedingstherapie met rauw pinguïnvlees.",
    achievement: "Beschreef en behandelde de eerste gedocumenteerde gevallen van Antarctische poolziekte",
  },
  {
    name: "Henryk Arctowski",
    role: "Oceanograaf & Meteoroloog",
    nationality: "Polen",
    roleType: "science",
    initials: "HA",
    bio: "Gepassioneerd wetenschapper die gedurende de volledige overwintering dagelijks metingen uitvoerde. Zijn data vormden de eerste systematische wetenschappelijke registratie van de Antarctische winter.",
    achievement: "Eerste uitgebreide wetenschappelijke dataset van de Antarctische winter",
  },
  {
    name: "Emil Racoviță",
    role: "Bioloog",
    nationality: "Roemenië",
    roleType: "science",
    initials: "ER",
    bio: "Catalogiseerde honderden nieuwe dier- en plantensoorten in de Antarctische wateren. Zijn werk legde de basis voor de moderne Antarctische biologie en speleo-biologie.",
    achievement: "Beschreef als eerste de rijkdom van het Antarctische mariene ecosysteem",
  },
  {
    name: "Antoine Dobrowolski",
    role: "Meteoroloog",
    nationality: "Polen",
    roleType: "science",
    initials: "AD",
    bio: "Rigoureus meteoroloog die Arctowski assisteerde bij de dagelijkse metingen. Zijn gedetailleerde weerlogboeken bleven decennialang de standaardreferentie voor Antarctisch klimaatonderzoek.",
    achievement: "Mede-auteur van de standaardwerken over Antarctische meteorologie",
  },
  {
    name: "Émile Danco",
    role: "Geofysicus",
    nationality: "België",
    roleType: "science",
    initials: "ED",
    deceased: true,
    bio: "Registreerde magnetische observaties met zeldzame toewijding totdat zijn gezondheid bezweek. Overleed op 5 juni 1898 tijdens de poolnacht — de eerste wetenschapper die in Antarctica stierf.",
    achievement: "Zijn opofferingsgezinde werk en dood bond de bemanning samen in de donkerste periode",
  },
  {
    name: "Louis Michotte",
    role: "Hoofdmachinist",
    nationality: "België",
    roleType: "crew",
    initials: "LM",
    bio: "Hield de motoren operationeel in extreme vrieskou. Ontwierp mee de techniek — het zagen van sleuven in het pakijs — waarmee de Belgica na maanden gevangenschap kon ontsnappen.",
    achievement: "Creatieve engineering maakte de bevrijding uit het pakijs uiteindelijk mogelijk",
  },
];

const voyageData = [
  { label: "Antwerpen", date: "aug '97", temp: 7, wind: 12 },
  { label: "Atlantisch", date: "sep '97", temp: 18, wind: 28 },
  { label: "Kaapstad", date: "okt '97", temp: 15, wind: 24 },
  { label: "Kaap Hoorn", date: "nov '97", temp: 6, wind: 40 },
  { label: "Z. Oceaan", date: "dec '97", temp: 2, wind: 54 },
  { label: "Poolcirkel", date: "jan '98", temp: -8, wind: 62 },
  { label: "Pakijsgevangenschap", date: "feb '98", temp: -22, wind: 68 },
  { label: "Poolnacht", date: "jun '98", temp: -43, wind: 45 },
  { label: "Bevrijding", date: "jan '99", temp: -28, wind: 38 },
  { label: "Thuishaven", date: "mrt '99", temp: 8, wind: 22 },
];

const discoveries = [
  {
    date: "feb 1898",
    title: "Eerste overwintering in Antarctica",
    description:
      "De Belgica was het allereerste schip dat gedwongen overwinterde onder de Zuidpoolcirkel, waardoor een volledig jaar aan unieke wetenschappelijke data kon worden verzameld.",
    significance: "Historische primeur",
  },
  {
    date: "1897 — 1899",
    title: "Eerste systematische Antarctische weerkunde",
    description:
      "Arctowski en Dobrowolski registreerden als eersten een volledige Antarctische winter in cijfers: luchtdruk, temperatuur, wind, neerslag en bewolking — elke zes uur.",
    significance: "Wetenschappelijke primeur",
  },
  {
    date: "1898",
    title: "Ontdekking van poolziekte en lichttherapie",
    description:
      "Dr. Frederick Cook identificeerde de poolziekte als een combinatie van vitaminetekort, depressie en lichtgebrek. Zijn vuurlichttherapie redde levens en leidde de moderne poolgeneeskunde in.",
    significance: "Medische primeur",
  },
  {
    date: "1897 — 1898",
    title: "Catalogisering van Antarctisch marien leven",
    description:
      "Emil Racoviță beschreef honderden nieuwe soorten krill, vissen, zeewier en ongewervelden. Zijn werk legde de basis voor de moderne Antarctische biologie.",
    significance: "Biologische primeur",
  },
  {
    date: "1899",
    title: "Packetijs-navigatie en bevrijdingstechniek",
    description:
      "De techniek van het systematisch zagen van sleuven in het pakijs om een schip te bevrijden werd hier voor het eerst ontwikkeld en gedocumenteerd — en later wereldwijd toegepast.",
    significance: "Nautische primeur",
  },
  {
    date: "1897 — 1899",
    title: "Magnetische kartering van de zuidpoolregio",
    description:
      "Lecointe en Danco voerden uitgebreide magnetische metingen uit die de positie van de magnetische zuidpool verfijnden en het begrip van het aardmagnetisch veld verbeterden.",
    significance: "Geofysische primeur",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const roleConfig: Record<RoleType, { color: string; bg: string; label: string }> = {
  command: {
    color: "text-blue-300",
    bg: "bg-blue-500/15 border-blue-400/25",
    label: "Commando",
  },
  science: {
    color: "text-teal-300",
    bg: "bg-teal-500/15 border-teal-400/25",
    label: "Wetenschap",
  },
  crew: {
    color: "text-slate-300",
    bg: "bg-slate-500/15 border-slate-400/25",
    label: "Bemanning",
  },
};

const avatarGradient: Record<RoleType, string> = {
  command:
    "linear-gradient(135deg, oklch(0.38 0.12 250), oklch(0.22 0.08 255))",
  science:
    "linear-gradient(135deg, oklch(0.42 0.12 185), oklch(0.24 0.08 192))",
  crew: "linear-gradient(135deg, oklch(0.34 0.04 248), oklch(0.20 0.03 250))",
};

// ─── Filter bar config ────────────────────────────────────────────────────────
type FilterOption = {
  id: FilterId;
  label: string;
  dot: string | null;
  icon: React.ReactNode | null;
  inactiveCls: string;
  activeCls: string;
  activeGlow: string;
};

const crewFilterOptions: FilterOption[] = [
  {
    id: "all",
    label: "Alles",
    dot: "rgba(255,255,255,0.45)",
    icon: null,
    inactiveCls: "border-white/12 bg-white/5 text-white/50",
    activeCls:   "border-white/30 bg-white/12 text-white/90",
    activeGlow:  "0 0 0 1.5px rgba(255,255,255,0.22), 0 0 16px rgba(255,255,255,0.10)",
  },
  {
    id: "command",
    label: "Commando",
    dot: "rgb(147,197,253)",
    icon: null,
    inactiveCls: "border-blue-400/18 bg-blue-500/8 text-blue-300/60",
    activeCls:   "border-blue-400/50 bg-blue-500/22 text-blue-200",
    activeGlow:  "0 0 0 1.5px rgba(96,165,250,0.45), 0 0 16px rgba(96,165,250,0.22)",
  },
  {
    id: "science",
    label: "Wetenschap",
    dot: "rgb(94,234,212)",
    icon: null,
    inactiveCls: "border-teal-400/18 bg-teal-500/8 text-teal-300/60",
    activeCls:   "border-teal-400/50 bg-teal-500/22 text-teal-200",
    activeGlow:  "0 0 0 1.5px rgba(45,212,191,0.45), 0 0 16px rgba(45,212,191,0.22)",
  },
  {
    id: "crew",
    label: "Bemanning",
    dot: "rgb(203,213,225)",
    icon: null,
    inactiveCls: "border-slate-400/18 bg-slate-500/8 text-slate-300/60",
    activeCls:   "border-slate-400/45 bg-slate-500/20 text-slate-200",
    activeGlow:  "0 0 0 1.5px rgba(148,163,184,0.40), 0 0 16px rgba(148,163,184,0.18)",
  },
  {
    id: "deceased",
    label: "Overleden",
    dot: null,
    icon: <Skull className="h-3 w-3" aria-hidden="true" />,
    inactiveCls: "border-red-400/20 bg-red-400/6 text-red-400/55",
    activeCls:   "border-red-400/50 bg-red-400/16 text-red-300",
    activeGlow:  "0 0 0 1.5px rgba(239,68,68,0.45), 0 0 16px rgba(239,68,68,0.22)",
  },
];

// ─── Custom tooltip for Recharts ──────────────────────────────────────────────
function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg border border-white/15 px-4 py-3 text-sm"
      style={{
        background: "oklch(0.08 0.02 248 / 92%)",
        backdropFilter: "blur(16px)",
      }}
    >
      <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.24em] text-white/40">
        {label}
      </p>
      {payload.map((entry) => (
        <p key={entry.name} className="font-medium" style={{ color: entry.color }}>
          {entry.name === "temp" ? "Temperatuur" : "Windkracht"}
          {": "}
          <span className="text-white">
            {entry.name === "temp" ? `${entry.value}°C` : `${entry.value} kn`}
          </span>
        </p>
      ))}
    </div>
  );
}

// ─── Crew card ────────────────────────────────────────────────────────────────
function CrewCard({ member, index }: { member: CrewMember; index: number }) {
  const config = roleConfig[member.roleType];

  return (
    <motion.article
      layout
      layoutId={member.name}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.18, ease: "easeIn" } }}
      transition={{ duration: 0.5, delay: index * 0.055, ease: [0.22, 1, 0.36, 1] }}
      className="museum-glass flex flex-col gap-4 rounded-xl p-5 focus-within:ring-2 focus-within:ring-white/20"
    >
      {/* Avatar + name row */}
      <div className="flex items-start gap-3.5">
        {/* Initials avatar */}
        <div
          aria-hidden="true"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold tracking-wide text-white/90"
          style={{ background: avatarGradient[member.roleType] }}
        >
          {member.initials}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-medium leading-tight text-white">
              {member.name}
            </h3>
            {member.deceased && (
              <span
                title="Overleed tijdens de expeditie"
                className="flex items-center gap-1 text-[10px] font-medium text-red-400/70"
              >
                <Skull className="h-2.5 w-2.5" aria-hidden="true" />
                <span className="sr-only">Overleed tijdens de expeditie</span>
              </span>
            )}
          </div>
          <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.18em] text-white/45">
            {member.role}
          </p>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] ${config.bg} ${config.color}`}
        >
          {config.label}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/5 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-white/50">
          {member.nationality}
        </span>
      </div>

      {/* Bio */}
      <p className="flex-1 text-[13px] leading-[1.65] text-white/55">{member.bio}</p>

      {/* Achievement */}
      <div className="flex gap-2.5 border-t border-white/8 pt-3.5">
        <Star
          className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400/70"
          aria-hidden="true"
        />
        <p className="text-[12px] font-medium leading-[1.5] text-white/70">
          {member.achievement}
        </p>
      </div>
    </motion.article>
  );
}

// ─── Discovery item ───────────────────────────────────────────────────────────
function DiscoveryItem({
  item,
  index,
}: {
  item: (typeof discoveries)[0];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex gap-5"
    >
      {/* Timeline line */}
      {index < discoveries.length - 1 && (
        <div
          className="absolute left-[9px] top-7 bottom-0 w-px bg-white/8"
          aria-hidden="true"
        />
      )}

      {/* Dot */}
      <div
        className="relative z-10 mt-1 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border border-red-400/40 bg-red-400/12"
        aria-hidden="true"
      >
        <div className="h-1.5 w-1.5 rounded-full bg-red-400" />
      </div>

      {/* Content */}
      <div className="museum-glass mb-5 flex-1 rounded-xl p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-red-400/70">
            {item.date}
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.18em] text-white/40">
            {item.significance}
          </span>
        </div>
        <h3 className="mb-2.5 text-base font-medium leading-snug text-white">
          {item.title}
        </h3>
        <p className="text-[13px] leading-[1.65] text-white/55">{item.description}</p>
      </div>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function CrewAtlas() {
  const [activeTab, setActiveTab]       = useState<TabId>("crew");
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");

  const filteredCrew = crewMembers.filter((m) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "deceased") return m.deceased === true;
    return m.roleType === activeFilter;
  });

  const filterCount = (id: FilterId) => {
    if (id === "all") return crewMembers.length;
    if (id === "deceased") return crewMembers.filter((m) => m.deceased).length;
    return crewMembers.filter((m) => m.roleType === id).length;
  };

  const tabs: Array<{ id: TabId; label: string; icon: React.ReactNode; count?: number }> = [
    { id: "crew", label: "Bemanning", icon: <Users className="h-4 w-4" />, count: crewMembers.length },
    { id: "science", label: "Wetenschappelijk Log", icon: <TrendingDown className="h-4 w-4" /> },
    { id: "discoveries", label: "Ontdekkingen", icon: <Award className="h-4 w-4" />, count: discoveries.length },
  ];

  return (
    <main
      className="touchwall-shell min-h-screen text-white"
      style={{ isolation: "isolate" }}
    >
      {/* ── Background texture overlay ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 47px, white 47px, white 48px)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-8 md:px-10 md:pt-10">
        {/* ════════════════════════════════════════════
            HEADER
        ════════════════════════════════════════════ */}
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <div>
            {/* Back nav */}
            <Link
              to="/"
              aria-label="Terug naar de interactieve globe"
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.24em] text-white/55 transition-all duration-200 hover:border-white/22 hover:bg-white/10 hover:text-white/80 focus:outline-none focus:ring-2 focus:ring-white/25"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Terug naar Globe
            </Link>

            <p className="text-[11px] font-medium uppercase tracking-[0.40em] text-white/35">
              Belgica Expeditie · 1897 — 1899
            </p>
            <h1 className="mt-2 text-5xl font-thin uppercase leading-none tracking-widest md:text-6xl">
              Crew & Science Atlas
            </h1>
            <p className="mt-2 text-sm font-medium tracking-[0.20em] text-white/35">
              Antwerpen · Kaapstad · Antarctica
            </p>
          </div>

          {/* Decorative badge */}
          <div className="museum-glass flex items-center gap-3 self-start rounded-xl px-5 py-3.5 md:self-auto">
            <Anchor className="h-5 w-5 text-red-400/70" aria-hidden="true" />
            <div>
              <p className="text-[9px] font-medium uppercase tracking-[0.30em] text-white/35">
                Vaartuig
              </p>
              <p className="text-sm font-medium tracking-wide text-white/80">S.S. Belgica</p>
            </div>
          </div>
        </motion.header>

        {/* ════════════════════════════════════════════
            STATS BAR
        ════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4"
          role="list"
          aria-label="Expeditiestatistieken"
        >
          {[
            { value: "21", label: "Bemanningsleden", sub: "14 zeelieden + 7 wetenschappers" },
            { value: "377", label: "Dagen in pakijs", sub: "feb 1898 — mrt 1899" },
            { value: "−43°C", label: "Laagste temperatuur", sub: "Gemeten juni 1898" },
            { value: "9", label: "Nationaliteiten", sub: "Internationale bemanning" },
          ].map((stat) => (
            <div
              key={stat.label}
              role="listitem"
              className="museum-glass rounded-xl px-5 py-4"
            >
              <p className="text-2xl font-thin tabular-nums text-white md:text-3xl">{stat.value}</p>
              <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.20em] text-white/55">
                {stat.label}
              </p>
              <p className="mt-0.5 text-[10px] text-white/30">{stat.sub}</p>
            </div>
          ))}
        </motion.div>

        {/* ════════════════════════════════════════════
            TAB NAV
        ════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.18 }}
          className="mb-8"
          role="tablist"
          aria-label="Atlas secties"
        >
          <div className="flex gap-1 rounded-xl border border-white/8 bg-white/4 p-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  id={`tab-${tab.id}`}
                  aria-selected={isActive}
                  aria-controls={`panel-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className="relative flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.18em] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20"
                  style={{
                    color: isActive ? "rgba(255,255,255,0.90)" : "rgba(255,255,255,0.40)",
                  }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-tab-bg"
                      className="absolute inset-0 rounded-lg"
                      style={{
                        background: "oklch(0.14 0.025 248 / 80%)",
                        borderTop: "1px solid rgba(255,255,255,0.12)",
                      }}
                      transition={{ type: "spring", stiffness: 280, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    {tab.icon}
                    <span className="hidden sm:inline">{tab.label}</span>
                    {tab.count !== undefined && (
                      <span
                        className="rounded-full px-1.5 py-0.5 text-[9px]"
                        style={{
                          background: isActive ? "rgba(239,68,68,0.20)" : "rgba(255,255,255,0.08)",
                          color: isActive ? "rgb(252,165,165)" : "rgba(255,255,255,0.35)",
                        }}
                      >
                        {tab.count}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* ════════════════════════════════════════════
            TAB PANELS
        ════════════════════════════════════════════ */}
        <AnimatePresence mode="wait">
          {/* ── CREW TAB ── */}
          {activeTab === "crew" && (
            <motion.section
              key="crew"
              id="panel-crew"
              role="tabpanel"
              aria-labelledby="tab-crew"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* ── Filter bar ── */}
              <div className="mb-6" role="group" aria-label="Filter bemanningsleden op categorie">
                <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.36em] text-white/30">
                  Filter
                </p>
                <div className="flex flex-wrap gap-2">
                  {crewFilterOptions.map((f) => {
                    const isActive = activeFilter === f.id;
                    return (
                      <button
                        key={f.id}
                        aria-pressed={isActive}
                        onClick={() =>
                          setActiveFilter((prev) =>
                            prev === f.id && f.id !== "all" ? "all" : f.id,
                          )
                        }
                        className={`inline-flex min-h-[48px] items-center gap-2 rounded-full border px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 active:scale-[0.96] ${isActive ? f.activeCls : f.inactiveCls}`}
                        style={isActive ? { boxShadow: f.activeGlow } : undefined}
                      >
                        {f.dot !== null ? (
                          <span
                            className="h-1.5 w-1.5 shrink-0 rounded-full"
                            style={{ background: f.dot }}
                            aria-hidden="true"
                          />
                        ) : (
                          f.icon
                        )}
                        {f.label}
                        <span
                          className="rounded-full px-1.5 py-0.5 text-[9px] font-medium tabular-nums transition-colors duration-200"
                          style={{
                            background: isActive
                              ? "rgba(255,255,255,0.12)"
                              : "rgba(255,255,255,0.06)",
                            color: isActive
                              ? "rgba(255,255,255,0.80)"
                              : "rgba(255,255,255,0.28)",
                          }}
                        >
                          {filterCount(f.id)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence mode="popLayout">
                  {filteredCrew.length > 0 ? (
                    filteredCrew.map((member, i) => (
                      <CrewCard key={member.name} member={member} index={i} />
                    ))
                  ) : (
                    <motion.p
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="col-span-full py-12 text-center text-sm text-white/30"
                    >
                      Geen bemanningsleden gevonden voor deze categorie.
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </motion.section>
          )}

          {/* ── SCIENCE TAB ── */}
          {activeTab === "science" && (
            <motion.section
              key="science"
              id="panel-science"
              role="tabpanel"
              aria-labelledby="tab-science"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-6"
            >
              {/* Chart card */}
              <div className="museum-glass rounded-xl p-6">
                <div className="mb-6">
                  <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-white/35">
                    Wetenschappelijk logboek
                  </p>
                  <h2 className="mt-1.5 text-2xl font-thin tracking-wide">
                    Temperatuur & Wind langs de route
                  </h2>
                  <p className="mt-1 text-sm text-white/40">
                    Gemeten en geregistreerd door Arctowski & Dobrowolski, augustus 1897 – maart 1899
                  </p>
                </div>

                {/* Chart legend */}
                <div
                  className="mb-5 flex gap-5"
                  role="list"
                  aria-label="Grafieklegenda"
                >
                  {[
                    { color: "#ef4444", label: "Temperatuur (°C)", icon: <Thermometer className="h-3.5 w-3.5" /> },
                    { color: "#60a5fa", label: "Windkracht (kn)", icon: <Wind className="h-3.5 w-3.5" /> },
                  ].map((item) => (
                    <div
                      key={item.label}
                      role="listitem"
                      className="flex items-center gap-2 text-[11px] font-medium text-white/55"
                    >
                      <span style={{ color: item.color }} aria-hidden="true">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>

                {/* Recharts area chart — aria-label for SR */}
                <div
                  role="img"
                  aria-label="Grafiek van temperatuur en windkracht tijdens de Belgica-expeditie. Temperatuur daalt van +7°C in Antwerpen naar -43°C tijdens de Antarctische poolnacht."
                  style={{ height: 320 }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={voyageData}
                      margin={{ top: 12, right: 12, left: -8, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.28} />
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0.02} />
                        </linearGradient>
                        <linearGradient id="windGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.22} />
                          <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.06)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="label"
                        tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10, fontWeight: 500 }}
                        tickLine={false}
                        axisLine={{ stroke: "rgba(255,255,255,0.10)" }}
                        interval={0}
                        angle={-30}
                        textAnchor="end"
                        height={56}
                      />
                      <YAxis
                        yAxisId="temp"
                        tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v) => `${v}°`}
                        domain={[-50, 25]}
                      />
                      <YAxis
                        yAxisId="wind"
                        orientation="right"
                        tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v) => `${v}kn`}
                      />
                      <Tooltip content={<ChartTooltip />} />
                      <ReferenceLine
                        yAxisId="temp"
                        y={0}
                        stroke="rgba(255,255,255,0.15)"
                        strokeDasharray="6 3"
                        label={{
                          value: "0°C",
                          fill: "rgba(255,255,255,0.30)",
                          fontSize: 9,
                          fontWeight: 600,
                          letterSpacing: "0.1em",
                        }}
                      />
                      <Area
                        yAxisId="temp"
                        type="monotone"
                        dataKey="temp"
                        name="temp"
                        stroke="#ef4444"
                        strokeWidth={2.5}
                        fill="url(#tempGradient)"
                        dot={{ fill: "#ef4444", r: 3.5, strokeWidth: 0 }}
                        activeDot={{ r: 5.5, fill: "#ef4444", strokeWidth: 2, stroke: "rgba(0,0,0,0.4)" }}
                      />
                      <Area
                        yAxisId="wind"
                        type="monotone"
                        dataKey="wind"
                        name="wind"
                        stroke="#60a5fa"
                        strokeWidth={2}
                        fill="url(#windGradient)"
                        strokeDasharray="5 3"
                        dot={{ fill: "#60a5fa", r: 2.5, strokeWidth: 0 }}
                        activeDot={{ r: 4.5, fill: "#60a5fa", strokeWidth: 2, stroke: "rgba(0,0,0,0.4)" }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Text summary for screen readers */}
                <p className="mt-4 text-[12px] leading-relaxed text-white/35">
                  De temperatuur bereikte een dieptepunt van −43°C tijdens de poolnacht van juni 1898, terwijl de windkracht piekte op 68 knopen bij de Belgica's gevangenschap in het pakijs (februari 1898).
                </p>
              </div>

              {/* Key measurements grid */}
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  {
                    icon: <Thermometer className="h-5 w-5 text-red-400" aria-hidden="true" />,
                    label: "Temperatuurbereik",
                    value: "−43° → +18°C",
                    sub: "61 graden spreiding",
                  },
                  {
                    icon: <Wind className="h-5 w-5 text-blue-400" aria-hidden="true" />,
                    label: "Maximale windkracht",
                    value: "68 knopen",
                    sub: "Storm 10 Beaufort bij Pakijs",
                  },
                  {
                    icon: <TrendingDown className="h-5 w-5 text-teal-400" aria-hidden="true" />,
                    label: "Observatiedagen",
                    value: "> 700 dagen",
                    sub: "Iedere 6 uur een meting",
                  },
                ].map((item) => (
                  <div key={item.label} className="museum-glass rounded-xl px-5 py-4">
                    {item.icon}
                    <p className="mt-3 text-[10px] font-medium uppercase tracking-[0.22em] text-white/40">
                      {item.label}
                    </p>
                    <p className="mt-1.5 text-2xl font-thin text-white">{item.value}</p>
                    <p className="mt-0.5 text-[11px] text-white/35">{item.sub}</p>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* ── DISCOVERIES TAB ── */}
          {activeTab === "discoveries" && (
            <motion.section
              key="discoveries"
              id="panel-discoveries"
              role="tabpanel"
              aria-labelledby="tab-discoveries"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-6">
                <p className="text-sm font-medium leading-relaxed text-white/45">
                  De Belgica-expeditie produceerde een reeks wetenschappelijke en historische primeurs die tot op heden erkend worden als keerpunten in de poolwetenschappen.
                </p>
              </div>
              <div>
                {discoveries.map((item, i) => (
                  <DiscoveryItem key={item.title} item={item} index={i} />
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* ════════════════════════════════════════════
            FOOTER
        ════════════════════════════════════════════ */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 flex flex-col items-center gap-3 border-t border-white/8 pt-8 text-center"
        >
          <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-white/25">
            Belgica Expedition Touchwall · VDLINT 2024
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-white/35 transition-colors hover:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/20 rounded-md px-2 py-1"
          >
            <ArrowLeft className="h-3 w-3" aria-hidden="true" />
            Terug naar de interactieve globe
          </Link>
        </motion.footer>
      </div>
    </main>
  );
}
