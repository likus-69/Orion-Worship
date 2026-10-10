// Song Library
// -------------
// The Song Library is a curated catalogue of worship songs stored with their
// full lyrics, structured into labeled sections (verse, chorus, bridge, tag,
// intro, instrumental, outro). It is the single source of truth for song
// metadata across the app — the compact `songBank` view used in the left panel
// is derived from this list.
//
// The library also provides:
//   - `songsToSlides(song)` — converts a song's sections into presentation
//     slides (one slide per section), ready to be dropped into a service plan.
//   - `songToServiceItem(song)` — wraps a song into a `ServiceItem` so it can
//     be appended to the service plan and rendered with the existing slide
//     pipeline.
//   - `searchSongs(query, opts)` — fuzzy title/author/lyrics search plus
//     optional key/category filters, used by the Song Library dialog.

import type { ServiceItem, Slide } from "./service-tab";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SongSectionKind =
  | "verse"
  | "chorus"
  | "pre-chorus"
  | "bridge"
  | "tag"
  | "intro"
  | "instrumental"
  | "outro"
  | "ending";

export type SongCategory =
  "hymn" | "worship" | "contemporary" | "scripture-song" | "seasonal" | "children";

export type SongSection = {
  /** Stable id within a song, e.g. "v1", "c1", "b1". */
  id: string;
  kind: SongSectionKind;
  /** Human label for the slide, e.g. "Verse 1", "Chorus". */
  label: string;
  /** Each line becomes its own line on the slide. */
  lines: string[];
};

export type Song = {
  id: string;
  title: string;
  author: string;
  /** Musical key, e.g. "G", "Bb", "F#m". */
  key: string;
  /** Beats per minute — useful for the band, not currently rendered. */
  bpm?: number;
  category: SongCategory;
  /** CCLI number, if known. */
  ccli?: string;
  /** Copyright / source line, shown as attribution. */
  copyright?: string;
  /** Ordered list of sections. */
  sections: SongSection[];
  /** Free-text tags for search. */
  tags: string[];
};

// ---------------------------------------------------------------------------
// Seed data
// ---------------------------------------------------------------------------

