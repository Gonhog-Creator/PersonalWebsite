'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { Fraunces } from 'next/font/google';
import { ProjectHeader } from '@/components/gallery/ProjectHeader';
import type { CountryGuideData, GuideCategoryId, GuidePlace } from '@/data/guides/types';

const fraunces = Fraunces({ subsets: ['latin'], display: 'swap' });

type SortMode = 'recommended' | 'az';
type CategoryFilter = GuideCategoryId | 'all';

const googleMapsUrl = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

const appleMapsUrl = (query: string) =>
  `https://maps.apple.com/?q=${encodeURIComponent(query)}`;

const googleDirectionsUrl = (stops: string[], mode: 'walking' | 'driving' = 'walking') => {
  const [origin, ...rest] = stops;
  const destination = rest.pop();
  const waypoints = rest.join('|');
  return (
    `https://www.google.com/maps/dir/?api=1&travelmode=${mode}` +
    `&origin=${encodeURIComponent(origin)}` +
    `&destination=${encodeURIComponent(destination ?? origin)}` +
    (waypoints ? `&waypoints=${encodeURIComponent(waypoints)}` : '')
  );
};

// Apple Maps unified URLs: /directions with repeated `waypoint` params
// for multistop routes (the old ?daddr= scheme only honors one stop).
// Requires iOS 18.4 / macOS 15.4 or later.
const appleDirectionsUrl = (stops: string[], mode: 'walking' | 'driving' = 'walking') => {
  const [origin, ...rest] = stops;
  const destination = rest.pop();
  const waypoints = rest.map((s) => `waypoint=${encodeURIComponent(s)}`).join('&');
  return (
    `https://maps.apple.com/directions?source=${encodeURIComponent(origin)}` +
    `&destination=${encodeURIComponent(destination ?? origin)}` +
    (waypoints ? `&${waypoints}` : '') +
    `&mode=${mode}`
  );
};

const placeQuery = (place: GuidePlace, mapContext: string) =>
  place.mapQuery ?? `${place.name}, ${mapContext}`;

