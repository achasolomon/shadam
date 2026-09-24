export interface SettingsSection {
  id: string;
  title: string;
  description?: string;
  /** If set, a key matches if it is in this list OR starts with any of these prefixes */
  keys?: string[];
  prefixes?: string[];
  /** If true, matches keys NOT claimed by earlier sections (catch-all) */
  catchAll?: boolean;
}

export const SETTINGS_SECTIONS: Record<string, SettingsSection[]> = {
  general: [
    {
      id: 'identity',
      title: 'Site Identity',
      description: 'Name, short name, tagline and meta description used across the site',
      keys: ['site_name', 'site_short_name', 'site_tagline', 'site_description', 'seo_title', 'seo_description'],
    },
    {
      id: 'hero',
      title: 'Homepage Hero',
      description: 'Headline, tagline and slider images on the landing page',
      keys: ['hero_headline', 'hero_tagline', 'hero_slides'],
    },
    {
      id: 'chrome',
      title: 'Header & Footer',
      description: 'CTA labels in the header, footer about text and newsletter blurb',
      prefixes: ['header_', 'footer_', 'newsletter_'],
      keys: ['newsletter_text', 'newsletter_title'],
    },
    {
      id: 'organization',
      title: 'Organization',
      description: 'Official organisation details',
      prefixes: ['org_'],
    },
    {
      id: 'misc',
      title: 'Miscellaneous',
      description: 'Other site-wide settings',
      keys: ['registration_interests', 'video_url'],
    },
    { id: 'other', title: 'Other', description: 'Settings not matched above', catchAll: true },
  ],
  home: [
    {
      id: 'partners-page',
      title: 'Partners Page',
      description: 'Hero copy for /partners',
      keys: ['partners_page_eyebrow', 'partners_page_title', 'partners_page_title_highlight', 'partners_page_description'],
    },
    {
      id: 'about-preview',
      title: 'About Preview',
      description: 'The "Who We Are" block on the homepage',
      keys: ['about_eyebrow', 'about_title', 'about_description', 'about_mission', 'about_vision'],
    },
    {
      id: 'services-section',
      title: 'Services Section',
      description: 'What We Do cards and CTA on the homepage',
      keys: [
        'services_eyebrow',
        'services_title',
        'services_title_highlight',
        'services_description',
        'services_explore_cta',
        'services_help_cta',
        'services_bg_image',
        'features_list',
      ],
    },
    {
      id: 'video',
      title: 'Video Block',
      description: 'Our Story video section',
      prefixes: ['video_'],
      keys: ['video_url'],
    },
    {
      id: 'impact',
      title: 'Impact / Stats',
      description: 'Numbers and impact counters',
      prefixes: ['impact_'],
    },
    {
      id: 'projects-section',
      title: 'Projects Section',
      description: 'Homepage projects preview',
      keys: ['projects_view_all_cta', 'projects_donate_cta'],
      prefixes: ['projects_stat_'],
    },
    {
      id: 'events-section',
      title: 'Events Section',
      description: 'Homepage events preview and banner',
      prefixes: ['events_section_', 'event_banner_', 'events_stat'],
      keys: ['events_view_all_cta'],
    },
    {
      id: 'spotlight',
      title: 'Spotlight',
      description: 'Voices of Change / stories carousel',
      prefixes: ['spotlight_'],
    },
    {
      id: 'partners',
      title: 'Partners',
      description: 'Trusted organisations strip',
      prefixes: ['partners_'],
    },
    {
      id: 'donate-banner',
      title: 'Donate Banner',
      description: 'Call-to-donate block',
      prefixes: ['donate_'],
    },
    {
      id: 'help-banner',
      title: 'Help Banner',
      description: 'Get Help callout on the homepage',
      prefixes: ['home_help_'],
      keys: ['home_help_title', 'home_help_description', 'home_help_cta', 'home_help_call_label', 'home_help_note_prefix', 'home_help_or_call'],
    },
    {
      id: 'home-insights',
      title: 'Insights Teaser',
      description: 'Latest articles block',
      prefixes: ['home_insights_'],
    },
    {
      id: 'home-gallery',
      title: 'Gallery Teaser',
      description: 'Photo gallery block',
      prefixes: ['home_gallery_'],
    },
    {
      id: 'home-misc',
      title: 'Other Homepage Blocks',
      description: 'Remaining homepage copy',
      prefixes: ['home_'],
      keys: ['newsletter_title'],
    },
    { id: 'other', title: 'Other', description: 'Settings not matched above', catchAll: true },
  ],
  wwd: [
    {
      id: 'wwd-hero',
      title: 'Page Hero',
      description: 'What We Do page hero',
      keys: ['wwd_hero_image', 'wwd_hero_eyebrow', 'wwd_hero_title', 'wwd_hero_title_highlight', 'wwd_hero_description'],
    },
    {
      id: 'wwd-services',
      title: 'Services Grid',
      description: 'Service cards and section heading',
      keys: [
        'wwd_section_eyebrow',
        'wwd_section_title',
        'wwd_section_description',
        'wwd_card_explore_label',
        'services_list',
        'services_bg_image',
      ],
    },
    {
      id: 'wwd-steps',
      title: 'How It Works',
      description: 'Steps process section',
      keys: ['wwd_steps_eyebrow', 'wwd_steps_title', 'wwd_steps_title_highlight', 'wwd_steps'],
    },
    {
      id: 'wwd-cta',
      title: 'Bottom CTA',
      description: 'Closing call-to-action',
      keys: ['wwd_cta_title', 'wwd_cta_description', 'wwd_cta_help_label', 'wwd_cta_contact_label'],
    },
    {
      id: 'wwd-seo',
      title: 'SEO',
      description: 'Meta title and description',
      keys: ['wwd_meta_title', 'wwd_meta_description'],
    },
    { id: 'other', title: 'Other', description: 'Settings not matched above', catchAll: true },
  ],
  services: [
    {
      id: 'sp-shared',
      title: 'Shared Labels',
      description: 'Labels used on every service detail page',
      prefixes: ['sp_'],
    },
    {
      id: 'sp-pages',
      title: 'Service Detail Pages',
      description: 'Full content for each service page',
      prefixes: ['service_page_'],
    },
    { id: 'other', title: 'Other', description: 'Settings not matched above', catchAll: true },
  ],
  about: [
    {
      id: 'about-hero',
      title: 'Page Hero',
      description: 'About page hero',
      prefixes: ['about_hero_'],
    },
    {
      id: 'about-who',
      title: 'Who We Are',
      description: 'Story paragraphs, mission and vision',
      keys: ['about_who_title', 'about_who_paragraphs', 'about_mission_more', 'about_vision_more', 'about_years_label', 'about_story_cta'],
      prefixes: ['about_mission', 'about_vision'],
    },
    {
      id: 'about-values',
      title: 'Values',
      description: 'Values grid',
      keys: ['about_values_label', 'about_values_title', 'about_values_description', 'about_values'],
    },
    {
      id: 'about-areas',
      title: 'Areas of Intervention',
      description: 'What we do list',
      keys: ['about_areas_eyebrow', 'about_areas_title', 'about_areas_description', 'about_areas'],
    },
    {
      id: 'about-journey',
      title: 'Milestones',
      description: 'Timeline of impact',
      keys: ['about_journey_eyebrow', 'about_journey_title', 'about_milestones'],
    },
    {
      id: 'about-founders',
      title: 'Founders & Team',
      description: 'Founder bios and team section copy (About + /team)',
      prefixes: ['founders_', 'about_team_', 'team_page_'],
    },
    {
      id: 'about-motto',
      title: 'Motto',
      description: 'Motto strip',
      prefixes: ['motto_'],
    },
    {
      id: 'about-cta',
      title: 'Bottom CTA',
      description: 'Join Our Mission block',
      keys: ['about_cta_title', 'about_cta_description'],
    },
    { id: 'other', title: 'Other', description: 'Settings not matched above', catchAll: true },
  ],
  help: [
    {
      id: 'help-hero',
      title: 'Page Hero',
      description: 'Get Help hero',
      prefixes: ['help_hero_'],
    },
    {
      id: 'help-helplines',
      title: 'Helplines',
      description: 'Crisis and support numbers',
      keys: ['help_helplines_title', 'help_helplines'],
    },
    {
      id: 'help-channels',
      title: 'Contact Channels',
      description: 'WhatsApp, email, phone options',
      keys: ['help_channels_title', 'help_channels'],
    },
    {
      id: 'help-warning',
      title: 'Warning Signs',
      description: 'Signs to watch for',
      keys: ['help_warning_title', 'help_warning_description', 'help_warning_signs'],
    },
    {
      id: 'help-crisis',
      title: 'Crisis Banner',
      description: 'Immediate danger copy',
      keys: ['help_crisis_title', 'help_crisis_description'],
    },
    {
      id: 'help-steps',
      title: 'How to Get Help',
      description: 'Self-care steps',
      keys: ['help_steps_eyebrow', 'help_steps_title', 'help_steps_description', 'help_self_care_steps'],
    },
    {
      id: 'help-cta',
      title: 'CTA & Resources',
      description: 'Closing CTA',
      keys: ['help_resources_title', 'help_cta_title', 'help_cta_description'],
    },
    { id: 'other', title: 'Other', description: 'Settings not matched above', catchAll: true },
  ],
  involve: [
    {
      id: 'involve-hero',
      title: 'Page Hero',
      description: 'Get Involved hero',
      prefixes: ['involve_hero_'],
    },
    {
      id: 'involve-ways',
      title: 'Ways to Get Involved',
      description: 'Volunteer / Partner / Donate cards',
      keys: ['involve_ways_title', 'involve_ways'],
    },
    {
      id: 'involve-how',
      title: 'Getting Started',
      description: 'Steps section',
      keys: ['involve_how_title', 'involve_how_description', 'involve_steps'],
    },
    {
      id: 'involve-contact',
      title: 'Contact & CTA',
      description: 'Reach out and closing CTA',
      keys: ['involve_contact_title', 'involve_cta_title', 'involve_cta_description'],
    },
    {
      id: 'involve-stats',
      title: 'Stats Labels',
      description: 'Impact counters on this page',
      prefixes: ['involve_stat_'],
    },
    { id: 'other', title: 'Other', description: 'Settings not matched above', catchAll: true },
  ],
  projects: [
    {
      id: 'projects-hero',
      title: 'Page Hero',
      description: 'Projects listing hero',
      prefixes: ['projects_hero_'],
    },
    {
      id: 'projects-filters',
      title: 'Categories & CTA',
      description: 'Filter chips and bottom CTA',
      keys: ['projects_categories', 'projects_cta_title', 'projects_cta_description'],
    },
    {
      id: 'projects-stats',
      title: 'Stats',
      description: 'Impact numbers on the projects page',
      prefixes: ['projects_stat_'],
    },
    { id: 'other', title: 'Other', description: 'Settings not matched above', catchAll: true },
  ],
  events: [
    {
      id: 'events-hero',
      title: 'Page Hero',
      description: 'Events listing hero',
      prefixes: ['events_hero_'],
    },
    {
      id: 'events-lists',
      title: 'Lists & Flyers',
      description: 'Upcoming / past / flyers headings',
      keys: [
        'events_upcoming_title',
        'events_past_title',
        'events_past_description',
        'events_flyers_title',
        'events_cta_title',
        'events_cta_description',
      ],
    },
    {
      id: 'events-stats',
      title: 'Stats Labels',
      description: 'Counter labels',
      prefixes: ['events_stat'],
    },
    { id: 'other', title: 'Other', description: 'Settings not matched above', catchAll: true },
  ],
  gallery: [
    {
      id: 'gallery-hero',
      title: 'Page Hero',
      description: 'Gallery listing hero',
      keys: ['gallery_hero_title', 'gallery_hero_description'],
    },
    {
      id: 'gallery-filters',
      title: 'Categories & CTA',
      description: 'Filter chips and bottom CTA',
      keys: ['gallery_categories', 'gallery_cta_title', 'gallery_cta_description'],
    },
    { id: 'other', title: 'Other', description: 'Settings not matched above', catchAll: true },
  ],
  insights: [
    {
      id: 'resources-page',
      title: 'Resources Page',
      description: 'Hero copy for /resources',
      keys: ['resources_page_eyebrow', 'resources_page_title', 'resources_page_title_highlight', 'resources_page_description'],
    },
    {
      id: 'insights-list',
      title: 'Listing',
      description: 'Tags and CTA',
      keys: ['insights_trending_tags', 'insights_cta_title', 'insights_cta_description'],
    },
    { id: 'other', title: 'Other', description: 'Settings not matched above', catchAll: true },
  ],
  contact: [
    {
      id: 'contact-hero',
      title: 'Page Hero',
      description: 'Contact page hero',
      prefixes: ['contact_hero_'],
    },
    {
      id: 'contact-details',
      title: 'Contact Details',
      description: 'Email, phone, address, WhatsApp',
      keys: ['contact_email', 'contact_phone', 'contact_phone_raw', 'contact_address', 'contact_whatsapp', 'contact_map_query'],
    },
    {
      id: 'contact-info',
      title: 'Info & CTA',
      description: 'Conversation and crisis CTAs',
      keys: [
        'contact_info_title',
        'contact_info_description',
        'contact_cta_title',
        'contact_cta_description',
        'contact_follow_title',
      ],
    },
    {
      id: 'contact-hours',
      title: 'Office Hours',
      description: 'Weekly schedule',
      keys: ['contact_office_hours'],
    },
    {
      id: 'contact-faqs',
      title: 'FAQs',
      description: 'Frequently asked questions',
      keys: ['contact_faqs'],
    },
    { id: 'other', title: 'Other', description: 'Settings not matched above', catchAll: true },
  ],
  support: [
    {
      id: 'support-channels',
      title: 'Channels',
      description: 'WhatsApp, phone, email for the floating widget',
      keys: ['support_whatsapp', 'support_phone', 'support_email'],
    },
    {
      id: 'support-copy',
      title: 'Widget Copy',
      description: 'Heading, description, buttons and crisis text',
      prefixes: ['support_'],
    },
    { id: 'other', title: 'Other', description: 'Settings not matched above', catchAll: true },
  ],
  social: [
    {
      id: 'social-links',
      title: 'Profiles',
      description: 'Social media profile URLs',
      prefixes: ['social_'],
    },
    { id: 'other', title: 'Other', description: 'Settings not matched above', catchAll: true },
  ],
  stats: [
    {
      id: 'stats-counters',
      title: 'Counters',
      description: 'Site-wide impact numbers',
      prefixes: ['stat_'],
    },
    { id: 'other', title: 'Other', description: 'Settings not matched above', catchAll: true },
  ],
  donation: [
    {
      id: 'donation-bank',
      title: 'Bank Details',
      description: 'Account shown on the donate page',
      prefixes: ['donation_'],
    },
    { id: 'other', title: 'Other', description: 'Settings not matched above', catchAll: true },
  ],
};

