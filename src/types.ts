/**
 * TypeScript interfaces and types for the Gym Website & Admin Dashboard
 */

export interface Profile {
  id: string;
  email: string;
  role: 'admin' | 'member';
  created_at?: string;
}

export interface Member {
  id: string;
  full_name: string;
  phone: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  address: string;
  fitness_goal: string;
  package_id: string; // References Package
  membership_start: string; // ISO date YYYY-MM-DD
  membership_end: string; // ISO date YYYY-MM-DD
  payment_status: 'paid' | 'pending' | 'failed' | 'refunded';
  member_status: 'active' | 'expired' | 'pending' | 'blocked';
  emergency_contact: string;
  medical_note?: string;
  created_at: string;
}

export interface Lead {
  id: string;
  full_name: string;
  phone: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  address: string;
  fitness_goal: string;
  interested_package: string; // Name of package or package_id
  preferred_time: string; // e.g. "Morning Batch"
  medical_note?: string;
  emergency_contact: string;
  status: 'new' | 'contacted' | 'converted' | 'rejected';
  admin_note?: string;
  created_at: string;
}

export interface GymPackage {
  id: string;
  name: string;
  price: number; // in BDT
  duration_days: number;
  description: string;
  features: string[]; // parsed from text array
  is_popular: boolean;
  is_active: boolean;
  created_at: string;
  color_theme?: string;
  order_priority?: number;
}

export interface Trainer {
  id: string;
  name: string;
  photo_url: string;
  cloudinary_public_id?: string;
  specialty: string; // Bodybuilding, Weight Loss, Strength, Cardio, Ladies Fitness, Personal Training, Nutrition
  experience: string; // e.g., "5 Years" or numbers
  bio: string;
  available_time: string; // e.g. "6:00 AM - 10:00 AM, 4:00 PM - 9:00 PM"
  phone: string;
  is_active: boolean;
  created_at: string;
  specialties?: string[];
  certifications?: string[];
  shifts?: string;
  contact?: string;
  image_url?: string;
}

export interface GymClass {
  id: string;
  class_name: string;
  trainer_id: string; // References Trainer
  day_of_week: 'Saturday' | 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  start_time: string; // e.g. "07:00 AM"
  end_time: string; // e.g. "08:00 AM"
  batch_type: 'Morning Batch' | 'Evening Batch' | 'Ladies Batch' | 'Student Batch' | 'Personal Training Batch';
  capacity: number;
  is_active: boolean;
  created_at: string;
}

export interface Payment {
  id: string;
  member_id: string; // References Member
  amount: number;
  payment_method: 'Cash' | 'bKash' | 'Nagad' | 'Rocket' | 'Bank Transfer';
  transaction_id?: string;
  payment_status: 'paid' | 'pending' | 'failed' | 'refunded';
  payment_date: string; // YYYY-MM-DD
  note?: string;
  created_at: string;
}

export interface GalleryImage {
  id: string;
  title: string;
  category: 'Equipment' | 'Interior' | 'Training' | 'Members' | 'Transformation' | 'Events';
  image_url: string;
  cloudinary_public_id?: string;
  is_active: boolean;
  created_at: string;
  order_priority?: number;
}

export interface Testimonial {
  id: string;
  member_name: string;
  photo_url?: string;
  before_image_url?: string;
  after_image_url?: string;
  story: string;
  result_summary: string; // e.g. "Lost 15kg in 3 months" or "Gained 6kg muscle"
  rating: number; // 1-5
  is_active: boolean;
  created_at: string;
  name?: string;
  before_image_public_id?: string;
  after_image_public_id?: string;
  story_text?: string;
  weight_metric?: string;
  months_count?: number;
}

export interface GymSettings {
  id: string;
  gym_name: string;
  logo: string;
  phone: string;
  whatsapp_number: string;
  email: string;
  address: string;
  opening_hours: string;
  facebook_link?: string;
  instagram_link?: string;
  google_map_url?: string;
  hero_title: string;
  hero_subtitle: string;
  main_cta_text: string;
  hero_image_url?: string;
}
