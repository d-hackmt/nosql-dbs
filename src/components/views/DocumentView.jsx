import React, { useState } from 'react';
import { DocumentDB } from '../../utils/dbSimulation';
import { FileJson, Search, Database } from 'lucide-react';

const DocumentView = ({ data }) => {
    const [db] = useState(new DocumentDB(data));
    const [queryPrice, setQueryPrice] = useState(50000);
    const [results, setResults] = useState([]);
    const [viewMode, setViewMode] = useState('grid'); // grid or list

    const handleQuery = () => {
        const res = db.findMany("price", parseInt(queryPrice), "gt");
        setResults(res.slice(0, 50)); // Limit for performance
    };

    return (
        <div className="view-container">
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" alt="MongoDB" width="32" height="32" style={{ verticalAlign: 'middle', marginRight: '0.75rem' }} /> Document Database</h1>
                    <p style={{ color: '#94a3b8' }}>Collection: <span style={{ fontFamily: 'monospace', color: '#38bdf8' }}>products</span> ({data.length.toLocaleString()} documents)</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div className="stat-card" style={{ padding: '0.5rem 1rem' }}>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Storage Size</div>
                        <div style={{ fontWeight: 'bold' }}>{(data.length * 0.5).toFixed(1)} MB</div>
                    </div>
                    <div className="stat-card" style={{ padding: '0.5rem 1rem' }}>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Indexes</div>
                        <div style={{ fontWeight: 'bold' }}>_id_</div>
                    </div>
                </div>
            </header>

            {/* Query Bar */}
            <div style={{ background: '#1e293b', padding: '1rem', borderRadius: '0.75rem', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <span style={{ color: '#94a3b8', fontFamily: 'monospace' }}>db.products.find(</span>
                <span style={{ color: '#f59e0b', fontFamily: 'monospace' }}>&#123; price: &#123; $gt: </span>
                <input
                    type="number"
                    value={queryPrice}
                    onChange={(e) => setQueryPrice(e.target.value)}
                    style={{ width: '100px', padding: '0.25rem', borderRadius: '0.25rem', border: 'none', background: '#0f172a', color: 'white' }}
                />
                <span style={{ color: '#f59e0b', fontFamily: 'monospace' }}> &#125; &#125;</span>
                <span style={{ color: '#94a3b8', fontFamily: 'monospace' }}>)</span>
                <button className="btn" onClick={handleQuery} style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Search size={16} /> Run Query
                </button>
            </div>

            {/* Results / Browser */}
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h3>Collection Browser</h3>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className={`btn-outline ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')} style={{ padding: '0.25rem 0.5rem' }}>Grid</button>
                        <button className={`btn-outline ${viewMode === 'json' ? 'active' : ''}`} onClick={() => setViewMode('json')} style={{ padding: '0.25rem 0.5rem' }}>JSON</button>
                    </div>
                </div>

                <div style={{ height: '500px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                    {results.length === 0 ? (
                        <div style={{ textAlign: 'center', color: '#64748b', marginTop: '4rem' }}>
                            <Database size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
                            <div>Run a query to fetch documents</div>
                        </div>
                    ) : (
                        <div style={{
                            display: viewMode === 'grid' ? 'grid' : 'block',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                            gap: '1rem'
                        }}>
                            {results.map(doc => (
                                <div key={doc.product_id} style={{
                                    background: '#0f172a',
                                    padding: '1rem',
                                    borderRadius: '0.5rem',
                                    border: '1px solid #334155',
                                    marginBottom: viewMode === 'json' ? '1rem' : '0',
                                    fontSize: '0.9rem'
                                }}>
                                    {viewMode === 'grid' ? (
                                        <>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>{doc.product_id}</span>
                                                <span style={{ color: '#10b981' }}>₹{doc.price.toLocaleString()}</span>
                                            </div>
                                            <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{doc.name}</div>
                                            <div style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.5rem' }}>{doc.category}</div>
                                            <div style={{ display: 'flex', gap: '0.25rem' }}>
                                                {doc.ratings && doc.ratings.map((r, i) => (
                                                    <span key={i} style={{ color: '#f59e0b' }}>★</span>
                                                ))}
                                            </div>
                                        </>
                                    ) : (
                                        <pre style={{ margin: 0, fontFamily: 'monospace', color: '#cbd5e1' }}>
                                            {JSON.stringify(doc, null, 2)}
                                        </pre>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DocumentView;
