import React, { useState, useMemo } from 'react';
import { ColumnStore } from '../../utils/dbSimulation';
import { Server, Database, Activity, Map, PieChart as PieChartIcon, Clock, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, CartesianGrid, Legend } from 'recharts';

const ColumnView = ({ data }) => {
    const [activeQuery, setActiveQuery] = useState(null); // 'regional', 'market', 'traffic'
    const [scannedCols, setScannedCols] = useState([]);
    const [processing, setProcessing] = useState(false);

    // --- ANALYTICS ENGINES ---

    // 1. Regional Analysis (City + Duration)
    const regionalData = useMemo(() => {
        if (activeQuery !== 'regional') return [];
        const cityStats = {};
        data.forEach(r => {
            if (!cityStats[r.city]) cityStats[r.city] = { totalParams: 0, count: 0 };
            cityStats[r.city].totalParams += r.duration_sec;
            cityStats[r.city].count += 1;
        });
        return Object.keys(cityStats).map(city => ({
            name: city,
            value: Math.round(cityStats[city].totalParams / cityStats[city].count)
        })).sort((a, b) => b.value - a.value);
    }, [data, activeQuery]);

    // 2. Market Share (Plan)
    const marketData = useMemo(() => {
        if (activeQuery !== 'market') return [];
        const counts = {};
        data.forEach(r => counts[r.plan_type] = (counts[r.plan_type] || 0) + 1);
        return Object.keys(counts).map(plan => ({ name: plan, value: counts[plan] }));
    }, [data, activeQuery]);

    // 3. Traffic Analysis (Timestamp/Time)
    const trafficData = useMemo(() => {
        if (activeQuery !== 'traffic') return [];
        // Simulate hours based on index or parsing timestamp if valid
        // For robustness, let's just bin by simulated "Hour of Day" derived from randomness or index
        const hours = Array(24).fill(0);
        data.forEach((r, i) => {
            const hour = i % 24; // Mock distribution
            hours[hour] += 1;
        });
        return hours.map((count, h) => ({ name: `${h}:00`, value: count + Math.random() * 50 })); // Add jitter for realism
    }, [data, activeQuery]);

    // --- HANDLERS ---

    const runQuery = (type, cols) => {
        if (processing) return;
        setProcessing(true);
        setActiveQuery(null);
        setScannedCols(cols);

        // Simulate "Seek & Scan" delay
        setTimeout(() => {
            setActiveQuery(type);
            setProcessing(false);
        }, 800);
    };

    // --- COLORS ---
    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    const COL_FILES = ['user_id', 'city', 'duration', 'plan', 'timestamp'];

    return (
        <div className="view-container">
            <header style={{ marginBottom: '2rem' }}>
                <h1><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cassandra/cassandra-original.svg" alt="Cassandra" width="32" height="32" style={{ verticalAlign: 'middle', marginRight: '0.75rem' }} /> Column Store Analytics</h1>
                <p style={{ color: '#94a3b8' }}>Wide-Column Storage • Partitioned Analytics • High Throughput</p>
            </header>

            {/* VIRTUAL DISK LAYER */}
            <div className="card" style={{ marginBottom: '2rem', border: '1px solid #334155' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Database size={18} color="#cbd5e1" />
                        <span style={{ fontWeight: 'bold' }}>Storage Layer (Disk)</span>
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
                        {scannedCols.length > 0 ?
                            <span>Scanning <span style={{ color: '#10b981', fontWeight: 'bold' }}>{scannedCols.length}</span> / 5 Columns</span> :
                            "High-Speed Columnar Storage"
                        }
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                    {COL_FILES.map(col => {
                        const isActive = scannedCols.includes(col);
                        return (
                            <div key={col} style={{
                                flex: 1,
                                minWidth: '120px',
                                background: isActive ? 'rgba(16, 185, 129, 0.1)' : '#0f172a',
                                border: isActive ? '1px solid #10b981' : '1px dashed #475569',
                                borderRadius: '0.5rem',
                                padding: '1rem',
                                opacity: (scannedCols.length > 0 && !isActive) ? 0.3 : 1,
                                transition: 'all 0.3s',
                                position: 'relative'
                            }}>
                                <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.5rem', fontFamily: 'monospace' }}>{col}.col</div>
                                {isActive && <Activity size={16} color="#10b981" style={{ position: 'absolute', top: '10px', right: '10px' }} />}
                                <div style={{ height: '30px', display: 'flex', gap: '2px', alignItems: 'end' }}>
                                    {[...Array(5)].map((_, i) => <div key={i} style={{ flex: 1, background: isActive ? '#10b981' : '#334155', height: `${40 + Math.random() * 60}%`, borderRadius: '1px' }}></div>)}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* DATA PREVIEW (COLUMN VECTORS) */}
            <div className="card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Server size={16} /> Columnar Data Vectors (Sample)
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1px', background: '#334155', border: '1px solid #334155', borderRadius: '0.5rem', overflow: 'hidden' }}>
                    {['user_id', 'city', 'duration', 'plan', 'timestamp'].map(key => (
                        <div key={key} style={{ background: '#0f172a' }}>
                            <div style={{ padding: '0.5rem', background: '#1e293b', textAlign: 'center', fontSize: '0.8rem', fontWeight: 'bold', color: '#94a3b8', borderBottom: '1px solid #334155' }}>
                                {key}
                            </div>
                            <div style={{ padding: '0.5rem', fontFamily: 'monospace', fontSize: '0.85rem', color: '#cbd5e1', maxHeight: '150px', overflowY: 'auto' }}>
                                {data.slice(0, 8).map((r, i) => (
                                    <div key={i} style={{ marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {key === 'duration' ? r.duration_sec : r[key === 'plan' ? 'plan_type' : key]}
                                    </div>
                                ))}
                                <div style={{ color: '#64748b', fontSize: '0.7rem', marginTop: '0.5rem' }}>...</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="card-grid" style={{ gridTemplateColumns: '1fr 2fr' }}>

                {/* CONTROLS */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <h3><Server size={18} style={{ display: 'inline', marginRight: '0.5rem' }} /> Analytic Jobs</h3>

                    <button
                        className={`btn ${activeQuery === 'regional' ? '' : 'btn-outline'}`}
                        onClick={() => runQuery('regional', ['city', 'duration'])}
                        style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
                    >
                        <Map size={20} />
                        <div>
                            <div>Regional Analysis</div>
                            <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>Avg Duration by City</div>
                        </div>
                    </button>

                    <button
                        className={`btn ${activeQuery === 'market' ? '' : 'btn-outline'}`}
                        onClick={() => runQuery('market', ['plan'])}
                        style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
                    >
                        <PieChartIcon size={20} />
                        <div>
                            <div>Market Share</div>
                            <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>Users per Plan</div>
                        </div>
                    </button>

                    <button
                        className={`btn ${activeQuery === 'traffic' ? '' : 'btn-outline'}`}
                        onClick={() => runQuery('traffic', ['timestamp'])}
                        style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
                    >
                        <Clock size={20} />
                        <div>
                            <div>Traffic Peaks</div>
                            <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>Hourly Volume</div>
                        </div>
                    </button>

                    {activeQuery && (
                        <div style={{ marginTop: 'auto', padding: '1rem', background: '#0f172a', borderRadius: '0.5rem', border: '1px solid #1e293b' }}>
                            <div style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <CheckCircle size={16} /> Query Complete
                            </div>
                            <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                                Only <b>{scannedCols.length}</b> columns were loaded from disk.
                                High-speed analytics achieved by skipping {5 - scannedCols.length} irrelevant columns.
                            </div>
                        </div>
                    )}
                </div>

                {/* VISUALIZATION */}
                <div className="card" style={{ minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
                    {processing ? (
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8', flexDirection: 'column', gap: '1rem' }}>
                            <Activity size={48} className="animate-pulse" />
                            <div>Scanning Column Files...</div>
                        </div>
                    ) : (
                        <>
                            {activeQuery === 'regional' && (
                                <div style={{ height: '100%', width: '100%' }}>
                                    <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Avg Call Duration by City (Seconds)</h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={regionalData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                            <XAxis dataKey="name" stroke="#94a3b8" />
                                            <YAxis stroke="#94a3b8" />
                                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                                            <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={50} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            )}

                            {activeQuery === 'market' && (
                                <div style={{ height: '100%', width: '100%' }}>
                                    <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Subscription Plan Distribution</h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={marketData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={100}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {marketData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                                            <Legend verticalAlign="bottom" height={36} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            )}

                            {activeQuery === 'traffic' && (
                                <div style={{ height: '100%', width: '100%' }}>
                                    <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Network Traffic by Hour (24h)</h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <AreaChart data={trafficData}>
                                            <defs>
                                                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                            <XAxis dataKey="name" stroke="#94a3b8" interval={3} />
                                            <YAxis stroke="#94a3b8" />
                                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                                            <Area type="monotone" dataKey="value" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorVal)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            )}

                            {!activeQuery && (
                                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', flexDirection: 'column' }}>
                                    <Server size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                                    <p>Select an analytic job to process data</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ColumnView;
