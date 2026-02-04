import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';
import AdminPostForm from '../components/AdminPostForm';
import { useAuth } from '../../../context/AuthContext';

const API_URL = 'http://localhost:8080/api/v1';

const AdminBlogManagement = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const { user } = useAuth(); // Get admin user info for author

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        // Use the admin route to get drafts and published posts
        const res = await axios.get(`${API_URL}/posts/admin/all`);
        setPosts(res.data.data.posts);
      } catch (err) {
        console.error('Failed to fetch posts:', err);
        setError('Failed to load posts. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'published':
        return 'bg-success/10 text-success';
      case 'draft':
        return 'bg-warning/10 text-warning';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleOpenCreateModal = () => {
    setEditingPost(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (post) => {
    setEditingPost(post);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPost(null);
  };

  const handleSavePost = (savedPost, action) => {
    if (action === 'create') {
      // Add author info manually since create response doesn't populate
      const postWithAuthor = { ...savedPost, author: { ...user } };
      setPosts([postWithAuthor, ...posts]);
    } else {
      setPosts(posts.map(p => (p._id === savedPost._id ? savedPost : p)));
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axios.delete(`${API_URL}/posts/${postId}`);
        setPosts(posts.filter(p => p._id !== postId));
      } catch (err) {
        console.error('Failed to delete post:', err);
        setError('Failed to delete post.');
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
                Blog Management
              </h1>
              <p className="text-gray-600">
                Create, edit, and manage all blog posts.
              </p>
            </div>
            <Button
              variant="default"
              iconName="Plus"
              iconPosition="left"
              onClick={handleOpenCreateModal}
            >
              Add New Post
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
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {posts.map((post) => (
                    <tr key={post._id} className="hover:bg-secondary/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="w-16 h-10 rounded-md overflow-hidden flex-shrink-0">
                            <Image
                              src={post.featuredImage}
                              alt={post.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-primary">
                              {post.title}
                            </div>
                            <div className="text-xs text-text-secondary">
                              {post.tags.join(', ')}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                         <div className="text-sm font-medium text-primary">
                          {post.author?.firstName || 'Admin'} {post.author?.lastName || ''}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            post.status
                          )}`}
                        >
                          {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-text-secondary">
                          {formatDate(post.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            iconName="Edit"
                            onClick={() => handleOpenEditModal(post)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            iconName="Trash2"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDelete(post._id)}
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
        <AdminPostForm
          post={editingPost}
          onSave={handleSavePost}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default AdminBlogManagement;