import React, { useState, useEffect } from 'react';
import { KeyValueStore } from '../../utils/dbSimulation';
import { Key, Database, Zap, Activity, Server, Search, CheckCircle, Info } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, CartesianGrid } from 'recharts';

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
        let hash = 0;
        for (let i = 0; i < key.length; i++) hash = (hash << 5) - hash + key.charCodeAt(i);
        const bucketId = Math.abs(hash) % 16;
        setActiveBucket(bucketId);
        setTimeout(() => setActiveBucket(null), 1500);

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
                <h1><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg" alt="Redis" width="32" height="32" style={{ verticalAlign: 'middle', marginRight: '0.75rem' }} /> Key-Value Store</h1>
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
                        </div>
                    ))}
                </div>
            </div>

            {/* DATA STORED PREVIEW */}
            <div className="card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <Server size={18} /> Sample Stored Data
                    <span style={{ fontSize: '0.75rem', fontWeight: 'normal', color: '#94a3b8', marginLeft: 'auto' }}>Memory usage: ~12MB</span>
                </h3>
                <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                    {Object.entries(data).slice(0, 6).map(([k, v], i) => (
                        <div key={k} style={{ minWidth: '200px', background: '#0f172a', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #334155' }}>
                            <div style={{ fontSize: '0.8rem', color: '#f59e0b', marginBottom: '0.25rem', fontFamily: 'monospace' }}>KEY: {k}</div>
                            <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>{JSON.stringify(v).substring(0, 40)}...</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ANALYTICS DASHBOARD */}
            <div className="card-grid" style={{ marginBottom: '2rem' }}>
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h3>⚡ Cache Performance</h3>
                        <TooltipWrapper text="High Cache Hits (Green) mean data is found in memory (0.1ms). Misses (Red) force a slow database read (50ms)." />
                    </div>
                    <div style={{ height: '200px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={hitRateData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                                    {hitRateData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card" style={{ gridColumn: 'span 2' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h3>🚀 Throughput (Ops/Sec)</h3>
                        <TooltipWrapper text="Key-Value stores can handle massive concurrency. This chart shows Operations Per Second (Ops/Sec) handling thousands of requests instantly." />
                    </div>
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

            {/* TOOLS */}
            <div className="card-grid">
                <div className="card">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Search size={18} /> User Lookup</h3>
                    <button className="btn" onClick={handleRandom} style={{ width: '100%', marginTop: '1rem' }}>Fetch Random Key</button>
                    {randomUser && (
                        <div style={{ marginTop: '1rem', background: '#0f172a', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #1e293b' }}>
                            <div style={{ color: '#f59e0b', fontSize: '0.8rem' }}>KEY: {randomUser.key}</div>
                            <div>Name: <b>{randomUser.name}</b></div>
                        </div>
                    )}
                </div>

                <div className="card">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Activity size={18} /> Session Mgt</h3>
                    <button className="btn btn-outline" onClick={() => setSessionActive(true)} style={{ width: '100%', marginTop: '1rem' }}>Check Session</button>
                    {sessionActive && <div style={{ marginTop: '1rem', color: '#10b981', textAlign: 'center' }}>✓ SESSION ACTIVE</div>}
                </div>

                <div className="card">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Zap size={18} /> Atomic Counter</h3>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0' }}>{views.toLocaleString()}</div>
                    <button className="btn" onClick={() => setViews(v => v + 1)} style={{ width: '100%', background: '#f59e0b' }}>+ Increment</button>
                </div>
            </div>
        </div>
    );
};

const TooltipWrapper = ({ text }) => (
    <div className="tooltip-container" style={{ position: 'relative', display: 'inline-block', cursor: 'pointer' }}>
        <Info size={16} color="#94a3b8" />
        <div className="tooltip-text">{text}</div>
        <style>{`
            .tooltip-container:hover .tooltip-text { visibility: visible; opacity: 1; }
            .tooltip-text {
                visibility: hidden;
                width: 200px;
                background-color: #0f172a;
                color: #fff;
                text-align: center;
                border-radius: 6px;
                padding: 10px;
                position: absolute;
                z-index: 1;
                bottom: 125%;
                left: 50%;
                margin-left: -100px;
                opacity: 0;
                transition: opacity 0.3s;
                border: 1px solid #334155;
                font-size: 0.8rem;
                box-shadow: 0 4px 6px rgba(0,0,0,0.3);
            }
        `}</style>
    </div>
);

export default KeyValueView;
