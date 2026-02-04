import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const API_URL = 'http://localhost:8080/api/v1';

const AdminUserForm = ({ user, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'user',
    password: '',
    passwordConfirm: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isEditing = !!user;

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || 'user',
        password: '',
        passwordConfirm: '',
      });
    }
  }, [user]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!isEditing && formData.password !== formData.passwordConfirm) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      let res;
      if (isEditing) {
        const updateData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
        };
        res = await axios.patch(`${API_URL}/users/${user._id}`, updateData);
        onSave(res.data.data.user, 'update');
      } else {
        res = await axios.post(`${API_URL}/users/create`, formData);
        onSave(res.data.data.user, 'create');
      }
      onClose();
    } catch (err) {
      console.error('Failed to save user:', err);
      setError(err.response?.data?.message || 'Failed to save user.');
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: 'user', label: 'User' },
    { value: 'admin', label: 'Admin' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-cinematic w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-primary">
            {isEditing ? 'Edit User' : 'Add New User'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              required
            />
            <Input
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              required
            />
          </div>
          
          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            required
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Phone"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
            <Select
              label="Role"
              value={formData.role}
              onChange={(val) => handleChange('role', val)}
              options={roleOptions}
              required
            />
          </div>

          {!isEditing && (
            <>
              <Input
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                required
              />
              <Input
                label="Confirm Password"
                type="password"
                value={formData.passwordConfirm}
                onChange={(e) => handleChange('passwordConfirm', e.target.value)}
                required
              />
            </>
          )}
        </form>

        <div className="flex items-center justify-end p-6 border-t border-border">
          <Button variant="outline" onClick={onClose} className="mr-2">
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleSubmit}
            loading={loading}
          >
            {isEditing ? 'Save Changes' : 'Create User'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminUserForm;