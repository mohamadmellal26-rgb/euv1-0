import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

export default function Auth() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // حالات التعامل مع الـ API
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    const endpoint = isSignIn ? '/auth/signin' : '/auth/signup';
    const payload = isSignIn
      ? { email, password }
      : { full_name: name, email, password };

    try {
      const response = await fetch(`https://euv1-0.onrender.com${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'An error occurred during authentication');
      }

      if (isSignIn) {
        setSuccessMessage('Logged in successfully!');
        // حفظ بيانات المستخدم والـ Session
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // التوجيه للصفحة الرئيسية بعد ثانية
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        setSuccessMessage('Account created successfully! Switching to sign in...');
        setTimeout(() => {
          setIsSignIn(true);
          setSuccessMessage('');
        }, 1500);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Server connection failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsSignIn(!isSignIn);
    setErrorMessage('');
    setSuccessMessage('');
  };

  return (
    <div className="auth-container">
      {/* Upper Navigation Bar */}
      <header className="auth-header">
        <Link to="/" className="auth-back-home">Back to home</Link>
      </header>

      {/* Main Authentication Card */}
      <main className="auth-main">
        <div className="auth-card">
          <div className="auth-titles">
            <h1>{isSignIn ? 'Welcome back' : 'Create an account'}</h1>
            <p>
              {isSignIn 
                ? 'Enter your credentials to access your workspace' 
                : 'Enter your details below to create your account'}
            </p>
          </div>

          {/* تنبيهات الخطأ والنجاح */}
          {errorMessage && <div className="auth-alert alert-error">{errorMessage}</div>}
          {successMessage && <div className="auth-alert alert-success">{successMessage}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            {!isSignIn && (
              <div className="input-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  placeholder="Mohamad"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="input-group">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                id="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading 
                ? (isSignIn ? 'Signing In...' : 'Signing Up...') 
                : (isSignIn ? 'Sign In' : 'Sign Up')}
            </button>
          </form>

          <div className="auth-footer-toggle">
            <span>
              {isSignIn ? "Don't have an account?" : 'Already have an account?'}
            </span>
            <button 
              type="button" 
              className="toggle-link-btn"
              onClick={toggleAuthMode}
            >
              {isSignIn ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}