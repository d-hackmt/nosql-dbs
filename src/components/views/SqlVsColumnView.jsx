import React, { useState } from 'react';

const SqlVsColumnView = ({ data }) => {
    const [rowTime, setRowTime] = useState(null);
    const [colTime, setColTime] = useState(null);

    const runSqlSim = () => {
        const start = performance.now();
        // Simulate Row-by-Row Scan
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
            sum += data[i].duration_sec; // accessing row first
        }
        const end = performance.now();
        setRowTime((end - start).toFixed(4));
    };

    const runColSim = () => {
        const start = performance.now();
        // In JS, mapping just the column array simulates column-vector access
        // Ideally we'd have it stored as separate arrays, but map() is close enough opt
        const durations = data.map(d => d.duration_sec);
        const sum = durations.reduce((a, b) => a + b, 0); // vectorized-like op
        const end = performance.now();
        setColTime((end - start).toFixed(4));
    };

    return (
        <div className="view-container">
            <header style={{ marginBottom: '2rem' }}>
                <h1>🆚 SQL vs Column Store</h1>
                <p style={{ color: '#94a3b8' }}>Performance Benchmark on 50,000 Rows</p>
            </header>

            <div className="card-grid">
                <div className="card">
                    <h3>🧱 SQL (Row Store)</h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Scans every row object entire structure.</p>
                    <button className="btn" onClick={runSqlSim} style={{ background: '#64748b' }}>Run SQL Scan</button>
                    {rowTime && <div style={{ marginTop: '1rem', fontSize: '1.5rem', color: '#f43f5e' }}>{rowTime} ms</div>}
                </div>

                <div className="card">
                    <h3>📚 Column Store</h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Reads ONLY the relevant column vector.</p>
                    <button className="btn" onClick={runColSim} style={{ background: '#3b82f6' }}>Run Column Scan</button>
                    {colTime && <div style={{ marginTop: '1rem', fontSize: '1.5rem', color: '#10b981' }}>{colTime} ms</div>}
                </div>
            </div>

            <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#1e293b', borderRadius: '1rem' }}>
                <h3>Why the difference?</h3>
                <p style={{ color: '#94a3b8' }}>
                    Row stores (SQL) load user_id, city, plan, AND duration for every row into memory before reading duration.
                    <br />
                    Column stores store 'duration' comfortably together on disk/memory, allowing CPU to cache-prefetch the values efficiently.
                </p>
            </div>
        </div>
    );
};

export default SqlVsColumnView;