export const songLibrary: Song[] = [
  {
    id: "amazing-grace",
    title: "Amazing Grace",
    author: "John Newton",
    key: "G",
    bpm: 72,
    category: "hymn",
    ccli: "22025",
    copyright: "Public Domain · 1779",
    tags: ["grace", "salvation", "classic", "testimony"],
    sections: [
      {
        id: "v1",
        kind: "verse",
        label: "Verse 1",
        lines: [
          "Amazing grace, how sweet the sound,",
          "That saved a wretch like me.",
          "I once was lost, but now am found,",
          "Was blind, but now I see.",
        ],
      },
      {
        id: "v2",
        kind: "verse",
        label: "Verse 2",
        lines: [
          "'Twas grace that taught my heart to fear,",
          "And grace my fears relieved.",
          "How precious did that grace appear",
          "The hour I first believed.",
        ],
      },
      {
        id: "v3",
        kind: "verse",
        label: "Verse 3",
        lines: [
          "Through many dangers, toils, and snares,",
          "I have already come;",
          "'Tis grace hath brought me safe thus far,",
          "And grace will lead me home.",
        ],
      },
      {
        id: "v4",
        kind: "verse",
        label: "Verse 4",
        lines: [
          "When we've been there ten thousand years,",
          "Bright shining as the sun,",
          "We've no less days to sing God's praise",
          "Than when we'd first begun.",
        ],
      },
    ],
  },
  {
    id: "great-is-thy-faithfulness",
    title: "Great Is Thy Faithfulness",
    author: "Thomas O. Chisholm",
    key: "D",
    bpm: 88,
    category: "hymn",
    ccli: "18723",
    copyright: "© 1923 Hope Publishing Co.",
    tags: ["faithfulness", "mercy", "morning", "classic"],
    sections: [
      {
        id: "c1",
        kind: "chorus",
        label: "Chorus",
        lines: [
          "Great is Thy faithfulness, O God my Father;",
          "There is no shadow of turning with Thee;",
          "Thou changest not, Thy compassions, they fail not;",
          "As Thou hast been Thou forever wilt be.",
        ],
      },
      {
        id: "v1",
        kind: "verse",
        label: "Verse 1",
        lines: [
          "Summer and winter, and springtime and harvest,",
          "Sun, moon and stars in their courses above,",
          "Join with all nature in manifold witness",
          "To Thy great faithfulness, mercy and love.",
        ],
      },
      {
        id: "v2",
        kind: "verse",
        label: "Verse 2",
        lines: [
          "Pardon for sin and a peace that endureth,",
          "Thine own dear presence to cheer and to guide;",
          "Strength for today and bright hope for tomorrow,",
          "Blessings all mine, with ten thousand beside!",
        ],
      },
    ],
  },
  {
    id: "how-great-thou-art",
    title: "How Great Thou Art",
    author: "Carl G. Boberg",
    key: "Bb",
    bpm: 76,
    category: "hymn",
    ccli: "14181",
    copyright: "© 1949 Hope Publishing Co.",
    tags: ["majesty", "creation", "classic"],
    sections: [
      {
        id: "v1",
        kind: "verse",
        label: "Verse 1",
        lines: [
          "O Lord my God, when I in awesome wonder",
          "Consider all the worlds Thy hands have made,",
          "I see the stars, I hear the rolling thunder,",
          "Thy power throughout the universe displayed.",
        ],
      },
      {
        id: "c1",
        kind: "chorus",
        label: "Chorus",
        lines: [
          "Then sings my soul, my Saviour God, to Thee:",
          "How great Thou art, how great Thou art!",
          "Then sings my soul, my Saviour God, to Thee:",
          "How great Thou art, how great Thou art!",
        ],
      },
      {
        id: "v2",
        kind: "verse",
        label: "Verse 2",
        lines: [
          "And when I think that God, His Son not sparing,",
          "Sent Him to die, I scarce can take it in;",
          "That on the cross, my burden gladly bearing,",
          "He bled and died to take away my sin.",
        ],
      },
    ],
  },
  {
    id: "be-thou-my-vision",
    title: "Be Thou My Vision",
    author: "Traditional Irish",
    key: "Eb",
    bpm: 80,
    category: "hymn",
    copyright: "Public Domain · 8th-century Irish poem",
    tags: ["devotion", "irish", "classic", "focus"],
    sections: [
      {
        id: "v1",
        kind: "verse",
        label: "Verse 1",
        lines: [
          "Be Thou my Vision, O Lord of my heart;",
          "Naught be all else to me, save that Thou art—",
          "Thou my best thought, by day or by night,",
          "Waking or sleeping, Thy presence my light.",
        ],
      },
      {
        id: "v2",
        kind: "verse",
        label: "Verse 2",
        lines: [
          "Be Thou my Wisdom, and Thou my true Word;",
          "I ever with Thee and Thou with me, Lord—",
          "Thou my great Father, I Thy true son,",
          "Thou in me dwelling, and I with Thee one.",
        ],
      },
      {
        id: "v3",
        kind: "verse",
        label: "Verse 3",
        lines: [
          "Riches I heed not, nor man's empty praise,",
          "Thou mine inheritance, now and always;",
          "Thou and Thou only, first in my heart,",
          "High King of Heaven, my Treasure Thou art.",
        ],
      },
    ],
  },
  {
    id: "come-thou-fount",
    title: "Come Thou Fount of Every Blessing",
    author: "Robert Robinson",
    key: "D",
    bpm: 84,
    category: "hymn",
    copyright: "Public Domain · 1758",
    tags: ["grace", "blessing", "classic", "testimony"],
    sections: [
      {
        id: "v1",
        kind: "verse",
        label: "Verse 1",
        lines: [
          "Here I raise my Ebenezer;",
          "Hither by Thy help I'm come;",
          "And I hope, by Thy good pleasure,",
          "Safely to arrive at home.",
        ],
      },
      {
        id: "v2",
        kind: "verse",
        label: "Verse 2",
        lines: [
          "Jesus sought me when a stranger,",
          "Wandering from the fold of God;",
          "He, to rescue me from danger,",
          "Interposed His precious blood.",
        ],
      },
      {
        id: "v3",
        kind: "verse",
        label: "Verse 3",
        lines: [
          "O to grace how great a debtor",
          "Daily I'm constrained to be!",
          "Let Thy goodness, like a fetter,",
          "Bind my wandering heart to Thee.",
        ],
      },
    ],
  },
  {
    id: "it-is-well",
    title: "It Is Well With My Soul",
    author: "Horatio G. Spafford",
    key: "C",
    bpm: 70,
    category: "hymn",
    copyright: "Public Domain · 1873",
    tags: ["peace", "comfort", "classic", "sorrow"],
    sections: [
      {
        id: "v1",
        kind: "verse",
        label: "Verse 1",
        lines: [
          "When peace like a river attendeth my way,",
          "When sorrows like sea billows roll—",
          "Whatever my lot, Thou hast taught me to say,",
          "It is well, it is well with my soul.",
        ],
      },
      {
        id: "c1",
        kind: "chorus",
        label: "Chorus",
        lines: ["It is well with my soul,", "It is well, it is well with my soul."],
      },
      {
        id: "v2",
        kind: "verse",
        label: "Verse 2",
        lines: [
          "Though Satan should buffet, though trials should come,",
          "Let this blest assurance control,",
          "That Christ has regarded my helpless estate,",
          "And hath shed His own blood for my soul.",
        ],
      },
    ],
  },
  {
    id: "holy-holy-holy",
    title: "Holy, Holy, Holy",
    author: "Reginald Heber",
    key: "Eb",
    bpm: 78,
    category: "hymn",
    copyright: "Public Domain · 1826",
    tags: ["trinity", "holiness", "classic"],
    sections: [
      {
        id: "v1",
        kind: "verse",
        label: "Verse 1",
        lines: [
          "Holy, holy, holy! Lord God Almighty!",
          "Early in the morning our song shall rise to Thee;",
          "Holy, holy, holy, merciful and mighty!",
          "God in three Persons, blessed Trinity!",
        ],
      },
      {
        id: "v2",
        kind: "verse",
        label: "Verse 2",
        lines: [
          "Holy, holy, holy! All the saints adore Thee,",
          "Casting down their golden crowns around the glassy sea;",
          "Cherubim and seraphim falling down before Thee,",
          "Who wert and art and evermore shalt be.",
        ],
      },
    ],
  },
  {
    id: "blessed-assurance",
    title: "Blessed Assurance",
    author: "Fanny J. Crosby",
    key: "D",
    bpm: 90,
    category: "hymn",
    copyright: "Public Domain · 1873",
    tags: ["assurance", "worship", "classic"],
    sections: [
      {
        id: "v1",
        kind: "verse",
        label: "Verse 1",
        lines: [
          "Blessed assurance, Jesus is mine!",
          "O what a foretaste of glory divine!",
          "Heir of salvation, purchase of God,",
          "Born of His Spirit, washed in His blood.",
        ],
      },
      {
        id: "c1",
        kind: "chorus",
        label: "Chorus",
        lines: [
          "This is my story, this is my song,",
          "Praising my Saviour all the day long;",
          "This is my story, this is my song,",
          "Praising my Saviour all the day long.",
        ],
      },
    ],
  },
  {
    id: "10-000-reasons",
    title: "10,000 Reasons (Bless the Lord)",
    author: "Matt Redman · Jonas Myrin",
    key: "G",
    bpm: 144,
    category: "contemporary",
    ccli: "6016351",
    copyright: "© 2011 Thankyou Music",
    tags: ["blessing", "morning", "modern", "worship"],
    sections: [
      {
        id: "v1",
        kind: "verse",
        label: "Verse 1",
        lines: [
          "The sun comes up, it's a new day dawning,",
          "It's time to sing Your song again.",
          "Whatever may pass and whatever lies before me,",
          "Let me be singing when the evening comes.",
        ],
      },
      {
        id: "c1",
        kind: "chorus",
        label: "Chorus",
        lines: [
          "Bless the Lord, O my soul,",
          "Worship His holy name.",
          "Sing like never before,",
          "O my soul, I'll worship Your holy name.",
        ],
      },
      {
        id: "v2",
        kind: "verse",
        label: "Verse 2",
        lines: [
          "You're rich in love and You're slow to anger,",
          "Your name is great and Your heart is kind.",
          "For all Your goodness I will keep on singing,",
          "Ten thousand reasons for my heart to find.",
        ],
      },
      {
        id: "b1",
        kind: "bridge",
        label: "Bridge",
        lines: [
          "And on that day when my strength is failing,",
          "The end draws near and my time has come,",
          "Still my soul will sing Your praise unending—",
          "Ten thousand years and then forevermore!",
        ],
      },
    ],
  },
  {
    id: "what-a-beautiful-name",
    title: "What a Beautiful Name",
    author: "Brooke Ligertwood · Ben Fielding",
    key: "D",
    bpm: 136,
    category: "contemporary",
    ccli: "7068424",
    copyright: "© 2016 Hillsong Music Publishing",
    tags: ["jesus", "hillsong", "modern", "worship"],
    sections: [
      {
        id: "v1",
        kind: "verse",
        label: "Verse 1",
        lines: [
          "You were the Word at the beginning,",
          "One with God the Lord Most High.",
          "Your hidden glory in creation,",
          "Now revealed in You our Christ.",
        ],
      },
      {
        id: "c1",
        kind: "chorus",
        label: "Chorus",
        lines: [
          "What a beautiful Name it is,",
          "What a beautiful Name it is—",
          "The Name of Jesus Christ my King.",
          "What a beautiful Name it is,",
          "Nothing compares to this—",
          "What a beautiful Name it is,",
          "The Name of Jesus.",
        ],
      },
      {
        id: "b1",
        kind: "bridge",
        label: "Bridge",
        lines: [
          "Death could not hold You,",
          "The veil tore before You,",
          "You silence the boast of sin and grave.",
          "The heavens are roaring",
          "The praise of Your glory",
          "For You are raised to life again.",
        ],
      },
    ],
  },
  {
    id: "good-good-father",
    title: "Good Good Father",
    author: "Pat Barrett · Tony Brown",
    key: "G",
    bpm: 130,
    category: "contemporary",
    ccli: "7049147",
    copyright: "© 2014 Capitol CMG Genesis",
    tags: ["father", "love", "modern", "worship"],
    sections: [
      {
        id: "v1",
        kind: "verse",
        label: "Verse 1",
        lines: [
          "I've heard a thousand stories",
          "Of what they think You're like,",
          "But I've heard the tender whisper",
          "Of love in the dead of night.",
        ],
      },
      {
        id: "p1",
        kind: "pre-chorus",
        label: "Pre-Chorus",
        lines: ["And You tell me that You're pleased", "And that I'm never alone."],
      },
      {
        id: "c1",
        kind: "chorus",
        label: "Chorus",
        lines: [
          "You're a good, good Father—",
          "It's who You are, it's who You are, it's who You are.",
          "And I'm loved by You—",
          "It's who I am, it's who I am, it's who I am.",
        ],
      },
    ],
  },
  {
    id: "cornerstone",
    title: "Cornerstone",
    author: "Edward Mote · Eric Liljero · Jonas Myrin · Reuben Morgan",
    key: "E",
    bpm: 138,
    category: "contemporary",
    ccli: "6510365",
    copyright: "© 2011 Hillsong Music Publishing",
    tags: ["hope", "foundation", "hillsong", "modern"],
    sections: [
      {
        id: "v1",
        kind: "verse",
        label: "Verse 1",
        lines: [
          "My hope is built on nothing less",
          "Than Jesus' blood and righteousness;",
          "I dare not trust the sweetest frame,",
          "But wholly lean on Jesus' name.",
        ],
      },
      {
        id: "c1",
        kind: "chorus",
        label: "Chorus",
        lines: [
          "Christ alone, Cornerstone,",
          "Weak made strong in the Saviour's love.",
          "Through the storm, He is Lord,",
          "Lord of all.",
        ],
      },
      {
        id: "b1",
        kind: "bridge",
        label: "Bridge",
        lines: ["He is Lord, Lord of all!", "He is Lord, Lord of all!"],
      },
    ],
  },
  {
    id: "psalm-23-song",
    title: "The Lord's My Shepherd (Psalm 23)",
    author: "Stuart K. Hine",
    key: "F",
    bpm: 82,
    category: "scripture-song",
    copyright: "Public Domain · Scottish Psalter",
    tags: ["shepherd", "psalm", "scripture", "comfort"],
    sections: [
      {
        id: "v1",
        kind: "verse",
        label: "Verse 1",
        lines: [
          "The Lord's my Shepherd, I'll not want.",
          "He makes me lie in pastures green,",
          "He leads me by the still, still waters,",
          "His goodness restores my soul.",
        ],
      },
      {
        id: "v2",
        kind: "verse",
        label: "Verse 2",
        lines: [
          "He guides my ways in righteousness",
          "For His own name's sure sake.",
          "And though I walk through death's dark valley,",
          "I will fear no evil, Lord.",
        ],
      },
    ],
  },
  {
    id: "silent-night",
    title: "Silent Night",
    author: "Joseph Mohr · Franz X. Gruber",
    key: "C",
    bpm: 60,
    category: "seasonal",
    copyright: "Public Domain · 1818",
    tags: ["christmas", "carol", "seasonal", "peace"],
    sections: [
      {
        id: "v1",
        kind: "verse",
        label: "Verse 1",
        lines: [
          "Silent night, holy night,",
          "All is calm, all is bright",
          "Round yon Virgin, Mother and Child,",
          "Holy Infant, so tender and mild,",
          "Sleep in heavenly peace,",
          "Sleep in heavenly peace.",
        ],
      },
      {
        id: "v2",
        kind: "verse",
        label: "Verse 2",
        lines: [
          "Silent night, holy night,",
          "Shepherds quake at the sight;",
          "Glories stream from heaven afar,",
          "Heavenly hosts sing Alleluia—",
          "Christ the Saviour is born,",
          "Christ the Saviour is born.",
        ],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Lookups & transforms
// ---------------------------------------------------------------------------

export const songById = new Map(songLibrary.map((song) => [song.id, song]));

export const songCategories: readonly { value: SongCategory; label: string }[] = [
  { value: "hymn", label: "Hymn" },
  { value: "worship", label: "Worship" },
  { value: "contemporary", label: "Contemporary" },
  { value: "scripture-song", label: "Scripture Song" },
  { value: "seasonal", label: "Seasonal" },
  { value: "children", label: "Children" },
] as const;

export const songKeys: readonly string[] = [...new Set(songLibrary.map((song) => song.key))].sort();

/** Compute the union of musical keys across any set of song lists (seed + user). */
export function collectSongKeys(...lists: Song[][]): string[] {
  const set = new Set<string>();
  for (const list of lists) for (const song of list) set.add(song.key);
  return [...set].sort();
}

/**
 * Convert a song into a flat list of presentation slides, one per section.
 * Each slide inherits the song's author as its attribution so the operator
 * always knows the source on the live screen.
 */
export function songToSlides(song: Song): Slide[] {
  return song.sections.map((section) => ({
    id: `${song.id}-${section.id}`,
    kind: "lyrics",
    label: section.label,
    lines: [...section.lines],
    attribution: song.copyright ?? song.author,
  }));
}

/**
 * Wrap a song into a `ServiceItem` so it can be appended to the service plan
 * and rendered by the existing slide pipeline. The id is namespaced under
 * `song-` to avoid collisions with the static service plan ids.
 */
export function songToServiceItem(song: Song): ServiceItem {
  return {
    id: `song-${song.id}`,
    title: song.title,
    subtitle: `${song.author} · Key of ${song.key}`,
    kind: "song",
    slides: songToSlides(song),
  };
}

export type SongSearchOptions = {
  query?: string;
  category?: SongCategory | null;
  songKey?: string | null;
};

/**
 * Fuzzy search across title, author, lyrics, and tags. Empty query returns
 * the full library (optionally filtered by key/category). Pass a `songs`
 * argument to search a merged list (e.g. seed + user songs from the hook);
 * otherwise it searches the static seed catalogue.
 */
export function searchSongs(options: SongSearchOptions = {}, songs: Song[] = songLibrary): Song[] {
  const { query, category, songKey } = options;
  const normalized = (query ?? "").trim().toLowerCase();

  return songs.filter((song) => {
    if (category && song.category !== category) return false;
    if (songKey && song.key !== songKey) return false;
    if (!normalized) return true;

    const haystack = [
      song.title,
      song.author,
      song.tags.join(" "),
      song.sections.map((section) => section.lines.join(" ")).join(" "),
    ]
      .join(" \u0001 ")
      .toLowerCase();

    return haystack.includes(normalized);
  });
}

/**
 * Count slides a song would produce. Used in the song list to show the
 * operator how many slides will be inserted.
 */
export function songSlideCount(song: Song): number {
  return song.sections.length;
}

// ---------------------------------------------------------------------------
// User song storage (localStorage)
// ---------------------------------------------------------------------------
//
// Songs created in the editor are persisted to localStorage so they survive
// page refreshes and stay separate from the read-only seed catalogue. User
// songs have ids prefixed with `user-` so they can be distinguished from
// seed songs (which cannot be edited or deleted through the UI).

export const USER_SONG_ID_PREFIX = "user-";
const USER_SONGS_STORAGE_KEY = "orion-worship:user-songs:v1";

/** True for songs the operator created in the editor (vs. read-only seed songs). */
export function isUserSong(song: Song): boolean {
  return song.id.startsWith(USER_SONG_ID_PREFIX);
}

/**
 * Load user-created songs from localStorage. Returns an empty array on any
 * parse failure or when running in an environment without `localStorage`
 * (SSR, sandboxed iframes).
 */
export function loadUserSongs(): Song[] {
  if (typeof window === "undefined" || !window.localStorage) return [];
  try {
    const raw = window.localStorage.getItem(USER_SONGS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isStoredSong).map(normalizeStoredSong);
  } catch {
    return [];
  }
}

/**
 * Persist the user song array. Silently no-ops in environments without
 * `localStorage` to keep the editor usable during SSR / tests.
 */
export function saveUserSongs(songs: Song[]): void {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    window.localStorage.setItem(USER_SONGS_STORAGE_KEY, JSON.stringify(songs));
  } catch {
    // Quota exceeded or serialization error — swallow so the editor keeps working.
  }
}

/** Subscribe to user-song changes from other tabs/windows. Returns an unsubscribe. */
export function subscribeToUserSongs(handler: () => void): () => void {
  if (typeof window === "undefined" || !window.addEventListener) return () => {};
  const onStorage = (event: StorageEvent) => {
    if (event.key === USER_SONGS_STORAGE_KEY) handler();
  };
  window.addEventListener("storage", onStorage);
  return () => window.removeEventListener("storage", onStorage);
}

function isStoredSong(value: unknown): value is Song {
  if (!value || typeof value !== "object") return false;
  const song = value as Record<string, unknown>;
  return (
    typeof song["id"] === "string" &&
    typeof song["title"] === "string" &&
    typeof song["author"] === "string" &&
    typeof song["key"] === "string" &&
    typeof song["category"] === "string" &&
    Array.isArray(song["sections"]) &&
    Array.isArray(song["tags"])
  );
}

/** Coerce a parsed song back into a clean Song shape (defensive against bad JSON). */
function normalizeStoredSong(raw: Song): Song {
  const song: Song = {
    id: raw.id,
    title: raw.title,
    author: raw.author,
    key: raw.key,
    category: raw.category,
    sections: raw.sections
      .filter((section) => section && typeof section.label === "string")
      .map((section) => ({
        id: String(section.id),
        kind: section.kind,
        label: section.label,
        lines: Array.isArray(section.lines) ? section.lines.map(String) : [],
      })),
    tags: Array.isArray(raw.tags) ? raw.tags.map(String) : [],
  };
  // Conditionally restore optional fields (absent in older saved data).
  if (typeof raw.bpm === "number") song.bpm = raw.bpm;
  if (typeof raw.ccli === "string") song.ccli = raw.ccli;
  if (typeof raw.copyright === "string") song.copyright = raw.copyright;
  return song;
}

// ---------------------------------------------------------------------------
// Lyrics <-> plain text parser
// ---------------------------------------------------------------------------
//
// The editor accepts plain-text lyrics with a small, predictable syntax:
//
//   Verse 1:
//   Amazing grace, how sweet the sound,
//   That saved a wretch like me.
//
//   Chorus:
//   My chains are gone,
//   I've been set free.
//
// Rules:
//   - A line whose trimmed form ends with `:` and is otherwise a short label
//     (letters, digits, spaces, hyphens, apostrophes, parens) starts a new
//     section. The text before the colon becomes the section label.
//   - Lines starting with `//` or `#` are comments and skipped.
//   - Blank lines are ignored (they don't break sections).
//   - Lyric lines appearing before the first header are collected under an
//     implicit "Verse 1" section so users can paste bare lyrics.
//   - Section `kind` is derived from the label prefix (Verse -> "verse",
//     Chorus -> "chorus", etc.).

/** Plain-text input for the song editor. */
export type SongEditorInput = {
  title: string;
  author: string;
  key: string;
  category: SongCategory;
  // Optional fields accept explicit `undefined` so the editor can represent
  // "cleared" inputs without violating `exactOptionalPropertyTypes`.
  bpm?: number | undefined;
  copyright?: string | undefined;
  ccli?: string | undefined;
  tags: string[];
  /** Plain-text lyrics following the format documented above. */
  lyrics: string;
};

/**
 * Parse plain-text lyrics into structured sections. Section ids are derived
 * from the kind + an incrementing per-kind counter so they stay stable
 * across edits when the structure doesn't change.
 */
export function parseSongLyrics(text: string): SongSection[] {
  const lines = text.split(/\r?\n/);
  const sections: SongSection[] = [];
  let label: string | null = null;
  let kind: SongSectionKind = "verse";
  let buffer: string[] = [];
  const counters: Record<string, number> = {};

  const flush = () => {
    if (label === null) return;
    if (buffer.length === 0) return;
    const prefix = SECTION_ID_PREFIX[kind] ?? "s";
    counters[prefix] = (counters[prefix] ?? 0) + 1;
    sections.push({
      id: `${prefix}${counters[prefix]}`,
      kind,
      label,
      lines: buffer,
    });
    label = null;
    buffer = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line === "") continue;
    if (line.startsWith("//") || line.startsWith("#")) continue;

    if (isSectionHeader(line)) {
      flush();
      label = line.slice(0, -1).trim();
      kind = detectSectionKind(label);
      continue;
    }

    if (label === null) {
      // Implicit first section when the user pastes bare lyrics.
      label = "Verse 1";
      kind = "verse";
    }
    buffer.push(line);
  }
  flush();

  return sections;
}

/** True if a line looks like a section header (e.g. "Verse 1:", "Chorus:"). */
function isSectionHeader(line: string): boolean {
  if (!line.endsWith(":")) return false;
  const label = line.slice(0, -1).trim();
  if (!label) return false;
  return /^[A-Za-z][A-Za-z0-9\s\-()'']{0,40}$/.test(label);
}

function detectSectionKind(label: string): SongSectionKind {
  const lower = label.toLowerCase();
  if (lower.startsWith("pre")) return "pre-chorus";
  if (lower.startsWith("verse")) return "verse";
  if (lower.startsWith("chorus")) return "chorus";
  if (lower.startsWith("bridge")) return "bridge";
  if (lower.startsWith("tag")) return "tag";
  if (lower.startsWith("intro")) return "intro";
  if (lower.startsWith("instrumental")) return "instrumental";
  if (lower.startsWith("outro")) return "outro";
  if (lower.startsWith("ending")) return "ending";
  return "verse";
}

const SECTION_ID_PREFIX: Record<SongSectionKind, string> = {
  verse: "v",
  chorus: "c",
  "pre-chorus": "p",
  bridge: "b",
  tag: "t",
  intro: "i",
  instrumental: "inst",
  outro: "o",
  ending: "e",
};

/** Render a song's sections back into the plain-text lyrics format. */
export function serializeSongLyrics(song: Pick<Song, "sections">): string {
  return song.sections
    .map((section) => `${section.label}:\n${section.lines.join("\n")}`)
    .join("\n\n");
}

/**
 * Build a Song from editor input. Generates a fresh user-namespaced id when
 * creating, or preserves the existing id when editing.
 */
export function buildSongFromInput(input: SongEditorInput, existingId?: string): Song {
  const id =
    existingId ?? `${USER_SONG_ID_PREFIX}${slugify(input.title)}-${Date.now().toString(36)}`;
  const song: Song = {
    id,
    title: input.title.trim(),
    author: input.author.trim(),
    key: input.key.trim() || "—",
    category: input.category,
    tags: input.tags,
    sections: parseSongLyrics(input.lyrics),
  };
  // Conditionally assign optional fields so we don't violate
  // `exactOptionalPropertyTypes` (which forbids explicit `undefined`).
  if (input.bpm !== undefined) song.bpm = input.bpm;
  if (input.copyright) song.copyright = input.copyright.trim();
  if (input.ccli) song.ccli = input.ccli.trim();
  return song;
}

function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "song"
  );
}

