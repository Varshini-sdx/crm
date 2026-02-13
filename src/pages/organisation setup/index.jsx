import React, { useState } from "react";
import axios from "axios";
import styles from "./organisationSetup.module.css";
import { useNavigate } from "react-router-dom";


export default function OrganisationSetup() {
    const navigate = useNavigate();

    const [errors, setErrors] = useState({});


    const [form, setForm] = useState({
        orgName: "",
        industry: "",
        size: "",
        country: "",
        state: "",
        city: "",
        name: "",
        phone: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};

        if (!form.orgName.trim()) newErrors.orgName = "Organization name is required";
        if (!form.industry) newErrors.industry = "Industry is required";
        if (!form.size) newErrors.size = "Company size is required";
        if (!form.country.trim()) newErrors.country = "Country is required";
        if (!form.state.trim()) newErrors.state = "State is required";
        if (!form.city.trim()) newErrors.city = "City is required";
        if (!form.name.trim()) newErrors.name = "Name is required";
        if (!form.phone.trim()) newErrors.phone = "Phone number is required";


        if (!/^\d{10}$/.test(form.phone)) {
            newErrors.phone = "Enter a valid 10-digit phone number";
        }


        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return;

        const payload = {
            organization_name: form.orgName,
            organization_size: form.size,
            industry: form.industry,
            phone: form.phone,
            country: form.country,
            state: form.state,
            city_or_branch: form.city,
            name: form.name,
        };



        const token = localStorage.getItem("token");

        if (!token) {
            console.error("No auth token found");
            return;
        }

        try {
            const response = await axios.post(
                "http://192.168.1.15:5000/api/organization/setup",
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("Organization setup success:", response.data);
            navigate("/dashboard");

        } catch (error) {
            console.error(
                "Error creating organization:",
                error.response?.data || error.message
            );
        }

    }

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
                                    <label>Organization name  <span style={{ color: "red" }}>*</span></label>
                                    <input
                                        name="orgName"
                                        placeholder="Acme Corp"
                                        value={form.orgName}
                                        onChange={handleChange}
                                    /* required */
                                    />
                                    {errors.orgName && <small style={{ color: "red" }}>{errors.orgName}</small>}
                                </div>

                                <div className={styles.inputGroup}>
                                    <label>Industry <span style={{ color: "red" }}>*</span></label>
                                    <select name="industry" value={form.industry} onChange={handleChange}>
                                        <option value="">Select</option>
                                        <option>Technology</option>
                                        <option>Finance</option>
                                        <option>Healthcare</option>
                                        <option>Education</option>
                                        <option>Retail</option>
                                    </select>
                                    {errors.industry && <small style={{ color: "red" }}>{errors.industry}</small>}
                                </div>

                                <div className={styles.inputGroup}>
                                    <label>Company size <span style={{ color: "red" }}>*</span></label>
                                    <select name="size" value={form.size} onChange={handleChange}>
                                        <option value="">Select</option>
                                        <option>1–10</option>
                                        <option>10–50</option>
                                        <option>50–200</option>
                                        <option>200+</option>
                                    </select>
                                    {errors.size && <small style={{ color: "red" }}>{errors.size}</small>}
                                </div>

                                <div className={styles.inputGroup}>
                                    <label>Country <span style={{ color: "red" }}>*</span></label>
                                    <input
                                        name="country"
                                        placeholder="India"
                                        value={form.country}
                                        onChange={handleChange}
                                    />
                                    {errors.country && <small style={{ color: "red" }}>{errors.country}</small>}
                                </div>

                                <div className={styles.inputGroup}>
                                    <label>State <span style={{ color: "red" }}>*</span></label>
                                    <input
                                        name="state"
                                        placeholder="Telangana"
                                        value={form.state}
                                        onChange={handleChange}
                                    />
                                    {errors.state && <small style={{ color: "red" }}>{errors.state}</small>}
                                </div>

                                <div className={styles.inputGroup}>
                                    <label>City / Branch <span style={{ color: "red" }}>*</span></label>
                                    <input
                                        name="city"
                                        placeholder="Hyderabad"
                                        value={form.city}
                                        onChange={handleChange}
                                    />
                                    {errors.city && <small style={{ color: "red" }}>{errors.city}</small>}
                                </div>
                            </div>
                        </div>

                        {/* Team Basics */}
                        {/* Contact Details */}
                        <div className={styles.section}>
                            <h3>Primary contact details</h3>

                            <div className={styles.grid}>
                                <div className={styles.inputGroup}>
                                    <label>Name <span style={{ color: "red" }}>*</span></label>
                                    <input
                                        name="name"
                                        placeholder="John Doe"
                                        value={form.name}
                                        onChange={handleChange}
                                    />
                                    {errors.name && (
                                        <small style={{ color: "red" }}>{errors.name}</small>
                                    )}
                                </div>

                                <div className={styles.inputGroup}>
                                    <label>Phone number <span style={{ color: "red" }}>*</span></label>
                                    <input
                                        name="phone"
                                        placeholder="+91 98765 43210"
                                        value={form.phone}
                                        onChange={handleChange}
                                    />
                                    {errors.phone && (
                                        <small style={{ color: "red" }}>{errors.phone}</small>
                                    )}
                                </div>
                            </div>
                        </div>


                        {/* CTA */}
                        <div className={styles.footer}>
                            <button
                                className={styles.addLaterBtn}
                                type="button"
                                onClick={() => navigate("/dashboard")}
                                style={{
                                    marginRight: "1rem",
                                    background: "transparent",
                                    border: "none",
                                    color: "#182d63",
                                    cursor: "pointer",
                                    fontWeight: 500,
                                }}
                            >
                                Add later
                            </button>

                            <button type="submit" className={styles.createBtn}>
                                Create Workspace →
                            </button>
                        </div>

                    </form>
                </div>
            </div>

        </>
    )
}