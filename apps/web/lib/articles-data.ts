import { resolveMediaUrl } from '@/lib/api';

export interface ArticleAuthor {
  name: string;
  role: string;
  image: string;
}

export interface ArticleData {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  author: ArticleAuthor;
  readTime: string;
  publishDate: string;
  tags: string[];
  featured: boolean;
  views?: number;
}

export const categories = [
  'All',
  'Mental Health',
  'Education',
  'Awareness',
  'Community',
  'Wellbeing',
  'Workplace',
  'Youth',
];

export const articles: ArticleData[] = [
  {
    id: 1,
    slug: 'understanding-mental-health',
    title: 'Understanding Mental Health: A Comprehensive Guide',
    excerpt:
      'Mental health encompasses our emotional, psychological and social wellbeing. Learn what it means and why it matters for everyone.',
    content: `
Mental health is more than just the absence of mental illness. It is a state of wellbeing in which every individual realises their own potential, can cope with the normal stresses of life, can work productively and is able to make a contribution to their community.

## What Is Mental Health?

Mental health includes our emotional, psychological, and social wellbeing. It affects how we think, feel, and act. It also helps determine how we handle stress, relate to others, and make choices. Mental health is important at every stage of life, from childhood and adolescence through adulthood.

## Why Mental Health Matters

Good mental health is vital to our overall health and quality of life. When we are mentally healthy, we can:
- Realise our full potential
- Cope with the stresses of life
- Work productively
- Make meaningful contributions to our communities

## Common Mental Health Conditions

### Depression
Depression is more than just feeling sad. It is a serious mental health condition that requires understanding and medical care. Left untreated, depression can be devastating for those who have it and their families.

### Anxiety Disorders
Anxiety disorders involve more than temporary worry or fear. For a person with an anxiety disorder, the anxiety does not go away and can get worse over time.

### Post-Traumatic Stress Disorder (PTSD)
PTSD develops after a terrifying ordeal that involved physical harm or the threat of physical harm. The event may involve the threat of death to oneself or someone else, or to one's own or someone else's physical, sexual, or psychological integrity.

## How to Maintain Good Mental Health

There are many things you can do to look after your mental health:
1. **Stay connected** with people you trust
2. **Be physically active** — exercise improves mood
3. **Learn new skills** and take on challenges
4. **Give to others** — acts of kindness boost wellbeing
5. **Pay attention to the present** — practice mindfulness
6. **Get enough sleep** — sleep affects how we think and feel
7. **Eat well** — good nutrition supports mental health
8. **Limit alcohol and avoid drugs**

## When to Seek Help

If you or someone you know is struggling with mental health, it is important to seek professional help. Signs that someone may need help include:
- Withdrawing from friends and activities
- Changes in eating or sleeping habits
- Low energy or lack of motivation
- Feeling numb or doing nothing
- Increased use of alcohol or drugs
- Confusion or inability to concentrate
- Extreme mood swings

## How SHEDAM Can Help

At SHEDAM Mental Health Initiative, we provide:
- Mental health awareness campaigns
- Professional referrals to licensed therapists
- Community support networks
- Educational workshops and programmes

You are not alone. Reach out to us today.
    `,
    category: 'Mental Health',
    image: '/images/projects/awareness.jpg',
    author: {
      name: 'Rev. Fr. Istifanus Sheyin',
      role: 'Clinical Psychologist & Co-Founder',
      image: '/images/projects/community-outreach.jpg',
    },
    readTime: '8 min read',
    publishDate: '2025-01-15',
    tags: ['mental health', 'wellbeing', 'depression', 'anxiety'],
    featured: true,
    views: 1250,
  },
  {
    id: 2,
    slug: 'breaking-stigma-around-mental-health',
    title: 'Breaking the Stigma: Why We Must Talk About Mental Health',
    excerpt:
      'Stigma remains the biggest barrier to mental health care in Nigeria. Here is how we can work together to break it down.',
    content: `
Stigma is one of the greatest barriers to mental health care. In Nigeria, many people with mental health conditions face discrimination, isolation and shame. This prevents them from seeking the help they need.

## The Impact of Stigma

Stigma affects people with mental illness in many ways:
- **Discrimination** in employment, housing and relationships
- **Social isolation** as people withdraw from communities
- **Reluctance to seek help** due to fear of judgement
- **Reduced access** to opportunities and resources
- **Internalised shame** that worsens mental health

## Why Stigma Exists

Mental health stigma in Nigeria is rooted in:
- Cultural and religious beliefs that attribute mental illness to spiritual causes
- Lack of education about mental health conditions
- Media portrayals that reinforce negative stereotypes
- Fear and misunderstanding of the unknown
- Historical treatment of mental health as a private family matter

## How to Break the Stigma

### 1. Educate Yourself and Others
Learn the facts about mental health. Share accurate information with your family, friends and community.

### 2. Talk Openly
Normalise conversations about mental health. When people see others discussing it openly, it becomes less taboo.

### 3. Show Compassion
Treat people with mental health conditions with the same respect and understanding you would show someone with a physical illness.

### 4. Challenge Stereotypes
Speak up when you hear stereotypes or misinformation about mental health. Correct myths with facts.

### 5. Support Those Affected
Let people know you are there for them. Sometimes just listening can make a huge difference.

## What SHEDAM Is Doing

SHEDAM Mental Health Initiative is working to break the stigma through:
- Community awareness campaigns
- Media engagement and public education
- School and workplace programmes
- Peer support networks

Together, we can create a society where mental health is understood and everyone feels safe to seek help.
    `,
    category: 'Awareness',
    image: '/images/projects/community-outreach.jpg',
    author: {
      name: 'Rev. Fr. Dr. Christopher Damina',
      role: 'Guidance & Counselling Expert',
      image: '/images/projects/educational-workshop.jpg',
    },
    readTime: '6 min read',
    publishDate: '2025-02-10',
    tags: ['stigma', 'awareness', 'advocacy', 'community'],
    featured: true,
    views: 980,
  },
  {
    id: 3,
    slug: 'supporting-children-mental-health',
    title: 'Supporting Children\'s Mental Health: A Guide for Parents',
    excerpt:
      'Children experience mental health too. Learn how to recognise signs and support your child\'s emotional wellbeing.',
    content: `
Children are not immune to mental health challenges. In fact, half of all mental health conditions start by age 14, but most go undetected and untreated. As parents and caregivers, understanding children's mental health is crucial.

## Why Children's Mental Health Matters

Early childhood experiences shape the foundation for lifelong mental health. Children who receive support for their emotional wellbeing are more likely to:
- Develop healthy relationships
- Perform better in school
- Build resilience
- Become well-adjusted adults

## Signs of Mental Health Issues in Children

Watch for these warning signs:
- **Changes in behaviour** — becoming withdrawn, aggressive or hyperactive
- **Changes in mood** — persistent sadness, irritability or mood swings
- **Changes in sleep** — nightmares, difficulty falling asleep or sleeping too much
- **Changes in eating** — loss of appetite or overeating
- **Difficulty concentrating** — struggling at school
- **Physical complaints** — headaches, stomachaches without medical cause
- **Avoidance** — refusing to go to school or participate in activities

## How to Support Your Child

### Create a Safe Space
Let your child know they can talk to you about anything without judgement. Listen actively and validate their feelings.

### Maintain Routines
Consistent routines provide structure and security. Regular sleep, meals and activities help children feel safe.

### Teach Coping Skills
Help your child develop healthy ways to manage stress, such as deep breathing, drawing or talking about feelings.

### Be a Role Model
Children learn by watching. Show healthy emotional expression and coping strategies.

### Limit Screen Time
Excessive screen time can affect mental health. Set boundaries and encourage physical activity and face-to-face interactions.

### Seek Professional Help
If you notice persistent changes in your child's behaviour or mood, seek professional help early. Early intervention makes a big difference.

## How SHEDAM Helps

Our School Mental Health Programme provides:
- Age-appropriate mental health education
- Workshops for students, teachers and parents
- Support for children experiencing challenges
- Resources for families

Contact us to learn more about how we can support your child's mental health.
    `,
    category: 'Education',
    image: '/images/projects/educational-workshop.jpg',
    author: {
      name: 'Dr. Amina Bello',
      role: 'Child Psychologist',
      image: '/images/projects/community-outreach.jpg',
    },
    readTime: '7 min read',
    publishDate: '2025-03-05',
    tags: ['children', 'parents', 'education', 'family'],
    featured: false,
    views: 750,
  },
  {
    id: 4,
    slug: 'workplace-mental-health',
    title: 'Why Workplace Mental Health Matters More Than Ever',
    excerpt:
      'A mentally healthy workplace benefits everyone. Here is how organisations can support employee wellbeing.',
    content: `
Workplace mental health is no longer optional. With rising rates of burnout, stress and anxiety, organisations must prioritise employee wellbeing to thrive.

## The Cost of Poor Workplace Mental Health

Mental health issues cost the global economy an estimated $1 trillion per year in lost productivity. In Nigeria, the impact is significant:
- Increased absenteeism
- Reduced productivity
- Higher employee turnover
- Increased healthcare costs
- Poor workplace morale

## Benefits of a Mentally Healthy Workplace

When organisations invest in mental health, they see:
- **Increased productivity** — employees perform better when they feel well
- **Reduced absenteeism** — fewer sick days and more engagement
- **Better retention** — employees stay longer in supportive environments
- **Improved morale** — positive workplace culture benefits everyone
- **Enhanced reputation** — organisations known for wellbeing attract top talent

## How to Create a Mentally Healthy Workplace

### 1. Build Awareness
Educate employees and leadership about mental health. Reduce stigma through open conversations.

### 2. Implement Policies
Develop clear mental health policies that support employees, including flexible working and mental health days.

### 3. Train Managers
Managers play a crucial role. Train them to recognise signs of mental health issues and support their teams.

### 4. Provide Resources
Offer access to counselling, Employee Assistance Programmes (EAPs) and mental health resources.

### 5. Create Safe Spaces
Foster a culture where employees feel safe to discuss mental health without fear of judgement.

### 6. Promote Work-Life Balance
Encourage healthy boundaries between work and personal life.

## SHEDAM's Workplace Wellness Programme

Our Workplace Wellness Initiative helps organisations:
- Assess workplace mental health needs
- Develop tailored wellness programmes
- Train managers and HR professionals
- Implement EAPs
- Create mentally healthy work cultures

Contact us to learn how we can support your organisation.
    `,
    category: 'Workplace',
    image: '/images/banner/banner2.jpg',
    author: {
      name: 'Mrs. Fatima Abdullahi',
      role: 'HR Wellness Consultant',
      image: '/images/projects/educational-workshop.jpg',
    },
    readTime: '6 min read',
    publishDate: '2025-03-20',
    tags: ['workplace', 'wellness', 'burnout', 'productivity'],
    featured: false,
    views: 620,
  },
  {
    id: 5,
    slug: 'youth-mental-health-crisis',
    title: 'The Youth Mental Health Crisis: What We Can Do',
    excerpt:
      'Young people are facing unprecedented mental health challenges. Here is how we can support them.',
    content: `
Youth mental health is a growing concern worldwide. In Nigeria, young people face unique pressures that affect their mental wellbeing.

## Understanding the Crisis

Today's young people are dealing with:
- Academic pressure and examination stress
- Social media comparison and cyberbullying
- Economic uncertainty and unemployment
- Identity and self-esteem challenges
- Peer pressure and social expectations
- Family dynamics and expectations

## The Numbers

Research shows:
- 1 in 5 young people experience a mental health condition
- Suicide is the second leading cause of death among 15-29 year olds
- Most mental health conditions begin before age 24
- Fewer than 20% of young people with mental health conditions receive treatment

## Warning Signs in Young People

Look for:
- Withdrawal from friends and activities
- Changes in academic performance
- Extreme mood swings
- Changes in eating or sleeping habits
- Substance use
- Talk of self-harm or suicide

## How to Support Young People

### Listen Without Judgement
Create a safe space for young people to express themselves. Listen more than you speak.

### Validate Their Feelings
Let them know their feelings are valid and normal. Avoid dismissing their concerns.

### Encourage Help-Seeking
Normalise seeking professional help. Make it clear that asking for help is a sign of strength.

### Stay Connected
Maintain regular contact. Check in frequently and show you care.

### Limit Social Media
Help young people develop healthy relationships with technology.

## SHEDAM's Youth Programmes

Our School Mental Health Programme provides:
- Mental health education in schools
- Peer support training
- Teacher and parent workshops
- Youth-focused resources

Together, we can support the next generation.
    `,
    category: 'Youth',
    image: '/images/projects/educational-workshop.jpg',
    author: {
      name: 'Rev. Fr. Istifanus Sheyin',
      role: 'Clinical Psychologist & Co-Founder',
      image: '/images/projects/community-outreach.jpg',
    },
    readTime: '7 min read',
    publishDate: '2025-04-01',
    tags: ['youth', 'mental health', 'schools', 'adolescents'],
    featured: false,
    views: 890,
  },
  {
    id: 6,
    slug: 'self-care-mental-health',
    title: 'Self-Care Practices for Better Mental Health',
    excerpt:
      'Simple daily habits can significantly improve your mental wellbeing. Discover self-care strategies that work.',
    content: `
Self-care is not selfish — it is essential for good mental health. Taking time to care for yourself helps you cope with stress and maintain your wellbeing.

## What Is Self-Care?

Self-care includes any deliberate activity you do to take care of your mental, emotional and physical health. It is about giving yourself what you need to be your best self.

## Self-Care Strategies

### Physical Self-Care
- **Exercise regularly** — even 30 minutes of walking helps
- **Eat nutritious meals** — food affects mood and energy
- **Get enough sleep** — aim for 7-9 hours
- **Stay hydrated** — dehydration affects mood
- **Limit caffeine and alcohol**

### Emotional Self-Care
- **Journal your thoughts** — writing helps process emotions
- **Practice gratitude** — note three things you are thankful for daily
- **Allow yourself to feel** — don't suppress emotions
- **Set boundaries** — it's okay to say no
- **Seek therapy** — professional support helps

### Social Self-Care
- **Connect with loved ones** — quality relationships matter
- **Join a community** — belonging reduces isolation
- **Ask for help** — you don't have to do it alone
- **Limit toxic relationships** — protect your energy

### Mental Self-Care
- **Practice mindfulness** — stay present
- **Learn something new** — keep your mind active
- **Take breaks** — rest is productive
- **Reduce screen time** — digital detox helps
- **Read for pleasure** — escape and learn

### Spiritual Self-Care
- **Connect with your faith** — prayer or meditation
- **Spend time in nature** — it heals
- **Practice forgiveness** — let go of resentment
- **Find purpose** — meaning improves wellbeing

## Building a Self-Care Routine

1. Start small — one new habit at a time
2. Schedule it — treat self-care like an appointment
3. Be consistent — routine builds habits
4. Adjust as needed — what works changes over time
5. Don't aim for perfection — progress matters more

## How SHEDAM Can Help

We offer resources and support for individuals looking to improve their mental wellbeing. Contact us to learn about our programmes and services.

Remember: taking care of yourself is not a luxury — it is a necessity.
    `,
    category: 'Wellbeing',
    image: '/images/banner/banner3.jpeg',
    author: {
      name: 'Dr. Amina Bello',
      role: 'Clinical Psychologist',
      image: '/images/projects/community-outreach.jpg',
    },
    readTime: '5 min read',
    publishDate: '2025-04-15',
    tags: ['self-care', 'wellbeing', 'mindfulness', 'health'],
    featured: false,
    views: 1100,
  },
];

