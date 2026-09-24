// @ts-nocheck
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // ── Roles ──
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

  // ── Admin user ──
  const adminPasswordHash = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@shedam.org' },
    update: { passwordHash: adminPasswordHash, roleId: 'role-super-admin', status: 'ACTIVE' },
    create: {
      name: 'SHEDAM Administrator',
      email: 'admin@shedam.org',
      passwordHash: adminPasswordHash,
      roleId: 'role-super-admin',
      status: 'ACTIVE',
    },
  });

  const authorId = admin.id;
  console.log('Admin user seeded:', admin.email);

  // ── Media assets ──
  const mediaAssets: Record<string, string> = {};
  const mediaDefinitions = [
    { key: 'logo', fileName: 'LOGO-transparent.png', folder: 'assets', altText: 'SHEDAM logo' },
    { key: 'hero1', fileName: 'hero-banner.png', folder: 'banner', altText: 'Hero banner' },
    { key: 'banner1', fileName: 'banner1.jpg', folder: 'banner', altText: 'Community program' },
    { key: 'banner2', fileName: 'banner2.jpg', folder: 'banner', altText: 'Volunteer outreach' },
    { key: 'banner3', fileName: 'banner3.jpeg', folder: 'banner', altText: 'Professional counselling' },
    { key: 'flier1', fileName: 'SHEDAMFLIER2.jpeg', folder: 'events', altText: 'SHEDAM event flier' },
    { key: 'flyer1', fileName: 'flyer1.png', folder: 'events', altText: 'Youth workshop flier' },
    { key: 'flyer3', fileName: 'flyer3.png', folder: 'events', altText: 'Outreach flier' },
    { key: 'awareness', fileName: 'awareness.jpg', folder: 'projects', altText: 'Awareness session' },
    { key: 'community', fileName: 'community-outreach.jpg', folder: 'projects', altText: 'Community outreach' },
    { key: 'referral', fileName: 'support-referal-system.jpg', folder: 'projects', altText: 'Referral support' },
    { key: 'workshop', fileName: 'educational-workshop.jpg', folder: 'projects', altText: 'Educational workshop' },
    { key: 'post1', fileName: 'post-1.jpg', folder: 'blog', altText: 'Blog post image 1' },
    { key: 'post2', fileName: 'post-2.jpg', folder: 'blog', altText: 'Blog post image 2' },
    { key: 'post3', fileName: 'post-3.jpg', folder: 'blog', altText: 'Blog post image 3' },
    { key: 'post4', fileName: 'post-4.jpg', folder: 'blog', altText: 'Blog post image 4' },
    { key: 'post5', fileName: 'post-5.jpg', folder: 'blog', altText: 'Blog post image 5' },
    { key: 'post6', fileName: 'post-6.jpg', folder: 'blog', altText: 'Blog post image 6' },
  ];

  for (const def of mediaDefinitions) {
    const url = `/images/${def.folder}/${def.fileName}`;
    let created = await prisma.mediaAsset.findFirst({ where: { url } });
    if (!created) {
      created = await prisma.mediaAsset.create({
        data: {
          url,
          type: 'IMAGE',
          mimeType: 'image/jpeg',
          fileName: def.fileName,
          altText: def.altText,
          folder: def.folder,
          uploadedBy: admin.id,
        },
      });
    }
    mediaAssets[def.key] = created.id;
  }
  console.log('Media assets seeded:', Object.keys(mediaAssets).length);

  // ── Site settings (matches frontend keys) ──
  const settings = [
    { key: 'site_name', value: 'SHEDAM Mental Health Initiative', type: 'TEXT', groupName: 'general' },
    { key: 'site_short_name', value: 'SHEDAM', type: 'TEXT', groupName: 'general' },
    { key: 'site_tagline', value: 'Mental Health Initiative', type: 'TEXT', groupName: 'general' },
    { key: 'site_description', value: 'Creating Awareness. Breaking the Stigma. Connecting People to Professional Help.', type: 'TEXTAREA', groupName: 'general' },
    { key: 'hero_tagline', value: 'Creating Awareness, Breaking the Stigma, and Connecting People with Professional Help. We provide support, education, and referral services for a healthier community.', type: 'TEXTAREA', groupName: 'general' },
    { key: 'hero_headline', value: '"Your Mental Health Is Our Priority."', type: 'TEXT', groupName: 'general' },
    { key: 'hero_slides', value: '[{"src":"/images/banner/hero-banner.png","alt":"Mental health awareness"},{"src":"/images/banner/banner1.jpg","alt":"Community support programs"},{"src":"/images/banner/banner2.jpg","alt":"Volunteer outreach"},{"src":"/images/banner/banner3.jpeg","alt":"Professional counselling"}]', type: 'JSON', groupName: 'general' },
    { key: 'footer_about', value: 'Creating Awareness. Breaking the Stigma. Connecting People to Professional Help.', type: 'TEXTAREA', groupName: 'general' },
    { key: 'newsletter_text', value: 'Subscribe to our newsletter for the latest updates on mental health awareness.', type: 'TEXT', groupName: 'general' },
    { key: 'org_legal_name', value: 'SHEDAM Mental Health Initiative', type: 'TEXT', groupName: 'general' },
    { key: 'org_logo', value: '', type: 'TEXT', groupName: 'general' },
    { key: 'org_registration_number', value: '', type: 'TEXT', groupName: 'general' },
    { key: 'org_founded_year', value: '', type: 'TEXT', groupName: 'general' },
    { key: 'org_website', value: 'https://shedam.org', type: 'TEXT', groupName: 'general' },
    { key: 'org_motto', value: '', type: 'TEXT', groupName: 'general' },
    { key: 'contact_email', value: 'info@shedam.org', type: 'TEXT', groupName: 'contact' },
    { key: 'contact_phone', value: '0805 177 2262', type: 'TEXT', groupName: 'contact' },
    { key: 'contact_phone_raw', value: '+2348051772262', type: 'TEXT', groupName: 'contact' },
    { key: 'contact_address', value: 'Lagos, Nigeria', type: 'TEXTAREA', groupName: 'contact' },
    { key: 'contact_whatsapp', value: '+2348051772262', type: 'TEXT', groupName: 'contact' },
    { key: 'support_whatsapp', value: '+2348051772262', type: 'TEXT', groupName: 'support' },
    { key: 'support_phone', value: '+2348051772262', type: 'TEXT', groupName: 'support' },
    { key: 'support_email', value: 'support@shedam.org', type: 'TEXT', groupName: 'support' },
    { key: 'social_facebook', value: 'https://facebook.com', type: 'TEXT', groupName: 'social' },
    { key: 'social_twitter', value: 'https://twitter.com', type: 'TEXT', groupName: 'social' },
    { key: 'social_instagram', value: 'https://instagram.com', type: 'TEXT', groupName: 'social' },
    { key: 'social_linkedin', value: 'https://linkedin.com', type: 'TEXT', groupName: 'social' },
    { key: 'social_youtube', value: 'https://youtube.com', type: 'TEXT', groupName: 'social' },
    { key: 'stat_people_supported', value: '500', type: 'NUMBER', groupName: 'stats' },
    { key: 'stat_community_events', value: '20', type: 'NUMBER', groupName: 'stats' },
    { key: 'stat_volunteers', value: '50', type: 'NUMBER', groupName: 'stats' },
    { key: 'stat_commitment', value: '100', type: 'NUMBER', groupName: 'stats' },
    { key: 'about_eyebrow', value: 'About SHEDAM', type: 'TEXT', groupName: 'sections' },
    { key: 'about_title', value: 'Who We Are', type: 'TEXT', groupName: 'sections' },
    { key: 'about_description', value: 'SHEDAM Mental Health Initiative (SMHI) is a community-driven organization focused on promoting mental well-being, breaking the stigma around mental health, and connecting people to professional help and support services.', type: 'TEXTAREA', groupName: 'sections' },
    { key: 'about_mission', value: 'To create awareness, reduce stigma and ensure access to professional mental health support for all.', type: 'TEXTAREA', groupName: 'sections' },
    { key: 'about_vision', value: 'A society where mental health is valued, understood and supported for everyone.', type: 'TEXTAREA', groupName: 'sections' },
    { key: 'services_eyebrow', value: 'Our Services', type: 'TEXT', groupName: 'sections' },
    { key: 'services_title', value: 'What We Do', type: 'TEXT', groupName: 'sections' },
    { key: 'services_description', value: 'We focus on education, support and access to ensure better mental health outcomes for individuals and communities.', type: 'TEXTAREA', groupName: 'sections' },
    { key: 'video_eyebrow', value: 'Watch Our Story', type: 'TEXT', groupName: 'sections' },
    { key: 'video_title', value: 'See the Impact of Your Support', type: 'TEXT', groupName: 'sections' },
    { key: 'video_url', value: '/video/Mentalhealth.mp4', type: 'TEXT', groupName: 'sections' },
    { key: 'video_description', value: 'Watch how SHEDAM is transforming lives through mental health awareness, community support, and professional referrals.', type: 'TEXTAREA', groupName: 'sections' },
    { key: 'partners_eyebrow', value: 'Our Partners', type: 'TEXT', groupName: 'sections' },
    { key: 'partners_title', value: 'Trusted by Leading Organisations', type: 'TEXT', groupName: 'sections' },
    { key: 'partners_description', value: 'We collaborate with government agencies, healthcare institutions, professional bodies, and international organisations to strengthen mental health systems across Nigeria.', type: 'TEXTAREA', groupName: 'sections' },
    { key: 'impact_eyebrow', value: 'In Numbers', type: 'TEXT', groupName: 'sections' },
    { key: 'impact_title', value: 'Our Impact', type: 'TEXT', groupName: 'sections' },
    { key: 'impact_description', value: 'Every conversation, every support session, every life touched matters. We are just getting started.', type: 'TEXTAREA', groupName: 'sections' },
    { key: 'donate_eyebrow', value: 'Be the Change', type: 'TEXT', groupName: 'sections' },
    { key: 'donate_title', value: 'Every Donation Makes a Difference', type: 'TEXT', groupName: 'sections' },
    { key: 'donate_description', value: 'Your support helps us provide critical mental health services, awareness campaigns, and community outreach programs to those who need it most.', type: 'TEXTAREA', groupName: 'sections' },
    // Newsletter
    { key: 'newsletter_title', value: 'Stay Updated', type: 'TEXT', groupName: 'sections' },
    // Header CTAs
    { key: 'header_help_label', value: 'Get Help', type: 'TEXT', groupName: 'general' },
    { key: 'header_support_label', value: 'Support Us', type: 'TEXT', groupName: 'general' },
    // About page
    { key: 'about_hero_eyebrow', value: 'About SHEDAM', type: 'TEXT', groupName: 'about' },
    { key: 'about_hero_title', value: 'Our Story of', type: 'TEXT', groupName: 'about' },
    { key: 'about_hero_title_highlight', value: 'Hope & Healing', type: 'TEXT', groupName: 'about' },
    { key: 'about_hero_description', value: 'Founded by Rev. Fr. Istifanus Sheyin and Rev. Fr. Dr. Christopher Damina, SHEDAM Mental Health Initiative exists to ensure no one faces their mental health challenges alone.', type: 'TEXTAREA', groupName: 'about' },
    { key: 'about_who_title', value: 'A Multidisciplinary Organisation', type: 'TEXT', groupName: 'about' },
    { key: 'about_who_paragraphs', value: 'SHEDAM Mental Health Initiative (SMHI) is a non-profit, non-governmental, multidisciplinary organisation dedicated to promoting mental wellbeing through awareness, education, prevention, early intervention, advocacy, research, professional referral, and improved access to quality mental healthcare.\n\nFounded by Rev. Fr. Istifanus Sheyin, a Clinical Psychologist, and Rev. Fr. Dr. Christopher Damina, a professional in Guidance and Counselling, SHEDAM was established to complement pastoral care by promoting professional mental healthcare while recognising the positive contribution of healthy spirituality to holistic human wellbeing.\n\nWe bring together clinical psychologists, psychiatrists, counsellors, social workers, educators, researchers, and public health professionals who share a common commitment to advancing mental wellbeing through multidisciplinary collaboration.', type: 'TEXTAREA', groupName: 'about' },
    { key: 'about_mission_more', value: 'Through advocacy, education, research, community engagement, professional referral services, and strategic partnerships, we empower individuals, families, and communities while ensuring that no one is denied appropriate mental healthcare because of ignorance, discrimination, or financial hardship.', type: 'TEXTAREA', groupName: 'about' },
    { key: 'about_vision_more', value: '', type: 'TEXTAREA', groupName: 'about' },
    { key: 'about_years_label', value: 'Years of Impact', type: 'TEXT', groupName: 'about' },
    { key: 'about_values_title', value: 'What Guides Us', type: 'TEXT', groupName: 'about' },
    { key: 'about_values_description', value: 'These principles shape every decision we make and every programme we run.', type: 'TEXTAREA', groupName: 'about' },
    { key: 'about_values', value: '[{"name":"Compassion","description":"We serve every individual with empathy, kindness, respect, and genuine concern, recognizing the inherent dignity of every person."},{"name":"Professional Excellence","description":"We are committed to evidence-based practice, competence, innovation, and the highest ethical standards in mental healthcare."},{"name":"Human Dignity","description":"Every individual deserves respect, acceptance, inclusion, and equitable access to quality mental healthcare, free from stigma."},{"name":"Integrity","description":"We uphold honesty, transparency, accountability, confidentiality, and responsible stewardship in all aspects of our work."},{"name":"Collaboration","description":"Lasting improvements in mental health require effective partnerships among professionals, governments, communities, and families."},{"name":"Inclusiveness","description":"Our programmes and services are accessible to all persons regardless of age, gender, ethnicity, religion, or socioeconomic status."},{"name":"Advocacy","description":"We actively promote policies and public awareness that protect the rights, dignity, and wellbeing of people with mental health conditions."},{"name":"Service","description":"We are driven by a commitment to improving lives, strengthening families, empowering communities, and building resilient societies."}]', type: 'TEXTAREA', groupName: 'about' },
    { key: 'about_areas_eyebrow', value: 'What We Do', type: 'TEXT', groupName: 'about' },
    { key: 'about_areas_title', value: 'Areas of Intervention', type: 'TEXT', groupName: 'about' },
    { key: 'about_areas_description', value: 'A holistic, multidisciplinary approach to promoting mental wellbeing and improving access to quality mental healthcare.', type: 'TEXTAREA', groupName: 'about' },
    { key: 'about_areas', value: '[{"title":"Mental Health Awareness","description":"Public education, conferences, seminars, media campaigns, and community outreach to promote mental health literacy and reduce stigma."},{"title":"Professional Referral","description":"Connecting individuals with qualified psychologists, psychiatrists, counsellors, and rehabilitation centres through trusted referral pathways."},{"title":"Psycho-Spiritual Care","description":"Responsible collaboration between mental health professionals and faith leaders for holistic wellbeing, complementing professional care."},{"title":"Indigent Support","description":"Free or subsidized assessments, counselling, therapy, and medication support for economically disadvantaged individuals."},{"title":"Rescue & Rehabilitation","description":"Supporting rescue, treatment, family reunification, and community reintegration of persons with untreated mental illness."},{"title":"School Programmes","description":"Mental health education, peer support, anti-bullying programmes, and early identification systems in educational institutions."}]', type: 'TEXTAREA', groupName: 'about' },
    { key: 'about_journey_eyebrow', value: 'Our Journey', type: 'TEXT', groupName: 'about' },
    { key: 'about_journey_title', value: 'Milestones That Define Us', type: 'TEXT', groupName: 'about' },
    { key: 'about_milestones', value: '[{"year":"2020","title":"SHEDAM Founded","description":"Rev. Fr. Istifanus Sheyin and Rev. Fr. Dr. Christopher Damina establish SHEDAM Mental Health Initiative to bridge the mental health gap in Nigeria."},{"year":"2021","title":"First Community Forum","description":"Hosted our inaugural community awareness forum in Kubwa, Abuja, reaching 200+ attendees and sparking important conversations about mental health."},{"year":"2022","title":"Referral Network Established","description":"Partnered with licensed therapists, psychiatrists, and counsellors to create professional referral pathways for those in need."},{"year":"2023","title":"School Outreach Programme","description":"Launched mental health education workshops in secondary schools across FCT, reaching over 2,000 students and teachers."},{"year":"2024","title":"National Recognition","description":"Recognized by the Nigerian Psychological Association for outstanding community mental health work and advocacy."}]', type: 'TEXTAREA', groupName: 'about' },
    { key: 'founders_eyebrow', value: 'Our Founders', type: 'TEXT', groupName: 'about' },
    { key: 'founders_title', value: 'The Vision Behind SHEDAM', type: 'TEXT', groupName: 'about' },
    { key: 'founders_description', value: 'Catholic priests with extensive pastoral experience and professional training in mental health, whose experience showed that many individuals require timely, evidence-based psychological care.', type: 'TEXTAREA', groupName: 'about' },
    { key: 'about_team_title', value: 'The People Behind SHEDAM', type: 'TEXT', groupName: 'about' },
    { key: 'motto_eyebrow', value: 'Our Motto', type: 'TEXT', groupName: 'about' },
    { key: 'motto_part1', value: 'Creating Awareness.', type: 'TEXT', groupName: 'about' },
    { key: 'motto_part2', value: 'Breaking the Stigma.', type: 'TEXT', groupName: 'about' },
    { key: 'motto_part3', value: 'Connecting People to Professional Help.', type: 'TEXT', groupName: 'about' },
    { key: 'motto_sub', value: 'Guided by compassion and professional excellence, SHEDAM works to ensure that every person has access to the mental health support they deserve.', type: 'TEXTAREA', groupName: 'about' },
    { key: 'about_cta_title', value: 'Join Our Mission', type: 'TEXT', groupName: 'about' },
    { key: 'about_cta_description', value: 'Whether you volunteer, partner with us, or spread the word, you can make a real difference in someone\u2019s life.', type: 'TEXTAREA', groupName: 'about' },
    // Contact page
    { key: 'contact_hero_eyebrow', value: 'Get in Touch', type: 'TEXT', groupName: 'contact' },
    { key: 'contact_hero_title', value: 'We Are Here to', type: 'TEXT', groupName: 'contact' },
    { key: 'contact_hero_title_highlight', value: 'Help', type: 'TEXT', groupName: 'contact' },
    { key: 'contact_hero_description', value: 'Whether you have a question, need support, or want to partner with us, we would love to hear from you.', type: 'TEXTAREA', groupName: 'contact' },
    { key: 'contact_office_hours', value: '[{"day":"Monday \u2013 Friday","time":"9:00 AM \u2013 5:00 PM"},{"day":"Saturday","time":"10:00 AM \u2013 2:00 PM"},{"day":"Sunday","time":"Closed"}]', type: 'TEXTAREA', groupName: 'contact' },
    { key: 'contact_faqs', value: '[{"q":"How can I get mental health support?","a":"You can reach out via phone, WhatsApp or email. Our team will listen, understand your needs and connect you with the right professional or resource."},{"q":"Do you offer free counselling?","a":"Yes, we provide complimentary counselling sessions for individuals who cannot afford professional mental health services. Contact us to learn more."},{"q":"How can I volunteer or partner with SHEDAM?","a":"We welcome volunteers and partners! Use the contact form or email us at info@shedam.org with your interest and we will get back to you."},{"q":"Where are you located?","a":"Our office is in Kubwa, Bwari Area Council, FCT Abuja, Nigeria. We also serve communities virtually across Nigeria."},{"q":"What areas do you serve?","a":"We focus on FCT Abuja and surrounding states, with virtual services available nationwide. Our community programmes reach underserved areas across Nigeria."}]', type: 'TEXTAREA', groupName: 'contact' },
    { key: 'contact_map_query', value: 'Kubwa+Bwari+Area+Council+Abuja+Nigeria', type: 'TEXT', groupName: 'contact' },
    { key: 'contact_info_title', value: 'Let\u2019s Start a Conversation', type: 'TEXT', groupName: 'contact' },
    { key: 'contact_info_description', value: 'Reach out through any of the channels below or fill in the form and we will get back to you as soon as possible.', type: 'TEXTAREA', groupName: 'contact' },
    { key: 'contact_cta_title', value: 'Need Immediate Support?', type: 'TEXT', groupName: 'contact' },
    { key: 'contact_cta_description', value: 'If you are in crisis or need urgent help, please reach out directly through our helpline or WhatsApp.', type: 'TEXTAREA', groupName: 'contact' },
    // Get Help page
    { key: 'help_hero_eyebrow', value: 'You Are Not Alone', type: 'TEXT', groupName: 'help' },
    { key: 'help_hero_title', value: 'We Are Here', type: 'TEXT', groupName: 'help' },
    { key: 'help_hero_title_highlight', value: 'For You', type: 'TEXT', groupName: 'help' },
    { key: 'help_hero_description', value: 'Whether you are going through a difficult time, need someone to talk to, or want to help a loved one \u2014 we are here to support you every step of the way.', type: 'TEXTAREA', groupName: 'help' },
    { key: 'help_helplines_title', value: 'Helplines', type: 'TEXT', groupName: 'help' },
    { key: 'help_helplines', value: '[{"name":"SHEDAM Support Line","number":"+2348051772262","display":"0805 177 2262","available":"24/7","primary":true,"description":"Free, confidential support from trained professionals"},{"name":"Mental Health Foundation Nigeria","number":"08008002000","display":"0800 800 2000","available":"24/7","primary":false,"description":"Toll-free mental health helpline"},{"name":"Lagos State Emergency","number":"112","display":"112","available":"24/7","primary":false,"description":"Emergency services for immediate danger"}]', type: 'TEXTAREA', groupName: 'help' },
    { key: 'help_channels_title', value: 'Other Ways to Reach Us', type: 'TEXT', groupName: 'help' },
    { key: 'help_channels', value: '[{"label":"WhatsApp","description":"Chat with us confidentially","action":"https://wa.me/2348051772262","color":"#25D366","available":"24/7"},{"label":"Email Support","description":"Send us a message anytime","action":"mailto:support@shedam.org","color":"#3B82F6","available":"Response within 24hrs"},{"label":"Phone Call","description":"Speak with someone now","action":"tel:+2348051772262","color":"#88E788","available":"24/7"}]', type: 'TEXTAREA', groupName: 'help' },
    { key: 'help_warning_title', value: 'Warning Signs to Watch For', type: 'TEXT', groupName: 'help' },
    { key: 'help_warning_description', value: 'If you or someone you know is showing these signs, it may be time to reach out for help.', type: 'TEXTAREA', groupName: 'help' },
    { key: 'help_warning_signs', value: '["Persistent sadness or hopelessness","Withdrawal from friends and activities","Dramatic changes in eating or sleeping","Extreme mood swings or irritability","Increased use of alcohol or drugs","Talking about wanting to die","Giving away prized possessions","Sudden calmness after depression"]', type: 'TEXTAREA', groupName: 'help' },
    { key: 'help_crisis_title', value: 'In Crisis or Immediate Danger?', type: 'TEXT', groupName: 'help' },
    { key: 'help_crisis_description', value: 'If you or someone you know is in immediate danger, please call emergency services right now or go to the nearest hospital emergency room.', type: 'TEXTAREA', groupName: 'help' },
    { key: 'help_steps_eyebrow', value: 'Taking the First Step', type: 'TEXT', groupName: 'help' },
    { key: 'help_steps_title', value: 'How to Get Help', type: 'TEXT', groupName: 'help' },
    { key: 'help_steps_description', value: 'Taking the first step is brave. Here is how we can support you.', type: 'TEXTAREA', groupName: 'help' },
    { key: 'help_self_care_steps', value: '[{"step":"01","title":"Acknowledge Your Feelings","desc":"It is okay to not feel okay. Recognise what you are going through."},{"step":"02","title":"Talk to Someone You Trust","desc":"Share your feelings with a friend, family member or counsellor."},{"step":"03","title":"Reach Out for Professional Help","desc":"Contact our helpline or a mental health professional."},{"step":"04","title":"Take It One Day at a Time","desc":"Recovery is a journey. Be patient with yourself."}]', type: 'TEXTAREA', groupName: 'help' },
    { key: 'help_resources_title', value: 'Mental Health Resources', type: 'TEXT', groupName: 'help' },
    { key: 'help_cta_title', value: 'Taking the First Step Is Brave', type: 'TEXT', groupName: 'help' },
    { key: 'help_cta_description', value: 'You do not have to face this alone. We are here to listen, support and guide you towards the help you deserve.', type: 'TEXTAREA', groupName: 'help' },
    // Get Involved page
    { key: 'involve_hero_eyebrow', value: 'Get Involved', type: 'TEXT', groupName: 'involve' },
    { key: 'involve_hero_title', value: 'Join Our', type: 'TEXT', groupName: 'involve' },
    { key: 'involve_hero_title_highlight', value: 'Mission', type: 'TEXT', groupName: 'involve' },
    { key: 'involve_hero_description', value: 'There are many ways to be part of the change. Whether you volunteer your time, partner with us, or contribute financially, your support makes a real difference.', type: 'TEXTAREA', groupName: 'involve' },
    { key: 'involve_ways_title', value: 'Ways to Get Involved', type: 'TEXT', groupName: 'involve' },
    { key: 'involve_ways', value: '[{"title":"Volunteer","tagline":"Give Your Time","description":"Join our team of dedicated volunteers and contribute your time and skills to mental health advocacy.","color":"#88E788","bgColor":"bg-primary/10","items":["Community outreach and events","Peer support facilitation","Administrative support","Social media and communications"],"cta":"Become a Volunteer","ctaLink":"/contact"},{"title":"Partner With Us","tagline":"Grow Together","description":"We collaborate with organisations, healthcare providers, schools and government bodies to expand our reach.","color":"#D4A843","bgColor":"bg-[#D4A843]/10","items":["Corporate wellness programmes","Healthcare provider partnerships","School and university collaborations","NGO and government alliances"],"cta":"Explore Partnerships","ctaLink":"/contact"},{"title":"Donate","tagline":"Fund Change","description":"Your financial support helps us provide free counselling, run community events and reach underserved populations.","color":"#8B5CF6","bgColor":"bg-[#8B5CF6]/10","items":["Fund counselling sessions","Sponsor community events","Support school outreach","Enable free resources"],"cta":"Make a Donation","ctaLink":"/get-involved","isDonate":true},{"title":"Spread the Word","tagline":"Share the Message","description":"One of the simplest ways to help is by sharing our message. Talk about mental health and help us reach more people.","color":"#EC4899","bgColor":"bg-[#EC4899]/10","items":["Share our content on social media","Start conversations about mental health","Refer someone who needs help","Advocate for mental health in your community"],"cta":"Get in Touch","ctaLink":"/contact"}]', type: 'TEXTAREA', groupName: 'involve' },
    { key: 'involve_how_title', value: 'Getting Started Is Easy', type: 'TEXT', groupName: 'involve' },
    { key: 'involve_how_description', value: 'Three simple steps to make a difference', type: 'TEXTAREA', groupName: 'involve' },
    { key: 'involve_steps', value: '[{"step":"01","title":"Choose Your Way","desc":"Select how you want to contribute \u2014 volunteer, partner, donate or share."},{"step":"02","title":"Connect With Us","desc":"Reach out through our contact channels and we will guide you through the process."},{"step":"03","title":"Make an Impact","desc":"Start making a real difference in mental health support in your community."}]', type: 'TEXTAREA', groupName: 'involve' },
    { key: 'involve_contact_title', value: 'Reach Out to Us', type: 'TEXT', groupName: 'involve' },
    { key: 'involve_cta_title', value: 'Ready to Make a Difference?', type: 'TEXT', groupName: 'involve' },
    { key: 'involve_cta_description', value: 'Join us in creating a world where mental health is valued and supported for everyone.', type: 'TEXTAREA', groupName: 'involve' },
    // What We Do page
    { key: 'wwd_hero_eyebrow', value: 'Our Services', type: 'TEXT', groupName: 'sections' },
    { key: 'wwd_hero_title', value: 'What', type: 'TEXT', groupName: 'sections' },
    { key: 'wwd_hero_title_highlight', value: 'We Do', type: 'TEXT', groupName: 'sections' },
    { key: 'wwd_hero_description', value: 'From awareness campaigns to direct professional support, we provide a comprehensive range of services designed to improve mental health outcomes in our communities.', type: 'TEXTAREA', groupName: 'sections' },
    { key: 'wwd_section_eyebrow', value: 'What We Offer', type: 'TEXT', groupName: 'sections' },
    { key: 'wwd_section_title', value: 'Comprehensive Mental Health Services', type: 'TEXT', groupName: 'sections' },
    { key: 'wwd_section_description', value: 'Six pillars of support that address every aspect of mental wellbeing \u2014 from awareness to professional care.', type: 'TEXTAREA', groupName: 'sections' },
    { key: 'services_list', value: '[{"slug":"awareness","number":"01","title":"Mental Health Awareness","short":"Promoting understanding and acceptance","description":"We run campaigns, public forums and outreach programmes to promote understanding and acceptance of mental health conditions in communities across Nigeria.","highlights":["Community forums","Public campaigns","Media engagement","Digital outreach"],"image":"/images/projects/awareness.jpg","color":"#88E788"},{"slug":"education","number":"02","title":"Mental Health Education","short":"Building mental health literacy","description":"We deliver workshops, seminars and educational resources for individuals, schools, workplaces and community groups to build mental health literacy.","highlights":["School outreach","Workplace wellness","Community workshops","Educational materials"],"image":"/images/projects/educational-workshop.jpg","color":"#3B82F6"},{"slug":"referral","number":"03","title":"Professional Referral","short":"Connecting to quality care","description":"We connect individuals to licensed mental health professionals \u2014 psychologists, counsellors and psychiatrists \u2014 ensuring access to quality care.","highlights":["Therapist matching","Counselling coordination","Psychiatric referrals","Follow-up support"],"image":"/images/projects/support-referal-system.jpg","color":"#EF4444"},{"slug":"community","number":"04","title":"Community Support","short":"Building safe spaces and networks","description":"We build safe spaces and peer support networks that provide ongoing emotional support and a sense of belonging for those navigating mental health challenges.","highlights":["Peer support groups","Online communities","Safe spaces","Ongoing check-ins"],"image":"/images/projects/community-outreach.jpg","color":"#F59E0B"},{"slug":"vulnerable","number":"05","title":"Vulnerable Persons Support","short":"Reaching those who need it most","description":"We specialise in reaching those who need it most \u2014 the indigent, at-risk groups and underserved populations \u2014 helping them access care they might otherwise miss.","highlights":["Underserved outreach","Free counselling","Crisis intervention","NGO partnerships"],"image":"/images/banner/banner2.jpg","color":"#8B5CF6"},{"slug":"research","number":"06","title":"Research & Advocacy","short":"Driving systemic change","description":"We contribute to policy discussions and publish insights that advance mental health awareness and influence systemic change at community and national levels.","highlights":["Policy advocacy","Publications","Stakeholder engagement","Data insights"],"image":"/images/banner/banner3.jpeg","color":"#06B6D4"}]', type: 'TEXTAREA', groupName: 'sections' },
    { key: 'wwd_steps_title', value: 'Getting Support Is', type: 'TEXT', groupName: 'sections' },
    { key: 'wwd_steps_title_highlight', value: 'Simple', type: 'TEXT', groupName: 'sections' },
    { key: 'wwd_steps', value: '[{"step":"01","title":"Reach Out","desc":"Contact us through our helpline, WhatsApp, email or the get help page."},{"step":"02","title":"Get Connected","desc":"We listen, understand your needs and connect you to the right professional or resource."},{"step":"03","title":"Receive Support","desc":"Access counselling, therapy, peer support or ongoing care tailored to your situation."}]', type: 'TEXTAREA', groupName: 'sections' },
    { key: 'wwd_cta_title', value: 'Ready to Take the Next Step?', type: 'TEXT', groupName: 'sections' },
    { key: 'wwd_cta_description', value: 'You are not alone. We are here to help. Reach out today and let us connect you with the support you deserve.', type: 'TEXTAREA', groupName: 'sections' },
    { key: 'wwd_hero_image', value: '/images/projects/community-outreach.jpg', type: 'IMAGE', groupName: 'sections' },
    { key: 'services_bg_image', value: '/images/banner/banner1.jpg', type: 'IMAGE', groupName: 'sections' },
    { key: 'wwd_steps_eyebrow', value: 'How It Works', type: 'TEXT', groupName: 'sections' },
    { key: 'wwd_card_explore_label', value: 'Explore Service', type: 'TEXT', groupName: 'sections' },
    { key: 'wwd_cta_help_label', value: 'Get Help Now', type: 'TEXT', groupName: 'sections' },
    { key: 'wwd_cta_contact_label', value: 'Contact Us', type: 'TEXT', groupName: 'sections' },
    { key: 'wwd_meta_title', value: 'What We Do', type: 'TEXT', groupName: 'sections' },
    { key: 'wwd_meta_description', value: 'Explore the services and programmes SHEDAM offers — from mental health awareness campaigns to professional referrals and community support.', type: 'TEXTAREA', groupName: 'sections' },
    { key: 'sp_back_label', value: 'All Services', type: 'TEXT', groupName: 'services' },
    { key: 'sp_why_eyebrow', value: 'Why It Matters', type: 'TEXT', groupName: 'services' },
    { key: 'sp_activities_eyebrow', value: 'What We Do', type: 'TEXT', groupName: 'services' },
    { key: 'sp_activities_title', value: 'Our Activities', type: 'TEXT', groupName: 'services' },
    { key: 'sp_impact_eyebrow', value: 'Our Impact', type: 'TEXT', groupName: 'services' },
    { key: 'sp_impact_title', value: 'What This Achieves', type: 'TEXT', groupName: 'services' },
    { key: 'sp_cta_primary', value: 'Get Involved', type: 'TEXT', groupName: 'services' },
    { key: 'sp_cta_secondary', value: 'Contact Us', type: 'TEXT', groupName: 'services' },
    // Service detail pages (JSON per slug)
    { key: 'service_page_awareness', value: '{"badge":"Mental Health Awareness","title":"Mental Health","titleHighlight":"Awareness","description":"We run campaigns, public forums and outreach programmes to promote understanding and acceptance of mental health conditions in communities across Nigeria.","heroImage":"/images/projects/awareness.jpg","whyTitle":"Breaking the Silence Around Mental Health","whyDescription":"In Nigeria, one in four people will experience a mental health condition at some point in their lives. Yet stigma and misinformation prevent millions from seeking help. SHEDAM awareness campaigns create safe spaces for open dialogue, challenge harmful myths, and encourage people to view mental health as an integral part of overall wellbeing.","whyImage":"/images/projects/community-outreach.jpg","activities":[{"title":"Community Forums","description":"We host open community gatherings where mental health professionals share knowledge, answer questions and provide resources to reduce stigma."},{"title":"Public Awareness Campaigns","description":"Targeted campaigns using posters, flyers and digital content to reach diverse audiences and spread accurate mental health information."},{"title":"Media Engagement","description":"We partner with local media to broadcast mental health messages, interviews and features that reach millions across television, radio and online platforms."},{"title":"Social Media Advocacy","description":"Consistent digital campaigns across platforms that share educational content, personal stories and professional insights to reach younger audiences."}],"impact":["Reduced stigma in communities where we have run awareness campaigns","Increased willingness to seek professional help","More families openly discussing mental health","Greater media coverage of mental health issues","Stronger community networks for peer support"],"statNumber":"1,200+","statLabel":"Individuals reached through awareness campaigns","ctaTitle":"Help Us Spread the Word","ctaDescription":"Your support helps us reach more communities with life-saving mental health awareness messages."}', type: 'TEXTAREA', groupName: 'services' },
    { key: 'service_page_education', value: '{"badge":"Mental Health Education","title":"Mental Health","titleHighlight":"Education","description":"We deliver workshops, seminars and educational resources for individuals, schools, workplaces and community groups to build mental health literacy.","heroImage":"/images/projects/educational-workshop.jpg","whyTitle":"Knowledge Is the First Step to Prevention","whyDescription":"Mental health literacy empowers people to recognise early signs, support others and seek timely care. Our education programmes translate clinical knowledge into practical, culturally relevant learning for all ages.","whyImage":"/images/projects/educational-workshop.jpg","activities":[{"title":"School Workshops","description":"Interactive sessions in secondary schools teaching students about emotions, coping strategies and where to seek help."},{"title":"Teacher Training","description":"Equipping educators to identify warning signs and create supportive classroom environments."},{"title":"Workplace Seminars","description":"Lunch-and-learn sessions and full-day trainings that help organisations build mentally healthy cultures."},{"title":"Community Education","description":"Parish, market and community group sessions that bring mental health literacy to everyday settings."}],"impact":["Better mental health literacy across schools and workplaces","Earlier identification of people who need support","Healthier classroom and office environments","Reduced stigma through informed conversation"],"statNumber":"2,000+","statLabel":"Students and teachers reached","ctaTitle":"Invite Us to Your School or Workplace","ctaDescription":"Bring practical mental health education to your organisation \u2014 contact us to schedule a session."}', type: 'TEXTAREA', groupName: 'services' },
    { key: 'service_page_referral', value: '{"badge":"Professional Referral","title":"Professional","titleHighlight":"Referral","description":"We connect individuals to licensed mental health professionals \u2014 psychologists, counsellors and psychiatrists \u2014 ensuring access to quality care.","heroImage":"/images/projects/support-referal-system.jpg","whyTitle":"The Right Help at the Right Time","whyDescription":"Finding the right professional can be overwhelming. Our structured referral pathway listens first, matches needs with vetted providers and stays alongside individuals through follow-up support.","whyImage":"/images/projects/support-referal-system.jpg","activities":[{"title":"Needs Assessment","description":"Confidential conversations to understand each person\u2019s situation and preferences."},{"title":"Therapist Matching","description":"Matching individuals with licensed psychologists, counsellors or psychiatrists suited to their needs."},{"title":"Counselling Coordination","description":"Scheduling, preparation and briefing so sessions start smoothly."},{"title":"Follow-up Support","description":"Check-ins after referral to ensure care is working and adjust when needed."}],"impact":["Faster access to licensed professionals","Better match between person and provider","Continuity through structured follow-up","Reduced drop-off between first contact and first session"],"statNumber":"350+","statLabel":"Individuals referred to care","ctaTitle":"Need a Professional Referral?","ctaDescription":"Reach out today and we will connect you with the right professional confidentially and compassionately."}', type: 'TEXTAREA', groupName: 'services' },
    { key: 'service_page_community', value: '{"badge":"Community Support","title":"Community","titleHighlight":"Support","description":"We build safe spaces and peer support networks that provide ongoing emotional support and a sense of belonging for those navigating mental health challenges.","heroImage":"/images/projects/community-outreach.jpg","whyTitle":"Belonging Heals","whyDescription":"Isolation worsens mental health challenges. Community support groups create trusted spaces where people share experiences, reduce shame and sustain recovery together.","whyImage":"/images/projects/community-outreach.jpg","activities":[{"title":"Peer Support Groups","description":"Facilitated groups where people with shared experiences encourage and equip one another."},{"title":"Safe Spaces","description":"Regular meetups in trusted community locations designed for openness and confidentiality."},{"title":"Online Communities","description":"Moderated digital groups that extend support between in-person gatherings."},{"title":"Ongoing Check-ins","description":"Structured follow-ups that keep support networks active over time."}],"impact":["Stronger local support networks","Reduced isolation among participants","Sustained recovery through peer accountability","Community-owned mental health champions"],"statNumber":"500+","statLabel":"People in support networks","ctaTitle":"Join a Support Community","ctaDescription":"Find a peer support group near you or start one in your community with our guidance."}', type: 'TEXTAREA', groupName: 'services' },
    { key: 'service_page_vulnerable', value: '{"badge":"Vulnerable Persons Support","title":"Vulnerable Persons","titleHighlight":"Support","description":"We specialise in reaching those who need it most \u2014 the indigent, at-risk groups and underserved populations \u2014 helping them access care they might otherwise miss.","heroImage":"/images/banner/banner2.jpg","whyTitle":"Care Without Barriers","whyDescription":"Cost, distance and stigma keep many of the most vulnerable from getting help. We remove barriers through free or subsidised care, outreach and partnerships with local agencies.","whyImage":"/images/banner/banner2.jpg","activities":[{"title":"Free Counselling","description":"No-cost assessments and therapy sessions for economically disadvantaged individuals."},{"title":"Crisis Intervention","description":"Rapid response for people in acute distress or danger."},{"title":"Medication Support","description":"Assistance accessing and adhering to prescribed psychiatric medication."},{"title":"NGO Partnerships","description":"Collaborations that extend resources to underserved populations."}],"impact":["Care for people who could not otherwise afford it","Faster crisis response in partner communities","Better medication adherence through support","Stronger safety nets for at-risk groups"],"statNumber":"200+","statLabel":"Vulnerable individuals supported","ctaTitle":"Support the Most Vulnerable","ctaDescription":"Your gift funds free care for people who would otherwise go without \u2014 donate or partner with us today."}', type: 'TEXTAREA', groupName: 'services' },
    { key: 'service_page_research', value: '{"badge":"Research & Advocacy","title":"Research &","titleHighlight":"Advocacy","description":"We contribute to policy discussions and publish insights that advance mental health awareness and influence systemic change at community and national levels.","heroImage":"/images/banner/banner3.jpeg","whyTitle":"Evidence Drives Change","whyDescription":"Lasting mental health reform needs data and advocacy. Our research documents local realities and our advocacy translates findings into policy conversations that improve systems.","whyImage":"/images/banner/banner1.jpg","activities":[{"title":"Community Research","description":"Studies that capture lived experiences and service gaps in underserved communities."},{"title":"Policy Briefs","description":"Concise evidence summaries for legislators and public health decision-makers."},{"title":"Publications","description":"Articles and reports that share insights with professionals and the public."},{"title":"Stakeholder Engagement","description":"Forums that bring government, clinicians and communities together around mental health policy."}],"impact":["Stronger evidence base for local mental health needs","Increased policy attention to mental health","Better-informed programmes through research feedback","Wider public understanding of mental health issues"],"statNumber":"10+","statLabel":"Research and advocacy outputs","ctaTitle":"Support Research That Changes Policy","ctaDescription":"Partner with us to generate and share the evidence that drives better mental health systems."}', type: 'TEXTAREA', groupName: 'services' },
    // Homepage features section
    { key: 'features_list', value: '[{"slug":"awareness","number":"01","title":"Creating Awareness","description":"We run campaigns, public forums and outreach programmes to promote understanding and acceptance of mental health conditions in communities across Nigeria.","points":["Community forums","Public campaigns","Media engagement"],"image":"/images/projects/awareness.jpg","ctaLabel":"Learn More","ctaHref":"/what-we-do/awareness"},{"slug":"referral","number":"02","title":"Professional Support","description":"We connect individuals to licensed mental health professionals — psychologists, counsellors and psychiatrists — ensuring access to quality care.","points":["Therapist matching","Counselling","Psychiatric referrals"],"image":"/images/projects/support-referal-system.jpg","ctaLabel":"Explore Details","ctaHref":"/what-we-do/referral"},{"slug":"community","number":"03","title":"Community Care","description":"We build safe spaces and peer support networks that provide ongoing emotional support and a sense of belonging for those navigating mental health challenges.","points":["Peer support","Safe spaces","Ongoing check-ins"],"image":"/images/projects/community-outreach.jpg","ctaLabel":"Get Involved","ctaHref":"/get-involved"}]', type: 'TEXTAREA', groupName: 'sections' },
    // Listing page chrome
    { key: 'projects_hero_eyebrow', value: 'Our Projects', type: 'TEXT', groupName: 'sections' },
    { key: 'projects_hero_title', value: 'Creating', type: 'TEXT', groupName: 'sections' },
    { key: 'projects_hero_title_highlight', value: 'Real Change', type: 'TEXT', groupName: 'sections' },
    { key: 'projects_hero_description', value: 'Through targeted programmes and community engagement, we provide support, education and hope for a healthier tomorrow.', type: 'TEXTAREA', groupName: 'sections' },
    { key: 'projects_categories', value: '["All","Community","Education","Healthcare","Corporate"]', type: 'TEXTAREA', groupName: 'sections' },
    { key: 'projects_cta_title', value: 'Want to Support Our Projects?', type: 'TEXT', groupName: 'sections' },
    { key: 'projects_cta_description', value: 'Your contribution helps us reach more communities and create lasting impact. Every donation makes a difference.', type: 'TEXTAREA', groupName: 'sections' },
    { key: 'events_hero_eyebrow', value: 'Events & Programmes', type: 'TEXT', groupName: 'sections' },
    { key: 'events_hero_title', value: 'Join Our', type: 'TEXT', groupName: 'sections' },
    { key: 'events_hero_title_highlight', value: 'Events', type: 'TEXT', groupName: 'sections' },
    { key: 'events_hero_description', value: 'Attend our workshops, community forums and awareness events. Together, we can build a more mentally healthy society.', type: 'TEXTAREA', groupName: 'sections' },
    { key: 'events_upcoming_title', value: 'Upcoming Events', type: 'TEXT', groupName: 'sections' },
    { key: 'events_past_title', value: 'Past Events', type: 'TEXT', groupName: 'sections' },
    { key: 'events_past_description', value: 'A look back at the events that have shaped our journey and impacted communities.', type: 'TEXTAREA', groupName: 'sections' },
    { key: 'events_flyers_title', value: 'See What\u2019s Coming', type: 'TEXT', groupName: 'sections' },
    { key: 'events_cta_title', value: 'Don\u2019t Miss Out', type: 'TEXT', groupName: 'sections' },
    { key: 'events_cta_description', value: 'Stay updated on our upcoming events, workshops and community programmes. All events are free and open to the public.', type: 'TEXTAREA', groupName: 'sections' },
    { key: 'gallery_hero_title', value: 'Photo Gallery', type: 'TEXT', groupName: 'sections' },
    { key: 'gallery_hero_description', value: 'A visual journey through our community events, workshops, outreach programmes and the people who make our mission possible.', type: 'TEXTAREA', groupName: 'sections' },
    { key: 'gallery_categories', value: '["All","Events","Outreach","Education"]', type: 'TEXTAREA', groupName: 'sections' },
    { key: 'gallery_cta_title', value: 'Have Photos to Share?', type: 'TEXT', groupName: 'sections' },
    { key: 'gallery_cta_description', value: 'If you have photos from our events or programmes, we would love to feature them in our gallery.', type: 'TEXTAREA', groupName: 'sections' },
    { key: 'insights_trending_tags', value: '["Mental Health","Self-Care","Youth","Workplace","Awareness"]', type: 'TEXTAREA', groupName: 'sections' },
    { key: 'insights_cta_title', value: 'Want to Share Your Story?', type: 'TEXT', groupName: 'sections' },
    { key: 'insights_cta_description', value: 'We welcome contributions from mental health professionals, advocates and anyone with a story to share. Your voice matters.', type: 'TEXTAREA', groupName: 'sections' },

    // ── Homepage / section wiring (dynamic review) ──
    { key: 'home_insights_eyebrow', value: 'Insights', type: 'TEXT', groupName: 'sections' },
    { key: 'home_insights_title', value: 'Latest Articles', type: 'TEXT', groupName: 'sections' },
    { key: 'home_insights_cta', value: 'View All', type: 'TEXT', groupName: 'sections' },
    { key: 'home_insights_read_more', value: 'Read More', type: 'TEXT', groupName: 'sections' },
    { key: 'home_gallery_eyebrow', value: 'Gallery', type: 'TEXT', groupName: 'sections' },
    { key: 'home_gallery_title', value: 'Moments from Our Work', type: 'TEXT', groupName: 'sections' },
    { key: 'home_gallery_cta', value: 'View Gallery', type: 'TEXT', groupName: 'sections' },
    { key: 'home_help_title', value: 'You Are Not Alone.', type: 'TEXT', groupName: 'sections' },
    { key: 'home_help_description', value: 'It is okay to talk. It is okay to ask for help. It is okay to seek professional support.', type: 'TEXTAREA', groupName: 'sections' },
    { key: 'home_help_cta', value: 'Get Help Now', type: 'TEXT', groupName: 'sections' },
    { key: 'home_help_call_label', value: 'Call Us', type: 'TEXT', groupName: 'sections' },
    { key: 'home_help_note_prefix', value: 'Need immediate support?', type: 'TEXT', groupName: 'sections' },
    { key: 'home_help_or_call', value: 'Or call:', type: 'TEXT', groupName: 'sections' },
    { key: 'event_banner_eyebrow', value: 'Upcoming Event', type: 'TEXT', groupName: 'sections' },
    { key: 'event_banner_cta', value: 'Register Now', type: 'TEXT', groupName: 'sections' },
    { key: 'services_explore_cta', value: 'Explore All Services', type: 'TEXT', groupName: 'sections' },
    { key: 'services_help_cta', value: 'Get Help Now', type: 'TEXT', groupName: 'sections' },
    { key: 'services_title_highlight', value: 'Do', type: 'TEXT', groupName: 'sections' },
    { key: 'projects_view_all_cta', value: 'View All Projects', type: 'TEXT', groupName: 'sections' },
    { key: 'projects_donate_cta', value: 'Donate Now', type: 'TEXT', groupName: 'sections' },
    { key: 'events_section_title', value: 'Get Involved', type: 'TEXT', groupName: 'sections' },
    { key: 'events_section_description', value: 'Attend our events, workshops, and outreach programs to support mental health awareness and community wellbeing.', type: 'TEXTAREA', groupName: 'sections' },
    { key: 'events_view_all_cta', value: 'View All Events', type: 'TEXT', groupName: 'sections' },
    { key: 'events_stat1_label', value: 'Events Held', type: 'TEXT', groupName: 'sections' },
    { key: 'events_stat2_label', value: 'Attendees', type: 'TEXT', groupName: 'sections' },
    { key: 'events_stat3_label', value: 'Locations', type: 'TEXT', groupName: 'sections' },
    { key: 'events_stat4_label', value: 'Free Entry', type: 'TEXT', groupName: 'sections' },
    { key: 'impact_stats', value: '[]', type: 'TEXTAREA', groupName: 'sections' },
    { key: 'impact_stat1_label', value: 'People Reached', type: 'TEXT', groupName: 'sections' },
    { key: 'impact_stat2_label', value: 'Communities', type: 'TEXT', groupName: 'sections' },
    { key: 'impact_stat3_label', value: 'Programs', type: 'TEXT', groupName: 'sections' },
    { key: 'partners_cta', value: 'Become a Partner', type: 'TEXT', groupName: 'sections' },
    { key: 'partners_bottom_label', value: 'Partner Organisations', type: 'TEXT', groupName: 'sections' },
    { key: 'partners_bottom_note', value: 'And growing across Nigeria and beyond', type: 'TEXT', groupName: 'sections' },
    { key: 'partners_view_all', value: 'View all partners', type: 'TEXT', groupName: 'sections' },
    { key: 'partners_list', value: '[{"label":"Professional Bodies","partners":[{"name":"Nigerian Psychological Association","abbr":"NPA"},{"name":"Nigerian Medical Association","abbr":"NMA"},{"name":"Association of Psychiatrists in Nigeria","abbr":"APN"}]},{"label":"Government & Healthcare","partners":[{"name":"Federal Ministry of Health","abbr":"FMoH"},{"name":"National Hospital Abuja","abbr":"NHA"},{"name":"FCT Primary Health Care Board","abbr":"FPHCB"}]},{"label":"Academic & Research","partners":[{"name":"University of Abuja","abbr":"UniAbuja"},{"name":"Nigerian Defence Academy","abbr":"NDA"},{"name":"Baze University","abbr":"Baze"}]},{"label":"International & Development","partners":[{"name":"World Health Organization","abbr":"WHO"},{"name":"UNICEF Nigeria","abbr":"UNICEF"},{"name":"Mental Health Foundation","abbr":"MHF"}]}]', type: 'TEXTAREA', groupName: 'sections' },
    { key: 'contact_follow_title', value: 'Follow Us', type: 'TEXT', groupName: 'contact' },
    { key: 'support_heading', value: 'Need Support?', type: 'TEXT', groupName: 'support' },
    { key: 'support_description', value: 'We are here to listen. Chat with us for mental health support.', type: 'TEXTAREA', groupName: 'support' },
    { key: 'support_status_label', value: 'Online', type: 'TEXT', groupName: 'support' },
    { key: 'support_chat_label', value: 'Start Chat', type: 'TEXT', groupName: 'support' },
    { key: 'support_chat_channel', value: 'WhatsApp', type: 'TEXT', groupName: 'support' },
    { key: 'support_call_label', value: 'Call Us', type: 'TEXT', groupName: 'support' },
    { key: 'support_email_label', value: 'Email Us', type: 'TEXT', groupName: 'support' },
    { key: 'support_crisis_text', value: 'If you or someone you know is in immediate danger, please call emergency services.', type: 'TEXTAREA', groupName: 'support' },
    { key: 'about_team_eyebrow', value: 'Our Team', type: 'TEXT', groupName: 'about' },
    { key: 'about_story_cta', value: 'Our Story', type: 'TEXT', groupName: 'about' },
    { key: 'about_mission_label', value: 'Our Mission', type: 'TEXT', groupName: 'about' },
    { key: 'about_vision_label', value: 'Our Vision', type: 'TEXT', groupName: 'about' },
    { key: 'about_values_label', value: 'Our Values', type: 'TEXT', groupName: 'about' },
    { key: 'projects_stat_lives', value: '3,200+', type: 'TEXT', groupName: 'sections' },
    { key: 'projects_stat_active', value: '6', type: 'TEXT', groupName: 'sections' },
    { key: 'projects_stat_communities', value: '12', type: 'TEXT', groupName: 'sections' },
    { key: 'projects_stat_funds', value: '₦10M+', type: 'TEXT', groupName: 'sections' },
    { key: 'involve_stat_people_label', value: 'People Reached', type: 'TEXT', groupName: 'sections' },
    { key: 'involve_stat_volunteers_label', value: 'Volunteers', type: 'TEXT', groupName: 'sections' },
    { key: 'involve_stat_events_label', value: 'Events Held', type: 'TEXT', groupName: 'sections' },
    { key: 'involve_stat_free_label', value: 'Free Services', type: 'TEXT', groupName: 'sections' },
    { key: 'spotlight_eyebrow', value: 'Spotlight', type: 'TEXT', groupName: 'sections' },
    { key: 'spotlight_title', value: 'Voices of Change', type: 'TEXT', groupName: 'sections' },
    { key: 'spotlight_description', value: 'Leading professionals share their insights on mental health awareness, advocacy, and the work ahead.', type: 'TEXTAREA', groupName: 'sections' },
    { key: 'footer_quick_links_title', value: 'Quick Links', type: 'TEXT', groupName: 'sections' },
    { key: 'footer_support_title', value: 'Support Us', type: 'TEXT', groupName: 'sections' },
    { key: 'footer_newsletter_title', value: 'Stay Updated', type: 'TEXT', groupName: 'sections' },
    { key: 'donate_cta', value: 'Donate Now', type: 'TEXT', groupName: 'sections' },
    { key: 'donation_bank_name', value: 'Guaranty Trust Bank (GTBank)', type: 'TEXT', groupName: 'donation' },
    { key: 'donation_account_name', value: 'SHEDAM Mental Health Initiative', type: 'TEXT', groupName: 'donation' },
    { key: 'donation_account_number', value: '0123456789', type: 'TEXT', groupName: 'donation' },
    { key: 'donation_sort_code', value: '058', type: 'TEXT', groupName: 'donation' },
    { key: 'registration_interests', value: '["Mental Health Awareness","Community Support","Professional Referral","School Programme","Workplace Wellness","Volunteering","Partnership","Other"]', type: 'TEXTAREA', groupName: 'general' },
    { key: 'resources_page_eyebrow', value: 'Free Downloads', type: 'TEXT', groupName: 'insights' },
    { key: 'resources_page_title', value: 'Mental Health', type: 'TEXT', groupName: 'insights' },
    { key: 'resources_page_title_highlight', value: 'Resources', type: 'TEXT', groupName: 'insights' },
    { key: 'resources_page_description', value: 'Guides, checklists and practical tools to support your mental wellbeing — free to read and download.', type: 'TEXTAREA', groupName: 'insights' },
    { key: 'partners_page_eyebrow', value: 'Our Network', type: 'TEXT', groupName: 'home' },
    { key: 'partners_page_title', value: 'Our', type: 'TEXT', groupName: 'home' },
    { key: 'partners_page_title_highlight', value: 'Partners', type: 'TEXT', groupName: 'home' },
    { key: 'partners_page_description', value: 'We collaborate with government agencies, healthcare institutions, professional bodies, and international organisations to strengthen mental health systems across Nigeria.', type: 'TEXTAREA', groupName: 'home' },
  ];

  // Re-chunk legacy "sections" catch-all into page-aligned groups for the tabbed settings UI
  function resolveGroup(key: string, groupName: string): string {
    if (groupName !== 'sections') return groupName;
    if (key.startsWith('wwd_') || key === 'services_list') return 'wwd';
    if (key.startsWith('involve_')) return 'involve';
    if (key.startsWith('footer_')) return 'general';
    if (
      key.startsWith('home_') ||
      key.startsWith('spotlight_') ||
      key.startsWith('partners_') ||
      key.startsWith('impact_') ||
      key.startsWith('donate_') ||
      key.startsWith('video_') ||
      key.startsWith('event_banner_') ||
      key === 'newsletter_title' ||
      key === 'features_list'
    )
      return 'home';
    if (key.startsWith('about_')) return 'home'; // homepage about preview block
    if (key.startsWith('services_')) return 'home'; // homepage services section
    if (key.startsWith('projects_')) {
      if (key === 'projects_view_all_cta' || key === 'projects_donate_cta') return 'home';
      return 'projects';
    }
    if (key.startsWith('events_')) {
      if (key.startsWith('events_section_') || key === 'events_view_all_cta') return 'home';
      return 'events';
    }
    if (key.startsWith('gallery_')) return 'gallery';
    if (key.startsWith('insights_')) return 'insights';
    return 'home';
  }

  for (const setting of settings) {
    const group = resolveGroup(setting.key, setting.groupName);
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value, type: setting.type as any, groupName: group },
      create: { ...setting, groupName: group } as any,
    });
  }
  console.log('Site settings seeded.');

  // ── Navigation ──
  const navItems = [
    { id: 'nav-home', label: 'Home', url: '/', sortOrder: 0, location: 'HEADER' as const },
    { id: 'nav-about', label: 'About Us', url: '/about', sortOrder: 1, location: 'HEADER' as const },
    { id: 'nav-what-we-do', label: 'What We Do', url: '/what-we-do', sortOrder: 2, location: 'HEADER' as const },
    { id: 'nav-projects', label: 'Projects', url: '/projects', sortOrder: 3, location: 'HEADER' as const },
    { id: 'nav-events', label: 'Events', url: '/events', sortOrder: 4, location: 'HEADER' as const },
    { id: 'nav-insights', label: 'Insights', url: '/insights', sortOrder: 5, location: 'HEADER' as const },
    { id: 'nav-resources', label: 'Resources', url: '/resources', sortOrder: 6, location: 'HEADER' as const },
    { id: 'nav-partners', label: 'Partners', url: '/partners', sortOrder: 7, location: 'HEADER' as const },
    { id: 'nav-gallery', label: 'Gallery', url: '/gallery', sortOrder: 8, location: 'HEADER' as const },
    { id: 'nav-contact', label: 'Contact', url: '/contact', sortOrder: 9, location: 'HEADER' as const },
    { id: 'nav-footer-home', label: 'Home', url: '/', sortOrder: 0, location: 'FOOTER' as const },
    { id: 'nav-footer-about', label: 'About Us', url: '/about', sortOrder: 1, location: 'FOOTER' as const },
    { id: 'nav-footer-what', label: 'What We Do', url: '/what-we-do', sortOrder: 2, location: 'FOOTER' as const },
    { id: 'nav-footer-projects', label: 'Projects', url: '/projects', sortOrder: 3, location: 'FOOTER' as const },
    { id: 'nav-footer-insights', label: 'Insights', url: '/insights', sortOrder: 4, location: 'FOOTER' as const },
    { id: 'nav-footer-resources', label: 'Resources', url: '/resources', sortOrder: 5, location: 'FOOTER' as const },
    { id: 'nav-footer-partners', label: 'Partners', url: '/partners', sortOrder: 6, location: 'FOOTER' as const },
    { id: 'nav-footer-contact', label: 'Contact', url: '/contact', sortOrder: 7, location: 'FOOTER' as const },
  ];

  for (const item of navItems) {
    await prisma.navigationItem.upsert({
      where: { id: item.id },
      update: { label: item.label, url: item.url, sortOrder: item.sortOrder, location: item.location },
      create: item,
    });
  }
  console.log('Navigation items seeded.');

  // ── Homepage sections (matches live page order) ──
  const sections = [
    { id: 'hs-hero', sectionType: 'hero', title: 'Hero', sortOrder: 0, config: {} },
    { id: 'hs-torn-edge', sectionType: 'torn_edge', title: 'Torn Edge Divider', sortOrder: 1, config: {} },
    { id: 'hs-floating-banner', sectionType: 'floating_banner', title: 'Donate Banner', sortOrder: 2, config: {} },
    { id: 'hs-stats', sectionType: 'stats', title: 'Impact Stats', sortOrder: 3, config: {} },
    { id: 'hs-about-preview', sectionType: 'about_preview', title: 'About Preview', sortOrder: 4, config: {} },
    { id: 'hs-services', sectionType: 'services', title: 'Services', sortOrder: 5, config: {} },
    { id: 'hs-features', sectionType: 'features', title: 'Features', sortOrder: 6, config: {} },
    { id: 'hs-projects', sectionType: 'projects', title: 'Projects', sortOrder: 7, config: {} },
    { id: 'hs-spotlight', sectionType: 'spotlight', title: 'Spotlight', sortOrder: 8, config: {} },
    { id: 'hs-masonry-gallery', sectionType: 'masonry_gallery', title: 'Gallery Grid', sortOrder: 9, config: {} },
    { id: 'hs-video', sectionType: 'video', title: 'Our Story Video', sortOrder: 10, config: {} },
    { id: 'hs-events-list', sectionType: 'events_list', title: 'Upcoming Events', sortOrder: 11, config: {} },
    { id: 'hs-partners', sectionType: 'partners', title: 'Partners', sortOrder: 12, config: {} },
    { id: 'hs-impact-gallery-help', sectionType: 'impact_gallery_help', title: 'Impact, Gallery & Get Help', sortOrder: 13, config: {} },
    { id: 'hs-blog-preview', sectionType: 'blog_preview', title: 'Blog Preview', sortOrder: 14, config: {} },
    { id: 'hs-newsletter', sectionType: 'newsletter', title: 'Newsletter', sortOrder: 15, config: {} },
  ];

  // Remove stale section rows from older seeds, then upsert current set
  await prisma.homepageSection.deleteMany({});
  for (const section of sections) {
    await prisma.homepageSection.upsert({
      where: { id: section.id },
      update: { sectionType: section.sectionType, title: section.title, sortOrder: section.sortOrder, config: section.config },
      create: section,
    });
  }
  console.log('Homepage sections seeded.');

  // ── Projects ──
  const projects = [
    {
      slug: 'mental-health-awareness-campaigns',
      title: 'Mental Health Awareness Campaigns',
      summary: 'Public education and community outreach to promote mental health literacy and reduce stigma across Nigeria.',
      body: { type: 'doc', content: [{ type: 'paragraph', text: 'Through town-hall forums, media campaigns and community events, we bring mental health conversations to the streets, schools and workplaces across Nigeria.' }] },
      category: 'Community',
      coverMediaId: mediaAssets['awareness'],
      status: 'PUBLISHED',
      startDate: new Date('2023-01-15'),
      endDate: null,
      ctaLabel: 'Support This Project',
      ctaUrl: '/get-involved',
      publishedAt: new Date('2023-06-01'),
    },
    {
      slug: 'professional-referral-pathway',
      title: 'Support & Referral Services',
      summary: 'Connecting individuals with qualified psychologists, psychiatrists, counsellors and rehabilitation centres.',
      body: { type: 'doc', content: [{ type: 'paragraph', text: 'Our professional referral pathway links people in need with vetted, licensed mental health professionals through a confidential, compassionate process.' }] },
      category: 'Professional Help',
      coverMediaId: mediaAssets['referral'],
      status: 'PUBLISHED',
      startDate: new Date('2023-03-01'),
      endDate: null,
      ctaLabel: 'Referral Services',
      ctaUrl: '/get-help',
      publishedAt: new Date('2023-07-01'),
    },
    {
      slug: 'community-support-networks',
      title: 'Community Outreach Programs',
      summary: 'Free mental health screenings, consultations and support groups in underserved communities.',
      body: { type: 'doc', content: [{ type: 'paragraph', text: 'We take mental health services directly to communities, offering free screenings, group therapy and family support where help is needed most.' }] },
      category: 'Community',
      coverMediaId: mediaAssets['community'],
      status: 'PUBLISHED',
      startDate: new Date('2023-05-01'),
      endDate: null,
      ctaLabel: 'Get Involved',
      ctaUrl: '/get-involved',
      publishedAt: new Date('2023-08-01'),
    },
    {
      slug: 'school-mental-health-programme',
      title: 'Educational Workshops',
      summary: 'Mental health education, peer support and early identification systems in schools.',
      body: { type: 'doc', content: [{ type: 'paragraph', text: 'Our school programme equips students and teachers with mental health literacy, anti-bullying strategies and peer-support systems.' }] },
      category: 'Education',
      coverMediaId: mediaAssets['workshop'],
      status: 'PUBLISHED',
      startDate: new Date('2024-01-10'),
      endDate: null,
      ctaLabel: 'Invite Us To Your School',
      ctaUrl: '/contact',
      publishedAt: new Date('2024-02-01'),
    },
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: project,
      create: { ...project, authorId },
    });
  }
  console.log('Projects seeded:', projects.length);

  // ── Events ──
  const events = [
    {
      slug: 'mental-health-awareness-walk-2026',
      title: 'Mental Health Awareness Walk',
      description: 'Join us for a community walk to raise awareness about mental health and reduce stigma.',
      body: { type: 'doc', content: [{ type: 'paragraph', text: 'A family-friendly community walk through the city to bring mental health into public conversation. Free and open to everyone.' }] },
      startAt: new Date('2026-12-15T10:00:00'),
      endAt: new Date('2026-12-15T14:00:00'),
      timezone: 'Africa/Lagos',
      venue: 'Eagle Square',
      venueAddress: 'Central Area, Abuja',
      coverMediaId: mediaAssets['flier1'],
      isFeatured: true,
      status: 'PUBLISHED',
      publishedAt: new Date('2026-01-01'),
    },
    {
      slug: 'youth-mental-health-workshop-2026',
      title: 'Youth Mental Health Workshop',
      description: 'Interactive workshop designed to equip young people with mental health coping strategies.',
      body: { type: 'doc', content: [{ type: 'paragraph', text: 'A hands-on workshop covering stress management, self-care and how to support peers through difficult times.' }] },
      startAt: new Date('2026-11-02T09:00:00'),
      endAt: new Date('2026-11-02T15:00:00'),
      timezone: 'Africa/Lagos',
      venue: 'SHEDAM Community Hall',
      venueAddress: 'Kubwa, Abuja',
      coverMediaId: mediaAssets['flyer1'],
      isFeatured: false,
      status: 'PUBLISHED',
      publishedAt: new Date('2026-01-15'),
    },
    {
      slug: 'community-outreach-programme-2026',
      title: 'Community Outreach Program',
      description: 'Providing free mental health screenings and consultations in underserved communities.',
      body: { type: 'doc', content: [{ type: 'paragraph', text: 'Our outreach team brings free mental health screenings, counselling and referrals directly to the community.' }] },
      startAt: new Date('2026-10-20T08:00:00'),
      endAt: new Date('2026-10-20T16:00:00'),
      timezone: 'Africa/Lagos',
      venue: 'Community Health Centre',
      venueAddress: 'Gwarinpa, Abuja',
      coverMediaId: mediaAssets['flyer3'],
      isFeatured: false,
      status: 'PUBLISHED',
      publishedAt: new Date('2026-02-01'),
    },
  ];

  for (const event of events) {
    await prisma.event.upsert({
      where: { slug: event.slug },
      update: event,
      create: { ...event, authorId },
    });
  }
  console.log('Events seeded:', events.length);

  // ── Articles ──
  const articles = [
    {
      slug: 'understanding-mental-health',
      title: 'Understanding Mental Health',
      excerpt: 'A practical guide to what mental health is and why it matters for everyone.',
      body: { type: 'doc', content: [{ type: 'paragraph', text: 'Mental health is about how we think, feel and behave. Good mental health does not mean being happy all the time; it means being able to cope with the normal stresses of life, work productively and contribute meaningfully to our community.' }] },
      category: 'Mental Health',
      coverMediaId: mediaAssets['post1'],
      status: 'PUBLISHED',
      publishedAt: new Date('2026-03-10'),
    },
    {
      slug: 'breaking-stigma-around-mental-health',
      title: 'Breaking the Stigma Around Mental Health',
      excerpt: 'Why stigma hurts and how we can all help end it.',
      body: { type: 'doc', content: [{ type: 'paragraph', text: 'Stigma prevents people from seeking the help they need. Speaking openly, using respectful language and sharing real stories are powerful ways to break down barriers.' }] },
      category: 'Awareness',
      coverMediaId: mediaAssets['post2'],
      status: 'PUBLISHED',
      publishedAt: new Date('2026-03-24'),
    },
    {
      slug: 'supporting-children-mental-health',
      title: 'Supporting Children\'s Mental Health',
      excerpt: 'Practical tips for parents and teachers to support young minds.',
      body: { type: 'doc', content: [{ type: 'paragraph', text: 'Children express distress differently from adults. Creating safe spaces to talk, validating their feelings and modeling healthy coping are essential building blocks.' }] },
      category: 'Education',
      coverMediaId: mediaAssets['post3'],
      status: 'PUBLISHED',
      publishedAt: new Date('2026-04-08'),
    },
    {
      slug: 'self-care-mental-health',
      title: 'Self-Care Strategies That Actually Work',
      excerpt: 'Simple daily habits to improve your mental wellbeing.',
      body: { type: 'doc', content: [{ type: 'paragraph', text: 'Self-care is not selfish. Sleep, movement, connection and boundaries protect your mental health and help you show up for others.' }] },
      category: 'Wellbeing',
      coverMediaId: mediaAssets['post4'],
      status: 'PUBLISHED',
      publishedAt: new Date('2026-04-22'),
    },
    {
      slug: 'workplace-mental-health',
      title: 'Workplace Mental Health',
      excerpt: 'Creating a mentally healthy environment at work benefits everyone.',
      body: { type: 'doc', content: [{ type: 'paragraph', text: 'Employers and colleagues share responsibility for workplace mental health. Flexible policies, open conversations and access to support reduce burnout and improve performance.' }] },
      category: 'Workplace',
      coverMediaId: mediaAssets['post5'],
      status: 'PUBLISHED',
      publishedAt: new Date('2026-05-06'),
    },
    {
      slug: 'youth-mental-health-crisis',
      title: 'The Youth Mental Health Crisis',
      excerpt: 'Supporting young people through rising mental health challenges.',
      body: { type: 'doc', content: [{ type: 'paragraph', text: 'Young people today face unprecedented pressures. Early intervention, peer support and community involvement are key to protecting their mental health.' }] },
      category: 'Youth',
      coverMediaId: mediaAssets['post6'],
      status: 'PUBLISHED',
      publishedAt: new Date('2026-05-20'),
    },
  ];

  const articleTags: Record<string, string[]> = {
    'understanding-mental-health': ['mental-health', 'guide'],
    'breaking-stigma-around-mental-health': ['stigma', 'awareness'],
    'supporting-children-mental-health': ['children', 'parents', 'education'],
    'self-care-mental-health': ['self-care', 'wellbeing'],
    'workplace-mental-health': ['workplace', 'burnout'],
    'youth-mental-health-crisis': ['youth', 'school'],
  };

  for (const article of articles) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: article,
      create: { ...article, authorId },
    });
    const record = await prisma.article.findUnique({ where: { slug: article.slug } });
    if (record) {
      await prisma.articleTag.deleteMany({ where: { articleId: record.id } });
      for (const tag of articleTags[article.slug] || []) {
        await prisma.articleTag.create({ data: { articleId: record.id, tag } });
      }
    }
  }
  console.log('Articles seeded:', articles.length);

  // ── Team members ──
  const teamMembers = [
    {
      name: 'Rev. Fr. Istifanus Sheyin',
      slug: 'rev-fr-istifanus-sheyin',
      role: 'Co-Founder',
      headline: 'Clinical Psychologist & Pastoral Counsellor',
      bio: 'Clinical Psychologist with extensive pastoral experience and professional training in mental health. Co-founder of SHEDAM Mental Health Initiative, he has devoted his career to bridging faith and evidence-based psychological care for individuals and communities across Nigeria.',
      photoUrl: '/images/banner/banner3.jpeg',
      sortOrder: 0,
      qualifications: ['Clinical Psychology', 'Pastoral Counselling', 'Mental Health Advocacy'],
      email: 'istifanus@shedam.org',
    },
    {
      name: 'Rev. Fr. Dr. Christopher Damina',
      slug: 'rev-fr-dr-christopher-damina',
      role: 'Co-Founder',
      headline: 'Guidance & Counselling Expert',
      bio: 'Professional in Guidance and Counselling with deep commitment to holistic human wellbeing. Co-founder of SHEDAM, he brings decades of experience in education, counselling, and community development to the initiative.',
      photoUrl: '/images/banner/banner2.jpg',
      sortOrder: 1,
      qualifications: ['Guidance & Counselling', 'Community Development', 'Public Speaking'],
      email: 'christopher@shedam.org',
    },
    {
      name: 'Dr. Sarah Johnson',
      slug: 'dr-sarah-johnson',
      role: 'Programme Director',
      headline: 'Clinical Psychology & Advocacy',
      bio: 'Clinical psychologist with 15+ years of experience in mental health advocacy, programme design, and community-based intervention across West Africa.',
      photoUrl: '/images/banner/banner3.jpeg',
      sortOrder: 2,
      qualifications: ['Clinical Psychology', 'Programme Management'],
    },
    {
      name: 'Emmanuel Okonkwo',
      slug: 'emmanuel-okonkwo',
      role: 'Operations Manager',
      headline: 'Public Health Operations',
      bio: 'Public health specialist focused on community mental health interventions, logistics, and operational excellence for SHEDAM programmes.',
      photoUrl: '/images/banner/banner2.jpg',
      sortOrder: 3,
      qualifications: ['Public Health', 'Operations Management'],
    },
    {
      name: 'Fatima Abdullahi',
      slug: 'fatima-abdullahi',
      role: 'Head of Communications',
      headline: 'Mental Health Awareness Advocacy',
      bio: 'Award-winning journalist turned mental health awareness advocate, leading SHEDAM communications, media relations, and public education campaigns.',
      photoUrl: '/images/projects/community-outreach.jpg',
      sortOrder: 4,
      qualifications: ['Journalism', 'Strategic Communications'],
    },
    {
      name: 'Chidi Eze',
      slug: 'chidi-eze',
      role: 'Volunteer Coordinator',
      headline: 'Community Support Networks',
      bio: 'Social worker passionate about building support networks in underserved communities and coordinating SHEDAM volunteers nationwide.',
      photoUrl: '/images/projects/educational-workshop.jpg',
      sortOrder: 5,
      qualifications: ['Social Work', 'Volunteer Management'],
    },
  ];

  for (const member of teamMembers) {
    const id = `team-${member.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    await prisma.teamMember.upsert({
      where: { id },
      update: member,
      create: { id, ...member },
    });
  }
  console.log('Team members seeded:', teamMembers.length);

  const teamItems = [
    {
      memberId: 'team-rev-fr-istifanus-sheyin',
      kind: 'SEMINAR',
      title: 'Faith and Mental Health: A Pastoral Approach',
      description: 'A seminar exploring how faith communities can support evidence-based mental health care without stigma.',
      venue: 'Catholic Secretariat, Abuja',
      date: new Date('2024-03-15'),
      sortOrder: 0,
    },
    {
      memberId: 'team-rev-fr-istifanus-sheyin',
      kind: 'CONTRIBUTION',
      title: 'Founded SHEDAM Mental Health Initiative',
      description: 'Co-founded SHEDAM to bridge the mental health gap in Nigeria through awareness, education, and professional referral.',
      date: new Date('2020-01-01'),
      sortOrder: 1,
    },
    {
      memberId: 'team-rev-fr-dr-christopher-damina',
      kind: 'TALK',
      title: 'Holistic Wellbeing in Education Settings',
      description: 'Keynote on integrating guidance, counselling, and mental health support in secondary schools.',
      venue: 'Teachers Service Commission Forum, Abuja',
      date: new Date('2023-11-08'),
      sortOrder: 0,
    },
    {
      memberId: 'team-rev-fr-dr-christopher-damina',
      kind: 'CONTRIBUTION',
      title: 'Co-Founded SHEDAM Mental Health Initiative',
      description: 'Partnered to establish SHEDAM, promoting professional mental healthcare alongside pastoral care.',
      date: new Date('2020-01-01'),
      sortOrder: 1,
    },
    {
      memberId: 'team-rev-fr-istifanus-sheyin',
      kind: 'MEDIA',
      title: 'Community awareness outreach',
      description: 'SHEDAM community outreach',
      url: '/images/projects/community-outreach.jpg',
      date: new Date('2024-05-12'),
      sortOrder: 0,
    },
    {
      memberId: 'team-rev-fr-istifanus-sheyin',
      kind: 'MEDIA',
      title: 'Mental health awareness seminar',
      description: 'Faith and mental health seminar',
      url: '/images/projects/awareness.jpg',
      date: new Date('2024-03-15'),
      sortOrder: 1,
    },
    {
      memberId: 'team-rev-fr-dr-christopher-damina',
      kind: 'MEDIA',
      title: 'Educational workshop facilitation',
      description: 'School wellbeing workshop',
      url: '/images/projects/educational-workshop.jpg',
      date: new Date('2023-11-08'),
      sortOrder: 0,
    },
  ];

  for (const item of teamItems) {
    const id = `team-item-${item.memberId.replace(/^team-/, '')}-${item.kind.toLowerCase()}-${item.sortOrder}`;
    await prisma.teamMemberItem.upsert({
      where: { id },
      update: item,
      create: { id, ...item },
    });
  }
  console.log('Team member items seeded:', teamItems.length);

  // ── Stories ──
  const stories = [
    {
      title: 'Finding Help Changed My Life',
      body: 'After months of struggling silently, I reached out to SHEDAM. The referral team connected me with a therapist who truly listened.',
      quote: 'I realised I was not alone, and that it is okay to ask for help.',
      personLabel: 'Anonymous Beneficiary, Abuja',
      mediaId: null,
      consentStatus: 'VERIFIED',
      consentDate: new Date('2026-02-01'),
      status: 'PUBLISHED',
      publishedAt: new Date('2026-02-10'),
    },
    {
      title: 'A Community That Cares',
      body: 'When my brother needed urgent help, our community support group had a referral within days. The difference it made is indescribable.',
      quote: 'SHEDAM turned our darkest season into a story of hope.',
      personLabel: 'Family Support Member, Lagos',
      mediaId: null,
      consentStatus: 'VERIFIED',
      consentDate: new Date('2026-03-01'),
      status: 'PUBLISHED',
      publishedAt: new Date('2026-03-15'),
    },
    {
      title: 'Hope After the Diagnosis',
      body: 'I feared my diagnosis would isolate me. Instead, SHEDAM helped me find a support circle that walked with me through recovery.',
      quote: 'Now I am a volunteer helping others find the same hope.',
      personLabel: 'Volunteer, Port Harcourt',
      mediaId: null,
      consentStatus: 'VERIFIED',
      consentDate: new Date('2026-04-01'),
      status: 'PUBLISHED',
      publishedAt: new Date('2026-04-20'),
    },
  ];

  const existingStoryCount = await prisma.story.count();
  if (existingStoryCount === 0) {
    for (const story of stories) {
      await prisma.story.create({ data: { ...story, authorId } });
    }
  }
  console.log('Stories seeded:', stories.length);

  // ── Resources ──
  const resources = [
    {
      title: 'Understanding Mental Health',
      description: 'A downloadable guide to the basics of mental health and wellbeing.',
      category: 'Guide',
      resourceType: 'DOCUMENT',
      coverImage: '/images/projects/awareness.jpg',
      fileUrl: '/resources/understanding-mental-health.pdf',
      fileType: 'application/pdf',
      version: '1.0',
      status: 'PUBLISHED',
      publishedAt: new Date('2026-02-01'),
    },
    {
      title: 'Recognising Warning Signs',
      description: 'Learn to identify when you or someone you know needs help.',
      category: 'Guide',
      resourceType: 'DOCUMENT',
      coverImage: '/images/projects/support-referal-system.jpg',
      fileUrl: '/resources/recognising-warning-signs.pdf',
      fileType: 'application/pdf',
      version: '1.0',
      status: 'PUBLISHED',
      publishedAt: new Date('2026-02-01'),
    },
    {
      title: 'Supporting Someone You Love',
      description: 'How to be there for someone going through a mental health challenge.',
      category: 'Guide',
      resourceType: 'DOCUMENT',
      coverImage: '/images/projects/community-outreach.jpg',
      fileUrl: '/resources/supporting-someone-you-love.pdf',
      fileType: 'application/pdf',
      version: '1.0',
      status: 'PUBLISHED',
      publishedAt: new Date('2026-02-01'),
    },
    {
      title: 'Self-Care Strategies',
      description: 'Simple daily habits to improve your mental wellbeing.',
      category: 'Checklist',
      resourceType: 'DOCUMENT',
      coverImage: '/images/projects/educational-workshop.jpg',
      fileUrl: '/resources/self-care-strategies.pdf',
      fileType: 'application/pdf',
      version: '1.0',
      status: 'PUBLISHED',
      publishedAt: new Date('2026-02-01'),
    },
    {
      title: 'Workplace Mental Health',
      description: 'A practical guide to creating a mentally healthy environment at work.',
      category: 'Guide',
      resourceType: 'DOCUMENT',
      coverImage: '/images/banner/banner2.jpg',
      fileUrl: '/resources/workplace-mental-health.pdf',
      fileType: 'application/pdf',
      version: '1.0',
      status: 'PUBLISHED',
      publishedAt: new Date('2026-02-01'),
    },
    {
      title: 'Youth Mental Health',
      description: 'Supporting young people through mental health challenges.',
      category: 'Guide',
      resourceType: 'DOCUMENT',
      coverImage: '/images/projects/awareness.jpg',
      fileUrl: '/resources/youth-mental-health.pdf',
      fileType: 'application/pdf',
      version: '1.0',
      status: 'PUBLISHED',
      publishedAt: new Date('2026-02-01'),
    },
    {
      title: 'When to Seek Professional Help',
      description: 'An article on recognizing when everyday stress becomes something more serious.',
      category: 'Article',
      resourceType: 'ARTICLE',
      coverImage: '/images/projects/support-referal-system.jpg',
      body: 'Many people wait far too long before reaching out for professional support.\n\nPersistent low mood, changes in sleep or appetite, withdrawal from people you care about, and difficulty functioning at work or school are all signals that it may be time to talk to someone qualified.\n\nSeeking help is not a sign of weakness. Early support often leads to better outcomes, and you do not need to be in crisis to start a conversation with a counsellor or therapist.\n\nIf you are unsure where to begin, contact SHEDAM and we will help connect you with the right professional.',
      fileUrl: null,
      version: '1.0',
      status: 'PUBLISHED',
      publishedAt: new Date('2026-02-15'),
    },
  ];

  const existingResourceCount = await prisma.resource.count();
  if (existingResourceCount === 0) {
    for (const resource of resources) {
      await prisma.resource.create({ data: { ...resource, authorId } });
    }
  }
  console.log('Resources seeded:', resources.length);

  // ── Partners ──
  const partners = [
    { name: 'Nigerian Psychological Association', abbr: 'NPA', category: 'Professional Bodies', sortOrder: 0 },
    { name: 'Nigerian Medical Association', abbr: 'NMA', category: 'Professional Bodies', sortOrder: 1 },
    { name: 'Association of Psychiatrists in Nigeria', abbr: 'APN', category: 'Professional Bodies', sortOrder: 2 },
    { name: 'Federal Ministry of Health', abbr: 'FMoH', category: 'Government & Healthcare', sortOrder: 3 },
    { name: 'National Hospital Abuja', abbr: 'NHA', category: 'Government & Healthcare', sortOrder: 4 },
    { name: 'FCT Primary Health Care Board', abbr: 'FPHCB', category: 'Government & Healthcare', sortOrder: 5 },
    { name: 'University of Abuja', abbr: 'UniAbuja', category: 'Academic & Research', sortOrder: 6 },
    { name: 'Nigerian Defence Academy', abbr: 'NDA', category: 'Academic & Research', sortOrder: 7 },
    { name: 'Baze University', abbr: 'Baze', category: 'Academic & Research', sortOrder: 8 },
    { name: 'World Health Organization', abbr: 'WHO', category: 'International & Development', sortOrder: 9 },
    { name: 'UNICEF Nigeria', abbr: 'UNICEF', category: 'International & Development', sortOrder: 10 },
    { name: 'Mental Health Foundation', abbr: 'MHF', category: 'International & Development', sortOrder: 11 },
  ];

  const existingPartnerCount = await prisma.partner.count();
  if (existingPartnerCount === 0) {
    for (const partner of partners) {
      await prisma.partner.create({ data: { ...partner, status: 'PUBLISHED' } });
    }
  }
  console.log('Partners seeded:', partners.length);

  // ── Gallery albums + items ──
  const albums = [
    {
      slug: 'community-forum-kubwa-2025',
      title: 'Community Forum Kubwa 2025',
      description: 'Community members gathered for mental health awareness forum.',
      coverMediaId: mediaAssets['community'],
      status: 'PUBLISHED',
      publishedAt: new Date('2026-01-10'),
      items: [
        { mediaId: mediaAssets['community'], caption: 'Opening ceremony', altText: 'Opening ceremony' },
        { mediaId: mediaAssets['awareness'], caption: 'Awareness session', altText: 'Awareness session' },
        { mediaId: mediaAssets['banner1'], caption: 'Event venue', altText: 'Event venue' },
        { mediaId: mediaAssets['banner2'], caption: 'Group activities', altText: 'Group activities' },
      ],
    },
    {
      slug: 'school-outreach-programme',
      title: 'School Outreach Programme',
      description: 'Students during mental health education sessions.',
      coverMediaId: mediaAssets['workshop'],
      status: 'PUBLISHED',
      publishedAt: new Date('2026-02-10'),
      items: [
        { mediaId: mediaAssets['workshop'], caption: 'Student session', altText: 'Student session' },
        { mediaId: mediaAssets['community'], caption: 'Teacher training', altText: 'Teacher training' },
      ],
    },
    {
      slug: 'world-mental-health-day-2025',
      title: 'World Mental Health Day 2025',
      description: 'Awareness walk and community celebration.',
      coverMediaId: mediaAssets['banner2'],
      status: 'PUBLISHED',
      publishedAt: new Date('2026-03-10'),
      items: [
        { mediaId: mediaAssets['banner2'], caption: 'Awareness walk', altText: 'Awareness walk' },
        { mediaId: mediaAssets['awareness'], caption: 'Community celebration', altText: 'Community celebration' },
        { mediaId: mediaAssets['banner3'], caption: 'Our team', altText: 'Our team' },
      ],
    },
  ];

  for (const album of albums) {
    const existing = await prisma.galleryAlbum.findUnique({ where: { slug: album.slug } });
    await prisma.galleryAlbum.upsert({
      where: { slug: album.slug },
      update: { title: album.title, description: album.description, coverMediaId: album.coverMediaId, status: album.status, publishedAt: album.publishedAt },
      create: { ...album, authorId, items: { create: album.items.map((it, i) => ({ ...it, sortOrder: i })) } },
    });
    if (existing) {
      await prisma.galleryItem.deleteMany({ where: { albumId: existing.id } });
      const albumRecord = await prisma.galleryAlbum.findUnique({ where: { slug: album.slug } });
      if (albumRecord) {
        for (let i = 0; i < album.items.length; i++) {
          await prisma.galleryItem.create({ data: { albumId: albumRecord.id, mediaId: album.items[i].mediaId, caption: album.items[i].caption, altText: album.items[i].altText, sortOrder: i } });
        }
      }
    }
  }
  console.log('Gallery albums seeded:', albums.length);

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