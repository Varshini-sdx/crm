import React from "react";
import styles from "./pricing.module.css";

import { NavLink, useNavigate } from "react-router-dom";

export default function Pricing() {
    const navigate = useNavigate();
    const pricingRef = React.useRef(null);

    const scrollToPricing = () => {
        pricingRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const plans = [
        {
            name: "Starter",
            price: "₹999",
            desc: "For individuals getting started",
            features: [
                "Lead management",
                "Basic pipeline",
                "Tasks & reminders",
                "Email support",
            ],
            featured: false,
        },
        {
            name: "Growth",
            price: "₹2,499",
            desc: "Best for growing teams",
            features: [
                "Everything in Starter",
                "Automation workflows",
                "Team collaboration",
                "Analytics & reports",
                "Email & WhatsApp integration",
            ],
            featured: true,
        },
        {
            name: "Pro / Business",
            price: "₹4,999",
            desc: "For scaling sales teams",
            features: [
                "Everything in Growth",
                "Advanced analytics",
                "Role-based access",
                "API access",
                "Priority support",
            ],
            featured: false,
        },
    ];


    const benefits = [
        {
            title: "Instant Setup",
            desc: "Launch in minutes. No tutorials, no steep learning curves.",
            icon: "⚡",
        },
        {
            title: "One Smart Dashboard",
            desc: "Leads, deals, follow-ups — everything in one clean view.",
            icon: "📊",
        },
        {
            title: "Never Miss a Follow-up",
            desc: "Automated reminders that keep every opportunity warm.",
            icon: "⏰",
        },
        {
            title: "Works Everywhere",
            desc: "Seamless on desktop, tablet, and mobile devices.",
            icon: "📱",
        },
        {
            title: "Scales With You",
            desc: "From solo founders to large teams — grow without friction.",
            icon: "🌱",
        },
    ];


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


            {/* Simple Hero */}
            <section className={styles.simpleHeroWrapper}>
                <div className={styles.simpleHeroOverlay} />

                <div className={styles.simpleHeroContent}>
                    <h1>Built for teams that want to sell smarter</h1>
                    <p>
                        RVH CRM helps you capture leads, manage follow-ups, and close deals —
                        without complexity.
                    </p>
                </div>
            </section>



            {/* ----- Pricing ----- */}
            <section className={styles.pricingSection} ref={pricingRef}>

                <div className={styles.headingWrap}>
                    <span className={styles.label}>Simple & Transparent Pricing</span>
                    <h2>Plans that grow with your business</h2>
                    <p>No hidden fees. Upgrade or cancel anytime.</p>
                </div>

                {/* Pricing Cards */}
                <div className={styles.pricingGrid}>
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`${styles.card} ${plan.featured ? styles.featured : ""
                                }`}
                        >
                            {plan.featured && (
                                <div className={styles.badge}>Most Popular</div>
                            )}

                            <h3>{plan.name}</h3>
                            <p className={styles.desc}>{plan.desc}</p>

                            <div className={styles.price}>
                                {plan.price}
                                <span>/month</span>
                            </div>

                            <ul className={styles.features}>
                                {plan.features.map((feature, i) => (
                                    <li key={i}>✔ {feature}</li>
                                ))}
                            </ul>

                            <button className={styles.cta} onClick={() => navigate("/signUp")}>Get Started</button>
                        </div>
                    ))}
                </div>

                <p className={styles.testimonial}>
                    “We switched to this CRM and closed deals 30% faster.”
                </p>
            </section>


            {/* ----- Who it's for ----- */}
            <section className={styles.whoItsForSection}>
                <div className={styles.whoItsForHeader}>
                    <h2>Built for teams that hate messy sales tools</h2>
                    <p>
                        Whether you’re just starting out or scaling fast, RVH CRM adapts to how
                        your team sells.
                    </p>
                </div>

                <div className={styles.whoItsForGrid}>
                    <div className={styles.whoItsForCard}>
                        <h3>Startups</h3>
                        <p className={styles.pain}>
                            Juggling leads across sheets, emails, and DMs.
                        </p>
                        <p className={styles.solution}>
                            One clean CRM to capture and track every opportunity.
                        </p>
                    </div>

                    <div className={styles.whoItsForCard}>
                        <h3>Sales Teams</h3>
                        <p className={styles.pain}>
                            Losing follow-ups and visibility across pipelines.
                        </p>
                        <p className={styles.solution}>
                            Centralized pipelines with automation and reminders.
                        </p>
                    </div>

                    <div className={styles.whoItsForCard}>
                        <h3>Agencies</h3>
                        <p className={styles.pain}>
                            Managing multiple clients and deals at once.
                        </p>
                        <p className={styles.solution}>
                            Separate pipelines and insights for every client.
                        </p>
                    </div>

                    <div className={styles.whoItsForCard}>
                        <h3>Growing Businesses</h3>
                        <p className={styles.pain}>
                            Tools that don’t scale with increasing sales volume.
                        </p>
                        <p className={styles.solution}>
                            A CRM that grows with your process — not against it.
                        </p>
                    </div>
                </div>
            </section>


            {/* ----- Benefits ----- */}
            <section className={styles.pricingBenefitsSection}>
                <div className={styles.pricingBenefitsHeader}>
                    <p className={styles.pricingBenefitsTag}>Why teams choose RVH CRM</p>
                    <h2 className={styles.pricingBenefitsTitle}>
                        Built to make selling feel effortless
                    </h2>
                </div>

                <div className={styles.pricingBenefitsGrid}>
                    {benefits.map((item, i) => (
                        <div
                            key={i}
                            className={styles.pricingBenefitCard}
                            style={{ animationDelay: `${i * 0.12}s` }}
                        >
                            <span className={styles.pricingBenefitIcon}>{item.icon}</span>
                            <h3>{item.title}</h3>
                            <p>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>


            {/* ----- Pricing How ----- */}
            <section className={styles.pricingHowSection}>
                <div className={styles.pricingHowHeader}>
                    <p className={styles.pricingHowTag}>How it works</p>
                    <h2 className={styles.pricingHowTitle}>
                        From lead to loyal customer in 3 simple steps
                    </h2>
                </div>

                <div className={styles.pricingHowFlow}>
                    <div className={styles.pricingHowStep}>
                        <span className={styles.pricingHowDot}></span>
                        <h3>Capture leads automatically</h3>
                        <p>
                            Collect leads from forms, emails, and integrations without lifting a
                            finger.
                        </p>
                    </div>

                    <div className={styles.pricingHowLine}></div>

                    <div className={styles.pricingHowStep}>
                        <span className={styles.pricingHowDot}></span>
                        <h3>Track & automate follow-ups</h3>
                        <p>
                            Every conversation stays organized. Set reminders and let CRM do the
                            chasing.
                        </p>
                    </div>

                    <div className={styles.pricingHowLine}></div>

                    <div className={styles.pricingHowStep}>
                        <span className={styles.pricingHowDot}></span>
                        <h3>Close deals & view reports</h3>
                        <p>
                            See what’s working, close faster, and grow with clarity.
                        </p>
                    </div>
                </div>
            </section>



            {/* ----- Pricing Final CTA ----- */}
            <section className={styles.pricingFinalCta}>
                <h2>Ready to simplify your sales workflow?</h2>
                <p>Start using RVH CRM in minutes.</p>

                <div className={styles.pricingFinalActions}>
                    <button className={styles.pricingPrimaryBtn} onClick={() => navigate("/signUp")}>Start Free Trial</button>
                    <button className={styles.pricingGhostBtn} onClick={scrollToPricing}>See Pricing</button>
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
    );
}
