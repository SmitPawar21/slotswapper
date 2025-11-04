import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
        console.log("Passwords do not match");
        return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({name: formData.name, email: formData.email, password: formData.password}) // Removed 'role' as it wasn't in state
      });
      const data = await response.json();
      console.log(data);
      
      navigate('/login');
    } catch (e) {
      console.log(e);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const colors = {
    background: '#040D12',
    cardBg: '#183D3D',
    border: '#5C8374',
    textLight: '#93B1A6',
    textWhite: '#ffffff',
    primary: '#A27B5C',
    primaryHover: '#b58e70', 
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-6 py-12"
      style={{ backgroundColor: colors.background }}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span 
              className="text-3xl font-bold"
              style={{ color: colors.textWhite }}
            >
              E-commerce Website
            </span>
          </div>
          <p style={{ color: colors.textLight }}>Create your account</p>
        </div>

        <div 
          className="backdrop-blur-sm rounded-2xl p-8"
          style={{ 
            backgroundColor: `${colors.cardBg}80`,
            borderColor: `${colors.border}4D`,
            borderWidth: '1px'
          }}
        >
          <h2 
            className="text-2xl font-bold mb-6"
            style={{ color: colors.textWhite }}
          >
            Sign Up
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: colors.textLight }}
              >
                Name
              </label>
              <div className="relative">
                <User 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" 
                  style={{ color: colors.textLight }}
                />
                <input
                  type="text"
                  name="name" 
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 rounded-lg focus:outline-none transition-colors"
                  style={{
                    backgroundColor: `${colors.background}80`,
                    borderColor: `${colors.border}4D`,
                    borderWidth: '1px',
                    color: colors.textWhite,
                    '--placeholder-color': `${colors.textLight}B3`
                  }}
                  onFocus={(e) => e.target.style.borderColor = colors.primary}
                  onBlur={(e) => e.target.style.borderColor = `${colors.border}4D`}
                  placeholder="Enter Your Name"
                  required
                />
              </div>
            </div>

            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: colors.textLight }}
              >
                Email Address
              </label>
              <div className="relative">
                <Mail 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" 
                  style={{ color: colors.textLight }}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 rounded-lg focus:outline-none transition-colors"
                  style={{
                    backgroundColor: `${colors.background}80`,
                    borderColor: `${colors.border}4D`,
                    borderWidth: '1px',
                    color: colors.textWhite,
                    '--placeholder-color': `${colors.textLight}B3`
                  }}
                  onFocus={(e) => e.target.style.borderColor = colors.primary}
                  onBlur={(e) => e.target.style.borderColor = `${colors.border}4D`}
                  placeholder="Enter Email"
                  required
                />
              </div>
            </div>

            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: colors.textLight }}
              >
                Password
              </label>
              <div className="relative">
                <Lock 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" 
                  style={{ color: colors.textLight }}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-3 rounded-lg focus:outline-none transition-colors"
                  style={{
                    backgroundColor: `${colors.background}80`,
                    borderColor: `${colors.border}4D`,
                    borderWidth: '1px',
                    color: colors.textWhite,
                    '--placeholder-color': `${colors.textLight}B3`
                  }}
                  onFocus={(e) => e.target.style.borderColor = colors.primary}
                  onBlur={(e) => e.target.style.borderColor = `${colors.border}4D`}
                  placeholder="Enter Password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors"
                  style={{ color: colors.textLight }}
                  onMouseEnter={(e) => e.currentTarget.style.color = colors.primary}
                  onMouseLeave={(e) => e.currentTarget.style.color = colors.textLight}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: colors.textLight }}
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" 
                  style={{ color: colors.textLight }}
                />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-3 rounded-lg focus:outline-none transition-colors"
                  style={{
                    backgroundColor: `${colors.background}80`,
                    borderColor: `${colors.border}4D`,
                    borderWidth: '1px',
                    color: colors.textWhite,
                    '--placeholder-color': `${colors.textLight}B3`
                  }}
                  onFocus={(e) => e.target.style.borderColor = colors.primary}
                  onBlur={(e) => e.target.style.borderColor = `${colors.border}4D`}
                  placeholder="Re-write to Confirm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors"
                  style={{ color: colors.textLight }}
                  onMouseEnter={(e) => e.currentTarget.style.color = colors.primary}
                  onMouseLeave={(e) => e.currentTarget.style.color = colors.textLight}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg font-semibold transition-colors"
              style={{
                backgroundColor: colors.primary,
                color: colors.textWhite
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primaryHover}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primary}
            >
              Create Account
            </button>
          </form>

          <div className="my-6 flex items-center">
            <div 
              className="flex-1 border-t"
              style={{ borderColor: `${colors.border}4D` }}
            ></div>
            <span 
              className="px-4 text-sm"
              style={{ color: colors.textLight }}
            >
              or
            </span>
            <div 
              className="flex-1 border-t"
              style={{ borderColor: `${colors.border}4D` }}
            ></div>
          </div>

          <p 
            className="text-center"
            style={{ color: colors.textLight }}
          >
            Already have an account?{' '}
            <a 
              href="/login" 
              className="font-medium transition-colors"
              style={{ color: colors.primary }}
              onMouseEnter={(e) => e.currentTarget.style.color = colors.textWhite}
              onMouseLeave={(e) => e.currentTarget.style.color = colors.primary}
            >
              Log in
            </a>
          </p>
        </div>
      </div>
      <style>{`
        input::placeholder {
          color: var(--placeholder-color, #93B1A6B3);
        }
      `}</style>
    </div>
  );
};

export default RegisterPage;
