export type GuideCategoryId = 'landmarks' | 'outdoors' | 'food' | 'misc';

export interface GuideCategory {
  id: GuideCategoryId;
  label: string;
  icon: string;
}

export interface GuidePlace {
  name: string;
  category: GuideCategoryId;
  /** Neighbourhood / short location tag shown under the name */
  area?: string;
  /** 1-2 line factual description (Wikipedia-style) */
  description: string;
  /** Personal tip shown in a second line */
  tip?: string;
  /** Marks a top pick */
  featured?: boolean;
  /** Exact en.wikipedia.org article title — renders a Wikipedia link */
  wikiTitle?: string;
  /** Override the map search query (defaults to `${name}, ${mapContext}`) */
  mapQuery?: string;
}

export interface RouteStop {
  place: string;
  /** Optional map query override for this stop */
  query?: string;
}

export interface GuideRoute {
  title: string;
  description: string;
  stops: RouteStop[];
  /** Defaults to 'walking'; use 'driving' for multi-city itineraries */
  mode?: 'walking' | 'driving';
}

export interface CountryGuideData {
  /** e.g. 'Denmark' */
  country: string;
  /** gallery slug, e.g. 'denmark' — used for the back link */
  slug: string;
  title: string;
  subtitle: string;
  heroImage: string;
  heroAlt: string;
  /** Appended to every place name when building map links, e.g. 'Copenhagen, Denmark' */
  mapContext: string;
  intro: string[];
  gettingThere: { title: string; text: string }[];
  routes: GuideRoute[];
  categories: GuideCategory[];
  places: GuidePlace[];
}
