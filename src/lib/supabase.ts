import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for database operations
export const db = {
  // Users
  async getUser(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateUser(id: string, updates: any) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Doctors
  async getDoctors(filters?: { specialty?: string; is_approved?: boolean }) {
    let query = supabase
      .from('doctors')
      .select(`
        *,
        user:users(*)
      `);

    if (filters?.specialty) {
      query = query.eq('specialty', filters.specialty);
    }

    if (filters?.is_approved !== undefined) {
      query = query.eq('is_approved', filters.is_approved);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getDoctor(id: string) {
    const { data, error } = await supabase
      .from('doctors')
      .select(`
        *,
        user:users(*),
        availability:doctor_availability(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async createDoctor(doctorData: any) {
    const { data, error } = await supabase
      .from('doctors')
      .insert(doctorData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateDoctor(id: string, updates: any) {
    const { data, error } = await supabase
      .from('doctors')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Appointments
  async getAppointments(filters?: { patient_id?: string; doctor_id?: string; status?: string }) {
    let query = supabase
      .from('appointments')
      .select(`
        *,
        patient:users!appointments_patient_id_fkey(*),
        doctor:doctors(*, user:users(*))
      `)
      .order('appointment_date', { ascending: true });

    if (filters?.patient_id) {
      query = query.eq('patient_id', filters.patient_id);
    }

    if (filters?.doctor_id) {
      query = query.eq('doctor_id', filters.doctor_id);
    }

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async createAppointment(appointmentData: any) {
    const { data, error } = await supabase
      .from('appointments')
      .insert(appointmentData)
      .select(`
        *,
        patient:users!appointments_patient_id_fkey(*),
        doctor:doctors(*, user:users(*))
      `)
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateAppointment(id: string, updates: any) {
    const { data, error } = await supabase
      .from('appointments')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        patient:users!appointments_patient_id_fkey(*),
        doctor:doctors(*, user:users(*))
      `)
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteAppointment(id: string) {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};