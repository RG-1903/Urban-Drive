import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const API_URL = 'http://localhost:8080/api/v1';

const AdminPostForm = ({ post, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    featuredImage: '',
    status: 'draft',
    tags: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isEditing = !!post;

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || '',
        content: post.content || '',
        featuredImage: post.featuredImage || '',
        status: post.status || 'draft',
        tags: Array.isArray(post.tags) ? post.tags.join(', ') : '',
      });
    }
  }, [post]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const postData = {
      ...formData,
      tags: formData.tags.split(',').map((tag) => tag.trim()).filter((tag) => tag),
    };

    try {
      let res;
      if (isEditing) {
        res = await axios.patch(`${API_URL}/posts/${post._id}`, postData);
        onSave(res.data.data.post, 'update');
      } else {
        res = await axios.post(`${API_URL}/posts`, postData);
        onSave(res.data.data.post, 'create');
      }
      onClose();
    } catch (err) {
      console.error('Failed to save post:', err);
      setError(err.response?.data?.message || 'Failed to save post.');
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-cinematic w-full max-w-2xl">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-primary">
            {isEditing ? 'Edit Post' : 'Create New Post'}
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

          <Input
            label="Post Title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            required
          />
          
          <Input
            label="Featured Image URL"
            value={formData.featuredImage}
            onChange={(e) => handleChange('featuredImage', e.target.value)}
          />

          <Input
            label="Content (Markdown supported)"
            type="textarea"
            value={formData.content}
            onChange={(e) => handleChange('content', e.target.value)}
            required
            className="min-h-[200px]"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Tags (comma-separated)"
              value={formData.tags}
              onChange={(e) => handleChange('tags', e.target.value)}
              placeholder="e.g., Travel, Luxury, Guide"
            />
            <Select
              label="Status"
              value={formData.status}
              onChange={(val) => handleChange('status', val)}
              options={statusOptions}
              required
            />
          </div>
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
            {isEditing ? 'Save Changes' : 'Create Post'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminPostForm;