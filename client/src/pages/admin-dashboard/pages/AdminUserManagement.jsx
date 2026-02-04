import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';
import AdminUserForm from '../components/AdminUserForm';

const API_URL = 'http://localhost:8080/api/v1';

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/users`);
        setUsers(res.data.data.users);
      } catch (err) {
        console.error('Failed to fetch users:', err);
        setError('Failed to load users. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const getRoleColor = (role) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-accent/10 text-accent';
      case 'user':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  };

  const handleOpenCreateModal = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSaveUser = (savedUser, action) => {
    if (action === 'create') {
      setUsers([savedUser, ...users]);
    } else {
      setUsers(users.map(u => (u._id === savedUser._id ? savedUser : u)));
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This is irreversible.')) {
      try {
        await axios.delete(`${API_URL}/users/${userId}`);
        setUsers(users.filter(u => u._id !== userId));
      } catch (err) {
        console.error('Failed to delete user:', err);
        setError('Failed to delete user.');
      }
    }
  };

  return (
    <>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                User Management
              </h1>
              <p className="text-gray-600">
                View, edit, or manage all registered users.
              </p>
            </div>
            <Button
              variant="default"
              iconName="UserPlus"
              iconPosition="left"
              onClick={handleOpenCreateModal}
            >
              Add New User
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Icon name="Loader2" className="animate-spin text-accent" size={48} />
            </div>
          ) : error ? (
            <div className="text-center text-destructive">{error}</div>
          ) : (
            <div className="bg-white rounded-xl border border-border shadow-cinematic overflow-hidden">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-secondary">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Member Since
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-secondary/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <Image
                            src={user.avatar}
                            alt={user.firstName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <div className="text-sm font-semibold text-primary">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-xs text-text-secondary">
                              ID: {user._id.slice(-6)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-primary">{user.email}</div>
                        <div className="text-xs text-text-secondary">
                          {user.phone || 'No phone'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(
                            user.role
                          )}`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-text-secondary">
                          {formatDate(user.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            iconName="Edit"
                            onClick={() => handleOpenEditModal(user)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            iconName="Trash2"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDelete(user._id)}
                            disabled={user.role === 'admin'}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <AdminUserForm
          user={editingUser}
          onSave={handleSaveUser}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default AdminUserManagement;