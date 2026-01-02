import { useEffect, useRef, useState } from "react";
import styles from "./home.module.css";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

import whyUs from "../../assets/Why_us.jpg";

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



export default function Home() {
    const heroRef = useRef(null);
    const contentRef = useRef(null);

    const brandsRef = useRef(null);

    const [activeIndex, setActiveIndex] = useState(0);
    const { ref: featuresRef, inView: featuresInView } = useInView({ threshold: 0.4, });


    /* Header Animation variants */
    useEffect(() => {
        const reveals = document.querySelectorAll(`.${styles.reveal}`);

        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add(styles.show);

                    }
                });
            },
            { threshold: 0.2 }
        );

        reveals.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, []);



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



    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(styles.show);
                }
            },
            { threshold: 0.25 }
        );

        if (brandsRef.current) observer.observe(brandsRef.current);

        return () => observer.disconnect();
    }, []);

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
        if (!featuresInView) return;

        const onScroll = () => {
            const section = document.getElementById("features-section");
            if (!section) return;

            const rect = section.getBoundingClientRect();
            const progress = Math.min(
                Math.max(-rect.top / rect.height, 0),
                0.99
            );

            const index = Math.floor(progress * FEATURES.length);
            setActiveIndex(index);
        };

        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, [inView]);

    const activeFeature = FEATURES[activeIndex];



    return (
        <>
            <section className={styles.hero} ref={heroRef}>
                {/* Background */}
                <div className={styles.gradientBg}></div>
                <div className={styles.whiteTint}></div>

                {/* 🔥 SPARK GOES HERE */}
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
                    <h1 className={styles.reveal}>
                        Control Your <span>Leads</span>, Teams & Growth
                    </h1>

                    <p className={styles.reveal}>
                        A modern CRM built for startups and scaling businesses — automate
                        lead distribution, track performance, and grow with clarity.
                    </p>

                    <div className={`${styles.actions} ${styles.reveal}`}>
                        <button className={styles.primaryBtn}>Start Free Trial</button>
                        <button className={styles.secondaryBtn}>Watch Demo</button>
                    </div>

                    {/* Divider */}
                    <div className={`${styles.divider} ${styles.reveal}`}></div>

                    {/* Stats */}
                    <div className={`${styles.stats} ${styles.reveal}`}>
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
                    </div>
                </div>
            </section>

            {/* ------ BRANDS ----- */}
            <section className={styles.brandsSection} ref={brandsRef}>

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
            </section>


            {/* -------- WHY THIS CRM SECTION -----------*/}
            <section ref={ref} className={styles.whySection}>
                <div
                    className={`${styles.whyHeader} ${styles.revealBase} ${showContent ? styles.revealUp : ""
                        }`}
                >
                    <h2>
                        Why this <span>CRM?</span>
                    </h2>
                    <p>
                        Everything your team needs to manage leads, automate workflows,
                        and close deals — all in one place.
                    </p>
                </div>

                <div className={styles.whyContent}>
                    {/* LEFT IMAGE */}
                    <div
                        className={`${styles.whyImageWrap} ${styles.revealBase} ${styles.fromLeft} ${showContent ? styles.revealLeft : ""
                            }`}
                    >

                        <img src={whyUs} alt="CRM in action" />
                    </div>

                    {/* RIGHT CARDS */}
                    <div
                        className={`${styles.whyCards} ${styles.revealBase} ${styles.fromRight} ${showContent ? styles.revealRight : ""
                            }`}
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

                        <button className={styles.demoBtn}>
                            Book a Live Demo →
                        </button>
                    </div>
                </div>
            </section>


            {/* -------- Features ------- */}
            <section
                id="features-section"
                ref={featuresRef}
                className={styles.featuresSection}
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
                                className={`${styles.topic} ${i === activeIndex ? styles.activeTopic : ""
                                    }`}
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

                                <a href="#" className={styles.learnMore}>
                                    Learn more →
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}