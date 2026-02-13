import React, { useState, useEffect } from "react";
import styles from "./changePassword.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function ChangePassword() {
    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email || localStorage.getItem("resetEmail");
    const otp = location.state?.otp;

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // 🔐 Protect route
    useEffect(() => {
        if (!email || !otp) {
            navigate("/forgot-password");
        }
    }, [email, otp, navigate]);

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
        setLoading(true);

        try {
            await axios.post("http://192.168.1.15:5000/auth/reset-password", {
                email,
                otp,
                new_password: password,
                confirm_password: confirm,
            });

            // 🧹 cleanup
            localStorage.removeItem("resetEmail");

            navigate("/login");

        } catch (err) {
            setError(err.response?.data?.message || "Failed to update password");
        } finally {
            setLoading(false);
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
                        autoComplete="new-password"
                        required
                    />

                    <input
                        type="password"
                        placeholder="Confirm new password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        autoComplete="new-password"
                        required
                    />

                    {error && <p className={styles.error}>{error}</p>}

                    <button
                        type="submit"
                        className={styles.primaryBtn}
                        disabled={loading}
                    >
                        {loading ? "Updating..." : "Update Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}
