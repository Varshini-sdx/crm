import React, { useState } from "react";
import styles from "./billing.module.css";
import {
    ArrowLeft,
    CreditCard,
    CheckCircle,
    Download,
    AlertCircle,
    Users,
    Activity,
    HardDrive,
    FileText
} from "lucide-react";

export const Billing = ({ setActive }) => {

    const USAGE_LIMITS = [
        { label: "Users", used: 6, max: 10, icon: <Users size={16} /> },
        { label: "Leads", used: 1240, max: 5000, icon: <Activity size={16} /> },
        { label: "Storage", used: 8, max: 20, icon: <HardDrive size={16} />, suffix: "GB" },
        { label: "Reports Generated", used: 25, max: 50, icon: <FileText size={16} /> }
    ];

    const PLANS = [
        {
            name: "Basic",
            price: "₹999",
            features: ["3 Users", "1,000 Leads", "Basic Reports"],
            current: false
        },
        {
            name: "Professional",
            price: "₹1999",
            features: ["10 Users", "5,000 Leads", "Advanced Reports", "Email Support"],
            current: true
        },
        {
            name: "Enterprise",
            price: "Custom",
            features: ["Unlimited Users", "Unlimited Leads", "API Access", "Dedicated Success Manager"],
            current: false
        }
    ];

    const BILLING_HISTORY = [
        { id: "INV-1021", date: "Jan 15, 2026", plan: "Professional", amount: "₹1999", status: "Paid" },
        { id: "INV-1020", date: "Dec 15, 2025", plan: "Professional", amount: "₹1999", status: "Paid" },
        { id: "INV-1019", date: "Nov 15, 2025", plan: "Professional", amount: "₹1999", status: "Paid" },
    ];

    return (
        <div className={styles.pageContainer}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.titleSection}>
                    <button className={styles.backBtn} onClick={() => setActive && setActive("Settings")}>
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1>Billing & Subscriptions</h1>
                        <p>Manage your current plan, usage limits, and payment methods.</p>
                    </div>
                </div>
            </div>

            <div className={styles.twoColumnLayout}>
                {/* LEFT COLUMN: Current Plan & Usage */}
                <div className={styles.leftColumn}>
                    {/* Current Plan Section */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2>Current Plan</h2>
                            <span className={styles.badgePro}>Professional</span>
                        </div>
                        <div className={styles.planDetailsGrid}>
                            <div className={styles.detailItem}>
                                <span className={styles.label}>Billing Cycle</span>
                                <span className={styles.value}>Monthly</span>
                            </div>
                            <div className={styles.detailItem}>
                                <span className={styles.label}>Next Billing Date</span>
                                <span className={styles.value}>Feb 15, 2026</span>
                            </div>
                            <div className={styles.detailItem}>
                                <span className={styles.label}>Amount</span>
                                <span className={styles.valueHighlight}>₹1,999</span>
                            </div>
                        </div>
                        <div className={styles.cardActions}>
                            <button className={styles.primaryBtn}>Upgrade Plan</button>
                            <button className={styles.outlineBtn}>Cancel Plan</button>
                        </div>
                    </div>

                    {/* Usage Limits Section */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2>Usage Limits</h2>
                            <p className={styles.subtitle}>Track your workspace limits</p>
                        </div>
                        <div className={styles.usageList}>
                            {USAGE_LIMITS.map((item, index) => {
                                const percentage = Math.round((item.used / item.max) * 100);
                                return (
                                    <div key={index} className={styles.usageItem}>
                                        <div className={styles.usageItemHeader}>
                                            <div className={styles.usageLabel}>
                                                <div className={styles.usageIcon}>{item.icon}</div>
                                                <span>{item.label}</span>
                                            </div>
                                            <div className={styles.usageStats}>
                                                <strong>{item.used.toLocaleString()}</strong> / {item.max.toLocaleString()} {item.suffix}
                                            </div>
                                        </div>
                                        <div className={styles.progressBarBg}>
                                            <div
                                                className={styles.progressBarFill}
                                                style={{ width: `${percentage}%`, background: percentage > 85 ? '#f43f5e' : '#6b5cff' }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Payment Method */}
                <div className={styles.rightColumn}>
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2>Payment Method</h2>
                        </div>
                        <div className={styles.paymentMethodCard}>
                            <div className={styles.cardIconWrapper}>
                                <CreditCard size={28} />
                            </div>
                            <div className={styles.cardInfo}>
                                <div className={styles.cardNumber}>•••• •••• •••• 1234</div>
                                <div className={styles.cardExpiry}>Expires 12/28</div>
                            </div>
                            <div className={styles.cardType}>VISA</div>
                        </div>
                        <div className={styles.cardActions}>
                            <button className={styles.secondaryBtn}>Update Payment Method</button>
                            <button className={styles.textBtn}>Add New Card</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Available Plans Section */}
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <h2>Available Plans</h2>
                    <p className={styles.subtitle}>Find the perfect plan for your business</p>
                </div>
                <div className={styles.pricingGrid}>
                    {PLANS.map((plan, i) => (
                        <div key={i} className={`${styles.pricingCard} ${plan.current ? styles.pricingCardActive : ''}`}>
                            {plan.current && <span className={styles.currentBadge}>Current Plan</span>}
                            <h3>{plan.name}</h3>
                            <div className={styles.price}>
                                <span className={styles.priceAmount}>{plan.price}</span>
                                {plan.price !== "Custom" && <span className={styles.priceCycle}>/mo</span>}
                            </div>
                            <ul className={styles.featuresList}>
                                {plan.features.map((feature, j) => (
                                    <li key={j}>
                                        <CheckCircle size={16} className={styles.featureIcon} />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <button className={plan.current ? styles.outlineBtn : styles.primaryBtn}>
                                {plan.current ? "Manage Plan" : "Upgrade"}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Billing History Section */}
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <h2>Billing History</h2>
                    <p className={styles.subtitle}>View your recent transactions and invoices</p>
                </div>
                <div className={styles.tableWrapper}>
                    <table className={styles.billingTable}>
                        <thead>
                            <tr>
                                <th>Invoice ID</th>
                                <th>Date</th>
                                <th>Plan</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {BILLING_HISTORY.map((invoice, i) => (
                                <tr key={i}>
                                    <td className={styles.invoiceId}>{invoice.id}</td>
                                    <td className={styles.mutedText}>{invoice.date}</td>
                                    <td>{invoice.plan}</td>
                                    <td className={styles.amountText}>{invoice.amount}</td>
                                    <td>
                                        <span className={styles.badgeSuccess}>
                                            <CheckCircle size={12} className={styles.inlineIcon} />
                                            {invoice.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button className={styles.downloadBtn}>
                                            <Download size={16} /> Download
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Billing;
