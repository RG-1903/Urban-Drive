import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import AuthLayout from '../../components/AuthLayout'; // Import the new layout
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    passwordConfirm: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.passwordConfirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${API_URL}/auth/signup`, formData);
      
      await login(formData.email, formData.password);
      
      navigate('/user-dashboard');
    } catch (err) { // FIXED: Removed typo from catch block
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Your next journey begins here."
      description="Create an account to manage bookings, save favorites, and experience premium travel."
      imageSrc="https://images.unsplash.com/photo-1689581919710-9e198837536a?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      imageAlt="Exterior side view of a white luxury SUV"
    >
      <h2 className="text-2xl font-bold text-primary mb-2">
        Create your account
      </h2>
      <p className="text-text-secondary mb-6">
        Get started with UrbanDrive today.
      </p>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg p-3 mb-4 text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            id="firstName"
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            required
          />
          <Input
            label="Last Name"
            id="lastName"
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            required
          />
        </div>

        <Input
          label="Email"
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          required
        />
        
        <Input
          label="Phone Number (Optional)"
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
        />

        <Input
          label="Password"
          id="password"
          type="password"
          value={formData.password}
          // FIXED: Corrected 'e.targ_et.value' to 'e.target.value'
          onChange={(e) => handleInputChange('password', e.target.value)}
          required
          description="Must be at least 8 characters long."
        />
        
        <Input
          label="Confirm Password"
          id="passwordConfirm"
          type="password"
          value={formData.passwordConfirm}
          onChange={(e) => handleInputChange('passwordConfirm', e.target.value)}
          required
        />

        <Button
          type="submit"
          variant="default"
          fullWidth
          size="lg"
          loading={loading}
          iconName="UserPlus"
          iconPosition="left"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-text-secondary">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-accent hover:text-accent/80">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
};

export default RegisterPage;