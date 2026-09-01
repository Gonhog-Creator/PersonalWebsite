'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { ProjectHeader } from '@/components/gallery/ProjectHeader';
import { ParticlesBackground } from '@/components/ParticlesBackground/ParticlesBackground';

const projectCards = [
  {
    num: '01',
    title: 'NIJ Certification Program',
    subtitle: 'Ballistic Armor Certification & International Testing',
    description:
      'Managed the complete U.S. ballistic testing and NIJ certification pipeline for multiple Delta V armor systems including RF1, RF2, HG2, ballistic shields, and ballistic glass. Developed a multi-product certification roadmap under NIJ 0101.07 covering qualification requirements, sample conditioning, shot placement, backface deformation measurement, and chain-of-custody documentation.',
    workflow: ['Prototype', 'Documentation', 'Export', 'U.S. Customs', 'Laboratory', 'Ballistic Testing', 'Certification'],
    skills: ['NIJ 0101.07', 'Ballistic Testing', 'Certification', 'Logistics', 'Regulatory Research', 'Project Management'],
  },
  {
    num: '02',
    title: 'Buenos Aires Ballistic Laboratory',
    subtitle: 'Designing an Independent Ballistic Testing Capability',
    description:
      'Evaluated the complete requirements for constructing an independent ballistic testing center in Buenos Aires. Developed reports covering facility design, range geometry, ballistic containment, velocity measurement, environmental conditioning, metrology, safety systems, and ISO/IEC 17025 / OAA accreditation pathways. Sourced equipment from specialist manufacturers across the U.S. and Europe using a systems-integration model.',
    workflow: ['Range Design', 'Instrumentation', 'Environmental Conditioning', 'Metrology', 'Data Systems', 'Safety', 'Quality System'],
    skills: ['Systems Engineering', 'Laboratory Design', 'Procurement', 'ISO 17025', 'OAA', 'NIJ', 'VPAM'],
  },
  {
    num: '03',
    title: 'DeltaDash',
    subtitle: 'Full-Stack Ballistic Test Data Platform',
    description:
      'Designed and developed a full-stack web application to organize ballistic testing and engineering data. Replaced fragmented test information with a relational system connecting individual tests, shots, protocols, armor samples, materials, configurations, and results. Deployed on Railway infrastructure to enable searchable, traceable engineering data across the organization.',
    workflow: ['Material', 'Product', 'Test', 'Shot', 'Result'],
    skills: ['Full-Stack Development', 'Databases', 'Engineering Software', 'Data Architecture', 'Railway'],
  },
  {
    num: '04',
    title: 'UHMWPE Manufacturing',
    subtitle: 'Building Internal Ballistic-Material Manufacturing Capability',
    description:
      'Planned the internal manufacturing capability for UHMWPE-based ballistic materials, covering equipment, process flow, material handling, commissioning, training, and quality control. Evaluated technology-transfer agreements including IP ownership, licensing, know-how rights, and acceptance testing. Coordinated with major ballistic-material suppliers including Avient/Dyneema for material development and qualification.',
    workflow: ['Raw Material', 'Processing', 'Lamination', 'QC', 'Armor Production', 'Testing'],
    skills: ['Advanced Materials', 'UHMWPE', 'Manufacturing Engineering', 'Technology Transfer', 'Supplier Development'],
  },
  {
    num: '05',
    title: 'Odoo Manufacturing ERP',
    subtitle: 'Creating Digital Traceability Across Production',
    description:
      'Implemented and structured Odoo for Delta V to connect engineering, manufacturing, and operations. Designed data structures for product families, BOMs, manufacturing orders, inventory, and quality control with full ballistic-product traceability from supplier material lot through manufacturing to ballistic test result. Integrated with existing accounting systems via SQL and API connectivity.',
    workflow: ['Supplier Lot', 'Inventory', 'BOM', 'Manufacturing Order', 'Serial Number', 'QC', 'Ballistic Test'],
    skills: ['Odoo', 'ERP Architecture', 'Manufacturing Systems', 'SQL/API Integration', 'Traceability'],
  },
  // {
  //   num: '06',
  //   title: 'Global Defense Supply Chain',
  //   subtitle: 'Moving Ballistic Products Between Argentina and the United States',
  //   description:
  //     'Coordinated the complete international logistics chain for shipping controlled ballistic products from Argentina to U.S. testing laboratories. Managed export documentation, ANMaC/RENAR compliance, customs brokers, air freight, U.S. customs clearance, and final-mile laboratory delivery. Researched ATF import requirements, USML classification, and HS-code considerations for body armor.',
  //   workflow: ['Argentina', 'Export / ANMaC', 'Air Freight', 'U.S. Customs', 'Laboratory'],
  //   skills: ['International Logistics', 'Customs', 'Compliance', 'Chain of Custody', 'Defense Manufacturing'],
  // },
  // {
  //   num: '07',
  //   title: 'Global Business Development',
  //   subtitle: 'International Defense Industry & Supplier Development',
  //   description:
  //     'Supported international defense-sector business development including attending EUROSATORY 2026 in Paris. Identified potential suppliers, evaluated competing technologies, explored partnerships, and expanded Delta V\u2019s supplier and partner network. Supported international expansion planning including operations in Angola and the United States.',
  //   workflow: ['EUROSATORY 2026', 'Supplier Scouting', 'Technology Evaluation', 'Partner Development', 'Angola Operations'],
  //   skills: ['Business Development', 'EUROSATORY 2026', 'Defense Industry', 'Technical Sourcing', 'International Operations'],
  // },
];

