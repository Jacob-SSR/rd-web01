// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Fixed import
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useStore } from '../stores/userStore';

function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading, error, clearError } = useStore();
  
  const [formData, setFormData] = useState({
    identity: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loginTimeout, setLoginTimeout] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Add a timeout handler for long-running login attempts
  useEffect(() => {
    let timeoutId;
    
    if (isLoading) {
      timeoutId = setTimeout(() => {
        setLoginTimeout(true);
      }, 5000); // Show timeout message after 5 seconds
    } else {
      setLoginTimeout(false);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isLoading]);

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
    
    if (!formData.identity.trim()) {
      errors.identity = 'Email or username is required';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    try {
      // Use AbortController to set a timeout on the login request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15-second timeout
      
      await login(formData.identity, formData.password, controller.signal);
      clearTimeout(timeoutId);
      // Navigation will happen in the useEffect when isAuthenticated changes
    } catch (err) {
      // Error is handled by the store and shown via the error state
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col w-full max-w-md">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Login</h1>
          <p className="py-4">Sign in to access your account</p>
        </div>
        
        <div className="card w-full bg-base-100 shadow-xl">
          <div className="card-body">
            {error && (
              <div className="alert alert-error mb-4">
                <span>{error}</span>
              </div>
            )}
            
            {loginTimeout && (
              <div className="alert alert-warning mb-4">
                <span>Login is taking longer than expected. Server might be slow. Please wait...</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email or Username</span>
                </label>
                <input
                  type="text"
                  name="identity"
                  placeholder="Enter your email or username"
                  className={`input input-bordered ${formErrors.identity ? 'input-error' : ''}`}
                  value={formData.identity}
                  onChange={handleChange}
                />
                {formErrors.identity && (
                  <label className="label">
                    <span className="label-text-alt text-error">{formErrors.identity}</span>
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
                    placeholder="Enter your password"
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
                <label className="label">
                  <a href="#" className="label-text-alt link link-hover">Forgot password?</a>
                </label>
              </div>
              
              <div className="form-control mt-4">
                <div className="flex items-center gap-2 mb-4">
                  <input type="checkbox" className="checkbox checkbox-primary" id="remember" />
                  <label htmlFor="remember" className="cursor-pointer">Remember me</label>
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
                      <LogIn size={20} />
                      Login
                    </span>
                  )}
                </button>
              </div>
            </form>
            
            <div className="divider">OR</div>
            
            <div className="text-center">
              <p>Don't have an account?</p>
              <Link to="/register" className="btn btn-link">
                Register now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;