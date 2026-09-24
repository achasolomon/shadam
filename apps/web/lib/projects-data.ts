import { resolveMediaUrl } from '@/lib/api';

export interface ProjectData {
  id: number;
  slug: string;
  title: string;
  category: string;
  description: string;
  fullDescription: string;
  status: string;
  location: string;
  raised: number;
  goal: number;
  image: string;
  gallery: string[];
  beneficiaries: string;
  startDate: string;
  highlights: string[];
  impact: string[];
  milestones: { date: string; title: string; description: string }[];
  allocation: { item: string; percentage: number; description: string }[];
  team?: { name: string; role: string; image: string }[];
  testimonials?: { name: string; role: string; quote: string }[];
}

export const projects: ProjectData[] = [
  {
    id: 1,
    slug: 'mental-health-awareness-campaigns',
    title: 'Mental Health Awareness Campaigns',
    category: 'Community',
    description:
      'Public campaigns to break stigma and promote understanding of mental health in underserved communities across Nigeria.',
    fullDescription:
      'Our Mental Health Awareness Campaigns are the cornerstone of SHEDAM\'s mission to create a society where mental health is understood, accepted and prioritised. Through a multi-channel approach combining community forums, public events, media engagement and digital outreach, we reach thousands of individuals each year with accurate, compassionate mental health information.\n\nWe work with community leaders, religious institutions, schools and local government to ensure our messages reach every corner of society. Our campaigns are designed to challenge harmful myths, reduce stigma and encourage people to seek help when they need it. Every campaign includes resource distribution, professional consultations and follow-up support to ensure lasting impact.',
    status: 'Ongoing',
    location: 'FCT Abuja & surrounding states',
    raised: 2500000,
    goal: 5000000,
    image: '/images/projects/awareness.jpg',
    gallery: [
      '/images/projects/community-outreach.jpg',
      '/images/projects/awareness.jpg',
      '/images/banner/banner2.jpg',
      '/images/banner/banner3.jpeg',
    ],
    beneficiaries: '1,200+',
    startDate: '2023',
    highlights: [
      'Community forums and town halls',
      'Public awareness campaigns',
      'Media engagement (TV, radio, print)',
      'Digital outreach and social media',
      'Resource distribution',
      'Free consultations at events',
    ],
    impact: [
      'Reduced stigma in 12+ communities',
      'Increased willingness to seek help by 40%',
      'More families openly discussing mental health',
      'Stronger community support networks',
      'Greater media coverage of mental health issues',
    ],
    milestones: [
      { date: 'Jan 2023', title: 'Campaign Launch', description: 'Launched first community forum in Kubwa with 150 attendees' },
      { date: 'Jun 2023', title: 'Media Partnership', description: 'Partnered with local TV and radio stations for weekly mental health segments' },
      { date: 'Dec 2023', title: '1,000 Reach', description: 'Reached 1,000 individuals through community campaigns' },
      { date: 'Jun 2024', title: 'State Expansion', description: 'Expanded campaigns to 3 additional states in North-Central Nigeria' },
    ],
    allocation: [
      { item: 'Community Events', percentage: 40, description: 'Venue, logistics, materials for community forums' },
      { item: 'Media & Digital', percentage: 25, description: 'Social media campaigns, radio/TV spots, content creation' },
      { item: 'Resource Materials', percentage: 20, description: 'Pamphlets, guides, educational materials in local languages' },
      { item: 'Personnel', percentage: 15, description: 'Facilitators, coordinators, community health workers' },
    ],
    testimonials: [
      { name: 'Mrs. Grace Okonkwo', role: 'Community Leader, Kubwa', quote: 'SHEDAM\'s campaign changed how our community views mental health. People are no longer afraid to seek help.' },
      { name: 'Alhaji Musa Ibrahim', role: 'District Head, Bwari', quote: 'The awareness programme has been transformative. We now have families supporting each other through mental health challenges.' },
    ],
  },
  {
    id: 2,
    slug: 'school-mental-health-programme',
    title: 'School Mental Health Programme',
    category: 'Education',
    description:
      'Workshops and seminars in secondary schools teaching young people about mental health, coping strategies and where to seek help.',
    fullDescription:
      'Our School Mental Health Programme brings age-appropriate mental health education directly to secondary school students across the FCT. Through interactive workshops, role-playing exercises and group activities, we equip young people with practical skills to manage stress, understand their emotions and support their peers.\n\nThe programme also includes teacher training sessions to help educators recognise warning signs and create supportive classroom environments. Parent sessions ensure families understand how to support their children\'s mental wellbeing at home. Every student receives a personal action plan and resource kit to continue their learning after the workshop.',
    status: 'Ongoing',
    location: 'FCT Abuja',
    raised: 900000,
    goal: 2000000,
    image: '/images/projects/educational-workshop.jpg',
    gallery: [
      '/images/projects/educational-workshop.jpg',
      '/images/projects/community-outreach.jpg',
    ],
    beneficiaries: '850+',
    startDate: '2023',
    highlights: [
      'Age-appropriate mental health curriculum',
      'Interactive workshops and role-play',
      'Teacher training sessions',
      'Parent awareness sessions',
      'Personal action plans for students',
      'Resource kits for every participant',
    ],
    impact: [
      '850+ students trained in mental health skills',
      '8 schools with active mental health clubs',
      'Teachers better equipped to support students',
      'Parents more aware of youth mental health',
      'Reduced bullying related to mental health',
    ],
    milestones: [
      { date: 'Feb 2023', title: 'Pilot Launch', description: 'Launched pilot programme in 2 secondary schools in Kubwa' },
      { date: 'Sep 2023', title: 'School Expansion', description: 'Expanded to 6 schools across Bwari Area Council' },
      { date: 'Mar 2024', title: 'Teacher Training', description: 'Trained 50+ teachers on recognising mental health signs' },
      { date: 'Jan 2025', title: 'Curriculum Development', description: 'Developed comprehensive mental health curriculum for FCT schools' },
    ],
    allocation: [
      { item: 'School Workshops', percentage: 45, description: 'Materials, facilitators, student engagement activities' },
      { item: 'Teacher Training', percentage: 25, description: 'Training sessions, materials, follow-up support' },
      { item: 'Resource Kits', percentage: 20, description: 'Student notebooks, guides, action plan templates' },
      { item: 'Programme Management', percentage: 10, description: 'Coordination, monitoring, evaluation' },
    ],
  },
  {
    id: 3,
    slug: 'community-support-networks',
    title: 'Community Support Networks',
    category: 'Community',
    description:
      'Building peer support groups and safe spaces in local communities where individuals can share and receive ongoing emotional support.',
    fullDescription:
      'Our Community Support Networks programme creates safe, welcoming spaces where individuals dealing with mental health challenges can connect with others who understand their experience. Through trained peer facilitators, we establish support groups that meet regularly to share experiences, learn coping strategies and build meaningful connections.\n\nThese networks provide ongoing emotional support that extends beyond formal treatment, helping individuals feel less isolated and more empowered in their recovery journey. We also train community volunteers to recognise warning signs and connect people with professional help when needed.',
    status: 'Ongoing',
    location: 'Kubwa, Bwari & Gwagwalada',
    raised: 3200000,
    goal: 4000000,
    image: '/images/projects/community-outreach.jpg',
    gallery: [
      '/images/projects/community-outreach.jpg',
      '/images/projects/awareness.jpg',
    ],
    beneficiaries: '500+',
    startDate: '2022',
    highlights: [
      'Peer support groups',
      'Safe spaces for sharing',
      'Trained peer facilitators',
      'Ongoing check-ins',
      'Community volunteer training',
      'Crisis support coordination',
    ],
    impact: [
      '500+ individuals in active support groups',
      'Reduced isolation for participants',
      'Stronger community bonds',
      'Improved mental health outcomes',
      'Sustainable support systems',
    ],
    milestones: [
      { date: 'Aug 2022', title: 'First Group', description: 'Established first peer support group in Kubwa with 15 members' },
      { date: 'Mar 2023', title: 'Bwari Expansion', description: 'Expanded to Bwari with 2 additional support groups' },
      { date: 'Nov 2023', title: 'Volunteer Training', description: 'Trained 20 community volunteers as peer facilitators' },
      { date: 'Jul 2024', title: 'Gwagwalada Launch', description: 'Launched support networks in Gwagwalada Area Council' },
    ],
    allocation: [
      { item: 'Support Groups', percentage: 40, description: 'Venue, facilitator training, group materials' },
      { item: 'Volunteer Training', percentage: 25, description: 'Training programmes, certification, ongoing support' },
      { item: 'Community Outreach', percentage: 20, description: 'Awareness campaigns, recruitment, follow-up' },
      { item: 'Administration', percentage: 15, description: 'Coordination, monitoring, evaluation' },
    ],
  },
  {
    id: 4,
    slug: 'professional-referral-pathway',
    title: 'Professional Referral Pathway',
    category: 'Healthcare',
    description:
      'Establishing a structured referral system connecting individuals directly to licensed therapists, counsellors and psychiatric services.',
    fullDescription:
      'Our Professional Referral Pathway bridges the gap between individuals seeking mental health support and qualified professionals who can help. Through a network of vetted therapists, counsellors and psychiatrists, we ensure people are matched with the right professional based on their specific needs, preferences and location.\n\nThe pathway includes initial assessment, professional matching, scheduling coordination and ongoing follow-up to ensure continuity of care. We also provide financial assistance for those who cannot afford private therapy, ensuring cost is never a barrier to receiving professional help.',
    status: 'Active',
    location: 'Nationwide (virtual & in-person)',
    raised: 1800000,
    goal: 3000000,
    image: '/images/projects/support-referal-system.jpg',
    gallery: [
      '/images/projects/support-referal-system.jpg',
      '/images/projects/community-outreach.jpg',
    ],
    beneficiaries: '350+',
    startDate: '2022',
    highlights: [
      'Therapist matching based on needs',
      'Counselling coordination',
      'Psychiatric referrals',
      'Follow-up support',
      'Financial assistance for qualifying individuals',
      'Virtual and in-person options',
    ],
    impact: [
      '350+ successful referrals',
      'Improved treatment outcomes',
      'Reduced barriers to care',
      'Continuity of care for patients',
      'Stronger professional network',
    ],
    milestones: [
      { date: 'Jan 2022', title: 'Network Built', description: 'Established network of 15 licensed mental health professionals' },
      { date: 'Aug 2022', title: 'First Referrals', description: 'Completed first 50 successful referrals' },
      { date: 'Apr 2023', title: 'Virtual Expansion', description: 'Launched virtual therapy options for nationwide access' },
      { date: 'Dec 2024', title: '300+ Milestone', description: 'Surpassed 300 successful referrals' },
    ],
    allocation: [
      { item: 'Professional Fees', percentage: 50, description: 'Therapist and psychiatrist session fees' },
      { item: 'Financial Assistance', percentage: 25, description: 'Subsidies for individuals who cannot afford care' },
      { item: 'Coordination', percentage: 15, description: 'Scheduling, follow-up, case management' },
      { item: 'Technology', percentage: 10, description: 'Virtual therapy platform, communication tools' },
    ],
  },
  {
    id: 5,
    slug: 'workplace-wellness-initiative',
    title: 'Workplace Wellness Initiative',
    category: 'Corporate',
    description:
      'Partnering with organisations to implement mental health support systems, employee assistance programmes and wellness workshops.',
    fullDescription:
      'Our Workplace Wellness Initiative helps organisations create mentally healthy workplaces where employees can thrive. Through comprehensive assessments, policy development and training programmes, we help businesses build cultures of psychological safety and wellbeing.\n\nThe initiative covers burnout prevention, stress management, leadership training and the implementation of Employee Assistance Programmes (EAPs). We provide ongoing support and monitoring to ensure sustained impact and measurable improvements in employee wellbeing and productivity.',
    status: 'Pilot',
    location: 'Abuja',
    raised: 450000,
    goal: 1500000,
    image: '/images/banner/banner2.jpg',
    gallery: [
      '/images/banner/banner2.jpg',
      '/images/projects/educational-workshop.jpg',
    ],
    beneficiaries: '120+',
    startDate: '2024',
    highlights: [
      'Corporate wellness workshops',
      'EAP programme development',
      'Stress management training',
      'Leadership development',
      'Policy consultation',
      'Ongoing monitoring',
    ],
    impact: [
      '120+ employees trained',
      '3 partner organisations',
      'Reduced reported burnout',
      'Improved employee satisfaction',
      'Policy templates developed',
    ],
    milestones: [
      { date: 'Jan 2024', title: 'Pilot Launch', description: 'Launched pilot programme with 2 partner organisations' },
      { date: 'Jun 2024', title: 'First Training', description: 'Completed first corporate wellness training for 60 employees' },
      { date: 'Nov 2024', title: 'Policy Toolkit', description: 'Developed comprehensive workplace mental health policy toolkit' },
    ],
    allocation: [
      { item: 'Training Programmes', percentage: 45, description: 'Workshops, seminars, leadership development' },
      { item: 'Policy Development', percentage: 25, description: 'EAP design, policy templates, implementation support' },
      { item: 'Assessment & Monitoring', percentage: 20, description: 'Workplace assessments, follow-up surveys, impact measurement' },
      { item: 'Materials & Resources', percentage: 10, description: 'Guides, toolkits, educational materials' },
    ],
  },
  {
    id: 6,
    slug: 'vulnerable-persons-outreach',
    title: 'Vulnerable Persons Outreach',
    category: 'Community',
    description:
      'Dedicated outreach to indigent and at-risk populations, providing free access to mental health resources and professional support.',
    fullDescription:
      'Our Vulnerable Persons Outreach programme prioritises the most underserved members of our communities — the economically disadvantaged, homeless individuals, refugees and those in remote areas. We bring mental health support directly to where the need is greatest, ensuring no one is left behind due to their circumstances.\n\nThrough partnerships with NGOs, government agencies and community organisations, we provide free counselling sessions, crisis intervention, resource distribution and referrals to ongoing care. Our outreach teams travel to underserved areas on a regular basis, building trust and providing consistent support to those who need it most.',
    status: 'Ongoing',
    location: 'FCT Abuja',
    raised: 1200000,
    goal: 2500000,
    image: '/images/banner/banner3.jpeg',
    gallery: [
      '/images/banner/banner3.jpeg',
      '/images/projects/community-outreach.jpg',
      '/images/projects/support-referal-system.jpg',
    ],
    beneficiaries: '200+',
    startDate: '2023',
    highlights: [
      'Outreach to underserved areas',
      'Free counselling sessions',
      'Crisis intervention support',
      'NGO partnerships',
      'Resource distribution',
      'Follow-up care coordination',
    ],
    impact: [
      '200+ vulnerable individuals supported',
      'Free care for those who cannot afford it',
      'Stronger NGO partnerships',
      'Improved access in underserved areas',
      'Greater awareness of vulnerable populations',
    ],
    milestones: [
      { date: 'Mar 2023', title: 'Outreach Launch', description: 'Launched first outreach programme in Kubwa underserved areas' },
      { date: 'Sep 2023', title: 'NGO Partnerships', description: 'Partnered with 3 NGOs serving vulnerable populations' },
      { date: 'May 2024', title: 'Crisis Team', description: 'Established dedicated crisis intervention team' },
    ],
    allocation: [
      { item: 'Outreach Services', percentage: 45, description: 'Counselling, crisis intervention, professional support' },
      { item: 'Resource Distribution', percentage: 25, description: 'Educational materials, hygiene kits, referrals' },
      { item: 'Transport & Logistics', percentage: 20, description: 'Getting to underserved areas, mobile outreach' },
      { item: 'Partnership Coordination', percentage: 10, description: 'NGO coordination, volunteer management' },
    ],
  },
];

