export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'patient' | 'doctor' | 'admin';
  phone?: string;
  date_of_birth?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface Doctor {
  id: string;
  user_id: string;
  specialty: string;
  license_number: string;
  years_of_experience: number;
  education: string;
  bio?: string;
  consultation_fee: number;
  is_approved: boolean;
  availability: DoctorAvailability[];
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface DoctorAvailability {
  id: string;
  doctor_id: string;
  day_of_week: number; // 0-6 (Sunday-Saturday)
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  reason: string;
  notes?: string;
  documents?: string[];
  created_at: string;
  updated_at: string;
  patient?: User;
  doctor?: Doctor;
}

export interface AppointmentFormData {
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  reason: string;
  notes?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  signOut: () => Promise<void>;
}

export interface DoctorRegistrationData {
  email: string;
  password: string;
  full_name: string;
  phone: string;
  specialty: string;
  license_number: string;
  years_of_experience: number;
  education: string;
  bio?: string;
  consultation_fee: number;
}

export interface PatientRegistrationData {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  date_of_birth?: string;
  address?: string;
}