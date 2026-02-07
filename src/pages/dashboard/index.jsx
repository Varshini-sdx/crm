import React, { useState } from "react";
import styles from "./dashboard.module.css";
import { useNavigate } from "react-router-dom";
import Main from "../dashboard components/main";
import Workspace from "../workspace components/workspace";




const fakeOrg = {
    name: "Acme Corp",
    branches: [
        { id: 1, name: "Hyderabad", state: "Telangana" },
        { id: 2, name: "Warangal", state: "Telangana" },
        { id: 3, name: "Bangalore", state: "Karnataka" },
    ],
};

const navItems = [
    "Dashboard",
    "Leads",
    "Deals",
    "Tasks",
    "Contacts",
    "Reports",
    "Calendar",
    "Workspace",
    "Team",
    "Inbox",
    "Organization",
    "Campaigns",
    "Settings",
];


const workspace = {
    states: [
        {
            name: "Telangana",
            branches: ["Hyderabad", "Warangal"],
        },
        {
            name: "Karnataka",
            branches: ["Bangalore", "Mysore"],
        },
    ],
    users: [
        "Varshini (Admin)",
        "Ravi (Manager – Hyderabad)",
        "Anu (User – Bangalore)",
    ],
};



export default function Dashboard() {

    const [active, setActive] = useState("Dashboard");
    const [branch, setBranch] = useState(fakeOrg.branches[0]);


    const [openState, setOpenState] = useState(null);
    const [openWorkspace, setOpenWorkspace] = useState(true);


    const renderContent = () => {
        switch (active) {
            case "Dashboard":
                return (
                    <>
                        <h2>Overview</h2>
                        <div className={styles.cards}>
                            <div className={styles.statCard}>Leads<br /><b>128</b></div>
                            <div className={styles.statCard}>Deals<br /><b>32</b></div>
                            <div className={styles.statCard}>Tasks<br /><b>14</b></div>
                        </div>
                    </>
                );
            case "Leads":
                return <h2>All Leads – {branch.name}</h2>;
            case "Deals":
                return <h2>Active Deals</h2>;
            case "Tasks":
                return <h2>Your Tasks</h2>;
            case "Contacts":
                return <h2>Contacts</h2>;
            case "Reports":
                return <h2>Reports & Insights</h2>;
            case "Calendar":
                return <h2>Calendar</h2>;
            case "Workspace Homepage":
                return <h2>Workspage management</h2>;
            case "Team":
                return <h2>Team Management</h2>;
            case "Inbox":
                return <h2>Inbox</h2>;
            case "Organization":
                return <h2>Organization Settings</h2>;
            case "Campaigns":
                return <h2>Marketing Campaigns</h2>;
            case "Settings":
                return <h2>App Settings</h2>;
            default:
                return null;
        }
    };


    return (
        <>


            <div className={styles.layout}>
                {/* Sidebar */}
                <aside className={styles.sidebar}>

                    <div className={styles.orgBlock}>
                        <h3 className={styles.orgName}>{fakeOrg.name}</h3>

                        <div className={styles.branchSwitcher}>
                            <button
                                className={styles.branchPill}
                                onClick={() => setOpenState(openState === "switcher" ? null : "switcher")}
                            >
                                {branch.state} · {branch.name}
                                <span className={styles.chevron}>⌄</span>
                            </button>

                            {openState === "switcher" && (
                                <div className={styles.branchDropdown}>
                                    {workspace.states.map((s) => (
                                        <div key={s.name} className={styles.ddState}>
                                            <div className={styles.ddStateName}>{s.name}</div>
                                            {s.branches.map((b) => (
                                                <div
                                                    key={b}
                                                    className={styles.ddBranch}
                                                    onClick={() => {
                                                        setBranch({ name: b, state: s.name });
                                                        setOpenState(null);
                                                    }}
                                                >
                                                    {b}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>


                    <nav className={styles.nav}>
                        {/* Main */}
                        {["Dashboard", "Leads", "Deals", "Tasks", "Contacts", "Reports", "Calendar"].map(item => (
                            <button
                                key={item}
                                className={`${styles.navItem} ${active === item ? styles.active : ""}`}
                                onClick={() => setActive(item)}
                            >
                                {item}
                            </button>
                        ))}

                        <div className={styles.divider} />

                        {/* Workspace */}
                        <div className={styles.workspaceSection}>
                            <div className={styles.workspaceHeading}>Workspace</div>



                            {/* States Hover */}

                            <div className={styles.statesWrap}>
                                <div className={styles.navItem}>
                                    States <span className={styles.arrow}>▸</span>
                                </div>

                                <div className={styles.statesDropdown}>
                                    {workspace.states.map(s => (
                                        <div key={s.name} className={styles.stateBlock}>
                                            <div className={styles.stateName}>{s.name}</div>

                                            {s.branches.map(b => (
                                                <div
                                                    key={b}
                                                    className={styles.branchItem}
                                                    onClick={() => setBranch({ name: b, state: s.name })}
                                                >
                                                    {b}
                                                </div>
                                            ))}

                                            <div className={styles.addMini}>+ Add Branch</div>
                                        </div>
                                    ))}

                                    <div className={styles.addState}>+ Add State</div>
                                </div>
                            </div>

                            {/*<button className={styles.navItem}>Workspace</button>
                            <button className={styles.navItem}>Team</button>
                            <button className={styles.navItem}>Roles & Permissions</button>
                            <button className={styles.navItem}>Campaigns</button>
                            <button className={styles.navItem}>Settings</button> */}

                            <button
                                className={`${styles.navItem} ${active === "Workspace" ? styles.active : ""}`}
                                onClick={() => setActive("Workspace")}
                            >
                                Workspace
                            </button>

                            <button
                                className={`${styles.navItem} ${active === "Team" ? styles.active : ""}`}
                                onClick={() => setActive("Team")}
                            >
                                Team
                            </button>

                            <button
                                className={`${styles.navItem} ${active === "Inbox" ? styles.active : ""}`}
                                onClick={() => setActive("Inbox")}
                            >
                                Inbox
                            </button>

                            <button
                                className={`${styles.navItem} ${active === "Organization" ? styles.active : ""}`}
                                onClick={() => setActive("Organization")}
                            >
                                Organization
                            </button>

                            <button
                                className={`${styles.navItem} ${active === "Campaigns" ? styles.active : ""}`}
                                onClick={() => setActive("Campaigns")}
                            >
                                Campaigns
                            </button>

                            <button
                                className={`${styles.navItem} ${active === "Settings" ? styles.active : ""}`}
                                onClick={() => setActive("Settings")}
                            >
                                Settings
                            </button>

                        </div>
                    </nav>


                    {/* Bottom */}
                    <div className={styles.bottomNav}>
                        <div className={styles.divider} />
                        <button className={styles.navItem}>Profile</button>
                        <button className={styles.logout}>Logout</button>
                    </div>
                </aside>

                {/* Main Area */}
                <main className={styles.main}>
                    <div className={styles.workspace}>
                        <div className={styles.header}>
                            <h1>{active}</h1>
                            <span className={styles.branchTag}>
                                {branch.name}, {branch.state}
                            </span>
                        </div>

                        <div className={styles.content}>
                            {/*{renderContent()} */}

                            <div className={styles.mainContent}>
                                {["Dashboard", "Leads", "Deals", "Tasks", "Contacts", "Reports", "Calendar"].includes(active) ? (
                                    <Main active={active} branch={branch} />
                                ) : (
                                    <Workspace active={active} branch={branch} />
                                )}
                            </div>

                        </div>
                    </div>
                </main>
            </div>


        </>
    )
}