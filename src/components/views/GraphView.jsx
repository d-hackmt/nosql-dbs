import React, { useState, useMemo, useRef, useEffect } from 'react';
import { GraphDB } from '../../utils/dbSimulation';
import { graphBfsPath, detectSuspiciousGraphPatterns } from '../../utils/analytics';
import ForceGraph2D from 'react-force-graph-2d';
import { Maximize2, Search, AlertTriangle, X } from 'lucide-react';

const GraphView = ({ data }) => {
    const [store] = useState(new GraphDB(data));
    const [path, setPath] = useState(null);
    const [fraudReport, setFraudReport] = useState(null);
    const [selectedNode, setSelectedNode] = useState(null);
    const graphRef = useRef();

    const nodes = store.getNodes(); // Keys of the adjacency list

    // Transform Adjacency List to Graph Data (Nodes + Links)
    const graphData = useMemo(() => {
        const gNodes = [];
        const gLinks = [];
        const addedNodes = new Set();
        const addedLinks = new Set();

        // We might have too many nodes, so let's limit for visualization if needed, 
        // but for now we'll try to show all (assuming < 1000 for performance).
        // If > 1000, we might want to slice keys.
        const visibleNodes = nodes.slice(0, 500);

        visibleNodes.forEach(nodeId => {
            if (!addedNodes.has(nodeId)) {
                gNodes.push({
                    id: nodeId,
                    group: nodeId.startsWith('User') ? 'user' : 'account',
                    val: nodeId.startsWith('User') ? 10 : 7 // Size
                });
                addedNodes.add(nodeId);
            }

            const neighbors = data[nodeId] || [];
            neighbors.forEach(targetId => {
                // Only add link if target is also in visible set (to avoid dangling links)
                if (visibleNodes.includes(targetId)) {
                    // Create a unique key for the link to avoid duplicates in visualization if desired
                    // (Undirected graph logic or Directed? GraphDB class implies Directed adjacency)
                    const linkKey = `${nodeId}-${targetId}`;
                    if (!addedLinks.has(linkKey)) {
                        gLinks.push({ source: nodeId, target: targetId });
                        addedLinks.add(linkKey);
                    }

                    // Ensure target node exists
                    if (!addedNodes.has(targetId)) {
                        gNodes.push({
                            id: targetId,
                            group: targetId.startsWith('User') ? 'user' : 'account',
                            val: targetId.startsWith('User') ? 10 : 7
                        });
                        addedNodes.add(targetId);
                    }
                }
            });
        });

        return { nodes: gNodes, links: gLinks };
    }, [data, nodes]);

    const handleTrace = () => {
        if (nodes.length < 2) return;
        const start = nodes[0];
        // Pick a random node that isn't start
        let end = nodes[10] || nodes[1];
        const p = graphBfsPath(data, start, end);
        setPath(p ? { path: p, msg: p.join(" → ") } : { path: [], msg: "No direct path found" });

        // Highlight logic could go here (e.g., zoom to nodes)
    };

    const handleFraud = () => {
        const report = detectSuspiciousGraphPatterns(data);
        setFraudReport(report);
    };

    return (
        <div className="view-container" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <header style={{ marginBottom: '1.5rem', flexShrink: 0 }}>
                <h1>🕸 Graph Database</h1>
                <p style={{ color: '#94a3b8' }}>Neo4j Style • {graphData.nodes.length} Nodes • {graphData.links.length} Relationships</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '1.5rem', flex: 1, minHeight: 0 }}>

                {/* Controls Panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto', paddingRight: '0.5rem' }}>

                    {/* Action Card */}
                    <div className="card">
                        <h3><Search size={18} style={{ display: 'inline', marginRight: '0.5rem' }} />Actions</h3>

                        <div style={{ marginTop: '1rem' }}>
                            <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: '#cbd5e1' }}>Relationship Tracer</div>
                            <button className="btn" onClick={handleTrace} style={{ width: '100%' }}>Trace Path (User0 → User10)</button>
                            {path && (
                                <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: '#0f172a', borderRadius: '0.5rem', color: '#38bdf8', fontSize: '0.85rem' }}>
                                    {path.msg}
                                </div>
                            )}
                        </div>

                        <div style={{ marginTop: '1.5rem' }}>
                            <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: '#cbd5e1' }}>Fraud Detection</div>
                            <button className="btn btn-outline" onClick={handleFraud} style={{ width: '100%' }}>Scan Network</button>
                            {fraudReport && (
                                <div style={{ marginTop: '0.5rem' }}>
                                    {fraudReport.length === 0 ?
                                        <div style={{ color: '#10b981', fontSize: '0.9rem' }}>✓ System Clean</div> :
                                        <div style={{ fontSize: '0.85rem', color: '#f87171', maxHeight: '100px', overflowY: 'auto' }}>
                                            {fraudReport.length} Suspicious Patterns Found!
                                            <ul style={{ paddingLeft: '1rem', margin: '0.5rem 0' }}>
                                                {fraudReport.slice(0, 3).map((r, i) => <li key={i}>{r.split('(')[0]}</li>)}
                                            </ul>
                                        </div>
                                    }
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Selected Node Details */}
                    <div className="card" style={{ flex: 1, minHeight: '200px' }}>
                        <h3>Details</h3>
                        {selectedNode ? (
                            <div style={{ animation: 'fadeIn 0.3s' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: selectedNode.group === 'user' ? '#3b82f6' : '#ec4899' }}></div>
                                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{selectedNode.id}</span>
                                </div>

                                <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Type</div>
                                <div style={{ marginBottom: '1rem' }}>{selectedNode.group.toUpperCase()}</div>

                                <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Connections</div>
                                <div style={{ marginBottom: '1rem', color: '#10b981' }}>{data[selectedNode.id]?.length || 0} direct links</div>

                                <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Linked To</div>
                                <div style={{ maxHeight: '150px', overflowY: 'auto', background: '#0f172a', padding: '0.5rem', borderRadius: '0.5rem' }}>
                                    {data[selectedNode.id]?.map(n => (
                                        <div key={n} style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>→ {n}</div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div style={{ color: '#64748b', textAlign: 'center', marginTop: '2rem' }}>
                                <Maximize2 size={32} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
                                <p>Select a node to view details</p>
                            </div>
                        )}
                    </div>

                </div>

                {/* Graph Layout */}
                <div className="card" style={{ padding: 0, overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                    <div style={{
                        position: 'absolute',
                        top: '1rem',
                        left: '1rem',
                        zIndex: 10,
                        background: 'rgba(15, 23, 42, 0.8)',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #334155',
                        backdropFilter: 'blur(4px)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                            <span style={{ width: '10px', height: '10px', background: '#3b82f6', borderRadius: '50%' }}></span> Users
                            <span style={{ width: '10px', height: '10px', background: '#ec4899', borderRadius: '50%', marginLeft: '1rem' }}></span> Accounts
                        </div>
                    </div>

                    <div style={{ flex: 1 }}>
                        {/* ForceGraph2D - Responsive via container check or use absolute fill */}
                        <ForceGraph2D
                            ref={graphRef}
                            graphData={graphData}
                            nodeLabel="id"
                            nodeColor={node => node.group === 'user' ? '#3b82f6' : '#ec4899'}
                            linkColor={() => '#334155'}
                            backgroundColor="#1e293b"
                            onNodeClick={(node) => {
                                setSelectedNode(node);
                                graphRef.current.centerAt(node.x, node.y, 1000);
                                graphRef.current.zoom(3, 1000); // Zoom in on click
                            }}
                            onBackgroundClick={() => {
                                setSelectedNode(null);
                                graphRef.current.zoomToFit(400); // Reset zoom
                            }}
                            nodeRelSize={6}

                            // Perf optimizations
                            cooldownTicks={100}
                            onEngineStop={() => graphRef.current.zoomToFit(400)}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default GraphView;