const skillCategories = [
  {
    category: 'Ballistic Engineering',
    skills: ['NIJ 0101.07', 'NIJ 0108.01', 'VPAM', 'STANAG', 'Ballistic Armor', 'Backface Deformation', 'Armor Certification'],
  },
  {
    category: 'Advanced Materials',
    skills: ['UHMWPE', 'Dyneema', 'Aramid', 'Ballistic Ceramics', 'Composite Armor', 'Material Qualification'],
  },
  {
    category: 'Manufacturing',
    skills: ['Manufacturing Systems', 'Technology Transfer', 'Process Development', 'Production Planning', 'Quality Control', 'Traceability', 'BOM Architecture'],
  },
  {
    category: 'Laboratory',
    skills: ['ISO/IEC 17025', 'OAA Accreditation', 'Ballistic Ranges', 'Metrology', 'Velocity Measurement', 'High-Speed Instrumentation', 'Calibration'],
  },
  {
    category: 'Software & Data',
    skills: ['DeltaDash', 'Full-Stack Development', 'Railway', 'Databases', 'APIs', 'SQL', 'Engineering Tools', 'AI/ML Concepts'],
  },
  {
    category: 'Operations',
    skills: ['Odoo', 'ERP', 'Supply Chain', 'International Logistics', 'Customs', 'Procurement', 'Supplier Development'],
  },
  {
    category: 'Business',
    skills: ['International Business Development', 'EUROSATORY 2026', 'Defense Industry', 'Technical Sourcing', 'Technical Program Management', 'Cross-Functional Coordination'],
  },
];

