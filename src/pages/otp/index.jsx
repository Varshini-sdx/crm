import React, { useState } from "react";

import { useNavigate, useLocation } from "react-router-dom";

import styles from "./otp.module.css";
import bgImg from "../../assets/otp_img.jpg";

export default function Otp() {
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    {/* const handleVerify = (e) => {
        e.preventDefault();
        console.log("Entered OTP:", otp);
    };

    const handleChange = (e) => {
  const value = e.target.value;

  // Allow only digits
  if (/^\d*$/.test(value)) {
    setOtp(value);
    setError("");
  } else {
    setError("Only numbers are allowed");
  }
}; */}

    const handleChange = (e) => {
        const value = e.target.value;

        if (/^\d*$/.test(value)) {
            setOtp(value);
            setError("");
        } else {
            setError("Only numbers are allowed");
        }
    };


    const handleVerify = async (e) => {
        e.preventDefault();
        setError("");

        if (otp.length !== 6) {
            setError("Please enter a 6-digit OTP");
            return;
        }

        try {
            const res = await fetch("http://192.168.1.18:5000/auth/verify-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    otp,
                }),
            });

            const data = await res.json();

            if (res.status === 409) {
                // Account already verified → send user to login
                navigate("/login");
                return;
            }

            if (!res.ok) {
                throw new Error(data.message || "Invalid OTP");
            }

            // OTP verified → go to login
            navigate("/login");
        } catch (err) {
            setError(err.message);
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


                        <button type="submit">Verify</button>
                    </form>

                    <p className={styles.resend}>
                        Didn’t receive it? <span>Resend OTP</span>
                    </p>
                </div>
            </div>
        </>
    );
}
