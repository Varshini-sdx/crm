import React, { useState, useEffect } from "react";
import styles from "./resetOtp.module.css";

import { useNavigate, NavLink } from "react-router-dom";


import axios from "axios";

export default function ResetOtp() {

    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [info, setInfo] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const email = localStorage.getItem("resetEmail");

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError("");

        if (!otp || otp.length !== 6) {
            setError("Please enter a valid 6-digit OTP");
            return;
        }

        try {
            setLoading(true);

            const res = await axios.post(
                "http://192.168.1.15:5000/auth/verify-reset-otp",
                { email, otp }
            );

            console.log("RESET OTP RESPONSE:", res.data);

            if (res.data.success === false) {
                setError(res.data.message || "Invalid or expired OTP");
                return;
            }

            navigate("/change-password", { state: { email, otp } });

        } catch (err) {
            setError(err.response?.data?.message || "Invalid or expired OTP");
        } finally {
            setLoading(false);
        }
    };


    const handleResend = async () => {
        setError("");
        setInfo("");

        try {
            await axios.post("http://192.168.1.15:5000/auth/forgot-password", {
                email,
            });

            setInfo("A new OTP has been sent to your email.");

        } catch (err) {
            setError(err.response?.data?.message || "Failed to resend OTP");
        }
    };



    return (
        <div className={styles.wrapper}>
            <div className={styles.card}>
                <p className={styles.small}>Almost there</p>
                <h1 className={styles.heading}>Verify your email</h1>
                <p className={styles.subtext}>
                    We’ve sent a 6-digit verification code to your email.
                </p>

                <form onSubmit={handleVerifyOtp} className={styles.form}>
                    <input
                        className={styles.otpInput}
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength={6}
                        placeholder="Enter 6-digit code"
                    />

                    {error && <p className={styles.error}>{error}</p>}
                    {info && <p className={styles.info}>{info}</p>}

                    <button type="submit" className={styles.primaryBtn}>
                        Verify Code
                    </button>
                </form>

                <p className={styles.helper}>
                    Didn’t receive it?{" "}
                    <span className={styles.resend} onClick={handleResend}>
                        Resend OTP
                    </span>
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
