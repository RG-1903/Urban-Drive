import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import axios from 'axios';
import { API_URL } from '../../../utils/config';

const AccountSettings = ({ user, onUpdateProfile }) => {
  const [activeSection, setActiveSection] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    phone: user.phone || '',
    dateOfBirth: user.dateOfBirth || '',
    address: user.address || ''
  });

  // New states for other sections

  const [notifications, setNotifications] = useState(user.notifications || { email: true, sms: false, marketing: true });
  const [documents, setDocuments] = useState(user.documents || []);
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});

  // ... (existing code) ...

  // --- Privacy/Password Handlers ---
  const validatePasswordForm = () => {
    const newErrors = {};
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }
    if (!passwordData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }
    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangePassword = async () => {
    if (!validatePasswordForm()) return;

    try {
      await axios.patch(`${API_URL}/users/updateMyPassword`, {
        passwordCurrent: passwordData.currentPassword,
        password: passwordData.newPassword,
        passwordConfirm: passwordData.confirmPassword
      });
      alert("Password updated successfully!");
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setErrors({});
    } catch (err) {
      console.error("Failed to update password", err);
      // Handle backend errors (e.g., wrong current password)
      if (err.response?.data?.message?.includes('current password')) {
        setErrors(prev => ({ ...prev, currentPassword: err.response.data.message }));
      } else {
        alert(err.response?.data?.message || "Failed to update password");
      }
    }
  };


  const fileInputRef = React.useRef(null);
  const [uploading, setUploading] = useState(false);
  const [updatingDocId, setUpdatingDocId] = useState(null);

  const sections = [
    { id: 'profile', label: 'Profile', icon: 'User' },

    { id: 'notifications', label: 'Notifications', icon: 'Bell' },
    { id: 'privacy', label: 'Privacy', icon: 'Shield' },
    { id: 'documents', label: 'Documents', icon: 'FileText' }
  ];

  useEffect(() => {
    // Sync local state if user prop updates

    setNotifications(user.notifications || { email: true, sms: false, marketing: true });
    setDocuments(user.documents || []);
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);

    // Filter out empty strings to avoid validation errors or overwriting with empty data
    const cleanData = Object.entries(formData).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});

    const success = await onUpdateProfile(cleanData);
    if (success) {
      setIsEditing(false);
    }
    setLoading(false);
  };

  const handleCancelProfile = () => {
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || '',
      dateOfBirth: user.dateOfBirth || '',
      address: user.address || ''
    });
    setIsEditing(false);
  };



  // --- Notification Handlers ---
  const handleToggleNotification = async (key) => {
    const newPrefs = { ...notifications, [key]: !notifications[key] };
    setNotifications(newPrefs); // Optimistic update
    try {
      await axios.patch(`${API_URL}/users/notifications`, newPrefs);
    } catch (err) {
      console.error("Failed to update notifications", err);
      setNotifications(notifications); // Revert on error
    }
  };

  // --- Document Handlers ---
  const handleUploadClick = () => {
    setUpdatingDocId(null); // Ensure we are in create mode
    fileInputRef.current.click();
  };

  const handleUpdateClick = (docId) => {
    setUpdatingDocId(docId);
    fileInputRef.current.click();
  };

  const handleDeleteDocument = async (docId) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;
    try {
      const res = await axios.delete(`${API_URL}/users/documents/${docId}`);
      setDocuments(res.data.data.documents);
    } catch (err) {
      console.error("Failed to delete document", err);
      alert(err.response?.data?.message || "Failed to delete document");
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    // Only append type if creating new, or if we want to allow updating type (which we don't have UI for yet)
    if (!updatingDocId) {
      formData.append('type', 'License'); // Defaulting to License for now
    }

    setUploading(true);
    try {
      const token = sessionStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      };

      let res;
      if (updatingDocId) {
        res = await axios.patch(`${API_URL}/users/documents/${updatingDocId}`, formData, config);
        alert('Document updated successfully!');
      } else {
        res = await axios.post(`${API_URL}/users/documents`, formData, config);
        alert('Document uploaded successfully!');
      }

      setDocuments(res.data.data.documents);
    } catch (err) {
      console.error("Failed to upload/update document", err);
      alert(err.response?.data?.message || "Failed to upload/update document");
    } finally {
      setUploading(false);
      setUpdatingDocId(null);
      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // --- Privacy/Password Handlers ---


  return (
    <div className="bg-card rounded-3xl p-8 shadow-cinematic border border-border/50">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-card-foreground tracking-tight">Account Settings</h2>
        {activeSection === 'profile' && (
          <div className="flex gap-3">
            {isEditing && (
              <Button
                variant="ghost"
                size="sm"
                iconName="X"
                iconPosition="left"
                onClick={handleCancelProfile}
                disabled={loading}
                className="rounded-full hover:bg-destructive/10 hover:text-destructive"
              >
                Cancel
              </Button>
            )}
            <Button
              variant={isEditing ? "default" : "secondary"}
              size="sm"
              iconName={isEditing ? "Check" : "Edit"}
              iconPosition="left"
              onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
              loading={loading}
              className="rounded-full px-6"
            >
              {isEditing ? (loading ? "Saving..." : "Save Changes") : "Edit Profile"}
            </Button>
          </div>
        )}
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-72 flex-shrink-0">
          <nav className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-left transition-all duration-300 group ${activeSection === section.id
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]'
                  : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                  }`}
              >
                <div className={`p-2 rounded-xl transition-colors ${activeSection === section.id ? 'bg-white/20' : 'bg-secondary group-hover:bg-white'}`}>
                  <Icon name={section.icon} size={20} />
                </div>
                <span className="font-semibold tracking-wide">{section.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1 min-w-0">
          {activeSection === 'profile' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="First Name"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  disabled={!isEditing}
                  className="rounded-xl bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300"
                />
                <Input
                  label="Last Name"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  disabled={!isEditing}
                  className="rounded-xl bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300"
                />
              </div>

              <Input
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={!isEditing}
                className="rounded-xl bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Phone Number"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={!isEditing}
                  className="rounded-xl bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300"
                />
                <Input
                  label="Date of Birth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  disabled={!isEditing}
                  className="rounded-xl bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300"
                />
              </div>

              <Input
                label="Address"
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                disabled={!isEditing}
                className="rounded-xl bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300"
              />
            </div>
          )}



          {activeSection === 'notifications' && (
            <div className="space-y-8 animate-fade-in">
              <h3 className="text-xl font-bold text-card-foreground">Notification Preferences</h3>
              <div className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-5 bg-card hover:bg-secondary/20 rounded-2xl border border-border/50 transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-2xl ${value ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                        <Icon name={key === 'email' ? 'Mail' : key === 'sms' ? 'MessageSquare' : 'Megaphone'} size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground capitalize text-lg">{key} Updates</h4>
                        <p className="text-sm text-muted-foreground font-medium">Receive updates via {key}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleNotification(key)}
                      className={`w-14 h-8 rounded-full transition-all duration-300 relative focus:outline-none focus:ring-2 focus:ring-primary/20 ${value ? 'bg-green-500 shadow-lg shadow-green-500/30' : 'bg-secondary-foreground/20'}`}
                    >
                      <span className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-300 ${value ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'documents' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-card-foreground">My Documents</h3>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*,application/pdf"
                />
                {documents.length === 0 && (
                  <Button
                    onClick={handleUploadClick}
                    variant="outline"
                    size="sm"
                    iconName="Upload"
                    iconPosition="left"
                    className="rounded-full"
                    loading={uploading}
                  >
                    {uploading ? 'Uploading...' : 'Upload New'}
                  </Button>
                )}
              </div>
              <div className="grid gap-4">
                {documents.length === 0 && (
                  <div className="text-center py-12 bg-secondary/30 rounded-3xl border border-dashed border-border">
                    <Icon name="FileText" size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
                    <p className="text-muted-foreground font-medium">No documents uploaded.</p>
                  </div>
                )}
                {documents.map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-5 bg-card hover:bg-secondary/20 rounded-2xl border border-border/50 transition-all duration-300 hover:shadow-md">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                        <Icon name="FileText" size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-lg">{doc.type}</h4>
                        <p className="text-sm text-muted-foreground font-medium">Uploaded on {new Date(doc.uploadedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${doc.status === 'Verified' ? 'bg-green-100 text-green-700' :
                        doc.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                        {doc.status}
                      </span>
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-muted-foreground hover:text-primary transition-colors"
                        title="View Document"
                      >
                        <Icon name="Eye" size={20} />
                      </a>
                      <button
                        onClick={() => handleUpdateClick(doc._id)}
                        className="p-2 text-muted-foreground hover:text-blue-600 transition-colors"
                        title="Update Document"
                      >
                        <Icon name="RefreshCw" size={20} />
                      </button>
                      <button
                        onClick={() => handleDeleteDocument(doc._id)}
                        className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                        title="Delete Document"
                      >
                        <Icon name="Trash2" size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'privacy' && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h3 className="text-2xl font-bold text-foreground tracking-tight mb-2">Change Password</h3>
                <p className="text-muted-foreground">Ensure your account stays secure by updating your password periodically.</p>
              </div>

              <div className="space-y-6 max-w-xl bg-gradient-to-br from-card to-secondary/5 p-8 rounded-3xl border border-border/50 shadow-lg">
                <div>
                  <Input
                    label="Current Password"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => {
                      setPasswordData({ ...passwordData, currentPassword: e.target.value });
                      if (errors.currentPassword) setErrors(prev => ({ ...prev, currentPassword: '' }));
                    }}
                    className={`rounded-xl bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300 ${errors.currentPassword ? 'border-destructive focus:border-destructive focus:ring-destructive/20' : ''}`}
                  />
                  {errors.currentPassword && <p className="text-sm text-destructive mt-1 ml-1">{errors.currentPassword}</p>}
                </div>

                <div className="h-px bg-border/50 my-2" />

                <div>
                  <Input
                    label="New Password"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => {
                      setPasswordData({ ...passwordData, newPassword: e.target.value });
                      if (errors.newPassword) setErrors(prev => ({ ...prev, newPassword: '' }));
                    }}
                    className={`rounded-xl bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300 ${errors.newPassword ? 'border-destructive focus:border-destructive focus:ring-destructive/20' : ''}`}
                  />
                  {errors.newPassword && <p className="text-sm text-destructive mt-1 ml-1">{errors.newPassword}</p>}
                </div>

                <div>
                  <Input
                    label="Confirm New Password"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => {
                      setPasswordData({ ...passwordData, confirmPassword: e.target.value });
                      if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' }));
                    }}
                    className={`rounded-xl bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300 ${errors.confirmPassword ? 'border-destructive focus:border-destructive focus:ring-destructive/20' : ''}`}
                  />
                  {errors.confirmPassword && <p className="text-sm text-destructive mt-1 ml-1">{errors.confirmPassword}</p>}
                </div>

                <div className="pt-6">
                  <Button
                    onClick={handleChangePassword}
                    className="w-full rounded-xl py-6 text-lg font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300"
                  >
                    Update Password
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;