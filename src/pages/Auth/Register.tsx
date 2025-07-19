import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, User, Phone, Calendar, MapPin, Stethoscope, GraduationCap, FileText, DollarSign } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/supabase';

interface PatientFormData {
  email: string;
  password: string;
  confirmPassword: string;
  full_name: string;
  phone: string;
  date_of_birth: string;
  address: string;
}

interface DoctorFormData extends PatientFormData {
  specialty: string;
  license_number: string;
  years_of_experience: number;
  education: string;
  bio: string;
  consultation_fee: number;
}

const Register: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [userType, setUserType] = useState<'patient' | 'doctor'>(
    searchParams.get('type') === 'doctor' ? 'doctor' : 'patient'
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { signUp } = useAuth();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<DoctorFormData>();

  const password = watch('password');

  const specialties = [
    'Cardiology',
    'Dermatology',
    'Endocrinology',
    'Gastroenterology',
    'Neurology',
    'Oncology',
    'Orthopedics',
    'Pediatrics',
    'Psychiatry',
    'Radiology',
    'Surgery',
    'Urology',
  ];

  const onSubmit = async (data: DoctorFormData) => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const userData = {
        full_name: data.full_name,
        phone: data.phone,
        role: userType,
        ...(userType === 'patient' && {
          date_of_birth: data.date_of_birth,
          address: data.address,
        }),
      };

      await signUp(data.email, data.password, userData);

      if (userType === 'doctor') {
        // Create doctor profile (will be pending approval)
        const { data: authUser } = await supabase.auth.getUser();
        if (authUser.user) {
          await db.createDoctor({
            user_id: authUser.user.id,
            specialty: data.specialty,
            license_number: data.license_number,
            years_of_experience: data.years_of_experience,
            education: data.education,
            bio: data.bio,
            consultation_fee: data.consultation_fee,
            is_approved: false, // Requires admin approval
          });
        }
        
        setSuccess('Registration successful! Your doctor profile is pending admin approval.');
      } else {
        setSuccess('Registration successful! You can now sign in.');
      }

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary-600 p-3 rounded-xl">
              <Stethoscope className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Join DocSpot
          </h2>
          <p className="mt-2 text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Sign in here
            </Link>
          </p>
        </div>

        {/* User Type Selection */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">I want to register as:</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setUserType('patient')}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                userType === 'patient'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <User className="h-8 w-8 mx-auto mb-2 text-primary-600" />
              <p className="font-medium text-gray-900">Patient</p>
              <p className="text-sm text-gray-600">Book appointments</p>
            </button>
            <button
              type="button"
              onClick={() => setUserType('doctor')}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                userType === 'doctor'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Stethoscope className="h-8 w-8 mx-auto mb-2 text-primary-600" />
              <p className="font-medium text-gray-900">Doctor</p>
              <p className="text-sm text-gray-600">Manage appointments</p>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {error && (
            <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-lg">
              <p className="text-error-600 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-success-50 border border-success-200 rounded-lg">
              <p className="text-success-600 text-sm">{success}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      {...register('full_name', { required: 'Full name is required' })}
                      className="input pl-10"
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.full_name && (
                    <p className="mt-1 text-sm text-error-600">{errors.full_name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      {...register('phone', { required: 'Phone number is required' })}
                      className="input pl-10"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-error-600">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                    type="email"
                    className="input pl-10"
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-error-600">{errors.email.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      {...register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters',
                        },
                      })}
                      type="password"
                      className="input pl-10"
                      placeholder="Create a password"
                    />
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-error-600">{errors.password.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      {...register('confirmPassword', {
                        required: 'Please confirm your password',
                        validate: (value) =>
                          value === password || 'Passwords do not match',
                      })}
                      type="password"
                      className="input pl-10"
                      placeholder="Confirm your password"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-error-600">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Patient-specific fields */}
            {userType === 'patient' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        {...register('date_of_birth')}
                        type="date"
                        className="input pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        {...register('address')}
                        className="input pl-10"
                        placeholder="Enter your address"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Doctor-specific fields */}
            {userType === 'doctor' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Professional Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Specialty
                    </label>
                    <select
                      {...register('specialty', { required: 'Specialty is required' })}
                      className="input"
                    >
                      <option value="">Select your specialty</option>
                      {specialties.map((specialty) => (
                        <option key={specialty} value={specialty}>
                          {specialty}
                        </option>
                      ))}
                    </select>
                    {errors.specialty && (
                      <p className="mt-1 text-sm text-error-600">{errors.specialty.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      License Number
                    </label>
                    <input
                      {...register('license_number', { required: 'License number is required' })}
                      className="input"
                      placeholder="Enter your license number"
                    />
                    {errors.license_number && (
                      <p className="mt-1 text-sm text-error-600">{errors.license_number.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Years of Experience
                    </label>
                    <input
                      {...register('years_of_experience', {
                        required: 'Years of experience is required',
                        min: { value: 0, message: 'Must be a positive number' },
                      })}
                      type="number"
                      className="input"
                      placeholder="Enter years of experience"
                    />
                    {errors.years_of_experience && (
                      <p className="mt-1 text-sm text-error-600">{errors.years_of_experience.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Consultation Fee ($)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        {...register('consultation_fee', {
                          required: 'Consultation fee is required',
                          min: { value: 0, message: 'Must be a positive number' },
                        })}
                        type="number"
                        className="input pl-10"
                        placeholder="Enter consultation fee"
                      />
                    </div>
                    {errors.consultation_fee && (
                      <p className="mt-1 text-sm text-error-600">{errors.consultation_fee.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Education
                  </label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <textarea
                      {...register('education', { required: 'Education is required' })}
                      rows={3}
                      className="input pl-10"
                      placeholder="Enter your educational background"
                    />
                  </div>
                  {errors.education && (
                    <p className="mt-1 text-sm text-error-600">{errors.education.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio (Optional)
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <textarea
                      {...register('bio')}
                      rows={4}
                      className="input pl-10"
                      placeholder="Tell patients about yourself and your practice"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full flex justify-center items-center"
              >
                {loading ? (
                  <div className="loading-spinner h-5 w-5"></div>
                ) : (
                  `Register as ${userType === 'patient' ? 'Patient' : 'Doctor'}`
                )}
              </button>
            </div>
          </form>

          {userType === 'doctor' && (
            <div className="mt-6 p-4 bg-warning-50 border border-warning-200 rounded-lg">
              <p className="text-warning-800 text-sm">
                <strong>Note:</strong> Doctor registrations require admin approval. 
                You'll receive an email notification once your profile is approved.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;