import { createClient } from '@supabase/supabase-js';
import { 
  Profile, Member, Lead, GymPackage, Trainer, GymClass, Payment, GalleryImage, Testimonial, GymSettings 
} from '../types';

// Detect Supabase config
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'MY_SUPABASE_URL');

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// Initial preloaded data for LocalStorage fallback (so the app works out of the box with stunning contents)
const INITIAL_SETTINGS: GymSettings = {
  id: 'settings_main',
  gym_name: 'Iron Elite Fitness Center',
  logo: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=80',
  phone: '+8801712345678',
  whatsapp_number: '8801712345678',
  email: 'info@ironelitebd.com',
  address: 'Level 4, Sel Rose N Dale, 126 Road 2, Dhanmondi, Dhaka 1209, Bangladesh',
  opening_hours: 'Saturday - Thursday: 6:00 AM - 10:00 PM | Friday: 4:00 PM - 9:00 PM',
  facebook_link: 'https://facebook.com/ironelitebd',
  instagram_link: 'https://instagram.com/ironelitebd',
  google_map_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.170154031649!2d90.3794354!3d23.7413009!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b33c000001%3A0x89816ecb030b4279!2sDhanmondi%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1684345371239!5m2!1sen!2sbd',
  hero_title: 'Transform Your Body, Build Your Discipline',
  hero_subtitle: 'Premium gym training in Dhanmondi. Certified trainers, state-of-the-art powerlifting racks, extensive cardio zone, and custom ladies batch schedules.',
  main_cta_text: 'Start Your Journey Today',
  hero_image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=80'
};