export function getArticleBySlug(slug: string): ArticleData | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getFeaturedArticles(): ArticleData[] {
  return articles.filter((a) => a.featured);
}

export function getArticlesByCategory(category: string): ArticleData[] {
  if (category === 'All') return articles;
  return articles.filter((a) => a.category === category);
}

export function getRelatedArticles(currentSlug: string, limit = 3): ArticleData[] {
  return articles.filter((a) => a.slug !== currentSlug).slice(0, limit);
}

function articleBodyToText(body: any): string {
  if (!body) return '';
  if (typeof body === 'string') return body;
  if (Array.isArray(body?.content)) {
    return body.content.map((n: any) => n.text ?? articleBodyToText(n)).filter(Boolean).join('\n\n');
  }
  return '';
}

export function mapApiArticle(a: any): ArticleData {
  const content = a.body ? articleBodyToText(a.body) : a.content ?? '';
  const tags = a.tags?.map((t: any) => t.tag ?? t) ?? [];
  return {
    id: a.id ?? 0,
    slug: a.slug ?? '',
    title: a.title ?? '',
    excerpt: a.excerpt ?? a.summary ?? content.slice(0, 160),
    content,
    category: a.category ?? 'Mental Health',
    image: resolveMediaUrl(a.coverMedia?.url) || '/images/blog/post-1.jpg',
    author: {
      name: a.author?.name ?? 'SHEDAM Team',
      role: 'SHEDAM',
      image: '',
    },
    readTime: a.readTime ?? `${Math.max(1, Math.round(content.split(/\s+/).length / 200))} min read`,
    publishDate: a.publishedAt ? new Date(a.publishedAt).toLocaleDateString('en-GB') : '',
    tags,
    featured: a.featured ?? false,
    views: a.views ?? 0,
  };
}
