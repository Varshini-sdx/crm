import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./signUp.module.css";
import signUpImg from "../../assets/signup_img.jpg";


export default function SignUp() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("http://192.168.1.15:5000/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Signup failed");
            }

            // Success → go to OTP page
            navigate("/otp", { state: { email } });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>

            <div className={styles.signupPage}>
                <div className={styles.signupCard}>

                    {/* Left Image Section */}
                    <div className={styles.imageSection}>
                        <img
                            src={signUpImg}
                            alt="CRM illustration"
                            className={styles.image}
                        />

                        <div className={styles.imageOverlay}>
                            <p className={styles.overlaySmall}>You can easily</p>
                            <h2 className={styles.overlayLarge}>
                                Turn every lead into a meaningful customer relationship
                            </h2>
                        </div>
                    </div>


                    {/* Right Form Section */}
                    <div className={styles.formSection}>
                        <div className={styles.header}>
                            <span className={styles.logo}>✦</span>
                            <h1>Create your CRM account</h1>
                            <p>
                                Manage leads, track deals, and collaborate with your team —
                                all from one powerful dashboard.
                            </p>
                        </div>

                        <form className={styles.form} onSubmit={handleSubmit}>
                            <div className={styles.inputGroup}>
                                <label>Email</label>
                                <input
                                    type="email"
                                    placeholder="you@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label>Password</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            {error && <p className={styles.errorText}>{error}</p>}

                            <button type="submit" className={styles.primaryBtn} disabled={loading}>
                                {loading ? "Sending OTP..." : "Get Started"}
                            </button>
                        </form>

                        <p className={styles.footerText}>
                            Already have an account? <span>Sign in</span>
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}