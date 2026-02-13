import React, { useState } from "react";
import styles from "./forgotPassword.module.css";
import { NavLink, useNavigate } from "react-router-dom";

import axios from "axios";

export default function ForgotPassword() {

    const navigate = useNavigate();

    //  STATES
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    //  SUBMIT HANDLER
    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setError("");

        if (!email) {
            setError("Email is required");
            return;
        }

        try {
            setLoading(true);

            const res = await axios.post(
                "http://192.168.1.15:5000/auth/forgot-password",
                { email }
            );

            console.log("FORGOT PASSWORD RESPONSE:", res.data);

            // show success state
            setSent(true);

            // Save email for next steps
            localStorage.setItem("resetEmail", email);
            navigate("/reset-otp");

        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message || "Failed to send OTP"
            );
        } finally {
            setLoading(false);
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

                            <form onSubmit={handleForgotPassword} className={styles.form}>
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
                                    disabled={loading}
                                >
                                    {loading ? "Sending..." : "Send OTP"}
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