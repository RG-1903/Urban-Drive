import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
// import { useForm, Controller } from 'react-hook-form'; // <-- REMOVED
import axios from 'axios';
import ReactMarkdown from 'react-markdown'; // This will now work

import Icon from '../../components/AppIcon.jsx';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
// import Select from '../../components/ui/Select.jsx'; // <-- REMOVED
import { useAuth } from '../../context/AuthContext.jsx';
import { cn } from '../../lib/utils'; // 1. FIXED: Corrected import path
import AiChatSection from '../../components/AiChatSection.jsx';

const API_URL = 'http://localhost:8080/api/v1';

// --- Error Boundary ---
// This will catch any future rendering errors in a specific component.
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Component Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <div className="flex items-center gap-3 text-destructive">
            <Icon name="AlertTriangle" size={20} />
            <div>
              <h4 className="font-semibold">Something went wrong</h4>
              <p className="text-sm">Please refresh the page and try again.</p>
              <Button
                variant="destructive"
                size="sm"
                className="mt-2"
                onClick={() => {
                  if (this.props.onClearError) this.props.onClearError();
                  this.setState({ hasError: false, error: null });
                }}
              >
                Reset Component
              </Button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- Reusable Accordion Component ---
const AccordionItem = ({ title, content, isOpen, onClick }) => {
  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={onClick}
        className="flex justify-between items-center w-full py-5 text-left"
      >
        <span className="text-lg font-medium text-primary">{title}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Icon name="ChevronDown" size={20} className="text-text-secondary" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="pb-5 pr-10 text-text-secondary leading-relaxed">
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Child View: Support Home ---
const HomeSection = ({ setActiveView }) => {
  const navigate = useNavigate();

  const supportTopics = [
    { title: "Booking & Reservations", desc: "Get help with booking, modifying, or cancelling your rental.", icon: "Calendar", cta: "View FAQs", navTarget: 'faq' },
    { title: "Account & Payments", desc: "Manage your profile, payment methods, and view invoices.", icon: "User", cta: "Go to Account", navTarget: 'account' },
    { title: "Our Blog", desc: "Read our latest articles, travel guides, and company news.", icon: "BookOpen", cta: "Read Now", navTarget: 'blog' },
    { title: "AI Assistant", desc: "Get instant answers from our Urban AI.", icon: "Sparkles", cta: "Start Chat", navTarget: 'ai-chat' },
    { title: "Policies & Safety", desc: "Learn about our insurance, fees, and safety protocols.", icon: "Shield", cta: "View Policies", navTarget: 'policy' },
    { title: "Contact Us", desc: "Send us a message or find our contact details.", icon: "Mail", cta: "Get in Touch", navTarget: 'contact' },
  ];

  const handleNavClick = (target) => {
    if (target === 'account') {
      navigate('/user-dashboard');
    } else if (target === 'policy') {
      navigate('/privacy-policy');
    } else if (target === 'blog') { // <-- 1. ADD THIS ELSE IF
      navigate('/blog');
    } else {
      setActiveView(target);
    }
  };

  return (
    <motion.div
      key="home"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-3xl font-bold text-primary mb-8">
        Hi, how can we help?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {supportTopics.map((topic, i) => (
          <motion.div
            key={topic.title}
            custom={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className="bg-white rounded-2xl p-6 border border-border hover:shadow-premium transition-shadow duration-300 flex flex-col"
          >
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-5">
              <Icon name={topic.icon} size={24} className="text-accent" />
            </div>
            <h3 className="text-lg font-semibold text-primary mb-2">{topic.title}</h3>
            <p className="text-sm text-text-secondary mb-5 flex-1">{topic.desc}</p>
            {/* 2. UPDATE BUTTON BEHAVIOR */}
            {topic.navTarget === 'blog' ? (
              <Link to="/blog" className="w-full">
                <Button variant="outline" size="sm" fullWidth>
                  {topic.cta}
                </Button>
              </Link>
            ) : (
              <Button variant="outline" size="sm" onClick={() => handleNavClick(topic.navTarget)}>
                {topic.cta}
              </Button>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// --- Child View: FAQs ---
const FaqSection = ({ searchTerm, setSearchTerm, faqData }) => {
  const [openFaq, setOpenFaq] = useState(0);

  const filteredFaqData = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (!term) return faqData;
    return faqData.filter(faq =>
      faq.title.toLowerCase().includes(term) ||
      faq.content.toLowerCase().includes(term)
    );
  }, [searchTerm, faqData]);

  return (
    <motion.div
      key="faq"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-3xl font-bold text-primary mb-8">
        Frequently Asked Questions
      </h2>
      <div className="relative mb-8">
        <Input
          type="search"
          placeholder="Search questions... (e.g., 'cancellation')"
          className="h-12 pl-12 pr-5 text-base"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Icon name="Search" size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
      </div>
      <div className="bg-white rounded-2xl border border-border p-4 sm:p-8">
        {filteredFaqData.length > 0 ? (
          filteredFaqData.map((faq, index) => (
            <AccordionItem
              key={faq.title}
              title={faq.title}
              content={faq.content}
              isOpen={openFaq === index}
              onClick={() => setOpenFaq(openFaq === index ? null : index)}
            />
          ))
        ) : (
          <p className="text-center text-text-secondary py-4">
            No FAQs found matching your search.
          </p>
        )}
      </div>
    </motion.div>
  );
};

// --- *** NEW CHILD VIEW: BLOG (PLACEHOLDER) *** ---
const BlogSection = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        console.log('Fetching blogs from:', `${API_URL}/posts`);
        const res = await axios.get(`${API_URL}/posts`);
        console.log('Blog API Response:', res.data);

        // Match the structure used in the main blog page
        const blogData = res.data.data?.posts || [];
        console.log('Extracted blogs:', blogData);

        // Limit to 3 most recent posts
        setBlogs(blogData.slice(0, 3));
      } catch (err) {
        console.error('Failed to fetch blogs:', err);
        console.error('Error response:', err.response?.data);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <motion.div
        key="blog"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center py-20"
      >
        <Icon name="Loader2" size={48} className="animate-spin text-accent mx-auto" />
      </motion.div>
    );
  }

  return (
    <motion.div
      key="blog"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-primary">
          From the Blog
        </h2>
        <Button
          variant="outline"
          onClick={() => navigate('/blog')}
          iconName="ArrowRight"
          iconPosition="right"
        >
          View All
        </Button>
      </div>

      {blogs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border p-16 text-center">
          <Icon name="BookOpen" size={48} className="mx-auto mb-4 text-accent/30" strokeWidth={1} />
          <h3 className="text-2xl font-semibold text-primary mb-4">No Articles Yet</h3>
          <p className="text-text-secondary max-w-md mx-auto mb-6">
            We haven't published any blog posts yet. Check back soon for the latest articles,
            travel guides, and exclusive updates from the UrbanDrive team.
          </p>
          <Link to="/vehicle-search">
            <Button variant="default">
              Browse Vehicles
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => {
            // Ensure we have a featured image with fallback
            const featuredImage = blog.featuredImage || 'https://images.unsplash.com/photo-1554629947-334ff61d85dc';
            const author = blog.author || { firstName: 'UrbanDrive', lastName: 'Team' };

            return (
              <motion.div
                key={blog._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => navigate(`/blog/${blog.slug}`)}
              >
                <div className="aspect-video overflow-hidden bg-gray-100">
                  <img
                    src={featuredImage}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1554629947-334ff61d85dc';
                    }}
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full">
                      {blog.category || blog.tags?.[0] || 'Travel'}
                    </span>
                    <span className="text-xs text-text-secondary">
                      {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-primary mb-2 line-clamp-2 group-hover:text-accent transition-colors">
                    {blog.title}
                  </h3>
                  <p className="text-text-secondary text-sm line-clamp-2 mb-4">
                    {blog.excerpt || blog.content?.substring(0, 120) + '...'}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <Icon name="User" size={14} />
                    <span>{author.firstName} {author.lastName}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};
// --- *** END NEW VIEW *** ---


// --- Child View: AI Chat ---
// --- Child View: AI Chat ---
// Replaced with imported component
{/* <AiChatSection /> */ }

// --- *** CHILD VIEW: CONTACT (MODIFIED) *** ---
// We no longer need useForm, Controller, Select, or form submission logic
const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await axios.post(`${API_URL}/contact`, formData);
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      key="contact"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-3xl font-bold text-primary mb-8">
        Get in Touch
      </h2>

      {/* Contact Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-2xl p-8 border border-border shadow-premium">
          <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
            <Icon name="Mail" size={24} className="text-accent" />
          </div>
          <h4 className="text-xl font-semibold text-primary mb-2">Email Us</h4>
          <p className="text-text-secondary mb-4">Get a response within 24 hours.</p>
          <Button asChild variant="outline" className="w-full">
            <a href="mailto:support@urbandrive.com">
              support@urbandrive.com
            </a>
          </Button>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-border shadow-premium">
          <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
            <Icon name="Phone" size={24} className="text-accent" />
          </div>
          <h4 className="text-xl font-semibold text-primary mb-2">Call Us 24/7</h4>
          <p className="text-text-secondary mb-4">Available for urgent matters.</p>
          <Button asChild variant="outline" className="w-full">
            <a href="tel:+15551234567">
              +1 (555) 123-4567
            </a>
          </Button>
        </div>
      </div>

      {/* Contact Form */}
      <div className="bg-white rounded-2xl p-8 border border-border shadow-premium mb-8">
        <h3 className="text-2xl font-semibold text-primary mb-6">Send Us a Message</h3>

        {success && (
          <div className="mb-6 p-4 bg-success/10 border border-success/20 rounded-xl text-success flex items-center gap-3">
            <Icon name="CheckCircle" size={20} />
            <span>Message sent successfully! We'll get back to you soon.</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive flex items-center gap-3">
            <Icon name="AlertCircle" size={20} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Your Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="John Doe"
            />
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="john@example.com"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Phone Number"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 123-4567"
            />
            <Input
              label="Subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              placeholder="How can we help?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all resize-none"
              placeholder="Tell us more about your inquiry..."
            />
          </div>

          <Button
            type="submit"
            variant="default"
            size="lg"
            loading={loading}
            iconName="Send"
            iconPosition="right"
            className="w-full md:w-auto"
          >
            {loading ? 'Sending...' : 'Send Message'}
          </Button>
        </form>
      </div>

      {/* Map Section */}
      <div className="bg-white rounded-2xl p-8 border border-border shadow-premium">
        <h3 className="text-2xl font-semibold text-primary mb-6">Our Headquarters</h3>
        <p className="text-text-secondary mb-6">
          Visit us at our office in Surat, Gujarat, India
        </p>
        <div className="embed-map-responsive rounded-2xl overflow-hidden">
          <div className="embed-map-container">
            <iframe
              className="embed-map-frame"
              frameBorder="0"
              scrolling="no"
              marginHeight="0"
              marginWidth="0"
              src="https://maps.google.com/maps?width=600&height=400&hl=en&q=surat&t=&z=12&ie=UTF8&iwloc=B&output=embed"
              title="UrbanDrive Headquarters Location"
            />
          </div>
          <style>{`
            .embed-map-responsive {
              position: relative;
              text-align: right;
              width: 100%;
              height: 0;
              padding-bottom: 56.25%;
            }
            .embed-map-container {
              overflow: hidden;
              background: none !important;
              width: 100%;
              height: 100%;
              position: absolute;
              top: 0;
              left: 0;
            }
            .embed-map-frame {
              width: 100% !important;
              height: 100% !important;
              position: absolute;
              top: 0;
              left: 0;
            }
          `}</style>
        </div>
      </div>
    </motion.div>
  );
};

// --- Main Support Page Component ---
const SupportPage = () => {
  const [activeView, setActiveView] = useState('home');
  const [searchTerm, setSearchTerm] = useState('');
  const { user, isAuthenticated } = useAuth();

  const faqData = [
    { title: "How do I book a vehicle?", content: "You can book a vehicle by using the 'Book Now' button or by finding your desired car on the 'Vehicles' page. Follow the steps in our simple booking wizard, select your dates, choose any extras, and confirm your payment. You'll receive a confirmation email instantly." },
    { title: "What is the cancellation policy?", content: "We offer free cancellation up to 24 hours before your scheduled pickup time. Cancellations made within 24 hours of pickup may be subject to a fee. Please review our full Cancellation Policy page for more details." },
    { title: "What documents do I need to rent a car?", content: "You will need a valid driver's license, a major credit card in your name, and a secondary form of ID (like a passport, if you are an international renter). The driver's license must be valid for the entire rental period." },
    { title: "Can I add an additional driver?", content: "Yes, you can add additional drivers to your rental. This can be done during the booking process in the 'Extras' step or at the rental counter upon pickup. All additional drivers must be present with their valid driver's license." }
  ];

  // --- UPDATED SIDEBAR ---
  const sidebarNav = [
    { id: 'home', label: 'Support Home', icon: 'Home' },
    { id: 'faq', label: 'FAQs', icon: 'HelpCircle' },
    { id: 'blog', label: 'Blog', icon: 'BookOpen', auth: false }, // <-- ADDED
    { id: 'ai-chat', label: 'AI Assistant', icon: 'Sparkles', auth: true },
    { id: 'contact', label: 'Contact Us', icon: 'Mail', auth: false }, // <-- No auth needed
  ];
  // --- END UPDATE ---

  const handleNavClick = (view) => {
    if (view !== 'faq') {
      setSearchTerm('');
    }
    setActiveView(view);
  };

  // --- This function resets the chat history if the AI component crashes ---
  const handleAICrashClear = () => {
    console.error('AI Component crashed. Clearing chat history and resetting view.');
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        sessionStorage.removeItem('aiChatHistory');
      }
    } catch (error) {
      console.error('Failed to clear AI chat history after crash:', error);
    }
    // We set the view back to 'home' to force a full remount.
    setActiveView('home');
  };

  // --- UPDATED RENDERVIEW ---
  const renderView = () => {
    switch (activeView) {
      case 'home':
        return <HomeSection setActiveView={handleNavClick} />;
      case 'faq':
        return <FaqSection searchTerm={searchTerm} setSearchTerm={setSearchTerm} faqData={faqData} />;
      case 'blog': // <-- ADDED
        return <BlogSection />;
      case 'ai-chat':
        if (!isAuthenticated) {
          return (
            <div className="bg-white rounded-2xl p-6 border border-border">
              <h2 className="text-2xl font-semibold text-primary mb-2">Sign in to use the AI Assistant</h2>
              <p className="text-sm text-text-secondary mb-4">
                The AI support assistant is available for signed-in users so we can tailor help to your account and bookings.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center text-sm font-medium text-primary hover:underline"
              >
                Go to login
                <Icon name="ArrowRight" size={16} className="ml-1" />
              </Link>
            </div>
          );
        }
        return (
          <ErrorBoundary onClearError={handleAICrashClear}>
            <div className="rounded-2xl overflow-hidden">
              <AiChatSection />
            </div>
          </ErrorBoundary>
        );
      case 'contact':
        return <ContactSection />;
      default:
        return <HomeSection setActiveView={handleNavClick} />;
    }
  };
  // --- END UPDATE ---

  return (
    <div className="bg-secondary">

      {/* --- Hero Section --- */}
      <section className="bg-white border-b border-border relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-primary mb-4"
            >
              {isAuthenticated ? `Hello, ${user.firstName}.` : "Support Center"}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-text-secondary"
            >
              We're here to help with any questions you may have. Get answers, contact our team, or check the status of our services.
            </motion.p>
          </div>
        </div>
      </section>

      {/* --- Main Body --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* --- Left Sidebar Navigation --- */}
          <nav className="lg:w-64">
            <div className="sticky top-28 space-y-6">
              <div className="space-y-1">
                {sidebarNav.map((item) => {
                  if (item.auth && !isAuthenticated) return null;

                  const isActive = activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl font-medium text-left transition-colors ${isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-text-secondary hover:text-primary hover:bg-white'
                        }`}
                    >
                      <Icon name={item.icon} size={20} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* System Status in Sidebar */}
              <div className="bg-white rounded-2xl border border-border p-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 bg-success rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary">All Systems Good</p>
                    <p className="text-xs text-text-secondary">Services are operational.</p>
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {/* --- Right Content Area --- */}
          <main className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeView}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                {renderView()}
              </motion.div>
            </AnimatePresence>
          </main>

        </div>
      </div>
    </div>
  );
};

export default SupportPage;