import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../components/AppIcon';
import { cn } from '../../lib/utils'; // 1. FIXED: Corrected import path
import AppImage from '../../components/AppImage'; // Keep import for other potential images

// --- Reusable, Styled Policy Section ---
const PolicySection = ({ title, id, children }) => (
  <div className="mb-12" id={id}>
    <h2 className="text-3xl font-accent font-bold text-primary mb-6 border-b border-border pb-4">
      {title}
    </h2>
    {/* We add the 'prose' class here. This is a powerful Tailwind utility 
      that automatically styles all nested <p>, <ul>, and <a> tags 
      for beautiful, readable typography.
    */}
    <div className="space-y-5 text-text-secondary text-base leading-relaxed prose prose-slate max-w-none">
      {children}
    </div>
  </div>
);

// --- Reusable, Styled List Item ---
const StyledListItem = ({ children }) => (
  <li className="flex items-start !my-2">
    <Icon name="CheckCircle" size={20} className="text-accent flex-shrink-0 mr-3 mt-1" />
    <span>{children}</span>
  </li>
);

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState('introduction');

  const navigationLinks = [
    { id: 'introduction', title: '1. Introduction' },
    { id: 'information-we-collect', title: '2. Information We Collect' },
    { id: 'how-we-use-information', title: '3. How We Use Information' },
    { id: 'how-we-share-information', title: '4. How We Share Information' },
    { id: 'your-rights', title: '5. Your Rights' },
    { id: 'contact-us', title: '6. Contact Us' },
  ];

  // --- Smooth scroll functionality ---
  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    setActiveSection(targetId);
    const element = document.getElementById(targetId);
    if (element) {
      // Calculate offset for the sticky header
      const headerOffset = 100; // 80px for header + 20px breathing room
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // --- Sticky sidebar active state ---
  useEffect(() => {
    const handleScroll = () => {
      let current = 'introduction';
      for (const link of navigationLinks) {
        const element = document.getElementById(link.id);
        if (element && element.getBoundingClientRect().top < 120) {
          current = link.id;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navigationLinks]);

  return (
    <div className="bg-background">
      {/* --- Hero Section --- */}
      {/* FIXED: Removed the broken AppImage component. 
          The 'bg-primary' class provides a clean, dark background. 
      */}
      <section className="relative bg-primary border-b border-border overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl text-white">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 mb-6 border border-white/20"
            >
              <Icon name="Shield" size={16} />
              <span className="text-sm font-medium">Legal & Compliance</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl font-bold font-accent mb-4"
            >
              Privacy Policy
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-white/80"
            >
              Your trust is our priority. Here’s how we protect your information.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-sm text-white/60 mt-4"
            >
              Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </motion.p>
          </div>
        </div>
      </section>

      {/* --- Main Body --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-16">

          {/* --- Left Sidebar Navigation --- */}
          <nav className="lg:w-64">
            <div className="sticky top-28 space-y-6">
              <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
                Table of Contents
              </h3>
              <div className="space-y-1">
                {navigationLinks.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => handleNavClick(e, item.id)}
                    className={cn(
                      "flex items-center space-x-3 w-full px-4 py-3 rounded-2xl font-medium text-left transition-colors",
                      activeSection === item.id
                        ? "bg-accent text-accent-foreground"
                        : "text-text-secondary hover:text-primary hover:bg-secondary"
                    )}
                  >
                    <span>{item.title}</span>
                  </a>
                ))}
              </div>
            </div>
          </nav>

          {/* --- Right Content Area --- */}
          <main className="flex-1 min-w-0 bg-card p-8 sm:p-12 rounded-2xl border border-border shadow-cinematic">
            <PolicySection title="1. Introduction" id="introduction">
              <p>
                Welcome to UrbanDrive ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice or our practices with regard to your personal information, please contact us.
              </p>
              <p>
                This privacy notice describes how we might use your information if you:
              </p>
              <ul className="space-y-2">
                <StyledListItem>Visit our website at {window.location.origin}</StyledListItem>
                <StyledListItem>Engage with us in other related ways, including any sales, marketing, or events</StyledListItem>
              </ul>
              <p>
                In this privacy notice, if we refer to "Website," we are referring to any website of ours that references or links to this policy; "Services" includes our Website and other related services.
              </p>
            </PolicySection>

            <PolicySection title="2. Information We Collect" id="information-we-collect">
              <p>
                We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and services, when you participate in activities on the Services, or otherwise when you contact us.
              </p>
              <p>
                The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make, and the products and features you use. The personal information we collect may include the following:
              </p>
              <ul className="space-y-2">
                <StyledListItem><strong>Personal Information:</strong> Name, phone number, email address, mailing address, date of birth, and driver's license information.</StyledListItem>
                <StyledListItem><strong>Payment Data:</strong> We may collect data necessary to process your payment if you make purchases, such as your payment instrument number (e.g., a credit card number), and the security code associated with your payment instrument.</StyledListItem>
                <StyledListItem><strong>Account Data:</strong> Usernames, passwords, password hints, and other similar security information used for authentication and account access.</StyledListItem>
              </ul>
            </PolicySection>

            <PolicySection title="3. How We Use Information" id="how-we-use-information">
              <p>
                We use personal information collected via our Services for a variety of business purposes described below.
              </p>
              <ul className="space-y-2">
                <StyledListItem>To facilitate account creation and the login process.</StyledListItem>
                <StyledListItem>To manage your bookings and provide our rental services.</StyledListItem>
                <StyledListItem>To process your payments and prevent fraudulent transactions.</StyledListItem>
                <StyledListItem>To send administrative information to you.</StyledListItem>
                <StyledListItem>To respond to your inquiries and solve any potential issues you might have with the use of our Services.</StyledListItem>
              </ul>
            </PolicySection>

            <PolicySection title="4. How We Share Information" id="how-we-share-information">.
              <p>
                We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. We may process or share your data that we hold based on the following legal basis:
              </p>
              <ul className="space-y-2">
                <StyledListItem><strong>Vendors and Service Providers:</strong> We may share your data with third-party vendors, service providers, contractors, or agents who perform services for us or on our behalf (e.g., payment processing, data analysis, email delivery, customer service).</StyledListItem>
                <StyledListItem><strong>Business Transfers:</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</StyledListItem>
                <StyledListItem><strong>Legal Obligations:</strong> We may disclose your information where we are legally required to do so in order to comply with applicable law, governmental requests, or legal process.</StyledListItem>
              </ul>
            </PolicySection>

            <PolicySection title="5. Your Rights" id="your-rights">
              <p>
                You have certain rights under applicable data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; and (iv) if applicable, to data portability.
              </p>
              <p>
                You can review or change the information in your account at any time by logging into your account settings and updating your user account.
              </p>
            </PolicySection>

            <PolicySection title="6. Contact Us" id="contact-us">
              <p>
                If you have questions or comments about this notice, you may email us at <a href="mailto:privacy@urbandrive.com" className="text-accent font-medium hover:underline">privacy@urbandrive.com</a> or by post to:
              </p>
              <div className="p-6 bg-secondary rounded-xl border border-border">
                <h4 className="font-semibold text-primary">UrbanDrive, Inc.</h4>
                <p className="text-text-secondary mt-2">
                  123 Luxury Lane<br />
                  Suite 100<br />
                  New York, NY 10001
                </p>
              </div>
            </PolicySection>
          </main>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;