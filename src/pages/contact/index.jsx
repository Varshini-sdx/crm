import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, MessageSquare, Send, ChevronRight } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./contact.module.css";

export default function Contact() {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className={styles.contactPage}>
      {/* ---------- Navbar ------- */}
      <nav className={styles.navbar}>
        <div className={styles.navBrand} onClick={() => navigate("/")}>
          Rvh<span>Crm</span>
        </div>
        <ul className={styles.navLinks}>
          <li><NavLink to="/" className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ""}`}>Home</NavLink></li>
          <li><NavLink to="/features" className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ""}`}>Features</NavLink></li>
          <li><NavLink to="/pricing" className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ""}`}>Pricing</NavLink></li>
          <li><NavLink to="/contact" className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ""}`}>Contact</NavLink></li>
          <li><NavLink to="/signUp" className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ""}`}>Sign Up</NavLink></li>
        </ul>
      </nav>

      {/* ----- Hero Section ----- */}
      <section className={styles.hero}>
        <div className={styles.gradientBg}></div>
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          Get in <span>Touch</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          We're here to help you scale your business. Reach out for support, 
          demos, or partnership opportunities.
        </motion.p>
      </section>

      {/* ----- Main Content ----- */}
      <div className={styles.mainLayoutWrapper}>
        <motion.div 
          className={styles.mainLayout}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Left Side: Info Cards */}
          <div className={styles.infoSide}>
            <motion.div className={styles.infoCard} variants={itemVariants}>
              <div className={styles.iconWrap}>
                <Mail size={24} />
              </div>
              <h3>Email Us</h3>
              <p>Our team typically responds within 24 hours.</p>
              <p style={{ color: "#ffffff", fontWeight: "600", marginTop: "0.5rem" }}>support@rvhcrm.com</p>
            </motion.div>

            <motion.div className={styles.infoCard} variants={itemVariants}>
              <div className={styles.iconWrap}>
                <Phone size={24} />
              </div>
              <h3>Call Us</h3>
              <p>Mon–Fri from 9am to 6pm IST.</p>
              <p style={{ color: "#ffffff", fontWeight: "600", marginTop: "0.5rem" }}>+91 98765 43210</p>
            </motion.div>

            <motion.div className={styles.infoCard} variants={itemVariants}>
              <div className={styles.iconWrap}>
                <MapPin size={24} />
              </div>
              <h3>Our Office</h3>
              <p>Come visit us at our headquarters.</p>
              <p style={{ color: "#ffffff", fontWeight: "600", marginTop: "0.5rem" }}>T-Hub, Hyderabad, India</p>
            </motion.div>
          </div>

          {/* Right Side: Form Card */}
          <motion.div className={styles.formCard} variants={itemVariants}>
            <div style={{ marginBottom: "2rem" }}>
              <h2 style={{ fontSize: "1.8rem", marginBottom: "0.5rem", color: "#1a1e2b" }}>Send a Message</h2>
              <p style={{ opacity: 0.6, color: "#444" }}>Fill out the form below and we'll get back to you shortly.</p>
            </div>

            {!submitted ? (
              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label style={{ color: "#1a1e2b" }}>Full Name</label>
                  <input 
                    type="text" 
                    className={styles.inputField} 
                    placeholder="John Doe" 
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({...formState, name: e.target.value})}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label style={{ color: "#1a1e2b" }}>Work Email</label>
                  <input 
                    type="email" 
                    className={styles.inputField} 
                    placeholder="john@company.com" 
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({...formState, email: e.target.value})}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label style={{ color: "#1a1e2b" }}>How can we help?</label>
                  <textarea 
                    className={styles.textareaField} 
                    placeholder="Tell us about your project or inquiry..."
                    required
                    value={formState.message}
                    onChange={(e) => setFormState({...formState, message: e.target.value})}
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className={styles.submitBtn}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : (
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem" }}>
                      Send Message <Send size={18} />
                    </span>
                  )}
                </button>
              </form>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: "center", padding: "2rem 0" }}
              >
                <div style={{ background: "rgba(253, 123, 17, 0.1)", width: "60px", height: "60px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", color: "#fd7b11" }}>
                  <MessageSquare size={30} />
                </div>
                <h3 style={{ color: "#1a1e2b" }}>Message Sent!</h3>
                <p style={{ opacity: 0.6, marginTop: "0.5rem", color: "#444" }}>Thank you for reaching out. We'll be in touch soon.</p>
                <button 
                  className={styles.submitBtn} 
                  style={{ marginTop: "2rem", width: "auto", padding: "0.8rem 2rem" }}
                  onClick={() => setSubmitted(false)}
                >
                  Send Another
                </button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* ----- FAQ Section ----- */}
      <section className={styles.faqSection}>
        <div className={styles.faqHeader}>
          <h2>Common Questions</h2>
          <p>Everything you need to know about getting started.</p>
        </div>
        <div className={styles.faqList}>
          <details className={styles.faqItem}>
            <summary>How soon will I get a response? <ChevronRight size={18} /></summary>
            <p>Our support team is available Mon–Fri and usually responds within 12–24 business hours.</p>
          </details>
          <details className={styles.faqItem}>
            <summary>Do you provide guided onboarding? <ChevronRight size={18} /></summary>
            <p>Yes! We offer 1-on-1 onboarding sessions for Growth and Enterprise customers to ensure your team is set up for success.</p>
          </details>
          <details className={styles.faqItem}>
            <summary>Can I request a custom product demo? <ChevronRight size={18} /></summary>
            <p>Absolutely. You can request a demo via the form above, and our sales team will reach out to schedule a time.</p>
          </details>
        </div>
      </section>

      {/* ----- Footer ----- */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          {/* Left */}
          <div className={styles.footerBrand}>
            <h3>RvhCRM</h3>
            <p>
              A modern CRM built to help startups manage leads, teams, and growth —
              all in one place.
            </p>
          </div>

          {/* Links */}
          <div className={styles.footerLinks}>
            <div>
              <h4>Product</h4>
              <a onClick={() => navigate("/features")}>Features</a>
              <a onClick={() => navigate("/pricing")}>Pricing</a>
              <a onClick={() => navigate("/contact")}>Contact</a>
              <a onClick={() => navigate("/login")}>Login</a>
            </div>

            <div>
              <h4>Company</h4>
              <a href="#">About</a>
              <a href="#">Careers</a>
              <a href="#">Blog</a>
              <a href="#">Contact</a>
            </div>

            <div>
              <h4>Support</h4>
              <a href="#">Help Center</a>
              <a href="#">Docs</a>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms</a>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          © {new Date().getFullYear()} RvhCRM. All rights reserved.
        </div>
      </footer>
    </div>
  );
}