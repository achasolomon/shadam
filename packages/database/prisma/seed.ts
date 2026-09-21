import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create roles
  const roles = [
    {
      id: 'role-super-admin',
      name: 'Super Admin',
      description: 'Full system administration',
      permissions: { '*': '*' },
    },
    {
      id: 'role-content-manager',
      name: 'Content Manager',
      description: 'Create/edit/publish general content',
      permissions: { pages: '*', projects: '*', articles: '*', stories: '*', events: '*', resources: '*' },
    },
    {
      id: 'role-media-manager',
      name: 'Media Manager',
      description: 'Media and gallery management',
      permissions: { media: '*', gallery: '*' },
    },
    {
      id: 'role-editor',
      name: 'Editor',
      description: 'Review and approve content',
      permissions: { review: '*', publish: '*' },
    },
    {
      id: 'role-events-manager',
      name: 'Events Manager',
      description: 'Events, registrations and countdown',
      permissions: { events: '*' },
    },
    {
      id: 'role-support-officer',
      name: 'Support Officer',
      description: 'Enquiries/support workflows',
      permissions: { enquiries: '*' },
    },
    {
      id: 'role-read-only',
      name: 'Read Only',
      description: 'View content/status/reporting',
      permissions: { read: '*' },
    },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { id: role.id },
      update: {},
      create: role,
    });
  }
  console.log('Roles seeded.');

  // Create default site settings
  const settings = [
    { key: 'site_name', value: 'SHEDAM Mental Health Initiative', type: 'TEXT', groupName: 'general' },
    { key: 'site_tagline', value: 'Creating Awareness. Breaking the Stigma. Connecting People to Professional Help.', type: 'TEXTAREA', groupName: 'general' },
    { key: 'contact_email', value: 'info@shedam.org', type: 'TEXT', groupName: 'contact' },
    { key: 'contact_phone', value: '+234 XXX XXX XXXX', type: 'TEXT', groupName: 'contact' },
    { key: 'contact_address', value: '', type: 'TEXTAREA', groupName: 'contact' },
    { key: 'support_whatsapp', value: '', type: 'TEXT', groupName: 'support' },
    { key: 'support_phone', value: '', type: 'TEXT', groupName: 'support' },
    { key: 'support_email', value: 'support@shedam.org', type: 'TEXT', groupName: 'support' },
    { key: 'facebook_url', value: '', type: 'TEXT', groupName: 'social' },
    { key: 'twitter_url', value: '', type: 'TEXT', groupName: 'social' },
    { key: 'instagram_url', value: '', type: 'TEXT', groupName: 'social' },
    { key: 'linkedin_url', value: '', type: 'TEXT', groupName: 'social' },
    { key: 'youtube_url', value: '', type: 'TEXT', groupName: 'social' },
  ];

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }
  console.log('Site settings seeded.');

  // Create default navigation items
  const navItems = [
    { id: 'nav-home', label: 'Home', url: '/', sortOrder: 0, location: 'HEADER' as const },
    { id: 'nav-about', label: 'About Us', url: '/about', sortOrder: 1, location: 'HEADER' as const },
    { id: 'nav-what-we-do', label: 'What We Do', url: '/what-we-do', sortOrder: 2, location: 'HEADER' as const },
    { id: 'nav-projects', label: 'Projects', url: '/projects', sortOrder: 3, location: 'HEADER' as const },
    { id: 'nav-events', label: 'Events', url: '/events', sortOrder: 4, location: 'HEADER' as const },
    { id: 'nav-insights', label: 'Insights', url: '/insights', sortOrder: 5, location: 'HEADER' as const },
    { id: 'nav-gallery', label: 'Gallery', url: '/gallery', sortOrder: 6, location: 'HEADER' as const },
    { id: 'nav-contact', label: 'Contact', url: '/contact', sortOrder: 7, location: 'HEADER' as const },
    { id: 'nav-get-help', label: 'Get Help', url: '/get-help', sortOrder: 0, location: 'HEADER' as const, isExternal: false },
    { id: 'nav-support', label: 'Support Us', url: '/get-involved/support-us', sortOrder: 8, location: 'HEADER' as const },
  ];

  for (const item of navItems) {
    await prisma.navigationItem.upsert({
      where: { id: item.id },
      update: {},
      create: item,
    });
  }
  console.log('Navigation items seeded.');

  // Create default homepage sections
  const sections = [
    { id: 'hs-hero', sectionType: 'hero', title: 'Hero', sortOrder: 0, config: {} },
    { id: 'hs-event-countdown', sectionType: 'event_countdown', title: 'Event Countdown', sortOrder: 1, config: {} },
    { id: 'hs-about', sectionType: 'about_preview', title: 'About Preview', sortOrder: 2, config: {} },
    { id: 'hs-services', sectionType: 'services', title: 'Our Services', sortOrder: 3, config: {} },
    { id: 'hs-projects', sectionType: 'projects', title: 'Our Projects', sortOrder: 4, config: {} },
    { id: 'hs-impact', sectionType: 'impact', title: 'Our Impact', sortOrder: 5, config: {} },
    { id: 'hs-gallery', sectionType: 'gallery_preview', title: 'Gallery Preview', sortOrder: 6, config: {} },
    { id: 'hs-get-help', sectionType: 'get_help', title: 'Get Help', sortOrder: 7, config: {} },
    { id: 'hs-newsletter', sectionType: 'newsletter', title: 'Stay Updated', sortOrder: 8, config: {} },
  ];

  for (const section of sections) {
    await prisma.homepageSection.upsert({
      where: { id: section.id },
      update: {},
      create: section,
    });
  }
  console.log('Homepage sections seeded.');

  console.log('Database seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
