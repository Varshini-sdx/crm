import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./login.module.css";
import loginImg from "../../assets/login_img.jpg";



export default function Login() {
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
            const res = await fetch("http://192.168.1.18:5000/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            console.log("LOGIN RESPONSE:", data, res.ok);
            

            if (!res.ok) {
                throw new Error(data.message || "Login failed");
            } 

            // Success → go to dashboard / home
            navigate("/organisation-setup");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className={styles.loginPage}>
                <div className={styles.loginCard}>
                    {/* Left Image Section */}
                    <div className={styles.imageSection}>
                        <img src={loginImg} alt="CRM illustration" className={styles.image} />

                        <div className={styles.imageOverlay}>
                            <p className={styles.overlaySmall}>Welcome back</p>
                            <h2 className={styles.overlayLarge}>
                                Continue building meaningful customer relationships
                            </h2>
                        </div>
                    </div>

                    {/* Right Form Section */}
                    <div className={styles.formSection}>
                        <div className={styles.header}>
                            <span className={styles.logo}>✦</span>
                            <h1>Sign in to your account</h1>
                            <p>
                                Access your dashboard, manage leads, and track every opportunity
                                in one place.
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

                            <button
                                type="submit"
                                className={styles.loginBtn}
                                disabled={loading}
                            >
                                {loading ? "Signing in..." : "Login"}
                            </button>
                        </form>

                        <p className={styles.footerText}>
                            Don’t have an account? <span onClick={() => navigate("/signup")}>Sign up</span>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}