import { useEffect, useRef, useState } from "react";
import styles from "./home.module.css";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { NavLink, useNavigate } from "react-router-dom";


import whyUs from "../../assets/why_us.jpg";

/* BRAND LOGOS */
import google from "../../assets/Chargebee_logo.png";
import amazon from "../../assets/Cleartax_logo.png";
import microsoft from "../../assets/Dunzo_logo.png";
import slack from "../../assets/Freshworks_logo.png";
import spotify from "../../assets/Inmobi_logo.png";
import netflix from "../../assets/Razorpay_logo.png";
import airbnb from "../../assets/Shopify_logo.png";
import uber from "../../assets/Spotify_logo.png";
import shopify from "../../assets/Udaan_logo.png";
import stripe from "../../assets/Zoho_logo.png";

/* why us logos */
import dataIcon from "../../assets/data_icon.png";
import automationIcon from "../../assets/automation.png";
import analyticsIcon from "../../assets/sales.png";
import securityIcon from "../../assets/security.png";

/* features imgs */
import leadImg from "../../assets/leads.jpg";
import pipelineImg from "../../assets/pipelines.jpg";
import taskImg from "../../assets/tasks.jpg";
import teamImg from "../../assets/team.jpg";
import analyticsImg from "../../assets/analytics.jpg";
import integrationImg from "../../assets/integration.jpg";

/* testimonial images */
import p1 from "../../assets/pfp1.jpg";
import p2 from "../../assets/pfp2.jpg";
import p3 from "../../assets/pfp3.jpg";
import p4 from "../../assets/pfp4.jpg";


const FEATURES = [
    {
        title: "Lead Management",
        desc:
            "Capture, organize, and track leads from multiple sources in one centralized dashboard so no opportunity slips through.",
        img: leadImg,
    },
    {
        title: "Pipeline Tracking",
        desc:
            "Visualize your sales pipeline clearly and track deal progress at every stage with complete transparency.",
        img: pipelineImg,
    },
    {
        title: "Task & Reminder Automation",
        desc:
            "Automate follow-ups, reminders, and daily tasks to ensure timely actions and higher conversion rates.",
        img: taskImg,
    },
    {
        title: "Team Collaboration",
        desc:
            "Enable seamless collaboration across teams with shared notes, activity logs, and internal communication.",
        img: teamImg,
    },
    {
        title: "Analytics & Reports",
        desc:
            "Get real-time insights into sales performance, conversions, and trends using powerful analytics dashboards.",
        img: analyticsImg,
    },
    {
        title: "Email / WhatsApp Integration",
        desc:
            "Connect directly with customers via email and WhatsApp from inside your CRM for faster communication.",
        img: integrationImg,
    },
];


const TESTIMONIALS = [
    {
        text:
            "This CRM completely changed how our sales team works. Everything is organised and follow-ups are effortless.",
        name: "Aarav Sharma",
        role: "Sales Manager, FinEdge",
        img: p1,
    },
    {
        text:
            "The pipeline visibility and automation helped us close deals faster without extra manual work.",
        name: "Sanjana Rao",
        role: "Growth Lead, Marketly",
        img: p2,
    },
    {
        text:
            "Simple, clean, and powerful. Our team collaboration improved immediately after switching.",
        name: "Rehan Khan",
        role: "Founder, StartX",
        img: p3,
    },
    {
        text:
            "Analytics and reports give us clarity we never had before. Highly recommended for growing teams.",
        name: "Meghana Iyer",
        role: "Operations Head, CloudNest",
        img: p4,
    },
];


