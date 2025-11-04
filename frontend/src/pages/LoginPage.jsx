import React, { useContext, useState } from 'react';
import { Mail, Lock, Eye, EyeOff, PersonStanding } from 'lucide-react';
import { AuthContext } from "../context/AuthContext"; 
import { useNavigate } from 'react-router-dom'; 

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
  
      const data = await response.json();
      console.log(data);

      login(data.user.email, data.token);
      navigate('/calendar');
    } catch (e) {
      console.log(e);
      setError(e);
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
      className="min-h-screen flex items-center justify-center px-6 py-10"
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
            Log In
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: colors.textLight }}
              >
                Email
              </label>
              <div className="relative">
                <PersonStanding 
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

            {error && (
              <p className="text-sm text-red-400 text-center">{error}</p>
            )}

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
              Log In
            </button>
          </form>
\
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
            Don't have an account?{' '}
            <a 
              href="/register" 
              className="font-medium transition-colors"
              style={{ color: colors.primary }}
              onMouseEnter={(e) => e.currentTarget.style.color = colors.textWhite}
              onMouseLeave={(e) => e.currentTarget.style.color = colors.primary}
            >
              Register
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

export default LoginPage;
