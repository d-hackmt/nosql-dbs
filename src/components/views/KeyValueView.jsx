import React, { useState, useEffect, useRef } from 'react';
import { KeyValueStore } from '../../utils/dbSimulation';
import { Key, Database, Zap, Activity, Server, Search, CheckCircle, XCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const KeyValueView = ({ data }) => {
    const [store] = useState(new KeyValueStore(data));
    const [randomUser, setRandomUser] = useState(null);
    const [sessionActive, setSessionActive] = useState(null);
    const [views, setViews] = useState(14023);

    // Analytics State
    const [stats, setStats] = useState({ hits: 2450, misses: 120, ops: [] });
    const [activeBucket, setActiveBucket] = useState(null);

    // Mock Live Traffic Simulation
    useEffect(() => {
        const interval = setInterval(() => {
            const isHit = Math.random() > 0.05; // 95% hit rate
            setStats(prev => {
                const newOps = [...prev.ops, { time: new Date().toLocaleTimeString(), val: Math.floor(Math.random() * 5000) + 1000 }];
                if (newOps.length > 20) newOps.shift();
                return {
                    hits: prev.hits + (isHit ? Math.floor(Math.random() * 10) : 0),
                    misses: prev.misses + (!isHit ? 1 : 0),
                    ops: newOps
                };
            });
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const handleRandom = () => {
        const key = store.getRandomKey();
        const val = store.get(key);
        setRandomUser({ key, ...val });

        // Visual Hash Simulation
        // Simple hash to bucket 0-15
        let hash = 0;
        for (let i = 0; i < key.length; i++) hash = (hash << 5) - hash + key.charCodeAt(i);
        const bucketId = Math.abs(hash) % 16;
        setActiveBucket(bucketId);
        setTimeout(() => setActiveBucket(null), 1500);

        // Update stats
        setStats(prev => ({ ...prev, hits: prev.hits + 1 }));
    };

    const buckets = Array(16).fill(0).map((_, i) => ({ id: i, label: `0x${i.toString(16).toUpperCase()}` }));
    const hitRateData = [
        { name: 'Hits (Cache)', value: stats.hits },
        { name: 'Misses (DB)', value: stats.misses }
    ];
    const COLORS = ['#10b981', '#ef4444'];

    return (
        <div className="view-container">
            <header style={{ marginBottom: '2rem' }}>
                <h1>🔑 Key-Value Store</h1>
                <p style={{ color: '#94a3b8' }}>Redis Style • In-Memory Hash Map • Sub-millisecond Latency</p>
            </header>

            {/* STORAGE VISUALIZER: HASH MAP */}
            <div className="card" style={{ marginBottom: '2rem', border: '1px solid #334155' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <Database size={18} color="#cbd5e1" />
                    <span style={{ fontWeight: 'bold' }}>In-Memory Storage (Hash Map)</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '0.5rem' }}>
                    {buckets.map(b => (
                        <div key={b.id} style={{
                            background: activeBucket === b.id ? 'rgba(59, 130, 246, 0.2)' : '#0f172a',
                            border: activeBucket === b.id ? '2px solid #3b82f6' : '1px solid #334155',
                            borderRadius: '0.5rem',
                            padding: '0.5rem',
                            textAlign: 'center',
                            transition: 'all 0.3s',
                            transform: activeBucket === b.id ? 'scale(1.1)' : 'scale(1)'
                        }}>
                            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Bucket</div>
                            <div style={{ fontFamily: 'monospace', color: activeBucket === b.id ? '#3b82f6' : '#94a3b8' }}>{b.label}</div>
                            {activeBucket === b.id && <div style={{ fontSize: '0.6rem', color: '#3b82f6', marginTop: '0.2rem' }}>Storing...</div>}
                        </div>
                    ))}
                </div>
                <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#64748b', textAlign: 'center' }}>
                    Keys are passed through a hash function and distributed across buckets for <b>O(1)</b> access time.
                </p>
            </div>

            {/* ANALYTICS DASHBOARD */}
            <div className="card-grid" style={{ marginBottom: '2rem' }}>
                {/* Hit Ratio */}
                <div className="card">
                    <h3>⚡ Cache Performance</h3>
                    <div style={{ height: '200px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={hitRateData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={70}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {hitRateData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '-10px', fontSize: '0.9rem', color: '#94a3b8' }}>
                        Hit Ratio: <span style={{ color: '#10b981', fontWeight: 'bold' }}>{((stats.hits / (stats.hits + stats.misses)) * 100).toFixed(1)}%</span>
                    </div>
                </div>

                {/* Throughput */}
                <div className="card" style={{ gridColumn: 'span 2' }}>
                    <h3>🚀 Throughput (Ops/Sec)</h3>
                    <div style={{ height: '200px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={stats.ops}>
                                <defs>
                                    <linearGradient id="colorOps" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="time" stroke="#64748b" tick={false} />
                                <YAxis stroke="#64748b" />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                                <Line type="monotone" dataKey="val" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* INTERACTIVE TOOLS */}
            <div className="card-grid">
                {/* User Lookup */}
                <div className="card">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Search size={18} /> User Lookup</h3>
                    <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '1rem' }}>
                        <code>GET user:id</code> (O(1) Fetch)
                    </p>
                    <button className="btn" onClick={handleRandom} style={{ width: '100%' }}>Fetch Random Key</button>

                    {randomUser && (
                        <div style={{ marginTop: '1rem', background: '#0f172a', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #1e293b' }}>
                            <div style={{ color: '#f59e0b', fontSize: '0.8rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Key size={14} /> {randomUser.key}
                            </div>
                            <div>Name: <span style={{ fontWeight: 'bold' }}>{randomUser.name}</span></div>
                            <div>Plan: <span style={{ color: '#10b981' }}>{randomUser.plan}</span></div>
                        </div>
                    )}
                </div>

                {/* Session */}
                <div className="card">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Activity size={18} /> Session Mgt</h3>
                    <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '1rem' }}>
                        Checks active auth tokens in μs.
                    </p>
                    <button className="btn btn-outline" onClick={() => setSessionActive(true)} style={{ width: '100%' }}>Check Live Session</button>

                    {sessionActive && (
                        <div style={{ marginTop: '1rem', color: '#10b981', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <CheckCircle size={20} /> SESSION ACTIVE
                        </div>
                    )}
                </div>

                {/* Counter */}
                <div className="card">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Zap size={18} /> Atomic Counter</h3>
                    <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '1rem' }}>
                        <code>INCR page_views</code>
                    </p>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#fff' }}>{views.toLocaleString()}</div>
                    <button className="btn" onClick={() => setViews(v => v + 1)} style={{ width: '100%', background: '#f59e0b' }}>+ Increment</button>
                </div>
            </div>
        </div>
    );
};

// Import CartesianGrid if not already imported (it was missing in the top imports in previous file view, but utilized in code)
// Adding it to imports safe-guard.
import { CartesianGrid } from 'recharts';

export default KeyValueView;
