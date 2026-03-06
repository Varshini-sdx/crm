import React, { useState } from 'react';
import styles from './settings.module.css';
import {
    Layout,
    Bell,
    ShieldCheck,
    Users,
    Puzzle,
    CreditCard,
    ArrowUpRight,
    X,
    Save,
    Check,
    Activity
} from 'lucide-react';

export const Settings = ({ branch, setActive }) => {
    const [selectedCategory, setSelectedCategory] = useState(null);

    const categories = [
        {
            id: 'auditLogs',
            title: 'Audit Logs',
            desc: 'Track user actions, changes, and security events across the workspace.',
            icon: <Activity size={24} />,
            status: 'Monitoring',
            type: 'auditLogs',
            navigateTo: 'AuditLogs'
        },
        {
            id: 'workspace',
            title: 'Workspace Configuration',
            desc: 'Manage your branch details, timezones, and display preferences.',
            icon: <Layout size={24} />,
            status: 'Synced',
            type: 'workspace'
        },
        {
            id: 'notifications',
            title: 'Notification Center',
            desc: 'Configure how you receive alerts via email, WhatsApp, and browser.',
            icon: <Bell size={24} />,
            status: 'Active',
            type: 'notifications'
        },
        {
            id: 'security',
            title: 'Security & Privacy',
            desc: 'Update your passwords, two-factor auth, and data permissions.',
            icon: <ShieldCheck size={24} />,
            status: 'Secure',
            type: 'security'
        },
        {
            id: 'team',
            title: 'Roles & Permissions (RBAC)',
            desc: 'Define granular roles, access levels, and assign permissions to team members.',
            icon: <ShieldCheck size={24} />,
            status: 'Security',
            type: 'team',
            navigateTo: 'RBAC'
        },
        {
            id: 'integrations',
            title: 'Apps & Integrations',
            desc: 'Connect your favorite tools like Slack, WhatsApp API, and Google.',
            icon: <Puzzle size={24} />,
            status: '8 Connected',
            type: 'integrations'
        },
        {
            id: 'billing',
            title: 'Billing & Subscriptions',
            desc: 'Manage your plan, payment methods, and view transaction history.',
            icon: <CreditCard size={24} />,
            status: 'Pro Plan',
            type: 'billing',
            navigateTo: 'Billing'
        }
    ];

    const renderDrawerContent = () => {
        if (!selectedCategory) return null;

        switch (selectedCategory.id) {
            case 'workspace':
                return (
                    <div className={styles.drawerBody}>
                        <div className={styles.inputGroup}>
                            <label>Branch Name</label>
                            <input type="text" defaultValue={branch?.name || "Main Branch"} />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Timezone</label>
                            <select defaultValue="IST">
                                <option value="IST">Asia/Kolkata (IST)</option>
                                <option value="UTC">UTC / GMT</option>
                                <option value="PST">Pacific Standard Time (PST)</option>
                            </select>
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Default Currency</label>
                            <select defaultValue="INR">
                                <option value="INR">Indian Rupee (₹)</option>
                                <option value="USD">US Dollar ($)</option>
                            </select>
                        </div>
                    </div>
                );
            case 'notifications':
                return (
                    <div className={styles.drawerBody}>
                        {['Email Notifications', 'WhatsApp Alerts', 'Browser Push', 'Weekly Reports'].map(item => (
                            <div key={item} className={styles.toggleRow}>
                                <span>{item}</span>
                                <div className={styles.toggleActive}><Check size={14} /></div>
                            </div>
                        ))}
                    </div>
                );
            default:
                return (
                    <div className={styles.drawerBody}>
                        <p className={styles.placeholder}>Configuration for {selectedCategory.title} will be available soon.</p>
                    </div>
                );
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Workspace settings</h2>
                <p>Customize and manage your workspace for <strong>{branch?.name || 'Main'} Branch</strong></p>
            </div>

            <div className={styles.settingsGrid}>
                {categories.map((cat) => (
                    <div
                        key={cat.id}
                        className={styles.card}
                        onClick={() => {
                            if (cat.navigateTo && setActive) {
                                setActive(cat.navigateTo);
                            } else {
                                setSelectedCategory(cat);
                            }
                        }}
                    >
                        <div className={`${styles.iconWrapper} ${styles[cat.type]}`}>
                            {cat.icon}
                        </div>
                        <div className={styles.cardContent}>
                            <h3>{cat.title}</h3>
                            <p>{cat.desc}</p>
                        </div>
                        <div className={styles.cardFooter}>
                            <span className={styles.status}>{cat.status}</span>
                            <span className={`${styles.action} ${styles[cat.type + 'Action']}`}>
                                Configure <ArrowUpRight size={14} />
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Config Drawer */}
            {selectedCategory && (
                <div className={styles.drawerOverlay} onClick={() => setSelectedCategory(null)}>
                    <div className={styles.drawer} onClick={e => e.stopPropagation()}>
                        <div className={styles.drawerHeader}>
                            <div className={`${styles.drawerIcon} ${styles[selectedCategory.type]}`}>
                                {selectedCategory.icon}
                            </div>
                            <div className={styles.drawerTitle}>
                                <h3>{selectedCategory.title}</h3>
                                <p>{selectedCategory.status}</p>
                            </div>
                            <button className={styles.closeBtn} onClick={() => setSelectedCategory(null)}>
                                <X size={20} />
                            </button>
                        </div>

                        {renderDrawerContent()}

                        <div className={styles.drawerFooter}>
                            <button className={styles.cancelBtn} onClick={() => setSelectedCategory(null)}>Cancel</button>
                            <button className={styles.saveBtn} onClick={() => setSelectedCategory(null)}>
                                <Save size={16} /> Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