export function getProjectBySlug(slug: string): ProjectData | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getRelatedProjects(currentSlug: string, limit = 3): ProjectData[] {
  return projects.filter((p) => p.slug !== currentSlug).slice(0, limit);
}

function docToText(body: any): string {
  if (!body) return '';
  if (typeof body === 'string') return body;
  if (Array.isArray(body?.content)) {
    return body.content.map((n: any) => n.text ?? docToText(n)).filter(Boolean).join('\n\n');
  }
  return '';
}

export function mapApiProject(a: any): ProjectData {
  const gallery = [];
  if (a.coverMedia?.url) gallery.push(resolveMediaUrl(a.coverMedia.url));
  return {
    id: a.id ?? 0,
    slug: a.slug ?? '',
    title: a.title ?? '',
    category: a.category ?? 'Community',
    description: a.summary ?? a.excerpt ?? docToText(a.body),
    fullDescription: a.summary ?? docToText(a.body),
    status: a.status ?? 'Ongoing',
    location: a.location ?? 'Nigeria',
    raised: a.raised ?? 0,
    goal: a.goal ?? 0,
    image: resolveMediaUrl(a.coverMedia?.url) || '/images/projects/awareness.jpg',
    gallery,
    beneficiaries: a.beneficiaries ?? '—',
    startDate: a.startDate ? new Date(a.startDate).getFullYear().toString() : '',
    highlights: a.highlights ?? [],
    impact: a.impact ?? [],
    milestones: a.milestones ?? [],
    allocation: a.allocation ?? [],
  };
}
