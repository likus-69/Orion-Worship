export type SlideKind = "title" | "lyrics" | "scripture" | "sermon" | "blank";

export type Slide = {
  id: string;
  kind: SlideKind;
  label: string;
  lines: string[];
  attribution?: string;
};

export type ServiceItem = {
  id: string;
  title: string;
  subtitle: string;
  kind: "song" | "scripture" | "sermon" | "moment";
  slides: Slide[];
};

export type Playlist = {
  id: string;
  name: string;
  count: number;
};

export type LibrarySong = {
  id: string;
  title: string;
  author: string;
  key: string;
};

export const serviceItems: ServiceItem[] = [
  {
    id: "welcome",
    title: "Welcome",
    subtitle: "Opening & announcements",
    kind: "moment",
    slides: [
      {
        id: "welcome-1",
        kind: "title",
        label: "Title",
        lines: ["Welcome Home"],
        attribution: "Sunday Gathering · 10:00 AM",
      },
      {
        id: "welcome-2",
        kind: "title",
        label: "Notice",
        lines: ["Prayer & Fellowship", "Wednesdays, 6:30 PM"],
      },
    ],
  },
  {
    id: "amazing-grace",
    title: "Amazing Grace",
    subtitle: "John Newton · Key of G",
    kind: "song",
    slides: [
      {
        id: "ag-1",
        kind: "lyrics",
        label: "Verse 1",
        lines: ["Amazing grace, how sweet the sound,", "That saved a wretch like me."],
        attribution: "John Newton · 1779",
      },
      {
        id: "ag-2",
        kind: "lyrics",
        label: "Verse 1b",
        lines: ["I once was lost, but now am found,", "Was blind, but now I see."],
        attribution: "John Newton · 1779",
      },
      {
        id: "ag-3",
        kind: "lyrics",
        label: "Verse 2",
        lines: [
          "'Twas grace that taught my heart to fear,",
          "And grace my fears relieved.",
        ],
        attribution: "John Newton · 1779",
      },
      {
        id: "ag-4",
        kind: "lyrics",
        label: "Verse 2b",
        lines: [
          "How precious did that grace appear",
          "The hour I first believed.",
        ],
        attribution: "John Newton · 1779",
      },
    ],
  },
  {
    id: "psalm-23",
    title: "Psalm 23",
    subtitle: "Scripture reading",
    kind: "scripture",
    slides: [
      {
        id: "ps-1",
        kind: "scripture",
        label: "vv. 1–2",
        lines: [
          "The Lord is my shepherd; I shall not want.",
          "He makes me lie down in green pastures.",
        ],
        attribution: "Psalm 23:1–2",
      },
      {
        id: "ps-2",
        kind: "scripture",
        label: "vv. 3–4",
        lines: [
          "He restores my soul.",
          "Even though I walk through the valley of the shadow of death,",
          "I will fear no evil, for you are with me.",
        ],
        attribution: "Psalm 23:3–4",
      },
    ],
  },
  {
    id: "sermon",
    title: "Sermon",
    subtitle: "The Shepherd Who Stays",
    kind: "sermon",
    slides: [
      {
        id: "sm-1",
        kind: "sermon",
        label: "Title",
        lines: ["The Shepherd Who Stays"],
        attribution: "Message in three movements",
      },
      {
        id: "sm-2",
        kind: "sermon",
        label: "Point 1",
        lines: ["1. He leads before He asks us to follow."],
      },
      {
        id: "sm-3",
        kind: "sermon",
        label: "Point 2",
        lines: ["2. The valley is a path, not a destination."],
      },
      {
        id: "sm-4",
        kind: "blank",
        label: "Blank",
        lines: [],
      },
    ],
  },
  {
    id: "benediction",
    title: "Benediction",
    subtitle: "Sending",
    kind: "moment",
    slides: [
      {
        id: "bn-1",
        kind: "scripture",
        label: "Blessing",
        lines: ["The Lord bless you and keep you;", "the Lord make his face shine on you."],
        attribution: "Numbers 6:24–25",
      },
    ],
  },
];

export const playlists: Playlist[] = [
  { id: "pl-1", name: "Sunday 10 AM", count: 5 },
  { id: "pl-2", name: "Youth Night", count: 8 },
  { id: "pl-3", name: "Communion Set", count: 4 },
  { id: "pl-4", name: "Christmas Eve", count: 11 },
];

export const songBank: LibrarySong[] = [
  { id: "sb-1", title: "Amazing Grace", author: "John Newton", key: "G" },
  { id: "sb-2", title: "Great Is Thy Faithfulness", author: "T. Chisholm", key: "D" },
  { id: "sb-3", title: "How Great Thou Art", author: "C. Boberg", key: "Bb" },
  { id: "sb-4", title: "Be Thou My Vision", author: "Trad. Irish", key: "Eb" },
  { id: "sb-5", title: "Come Thou Fount", author: "R. Robinson", key: "D" },
  { id: "sb-6", title: "It Is Well With My Soul", author: "H. Spafford", key: "C" },
  { id: "sb-7", title: "Holy, Holy, Holy", author: "R. Heber", key: "Eb" },
  { id: "sb-8", title: "Blessed Assurance", author: "F. Crosby", key: "D" },
];

export const mediaItems = [
  { id: "md-1", name: "Stage Wash", type: "Motion", tone: "from-[#2b3f6b] to-[#0f1422]" },
  { id: "md-2", name: "Linen Paper", type: "Still", tone: "from-[#efe7d7] to-[#cfc3ab]" },
  { id: "md-3", name: "Golden Hour", type: "Motion", tone: "from-[#c78b3a] to-[#3a2a16]" },
  { id: "md-4", name: "Deep Indigo", type: "Still", tone: "from-[#1b2340] to-[#080b14]" },
  { id: "md-5", name: "Sanctuary", type: "Photo", tone: "from-[#5d5442] to-[#1a1712]" },
  { id: "md-6", name: "Slow Particles", type: "Motion", tone: "from-[#2f5b57] to-[#0c1614]" },
  { id: "md-7", name: "Blank / Black", type: "Still", tone: "from-[#0a0d14] to-[#0a0d14]" },
];

export const flatSlides = serviceItems.flatMap((item) =>
  item.slides.map((slide) => ({ ...slide, itemId: item.id, itemTitle: item.title })),
);

export type FlatSlide = (typeof flatSlides)[number];