const plans = [
    {
        name: "Starter",
        price: "₹999",
        desc: "For individuals getting started",
        features: [
            "Lead management",
            "Basic analytics",
            "Email support",
            "2 team members",
            "Up to 1,000 contacts",
            "Basic pipeline management",
            "Standard support"
        ],
        featured: false,
    },
    {
        name: "Growth",
        price: "₹2,499",
        desc: "Best for growing teams",
        features: [
            "Everything in Starter",
            "Team collaboration",
            "Up to 10,000 contacts",
            "Advanced pipeline & automation",
            "Email campaigns & tracking",
            "Custom reports & dashboards",
            "API access",
            "Priority support"
        ],
        featured: true,
    },
    {
        name: "Enterprise",
        price: "Custom",
        desc: "For large scale operations",
        features: [
            "Unlimited users",
            "Custom integrations",
            "Dedicated manager",
            "Advanced AI insights",
            "Custom integrations",
            "SSO & advanced security",
            "Dedicated success manager",
            "24/7 premium support",
            "Custom training"
        ],
        featured: false,
        enterprise: true,
    },
];



const revealVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } 
    }
};

const slideInLeft = {
    hidden: { opacity: 0, x: -60 },
    visible: { 
        opacity: 1, 
        x: 0,
        transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } 
    }
};

const slideInRight = {
    hidden: { opacity: 0, x: 60 },
    visible: { 
        opacity: 1, 
        x: 0,
        transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } 
    }
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1
        }
    }
};

