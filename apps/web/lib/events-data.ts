export interface EventData {
  id: number;
  apiId?: string;
  slug: string;
  title: string;
  date: string;
  endAt?: string;
  dateDisplay: string;
  time: string;
  location: string;
  address: string;
  description: string;
  fullDescription: string;
  category: string;
  attendees: string;
  featured: boolean;
  flyer: string;
  gallery: string[];
  highlights: string[];
  agenda: { time: string; activity: string }[];
  speakers?: { name: string; role: string; image: string }[];
  requirements?: string[];
}

export const events: EventData[] = [
  {
    id: 1,
    slug: 'mental-health-awareness-community-forum',
    title: 'Mental Health Awareness Community Forum',
    date: '2026-03-15T10:00:00',
    dateDisplay: 'March 15, 2026',
    time: '10:00 AM - 2:00 PM',
    location: 'Christ the King Catholic Church, Kubwa, Abuja',
    address: 'Christ the King Catholic Church, Kubwa, Bwari Area Council, FCT Abuja, Nigeria',
    description:
      'An open forum for community members to learn about mental health, ask questions and connect with professionals.',
    fullDescription:
      'Join us for an open forum designed to bring mental health awareness directly to our community. This event brings together mental health professionals, community leaders and individuals seeking to understand mental health better. Through expert talks, interactive Q&A sessions and free consultations, we aim to break the stigma surrounding mental health and create a supportive environment where everyone feels comfortable seeking help. Whether you are personally affected by mental health challenges or want to support loved ones, this forum provides practical tools, resources and connections to professional care.',
    category: 'Community',
    attendees: '200+',
    featured: true,
    flyer: '/images/events/SHEDAMFLIER2.jpeg',
    gallery: [
      '/images/projects/community-outreach.jpg',
      '/images/projects/awareness.jpg',
      '/images/banner/banner2.jpg',
    ],
    highlights: [
      'Expert speakers on mental health topics',
      'Free one-on-one consultations',
      'Interactive Q&A sessions',
      'Resource materials and referrals',
      'Community networking opportunities',
      'Refreshments provided',
    ],
    agenda: [
      { time: '10:00 AM', activity: 'Registration & Welcome' },
      { time: '10:30 AM', activity: 'Opening Remarks by SHEDAM Director' },
      { time: '11:00 AM', activity: 'Keynote: Understanding Mental Health' },
      { time: '11:45 AM', activity: 'Panel Discussion: Breaking the Stigma' },
      { time: '12:30 PM', activity: 'Break & Networking' },
      { time: '1:00 PM', activity: 'Free Consultations & Q&A' },
      { time: '1:45 PM', activity: 'Closing Remarks & Resource Distribution' },
    ],
    speakers: [
      { name: 'Rev. Fr. Istifanus Sheyin', role: 'Clinical Psychologist & Co-Founder', image: '/images/projects/community-outreach.jpg' },
      { name: 'Dr. Amina Bello', role: 'Consultant Psychiatrist', image: '/images/projects/educational-workshop.jpg' },
    ],
    requirements: ['Valid ID', 'Comfortable clothing', 'Open mind and willingness to learn'],
  },
  {
    id: 2,
    slug: 'youth-mental-health-workshop',
    title: 'Youth Mental Health Workshop',
    date: '2026-04-08T11:00:00',
    dateDisplay: 'April 8, 2026',
    time: '11:00 AM - 1:00 PM',
    location: 'Government Secondary School, Bwari, Abuja',
    address: 'Government Secondary School, Bwari, Bwari Area Council, FCT Abuja, Nigeria',
    description:
      'Interactive workshop for secondary school students on stress management, emotional wellbeing and seeking help.',
    fullDescription:
      'This workshop is specifically designed for secondary school students to equip them with practical mental health skills. Through interactive sessions, role-playing exercises and group activities, participants will learn how to manage stress, understand their emotions and know when and how to seek help. Our trained facilitators create a safe, engaging environment where young people feel comfortable discussing mental health openly. The workshop covers recognising warning signs in themselves and peers, healthy coping strategies, building resilience and navigating the challenges of adolescence. Every student leaves with a personal action plan and resource kit.',
    category: 'Education',
    attendees: '150+',
    featured: false,
    flyer: '/images/events/flyer1.png',
    gallery: [
      '/images/projects/educational-workshop.jpg',
      '/images/projects/community-outreach.jpg',
    ],
    highlights: [
      'Age-appropriate content',
      'Interactive exercises and role-play',
      'Personal coping strategies',
      'Peer support techniques',
      'Resource kit for every student',
      'Follow-up support available',
    ],
    agenda: [
      { time: '11:00 AM', activity: 'Welcome & Ice Breaker' },
      { time: '11:15 AM', activity: 'Session 1: What Is Mental Health?' },
      { time: '11:45 AM', activity: 'Session 2: Managing Stress & Emotions' },
      { time: '12:15 PM', activity: 'Group Activity: Building Resilience' },
      { time: '12:45 PM', activity: 'Q&A & Resource Distribution' },
      { time: '1:00 PM', activity: 'Closing & Personal Action Plans' },
    ],
    requirements: ['School uniform or casual wear', 'Notebook and pen', 'Willingness to participate'],
  },
  {
    id: 3,
    slug: 'workplace-wellness-seminar',
    title: 'Workplace Wellness Seminar',
    date: '2026-05-20T09:00:00',
    dateDisplay: 'May 20, 2026',
    time: '9:00 AM - 12:00 PM',
    location: 'Transcorp Hilton, Abuja',
    address: 'Transcorp Hilton, 1 Aguiyi Ironsi Street, Maitama, Abuja, Nigeria',
    description:
      'A seminar for HR professionals and organisational leaders on building mentally healthy workplaces.',
    fullDescription:
      'This seminar is tailored for HR professionals, organisational leaders and wellness coordinators who want to create mentally healthy workplaces. Learn from experts about implementing employee assistance programmes, recognising burnout, reducing workplace stress and building a culture of psychological safety. The session covers legal frameworks, best practices from leading organisations and practical implementation strategies. Attendees will receive a comprehensive toolkit for workplace mental health initiatives, including policy templates, assessment tools and resource guides. Network with peers facing similar challenges and leave with actionable steps to transform your workplace culture.',
    category: 'Corporate',
    attendees: '100+',
    featured: false,
    flyer: '/images/events/flyer3.png',
    gallery: [
      '/images/banner/banner2.jpg',
      '/images/projects/awareness.jpg',
    ],
    highlights: [
      'Expert-led sessions',
      'Policy templates included',
      'Case study presentations',
      'Networking opportunities',
      'Implementation toolkit',
      'Certificate of participation',
    ],
    agenda: [
      { time: '9:00 AM', activity: 'Registration & Coffee' },
      { time: '9:30 AM', activity: 'Opening Keynote: The Business Case for Mental Health' },
      { time: '10:15 AM', activity: 'Session 1: Recognising & Preventing Burnout' },
      { time: '11:00 AM', activity: 'Break' },
      { time: '11:15 AM', activity: 'Session 2: Building Psychologically Safe Workplaces' },
      { time: '11:45 AM', activity: 'Panel: HR Leaders Share Best Practices' },
      { time: '12:00 PM', activity: 'Closing & Toolkit Distribution' },
    ],
    speakers: [
      { name: 'Rev. Fr. Dr. Christopher Damina', role: 'Guidance & Counselling Expert', image: '/images/projects/community-outreach.jpg' },
      { name: 'Mrs. Fatima Abdullahi', role: 'HR Director, Former NASDACOM', image: '/images/projects/educational-workshop.jpg' },
    ],
    requirements: ['Business attire', 'Company ID', 'Pre-event questionnaire (sent via email)'],
  },
  {
    id: 4,
    slug: 'community-outreach-program',
    title: 'Community Outreach Program',
    date: '2026-06-10T09:00:00',
    dateDisplay: 'June 10, 2026',
    time: '9:00 AM - 3:00 PM',
    location: 'Gwagwalada, Abuja',
    address: 'Gwagwalada Area Council, FCT Abuja, Nigeria',
    description:
      'Providing free mental health screenings and consultations in underserved communities.',
    fullDescription:
      'Our community outreach programme brings professional mental health support directly to underserved areas where access to care is limited. This full-day event provides free mental health screenings, one-on-one consultations with licensed professionals, medication reviews and referrals for ongoing care. Our team of psychologists, counsellors and community health workers will be on hand to serve individuals and families. We also distribute educational materials, connect attendees with support groups and provide follow-up care coordination. This programme is part of our commitment to ensuring no one is left behind due to location or economic circumstances.',
    category: 'Community',
    attendees: '300+',
    featured: false,
    flyer: '/images/events/SHEDAMFLIER2.jpeg',
    gallery: [
      '/images/projects/community-outreach.jpg',
      '/images/projects/support-referal-system.jpg',
      '/images/banner/banner3.jpeg',
    ],
    highlights: [
      'Free mental health screenings',
      'One-on-one professional consultations',
      'Medication reviews',
      'Referral coordination',
      'Educational materials',
      'Follow-up care support',
    ],
    agenda: [
      { time: '9:00 AM', activity: 'Setup & Registration' },
      { time: '9:30 AM', activity: 'Welcome Address' },
      { time: '10:00 AM', activity: 'Mental Health Awareness Talk' },
      { time: '10:30 AM', activity: 'Free Screenings Begin' },
      { time: '12:00 PM', activity: 'Break & Community Lunch' },
      { time: '1:00 PM', activity: 'Consultations Continue' },
      { time: '2:30 PM', activity: 'Referrals & Follow-up Coordination' },
      { time: '3:00 PM', activity: 'Closing & Distribution of Resources' },
    ],
    requirements: ['Valid ID (if available)', 'List of current medications (if any)', 'Openness to share health concerns'],
  },
];

export function getEventBySlug(slug: string): EventData | undefined {
  return events.find((e) => e.slug === slug);
}

export function getUpcomingEvents(): EventData[] {
  return events.filter((e) => new Date(e.date) > new Date());
}

export function getRelatedEvents(currentSlug: string, limit = 3): EventData[] {
  return events.filter((e) => e.slug !== currentSlug).slice(0, limit);
}
