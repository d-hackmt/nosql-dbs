import React, { useState, useEffect } from 'react';
import { Database, Server, Clock, HardDrive } from 'lucide-react';

const SqlVsColumnView = ({ data }) => {
    const [rowTime, setRowTime] = useState(null);
    const [colTime, setColTime] = useState(null);
    const [scanning, setScanning] = useState(null); // 'sql' or 'col'
    const [progress, setProgress] = useState(0);
    const [bytesRead, setBytesRead] = useState({ sql: 0, col: 0 });

    const ROW_SIZE = 128; // Simulated bytes per row
    const COL_SIZE = 8;   // Simulated bytes per field (e.g. integer)

    const runSqlSim = () => {
        setScanning('sql');
        setProgress(0);
        setRowTime(null);
        setBytesRead(prev => ({ ...prev, sql: 0 }));

        // Simulate animation loop
        let p = 0;
        const interval = setInterval(() => {
            p += 5;
            setProgress(p);
            if (p >= 100) {
                clearInterval(interval);
                const start = performance.now();
                let sum = 0;
                // Actual work
                for (let i = 0; i < data.length; i++) sum += data[i].duration_sec;
                const end = performance.now();
                setRowTime((end - start).toFixed(4));
                setBytesRead(prev => ({ ...prev, sql: data.length * ROW_SIZE }));
                setScanning(null);
            }
        }, 20);
    };

    const runColSim = () => {
        setScanning('col');
        setProgress(0);
        setColTime(null);
        setBytesRead(prev => ({ ...prev, col: 0 }));

        let p = 0;
        const interval = setInterval(() => {
            p += 5;
            setProgress(p);
            if (p >= 100) {
                clearInterval(interval);
                const start = performance.now();
                // Actual work
                const durations = data.map(d => d.duration_sec);
                durations.reduce((a, b) => a + b, 0);
                const end = performance.now();
                setColTime((end - start).toFixed(4));
                setBytesRead(prev => ({ ...prev, col: data.length * COL_SIZE }));
                setScanning(null);
            }
        }, 20);
    };

    // Visualizer Data (Small subset)
    const sampleData = data.slice(0, 5);

    return (
        <div className="view-container">
            <header style={{ marginBottom: '2rem' }}>
                <h1><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" alt="SQL" width="32" height="32" style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} /> SQL vs <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cassandra/cassandra-original.svg" alt="Cassandra" width="32" height="32" style={{ verticalAlign: 'middle', marginLeft: '0.5rem', marginRight: '0.5rem' }} /> Column Store</h1>
                <p style={{ color: '#94a3b8' }}>Visualizing Memory Layout & I/O Efficiency</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

                {/* LEFT: ROW STORE */}
                <div className="card" style={{ border: scanning === 'sql' ? '1px solid #f43f5e' : '1px solid #334155', transition: 'all 0.3s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <Database color="#f43f5e" />
                        <h3>Row Store (SQL)</h3>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '1.5rem' }}>
                        Data is stored row-by-row. To calculate average duration, the disk head must skip over irrelevant data (City, Plan) or read the whole block.
                    </p>

                    {/* Visual Memory Blocks */}
                    <div style={{ background: '#0f172a', padding: '1rem', borderRadius: '0.5rem', fontFamily: 'monospace', fontSize: '0.8rem', marginBottom: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                        {sampleData.map((row, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                padding: '0.5rem',
                                marginBottom: '0.25rem',
                                background: scanning === 'sql' && (i * 20 < progress * 1.5) ? 'rgba(244, 63, 94, 0.2)' : '#1e293b',
                                borderBottom: '1px solid #334155'
                            }}>
                                <span style={{ width: '40px', color: '#64748b' }}>{row.user_id}</span>
                                <span style={{ width: '80px', color: '#64748b' }}>{row.city}</span>
                                <span style={{ width: '60px', color: '#f8fafc', fontWeight: 'bold', background: scanning === 'sql' ? '#f43f5e' : 'transparent', borderRadius: '2px', textAlign: 'center' }}>{row.duration_sec}</span>
                                <span style={{ width: '60px', color: '#64748b' }}>{row.plan_type}</span>
                            </div>
                        ))}
                        {scanning === 'sql' && (
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: '#f43f5e', transform: `translateY(${progress}%)`, transition: 'transform 0.1s linear' }}></div>
                        )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <button className="btn" onClick={runSqlSim} disabled={scanning} style={{ background: '#f43f5e' }}>
                            {scanning === 'sql' ? 'Scanning...' : 'Run Benchmarks'}
                        </button>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Processed</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{(bytesRead.sql / 1024 / 1024).toFixed(2)} MB</div>
                        </div>
                    </div>

                    {rowTime && (
                        <div style={{ marginTop: '1rem', padding: '0.5rem', background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e', borderRadius: '0.25rem', textAlign: 'center' }}>
                            ⏱ Time: {rowTime} ms
                        </div>
                    )}
                </div>

                {/* RIGHT: COLUMN STORE */}
                <div className="card" style={{ border: scanning === 'col' ? '1px solid #10b981' : '1px solid #334155', transition: 'all 0.3s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <Server color="#10b981" />
                        <h3>Column Store</h3>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '1.5rem' }}>
                        Data is stored by column. The engine jumps directly to the 'Duration' file/block and reads contiguous integers. Zero waste.
                    </p>

                    {/* Visual Memory Blocks */}
                    <div style={{ display: 'flex', gap: '0.5rem', background: '#0f172a', padding: '1rem', borderRadius: '0.5rem', fontFamily: 'monospace', fontSize: '0.8rem', marginBottom: '1.5rem', minHeight: '180px' }}>
                        {/* Irrelevant Columns */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem', opacity: 0.3 }}>
                            <div style={{ background: '#334155', padding: '0.25rem', textAlign: 'center' }}>IDs</div>
                            {sampleData.map((r, i) => <div key={i} style={{ background: '#1e293b', height: '20px' }}></div>)}
                        </div>

                        {/* TARGET COLUMN */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem', border: '1px solid #10b981', padding: '0.25rem', borderRadius: '0.25rem' }}>
                            <div style={{ background: '#10b981', color: 'white', padding: '0.25rem', textAlign: 'center', fontWeight: 'bold' }}>Duration</div>
                            {sampleData.map((r, i) => (
                                <div key={i} style={{
                                    background: scanning === 'col' && (i * 20 < progress * 1.5) ? '#10b981' : '#1e293b',
                                    color: 'white',
                                    textAlign: 'center',
                                    transition: 'background 0.2s'
                                }}>
                                    {r.duration_sec}
                                </div>
                            ))}
                            {scanning === 'col' && (
                                <div style={{ height: '2px', background: '#10b981', width: '100%', marginTop: 'auto' }}></div>
                            )}
                        </div>

                        {/* Irrelevant Columns */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem', opacity: 0.3 }}>
                            <div style={{ background: '#334155', padding: '0.25rem', textAlign: 'center' }}>Plan</div>
                            {sampleData.map((r, i) => <div key={i} style={{ background: '#1e293b', height: '20px' }}></div>)}
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <button className="btn" onClick={runColSim} disabled={scanning} style={{ background: '#10b981' }}>
                            {scanning === 'col' ? 'Scanning...' : 'Run Benchmarks'}
                        </button>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Processed</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#10b981' }}>{(bytesRead.col / 1024 / 1024).toFixed(2)} MB</div>
                        </div>
                    </div>

                    {colTime && (
                        <div style={{ marginTop: '1rem', padding: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '0.25rem', textAlign: 'center' }}>
                            ⏱ Time: {colTime} ms
                        </div>
                    )}
                </div>

            </div>

            <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#1e293b', borderRadius: '1rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <HardDrive size={48} color="#3b82f6" />
                <div>
                    <h3>The I/O Advantage</h3>
                    <p style={{ color: '#94a3b8' }}>
                        For a dataset of 50,000 rows, Querying for `Average Duration`:
                        <br />
                        <span style={{ color: '#f43f5e' }}>SQL</span> scans <b>~6.4 MB</b> of data (Names, Cities, Plans etc. are loaded into RAM).
                        <br />
                        <span style={{ color: '#10b981' }}>Column Store</span> scans ONLY <b>~0.4 MB</b> (Only integer array is loaded).
                        <br />
                        This is why Column Stores (like Cassandra/HBase) are <b>10x-100x faster</b> for Analytics.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SqlVsColumnView;
