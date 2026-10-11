// Fetch Wikipedia page images in a single batch request (24h cached).
// Returns a map keyed by the requested wikiTitle, following redirects.
export async function getWikiThumbnails(titles: string[]): Promise<Record<string, string>> {
  const unique = [...new Set(titles.filter(Boolean))];
  if (unique.length === 0) return {};

  try {
    const url =
      'https://en.wikipedia.org/w/api.php?' +
      new URLSearchParams({
        action: 'query',
        format: 'json',
        prop: 'pageimages',
        pithumbsize: '400',
        redirects: '1',
        titles: unique.join('|'),
      });
    const res = await fetch(url, {
      next: { revalidate: 86400 },
      headers: { 'User-Agent': 'JoseBarbeito-TravelGuide/1.0' },
    });
    if (!res.ok) return {};
    const json = await res.json();

    // Index thumbnails by final (resolved) page title
    const byResolved: Record<string, string> = {};
    for (const page of Object.values(json.query?.pages ?? {}) as {
      title?: string;
      thumbnail?: { source?: string };
    }[]) {
      if (page.title && page.thumbnail?.source) byResolved[page.title] = page.thumbnail.source;
    }

    // Map requested title -> resolved title via normalization + redirects
    const map = (list: { from: string; to: string }[] = []) =>
      list.reduce<Record<string, string>>((acc, { from, to }) => {
        acc[from] = to;
        return acc;
      }, {});
    const normalized = map(json.query?.normalized);
    const redirects = map(json.query?.redirects);
    const resolve = (t: string) => redirects[normalized[t] ?? t] ?? normalized[t] ?? t;

    return Object.fromEntries(
      unique
        .map((t) => [t, byResolved[resolve(t)]] as const)
        .filter((e): e is readonly [string, string] => Boolean(e[1]))
    );
  } catch {
    return {};
  }
}
