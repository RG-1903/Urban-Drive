import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Image from '../../components/AppImage';
import { motion } from 'framer-motion';

const API_URL = 'http://localhost:8080/api/v1';

const stripMarkdown = (text) => {
  if (!text) return '';
  return text
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    .replace(/!\[(.*?)\]\((.*?)\)/g, '')
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    .replace(/#{1,6}\s/g, '')
    .replace(/\n/g, ' ')
    .replace(/<[^>]*>?/g, '')
    .replace(/`{1,3}(.*?)`{1,3}/g, '$1')
    .replace(/(\r\n|\n|\r)/gm, " ")
    .replace(/\s+/g, ' ')
    .trim();
};

const PostCard = ({ post, index }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const tags = post.tags || [];
  const content = post.content || 'No content available.';
  const description = stripMarkdown(content);
  
  const author = post.author || {
    avatar: 'https://img.rocket.new/generatedImages/rocket_gen_img_1317ce20a-1762248863496.png',
    firstName: 'UrbanDrive',
    lastName: 'Team'
  };
  const featuredImage = post.featuredImage || 'https://images.unsplash.com/photo-1554629947-334ff61d85dc';
  const title = post.title || 'Untitled Post';

  const postVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      variants={postVariants}
      className="group bg-white rounded-2xl shadow-premium hover:shadow-cinematic border border-border transition-all duration-300 overflow-hidden flex flex-col"
    >
      <Link to={`/blog/${post.slug}`} className="block overflow-hidden aspect-[16/10]">
        <Image
          src={featuredImage}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </Link>
      
      <div className="p-6 flex flex-col flex-1">
        
        <div className="mb-4 flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <span key={i} className="inline-block bg-accent/10 text-accent text-xs font-medium px-3 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
        
        <h2 className="text-xl font-bold text-primary mb-3">
          <Link to={`/blog/${post.slug}`} className="hover:text-accent transition-colors">
            {title}
          </Link>
        </h2>
        
        <p className="text-text-secondary text-sm line-clamp-3 flex-1">
          {description}
        </p>
        
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* FIXED: Wrapped Image in a sized, circular div */}
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={author.avatar}
                  alt={author.firstName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-primary">
                  {author.firstName} {author.lastName}
                </p>
                <p className="text-xs text-text-secondary">
                  {formatDate(post.createdAt)}
                </p>
              </div>
            </div>
            
            <Link to={`/blog/${post.slug}`}>
              <Button variant="outline" size="sm" iconName="ArrowRight" iconPosition="right">
                Read
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = 'UrbanDrive - Blog';
    
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/posts`);
        setPosts(res.data.data.posts);
      } catch (err) {
        console.error('Failed to fetch posts:', err);
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="bg-secondary">
      <section className="bg-white border-b border-border py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold text-primary font-accent mb-4"
          >
            UrbanDrive Blog
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-text-secondary max-w-2xl mx-auto"
          >
            Get the latest travel guides, luxury car insights, and company news from the UrbanDrive team.
          </motion.p>
        </div>
      </section>
      
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Icon name="Loader2" className="animate-spin text-accent" size={48} />
            </div>
          ) : error ? (
            <div className="text-center text-destructive p-8 bg-white rounded-xl shadow-premium">
              <Icon name="AlertTriangle" size={40} className="mx-auto mb-4" />
              <p>{error}</p>
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              animate="visible"
            >
              {posts.map((post, index) => (
                <PostCard key={post._id} post={post} index={index} />
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BlogPage;