export function CountryGuideJournal({
  data,
  thumbnails = {},
}: {
  data: CountryGuideData;
  thumbnails?: Record<string, string>;
}) {
  const [filter, setFilter] = useState<CategoryFilter>('all');
  const [sort, setSort] = useState<SortMode>('recommended');

  // The site body is painted dark — override while this light page is mounted
  // so overscroll and fixed-header gaps don't show dark blue.
  useEffect(() => {
    const prevBody = document.body.style.background;
    const prevHtml = document.documentElement.style.background;
    document.body.style.background = '#FAF7F2';
    document.documentElement.style.background = '#FAF7F2';
    return () => {
      document.body.style.background = prevBody;
      document.documentElement.style.background = prevHtml;
    };
  }, []);

  const filtered = useMemo(() => {
    const list = data.places.filter((p) => filter === 'all' || p.category === filter);
    if (sort === 'az') return [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [data.places, filter, sort]);

  const totalStops = data.routes.reduce((n, r) => n + r.stops.length, 0);

  return (
    <div
      className="min-h-screen bg-[#FAF7F2] text-stone-900 antialiased"
      style={{ colorScheme: 'light' }}
    >
      {/* Site header (light variant) */}
      <ProjectHeader light />

      {/* Editorial hero — headline first, photo second */}
      <section className="max-w-6xl mx-auto px-5 pt-36 pb-6 text-center">
        <nav className="text-xs uppercase tracking-[0.2em] text-stone-600 mb-6">
          <Link href="/galleries" className="text-stone-600 hover:text-amber-800 transition-colors">
            Galleries
          </Link>
          <span className="mx-2 text-stone-500">/</span>
          <Link
            href={`/galleries/${data.slug}`}
            className="text-stone-600 hover:text-amber-800 transition-colors"
          >
            {data.country}
          </Link>
          <span className="mx-2 text-stone-500">/</span>
          <span className="text-stone-800">Guide</span>
        </nav>
        <p className="text-xs font-semibold tracking-[0.3em] uppercase text-amber-800 mb-5">
          Travel Guide — {data.country}
        </p>
        <h1
          className={`${fraunces.className} text-5xl sm:text-6xl md:text-7xl font-medium leading-[1.05] tracking-tight text-stone-900`}
        >
          {data.title}
        </h1>
        <p className="mt-5 text-lg md:text-xl text-stone-700 max-w-2xl mx-auto">{data.subtitle}</p>
        <p className="mt-6 text-xs uppercase tracking-[0.2em] text-stone-500">
          {data.places.length} places
          {totalStops > 1 &&
            ` · ${data.routes.length > 1 ? `${data.routes.length} suggested routes` : `${totalStops}-stop walk`}`}
        </p>
      </section>

      {/* Hero image */}
      <section className="max-w-6xl mx-auto px-5">
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/8] overflow-hidden rounded-xl">
          <Image src={data.heroImage} alt={data.heroAlt} fill priority className="object-cover" />
        </div>
        <p className="mt-3 text-xs text-stone-500 text-center italic">{data.heroAlt}</p>
      </section>

      <main className="max-w-3xl mx-auto px-5">
        {/* Intro with drop cap */}
        <section className="py-16 md:py-20 border-b border-stone-200">
          {data.intro.map((p, i) => (
            <p
              key={i}
              className={`${fraunces.className} text-lg md:text-xl leading-relaxed text-stone-700 mb-6 last:mb-0 ${
                i === 0
                  ? 'first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-7xl first-letter:leading-[0.8] first-letter:font-medium first-letter:text-amber-800'
                  : ''
              }`}
            >
              {p}
            </p>
          ))}
        </section>

        {/* Getting there — numbered journal notes */}
        {data.gettingThere.length > 0 && (
          <section className="py-16 md:py-20 border-b border-stone-200">
            <h2 className={`${fraunces.className} text-3xl md:text-4xl font-medium mb-10 text-stone-900`}>
              Getting there &amp; around
            </h2>
            <div className="space-y-8">
              {data.gettingThere.map((item, i) => (
                <div key={item.title} className="flex gap-5">
                  <span className={`${fraunces.className} text-2xl text-amber-800 shrink-0 w-10`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-semibold text-stone-900 mb-1">{item.title}</h3>
                    <p className="text-stone-700 leading-relaxed">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Suggested routes — one timeline section per route */}
        {data.routes.map((route) => {
          const routeStops = route.stops.map(
            (s) => s.query ?? `${s.place}, ${data.mapContext}`
          );
          const routeLink =
            routeStops.length > 1 ? googleDirectionsUrl(routeStops) : null;
          if (route.stops.length === 0) return null;
          return (
            <section
              key={route.title}
              className="py-16 md:py-20 border-b border-stone-200"
            >
            <h2 className={`${fraunces.className} text-3xl md:text-4xl font-medium mb-4 text-stone-900`}>
              {route.title}
            </h2>
            <p className="text-stone-700 leading-relaxed mb-10">{route.description}</p>

            <ol className="relative border-l-2 border-stone-300 ml-3 space-y-6">
              {route.stops.map((stop, i) => (
                <li key={i} className="relative pl-8">
                  <span className="absolute -left-[13px] top-0.5 w-6 h-6 rounded-full bg-amber-800 text-[#FAF7F2] flex items-center justify-center text-[11px] font-bold">
                    {i + 1}
                  </span>
                  <a
                    href={googleMapsUrl(stop.query ?? `${stop.place}, ${data.mapContext}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stone-800 font-medium hover:text-amber-800 transition-colors"
                  >
                    {stop.place}
                    <Icon icon="mdi:arrow-top-right" className="inline w-4 h-4 ml-1 -mt-0.5 text-stone-500" />
                  </a>
                </li>
              ))}
            </ol>

            {routeLink && (
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={routeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-stone-900 hover:bg-stone-800 text-[#FAF7F2] rounded-full text-sm font-medium transition-colors"
                >
                  <Icon icon={route.mode === 'driving' ? 'mdi:car' : 'mdi:walk'} className="w-4 h-4" />
                  Open full route in Google Maps
                </a>
                <a
                  href={appleDirectionsUrl(routeStops, route.mode)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-stone-400 hover:border-stone-600 text-stone-800 rounded-full text-sm font-medium transition-colors"
                >
                  <Icon icon="mdi:apple" className="w-4 h-4" />
                  Open in Apple Maps
                </a>
              </div>
            )}
          </section>
          );
        })}
      </main>

      {/* Places — wider section for 2-col cards */}
      <section className="max-w-6xl mx-auto px-5 py-16 md:py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className={`${fraunces.className} text-3xl md:text-4xl font-medium text-stone-900`}>
            Places I recommend
          </h2>
          <p className="text-stone-700 mt-3 mb-8">
            Everything I visited and would send a friend to. Starred entries are the ones I'd put at
            the top of the list.
          </p>
        </div>

        {/* Sticky filter bar */}
        <div className="sticky top-0 z-30 -mx-5 px-5 py-3 bg-[#FAF7F2] border-b border-stone-200 mb-10">
          <div className="max-w-6xl mx-auto flex items-center gap-3">
            <div className="flex-1 flex gap-2 overflow-x-auto no-scrollbar py-1">
              <FilterChip
                active={filter === 'all'}
                onClick={() => setFilter('all')}
                label={`All · ${data.places.length}`}
              />
              {data.categories.map((cat) => (
                <FilterChip
                  key={cat.id}
                  active={filter === cat.id}
                  onClick={() => setFilter(cat.id)}
                  icon={cat.icon}
                  label={`${cat.label} · ${data.places.filter((p) => p.category === cat.id).length}`}
                />
              ))}
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortMode)}
              className="shrink-0 bg-transparent border border-stone-300 rounded-full px-3 py-1.5 text-xs text-stone-700"
              aria-label="Sort places"
            >
              <option value="recommended">Recommended</option>
              <option value="az">A – Z</option>
            </select>
          </div>
        </div>

        <div className="space-y-16">
          {data.categories.map((cat, catIndex) => {
            const items = filtered.filter((p) => p.category === cat.id);
            if (items.length === 0) return null;
            return (
              <div key={cat.id}>
                <div className="max-w-3xl mx-auto flex items-baseline gap-4 mb-8">
                  <span className={`${fraunces.className} text-sm text-amber-800`}>
                    {String(catIndex + 1).padStart(2, '0')}
                  </span>
                  <h3 className={`${fraunces.className} text-2xl md:text-3xl font-medium text-stone-900`}>
                    {cat.label}
                  </h3>
                  <span className="flex-1 border-t border-stone-300" />
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  {items.map((p) => (
                    <JournalPlaceCard
                      key={p.name}
                      place={p}
                      mapContext={data.mapContext}
                      thumb={p.wikiTitle ? thumbnails[p.wikiTitle] : undefined}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <p className="text-stone-600 text-center py-12">No places in this category yet.</p>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200 py-12 text-center">
        <Link
          href={`/galleries/${data.slug}`}
          className="text-sm text-stone-600 hover:text-amber-800 transition-colors"
        >
          ← Back to the {data.country} photo gallery
        </Link>
      </footer>

      {/* Floating back-to-gallery button — expands on hover */}
      <Link
        href={`/galleries/${data.slug}`}
        className="group fixed bottom-6 right-6 z-40 flex h-14 items-center overflow-hidden rounded-full bg-stone-900 text-[#FAF7F2] shadow-lg transition-shadow duration-300 hover:shadow-xl"
        aria-label={`Back to the ${data.country} photo gallery`}
      >
        <span className="flex h-14 w-14 shrink-0 items-center justify-center">
          <Icon icon="mdi:camera-outline" className="w-6 h-6" />
        </span>
        <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium opacity-0 transition-all duration-300 group-hover:max-w-48 group-hover:pr-5 group-hover:opacity-100">
          Photo gallery
        </span>
      </Link>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon?: string;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm border transition-colors whitespace-nowrap ${
        active
          ? 'bg-stone-900 border-stone-900 text-[#FAF7F2]'
          : 'bg-white border-stone-300 text-stone-700 hover:border-stone-500 hover:text-stone-900'
      }`}
    >
      {icon && <Icon icon={icon} className="w-4 h-4" />}
      {label}
    </button>
  );
}

function JournalPlaceCard({
  place,
  mapContext,
  thumb,
}: {
  place: GuidePlace;
  mapContext: string;
  thumb?: string;
}) {
  const query = placeQuery(place, mapContext);
  return (
    <article className="relative bg-white border border-stone-200 rounded-xl p-6 flex flex-col hover:shadow-md hover:border-stone-300 transition-all">
      {thumb && (
        // eslint-disable-next-line @next/next/no-img-element -- small external wiki thumb, next/image not needed
        <img
          src={thumb}
          alt=""
          loading="lazy"
          className="absolute top-4 right-4 w-14 h-14 rounded-lg object-cover ring-1 ring-stone-200 shadow-sm"
        />
      )}
      <div className={`flex items-start justify-between gap-3 mb-1${thumb ? ' pr-16' : ''}`}>
        <h4 className={`${fraunces.className} text-xl font-medium leading-snug text-stone-900`}>{place.name}</h4>
        {place.featured && (
          <span className="inline-flex items-center gap-1 text-amber-700 text-xs font-semibold shrink-0 mt-1">
            <Icon icon="mdi:star" className="w-4 h-4" />
            Top pick
          </span>
        )}
      </div>
      {place.area && (
        <p className="text-[11px] uppercase tracking-[0.15em] text-stone-500 mb-3">{place.area}</p>
      )}
      <p className="text-stone-700 text-[15px] leading-relaxed">{place.description}</p>
      {place.tip && (
        <p className={`${fraunces.className} text-stone-600 text-[15px] mt-3 italic border-l-2 border-amber-700/40 pl-3`}>
          {place.tip}
        </p>
      )}
      <div className="flex items-center gap-5 mt-5 pt-4 border-t border-stone-100 text-sm">
        <a
          href={googleMapsUrl(query)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-stone-800 hover:text-amber-800 font-medium transition-colors"
        >
          Google Maps
          <Icon icon="mdi:arrow-top-right" className="w-3.5 h-3.5" />
        </a>
        <a
          href={appleMapsUrl(query)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-stone-800 hover:text-amber-800 font-medium transition-colors"
        >
          Apple Maps
          <Icon icon="mdi:arrow-top-right" className="w-3.5 h-3.5" />
        </a>
        {place.wikiTitle && (
          <a
            href={`https://en.wikipedia.org/wiki/${encodeURIComponent(place.wikiTitle)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto text-stone-500 hover:text-amber-800 transition-colors"
            aria-label={`${place.name} on Wikipedia`}
          >
            <Icon icon="mdi:wikipedia" className="w-5 h-5" />
          </a>
        )}
      </div>
    </article>
  );
}
