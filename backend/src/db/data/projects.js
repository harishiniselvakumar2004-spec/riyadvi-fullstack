// NOTE: Client details below are illustrative sample content — replace with approved case-study copy.
const make = (slug, title, industry, services, tech, summary, gradient, extra = {}) => ({
  slug, featured: !!extra.featured, presentation: extra.presentation || 'standard',
  data: {
    title, client: title, industry, year: extra.year || 2025, services, technologies: tech, summary, gradient,
    challenge: extra.challenge || `${title} needed a stronger digital presence that matched the quality of its offline brand and made it easier for customers to take action.`,
    solution: extra.solution || `Riyadvi designed a conversion-focused experience, built on a scalable stack, with a clear content structure and measurable goals.`,
    results: extra.results || [{ value: '2.4×', label: 'Enquiries' }, { value: '-38%', label: 'Bounce rate' }, { value: '95+', label: 'Lighthouse score' }],
    presentation: extra.presentation || 'standard',
  },
});

module.exports = [
  make('puratap', 'Puratap', 'Water Technology', ['web-development', 'ui-ux-design', 'digital-marketing'], ['React', 'Node.js', 'MongoDB', 'Three.js'],
    'A product-led website with an interactive 3D explorer for water-purification systems.', ['#D4AF37', '#1b1405'],
    { featured: true, presentation: '3d', results: [{ value: '3.1×', label: 'Product enquiries' }, { value: '62%', label: 'Longer sessions' }, { value: '98', label: 'Lighthouse' }],
      challenge: 'Customers struggled to understand how the product works and compare models from static photos.',
      solution: 'We built an interactive 3D product explorer with annotated hotspots, backed by a lead-capture flow and a lightweight CMS.' }),
  make('wanaromah', 'Wanaromah Perfumers', 'Luxury Retail', ['web-development', 'ui-ux-design', '3d-modeling'], ['Next.js', 'Shopify', 'GSAP'],
    'A sensory, editorial e-commerce experience for an artisanal perfume house.', ['#c9a24b', '#120d05'], { featured: true }),
  make('laxmi-astro-ai', 'Laxmi Astro AI', 'AI / Consumer App', ['app-development', 'ui-ux-design'], ['React Native', 'Node.js', 'OpenAI API', 'PostgreSQL'],
    'An AI-assisted astrology app with personalised daily guidance and subscriptions.', ['#8a6d1f', '#0a0a14'], { featured: true }),
  make('tony-and-guy', 'Tony & Guy', 'Salon & Beauty', ['web-development', 'digital-marketing'], ['WordPress', 'PHP', 'Google Ads'],
    'Local landing pages and a booking funnel that increased appointments across outlets.', ['#e3c36a', '#17120a']),
  make('studio11', 'Studio11', 'Creative Agency', ['web-development', 'ui-ux-design'], ['Next.js', 'Framer Motion', 'Sanity'],
    'A motion-rich portfolio site with a headless CMS for the studio team.', ['#d4af37', '#0d0d0d']),
  make('sivam-physio-care', 'Sivam Physio Care', 'Healthcare', ['web-development', 'digital-marketing'], ['React', 'Express', 'MySQL'],
    'Trust-first clinic website with online booking and local SEO.', ['#b8962e', '#0b1210']),
  make('pearl-housing', 'Pearl Housing', 'Real Estate', ['web-development', 'ar-vr', '3d-modeling'], ['Next.js', 'Three.js', 'Blender'],
    'Property showcase with 3D walkthroughs and an enquiry pipeline.', ['#d9b648', '#101010']),
  make('nugenica-biotech-lab', 'Nugenica Biotech Lab', 'Biotech', ['web-development', 'ui-ux-design'], ['React', 'Node.js', 'PostgreSQL'],
    'Scientific credibility meets clean design: services, research and a client portal.', ['#9c7f2a', '#07110f']),
  make('visdoc', 'VisDoc', 'HealthTech SaaS', ['app-development', 'ui-ux-design', 'web-development'], ['React', 'Node.js', 'MongoDB'],
    'A document-visualisation platform with role-based dashboards.', ['#caa43a', '#0c0c12']),
  make('cube-dental', 'Cube Dental', 'Dental Care', ['web-development', 'digital-marketing'], ['WordPress', 'GA4', 'Meta Ads'],
    'Appointment-driven website and paid campaigns for a multi-chair dental clinic.', ['#e0c067', '#121212']),
];