function keyMatches(section: SettingsSection, key: string): boolean {
  if (section.keys && section.keys.includes(key)) return true;
  if (section.prefixes) {
    for (const p of section.prefixes) {
      if (key.startsWith(p)) return true;
    }
  }
  return false;
}

export function groupSettingsBySection(
  groupSlug: string,
  settings: { key: string }[]
): { section: SettingsSection; keys: string[] }[] {
  const sections = SETTINGS_SECTIONS[groupSlug];
  if (!sections || sections.length === 0) {
    return [
      {
        section: { id: 'all', title: 'All Settings', description: undefined },
        keys: settings.map((s) => s.key),
      },
    ];
  }

  const assigned = new Set<string>();
  const result: { section: SettingsSection; keys: string[] }[] = [];

  for (const section of sections) {
    if (section.catchAll) continue;
    const keys = settings.map((s) => s.key).filter((k) => !assigned.has(k) && keyMatches(section, k));
    keys.forEach((k) => assigned.add(k));
    if (keys.length > 0) result.push({ section, keys });
  }

  const catchAllSection = sections.find((s) => s.catchAll);
  const remaining = settings.map((s) => s.key).filter((k) => !assigned.has(k));
  if (remaining.length > 0 && catchAllSection) {
    result.push({ section: catchAllSection, keys: remaining });
  }

  return result;
}
