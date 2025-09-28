import React from 'react';
import { Link, Redirect } from 'react-router-dom';

import Form from 'components/Form';
//import logoImg from 'assets/logo-white.png';

function SignUp({ user, setUser }) {
  if (user.email) return <Redirect to='/dashboard' />;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
             - Get Started Now -
            </h1>
            <p className="text-gray-600">
              Create your SmartSummary account
            </p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <Form formType='signup' formButton='Create Account' setUser={setUser} />
          </div>

          {/* Divider */}
          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
           
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Social Login Buttons */}
          

          {/* Footer Links */}
          <div className="text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link 
                className="text-gray-900 font-semibold underline hover:text-gray-700 transition-colors" 
                to="/login"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side: Image Space */}
      <div className="hidden lg:block lg:w-1/2 bg-white">
        <div className="h-full flex items-center justify-center p-12">
          {/* Placeholder for image - replace with your actual image */}
          <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center">
            <div className="text-center text-white">
              
              <p className="text-sm"><img src = "pou.jpg" alt=""/></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;