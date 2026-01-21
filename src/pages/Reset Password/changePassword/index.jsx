import React, { useState } from "react";
import styles from "./changePassword.module.css";
import { useNavigate, useLocation } from "react-router-dom";


export default function ChangePassword() {

    const navigate = useNavigate();
    
    const location = useLocation();
const { email, otp } = location.state || {};

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        if (password !== confirm) {
            setError("Passwords do not match.");
            return;
        }

        setError("");

        try {
            const res = await fetch("http://192.168.1.18:5000/auth/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    otp,
                    password,
                }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || "Failed to update password");
            }

            // Success → go back to login
            navigate("/login");

        } catch (err) {
            setError(err.message);
        }
    };


    return (
        <div className={styles.wrapper}>
            <div className={styles.card}>
                <p className={styles.small}>Final step</p>
                <h1 className={styles.heading}>Set a new password</h1>
                <p className={styles.subtext}>
                    Create a strong password to secure your CRM account.
                </p>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <input
                        type="password"
                        placeholder="New password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Confirm new password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        required
                    />

                    {error && <p className={styles.error}>{error}</p>}

                    <button type="submit" className={styles.primaryBtn}>
                        Update Password
                    </button>
                </form>
            </div>
        </div>
    );
}
