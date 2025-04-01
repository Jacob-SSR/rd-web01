// src/pages/Register.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; // Fixed import
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { useStore } from "../stores/userStore";

function Register() {
  const navigate = useNavigate();
  const { register, isAuthenticated, isLoading, error, clearError } = useStore();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field-specific error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear global error when user types
    if (error) {
      clearError();
    }
  };

  const validate = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    try {
      await register(formData.username, formData.email, formData.password);
      // Navigation will happen in the useEffect when isAuthenticated changes
    } catch (err) {
      // Error is handled by the store and shown via the error state
      console.error('Registration failed:', err);
    }
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col w-full max-w-md">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Register</h1>
          <p className="py-4">Create a new account to start challenging yourself</p>
        </div>
        
        <div className="card w-full bg-base-100 shadow-xl">
          <div className="card-body">
            {error && (
              <div className="alert alert-error mb-4">
                <span>{error}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Username</span>
                </label>
                <input
                  type="text"
                  name="username"
                  placeholder="Choose a username"
                  className={`input input-bordered ${formErrors.username ? 'input-error' : ''}`}
                  value={formData.username}
                  onChange={handleChange}
                />
                {formErrors.username && (
                  <label className="label">
                    <span className="label-text-alt text-error">{formErrors.username}</span>
                  </label>
                )}
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className={`input input-bordered ${formErrors.email ? 'input-error' : ''}`}
                  value={formData.email}
                  onChange={handleChange}
                />
                {formErrors.email && (
                  <label className="label">
                    <span className="label-text-alt text-error">{formErrors.email}</span>
                  </label>
                )}
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a password"
                    className={`input input-bordered w-full ${formErrors.password ? 'input-error' : ''}`}
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button 
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={20} className="text-gray-500" />
                    ) : (
                      <Eye size={20} className="text-gray-500" />
                    )}
                  </button>
                </div>
                {formErrors.password && (
                  <label className="label">
                    <span className="label-text-alt text-error">{formErrors.password}</span>
                  </label>
                )}
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Confirm Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    className={`input input-bordered w-full ${formErrors.confirmPassword ? 'input-error' : ''}`}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <button 
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} className="text-gray-500" />
                    ) : (
                      <Eye size={20} className="text-gray-500" />
                    )}
                  </button>
                </div>
                {formErrors.confirmPassword && (
                  <label className="label">
                    <span className="label-text-alt text-error">{formErrors.confirmPassword}</span>
                  </label>
                )}
              </div>
              
              <div className="form-control mt-4">
                <div className="flex items-center gap-2 mb-4">
                  <input type="checkbox" className="checkbox checkbox-primary" id="terms" />
                  <label htmlFor="terms" className="cursor-pointer text-sm">
                    I agree to the <a href="#" className="link link-primary">Terms of Service</a> and <a href="#" className="link link-primary">Privacy Policy</a>
                  </label>
                </div>
              </div>
              
              <div className="form-control mt-6">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <UserPlus size={20} />
                      Register
                    </span>
                  )}
                </button>
              </div>
            </form>
            
            <div className="divider">OR</div>
            
            <div className="text-center">
              <p>Already have an account?</p>
              <Link to="/login" className="btn btn-link">
                Login now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;