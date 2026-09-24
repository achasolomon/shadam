export interface GalleryAlbum {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: string;
  coverImage: string;
  date: string;
  photoCount: number;
}

export interface GalleryPhoto {
  id: number;
  albumSlug: string;
  src: string;
  alt: string;
  caption?: string;
}

export const galleryCategories = [
  'All',
  'Events',
  'Outreach',
  'Workshops',
  'Community',
  'Team',
];

export const albums: GalleryAlbum[] = [
  {
    id: 1,
    slug: 'community-forum-kubwa-2025',
    title: 'Community Forum — Kubwa 2025',
    description: 'Our flagship community mental health awareness forum held in Kubwa, bringing together hundreds of community members.',
    category: 'Events',
    coverImage: '/images/projects/community-outreach.jpg',
    date: '2025-03-15',
    photoCount: 24,
  },
  {
    id: 2,
    slug: 'school-outreach-programme',
    title: 'School Outreach Programme',
    description: 'Mental health education sessions in secondary schools across Abuja, reaching students and teachers.',
    category: 'Outreach',
    coverImage: '/images/projects/educational-workshop.jpg',
    date: '2025-02-20',
    photoCount: 18,
  },
  {
    id: 3,
    slug: 'world-mental-health-day-2024',
    title: 'World Mental Health Day 2024',
    description: 'Our celebration of World Mental Health Day with community activities, talks and awareness walks.',
    category: 'Events',
    coverImage: '/images/banner/banner2.jpg',
    date: '2024-10-10',
    photoCount: 32,
  },
  {
    id: 4,
    slug: 'volunteer-training-workshop',
    title: 'Volunteer Training Workshop',
    description: 'Training session for SHEDAM volunteers on mental health first aid and peer support.',
    category: 'Workshops',
    coverImage: '/images/projects/support-referal-system.jpg',
    date: '2025-01-12',
    photoCount: 12,
  },
  {
    id: 5,
    slug: 'community-support-group',
    title: 'Community Support Group Session',
    description: 'Weekly support group sessions providing a safe space for individuals to share and heal together.',
    category: 'Community',
    coverImage: '/images/banner/banner3.jpeg',
    date: '2025-04-05',
    photoCount: 8,
  },
  {
    id: 6,
    slug: 'partnership-meeting-2024',
    title: 'Partnership Meeting 2024',
    description: 'Strategic partnership meeting with stakeholders and mental health organisations.',
    category: 'Team',
    coverImage: '/images/banner/hero-banner.png',
    date: '2024-11-28',
    photoCount: 15,
  },
];

export const photos: GalleryPhoto[] = [
  // Community Forum — Kubwa 2025
  { id: 1, albumSlug: 'community-forum-kubwa-2025', src: '/images/projects/community-outreach.jpg', alt: 'Community members gathered for the forum', caption: 'Opening ceremony' },
  { id: 2, albumSlug: 'community-forum-kubwa-2025', src: '/images/projects/awareness.jpg', alt: 'Awareness session in progress', caption: 'Awareness session' },
  { id: 3, albumSlug: 'community-forum-kubwa-2025', src: '/images/banner/banner1.jpg', alt: 'Venue setup', caption: 'Event venue' },
  { id: 4, albumSlug: 'community-forum-kubwa-2025', src: '/images/banner/banner2.jpg', alt: 'Group discussion', caption: 'Group activities' },
  // School Outreach
  { id: 5, albumSlug: 'school-outreach-programme', src: '/images/projects/educational-workshop.jpg', alt: 'Students during mental health education', caption: 'Student session' },
  { id: 6, albumSlug: 'school-outreach-programme', src: '/images/projects/community-outreach.jpg', alt: 'Teacher training', caption: 'Teacher training' },
  // World Mental Health Day
  { id: 7, albumSlug: 'world-mental-health-day-2024', src: '/images/banner/banner2.jpg', alt: 'Awareness walk', caption: 'Awareness walk' },
  { id: 8, albumSlug: 'world-mental-health-day-2024', src: '/images/projects/awareness.jpg', alt: 'Community celebration', caption: 'Community celebration' },
  { id: 9, albumSlug: 'world-mental-health-day-2024', src: '/images/banner/banner3.jpeg', alt: 'Team photo', caption: 'Our team' },
  // Volunteer Training
  { id: 10, albumSlug: 'volunteer-training-workshop', src: '/images/projects/support-referal-system.jpg', alt: 'Volunteers in training', caption: 'Training session' },
  // Community Support Group
  { id: 11, albumSlug: 'community-support-group', src: '/images/banner/banner3.jpeg', alt: 'Support group session', caption: 'Support circle' },
  // Partnership Meeting
  { id: 12, albumSlug: 'partnership-meeting-2024', src: '/images/banner/hero-banner.png', alt: 'Partnership meeting', caption: 'Strategic meeting' },
];

export function getAlbumBySlug(slug: string): GalleryAlbum | undefined {
  return albums.find((a) => a.slug === slug);
}

export function getPhotosByAlbum(albumSlug: string): GalleryPhoto[] {
  return photos.filter((p) => p.albumSlug === albumSlug);
}

export function getAlbumsByCategory(category: string): GalleryAlbum[] {
  if (category === 'All') return albums;
  return albums.filter((a) => a.category === category);
}
