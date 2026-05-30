export type UserRole = 'client' | 'professional' | 'admin';

export type VerificationStatus = 'pending' | 'verified' | 'rejected' | 'suspended' | 'banned';

export interface User {
  id: string;
  email: string;
  phone: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
  nin?: string;
  isVerified: boolean;
  verificationStatus: VerificationStatus;
  createdAt: Date;
  updatedAt: Date;
  categories?: string[];
  proServices?: any[];
  travelPreference?: string;
  workingDays?: string[];
  startHour?: string;
  endHour?: string;
  bio?: string;
}

export type ServiceMode = 'shop' | 'home_visit' | 'both';

export interface TimeSlot {
  start: string; // HH:mm
  end: string;   // HH:mm
}

export interface DayAvailability {
  day: string;
  isOpen: boolean;
  slots: TimeSlot[];
}

export interface Availability {
  [key: string]: DayAvailability;
}

export interface Professional {
  id: string;
  userId: string;
  bio: string;
  categories: string[];
  yearsExperience: number;
  serviceMode: ServiceMode;
  address?: string;
  latitude: number;
  longitude: number;
  avgRating: number;
  totalReviews: number;
  isAvailable: boolean;
  hasOffer?: boolean;
  accountNumber?: string;
  bankName?: string;
  availability?: Availability;
}

export type ServiceCategory = 'mens_hair' | 'womens_hair' | 'kids_hair' | 'grooming';

export interface Service {
  id: string;
  professionalId: string;
  category: ServiceCategory;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  isActive: boolean;
}

export type BookingStatus = 'requested' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'disputed';

export interface Booking {
  id: string;
  clientId: string;
  professionalId: string;
  serviceId: string;
  status: BookingStatus;
  mode: 'shop' | 'home_visit';
  scheduledAt: Date;
  address?: string; // for home visits
  clientLat?: number;
  clientLng?: number;
  totalAmount: number;
  tipAmount: number;
  notes?: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: Date;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  bookingId?: string;
  participants: string[];
  lastMessage?: Message;
  updatedAt: Date;
}

export interface Review {
  id: string;
  bookingId: string;
  clientId: string;
  professionalId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: Date;
}
