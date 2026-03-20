import React, { useState, useEffect, useCallback } from "react";
import styles from "./profile.module.css";
import {
    User,
    Building2,
    Mail,
    Phone,
    Shield,
    MapPin,
    Globe,
    Edit3,
    Save,
    X,
    Camera,
    Briefcase,
    Clock,
    Users
} from "lucide-react";
import api from "@/api/axios";

export const Profile = ({ branch }) => {
    const [activeTab, setActiveTab] = useState("personal");
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    const [userData, setUserData] = useState({
        name: "",
        email: "",
        role: "",
        phone: "",
        location: "",
        joinedDate: ""
    });

    const [orgData, setOrgData] = useState({
        name: "",
        industry: "",
        website: "",
        address: "",
        totalEmployees: "",
        founded: "",
        hq: ""
    });

    const getAuthHeader = () => {
        const token = localStorage.getItem("token");
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    const fetchProfile = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get("/api/profile", {
                headers: getAuthHeader()
            });
            const { user, organization } = response.data;
            setUserData(user);
            setOrgData(organization);
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleSave = () => {
        setIsEditing(false);
        // Logic to persist data would go here
    };

    if (loading) {
        return <div className={styles.loading}>Loading profile...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.titleSection}>
                    <h2>Settings Hub</h2>
                    <p>Manage your account and organization preferences</p>
                </div>
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === "personal" ? styles.activeTab : ""}`}
                        onClick={() => setActiveTab("personal")}
                    >
                        <User size={18} /> Personal Profile
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === "organization" ? styles.activeTab : ""}`}
                        onClick={() => setActiveTab("organization")}
                    >
                        <Building2 size={18} /> Organization Details
                    </button>
                </div>
            </div>

            <div className={styles.content}>
                {activeTab === "personal" ? (
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div className={styles.profileHeader}>
                                <div className={styles.avatarContainer}>
                                    <div className={styles.avatar}>{userData.name?.charAt(0) || "U"}</div>
                                    {isEditing && (
                                        <button className={styles.cameraBtn}>
                                            <Camera size={14} />
                                        </button>
                                    )}
                                </div>
                                <div className={styles.profileMain}>
                                    <h3>{userData.name}</h3>
                                    <span className={styles.badge}>{userData.role}</span>
                                </div>
                            </div>
                            <button
                                className={styles.editBtn}
                                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                            >
                                {isEditing ? <><Save size={16} /> Save</> : <><Edit3 size={16} /> Edit Profile</>}
                            </button>
                        </div>

                        <div className={styles.detailsGrid}>
                            <div className={styles.detailItem}>
                                <label><User size={14} /> Full Name</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={userData.name}
                                        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                                    />
                                ) : (
                                    <span>{userData.name}</span>
                                )}
                            </div>
                            <div className={styles.detailItem}>
                                <label><Mail size={14} /> Email Address</label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        value={userData.email}
                                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                    />
                                ) : (
                                    <span>{userData.email}</span>
                                )}
                            </div>
                            <div className={styles.detailItem}>
                                <label><Phone size={14} /> Contact Number</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={userData.phone}
                                        onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                                    />
                                ) : (
                                    <span>{userData.phone}</span>
                                )}
                            </div>
                            <div className={styles.detailItem}>
                                <label><MapPin size={14} /> Location</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={userData.location}
                                        onChange={(e) => setUserData({ ...userData, location: e.target.value })}
                                    />
                                ) : (
                                    <span>{userData.location}</span>
                                )}
                            </div>
                            <div className={styles.detailItem}>
                                <label><Briefcase size={14} /> Primary Branch</label>
                                <span>{branch?.name || "Hyderabad"}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <label><Clock size={14} /> Member Since</label>
                                <span>{userData.joinedDate}</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className={styles.card}>
                        <div className={styles.orgHeader}>
                            <div className={styles.orgInfo}>
                                <div className={styles.orgLogo}>{orgData.name?.charAt(0)}</div>
                                <div className={styles.orgTitle}>
                                    <h3>{orgData.name}</h3>
                                    <p>{orgData.industry}</p>
                                </div>
                            </div>
                            <div className={styles.orgStats}>
                                <div className={styles.miniStat}>
                                    <Users size={14} /> <span>{orgData.totalEmployees}+ Team</span>
                                </div>
                                <div className={styles.miniStat}>
                                    <Globe size={14} /> <span>{orgData.founded}</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.detailsGrid}>
                            <div className={styles.detailItem}>
                                <label><Building2 size={14} /> Legal Name</label>
                                <span>{orgData.name} LLC</span>
                            </div>
                            <div className={styles.detailItem}>
                                <label><Briefcase size={14} /> Industry</label>
                                <span>{orgData.industry}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <label><Globe size={14} /> Website</label>
                                <span className={styles.link}>{orgData.website}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <label><MapPin size={14} /> Headquarters</label>
                                <span>{orgData.hq}</span>
                            </div>
                            <div className={styles.detailItem} style={{ gridColumn: "span 2" }}>
                                <label><MapPin size={14} /> Registered Office Address</label>
                                <span>{orgData.address}</span>
                            </div>
                        </div>

                        <div className={styles.branchSection}>
                            <h4>Active Branches</h4>
                            <div className={styles.branchChips}>
                                {["Hyderabad", "Warangal", "Bangalore", "Mysore"].map(b => (
                                    <div key={b} className={`${styles.branchChip} ${b === branch?.name ? styles.activeChip : ""}`}>
                                        {b}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
