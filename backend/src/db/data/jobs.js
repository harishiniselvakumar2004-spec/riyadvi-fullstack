const job = (slug, title, department, designation, experience, location, type, summary, responsibilities, requirements, daysAgo) => (
  { slug, department, designation, experience, daysAgo, data: { title, location, type, summary, responsibilities, requirements, benefits: ['Flexible hours', 'Learning budget', 'Premium project exposure', 'Performance bonuses'] } });

module.exports = [
  job('senior-react-developer', 'Senior React / Next.js Developer', 'Engineering', 'Senior Developer', '3-5 years', 'Tiruppur / Hybrid', 'Full-time',
    'Lead the build of premium, high-performance web experiences for our clients.',
    ['Architect scalable React and Next.js applications', 'Review code and mentor junior developers', 'Collaborate with design on motion and 3D', 'Own performance and accessibility'],
    ['3+ years with React and TypeScript/JavaScript', 'Experience with REST APIs and state management', 'Familiarity with GSAP or Three.js is a plus', 'Strong communication'], 4),
  job('nodejs-backend-developer', 'Node.js Backend Developer', 'Engineering', 'Developer', '1-3 years', 'Tiruppur / Remote', 'Full-time',
    'Design APIs and data models that power client products.',
    ['Build REST APIs with Express', 'Model data in PostgreSQL / MongoDB', 'Write secure, validated endpoints', 'Deploy and monitor services'],
    ['Solid Node.js and SQL/NoSQL fundamentals', 'Understanding of auth and security basics', 'Git and CI familiarity'], 9),
  job('ui-ux-designer', 'UI/UX Designer', 'Design', 'Designer', '1-3 years', 'Tiruppur / Hybrid', 'Full-time',
    'Craft intuitive, beautiful interfaces and design systems.',
    ['Run discovery and create user flows', 'Design high-fidelity prototypes in Figma', 'Maintain a shared design system', 'Partner with developers during build'],
    ['Strong portfolio of web/app work', 'Proficiency in Figma', 'Understanding of accessibility'], 12),
  job('3d-artist', '3D Artist (Blender)', 'Design', 'Artist', '1-3 years', 'Tiruppur', 'Full-time',
    'Create optimised 3D models and animations for web and AR/VR.',
    ['Model and texture production-ready assets', 'Optimise for real-time performance', 'Export glTF for web and AR', 'Support interactive scenes'],
    ['Blender proficiency', 'PBR texturing knowledge', 'Awareness of web 3D constraints'], 15),
  job('digital-marketing-executive', 'Digital Marketing Executive', 'Marketing', 'Executive', '0-1 years', 'Tiruppur', 'Full-time',
    'Plan and run SEO and paid campaigns for growing brands.',
    ['Execute SEO and content plans', 'Manage Google and Meta ad accounts', 'Report on performance weekly', 'Support social media calendars'],
    ['Basics of SEO and ads platforms', 'Analytical mindset', 'Good written English'], 20),
  job('web-development-intern', 'Web Development Intern', 'Engineering', 'Intern', '0-1 years', 'Tiruppur', 'Internship',
    'Learn modern web development on real client projects.',
    ['Build UI components', 'Fix bugs and write small features', 'Learn code review and Git workflows'],
    ['HTML, CSS, JavaScript basics', 'Eagerness to learn', 'Portfolio or GitHub projects'], 2),
];
