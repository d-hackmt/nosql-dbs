import React, { useState } from 'react';
import { ColumnStore } from '../../utils/dbSimulation';

const ColumnView = ({ data }) => {
    const [store] = useState(new ColumnStore(data));
    const [userStats, setUserStats] = useState(null);

    const handleAnalyzeUser = () => {
        // Pick random user from first 10 rows
        const targetUser = data[0].user_id;
        const userRows = store.filterByValue("user_id", targetUser);
        setUserStats({ id: targetUser, count: userRows.length, rows: userRows });
    };

    const totalMins = data.reduce((acc, r) => acc + r.duration_sec, 0) / 60;

    return (
        <div className="view-container">
            <header style={{ marginBottom: '2rem' }}>
                <h1>📚 Column Store</h1>
                <p style={{ color: '#94a3b8' }}>Cassandra/HBase Style • Big Data Analytics • Wide Column</p>
            </header>

            <div className="stats-grid">
                <div className="stat-card">
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Total Rows</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{data.length.toLocaleString()}</div>
                </div>
                <div className="stat-card">
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Total Duration Analyzed</div>
                    <div style={{ fontSize: '1.2rem', color: '#3b82f6' }}>{Math.floor(totalMins).toLocaleString()} mins</div>
                </div>
            </div>

            <div className="card-grid">
                <div className="card" style={{ gridColumn: 'span 2' }}>
                    <h3>📞 Telecom Activity Log</h3>
                    <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', color: '#cbd5e1' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #334155', textAlign: 'left' }}>
                                    <th style={{ padding: '0.5rem' }}>User ID</th>
                                    <th style={{ padding: '0.5rem' }}>City</th>
                                    <th style={{ padding: '0.5rem' }}>Duration (s)</th>
                                    <th style={{ padding: '0.5rem' }}>Plan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.slice(0, 5).map((row, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid #1e293b' }}>
                                        <td style={{ padding: '0.5rem' }}>{row.user_id}</td>
                                        <td style={{ padding: '0.5rem' }}>{row.city}</td>
                                        <td style={{ padding: '0.5rem' }}>{row.duration_sec}</td>
                                        <td style={{ padding: '0.5rem' }}>{row.plan_type}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div style={{ textAlign: 'center', padding: '0.5rem', fontSize: '0.8rem', color: '#64748b' }}>
                            ... {data.length - 5} more rows
                        </div>
                    </div>
                </div>

                <div className="card">
                    <h3>📊 Analytics</h3>
                    <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '1rem' }}>
                        Filter millions of rows by Partition Key
                    </p>
                    <button className="btn" onClick={handleAnalyzeUser}>Analyze User {data[0].user_id}</button>

                    {userStats && (
                        <div style={{ marginTop: '1rem' }}>
                            <div style={{ color: '#10b981' }}>Found {userStats.count} records</div>
                            {userStats.rows.map((r, i) => (
                                <div key={i} style={{ fontSize: '0.8rem', marginTop: '0.25rem', color: '#94a3b8' }}>
                                    {r.timestamp}: {r.duration_sec}s call
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ColumnView;
