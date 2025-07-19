import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  User, 
  Stethoscope, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Plus,
  Filter
} from 'lucide-react';
import { format } from 'date-fns';
import { Appointment } from '../../types';
import { db } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

const AppointmentList: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const fetchAppointments = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const filters: any = {};
      
      if (user.role === 'patient') {
        filters.patient_id = user.id;
      } else if (user.role === 'doctor') {
        // Get doctor profile first
        const doctors = await db.getDoctors({ is_approved: true });
        const doctorProfile = doctors.find(d => d.user_id === user.id);
        if (doctorProfile) {
          filters.doctor_id = doctorProfile.id;
        }
      }

      const data = await db.getAppointments(filters);
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appointmentId: string, newStatus: string) => {
    try {
      await db.updateAppointment(appointmentId, { status: newStatus });
      await fetchAppointments(); // Refresh the list
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-success-600" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-error-600" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-primary-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-warning-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'badge badge-success';
      case 'cancelled':
        return 'badge badge-error';
      case 'completed':
        return 'badge badge-primary';
      default:
        return 'badge badge-warning';
    }
  };

  const filteredAppointments = appointments.filter(appointment => 
    statusFilter === 'all' || appointment.status === statusFilter
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="loading-spinner h-8 w-8"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {user?.role === 'patient' ? 'My Appointments' : 'Patient Appointments'}
            </h1>
            <p className="text-gray-600">
              {user?.role === 'patient' 
                ? 'Manage your upcoming and past appointments'
                : 'View and manage your patient appointments'
              }
            </p>
          </div>
          
          {user?.role === 'patient' && (
            <Link
              to="/doctors"
              className="btn btn-primary flex items-center space-x-2 mt-4 sm:mt-0"
            >
              <Plus className="h-5 w-5" />
              <span>Book New Appointment</span>
            </Link>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Filter by status:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    statusFilter === status
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Appointments List */}
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {statusFilter === 'all' ? 'No appointments found' : `No ${statusFilter} appointments`}
            </h3>
            <p className="text-gray-600 mb-6">
              {user?.role === 'patient' 
                ? "You haven't booked any appointments yet."
                : "No patient appointments to display."
              }
            </p>
            {user?.role === 'patient' && (
              <Link to="/doctors" className="btn btn-primary">
                Book Your First Appointment
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  {/* Appointment Info */}
                  <div className="flex-1">
                    <div className="flex items-start space-x-4">
                      {/* Avatar */}
                      <div className="bg-primary-100 p-3 rounded-full flex-shrink-0">
                        {user?.role === 'patient' ? (
                          <Stethoscope className="h-6 w-6 text-primary-600" />
                        ) : (
                          <User className="h-6 w-6 text-primary-600" />
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {user?.role === 'patient' 
                              ? `Dr. ${appointment.doctor?.user?.full_name}`
                              : appointment.patient?.full_name
                            }
                          </h3>
                          <span className={getStatusBadge(appointment.status)}>
                            {appointment.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {format(new Date(appointment.appointment_date), 'MMM dd, yyyy')}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4" />
                            <span>{appointment.appointment_time}</span>
                          </div>

                          {user?.role === 'patient' && (
                            <div className="flex items-center space-x-2">
                              <Stethoscope className="h-4 w-4" />
                              <span>{appointment.doctor?.specialty}</span>
                            </div>
                          )}
                        </div>

                        <div className="mt-3">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Reason:</span> {appointment.reason}
                          </p>
                          {appointment.notes && (
                            <p className="text-sm text-gray-600 mt-1">
                              <span className="font-medium">Notes:</span> {appointment.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(appointment.status)}
                    
                    {user?.role === 'doctor' && appointment.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleStatusUpdate(appointment.id, 'confirmed')}
                          className="btn btn-success text-sm px-3 py-1"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(appointment.id, 'cancelled')}
                          className="btn btn-error text-sm px-3 py-1"
                        >
                          Cancel
                        </button>
                      </div>
                    )}

                    {user?.role === 'doctor' && appointment.status === 'confirmed' && (
                      <button
                        onClick={() => handleStatusUpdate(appointment.id, 'completed')}
                        className="btn btn-primary text-sm px-3 py-1"
                      >
                        Mark Complete
                      </button>
                    )}

                    {user?.role === 'patient' && appointment.status === 'pending' && (
                      <button
                        onClick={() => handleStatusUpdate(appointment.id, 'cancelled')}
                        className="btn btn-error text-sm px-3 py-1"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentList;