import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Stethoscope, 
  Star, 
  Clock, 
  DollarSign, 
  GraduationCap, 
  Award,
  Calendar,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import { Doctor } from '../../types';
import { db } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

const DoctorDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchDoctor(id);
    }
  }, [id]);

  const fetchDoctor = async (doctorId: string) => {
    try {
      setLoading(true);
      const data = await db.getDoctor(doctorId);
      setDoctor(data);
    } catch (error) {
      console.error('Error fetching doctor:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="loading-spinner h-8 w-8"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <Stethoscope className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Doctor not found</h3>
            <p className="text-gray-600 mb-6">
              The doctor you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/doctors" className="btn btn-primary">
              Browse All Doctors
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Doctor Avatar */}
            <div className="bg-primary-100 p-6 rounded-full">
              <Stethoscope className="h-16 w-16 text-primary-600" />
            </div>

            {/* Doctor Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Dr. {doctor.user?.full_name}
              </h1>
              <p className="text-xl text-primary-600 font-medium mb-4">
                {doctor.specialty}
              </p>
              
              <div className="flex flex-wrap items-center gap-6 text-gray-600">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>{doctor.years_of_experience} years experience</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5" />
                  <span>${doctor.consultation_fee} consultation</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-warning-500 fill-current" />
                  <span>4.8 (124 reviews)</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="w-full md:w-auto">
              {user && user.role === 'patient' ? (
                <Link
                  to={`/doctors/${doctor.id}/book`}
                  className="btn btn-primary w-full md:w-auto px-8 py-3 text-lg flex items-center justify-center space-x-2"
                >
                  <Calendar className="h-5 w-5" />
                  <span>Book Appointment</span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="btn btn-primary w-full md:w-auto px-8 py-3 text-lg"
                >
                  Sign In to Book
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About Dr. {doctor.user?.full_name}</h2>
              {doctor.bio ? (
                <p className="text-gray-600 leading-relaxed">{doctor.bio}</p>
              ) : (
                <p className="text-gray-500 italic">No bio available.</p>
              )}
            </div>

            {/* Education & Credentials */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <GraduationCap className="h-6 w-6 text-primary-600" />
                <span>Education & Credentials</span>
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Education</h3>
                  <p className="text-gray-600">{doctor.education}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">License Number</h3>
                  <p className="text-gray-600">{doctor.license_number}</p>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Patient Reviews</h2>
              <div className="space-y-4">
                {/* Sample reviews */}
                <div className="border-b border-gray-200 pb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-warning-500 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">John D. • 2 weeks ago</span>
                  </div>
                  <p className="text-gray-600">
                    Excellent doctor! Very thorough examination and clear explanations. 
                    Highly recommend for anyone looking for quality healthcare.
                  </p>
                </div>
                
                <div className="border-b border-gray-200 pb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-warning-500 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">Sarah M. • 1 month ago</span>
                  </div>
                  <p className="text-gray-600">
                    Professional and caring. The appointment was on time and the doctor 
                    took time to answer all my questions.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Info</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Award className="h-5 w-5 text-primary-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Specialty</p>
                    <p className="text-sm text-gray-600">{doctor.specialty}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-primary-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Experience</p>
                    <p className="text-sm text-gray-600">{doctor.years_of_experience} years</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <DollarSign className="h-5 w-5 text-primary-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Consultation Fee</p>
                    <p className="text-sm text-gray-600">${doctor.consultation_fee}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-primary-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Phone</p>
                    <p className="text-sm text-gray-600">{doctor.user?.phone || 'Not available'}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-primary-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-600">{doctor.user?.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-primary-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Location</p>
                    <p className="text-sm text-gray-600">Medical Center, Downtown</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Availability</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Monday</span>
                  <span className="text-gray-900">9:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tuesday</span>
                  <span className="text-gray-900">9:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Wednesday</span>
                  <span className="text-gray-900">9:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Thursday</span>
                  <span className="text-gray-900">9:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Friday</span>
                  <span className="text-gray-900">9:00 AM - 3:00 PM</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Weekend</span>
                  <span className="text-gray-500">Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetail;