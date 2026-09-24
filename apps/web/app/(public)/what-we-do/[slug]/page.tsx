import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ServicePageContent } from '@/components/public/service-page-content';
import {
  Megaphone,
  GraduationCap,
  Heart,
  HeartHandshake,
  Shield,
  Lightbulb,
  Sparkles,
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api/v1';

const KNOWN_SLUGS = ['awareness', 'education', 'referral', 'community', 'vulnerable', 'research'] as const;

const SLUG_META: Record<string, { title: string; description: string }> = {
  awareness: {
    title: 'Mental Health Awareness — SHEDAM',
    description:
      'SHEDAM runs campaigns, public forums and outreach programmes to promote understanding and acceptance of mental health conditions.',
  },
  education: {
    title: 'Mental Health Education — SHEDAM',
    description:
      'SHEDAM delivers workshops, seminars and educational resources to build mental health literacy in schools, workplaces and communities.',
  },
  referral: {
    title: 'Professional Referral — SHEDAM',
    description:
      'SHEDAM connects individuals to licensed mental health professionals — psychologists, counsellors and psychiatrists.',
  },
  community: {
    title: 'Community Support — SHEDAM',
    description:
      'SHEDAM builds safe spaces and peer support networks for people navigating mental health challenges.',
  },
  vulnerable: {
    title: 'Vulnerable Persons Support — SHEDAM',
    description:
      'SHEDAM reaches indigent and at-risk groups, helping them access mental health care they might otherwise miss.',
  },
  research: {
    title: 'Research & Advocacy — SHEDAM',
    description:
      'SHEDAM contributes to policy discussions and publishes insights that advance mental health awareness and influence systemic change.',
  },
};

const SLUG_DEFAULTS: Record<
  string,
  {
    badgeIcon: React.ReactNode;
    title: string;
    titleHighlight: string;
    badge: string;
    description: string;
    heroImage: string;
    whyTitle: string;
    whyDescription: string;
    whyImage: string;
    activities: { icon: React.ReactNode; title: string; description: string }[];
    impact: string[];
    statNumber: string;
    statLabel: string;
    ctaTitle: string;
    ctaDescription: string;
  }
> = {
  awareness: {
    badgeIcon: <Megaphone className="h-3.5 w-3.5" />,
    badge: 'Mental Health Awareness',
    title: 'Mental Health',
    titleHighlight: 'Awareness',
    description:
      'We run campaigns, public forums and outreach programmes to promote understanding and acceptance of mental health conditions in communities across Nigeria.',
    heroImage: '/images/projects/awareness.jpg',
    whyTitle: 'Breaking the Silence Around Mental Health',
    whyDescription:
      'In Nigeria, one in four people will experience a mental health condition at some point in their lives. Yet stigma and misinformation prevent millions from seeking help. SHEDAM awareness campaigns create safe spaces for open dialogue, challenge harmful myths, and encourage people to view mental health as an integral part of overall wellbeing.',
    whyImage: '/images/projects/community-outreach.jpg',
    activities: [
      { icon: <Megaphone className="h-6 w-6" />, title: 'Community Forums', description: 'We host open community gatherings where mental health professionals share knowledge, answer questions and provide resources to reduce stigma.' },
      { icon: <Megaphone className="h-6 w-6" />, title: 'Public Awareness Campaigns', description: 'Targeted campaigns using posters, flyers and digital content to reach diverse audiences and spread accurate mental health information.' },
      { icon: <Megaphone className="h-6 w-6" />, title: 'Media Engagement', description: 'We partner with local media to broadcast mental health messages, interviews and features that reach millions across television, radio and online platforms.' },
      { icon: <Megaphone className="h-6 w-6" />, title: 'Social Media Advocacy', description: 'Consistent digital campaigns across platforms that share educational content, personal stories and professional insights to reach younger audiences.' },
    ],
    impact: [
      'Reduced stigma in communities where we have run awareness campaigns',
      'Increased willingness to seek professional help',
      'More families openly discussing mental health',
      'Greater media coverage of mental health issues',
      'Stronger community networks for peer support',
    ],
    statNumber: '1,200+',
    statLabel: 'Individuals reached through awareness campaigns',
    ctaTitle: 'Help Us Spread the Word',
    ctaDescription:
      'Your support helps us reach more communities with life-saving mental health awareness messages.',
  },
  education: {
    badgeIcon: <GraduationCap className="h-3.5 w-3.5" />,
    badge: 'Mental Health Education',
    title: 'Mental Health',
    titleHighlight: 'Education',
    description:
      'We deliver workshops, seminars and educational resources for individuals, schools, workplaces and community groups to build mental health literacy.',
    heroImage: '/images/projects/educational-workshop.jpg',
    whyTitle: 'Mental Health Literacy Saves Lives',
    whyDescription:
      'When people understand mental health, they are better equipped to recognise warning signs, support loved ones and seek timely intervention. Education empowers communities to move beyond myths and stigma toward evidence-based understanding of mental wellbeing.',
    whyImage: '/images/banner/banner2.jpg',
    activities: [
      { icon: <GraduationCap className="h-6 w-6" />, title: 'School Outreach Programmes', description: 'Age-appropriate mental health education for students, teachers and parents in primary and secondary schools across Nigeria.' },
      { icon: <GraduationCap className="h-6 w-6" />, title: 'Workplace Wellness Talks', description: 'Corporate seminars that help organisations build mentally healthy workplaces, reduce burnout and support employee wellbeing.' },
      { icon: <GraduationCap className="h-6 w-6" />, title: 'Community Workshops', description: 'Accessible workshops in community centres, markets and gathering places that teach practical mental health skills.' },
      { icon: <GraduationCap className="h-6 w-6" />, title: 'Educational Materials', description: 'Pamphlets, guides and digital content designed to educate individuals and families about mental health in accessible language.' },
    ],
    impact: [
      'Increased mental health literacy in participating communities',
      'Teachers better equipped to support students',
      'Workplaces with healthier, more productive environments',
      'Families with practical tools to support loved ones',
      'Young people with accurate mental health knowledge',
    ],
    statNumber: '850+',
    statLabel: 'Individuals educated through our programmes',
    ctaTitle: 'Support Our Education Programmes',
    ctaDescription:
      'Help us expand our educational reach and build mental health literacy in more communities.',
  },
  referral: {
    badgeIcon: <Heart className="h-3.5 w-3.5" />,
    badge: 'Professional Referral',
    title: 'Professional',
    titleHighlight: 'Referral',
    description:
      'We connect individuals to licensed mental health professionals — psychologists, counsellors and psychiatrists — ensuring access to quality care.',
    heroImage: '/images/projects/support-referal-system.jpg',
    whyTitle: 'Closing the Treatment Gap',
    whyDescription:
      'Nigeria has only about 150 psychiatrists for over 200 million people. Most individuals who need professional help never receive it. SHEDAM bridges this gap by maintaining a network of vetted professionals and making it easy for individuals to find the right support at the right time.',
    whyImage: '/images/banner/banner3.jpeg',
    activities: [
      { icon: <Heart className="h-6 w-6" />, title: 'Therapist Matching', description: 'We match individuals with licensed therapists based on their specific needs, preferences and location for effective personalised care.' },
      { icon: <Heart className="h-6 w-6" />, title: 'Counselling Coordination', description: 'We handle scheduling, logistics and coordination to ensure a seamless experience from first contact to ongoing sessions.' },
      { icon: <Heart className="h-6 w-6" />, title: 'Psychiatric Referrals', description: 'For individuals requiring medical intervention, we connect them with qualified psychiatrists for assessment, diagnosis and treatment.' },
      { icon: <Heart className="h-6 w-6" />, title: 'Follow-Up Support', description: 'We stay connected with individuals throughout their journey, providing follow-up check-ins and additional support as needed.' },
    ],
    impact: [
      'More individuals accessing professional mental health care',
      'Reduced barriers to treatment for underserved communities',
      'Better treatment outcomes through proper professional matching',
      'Continuity of care through ongoing follow-up support',
      'Stronger professional network serving Nigerian communities',
    ],
    statNumber: '350+',
    statLabel: 'Successful referrals to mental health professionals',
    ctaTitle: 'Need Professional Help?',
    ctaDescription:
      'You are not alone. Our referral team is ready to connect you with the right professional today.',
  },
  community: {
    badgeIcon: <HeartHandshake className="h-3.5 w-3.5" />,
    badge: 'Community Support',
    title: 'Community',
    titleHighlight: 'Support',
    description:
      'We build safe spaces and peer support networks that provide ongoing emotional support and a sense of belonging for those navigating mental health challenges.',
    heroImage: '/images/projects/community-outreach.jpg',
    whyTitle: 'Healing Happens in Community',
    whyDescription:
      'Mental health recovery is not a solo journey. When people feel seen, heard and supported by others who understand their experience, they heal faster and more fully. SHEDAM creates these communities — both in-person and online — where no one has to face their struggles alone.',
    whyImage: '/images/projects/awareness.jpg',
    activities: [
      { icon: <HeartHandshake className="h-6 w-6" />, title: 'Peer Support Groups', description: 'Facilitated groups where individuals share experiences, learn coping strategies and build meaningful connections with others who understand.' },
      { icon: <HeartHandshake className="h-6 w-6" />, title: 'Online Communities', description: 'Moderated digital spaces where people can connect, share resources and find support from the comfort and privacy of their homes.' },
      { icon: <HeartHandshake className="h-6 w-6" />, title: 'Safe Space Facilitation', description: 'We create and maintain physical spaces where individuals can gather, share and receive support without fear of judgement.' },
      { icon: <HeartHandshake className="h-6 w-6" />, title: 'Ongoing Check-Ins', description: 'Regular follow-ups and check-ins to ensure individuals remain connected, supported and progressing in their mental health journey.' },
    ],
    impact: [
      'Reduced isolation for individuals dealing with mental health challenges',
      'Stronger community bonds and social support networks',
      'Improved mental health outcomes through peer connection',
      'Greater sense of belonging and acceptance',
      'Sustainable support systems that last beyond formal treatment',
    ],
    statNumber: '500+',
    statLabel: 'Members in our peer support communities',
    ctaTitle: 'Join Our Community',
    ctaDescription: 'Find your people. You do not have to walk this path alone.',
  },
  vulnerable: {
    badgeIcon: <Shield className="h-3.5 w-3.5" />,
    badge: 'Vulnerable Persons',
    title: 'Vulnerable Persons',
    titleHighlight: 'Support',
    description:
      'We specialise in reaching those who need it most — the indigent, at-risk groups and underserved populations — helping them access care they might otherwise miss.',
    heroImage: '/images/banner/banner2.jpg',
    whyTitle: 'Reaching Those Left Behind',
    whyDescription:
      'The most vulnerable members of our communities — the economically disadvantaged, homeless individuals, refugees and those in underserved areas — often face the greatest mental health challenges yet have the least access to care. SHEDAM prioritises these groups, ensuring no one is left behind.',
    whyImage: '/images/projects/community-outreach.jpg',
    activities: [
      { icon: <Shield className="h-6 w-6" />, title: 'Outreach to Underserved Areas', description: 'We go where the need is greatest — rural communities, slums and underserved areas — bringing mental health support directly to those who cannot access it.' },
      { icon: <Shield className="h-6 w-6" />, title: 'Free Counselling Sessions', description: 'We provide complimentary counselling sessions for individuals and families who cannot afford professional mental health services.' },
      { icon: <Shield className="h-6 w-6" />, title: 'Crisis Intervention Support', description: 'Immediate response and support for individuals experiencing mental health crises, connecting them with emergency services and ongoing care.' },
      { icon: <Shield className="h-6 w-6" />, title: 'NGO Partnerships', description: 'We collaborate with other organisations to extend our reach and combine resources for maximum impact in serving vulnerable populations.' },
    ],
    impact: [
      'Improved access to mental health care for underserved populations',
      'Reduced suffering for individuals who cannot afford treatment',
      'Stronger partnerships with NGOs serving vulnerable groups',
      'More equitable mental health outcomes across communities',
      'Greater awareness of the needs of vulnerable populations',
    ],
    statNumber: '200+',
    statLabel: 'Vulnerable individuals supported through our programmes',
    ctaTitle: 'Help Us Reach the Most Vulnerable',
    ctaDescription:
      'Your donation ensures that no one is denied mental health support because of their circumstances.',
  },
  research: {
    badgeIcon: <Lightbulb className="h-3.5 w-3.5" />,
    badge: 'Research & Advocacy',
    title: 'Research &',
    titleHighlight: 'Advocacy',
    description:
      'We contribute to policy discussions and publish insights that advance mental health awareness and influence systemic change at community and national levels.',
    heroImage: '/images/banner/banner3.jpeg',
    whyTitle: 'Evidence Drives Change',
    whyDescription:
      'Lasting change in mental health care requires evidence-based advocacy. By conducting research, publishing findings and engaging with policymakers, SHEDAM helps shape the systems and policies that determine how mental health care is delivered in Nigeria and beyond.',
    whyImage: '/images/banner/banner2.jpg',
    activities: [
      { icon: <Lightbulb className="h-6 w-6" />, title: 'Policy Advocacy', description: 'We engage with government bodies and policymakers to advocate for improved mental health legislation, funding and services.' },
      { icon: <Lightbulb className="h-6 w-6" />, title: 'Research Publications', description: 'We publish research findings, reports and insights that contribute to the evidence base for mental health care in Nigeria.' },
      { icon: <Lightbulb className="h-6 w-6" />, title: 'Stakeholder Engagement', description: 'We bring together diverse stakeholders — government, NGOs, academia and community leaders — to drive collaborative solutions.' },
      { icon: <Lightbulb className="h-6 w-6" />, title: 'Data-Driven Insights', description: 'We collect and analyse data to inform our programmes and advocate for evidence-based mental health policies.' },
    ],
    impact: [
      'Influence on mental health policy and legislation',
      'Evidence-based insights driving programme improvements',
      'Stronger coalitions advocating for mental health reform',
      'Greater visibility of mental health issues at national level',
      'Informed public discourse on mental health in Nigeria',
    ],
    statNumber: '15+',
    statLabel: 'Research publications and policy papers',
    ctaTitle: 'Join Our Research Efforts',
    ctaDescription: 'Partner with us to advance mental health research and drive systemic change.',
  },
};

async function getSettingsMap(): Promise<Record<string, string>> {
  try {
    const res = await fetch(`${API_URL}/settings`, { next: { revalidate: 60 } });
    if (!res.ok) return {};
    const body = await res.json();
    const rows = Array.isArray(body?.data) ? body.data : [];
    const map: Record<string, string> = {};
    for (const r of rows) if (r?.key) map[r.key] = r.value ?? '';
    return map;
  } catch {
    return {};
  }
}

async function resolveSlug(slug: string): Promise<boolean> {
  if ((KNOWN_SLUGS as readonly string[]).includes(slug)) return true;
  const map = await getSettingsMap();
  try {
    const list = JSON.parse(map.services_list || '[]');
    return Array.isArray(list) && list.some((s: any) => s?.slug === slug);
  } catch {
    return false;
  }
}

export async function generateStaticParams() {
  return KNOWN_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const slug = params.slug;
  const map = await getSettingsMap();
  const overrideRaw = map[`service_page_${slug}`];
  let override: any = null;
  try {
    override = overrideRaw ? JSON.parse(overrideRaw) : null;
  } catch {
    override = null;
  }

  if (override?.title) {
    const highlight = override.titleHighlight ? ` ${override.titleHighlight}` : '';
    return {
      title: `${override.title}${highlight} — SHEDAM`,
      description: override.description || SLUG_META[slug]?.description,
    };
  }

  const meta = SLUG_META[slug];
  if (meta) return { title: meta.title, description: meta.description };

  const listRaw = map.services_list;
  try {
    const list = JSON.parse(listRaw || '[]');
    const item = Array.isArray(list) ? list.find((s: any) => s?.slug === slug) : null;
    if (item?.title) {
      return {
        title: `${item.title} — SHEDAM`,
        description: item.description || item.short || undefined,
      };
    }
  } catch {
    /* ignore */
  }

  return { title: 'Service — SHEDAM' };
}

export default async function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const valid = await resolveSlug(slug);
  if (!valid) notFound();

  const defaults = SLUG_DEFAULTS[slug];
  if (!defaults) {
    // Custom slug from services_list without static defaults — empty props, settings override fills in
    return (
      <ServicePageContent
        slug={slug}
        badgeIcon={<Sparkles className="h-3.5 w-3.5" />}
        badge=""
        title=""
        titleHighlight=""
        description=""
        heroImage="/images/banner/banner1.jpg"
        whyTitle=""
        whyDescription=""
        whyImage="/images/banner/banner1.jpg"
        activities={[]}
        impact={[]}
        statNumber=""
        statLabel=""
        ctaTitle=""
        ctaDescription=""
      />
    );
  }

  return <ServicePageContent slug={slug} {...defaults} />;
}
