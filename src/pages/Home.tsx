import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Shield, Users, Star, ArrowRight, CheckCircle } from 'lucide-react';

const Home: React.FC = () => {
  const features = [
    {
      icon: Calendar,
      title: 'Easy Booking',
      description: 'Schedule appointments with just a few clicks. No more waiting on hold or phone tag.',
    },
    {
      icon: Clock,
      title: 'Real-time Availability',
      description: 'See available slots instantly and choose times that work for your schedule.',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your health information is protected with enterprise-grade security.',
    },
    {
      icon: Users,
      title: 'Qualified Doctors',
      description: 'Connect with verified healthcare professionals across various specialties.',
    },
  ];

  const benefits = [
    'Browse through a wide range of doctors and healthcare providers',
    'Filter by specialty, location, and availability',
    'Real-time appointment scheduling',
    'Secure document upload and management',
    'Appointment reminders and notifications',
    'Easy rescheduling and cancellation',
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                DocSpot: Seamless Appointment Booking for Health
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Booking a doctor's appointment has never been easier. Schedule your healthcare 
                appointments from the comfort of your home with our user-friendly platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="btn btn-primary text-lg px-8 py-3 flex items-center justify-center space-x-2"
                >
                  <span>Get Started</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  to="/doctors"
                  className="btn btn-secondary text-lg px-8 py-3"
                >
                  Browse Doctors
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl p-8 animate-slide-up">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-success-100 p-2 rounded-full">
                    <CheckCircle className="h-6 w-6 text-success-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Appointment Confirmed</h3>
                    <p className="text-gray-600 text-sm">Dr. Sarah Johnson</p>
                  </div>
                </div>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span className="font-medium">Tomorrow, 2:30 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Specialty:</span>
                    <span className="font-medium">Cardiology</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Location:</span>
                    <span className="font-medium">Medical Center</span>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-warning-500 fill-current" />
                    <span className="text-sm text-gray-600">4.9/5 rating • 127 reviews</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose DocSpot?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform offers everything you need for seamless healthcare appointment management
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card card-hover text-center animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-primary-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <feature.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Advanced Booking System
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Say goodbye to the hassle of traditional appointment booking. Our platform 
                offers real-time availability and flexible scheduling options.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-success-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Book Your Appointment Today
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Dr. Michael Chen</p>
                    <p className="text-sm text-gray-600">Dermatology</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Available</p>
                    <p className="font-medium text-success-600">Today 3:00 PM</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Dr. Emily Rodriguez</p>
                    <p className="text-sm text-gray-600">Pediatrics</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Available</p>
                    <p className="font-medium text-success-600">Tomorrow 10:30 AM</p>
                  </div>
                </div>
                <Link
                  to="/doctors"
                  className="btn btn-primary w-full flex items-center justify-center space-x-2"
                >
                  <span>View All Doctors</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of patients who have simplified their healthcare journey with DocSpot
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Sign Up as Patient
            </Link>
            <Link
              to="/register?type=doctor"
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Join as Doctor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;