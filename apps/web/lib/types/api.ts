// ── API Response Envelope ──
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: string[];
  };
}

// ── Media ──
export interface MediaAsset {
  id: string;
  url: string;
  originalUrl?: string;
  type: 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'AUDIO';
  mimeType?: string;
  fileName: string;
  fileSize?: number;
  width?: number;
  height?: number;
  altText?: string;
  caption?: string;
  photographer?: string;
  source?: string;
  folder?: string;
}

// ── User (author reference) ──
export interface AuthorRef {
  id: string;
  name: string;
  avatarUrl?: string;
}

// ── Project ──
export interface Project {
  id: string;
  slug: string;
  title: string;
  summary?: string;
  body: any;
  category?: string;
  coverMedia?: MediaAsset;
  status: ContentStatus;
  startDate?: string;
  endDate?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  author: AuthorRef;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ── Event ──
export interface Event {
  id: string;
  slug: string;
  title: string;
  description?: string;
  body?: any;
  startAt: string;
  endAt?: string;
  timezone: string;
  venue?: string;
  venueAddress?: string;
  coverMedia?: MediaAsset;
  registrationUrl?: string;
  isFeatured: boolean;
  status: ContentStatus;
  author: AuthorRef;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ── Article ──
export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  body: any;
  coverMedia?: MediaAsset;
  category?: string;
  author: AuthorRef;
  status: ContentStatus;
  seoTitle?: string;
  seoDescription?: string;
  publishedAt?: string;
  scheduledAt?: string;
  createdAt: string;
  updatedAt: string;
  tags?: ArticleTag[];
}

export interface ArticleTag {
  id: string;
  tag: string;
}

// ── Gallery ──
export interface GalleryAlbum {
  id: string;
  slug: string;
  title: string;
  description?: string;
  coverMedia?: MediaAsset;
  status: ContentStatus;
  author: AuthorRef;
  publishedAt?: string;
  createdAt: string;
  items?: GalleryItem[];
}

export interface GalleryItem {
  id: string;
  media: MediaAsset;
  caption?: string;
  altText?: string;
  sortOrder: number;
}

// ── Team ──
export type TeamMemberItemKind =
  | 'SEMINAR'
  | 'CONTRIBUTION'
  | 'TALK'
  | 'PUBLICATION'
  | 'AWARD'
  | 'MEDIA';

export interface TeamMemberItem {
  id: string;
  memberId: string;
  kind: TeamMemberItemKind | string;
  title: string;
  description?: string | null;
  date?: string | null;
  venue?: string | null;
  url?: string | null;
  sortOrder: number;
  createdAt?: string;
}

export interface TeamMember {
  id: string;
  slug?: string | null;
  name: string;
  role: string;
  headline?: string | null;
  bio?: string | null;
  photoUrl?: string | null;
  email?: string | null;
  phone?: string | null;
  socialLinks?: Record<string, string> | null;
  qualifications?: string[] | null;
  sortOrder: number;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  items?: TeamMemberItem[];
}

// ── Resource ──
export interface Resource {
  id: string;
  title: string;
  description?: string;
  category?: string;
  resourceType: 'DOCUMENT' | 'ARTICLE';
  coverImage?: string;
  body?: string;
  fileUrl?: string;
  fileSize?: number;
  fileType?: string;
  version?: string;
  downloadCount: number;
  status: ContentStatus;
  author: AuthorRef;
  publishedAt?: string;
  createdAt: string;
}

// ── Enquiry ──
export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  type: 'GENERAL' | 'SUPPORT' | 'PARTNERSHIP' | 'VOLUNTEER' | 'MEDIA' | 'OTHER';
  subject?: string;
  message: string;
  status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED' | 'ESCALATED' | 'CLOSED';
  createdAt: string;
}

// ── Settings ──
export interface SiteSetting {
  id: string;
  key: string;
  value?: string;
  type: 'TEXT' | 'TEXTAREA' | 'IMAGE' | 'JSON' | 'BOOLEAN' | 'NUMBER';
  groupName?: string;
}

// ── Homepage Section ──
export interface HomepageSection {
  id: string;
  sectionType: string;
  title?: string;
  config: any;
  sortOrder: number;
  isVisible: boolean;
}

// ── Navigation ──
export interface NavigationItem {
  id: string;
  label: string;
  url?: string;
  pageId?: string;
  parentId?: string;
  children?: NavigationItem[];
  sortOrder: number;
  location: 'HEADER' | 'FOOTER' | 'BOTH';
  isExternal: boolean;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

// ── Content Status ──
export type ContentStatus =
  | 'DRAFT'
  | 'IN_REVIEW'
  | 'APPROVED'
  | 'SCHEDULED'
  | 'PUBLISHED'
  | 'ARCHIVED'
  | 'REJECTED';
