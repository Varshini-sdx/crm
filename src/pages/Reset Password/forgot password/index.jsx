import React, { useState } from "react";
import styles from "./forgotPassword.module.css";
import { NavLink, useNavigate } from "react-router-dom";

export default function ForgotPassword() {

    const navigate = useNavigate();


    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);

    const [error, setError] = useState("");


    {/*const handleSubmit = (e) => {
        e.preventDefault();

        if (!email.trim()) {
            setError("Please enter your email address.");
            return;
        }

        setError("");
        setSent(true);
        navigate("/reset-otp");
    }; */}

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            setError("Please enter your email address.");
            return;
        }

        setError("");

        try {
            const res = await fetch("http://192.168.1.46:5000/auth/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to send OTP");
            }

            // OTP sent → go to reset OTP page
            navigate("/reset-otp", { state: { email } });
        } catch (err) {
            setError(err.message);
        }
    };


    return (
        <>
            <div className={styles.fpWrapper}>
                <div className={styles.fpCard}>
                    {!sent ? (
                        <>
                            <h1>Forgot your password?</h1>
                            <p className={styles.subText}>
                                Enter your work email and we’ll send you a secure one‑time passcode (OTP).

                            </p>

                            <form onSubmit={handleSubmit} className={styles.form}>
                                <div className={styles.inputGroup}>
                                    <label>Email address</label>
                                    <input
                                        type="email"
                                        placeholder="you@company.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                {error && <p className={styles.error}>{error}</p>}

                                <button
                                    type="submit"
                                    className={styles.primaryBtn}
                                >
                                    Send OTP
                                </button>


                            </form>

                            <p className={styles.helper}>
                                Remembered it?{" "}
                                <NavLink to="/login" className={styles.loginLink}>
                                    Back to login
                                </NavLink>
                            </p>

                        </>
                    ) : (
                        <div className={styles.sentState}>
                            <h1>Check your inbox</h1>
                            <p className={styles.subText}>
                                We’ve sent a password reset link to <b>{email}</b>.
                            </p>
                            <p className={styles.helper}>
                                Didn’t receive it? <span>Resend</span>
                            </p>
                        </div>
                    )}
                </div>
            </div>


        </>
    )
}