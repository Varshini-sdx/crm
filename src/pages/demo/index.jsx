import React from "react";
import "./demo.css";

const Demo = () => {
    return (
        <div className="demo-container">
            <header className="demo-header">
                <h1>The Future of Your CRM</h1>
                <p>Pick the theme that matches your brand's energy. Each can be customized further.</p>
            </header>

            {/* VANGUARD THEME */}
            <section className="demo-section vanguard">
                <div className="demo-content">
                    <span className="badge">Bold Vanguard</span>
                    <h2>Aesthetic & Unique</h2>
                    <p>Designed for those who want to break the "corporate blue" mold. This theme feels premium, creative, and fast.</p>
                    
                    <div className="preview-layout">
                        <div className="preview-card">
                            <div className="card-header">
                                <span className="card-title">Monthly Revenue</span>
                                <span className="card-percent">+14.5%</span>
                            </div>
                            <div className="card-value">$124,500</div>
                            <div className="chart-mock">
                                <div className="chart-bar" style={{ width: '75%', background: 'linear-gradient(90deg, #8b5cf6, #f97316)' }}></div>
                            </div>
                        </div>
                        
                        <div className="preview-buttons">
                            <button className="btn primary-btn">Launch Campaign</button>
                            <button className="btn secondary-btn">View Metrics</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* SLEEK THEME */}
            <section className="demo-section sleek">
                <div className="demo-content">
                    <span className="badge">Sleek Professional</span>
                    <h2>Polished & Refined</h2>
                    <p>A deep midnight palette that exudes trust and reliability. Minimal, clean, and perfectly balanced for long work sessions.</p>
                    
                    <div className="preview-layout">
                        <div className="preview-card">
                            <div className="card-header">
                                <span className="card-title">Open Deals</span>
                                <span className="card-percent">28 Total</span>
                            </div>
                            <div className="card-value">22 Active</div>
                            <div className="chart-mock">
                                <div className="chart-bar" style={{ width: '60%', background: 'linear-gradient(90deg, #6366f1, #7c3aed)' }}></div>
                            </div>
                        </div>
                        
                        <div className="preview-buttons">
                            <button className="btn primary-btn">New Project</button>
                            <button className="btn secondary-btn">Settings</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* CYBER THEME */}
            <section className="demo-section cyber">
                <div className="demo-content">
                    <span className="badge">Cyber Luxe</span>
                    <h2>Futuristic & Sharp</h2>
                    <p>Electric cyan combined with deep magenta for a look that feels like it's from the next decade. High visibility and high impact.</p>
                    
                    <div className="preview-layout">
                        <div className="preview-card">
                            <div className="card-header">
                                <span className="card-title">Retention Rate</span>
                                <span className="card-percent">98.2%</span>
                            </div>
                            <div className="card-value">94.5%</div>
                            <div className="chart-mock">
                                <div className="chart-bar" style={{ width: '90%', background: 'linear-gradient(90deg, #06b6d4, #d946ef)' }}></div>
                            </div>
                        </div>
                        
                        <div className="preview-buttons">
                            <button className="btn primary-btn">Analyze Data</button>
                            <button className="btn secondary-btn">History</button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Demo;
