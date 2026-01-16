import React, { useState } from "react";
import styles from "./resetOtp.module.css";
import { useNavigate, NavLink } from "react-router-dom";


export default function ResetOtp() {

    const navigate = useNavigate();

    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const value = e.target.value;

        // Allow only numbers
        if (!/^\d*$/.test(value)) {
            setError("Only numbers are allowed");
            return;
        }

        setError("");
        setOtp(value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (otp.length !== 6) {
            setError("Please enter the 6-digit code");
            return;
        }

        console.log("OTP Submitted:", otp);

        navigate("/change-password");
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.card}>
                <p className={styles.small}>Almost there</p>
                <h1 className={styles.heading}>Verify your email</h1>
                <p className={styles.subtext}>
                    We’ve sent a 6-digit verification code to your email.
                </p>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <input
                        type="text"
                        value={otp}
                        onChange={handleChange}
                        maxLength={6}
                        placeholder="Enter 6-digit code"
                        className={styles.otpInput}
                    />

                    {error && <p className={styles.error}>{error}</p>}

                    <button type="submit" className={styles.primaryBtn}>
                        Verify Code
                    </button>
                </form>

                <p className={styles.helper}>
                    Didn’t receive it? <span className={styles.resend}>Resend OTP</span>
                </p>

                <p className={styles.helper}>
                    Remembered it?{" "}
                    <NavLink to="/login" className={styles.loginLink}>
                        Back to login
                    </NavLink>
                </p>
            </div>
        </div>
    );
}