export default function Home() {

    const navigate = useNavigate();

    const heroRef = useRef(null);
    const contentRef = useRef(null);

    const brandsRef = useRef(null);

    const [activeIndex, setActiveIndex] = useState(0);
    const featuresRef = useRef(null);


    /* Scroll logic moved to Framer Motion */



    /* ===== Brands carousel ===== */
    const brands = [
        google,
        amazon,
        microsoft,
        slack,
        spotify,
        netflix,
        airbnb,
        uber,
        shopify,
        stripe,
    ];

    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % brands.length);
        }, 2000);

        return () => clearInterval(timer);
    }, []);

    const visibleBrands = [...brands, ...brands].slice(index, index + 7);



    /* Brands entry handled by Framer Motion section wrapper */

    /* why us scroll */

    const { ref, inView } = useInView({
        threshold: 0.25,
        triggerOnce: true,
    });

    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        if (!inView) return;

        const timer = setTimeout(() => {
            setShowContent(true);
        }, 150);

        return () => clearTimeout(timer);
    }, [inView]);



    /* features Scroll */
    useEffect(() => {
        const onScroll = () => {
            const section = featuresRef.current;
            if (!section) return;

            const rect = section.getBoundingClientRect();
            const totalScroll = rect.height - window.innerHeight;
            const scrolled = Math.min(Math.max(-rect.top, 0), totalScroll);

            const progress = totalScroll > 0 ? scrolled / totalScroll : 0;
            const index = Math.min(
                FEATURES.length - 1,
                Math.floor(progress * FEATURES.length)
            );

            setActiveIndex(index);
        };

        window.addEventListener("scroll", onScroll);
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const activeFeature = FEATURES[activeIndex];



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

            {/* ----- Header ---------- */}
            <motion.section 
                className={styles.hero} 
                ref={heroRef}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
            >
                {/* Background */}
                <div className={styles.gradientBg}></div>
                <div className={styles.whiteTint}></div>

                {/* SPARK GOES HERE */}
                <motion.div
                    className={styles.spark}
                    animate={{ offsetDistance: ["0%", "100%"] }}
                    transition={{
                        duration: 10,
                        ease: "linear",
                        repeat: Infinity,
                    }}
                />

                <svg className={styles.sparkPath} viewBox="0 0 400 400">
                    <path
                        d="M350 50 A300 300 0 0 1 350 350"
                        fill="none"
                    />
                </svg>


                {/*----- Hero Content ----- */}
                <div className={styles.heroContent} ref={contentRef}>
                    <motion.h1 variants={revealVariants}>
                        Control Your <span>Leads</span>, Teams & Growth
                    </motion.h1>

                    <motion.p variants={revealVariants}>
                        A modern CRM built for startups and scaling businesses — automate
                        lead distribution, track performance, and grow with clarity.
                    </motion.p>

                    <motion.div 
                        className={styles.actions}
                        variants={revealVariants}
                    >
                        <button className={styles.primaryBtn} onClick={() => navigate("/signUp")}>Start Free Trial</button>
                        <button className={styles.secondaryBtn} onClick={() => navigate("/signUp")}>Watch Demo</button>
                    </motion.div>

                    {/* Divider */}
                    <div className={styles.divider}></div>

                    {/* Stats */}
                    <motion.div 
                        className={styles.stats}
                        variants={revealVariants}
                    >
                        <div className={styles.statItem}>
                            <h3>10,000+</h3>
                            <span>Active Users</span>
                        </div>

                        <div className={styles.statItem}>
                            <h3>$2.5B</h3>
                            <span>Deals Closed</span>
                        </div>

                        <div className={styles.statItem}>
                            <h3>4.9/5</h3>
                            <span>Customer Rating</span>
                        </div>
                    </motion.div>
                </div>
            </motion.section>

            {/* ------ BRANDS ----- */}
            <motion.section 
                className={styles.brandsSection} 
                ref={brandsRef}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={revealVariants}
            >

                <h2>
                    Trusted by <span>100+</span> companies worldwide
                </h2>

                <p className={styles.brandsDesc}>
                    Teams across fintech, SaaS, and enterprise trust our CRM to manage
                    leads, close deals faster, and scale with confidence.
                </p>

                <div className={styles.brandCarousel}>
                    {visibleBrands.map((logo, i) => (
                        <div
                            key={i}
                            className={`${styles.brandItem} ${i === 3 ? styles.activeBrand : ""
                                }`}
                        >
                            <img src={logo} alt="brand logo" />
                        </div>
                    ))}
                </div>
            </motion.section>


            {/* -------- WHY THIS CRM SECTION -----------*/}
            <motion.section 
                ref={ref} 
                className={styles.whySection}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
            >
                <motion.div
                    className={styles.whyHeader}
                    variants={revealVariants}
                >
                    <h2>
                        Why this <span>CRM?</span>
                    </h2>
                    <p>
                        Everything your team needs to manage leads, automate workflows,
                        and close deals — all in one place.
                    </p>
                </motion.div>

                <div className={styles.whyContent}>
                    {/* LEFT IMAGE */}
                    <motion.div
                        className={styles.whyImageWrap}
                        variants={slideInLeft}
                    >

                        <img src={whyUs} alt="CRM in action" />
                    </motion.div>

                    {/* RIGHT CARDS */}
                    <motion.div
                        className={styles.whyCards}
                        variants={slideInRight}
                    >
                        <div className={styles.whyCard}>
                            <div className={styles.iconWrap}>
                                <img src={dataIcon} alt="Centralized data" />
                            </div>

                            <h4>Centralized customer data</h4>
                            <p>
                                Keep all leads, contacts, and conversations in one organized
                                dashboard.
                            </p>
                        </div>

                        <div className={styles.whyCard}>
                            <div className={styles.iconWrap}>
                                <img src={automationIcon} alt="Automation" />
                            </div>
                            <h4>Faster follow-ups & automation</h4>
                            <p>
                                Automate lead assignment, reminders, and follow-ups so no
                                opportunity is missed.
                            </p>
                        </div>

                        <div className={styles.whyCard}>
                            <div className={styles.iconWrap}>
                                <img src={analyticsIcon} alt="Analytics" />
                            </div>
                            <h4>Real-time sales insights</h4>
                            <p>
                                Track performance, conversions, and pipeline health with live
                                analytics.
                            </p>
                        </div>

                        <div className={styles.whyCard}>
                            <div className={styles.iconWrap}>
                                <img src={securityIcon} alt="Security" />
                            </div>
                            <h4>Secure & scalable</h4>
                            <p>
                                Built to grow with your business, with enterprise-grade
                                security.
                            </p>
                        </div>

                        <button className={styles.demoBtn} onClick={() => navigate("/signUp")}>
                            Book a Live Demo →
                        </button>
                    </motion.div>
                </div>
            </motion.section>


            {/* -------- Features ------- */}
            <motion.section
                id="features-section"
                ref={featuresRef}
                className={styles.featuresSection}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={revealVariants}
            >

                {/* Heading */}
                <div className={styles.headingWrap}>
                    <h2>Core Features</h2>
                    <p>Everything you need to run your sales smarter and faster</p>
                </div>

                <div className={styles.featuresGrid}>
                    {/* LEFT – Topics */}
                    <div className={styles.topics}>
                        {FEATURES.map((item, i) => (
                            <div
                                key={i}
                                onClick={() => setActiveIndex(i)}
                                className={`${styles.topic} ${i === activeIndex ? styles.activeTopic : ""}`}
                            >
                                {item.title}
                            </div>
                        ))}
                    </div>

                    {/* RIGHT – Content Card */}
                    <div className={styles.cardWrap}>
                        <div className={styles.featureCard}>
                            <img src={activeFeature.img} alt={activeFeature.title} />

                            <div className={styles.cardContent}>
                                <h3>{activeFeature.title}</h3>
                                <p>{activeFeature.desc}</p>

                                <a
                                    className={styles.learnMore}
                                    onClick={() =>
                                        navigate("/features", {
                                            state: { feature: activeFeature.title },
                                        })
                                    }
                                >
                                    Learn more →
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

            </motion.section>


            {/* --------- Testimonials --------- */}
            <motion.section 
                className={styles.testimonialsSection}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={revealVariants}
            >

                <div className={styles.testimonialHeader}>
                    <span className={styles.label}>What people say</span>
                    <h2>Loved by teams that sell smarter</h2>
                    <p>
                        Trusted by fast-growing teams to improve productivity, collaboration,
                        and sales clarity.
                    </p>
                </div>

                {/* CAROUSEL */}
                <div className={styles.carouselOuter}>
                    <div className={styles.carouselTrack}>
                        {[...TESTIMONIALS, ...TESTIMONIALS].map((item, i) => (
                            <div className={styles.testimonialCard} key={i}>
                                {/* stars */}
                                <div className={styles.stars}>★★★★★</div>

                                {/* text */}
                                <p className={styles.reviewText}>{item.text}</p>

                                {/* user */}
                                <div className={styles.userRow}>
                                    <img src={item.img} alt={item.name} />
                                    <div>
                                        <div className={styles.userName}>{item.name}</div>
                                        <div className={styles.userRole}>{item.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.section>


            {/* ---- Pricing ------ */}
            <motion.section 
                className={styles.pricingSection}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
            >
                <div className={styles.pricingGradientBg}></div>

                <div className={styles.headingWrap}>
                    <span className={styles.label}>Pricing</span>
                    <h2>
                        Simple pricing for <span>smart teams</span>
                    </h2>
                    <p>Choose a plan that scales as your business grows.</p>
                </div>

                {/* Cards */}
                <div className={styles.pricingGrid}>
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            className={`${styles.card} ${plan.featured ? styles.featured : ""
                                }`}
                            variants={revealVariants}
                        >
                            {plan.featured && (
                                <div className={styles.badge}>Most Popular</div>
                            )}

                            <h3>{plan.name}</h3>
                            <div className={styles.price}>{plan.price}
                                {!plan.enterprise && <span>/month</span>}
                            </div>
                            <p className={styles.desc}>{plan.desc}</p>

                            <ul className={styles.features}>
                                {plan.features.map((feature, i) => (
                                    <li key={i}>✔ {feature}</li>
                                ))}
                            </ul>

                            <button
                                className={`${styles.cta} ${plan.featured ? styles.primary : ""
                                    }`}
                                onClick={() => navigate(plan.enterprise ? "/contact" : "/signUp")}
                            >
                                {plan.enterprise ? "Contact Sales" : "Get Started"}
                            </button>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

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
    );
}