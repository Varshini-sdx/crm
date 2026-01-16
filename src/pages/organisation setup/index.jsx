import React, { useState } from "react";
import styles from "./organisationSetup.module.css";
import { useNavigate } from "react-router-dom";


export default function OrganisationSetup() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        orgName: "",
        industry: "",
        size: "",
        country: "",
        state: "",
        city: "",
        inviteEmail: "",
        role: "User",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Org Data:", form);
        // later: send to backend
        navigate("/dashboard"); // future route
    };
    return (
        <>

            <div className={styles.wrapper}>
                <div className={styles.card}>
                    {/* Header */}
                    <div className={styles.header}>
                        <span className={styles.step}>Basic Setup</span>
                        <h1>Set up your organization</h1>
                        <p>This helps us personalize your CRM workspace.</p>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        {/* Company Details */}
                        <div className={styles.section}>
                            <h3>Company details</h3>

                            <div className={styles.grid}>
                                <div className={styles.inputGroup}>
                                    <label>Organization name</label>
                                    <input
                                        name="orgName"
                                        placeholder="Acme Corp"
                                        value={form.orgName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className={styles.inputGroup}>
                                    <label>Industry</label>
                                    <select name="industry" value={form.industry} onChange={handleChange}>
                                        <option value="">Select</option>
                                        <option>Technology</option>
                                        <option>Finance</option>
                                        <option>Healthcare</option>
                                        <option>Education</option>
                                        <option>Retail</option>
                                    </select>
                                </div>

                                <div className={styles.inputGroup}>
                                    <label>Company size</label>
                                    <select name="size" value={form.size} onChange={handleChange}>
                                        <option value="">Select</option>
                                        <option>1–10</option>
                                        <option>10–50</option>
                                        <option>50–200</option>
                                        <option>200+</option>
                                    </select>
                                </div>

                                <div className={styles.inputGroup}>
                                    <label>Country</label>
                                    <input
                                        name="country"
                                        placeholder="India"
                                        value={form.country}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className={styles.inputGroup}>
                                    <label>State</label>
                                    <input
                                        name="state"
                                        placeholder="Telangana"
                                        value={form.state}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className={styles.inputGroup}>
                                    <label>City / Branch</label>
                                    <input
                                        name="city"
                                        placeholder="Hyderabad"
                                        value={form.city}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Team Basics */}
                        <div className={styles.section}>
                            <h3>Invite your first teammate (optional)</h3>
                            <div className={styles.inline}>
                                <input
                                    name="inviteEmail"
                                    placeholder="teammate@company.com"
                                    value={form.inviteEmail}
                                    onChange={handleChange}
                                />
                                <select name="role" value={form.role} onChange={handleChange}>
                                    <option>User</option>
                                    <option>Manager</option>
                                </select>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className={styles.footer}>
                            <button type="submit" className={styles.primaryBtn}>
                                Create Workspace →
                            </button>
                        </div>
                    </form>
                </div>
            </div>

        </>
    )
}