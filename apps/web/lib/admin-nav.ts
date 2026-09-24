import {
  LayoutDashboard,
  FileText,
  Calendar,
  Image,
  Newspaper,
  MessageSquare,
  Settings,
  Users,
  Layout,
  Quote,
  Folder,
  Palette,
  Heart,
  BookOpen,
  HeartHandshake,
  FolderKanban,
  Camera,
  Lightbulb,
  Phone,
  LifeBuoy,
  Globe,
  BarChart3,
  Briefcase,
  Home,
  Megaphone,
  Info,
  Mail,
  UserCircle,
} from 'lucide-react';
import { ROLE_NAMES } from '@/lib/access';

const SA = ROLE_NAMES.SUPER_ADMIN;
const CM = ROLE_NAMES.CONTENT_MANAGER;
const MM = ROLE_NAMES.MEDIA_MANAGER;
const ED = ROLE_NAMES.EDITOR;
const EM = ROLE_NAMES.EVENTS_MANAGER;
const SO = ROLE_NAMES.SUPPORT_OFFICER;
const RO = ROLE_NAMES.READ_ONLY;

const contentRoles = [SA, CM, ED, RO];
const eventsRoles = [SA, CM, EM, ED, RO];
const mediaRoles = [SA, CM, MM, RO];
const supportRoles = [SA, SO, RO];
const newsletterRoles = [SA, CM, SO, RO];

export interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles?: string[];
  permissions?: string[];
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

export const adminNav: NavSection[] = [
  {
    items: [{ label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard }],
  },
  {
    title: 'Content',
    items: [
      { label: 'Projects', href: '/admin/dashboard/projects', icon: FileText, roles: contentRoles, permissions: ['projects', 'read'] },
      { label: 'Events', href: '/admin/dashboard/events', icon: Calendar, roles: eventsRoles, permissions: ['events', 'read'] },
      { label: 'Articles', href: '/admin/dashboard/articles', icon: Newspaper, roles: contentRoles, permissions: ['articles', 'read'] },
      { label: 'Stories', href: '/admin/dashboard/stories', icon: Quote, roles: contentRoles, permissions: ['stories', 'read'] },
      { label: 'Resources', href: '/admin/dashboard/resources', icon: BookOpen, roles: contentRoles, permissions: ['resources', 'read'] },
      { label: 'Partners', href: '/admin/dashboard/partners', icon: HeartHandshake, roles: contentRoles, permissions: ['partners', 'read'] },
      { label: 'Gallery', href: '/admin/dashboard/gallery', icon: Camera, roles: mediaRoles, permissions: ['gallery', 'read'] },
      { label: 'Media Library', href: '/admin/dashboard/media', icon: Image, roles: mediaRoles, permissions: ['media', 'read'] },
    ],
  },
  {
    title: 'People',
    items: [
      { label: 'Team', href: '/admin/dashboard/team', icon: Users, roles: contentRoles, permissions: ['pages', 'read'] },
      { label: 'Users', href: '/admin/dashboard/users', icon: UserCircle, roles: [SA] },
      { label: 'Enquiries', href: '/admin/dashboard/enquiries', icon: MessageSquare, roles: supportRoles, permissions: ['enquiries', 'read'] },
      { label: 'Newsletter', href: '/admin/dashboard/newsletter', icon: Mail, roles: newsletterRoles, permissions: ['read'] },
    ],
  },
  {
    title: 'Site',
    items: [
      { label: 'Homepage Layout', href: '/admin/dashboard/homepage', icon: Layout, roles: contentRoles, permissions: ['pages', 'read'] },
    ],
  },
  {
    title: 'Settings',
    items: [
      { label: 'All Settings', href: '/admin/settings', icon: Settings, roles: [SA] },
      { label: 'My Profile', href: '/admin/profile', icon: UserCircle },
    ],
  },
];

export function filterNavForUser<T extends NavItem>(items: T[], user: { role?: { name?: string; permissions?: Record<string, unknown> } } | null): T[] {
  if (!user) return [];
  if (user.role?.name === SA || user.role?.permissions?.['*'] === '*') return items;
  return items.filter((item) => {
    if (!item.roles?.length && !item.permissions?.length) return true;
    if (item.roles?.includes(user.role?.name || '')) return true;
    if (item.permissions?.length) {
      const perms = user.role?.permissions || {};
      if (item.permissions.some((p) => perms[p] !== undefined || perms['*'] === '*')) return true;
    }
    return false;
  });
}

export interface SettingsGroupMeta {
  slug: string;
  title: string;
  icon: React.ElementType;
  description: string;
}

export const settingsGroups: SettingsGroupMeta[] = [
  { slug: 'general', title: 'Site Identity', icon: Settings, description: 'Name, logo, org details, hero, header & footer chrome' },
  { slug: 'home', title: 'Homepage', icon: Home, description: 'Every section that appears on the homepage' },
  { slug: 'wwd', title: 'What We Do', icon: Megaphone, description: 'Services listing page and service cards' },
  { slug: 'services', title: 'Service Pages', icon: Briefcase, description: 'Individual service detail pages (awareness, education…)' },
  { slug: 'about', title: 'About Page', icon: Info, description: 'Story, values, milestones and founders' },
  { slug: 'help', title: 'Get Help', icon: Heart, description: 'Helplines, warning signs and crisis copy' },
  { slug: 'involve', title: 'Get Involved', icon: HeartHandshake, description: 'Volunteer, partner and donate pathways' },
  { slug: 'projects', title: 'Projects Page', icon: FolderKanban, description: 'Projects listing hero, categories and stats' },
  { slug: 'events', title: 'Events Page', icon: Calendar, description: 'Events listing hero, sections and stats' },
  { slug: 'gallery', title: 'Gallery Page', icon: Camera, description: 'Gallery listing hero and categories' },
  { slug: 'insights', title: 'Insights Page', icon: Lightbulb, description: 'Blog listing tags and CTA' },
  { slug: 'contact', title: 'Contact', icon: Phone, description: 'Contact details, map, FAQs and office hours' },
  { slug: 'support', title: 'Support Widget', icon: LifeBuoy, description: 'Floating support chat labels' },
  { slug: 'social', title: 'Social Links', icon: Globe, description: 'Facebook, Twitter, Instagram, LinkedIn, YouTube' },
  { slug: 'stats', title: 'Statistics', icon: BarChart3, description: 'Impact counters shown site-wide' },
  { slug: 'donation', title: 'Donation Details', icon: HeartHandshake, description: 'Bank account for donations' },
];

export function settingsGroupBySlug(slug: string): SettingsGroupMeta | undefined {
  return settingsGroups.find((g) => g.slug === slug);
}
