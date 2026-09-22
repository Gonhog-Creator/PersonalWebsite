import type { Metadata } from 'next';
import Link from 'next/link';
import { FaArrowLeft, FaSatellite, FaMicroscope, FaPython, FaStar, FaCamera } from 'react-icons/fa';
import { ProjectHeader } from '@/components/gallery/ProjectHeader';
import { pageMetadata } from '@/lib/og';
import { GearPhoto } from './GearPhoto';

export const metadata: Metadata = pageMetadata({
  title: 'Setup & Workflow',
  description: 'The telescopes, software, and processing pipeline behind my astrophotography.',
  path: '/astrophotography/setup',
  image: '/img/Astro/astro_pano.jpg',
});

interface GearItem {
  name: string;
  role: string;
  photo: string;
  specs?: string[];
  rig?: { part: string; item: string }[];
  blurb: string;
}

const gear: GearItem[] = [
  {
    name: 'ZWO Seestar S50',
    role: 'Smart telescope — grab-and-go imaging',
    photo: '/img/Astro/setup/seestar-s50.jpg',
    specs: ['50mm apochromatic triplet', '250mm focal length (f/5)', 'Sony IMX462 sensor', 'Built-in live stacking, goto, and tracking'],
    blurb:
      'My travel and quick-session scope. The Seestar handles polar alignment, goto, and live stacking entirely on its own, which makes it perfect for spontaneous clear nights and trips.',
  },
  {
    name: 'Askar 80PHQ',
    role: 'Primary imaging rig — mono narrowband & LRGB',
    photo: '/img/Astro/setup/askar-80phq.jpg',
    rig: [
      { part: 'Telescope', item: 'Askar 80PHQ — 80mm f/7.5 quadruplet Petzval, 600mm, flat-field optics' },
      { part: 'Camera', item: 'ZWO ASI6200MM Pro — full-frame 61MP IMX455 mono, cooled' },
      { part: 'Filters', item: 'ZWO EFW 2" electronic filter wheel + 2" LRGB & SHO narrowband set' },
      { part: 'Mount', item: 'Sky-Watcher EQ6-R Pro equatorial mount' },
      { part: 'Guiding', item: 'ZWO ASI533MM Pro guide camera' },
      { part: 'Focus', item: 'Electronic autofocuser (EAF)' },
    ],
    blurb:
      'The workhorse for deep space objects. The full mono imaging train — 6200MM, filter wheel, and the LRGB/SHO set — is what all of the SHO and HOO images on this site were shot with.',
  },
];

const seestarSteps = [
  'Capture and live-stack directly in the Seestar system — it handles calibration and stacking in the field',
  'Bring the stacked result into Siril for post-processing',
  'Stretch, crop, and finish in Siril',
];

const askarSteps = [
  'Stack each channel in PixInsight (SII / Ha / OIII for narrowband, or LRGB for broadband)',
  'Extract the RGB stars after stacking and set them aside',
  'Run BlurXTerminator, NoiseXTerminator, and StarXTerminator on the nebula data',
  'Apply SPCC (Spectrophotometric Color Calibration) to the RGB stars for accurate star color',
  'Add the corrected stars back onto the SHO or HOO nebula',
  'Final tuning with HistogramTransformation, CurvesTransformation, and a Lighthouse plugin',
];

const plannedPosts = [
  {
    icon: FaPython,
    title: 'Custom PixInsight Scripts',
    status: 'In progress',
    text: 'A series on the custom scripts I\'ve been developing to automate repetitive parts of my pipeline — stacking prep, channel combination, and batch operations.',
  },
  {
    icon: FaStar,
    title: 'SHO & HOO Narrowband Flow',
    status: 'Planned',
    text: 'How I map narrowband channels, when I choose SHO vs HOO, and how the starless nebula + corrected RGB stars come together.',
  },
  {
    icon: FaCamera,
    title: 'RGB Star Workflow',
    status: 'Planned',
    text: 'Extracting RGB stars after stacking, correcting them with SPCC, and blending them back into narrowband images for natural star color.',
  },
];

export default function SetupPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <ProjectHeader />

      <div className="pt-40 pb-20 px-4 sm:px-8 max-w-6xl mx-auto">
        <Link
          href="/astrophotography"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm mb-8"
        >
          <FaArrowLeft size={14} />
          Back to Astrophotography
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Setup &amp; Workflow</h1>
        <p className="text-lg text-gray-400 max-w-3xl">
          The gear I shoot with and the processing pipeline behind the images in this gallery.
        </p>

        {/* Gear */}
        <h2 className="text-2xl font-bold text-white mt-14 mb-6 flex items-center gap-3">
          <FaSatellite className="text-blue-400" />
          The Gear
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {gear.map(scope => (
            <div
              key={scope.name}
              className="bg-gray-900/60 rounded-xl border border-gray-800 overflow-hidden"
            >
              <GearPhoto
                src={scope.photo}
                alt={scope.name}
                className="w-full h-64"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-white">{scope.name}</h3>
                <p className="text-sm text-blue-400 mt-1">{scope.role}</p>
                {scope.rig ? (
                  <div className="mt-4 space-y-1.5">
                    {scope.rig.map(item => (
                      <div key={item.part} className="text-sm flex gap-3">
                        <span className="text-gray-500 w-20 flex-shrink-0">{item.part}</span>
                        <span className="text-gray-300">{item.item}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <ul className="mt-4 space-y-1.5">
                    {scope.specs?.map(spec => (
                      <li key={spec} className="text-sm text-gray-400 flex gap-2">
                        <span className="text-gray-600">•</span>
                        {spec}
                      </li>
                    ))}
                  </ul>
                )}
                <p className="text-sm text-gray-300 mt-4 leading-relaxed">{scope.blurb}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Processing */}
        <h2 className="text-2xl font-bold text-white mt-16 mb-6 flex items-center gap-3">
          <FaMicroscope className="text-purple-400" />
          Processing Workflow
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-900/60 rounded-xl border border-gray-800 p-6">
            <h3 className="text-lg font-bold text-white">Seestar S50</h3>
            <p className="text-sm text-purple-300 mt-1">Seestar stacking + Siril</p>
            <ol className="mt-5 space-y-4">
              {seestarSteps.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-300 leading-relaxed">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-900/50 text-purple-300 text-xs font-semibold flex items-center justify-center">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-gray-900/60 rounded-xl border border-gray-800 p-6">
            <h3 className="text-lg font-bold text-white">Askar 80PHQ</h3>
            <p className="text-sm text-purple-300 mt-1">PixInsight + AstroRC plugins + custom scripts</p>
            <ol className="mt-5 space-y-4">
              {askarSteps.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-300 leading-relaxed">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-900/50 text-blue-300 text-xs font-semibold flex items-center justify-center">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Future blog */}
        <h2 className="text-2xl font-bold text-white mt-16 mb-2">From the Workbench</h2>
        <p className="text-gray-400 text-sm mb-6">
          Deep dives into my processing workflow and the custom scripts I&apos;m building — coming soon.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plannedPosts.map(post => (
            <div
              key={post.title}
              className="bg-gray-900/60 rounded-xl border border-gray-800 p-6 flex flex-col"
            >
              <post.icon className="text-blue-400 mb-4" size={22} />
              <h3 className="text-base font-bold text-white">{post.title}</h3>
              <span className="inline-block mt-2 px-2 py-0.5 text-xs rounded-full bg-gray-800 text-gray-400 w-fit">
                {post.status}
              </span>
              <p className="text-sm text-gray-400 mt-3 leading-relaxed">{post.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