export default function DeltaVPage() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <ProjectHeader />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden flex items-center justify-center min-h-[60vh]">
        <div className="absolute inset-0 z-0">
          <Image
            src="/img/deltavcoverimage.jpg"
            alt="Delta V Blindajes"
            fill
            className="object-cover object-center"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-950/90 via-gray-900/85 to-blue-950/80" />
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/40 via-transparent to-transparent" />
        </div>

        <div className="max-w-4xl w-full mx-auto relative z-10 text-center px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6" data-aos="fade-up">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            Delta V Blindajes
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight" data-aos="fade-up" data-aos-delay="50">
            Engineering Defense Products<br />from Prototype to Production
          </h1>

          <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed" data-aos="fade-up" data-aos-delay="100">
            Working across the complete lifecycle of ballistic-protection systems — from advanced-material sourcing
            and product development through manufacturing systems, international logistics, ballistic testing,
            certification, and laboratory infrastructure.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-8" data-aos="fade-up" data-aos-delay="150">
            {['Argentina', 'United States', 'Paraguay', 'Angola'].map((loc) => (
              <div key={loc} className="px-4 py-2 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 text-gray-300 text-sm">
                {loc}
              </div>
            ))}
          </div>

          <a
            href="https://deltavblindajes.com.ar/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-medium hover:bg-blue-500/20 hover:border-blue-500/50 transition-all duration-300"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <span>Visit Company Website</span>
            <span className="text-xs">↗</span>
          </a>
        </div>
      </section>

      {/* Role Overview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl font-bold text-white mb-4">Role Overview</h2>
          </div>

          <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 md:p-12" data-aos="fade-up" data-aos-delay="50">
            <p className="text-gray-300 leading-relaxed mb-6">
              My work at Delta V Blindajes spans engineering, manufacturing, software, supply chain, and international
              business development. Rather than working within a single narrow function, I operate across the product
              and operational lifecycle — connecting engineering requirements with manufacturing, certification,
              logistics, and business decisions.
            </p>
            <p className="text-gray-300 leading-relaxed mb-8">
              My role frequently begins with an ambiguous problem — &ldquo;We need to certify this armor,&rdquo;
              &ldquo;We want to manufacture this material ourselves,&rdquo; &ldquo;We need our own ballistic laboratory&rdquo; —
              and from there, I determine what the complete process requires, identify the relevant organizations and
              technologies, structure the project, coordinate the necessary parties, and build the documentation or
              tools needed to execute it.
            </p>

            {/* Capability areas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Certification Programs', value: '5+' },
                { label: 'Countries Involved', value: '4' },
                { label: 'Major Project Areas', value: '5' },
                { label: 'Internal Softwares Built', value: '2' },
              ].map((stat) => (
                <div key={stat.label} className="text-center p-4 rounded-xl bg-gray-900/60 border border-gray-700/30">
                  <div className="text-2xl font-bold text-blue-400 mb-1">{stat.value}</div>
                  <div className="text-xs text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Major Project Cards */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl font-bold text-white mb-4">Major Projects</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Key initiatives spanning engineering, software, manufacturing, and international operations</p>
          </div>

          <div className="flex flex-col gap-8">
            {projectCards.map((project, index) => (
              <div
                key={project.num}
                className="group relative rounded-2xl bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 hover:border-blue-500/40 transition-all duration-300 overflow-hidden shadow-xl hover:shadow-blue-500/10"
                data-aos="fade-up"
                data-aos-delay={index * 50}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-500 pointer-events-none" />

                <div className="relative p-6 md:p-8">
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-3xl font-bold text-blue-500/30 font-mono shrink-0">{project.num}</div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-1">{project.title}</h3>
                      <p className="text-sm text-blue-400 font-medium">{project.subtitle}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-400 leading-relaxed mb-6">{project.description}</p>

                  {/* Workflow diagram */}
                  <div className="mb-6">
                    <div className="flex flex-wrap items-center gap-2">
                      {project.workflow.map((step, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="px-3 py-1.5 text-xs font-medium text-gray-300 rounded-lg bg-gray-900/80 border border-gray-700/50">
                            {step}
                          </span>
                          {i < project.workflow.length - 1 && (
                            <span className="text-blue-500/50 text-sm">→</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2">
                    {project.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 text-xs font-medium text-gray-300 rounded-md bg-gray-900/80 border border-gray-700/50"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills & Technologies */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-950">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl font-bold text-white mb-4">Technologies & Expertise</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Areas of technical depth developed through hands-on project work</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {skillCategories.map((cat, index) => (
              <div
                key={cat.category}
                className="bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6"
                data-aos="fade-up"
                data-aos-delay={index * 50}
              >
                <h3 className="text-lg font-semibold text-blue-400 mb-4">{cat.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 text-xs font-medium text-gray-300 rounded-md bg-gray-900/80 border border-gray-700/50"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative h-[6vh] w-full">
        <div className="absolute inset-0 w-full h-full">
          <ParticlesBackground particleCount={30} className="opacity-30" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 py-2 bg-gray-900/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-300 text-sm md:text-base">© 2026 Jose Maria Barbeito. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
