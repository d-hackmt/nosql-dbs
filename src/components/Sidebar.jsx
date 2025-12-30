import React, { useState } from 'react';
import { Database, FileText, Key, Server, Share2, Activity, PlaySquare, Star, Twitter, TrendingUp, FolderOpen, Folder, X, ChevronLeft, Linkedin, Github } from 'lucide-react';

const Sidebar = ({ currentMode, setMode, currentView, setView, isOpen, toggle }) => {
    const [expanded, setExpanded] = useState({ general: true, text: true });

    const toggleSection = (section) => setExpanded(prev => ({ ...prev, [section]: !prev[section] }));

    return (
        <div className="sidebar">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                    <Database size={24} color="#3b82f6" />
                    <span>NoSQL Demo</span>
                </div>
                <button onClick={toggle} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.25rem', display: 'flex', alignItems: 'center' }}>
                    <ChevronLeft size={24} />
                </button>
            </div>

            <div className="nav-section">
                <select
                    value={currentMode}
                    onChange={(e) => { setMode(e.target.value); setView(e.target.value === "general" ? "doc" : "reviews"); }}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: '#1e293b', color: 'white', border: '1px solid #334155', marginTop: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}
                >
                    <option value="general">MODE: General NoSQL</option>
                    <option value="text">MODE: Text & NLP Data</option>
                </select>
            </div>

            <div className="scroll-area" style={{ flex: 1, overflowY: 'auto' }}>
                {/* General NoSQL Views */}
                {currentMode === 'general' && (
                    <>
                        <div className="nav-group">
                            <div className="nav-title" onClick={() => toggleSection('general')}>
                                CORE MODULES
                            </div>

                            <div className={`nav-item ${currentView === 'doc' ? 'active' : ''}`} onClick={() => setView('doc')}>
                                <FileText size={18} /> <span>Document DB</span>
                            </div>
                            {currentView === 'doc' && (
                                <div style={{ marginLeft: '2rem', fontSize: '0.8rem', color: '#64748b', borderLeft: '1px solid #334155', paddingLeft: '0.5rem', marginBottom: '0.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem' }}><Folder size={14} /> products</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem' }}><Folder size={14} /> inventory</div>
                                </div>
                            )}

                            <div className={`nav-item ${currentView === 'kv' ? 'active' : ''}`} onClick={() => setView('kv')}>
                                <Key size={18} /> <span>Key-Value Store</span>
                            </div>

                            <div className={`nav-item ${currentView === 'col' ? 'active' : ''}`} onClick={() => setView('col')}>
                                <Server size={18} /> <span>Column Store</span>
                            </div>

                            <div className={`nav-item ${currentView === 'graph' ? 'active' : ''}`} onClick={() => setView('graph')}>
                                <Share2 size={18} /> <span>Graph DB</span>
                            </div>

                            <div className={`nav-item ${currentView === 'sql' ? 'active' : ''}`} onClick={() => setView('sql')}>
                                <Activity size={18} /> <span>SQL vs Column</span>
                            </div>

                            <div className={`nav-item ${currentView === 'multimedia' ? 'active' : ''}`} onClick={() => setView('multimedia')}>
                                <PlaySquare size={18} /> <span>Multimedia</span>
                            </div>
                        </div>
                    </>
                )}

                {/* Text/NLP Views */}
                {currentMode === 'text' && (
                    <>
                        <div className="nav-group">
                            <div className="nav-title">NLP ANALYTICS</div>

                            <div className={`nav-item ${currentView === 'reviews' ? 'active' : ''}`} onClick={() => setView('reviews')}>
                                <Star size={18} /> <span>Customer Reviews</span>
                            </div>

                            <div className={`nav-item ${currentView === 'tweets' ? 'active' : ''}`} onClick={() => setView('tweets')}>
                                <Twitter size={18} /> <span>Social Media</span>
                            </div>

                            <div className={`nav-item ${currentView === 'economics' ? 'active' : ''}`} onClick={() => setView('economics')}>
                                <TrendingUp size={18} /> <span>Economics Policy</span>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #1e293b', fontSize: '0.8rem', color: '#64748b' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span>Cluster Status</span>
                    <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>● Connected</span>
                </div>

                <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8', paddingTop: '1rem', borderTop: '1px dashed #334155' }}>
                    <div style={{ marginBottom: '0.5rem' }}>Made with <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>Google Antigravity</span> & <span style={{ color: '#fff', fontWeight: 'bold' }}>Divesh Jadhwani</span></div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                        <a href="https://www.linkedin.com/in/dhackmt" target="_blank" rel="noopener noreferrer" style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none', transition: 'color 0.2s' }}>
                            <Linkedin size={14} /> LinkedIn
                        </a>
                        <a href="https://github.com/d-hackmt" target="_blank" rel="noopener noreferrer" style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none', transition: 'color 0.2s' }}>
                            <Github size={14} /> GitHub
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