const INITIAL_PACKAGES: GymPackage[] = [
  {
    id: 'pkg_monthly',
    name: 'Monthly Plan',
    price: 2500,
    duration_days: 30,
    description: 'Perfect for beginners starting their journey or individuals with short term stays.',
    features: [
      'Access to Gym Floor & Cardio Zone',
      'Free Locker & Changing Rooms',
      'Free Fitness Assessment',
      'General Trainer Guidance',
      'Valid for 1 Month'
    ],
    is_popular: false,
    is_active: true,
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'pkg_3months',
    name: '3 Months Plan',
    price: 6500,
    duration_days: 90,
    description: 'Our standard plan, highly recommended to build consistency and core strength.',
    features: [
      'All Monthly Plan privileges',
      '1 Personalized Workout Chart',
      '1 Custom Nutrition & Diet consultation',
      'Access to Ladies/Evening Batches',
      'Save 1,000 BDT compared to monthly plans'
    ],
    is_popular: true,
    is_active: true,
    created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'pkg_6months',
    name: '6 Months Plan',
    price: 11000,
    duration_days: 180,
    description: 'Commit to your lifestyle change. Premium plan for intermediate and expert gym-goers.',
    features: [
      'All 3 Months Plan benefits',
      'Unlimited Body Composition Analysis',
      '2 Custom Diet Charts per review cycles',
      'Priority access to steam bath (when available)',
      '1 Free Guest Pass per month'
    ],
    is_popular: false,
    is_active: true,
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'pkg_yearly',
    name: 'Yearly Plan',
    price: 18000,
    duration_days: 365,
    description: 'Ultimate fitness commitment. Save big and establish permanent physical discipline.',
    features: [
      'Full 1 Year Access with Freeze options (up to 30 days)',
      'Free Gym Merchandise (T-shirt & shaker bottle)',
      'Monthly Diet Chart & Workout review sessions',
      'Unlimited Cardio and Bodybuilding floors',
      'Best value option: Only 1,500 BDT per month'
    ],
    is_popular: false,
    is_active: true,
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'pkg_student',
    name: 'Student Package',
    price: 1800,
    duration_days: 30,
    description: 'Discounted plan for students seeking strength and stamina without budget fatigue.',
    features: [
      'Access from 9:00 AM - 4:00 PM daily',
      'Free Wifi and standard charging stations',
      'Valid Student ID required upon admission',
      'General cardio and weight guide'
    ],
    is_popular: false,
    is_active: true,
    created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'pkg_ladies',
    name: 'Ladies Batch Plan',
    price: 2200,
    duration_days: 30,
    description: 'Exclusive time slots designed securely for women, guided by female gym instructresses.',
    features: [
      'Women-only slots (11:00 AM - 4:00 PM)',
      'Certified Female Trainers on floor',
      'Special focus on aerobic, weight loss and posture',
      'Safe and hyper-hygienic environment'
    ],
    is_popular: false,
    is_active: true,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'pkg_personal',
    name: 'Personal Training Plan',
    price: 10000,
    duration_days: 30,
    description: 'A 1-on-1 premium coaching module to expedite muscle hypertrophies or weight plans.',
    features: [
      '1 Dedicated Elite Trainer (12 sessions/month)',
      'Personal tracking of every microcycle',
      'Rigorous daily diet tracking via WhatsApp',
      'Advanced supplement guidance'
    ],
    is_popular: false,
    is_active: true,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const INITIAL_TRAINERS: Trainer[] = [
  {
    id: 'trn_1',
    name: 'Kazi Mahbubur Rahman',
    photo_url: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=500&auto=format&fit=crop&q=80',
    specialty: 'Bodybuilding & Strength Training',
    experience: '8 Years',
    bio: 'Former national bodybuilding contender. Expert in squats mechanics, strength routines, and high-intensity interval conditioning.',
    available_time: '06:00 AM - 11:00 AM, 05:00 PM - 09:00 PM',
    phone: '+8801722223333',
    is_active: true,
    created_at: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'trn_2',
    name: 'Sabrina Akhter (Sumi)',
    photo_url: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=500&auto=format&fit=crop&q=80',
    specialty: 'Weight Loss & Ladies Fitness',
    experience: '5 Years',
    bio: 'Certified metabolic weight loss specialist. Expert in prenatal fitness, core strengthening, nutrition planning, and high-tempo cardio.',
    available_time: '11:00 AM - 04:00 PM',
    phone: '+8801733334444',
    is_active: true,
    created_at: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'trn_3',
    name: 'Tanvir Hossain',
    photo_url: 'https://images.unsplash.com/photo-1605296867304-46d5465a25f1?w=500&auto=format&fit=crop&q=80',
    specialty: 'Personal Training & Nutrition',
    experience: '6 Years',
    bio: 'Graduated in Sports Nutrition. Passionate about helping busy corporate clients lose fat and gain mental focus with customized home-friendly diet charts.',
    available_time: '04:00 PM - 10:00 PM',
    phone: '+8801744445555',
    is_active: true,
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const INITIAL_CLASSES: GymClass[] = [
  {
    id: 'cls_1',
    class_name: 'Morning Strength Focus',
    trainer_id: 'trn_1',
    day_of_week: 'Saturday',
    start_time: '07:00 AM',
    end_time: '08:00 AM',
    batch_type: 'Morning Batch',
    capacity: 20,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'cls_2',
    class_name: 'Ladies High Intensity Cardio',
    trainer_id: 'trn_2',
    day_of_week: 'Sunday',
    start_time: '11:30 AM',
    end_time: '12:30 PM',
    batch_type: 'Ladies Batch',
    capacity: 15,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'cls_3',
    class_name: 'Ladies Fat Burn Circuit',
    trainer_id: 'trn_2',
    day_of_week: 'Tuesday',
    start_time: '02:00 PM',
    end_time: '03:00 PM',
    batch_type: 'Ladies Batch',
    capacity: 15,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'cls_4',
    class_name: 'Evening Powerlifting Clinic',
    trainer_id: 'trn_1',
    day_of_week: 'Wednesday',
    start_time: '07:30 PM',
    end_time: '08:30 PM',
    batch_type: 'Evening Batch',
    capacity: 25,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'cls_5',
    class_name: 'Student Weight Training 101',
    trainer_id: 'trn_3',
    day_of_week: 'Monday',
    start_time: '10:00 AM',
    end_time: '11:00 AM',
    batch_type: 'Student Batch',
    capacity: 20,
    is_active: true,
    created_at: new Date().toISOString()
  }
];

const INITIAL_MEMBERS: Member[] = [
  {
    id: 'mem_1',
    full_name: 'Rahat Chowdhury',
    phone: '01815123456',
    age: 28,
    gender: 'Male',
    address: 'Block E, Lalmatia, Dhaka',
    fitness_goal: 'Gain 8kg muscle and increase powerlifting totals',
    package_id: 'pkg_3months',
    membership_start: '2026-05-01',
    membership_end: '2026-07-30',
    payment_status: 'paid',
    member_status: 'active',
    emergency_contact: 'Wife: 01815999888',
    medical_note: 'Mild knee discomfort with heavy squatting',
    created_at: '2026-05-01T10:00:00Z'
  },
  {
    id: 'mem_2',
    full_name: 'Farhana Yeasmin',
    phone: '01711223344',
    age: 32,
    gender: 'Female',
    address: 'Road 8A, Dhanmondi, Dhaka',
    fitness_goal: 'Post-pregnancy core recovery and fat loss',
    package_id: 'pkg_ladies',
    membership_start: '2026-05-15',
    membership_end: '2026-06-14',
    payment_status: 'paid',
    member_status: 'active',
    emergency_contact: 'Husband: 01711225588',
    medical_note: 'No medical restrictions',
    created_at: '2026-05-15T11:30:00Z'
  },
  {
    id: 'mem_3',
    full_name: 'Asif Ur Rahman',
    phone: '01911998877',
    age: 21,
    gender: 'Male',
    address: 'Azimpur Govt Colony, Dhaka',
    fitness_goal: 'Fat loss and getting visible abs',
    package_id: 'pkg_student',
    membership_start: '2026-04-20',
    membership_end: '2026-05-19',
    payment_status: 'pending',
    member_status: 'expired',
    emergency_contact: 'Father: 01911998800',
    created_at: '2026-04-20T14:22:00Z'
  }
];

const INITIAL_LEADS: Lead[] = [
  {
    id: 'led_1',
    full_name: 'Ziaul Hasan',
    phone: '01511223399',
    age: 26,
    gender: 'Male',
    address: 'Rampura, Dhaka',
    fitness_goal: 'Strengthen back muscles due to corporate desk strain',
    interested_package: 'pkg_3months',
    preferred_time: 'Evening Batch',
    emergency_contact: 'Brother: 01511332211',
    status: 'new',
    created_at: '2026-05-29T08:12:00Z'
  },
  {
    id: 'led_2',
    full_name: 'Nusrat Jahan',
    phone: '01611883311',
    age: 24,
    gender: 'Female',
    address: 'Mirpur 10, Dhaka',
    fitness_goal: 'Weight reduction and cardiovascular conditioning',
    interested_package: 'pkg_ladies',
    preferred_time: 'Ladies Batch',
    emergency_contact: 'Mother: 01611885544',
    status: 'contacted',
    admin_note: 'Called Nusrat on May 29. She will visit the Dhanmondi facility this Saturday during ladies hour.',
    created_at: '2026-05-28T16:45:00Z'
  },
  {
    id: 'led_3',
    full_name: 'Ahsan Kabir',
    phone: '01712009988',
    age: 29,
    gender: 'Male',
    address: 'Banani, Dhaka',
    fitness_goal: 'Strength coaching and custom bodybuilding prep',
    interested_package: 'pkg_personal',
    preferred_time: 'Personal Training Batch',
    emergency_contact: 'Wife: 01712004455',
    status: 'converted',
    admin_note: 'Enrolled under Coach Mahbub. Payment completed via bKash.',
    created_at: '2026-05-25T12:10:00Z'
  }
];

const INITIAL_PAYMENTS: Payment[] = [
  {
    id: 'pay_1',
    member_id: 'mem_1',
    amount: 6500,
    payment_method: 'bKash',
    transaction_id: 'BKX2026050188',
    payment_status: 'paid',
    payment_date: '2026-05-01',
    note: 'Admission and 3 months package combined payment',
    created_at: '2026-05-01T10:15:00Z'
  },
  {
    id: 'pay_2',
    member_id: 'mem_2',
    amount: 2200,
    payment_method: 'Nagad',
    transaction_id: 'NGA9023880',
    payment_status: 'paid',
    payment_date: '2026-05-15',
    note: 'First ladies batch entry fee',
    created_at: '2026-05-15T11:40:00Z'
  }
];

const INITIAL_GALLERY: GalleryImage[] = [
  {
    id: 'gal_1',
    title: 'Elite Power Racks and Deadlift Platforms',
    category: 'Equipment',
    image_url: 'https://images.unsplash.com/photo-1540206276207-3af25c08abb4?w=800&auto=format&fit=crop&q=80',
    is_active: true,
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'gal_2',
    title: 'High Performance Cardio Zone looking out over Dhanmondi',
    category: 'Interior',
    image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
    is_active: true,
    created_at: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'gal_3',
    title: 'Advanced dumbells lineup up to 50kg',
    category: 'Equipment',
    image_url: 'https://images.unsplash.com/photo-1637666062717-1c6bcab4a4ed?w=800&auto=format&fit=crop&q=80',
    is_active: true,
    created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'gal_4',
    title: 'Our ladies batch strength coaching session',
    category: 'Training',
    image_url: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=800&auto=format&fit=crop&q=80',
    is_active: true,
    created_at: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'gal_5',
    title: 'Weekly core stability and posture workshop',
    category: 'Members',
    image_url: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&auto=format&fit=crop&q=80',
    is_active: true,
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'gal_6',
    title: 'Clean modern locker cabinet facilities',
    category: 'Interior',
    image_url: 'https://images.unsplash.com/photo-1549576490-b0b4831ef60a?w=800&auto=format&fit=crop&q=80',
    is_active: true,
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'tst_1',
    member_name: 'Shakil Mahamud (Corporate Employee)',
    before_image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&auto=format&fit=crop&q=30', // simplified before mockup placeholder
    after_image_url: 'https://images.unsplash.com/photo-1507398941214-572c25f4b1cd?w=400&auto=format&fit=crop&q=80',
    story: 'Sitting in office desks for 10 hours a day index-shifted my posture and gave me excruciating L4-L5 back strains. Coach Mahbub rebuilt my posture block-by-block. Replaced structural weaknesses with core strength. My back issues are completely eradicated and I lost 12kg of deep visceral fat!',
    result_summary: 'Lost 12kg, eliminated severe chronic back strains',
    rating: 5,
    is_active: true,
    created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'tst_2',
    member_name: 'Anika Bushra (Student)',
    before_image_url: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=200&auto=format&fit=crop&q=30', // simplified before mockup placeholder
    after_image_url: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=400&auto=format&fit=crop&q=80',
    story: 'Highly skeptical about joining standard gyms because of crowd and stares. Joining the Iron Elite Ladies batch under Sabrina Sumi changed my entire paradigm. Over 6 months, she taught me strength barbell lifting. I shed 18 kilograms, gained explosive energy, and passed my university physical stamina assessments as lead.',
    result_summary: 'Shed 18kg in ladies batch weight loss journey',
    rating: 5,
    is_active: true,
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// In-Memory Fallback DB Engine with LocalStorage Sync (Transparent Wrapper)
export class DBEngine {
  private static get<T>(key: string, initial: T): T {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(initial));
      return initial;
    }
    try {
      return JSON.parse(raw) as T;
    } catch {
      return initial;
    }
  }

  private static set<T>(key: string, val: T): void {
    localStorage.setItem(key, JSON.stringify(val));
  }

  // settings
  static getSettings(): GymSettings {
    return this.get('db_settings', INITIAL_SETTINGS);
  }
  static saveSettings(settings: GymSettings): void {
    this.set('db_settings', settings);
  }

  // packages
  static getPackages(): GymPackage[] {
    return this.get('db_packages', INITIAL_PACKAGES);
  }
  static savePackages(pkgs: GymPackage[]): void {
    this.set('db_packages', pkgs);
  }

  // trainers
  static getTrainers(): Trainer[] {
    return this.get('db_trainers', INITIAL_TRAINERS);
  }
  static saveTrainers(trainers: Trainer[]): void {
    this.set('db_trainers', trainers);
  }

  // classes
  static getClasses(): GymClass[] {
    return this.get('db_classes', INITIAL_CLASSES);
  }
  static saveClasses(cls: GymClass[]): void {
    this.set('db_classes', cls);
  }

  // members
  static getMembers(): Member[] {
    return this.get('db_members', INITIAL_MEMBERS);
  }
  static saveMembers(mems: Member[]): void {
    this.set('db_members', mems);
  }

  // leads
  static getLeads(): Lead[] {
    return this.get('db_leads', INITIAL_LEADS);
  }
  static saveLeads(leads: Lead[]): void {
    this.set('db_leads', leads);
  }

  // payments
  static getPayments(): Payment[] {
    return this.get('db_payments', INITIAL_PAYMENTS);
  }
  static savePayments(pays: Payment[]): void {
    this.set('db_payments', pays);
  }

  // gallery
  static getGallery(): GalleryImage[] {
    return this.get('db_gallery', INITIAL_GALLERY);
  }
  static saveGallery(gal: GalleryImage[]): void {
    this.set('db_gallery', gal);
  }

  // testimonials
  static getTestimonials(): Testimonial[] {
    return this.get('db_testimonials', INITIAL_TESTIMONIALS);
  }
  static saveTestimonials(tsts: Testimonial[]): void {
    this.set('db_testimonials', tsts);
  }
}

// Global Simulated Auth State (since we need smooth logins)
export const getAdminUser = () => {
  const user = localStorage.getItem('gym_admin_user');
  return user ? JSON.parse(user) : null;
};

export const setAdminUser = (user: { email: string; role: 'admin' } | null) => {
  if (user) {
    localStorage.setItem('gym_admin_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('gym_admin_user');
  }
};

/**
 * Unified CRUD Service that targets Supabase when configured, or transparently falls back to
 * robust LocalStorage Syncing. This allows absolute production compatibility while guaranteeing 
 * instant usability out-of-the-box in the AI Studio environment!
 */
export const dbService = {
  // SETTINGS
  async getSettings(): Promise<GymSettings> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('settings').select('*').single();
      if (!error && data) return data as GymSettings;
    }
    return DBEngine.getSettings();
  },

  async updateSettings(settings: GymSettings): Promise<GymSettings> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('settings').upsert(settings).select().single();
      if (!error && data) return data as GymSettings;
    }
    DBEngine.saveSettings(settings);
    return settings;
  },

  // PACKAGES
  async getPackages(onlyActive = false): Promise<GymPackage[]> {
    if (isSupabaseConfigured && supabase) {
      let query = supabase.from('packages').select('*').order('created_at', { ascending: false });
      if (onlyActive) {
        query = query.eq('is_active', true);
      }
      const { data, error } = await query;
      if (!error && data) return data as GymPackage[];
    }
    const pkgs = DBEngine.getPackages();
    return onlyActive ? pkgs.filter(p => p.is_active) : pkgs;
  },

  async insertPackage(pkg: Omit<GymPackage, 'id' | 'created_at'>): Promise<GymPackage> {
    const newPkg: GymPackage = {
      ...pkg,
      id: `pkg_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString()
    };
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('packages').insert(pkg).select().single();
      if (!error && data) return data as GymPackage;
    }
    const current = DBEngine.getPackages();
    DBEngine.savePackages([newPkg, ...current]);
    return newPkg;
  },

  async updatePackage(id: string, pkg: Partial<GymPackage>): Promise<GymPackage> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('packages').update(pkg).eq('id', id).select().single();
      if (!error && data) return data as GymPackage;
    }
    const pkgs = DBEngine.getPackages();
    const idx = pkgs.findIndex(p => p.id === id);
    if (idx !== -1) {
      pkgs[idx] = { ...pkgs[idx], ...pkg };
      DBEngine.savePackages(pkgs);
      return pkgs[idx];
    }
    throw new Error('Package not found');
  },

  async deletePackage(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('packages').delete().eq('id', id);
      if (!error) return true;
    }
    const pkgs = DBEngine.getPackages();
    const filtered = pkgs.filter(p => p.id !== id);
    DBEngine.savePackages(filtered);
    return true;
  },

  // TRAINERS
  async getTrainers(onlyActive = false): Promise<Trainer[]> {
    if (isSupabaseConfigured && supabase) {
      let query = supabase.from('trainers').select('*').order('created_at', { ascending: false });
      if (onlyActive) {
        query = query.eq('is_active', true);
      }
      const { data, error } = await query;
      if (!error && data) return data as Trainer[];
    }
    const trns = DBEngine.getTrainers();
    return onlyActive ? trns.filter(t => t.is_active) : trns;
  },

  async insertTrainer(trainer: Omit<Trainer, 'id' | 'created_at'>): Promise<Trainer> {
    const newTrn: Trainer = {
      ...trainer,
      id: `trn_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString()
    };
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('trainers').insert(trainer).select().single();
      if (!error && data) return data as Trainer;
    }
    const current = DBEngine.getTrainers();
    DBEngine.saveTrainers([newTrn, ...current]);
    return newTrn;
  },

  async updateTrainer(id: string, trainer: Partial<Trainer>): Promise<Trainer> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('trainers').update(trainer).eq('id', id).select().single();
      if (!error && data) return data as Trainer;
    }
    const trns = DBEngine.getTrainers();
    const idx = trns.findIndex(t => t.id === id);
    if (idx !== -1) {
      trns[idx] = { ...trns[idx], ...trainer };
      DBEngine.saveTrainers(trns);
      return trns[idx];
    }
    throw new Error('Trainer not found');
  },

  async deleteTrainer(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('trainers').delete().eq('id', id);
      if (!error) return true;
    }
    const trns = DBEngine.getTrainers();
    const filtered = trns.filter(t => t.id !== id);
    DBEngine.saveTrainers(filtered);
    return true;
  },

  // CLASSES
  async getClasses(onlyActive = false): Promise<GymClass[]> {
    if (isSupabaseConfigured && supabase) {
      let query = supabase.from('classes').select('*').order('created_at', { ascending: false });
      if (onlyActive) {
        query = query.eq('is_active', true);
      }
      const { data, error } = await query;
      if (!error && data) return data as GymClass[];
    }
    const cls = DBEngine.getClasses();
    return onlyActive ? cls.filter(c => c.is_active) : cls;
  },

  async insertClass(gymClass: Omit<GymClass, 'id' | 'created_at'>): Promise<GymClass> {
    const newCls: GymClass = {
      ...gymClass,
      id: `cls_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString()
    };
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('classes').insert(gymClass).select().single();
      if (!error && data) return data as GymClass;
    }
    const current = DBEngine.getClasses();
    DBEngine.saveClasses([newCls, ...current]);
    return newCls;
  },

  async updateClass(id: string, gymClass: Partial<GymClass>): Promise<GymClass> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('classes').update(gymClass).eq('id', id).select().single();
      if (!error && data) return data as GymClass;
    }
    const list = DBEngine.getClasses();
    const idx = list.findIndex(c => c.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...gymClass };
      DBEngine.saveClasses(list);
      return list[idx];
    }
    throw new Error('Class not found');
  },

  async deleteClass(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('classes').delete().eq('id', id);
      if (!error) return true;
    }
    const list = DBEngine.getClasses();
    const filtered = list.filter(c => c.id !== id);
    DBEngine.saveClasses(filtered);
    return true;
  },

  // MEMBERS
  async getMembers(): Promise<Member[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('members').select('*').order('created_at', { ascending: false });
      if (!error && data) return data as Member[];
    }
    return DBEngine.getMembers();
  },

  async insertMember(member: Omit<Member, 'id' | 'created_at'>): Promise<Member> {
    const newMember: Member = {
      ...member,
      id: `mem_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString()
    };
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('members').insert(member).select().single();
      if (!error && data) return data as Member;
    }
    const current = DBEngine.getMembers();
    DBEngine.saveMembers([newMember, ...current]);
    return newMember;
  },

  async updateMember(id: string, member: Partial<Member>): Promise<Member> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('members').update(member).eq('id', id).select().single();
      if (!error && data) return data as Member;
    }
    const list = DBEngine.getMembers();
    const idx = list.findIndex(m => m.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...member };
      DBEngine.saveMembers(list);
      return list[idx];
    }
    throw new Error('Member not found');
  },

  async deleteMember(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('members').delete().eq('id', id);
      if (!error) return true;
    }
    const list = DBEngine.getMembers();
    const filtered = list.filter(m => m.id !== id);
    DBEngine.saveMembers(filtered);
    return true;
  },

  // LEADS
  async getLeads(): Promise<Lead[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
      if (!error && data) return data as Lead[];
    }
    return DBEngine.getLeads();
  },

  async insertLead(lead: Omit<Lead, 'id' | 'created_at' | 'status'>): Promise<Lead> {
    const newLead: Lead = {
      ...lead,
      id: `led_${Math.random().toString(36).substr(2, 9)}`,
      status: 'new',
      created_at: new Date().toISOString()
    };
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('leads').insert({ ...lead, status: 'new' }).select().single();
      if (!error && data) return data as Lead;
    }
    const current = DBEngine.getLeads();
    DBEngine.saveLeads([newLead, ...current]);
    return newLead;
  },

  async updateLead(id: string, lead: Partial<Lead>): Promise<Lead> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('leads').update(lead).eq('id', id).select().single();
      if (!error && data) return data as Lead;
    }
    const list = DBEngine.getLeads();
    const idx = list.findIndex(l => l.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...lead };
      DBEngine.saveLeads(list);
      return list[idx];
    }
    throw new Error('Lead not found');
  },

  async deleteLead(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('leads').delete().eq('id', id);
      if (!error) return true;
    }
    const list = DBEngine.getLeads();
    const filtered = list.filter(l => l.id !== id);
    DBEngine.saveLeads(filtered);
    return true;
  },

  // PAYMENTS
  async getPayments(): Promise<Payment[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('payments').select('*').order('created_at', { ascending: false });
      if (!error && data) return data as Payment[];
    }
    return DBEngine.getPayments();
  },

  async insertPayment(payment: Omit<Payment, 'id' | 'created_at'>): Promise<Payment> {
    const newPayment: Payment = {
      ...payment,
      id: `pay_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString()
    };
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('payments').insert(payment).select().single();
      if (!error && data) return data as Payment;
    }
    const current = DBEngine.getPayments();
    DBEngine.savePayments([newPayment, ...current]);
    return newPayment;
  },

  async updatePayment(id: string, payment: Partial<Payment>): Promise<Payment> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('payments').update(payment).eq('id', id).select().single();
      if (!error && data) return data as Payment;
    }
    const list = DBEngine.getPayments();
    const idx = list.findIndex(p => p.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...payment };
      DBEngine.savePayments(list);
      return list[idx];
    }
    throw new Error('Payment not found');
  },

  async deletePayment(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('payments').delete().eq('id', id);
      if (!error) return true;
    }
    const list = DBEngine.getPayments();
    const filtered = list.filter(p => p.id !== id);
    DBEngine.savePayments(filtered);
    return true;
  },

  // GALLERY
  async getGallery(onlyActive = false): Promise<GalleryImage[]> {
    if (isSupabaseConfigured && supabase) {
      let query = supabase.from('gallery').select('*').order('created_at', { ascending: false });
      if (onlyActive) {
        query = query.eq('is_active', true);
      }
      const { data, error } = await query;
      if (!error && data) return data as GalleryImage[];
    }
    const list = DBEngine.getGallery();
    return onlyActive ? list.filter(g => g.is_active) : list;
  },

  async insertGallery(image: Omit<GalleryImage, 'id' | 'created_at'>): Promise<GalleryImage> {
    const newImg: GalleryImage = {
      ...image,
      id: `gal_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString()
    };
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('gallery').insert(image).select().single();
      if (!error && data) return data as GalleryImage;
    }
    const current = DBEngine.getGallery();
    DBEngine.saveGallery([newImg, ...current]);
    return newImg;
  },

  async updateGallery(id: string, image: Partial<GalleryImage>): Promise<GalleryImage> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('gallery').update(image).eq('id', id).select().single();
      if (!error && data) return data as GalleryImage;
    }
    const list = DBEngine.getGallery();
    const idx = list.findIndex(g => g.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...image };
      DBEngine.saveGallery(list);
      return list[idx];
    }
    throw new Error('Gallery image not found');
  },

  async deleteGallery(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('gallery').delete().eq('id', id);
      if (!error) return true;
    }
    const list = DBEngine.getGallery();
    const filtered = list.filter(g => g.id !== id);
    DBEngine.saveGallery(filtered);
    return true;
  },

  // TESTIMONIALS
  async getTestimonials(onlyActive = false): Promise<Testimonial[]> {
    if (isSupabaseConfigured && supabase) {
      let query = supabase.from('testimonials').select('*').order('created_at', { ascending: false });
      if (onlyActive) {
        query = query.eq('is_active', true);
      }
      const { data, error } = await query;
      if (!error && data) return data as Testimonial[];
    }
    const list = DBEngine.getTestimonials();
    return onlyActive ? list.filter(t => t.is_active) : list;
  },

  async insertTestimonial(testimonial: Omit<Testimonial, 'id' | 'created_at'>): Promise<Testimonial> {
    const newTest: Testimonial = {
      ...testimonial,
      id: `tst_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString()
    };
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('testimonials').insert(testimonial).select().single();
      if (!error && data) return data as Testimonial;
    }
    const current = DBEngine.getTestimonials();
    DBEngine.saveTestimonials([newTest, ...current]);
    return newTest;
  },

  async updateTestimonial(id: string, testimonial: Partial<Testimonial>): Promise<Testimonial> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('testimonials').update(testimonial).eq('id', id).select().single();
      if (!error && data) return data as Testimonial;
    }
    const list = DBEngine.getTestimonials();
    const idx = list.findIndex(t => t.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...testimonial };
      DBEngine.saveTestimonials(list);
      return list[idx];
    }
    throw new Error('Testimonial not found');
  },

  async deleteTestimonial(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      if (!error) return true;
    }
    const list = DBEngine.getTestimonials();
    const filtered = list.filter(t => t.id !== id);
    DBEngine.saveTestimonials(filtered);
    return true;
  }
};
