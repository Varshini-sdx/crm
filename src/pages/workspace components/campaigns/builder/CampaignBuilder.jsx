import React, { useState } from "react";
import styles from "./campaignBuilder.module.css";
import { X } from "lucide-react";

import SchedulerStep from "./SchedulerStep";
import AudienceStep from "./AudienceStep";
import EmailStep from "./EmailStep";
import ReviewStep from "./ReviewStep";

export default function CampaignBuilder({ onClose, campaignName }) {
    const [step, setStep] = useState(1);
    const [campaignData, setCampaignData] = useState({
        sendType: "now",
        date: "",
        time: "",
        timezone: "IST",
        audience_type: "",
        email: {
            subject: "",
            body: "",
            isEdited: false,
        },
    });

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <SchedulerStep
                        data={campaignData}
                        setData={setCampaignData}
                        next={() => setStep(2)}
                    />
                );
            case 2:
                return (
                    <AudienceStep
                        data={campaignData}
                        setData={setCampaignData}
                        next={() => setStep(3)}
                        back={() => setStep(1)}
                    />
                );
            case 3:
                return (
                    <EmailStep
                        data={campaignData}
                        setData={setCampaignData}
                        next={() => setStep(4)}
                        back={() => setStep(2)}
                    />
                );
            case 4:
                return (
                    <ReviewStep
                        data={campaignData}
                        back={() => setStep(3)}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.container} onClick={(e) => e.stopPropagation()}>
                <header className={styles.header}>
                    <div>
                        <h2>Campaign Builder</h2>
                        <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>{campaignName || "Untitled Campaign"}</div>
                    </div>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <X size={18} />
                    </button>
                </header>

                {/* Step Indicator */}
                <div style={{ display: "flex", padding: "1rem 2rem", background: "#f9fafb", borderBottom: "1px solid #f3f4f6" }}>
                    {[1, 2, 3, 4].map((s) => (
                        <div
                            key={s}
                            style={{
                                flex: 1,
                                height: "4px",
                                background: s <= step ? "#6b5cff" : "#e5e7eb",
                                margin: "0 4px",
                                borderRadius: "2px",
                                transition: "background 0.3s ease"
                            }}
                        />
                    ))}
                </div>

                {renderStep()}
            </div>
        </div>
    );
}
