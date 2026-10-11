// Cream loading screen shown while a guide page's server work
// (e.g. the Wikipedia thumbnail fetch) resolves.
export function GuideLoading() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
      <p className="text-stone-500 text-sm uppercase tracking-[0.3em]">Loading guide…</p>
    </div>
  );
}