/** Validate editor input. Returns the first error message, or null if valid. */
export function validateSongInput(input: SongEditorInput): string | null {
  if (!input.title.trim()) return "Title is required.";
  if (!input.author.trim()) return "Author is required.";
  const sections = parseSongLyrics(input.lyrics);
  if (sections.length === 0) {
    return "Lyrics must contain at least one section. Start a section with a header line like 'Verse 1:'.";
  }
  return null;
}

// ---------------------------------------------------------------------------
// Export / Import (JSON)
// ---------------------------------------------------------------------------
//
// User songs can be exported to a JSON file for backup or sharing, and
// imported back into any browser. The format is versioned so future schema
// changes can be migrated.

export const SONG_EXPORT_FORMAT = "orion-worship:songs:v1" as const;

export type SongExportFile = {
  format: typeof SONG_EXPORT_FORMAT;
  exportedAt: string;
  count: number;
  songs: Song[];
};

/** Build a JSON-exportable bundle from a list of songs (typically user songs). */
export function buildSongExport(songs: Song[]): SongExportFile {
  return {
    format: SONG_EXPORT_FORMAT,
    exportedAt: new Date().toISOString(),
    count: songs.length,
    songs,
  };
}

/**
 * Parse an import file. Returns either the valid songs or an error message.
 * Songs that fail validation are skipped (not fatal) so a partially-corrupt
 * file still imports the good entries.
 */
