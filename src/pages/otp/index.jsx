import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

import styles from "./otp.module.css";
import bgImg from "../../assets/otp_img.jpg";

export default function Otp() {
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [info, setInfo] = useState("");
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || localStorage.getItem("resetEmail");

    const handleChange = (e) => {
        setOtp(e.target.value);
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setError("");

        if (!otp || otp.length !== 6) {
            setError("Please enter a valid 6-digit OTP");
            return;
        }

        if (!email) {
            setError("Session expired. Please restart password reset.");
            return;
        }

        try {
            setLoading(true);

            const res = await axios.post(
                "http://192.168.1.15:5000/auth/verify-otp",
                {
                    email,
                    otp, // change to code: otp if backend expects that
                }
            );

            if (res.data.success === false) {
                setError(res.data.message || "Invalid or expired OTP");
                return;
            }

            localStorage.removeItem("resetEmail");
            navigate("/login", { replace: true });

        } catch (err) {
            setError(err.response?.data?.message || "Invalid or expired OTP");
        } finally {
            setLoading(false);
        }
    };



    const handleResend = async () => {
        setError("");
        setInfo("");
        setResending(true);

        try {
            await axios.post(
                "http://192.168.1.15:5000/auth/forgot-password",
                { email }
            );

            setInfo("A new OTP has been sent to your email.");
        } catch (err) {
            setError("Failed to resend OTP");
        } finally {
            setResending(false);
        }
    };




    return (
        <>

            <div
                className={styles.otpWrapper}
                style={{ backgroundImage: `url(${bgImg})` }}
            >
                <div className={styles.otpCard}>
                    <p className={styles.smallText}>Almost there</p>
                    <h2>Verify to access your CRM workspace</h2>
                    <p className={styles.subText}>
                        We’ve sent a 6-digit code to your email.
                    </p>

                    <form onSubmit={handleVerify}>
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={handleChange}
                            maxLength={6}
                            required
                        />
                        {error && <p className={styles.errorText}>{error}</p>}


                        <button type="submit" disabled={loading} style={{ opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}>
                            {loading ? "Verifying..." : "Verify"}
                        </button>
                    </form>

                    <p className={styles.resend}>
                        Didn’t receive it?{" "}
                        <span onClick={handleResend}>
                            {resending ? "Resending..." : "Resend OTP"}
                        </span>
                    </p>

                </div>
            </div>
        </>
    );
}
