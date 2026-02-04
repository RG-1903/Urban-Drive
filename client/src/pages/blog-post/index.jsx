import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import Button from '../../components/ui/Button';
import { motion } from 'framer-motion';

const API_URL = 'http://localhost:8080/api/v1';

// Image optimization helper
const optimizeImage = (url, width = 1200, quality = 80) => {
  if (!url) return '';
  
  if (url.includes('images.unsplash.com')) {
    try {
      const urlObj = new URL(url);
      urlObj.searchParams.set('w', width.toString());
      urlObj.searchParams.set('q', quality.toString());
      urlObj.searchParams.set('auto', 'format');
      urlObj.searchParams.set('fit', 'crop');
      return urlObj.toString();
    } catch (e) {
      console.error('Invalid URL for optimization:', e);
      return url; 
    }
  }
  return url;
};

const formatDate = (dateString) => {
  if (!dateString) return 'Unknown date';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const RelatedPosts = ({ currentPostId }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await axios.get(`${API_URL}/posts?limit=4`);
        const related = res.data.data.posts
          .filter(post => post._id !== currentPostId)
          .slice(0, 3);
        setPosts(related);
      } catch (err) {
        console.error("Failed to fetch related posts:", err);
      }
    };
    fetchRelated();
  }, [currentPostId]);

  if (posts.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-border shadow-premium p-6">
      <h3 className="text-xl font-bold text-primary mb-6">Keep Reading</h3>
      <div className="space-y-4">
        {posts.map((post) => {
          const author = post.author || { firstName: 'UrbanDrive', lastName: 'Team' };
          return (
            <Link
              key={post._id}
              to={`/blog/${post.slug}`}
              className="block group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-20 h-16 rounded-lg overflow-hidden flex-shrink-0 relative">
                  <Image
                    src={optimizeImage(post.featuredImage, 160, 75)}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    decoding="async"
                    sizes="80px"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-primary group-hover:text-accent transition-colors mb-1 line-clamp-2">
                    {post.title}
                  </h4>
                  <p className="text-xs text-text-secondary">
                    {author.firstName} {author.lastName}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

// --- Author Card (Sidebar) ---
const AuthorCard = ({ author, date }) => {
  // Handle different author data structures
  const getAuthorInfo = () => {
    if (!author) {
      return {
        firstName: 'UrbanDrive',
        lastName: 'Team',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face&q=80',
        role: 'UrbanDrive Team'
      };
    }

    // If author is a string
    if (typeof author === 'string') {
      const nameParts = author.split(' ');
      return {
        firstName: nameParts[0] || 'UrbanDrive',
        lastName: nameParts.slice(1).join(' ') || 'Team',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face&q=80',
        role: 'UrbanDrive Team'
      };
    }

    // If author is an object
    return {
      firstName: author.firstName || 'UrbanDrive',
      lastName: author.lastName || 'Team',
      avatar: author.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face&q=80',
      role: 'UrbanDrive Team'
    };
  };

  const authorInfo = getAuthorInfo();

  // Ensure we have a valid avatar URL
  const getAvatarUrl = () => {
    if (!authorInfo.avatar) {
      return 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face&q=80';
    }
    
    if (authorInfo.avatar.startsWith('http')) {
      return optimizeImage(authorInfo.avatar, 128, 80);
    }
    
    return `${API_URL}${authorInfo.avatar.startsWith('/') ? '' : '/'}${authorInfo.avatar}`;
  };

  const avatarUrl = getAvatarUrl();

  return (
    <div className="bg-white rounded-2xl border border-border shadow-premium p-6">
      <h3 className="text-xl font-bold text-primary mb-6">About the Author</h3>
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 bg-gray-200 border border-border">
          <Image
            src={avatarUrl}
            alt={`${authorInfo.firstName} ${authorInfo.lastName}`}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
            sizes="64px"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face&q=80';
            }}
          />
        </div>
        <div>
          <h4 className="text-lg font-semibold text-primary">
            {authorInfo.firstName} {authorInfo.lastName}
          </h4>
          <p className="text-sm text-text-secondary">{authorInfo.role}</p>
        </div>
      </div>
      <p className="text-sm text-text-secondary mb-4">
        The official UrbanDrive team, bringing you the latest in luxury travel, vehicle insights, and company news.
      </p>
      <div className="text-sm text-text-secondary border-t border-border pt-4">
        <p><strong>Published on:</strong> {formatDate(date)}</p>
      </div>
    </div>
  );
};

// --- Share Buttons (Sidebar) ---
const ShareButtons = ({ postTitle, postUrl, authorSocialLinks = {} }) => {
  const currentUrl = encodeURIComponent(postUrl || window.location.href);
  const titleEncoded = encodeURIComponent(postTitle || document.title);
  const [copied, setCopied] = useState(false);

  const socialActions = [
    {
      name: 'Instagram',
      icon: 'Instagram',
      action: () => {
        const instaUrl = authorSocialLinks.instagram || 'https://instagram.com/urbandrive';
        window.open(instaUrl, '_blank');
      }
    },
    {
      name: 'Facebook',
      icon: 'Facebook',
      action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}&quote=${titleEncoded}`, '_blank')
    },
    {
      name: 'Linkedin',
      icon: 'Linkedin',
      action: () => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${currentUrl}&title=${titleEncoded}`, '_blank')
    },
    {
      name: copied ? 'Copied!' : 'Copy Link',
      icon: copied ? 'Check' : 'Link',
      action: () => {
        navigator.clipboard.writeText(decodeURIComponent(currentUrl))
          .then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          })
          .catch(err => {
            console.error('Failed to copy: ', err);
            const textArea = document.createElement('textarea');
            textArea.value = decodeURIComponent(currentUrl);
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          });
      }
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-border shadow-premium p-6">
      <h3 className="text-xl font-bold text-primary mb-6">Share This Post</h3>
      <div className="grid grid-cols-2 gap-3">
        {socialActions.map(item => (
          <button
            key={item.name}
            onClick={item.action}
            className={`flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg transition-all duration-200 min-h-[44px] whitespace-nowrap overflow-hidden ${
              item.name === 'Copied!' 
                ? 'border-green-500 bg-green-50 text-green-700' 
                : 'border-border hover:bg-secondary'
            }`}
          >
            <Icon 
              name={item.icon} 
              size={16} 
              className="flex-shrink-0" 
              strokeWidth={item.name === 'Copied!' ? 2.5 : 2}
            />
            <span className="truncate">{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      setPost(null);
      try {
        const res = await axios.get(`${API_URL}/posts/${slug}`);
        setPost(res.data.data.post);
        document.title = `UrbanDrive - ${res.data.data.post.title}`;
      } catch (err) {
        console.error('Failed to fetch post:', err);
        setError('Could not find the requested post.');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary">
        <Icon name="Loader2" className="animate-spin text-accent" size={48} />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary text-center p-4">
        <div>
          <Icon name="SearchX" size={48} className="mx-auto mb-4 text-accent/30" strokeWidth={1} />
          <h1 className="text-3xl font-bold text-primary mb-4">{error || 'Post Not Found'}</h1>
          <p className="text-text-secondary mb-6">The post you are looking for might have been moved or deleted.</p>
          <Link to="/blog">
            <Button variant="default">Back to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  const tags = post.tags || [];
  const content = post.content || 'No content available for this post.';
  
  // Better author data handling
  const getAuthorData = () => {
    if (!post.author) {
      return {
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face&q=80',
        firstName: 'UrbanDrive',
        lastName: 'Team',
        socialLinks: { instagram: 'https://instagram.com/urbandrive' }
      };
    }

    if (typeof post.author === 'string') {
      const nameParts = post.author.split(' ');
      return {
        firstName: nameParts[0] || 'UrbanDrive',
        lastName: nameParts.slice(1).join(' ') || 'Team',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face&q=80',
        socialLinks: { instagram: 'https://instagram.com/urbandrive' }
      };
    }

    return {
      avatar: post.author.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face&q=80',
      firstName: post.author.firstName || 'UrbanDrive',
      lastName: post.author.lastName || 'Team',
      socialLinks: post.author.socialLinks || { instagram: 'https://instagram.com/urbandrive' }
    };
  };

  const author = getAuthorData();
  const featuredImage = post.featuredImage || 'https://images.unsplash.com/photo-1554629947-334ff61d85dc?w=1200&h=600&fit=crop&q=80';
  const title = post.title || 'Untitled Post';
  
  const postUrl = `${window.location.origin}/blog/${post.slug}`;

  return (
    <div className="bg-secondary" key={slug}>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-3 space-y-8"
          >
            <div className="bg-white rounded-2xl border border-border shadow-premium overflow-hidden">
              
              <div className="w-full h-[400px] md:h-[500px] lg:h-[600px] relative overflow-hidden">
                <Image
                  src={optimizeImage(featuredImage, 1200, 90)}
                  alt={title}
                  className="w-full h-full object-cover"
                  loading="eager"
                  decoding="sync"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                />
              </div>

              <div className="p-8 md:p-12">
                {/* Styled tags */}
                <div className="mb-6 flex flex-wrap gap-3">
                  {tags.map((tag, i) => (
                    <span key={i} className="inline-block bg-accent/10 text-accent text-sm font-medium px-4 py-2 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold font-accent text-primary mb-6">
                  {title}
                </h1>

                {/* Author info in main content */}
                <div className="flex items-center space-x-4 border-t border-b border-border py-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-200 border border-border">
                    <Image
                      src={optimizeImage(author.avatar, 96, 80)}
                      alt={author.firstName}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                      sizes="48px"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face&q=80';
                      }}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary">
                      {author.firstName} {author.lastName}
                    </p>
                    <p className="text-sm text-text-secondary">
                      Published on {formatDate(post.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <article className="bg-white rounded-2xl border border-border shadow-premium p-8 md:p-12">
              <div className="prose prose-lg prose-slate max-w-none">
                <ReactMarkdown
                  components={{
                    img: ({ node, ...props }) => (
                      <img
                        {...props}
                        loading="lazy"
                        decoding="async"
                        className="rounded-lg shadow-md"
                        style={{ imageRendering: 'auto' }}
                      />
                    ),
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>
            </article>

          </motion.div>

          <aside className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="sticky top-28 space-y-8"
            >
              <AuthorCard author={author} date={post.createdAt} />
              <ShareButtons
                postTitle={post.title}
                postUrl={postUrl}
                authorSocialLinks={author.socialLinks}
              />
              <RelatedPosts currentPostId={post._id} />
            </motion.div>
          </aside>
          
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 pt-12 border-t border-border text-center"
        >
          <Link to="/blog">
            <Button variant="default" size="lg" iconName="ArrowLeft" iconPosition="left">
              Back to All Posts
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default BlogPostPage;