import { useState } from "react";
import styles from "./contact.module.css";


export default function Contact() {


    return (
        <>


            <div className={styles.contactSection}>

                {/* LEFT SIDE  */}
                <div className={styles.contactLeft}>
                    <h2 className={styles.contactTitle}>Contact Us</h2>
                    <p className={styles.contactDesc}>
                        We'd love to hear from you. Reach out with any questions, ideas, or collaboration opportunities.
                    </p>

                    <div className={styles.contactInfo}>
                        <p><strong>Email:</strong> contact@workspace.com</p>
                        <p><strong>Phone:</strong> +91 98765 43210</p>
                        <p><strong>Address:</strong> Hyderabad, India</p>
                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div className={styles.contactCard}>
                    <h3 className={styles.cardHeading}>Get in Touch</h3>

                    <form className={styles.contactForm}>
                        <input type="text" placeholder="Your Name" />
                        <input type="email" placeholder="Your Email" />
                        <textarea placeholder="Your Message"></textarea>
                        <button type="submit">Send Message</button>
                    </form>
                </div>




            </div>
            {/* FAQs */}
            <section className={styles.faqs}>
                <h3>FAQs</h3>

                <details>
                    <summary>How soon will I get a response?</summary>
                    <p>Within 24 business hours.</p>
                </details>

                <details>
                    <summary>Do you provide onboarding?</summary>
                    <p>Yes, guided onboarding is available.</p>
                </details>
            </section>

            {/* CTA */}
            <section className={styles.cta}>
                <h2>Need a Product Demo?</h2>
                <button>Request a Demo</button>
            </section>


            {/* <div className={styles.contactPage}>

                
                <section className={styles.header}>
                    <h1>Get in Touch</h1>
                    <p>We’re here to help you build and manage your CRM efficiently.</p>
                </section>

                <section className={styles.quickCards}>
                    <div className={styles.card}>📧 support@yourcrm.com</div>
                    <div className={styles.card}>☎️ +91 9XXXX XXXXX</div>
                    <div className={styles.card}>💬 Live Chat (Mon–Fri)</div>
                </section>

                
                <section className={styles.main}>
                  
                    <form className={styles.form}>
                        <h3>Contact Us</h3>

                        <input type="text" placeholder="Full Name" />
                        <input type="email" placeholder="Work Email" />
                        <input type="text" placeholder="Company Name" />

                        <select>
                            <option>General Query</option>
                            <option>Support</option>
                            <option>Sales</option>
                        </select>

                        <textarea placeholder="Your message..." rows="4"></textarea>

                        <button type="submit">Send Message</button>
                    </form>

                    Details 
                    <div className={styles.details}>
                        <h4>Contact Details</h4>
                        <p><b>Email:</b> support@yourcrm.com</p>
                        <p><b>Office:</b> Hyderabad, India</p>
                        <p><b>Hours:</b> Mon–Fri, 9 AM – 6 PM</p>
                    </div>
                </section> 

                

            </div> */}




        </>
    )

}