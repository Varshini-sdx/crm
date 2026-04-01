import { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, GitBranch, BarChart3 } from "lucide-react";
import styles from "./features.module.css";

import { NavLink, useNavigate } from "react-router-dom";

import visual1 from "../../assets/leads.jpg";
import visual2 from "../../assets/pipelines.jpg";
import visual3 from "../../assets/tasks.jpg";
import visual4 from "../../assets/team.jpg";


const TABS = [
  {
    label: "Lead Management",
    title: "Centralized Lead Management",
    desc:
      "Capture, organize, and track leads from every channel in one unified workspace. Never miss an opportunity again.",
    img: visual1,
  },
  {
    label: "Sales Pipeline",
    title: "Visual Sales Pipeline",
    desc:
      "Track every deal stage clearly with a visual pipeline that keeps your sales team focused and accountable.",
    img: visual2,
  },
  {
    label: "Automation & Tasks",
    title: "Smart Automation",
    desc:
      "Automate follow-ups, reminders, and repetitive tasks so your team can focus on closing deals faster.",
    img: visual3,
  },
  {
    label: "Analytics & Insights",
    title: "Real-Time Insights",
    desc:
      "Monitor performance, conversions, and revenue trends with actionable analytics and dashboards.",
    img: visual4,
  },
];


const steps = [
  {
    icon: <UserPlus size={28} />,
    title: "Capture Leads",
    desc: "Collect leads from forms, WhatsApp, email, and manual entry — all in one place.",
  },
  {
    icon: <GitBranch size={28} />,
    title: "Track & Automate",
    desc: "Move deals through pipelines, assign tasks, and automate follow-ups effortlessly.",
  },
  {
    icon: <BarChart3 size={28} />,
    title: "Close & Analyze",
    desc: "Close deals faster and track performance with real-time reports and insights.",
  },
];


export default function Features() {
  const navigate = useNavigate();

  const [active, setActive] = useState(0);
  const current = TABS[active];

  return (
    <>

      {/* ---------- Navbar ------- */}
      <nav className={styles.navbar}>
        {/* Brand */}
        <div className={styles.navBrand}>
          Rvh<span>Crm</span>
        </div>

        {/* Links */}
        <ul className={styles.navLinks}>
          <li><NavLink to="/" className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ""}`}>Home</NavLink></li>
          <li><NavLink to="/features" className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ""}`}>Features</NavLink></li>
          <li><NavLink to="/pricing" className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ""}`}>Pricing</NavLink></li>
          <li> <NavLink to="/contact" className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ""}`}>Contact</NavLink></li>
          <li><NavLink to="/signUp" className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ""}`}>Sign Up</NavLink></li>
        </ul>

      </nav>

      {/*----- Hero --------*/}
      <section className={styles.featuresHero}>
        <div className={styles.overlay}></div>

        <div className={styles.glassCard}>
          <h1>
            Everything Your Sales Team Needs —
            <span> In One CRM</span>
          </h1>

          <p>
            Manage leads, automate follow-ups, collaborate seamlessly, and close
            deals faster with RvhCrm.
          </p>
        </div>
      </section>


      {/* ---- features sub -------- */}
      <section className={styles.section}>

        <div className={styles.featureHeader}>
          <div className={styles.headerLeft}>
            <span className={styles.pill}>CRM Features</span>
            <h2 className={styles.heading}>
              Powerful tools to manage<br />your sales pipeline
            </h2>
          </div>

          <p className={styles.subText}>
            Everything your business needs to manage leads, automate workflows,
            and scale revenue — all in one CRM.
          </p>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {TABS.map((tab, i) => (
            <button
              key={i}
              className={`${styles.tab} ${i === active ? styles.activeTab : ""
                }`}
              onClick={() => setActive(i)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Feature Card */}
        <div className={styles.featureCard}>
          {/* Left */}
          <div className={styles.cardContent}>
            <h3>{current.title}</h3>
            <p>{current.desc}</p>

            <button 
              className={styles.cta} 
              onClick={() => {
                navigate("/");
                window.scrollTo(0, 0);
              }}
            >
              Explore Feature
            </button>
          </div>

          {/* Right */}
          <div className={styles.cardVisual}>
            <img src={current.img} alt={current.title} />
          </div>
        </div>
      </section>


      {/* ---------- How it works ---------- */}
      <section className={styles.howItWorksWrapper}>
        <motion.div
          className={styles.howItWorksHeader}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.howItWorksPill}>How it works</span>
          <h2>From Lead to Deal — Simplified</h2>
          <p>
            RvhCRM guides your sales process step by step, so your team focuses on
            closing — not managing tools.
          </p>
        </motion.div>

        <div className={styles.howItWorksSteps}>
          {steps.map((step, i) => (
            <motion.div
              key={i}
              className={styles.howItWorksCard}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
            >
              <div className={styles.howItWorksIcon}>{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
              <span className={styles.howItWorksStepNumber}>0{i + 1}</span>
            </motion.div>
          ))}
        </div>
      </section>


      {/* ---------- Feature Highlights ---------- */}
      <section className={styles.featureHighlightsSection}>
        <div className={styles.featureHighlightsHeader}>
          <h2>
            Built for <span>Speed</span>, Stability & Scale
          </h2>
          <p>
            Thoughtfully designed features that remove friction and help your team
            move faster every day.
          </p>
        </div>

        <div className={styles.featureHighlightsChips}>
          {[
            { icon: "⚡", text: "Fast setup" },
            { icon: "🔒", text: "Secure data" },
            { icon: "📱", text: "Mobile-friendly" },
            { icon: "🌍", text: "Works anywhere" },
            { icon: "🔁", text: "Real-time sync" },
          ].map((item, i) => (
            <div
              key={i}
              className={styles.featureHighlightChip}
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <span className={styles.featureHighlightIcon}>{item.icon}</span>
              {item.text}
            </div>
          ))}
        </div>
      </section>


      {/* ---------- Features CTA ---------- */}
      <section className={styles.featuresCtaSection}>
        <div className={styles.featuresCtaInner}>
          <h2>Ready to simplify your sales workflow?</h2>
          <p>
            Set up in minutes. No credit card required.
            Built for teams who want clarity — not complexity.
          </p>

          <div className={styles.featuresCtaActions}>
            <button className={styles.featuresCtaPrimary} onClick={() => navigate("/signUp")}>
              Start Free Trial
            </button>
            <button className={styles.featuresCtaSecondary} onClick={() => navigate("/signUp")}>
              Request Demo
            </button>
          </div>
        </div>
      </section>

      {/* ---- Footer ------ */}
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

        {/* Bottom */}
        <div className={styles.footerBottom}>
          © {new Date().getFullYear()} RvhCRM. All rights reserved.
        </div>
      </footer>


    </>
  )
}