export function parseSongExport(raw: string): { songs: Song[]; error: string | null } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch {
    return { songs: [], error: "File is not valid JSON." };
  }

  if (!parsed || typeof parsed !== "object") {
    return { songs: [], error: "Expected a JSON object." };
  }

  const root = parsed as Record<string, unknown>;
  // Accept either the wrapped export format or a bare array of songs.
  const candidates: unknown[] = Array.isArray(root["songs"])
    ? (root["songs"] as unknown[])
    : Array.isArray(parsed)
      ? (parsed as unknown[])
      : [];

  if (candidates.length === 0) {
    return { songs: [], error: "No songs found in the file." };
  }

  const songs: Song[] = [];
  let skipped = 0;
  for (const candidate of candidates) {
    const normalized = normalizeStoredSongIfValid(candidate);
    if (normalized) {
      songs.push(normalized);
    } else {
      skipped++;
    }
  }

  if (songs.length === 0) {
    return { songs: [], error: "None of the entries in the file are valid songs." };
  }

  return {
    songs,
    error: skipped > 0 ? `${skipped} invalid entr${skipped === 1 ? "y" : "ies"} skipped.` : null,
  };
}

/** Validate + normalize a single candidate song from an imported file. */
function normalizeStoredSongIfValid(value: unknown): Song | null {
  if (!isStoredSong(value)) return null;
  return normalizeStoredSong(value);
}

/**
 * Merge imported songs into an existing user-song list. Songs with the same id
 * are overwritten; songs with new ids are appended. Returns the merged list
 * and a summary of what changed.
 */
export function mergeImportedSongs(
  existing: Song[],
  imported: Song[],
): { merged: Song[]; added: number; overwritten: number } {
  const byId = new Map<string, Song>(existing.map((song) => [song.id, song]));
  let added = 0;
  let overwritten = 0;
  for (const song of imported) {
    if (byId.has(song.id)) {
      overwritten++;
    } else {
      added++;
    }
    byId.set(song.id, song);
  }
  // Preserve existing order, then append new songs at the end.
  const existingIds = new Set(existing.map((song) => song.id));
  const merged = [
    ...existing.map((song) => byId.get(song.id) ?? song),
    ...imported.filter((song) => !existingIds.has(song.id)),
  ];
  return { merged, added, overwritten };
}
