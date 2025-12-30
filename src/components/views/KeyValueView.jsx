import React, { useState } from 'react';
import { KeyValueStore } from '../../utils/dbSimulation';

const KeyValueView = ({ data }) => {
    const [store] = useState(new KeyValueStore(data));
    const [randomUser, setRandomUser] = useState(null);
    const [sessionActive, setSessionActive] = useState(null);
    const [views, setViews] = useState(14023);

    const handleRandom = () => {
        const key = store.getRandomKey();
        const val = store.get(key);
        setRandomUser({ key, ...val });
    };

    return (
        <div className="view-container">
            <header style={{ marginBottom: '2rem' }}>
                <h1>🔑 Key-Value Store</h1>
                <p style={{ color: '#94a3b8' }}>Redis Style • High Speed • Caching • Sessions</p>
            </header>

            <div className="stats-grid">
                <div className="stat-card">
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Keys Stored</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{Object.keys(data).length.toLocaleString()}</div>
                </div>
                <div className="stat-card">
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Performance</div>
                    <div style={{ color: '#10b981' }}>Sub-millisecond</div>
                </div>
            </div>

            <div className="card-grid">
                {/* Card 1: Lookup */}
                <div className="card">
                    <h3>👤 User Lookup</h3>
                    <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '1rem' }}>
                        <code>GET user:id</code>
                    </p>
                    <button className="btn" onClick={handleRandom}>Fetch Random Key</button>

                    {randomUser && (
                        <div style={{ marginTop: '1rem', background: '#0f172a', padding: '1rem', borderRadius: '0.5rem' }}>
                            <div style={{ color: '#f59e0b', fontSize: '0.8rem', marginBottom: '0.5rem' }}>KEY: {randomUser.key}</div>
                            <div>Name: <span style={{ fontWeight: 'bold' }}>{randomUser.name}</span></div>
                            <div>Plan: <span style={{ color: '#10b981' }}>{randomUser.plan}</span></div>
                        </div>
                    )}
                </div>

                {/* Card 2: Session */}
                <div className="card">
                    <h3>⚡ Session Management</h3>
                    <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '1rem' }}>
                        Fast boolean checks for auth tokens.
                    </p>
                    <button className="btn btn-outline" onClick={() => setSessionActive(true)}>Check Live Session</button>

                    {sessionActive && (
                        <div style={{ marginTop: '1rem', color: '#10b981', fontWeight: 'bold' }}>
                            ✓ SESSION ACTIVE
                        </div>
                    )}
                </div>

                {/* Card 3: Counter */}
                <div className="card">
                    <h3>🔥 Atomic Counters</h3>
                    <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '1rem' }}>
                        <code>INCR page_views</code>
                    </p>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>{views.toLocaleString()}</div>
                    <button className="btn" onClick={() => setViews(v => v + 1)}>Increment</button>
                </div>
            </div>
        </div>
    );
};

export default KeyValueView;
