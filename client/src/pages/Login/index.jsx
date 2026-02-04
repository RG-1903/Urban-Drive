import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import AuthLayout from '../../components/AuthLayout';
// import { Checkbox } from '../../components/ui/Checkbox'; // REMOVED this import

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [rememberMe, setRememberMe] = useState(false); // No longer needed
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const role = await login(email, password);
      
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/user-dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back."
      description="Access your account to manage bookings, save favorites, and experience premium travel."
      imageSrc="https://images.unsplash.com/photo-1640682667803-3443da7bfd36?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      imageAlt="Sleek black luxury car interior dashboard"
    >
      <h2 className="text-2xl font-bold text-primary mb-2">
        Sign in to your account
      </h2>
      <p className="text-text-secondary mb-6">
        Please enter your details to continue.
      </p>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg p-3 mb-4 text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Email"
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Enter your email"
        />
        <Input
          label="Password"
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Enter your password"
        />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {/* FIXED: Removed 'focus:ring-primary' and added 'focus:ring-0' */}
            <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-0 focus:ring-offset-0" />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-text-secondary">
              Remember me
            </label>
          </div>
          <div className="text-sm">
            <a href="#" className="font-medium text-accent hover:text-accent/80">
              Forgot password?
            </a>
          </div>
        </div>

        <Button
          type="submit"
          variant="default"
          fullWidth
          size="lg"
          loading={loading}
          iconName="Lock"
          iconPosition="left"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-text-secondary">
        Don't have an account?{' '}
        <Link to="/register" className="font-medium text-accent hover:text-accent/80">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
};

export default LoginPage;