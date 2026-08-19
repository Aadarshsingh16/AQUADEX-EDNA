import React, { useState, useEffect } from 'react';
import { API_BASE } from '../utils/config';
import './Results.css';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveHeatMap } from '@nivo/heatmap';
import { ResponsiveScatterPlot } from '@nivo/scatterplot';
import { ResponsiveSankey } from '@nivo/sankey';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';

const renderQCPanel = (qcChartData) => (
  <div className="visualization-section">
    <div className="chart-container">
      <div className="chart-header">
        <h3 className="chart-title">Read Quality Distribution</h3>
        <p className="chart-description">Percentage of reads retained vs removed after QC</p>
      </div>
      <ResponsivePie
        data={[
          { id: 'retained', label: 'Retained', value: qcChartData.retained, color: '#10b981' },
          { id: 'removed', label: 'Removed', value: qcChartData.removed, color: '#ef4444' }
        ]}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        colors={{ datum: 'data.color' }}
        borderWidth={1}
        borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
        enableArcLinkLabels={true}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#333333"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: 'color' }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor="#ffffff"
        animate={true}
        motionConfig="gentle"
      />
    </div>
    
    <div className="chart-container">
      <div className="chart-header">
        <h3 className="chart-title">Quality Metrics</h3>
        <p className="chart-description">Q20/Q30 scores and GC content distribution</p>
      </div>
      <ResponsiveBar
        data={[
          { metric: 'Q20', value: qcChartData.qualityStats.q20, color: '#3b82f6' },
          { metric: 'Q30', value: qcChartData.qualityStats.q30, color: '#6366f1' },
          { metric: 'GC%', value: qcChartData.qualityStats.gc, color: '#8b5cf6' }
        ]}
        keys={['value']}
        indexBy="metric"
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        colors={{ datum: 'data.color' }}
        borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Metric',
          legendPosition: 'middle',
          legendOffset: 32
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Percentage',
          legendPosition: 'middle',
          legendOffset: -40
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor="#ffffff"
        animate={true}
        motionConfig="gentle"
      />
    </div>
  </div>
);

const Results = ({ currentRunId }) => {
  const [results, setResults] = useState({ summaryMetrics: [], noveltyTable: [], artifacts: [] });
  const normalizeRow = (r) => ({
    id: r.id ?? r.ASV_ID ?? r.asv_id ?? '',
    noveltyScore: String(r.noveltyScore ?? r.novelty_score ?? ''),
    vaeloss: String(r.vaeloss ?? r.vae_loss ?? ''),
    faissDist: String(r.faissDist ?? r.faiss_dist ?? ''),
    epaAnnotation: r.epaAnnotation ?? r.epa_annotation ?? '',
    diamondHit: r.diamondHit ?? r.diamond_hit ?? '',
    abundance: r.abundance ?? r.Abundance ?? r.abundance_count ?? null,
    depth: r.depth ?? r.Depth ?? r.depth_m ?? null,
    location: r.location ?? r.site ?? ''
  });
  const fmt = (v) => (v === null || v === undefined || v === '' ? '-' : v);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [view, setView] = useState('both');
  const [selectedNovelty, setSelectedNovelty] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [showMetricModal, setShowMetricModal] = useState(false);

  // New state variables for visualizations
  const [activeTab, setActiveTab] = useState('qc');
  const [phylogenyColorBy, setPhylogenyColorBy] = useState('taxonomy');
  const [samplingMapVisible, setSamplingMapVisible] = useState(true);

  // Mock data for visualizations
  const qcChartData = {
    retained: 95,
    removed: 5,
    qualityStats: {
      q20: 98.5,
      q30: 95.2,
      gc: 47.3
    }
  };

  const alphaData = [
    { sample: 'Sample A', richness: 120, shannon: 3.2, simpson: 0.85 },
    { sample: 'Sample B', richness: 95, shannon: 2.8, simpson: 0.82 },
    { sample: 'Sample C', richness: 150, shannon: 3.5, simpson: 0.89 }
  ];

  const betaData = {
    pcoaPoints: [
      { id: 'Sample A', x: 0.2, y: 0.3 },
      { id: 'Sample B', x: -0.1, y: 0.4 },
      { id: 'Sample C', x: 0.3, y: -0.2 }
    ],
    heatmapData: [
      { id: 'Sample A', data: [
        { x: 'Sample A', y: 0 },
        { x: 'Sample B', y: 0.3 },
        { x: 'Sample C', y: 0.5 }
      ]},
      { id: 'Sample B', data: [
        { x: 'Sample A', y: 0.3 },
        { x: 'Sample B', y: 0 },
        { x: 'Sample C', y: 0.4 }
      ]},
      { id: 'Sample C', data: [
        { x: 'Sample A', y: 0.5 },
        { x: 'Sample B', y: 0.4 },
        { x: 'Sample C', y: 0 }
      ]}
    ]
  };

  const taxonomyData = {
    sankeyData: {
      nodes: [
        { id: 'Bacteria' },
        { id: 'Proteobacteria' },
        { id: 'Gammaproteobacteria' },
        { id: 'Unclassified' }
      ],
      links: [
        { source: 'Bacteria', target: 'Proteobacteria', value: 20 },
        { source: 'Proteobacteria', target: 'Gammaproteobacteria', value: 15 },
        { source: 'Bacteria', target: 'Unclassified', value: 5 }
      ]
    },
    stackedBarData: [
      {
        sample: 'Sample A',
        Proteobacteria: 45,
        Firmicutes: 30,
        Bacteroidetes: 15,
        Unclassified: 10
      },
      {
        sample: 'Sample B',
        Proteobacteria: 40,
        Firmicutes: 35,
        Bacteroidetes: 20,
        Unclassified: 5
      }
    ]
  };

  const samplingMapData = [
    { id: 1, lat: 12.34, lon: 56.78, depth: 3000, novelASVs: 3, sample: 'Sample A' },
    { id: 2, lat: 22.11, lon: 44.55, depth: 2500, novelASVs: 1, sample: 'Sample B' }
  ];

  useEffect(() => {
    if (currentRunId) {
      loadResults();
    }
  }, [currentRunId]);


const loadResults = async () => {
  try {
    const response = await fetch(`${API_BASE}/results/${currentRunId}`);
    if (!response.ok) throw new Error('Failed to load results');
    const data = await response.json();

    const normalized = {
      summaryMetrics: data.summaryMetrics || data.summary || [],
      noveltyTable: data.noveltyTable || data.novelty || [],
      artifacts: data.artifacts || []
    };

    // Ensure report
    if (!normalized.artifacts.find(a => a.filename === 'report.html')) {
      normalized.artifacts.push({ filename: 'report.html', url: '#', size: 2048576 });
    }

    // IMPORTANT: normalize each row so abundance/depth/location exist
    setResults({
      summaryMetrics: normalized.summaryMetrics,
      noveltyTable: (normalized.noveltyTable || []).map(normalizeRow),
      artifacts: normalized.artifacts
    });

    // Optional: debug to verify fields exist
    console.log('First novelty row from API:', (normalized.noveltyTable || [])[0]);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};

  const handleViewNovelty = (item) => {
    // Add mock visualization data
    const mockData = {
      ...item,
      sequence: 'ATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCG',
      length: 252,
      gcContent: 48.5,
      qualityScore: 35.2,
      clusterInfo: {
        clusterId: 'C3',
        clusterSize: 15,
        distanceToCenter: 0.23
      },
      taxonomyPath: [
        { level: 'Kingdom', name: 'Bacteria' },
        { level: 'Phylum', name: 'Proteobacteria' },
        { level: 'Class', name: 'Gammaproteobacteria' },
        { level: 'Order', name: 'Unknown' },
        { level: 'Family', name: 'Unknown' },
        { level: 'Genus', name: 'Unknown' },
        { level: 'Species', name: 'Novel species' }
      ],
      alignmentChart: '/assets/images/report/alignment-chart.png',
      phylogenyTree: '/assets/images/report/phylogeny-tree.png'
    };
    
    setSelectedNovelty(mockData);
    setShowModal(true);
  };

  const handleDownloadAll = async () => {
    // Create mock zip file
    const mockFiles = [
      'abundance_matrix.csv',
      'novelty_scores.csv',
      'taxonomy_assignments.tsv',
      'sequences.fasta',
      'quality_report.html',
      'umap_coordinates.csv',
      'distance_matrix.csv',
      'report.html'
    ];

    // In real implementation, this would create and download a zip
    console.log('Creating zip with files:', mockFiles);
    
    // Mock download
    const link = document.createElement('a');
    link.href = '#';
    link.download = `aquadex_results_${currentRunId}.zip`;
    link.click();
    
    alert('Downloading all results as ZIP file...');
  };


  const handleExportCSV = () => {
    const csv = [
      ['ID', 'Novelty Score', 'VAE Loss', 'FAISS Dist', 'EPA-ng Annotation', 'DIAMOND Hit', 'Abundance', 'Depth (m)', 'Location'],
      ...results.noveltyTable.map(item => [
        item.id,
        item.noveltyScore,
        item.vaeloss,
        item.faissDist,
        item.epaAnnotation,
        item.diamondHit,
        item.abundance ,
        item.depth ,
        item.location 
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `novelty_candidates_${currentRunId}.csv`;
    link.click();
  };


  const handleMetricClick = (metric) => {
    const metricDetails = {
      'ASVs assigned': {
        title: 'ASVs Assigned per Rank',
        description: 'Percentage of Amplicon Sequence Variants successfully assigned to taxonomic ranks',
        details: {
          kingdom: '98.5%',
          phylum: '95.2%',
          class: '89.7%',
          order: '82.3%',
          family: '76.8%',
          genus: '68.4%',
          species: '45.2%'
        },
        interpretation: 'Higher percentages at upper taxonomic levels indicate good database coverage. Lower species-level assignment is common for environmental samples.'
      },
      'Shannon Diversity': {
        title: 'Shannon Diversity Index',
        description: 'Measures both species richness and evenness in the community',
        details: {
          value: 4.2,
          range: '0 - 5+',
          interpretation: 'High diversity',
          samples: {
            'Sample 1': 4.1,
            'Sample 2': 4.3,
            'Sample 3': 4.2,
            'Sample 4': 4.0
          }
        },
        interpretation: 'A value of 4.2 indicates high diversity with many species present in relatively even abundances.'
      },
      'Simpson Diversity': {
        title: 'Simpson Diversity Index',
        description: 'Probability that two randomly selected individuals belong to different species',
        details: {
          value: 0.89,
          range: '0 - 1',
          interpretation: 'High diversity',
          dominance: '0.11',
          effectiveSpecies: 9.1
        },
        interpretation: 'A value of 0.89 indicates high diversity with low dominance by any single species.'
      },
      'Novel ASVs': {
        title: 'Novel ASVs Detected',
        description: 'Number of ASVs identified as potentially novel based on AI analysis',
        details: {
          total: 12,
          highConfidence: 8,
          mediumConfidence: 3,
          lowConfidence: 1,
          criteria: [
            'VAE reconstruction loss > 0.7',
            'FAISS distance > 0.8',
            'No significant DIAMOND hits'
          ]
        },
        interpretation: '12 ASVs show characteristics of novel sequences, with 8 having high confidence scores.'
      }
    };

    const metricKey = Object.keys(metricDetails).find(key => 
      (metric?.label || '').includes(key)
    );
    
    if (metricKey) {
      setSelectedMetric(metricDetails[metricKey]);
      setShowMetricModal(true);
    }
  };

  const renderAlphaDiversity = () => (
    <div className="visualization-section">
      <div className="chart-container">
        <div className="chart-header">
          <h3 className="chart-title">Alpha Diversity Metrics</h3>
          <p className="chart-description">Species richness and diversity indices across samples</p>
        </div>
        <ResponsiveBar
          data={alphaData}
          keys={['richness', 'shannon', 'simpson']}
          indexBy="sample"
          groupMode="grouped"
          margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
          padding={0.3}
          colors={{ scheme: 'nivo' }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          legends={[
            {
              dataFrom: 'keys',
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 120,
              translateY: 0,
              itemsSpacing: 2,
              itemWidth: 100,
              itemHeight: 20,
              itemDirection: 'left-to-right',
              itemOpacity: 0.85,
              symbolSize: 20,
            }
          ]}
        />
      </div>
    </div>
  );

  const renderBetaDiversity = () => (
    <div className="visualization-section">
      <div className="chart-container">
        <div className="chart-header">
          <h3 className="chart-title">PCoA Plot</h3>
          <p className="chart-description">Principal Coordinates Analysis using Bray-Curtis distances</p>
        </div>
        <ResponsiveScatterPlot
          data={[{
            id: 'samples',
            data: betaData.pcoaPoints
          }]}
          margin={{ top: 60, right: 140, bottom: 70, left: 90 }}
          xScale={{ type: 'linear', min: -0.5, max: 0.5 }}
          yScale={{ type: 'linear', min: -0.5, max: 0.5 }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'PCoA1',
            legendPosition: 'middle',
            legendOffset: 46
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'PCoA2',
            legendPosition: 'middle',
            legendOffset: -60
          }}
          nodeSize={8}
          blendMode="multiply"
        />
      </div>

      <div className="chart-container">
        <div className="chart-header">
          <h3 className="chart-title">Beta Diversity Heatmap</h3>
          <p className="chart-description">Pairwise Bray-Curtis distances between samples</p>
        </div>
        <ResponsiveHeatMap
          data={betaData.heatmapData}
          margin={{ top: 60, right: 90, bottom: 60, left: 90 }}
          valueFormat=".2f"
          axisTop={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45,
            legend: '',
            legendOffset: 46
          }}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45,
            legend: '',
            legendPosition: 'middle',
            legendOffset: 46
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: '',
            legendPosition: 'middle',
            legendOffset: -60
          }}
          colors={{
            type: 'sequential',
            scheme: 'blues'
          }}
          emptyColor="#ffffff"
          borderColor={{ from: 'color', modifiers: [['darker', 0.6]] }}
          labelTextColor={{ from: 'color', modifiers: [['darker', 1.8]] }}
          animate={true}
        />
      </div>
    </div>
  );

  const renderTaxonomyPanel = () => (
    <div className="visualization-section">
      <div className="chart-container">
        <div className="chart-header">
          <h3 className="chart-title">Taxonomy Flow</h3>
          <p className="chart-description">Hierarchical flow of taxonomic assignments</p>
        </div>
        <ResponsiveSankey
          data={taxonomyData.sankeyData}
          margin={{ top: 40, right: 160, bottom: 40, left: 50 }}
          align="justify"
          colors={{ scheme: 'category10' }}
          nodeOpacity={1}
          nodeThickness={18}
          nodeInnerPadding={3}
          nodeSpacing={24}
          nodeBorderWidth={0}
          linkOpacity={0.5}
          linkHoverOthersOpacity={0.1}
          enableLinkGradient={true}
        />
      </div>

      <div className="chart-container">
        <div className="chart-header">
          <h3 className="chart-title">Taxonomic Composition</h3>
          <p className="chart-description">Relative abundance of major taxonomic groups</p>
        </div>
        <ResponsiveBar
          data={taxonomyData.stackedBarData}
          keys={['Proteobacteria', 'Firmicutes', 'Bacteroidetes', 'Unclassified']}
          indexBy="sample"
          groupMode="stacked"
          margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
          padding={0.3}
          colors={{ scheme: 'nivo' }}
          borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Relative Abundance (%)',
            legendPosition: 'middle',
            legendOffset: -40
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          legends={[
            {
              dataFrom: 'keys',
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 120,
              translateY: 0,
              itemsSpacing: 2,
              itemWidth: 100,
              itemHeight: 20,
              itemDirection: 'left-to-right',
              itemOpacity: 0.85,
              symbolSize: 20
            }
          ]}
        />
      </div>
    </div>
  );

  // ...existing code...
// Replace the entire renderSamplingMap with this static charts version
const renderSamplingMap = () => {
  const noveltyDist = [
    { label: 'High (>0.7)', value: 67, color: '#ef4444' },
    { label: 'Medium (0.4-0.7)', value: 25, color: '#f59e0b' },
    { label: 'Low (<0.4)', value: 8, color: '#10b981' }
  ];
  const noveltyConf = [
    { id: 'High Confidence', label: 'High Confidence', value: 67, color: '#ef4444' },
    { id: 'Medium Confidence', label: 'Medium Confidence', value: 25, color: '#f59e0b' },
    { id: 'Low Confidence', label: 'Low Confidence', value: 8, color: '#10b981' }
  ];

  return (
    <div className="visualization-section">
      <div className="charts-grid">
        <div className="chart-container">
          <div className="chart-header">
            <h3 className="chart-title">Novelty Score Distribution</h3>
            <p className="chart-description">Share of ASVs by novelty score bucket</p>
          </div>
          <div style={{ height: 330 }}>
            <ResponsiveBar
              data={noveltyDist.map(d => ({ label: d.label, value: d.value, color: d.color }))}
              keys={['value']}
              indexBy="label"
              margin={{ top: 30, right: 20, bottom: 60, left: 50 }}
              padding={0.3}
              colors={{ datum: 'data.color' }}
              axisBottom={{ tickRotation: -25 }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              tooltip={({ indexValue, value }) => (
                <div style={{ background: '#111827', color: '#fff', padding: '6px 8px', borderRadius: 4, fontSize: 12 }}>
                  <div style={{ fontWeight: 600 }}>{indexValue}</div>
                  <div>Value: {value}</div>
                </div>
              )}
              animate
              motionConfig="gentle"
            />
          </div>
        </div>

        <div className="chart-container">
          <div className="chart-header">
            <h3 className="chart-title">Novelty Confidence</h3>
            <p className="chart-description">Confidence levels for novel ASV detection</p>
          </div>
          <div style={{ height: 320 }}>
            <ResponsivePie
              data={noveltyConf}
              margin={{ top: 30, right: 40, bottom: 30, left: 40 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              colors={{ datum: 'data.color' }}
              borderWidth={1}
              borderColor={{ from: 'color', modifiers: [['darker', 0.3]] }}
              arcLabelsTextColor="#ffffff"
              arcLinkLabelsTextColor="#374151"
              arcLinkLabelsColor={{ from: 'color' }}
              arcLinkLabelsThickness={2}
              tooltip={({ datum }) => (
                <div style={{ background: '#111827', color: '#fff', padding: '6px 8px', borderRadius: 4, fontSize: 12 }}>
                  {datum.id}: {datum.value}
                </div>
              )}
              animate
              motionConfig="gentle"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
// ...existing code...

  if (!currentRunId) {
    return (
      <div className="results-page-container">
        <div className="empty-state">
          <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="empty-text">No run selected. Please run an analysis first.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="results-page-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p className="loading-text">Loading results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="results-page-container">
        <div className="error-state">
          <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="error-text">Error loading results: {error}</p>
        </div>
      </div>
    );
  }

  const visibleRows = results?.noveltyTable ?? [];

  return (
    <div className="results-page-container">
      <div className="results-content">
        <div className="results-header">
          <h1 className="results-title">Analysis Results</h1>
          <p className="results-subtitle">Run ID: {currentRunId}</p>
        </div>

        {/* Summary Metrics */}
        <div className="summary-metrics">
          {results.summaryMetrics.map((metric, index) => (
            <div 
              key={index} 
              className="metric-card clickable-metric"
              onClick={() => handleMetricClick(metric)}
            >
              <div className="metric-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="metric-content">
                <p className="metric-label">{metric.label}</p>
                <p className="metric-value">{metric.value}</p>
              </div>
              <div className="metric-hover-hint">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs navigation */}
        <div className="tabs-container">
          <div className="tabs-header">
            <button 
              className={`tab-button ${activeTab === 'qc' ? 'active' : ''}`}
              onClick={() => setActiveTab('qc')}
            >
              Quality Control
            </button>
            <button 
              className={`tab-button ${activeTab === 'diversity' ? 'active' : ''}`}
              onClick={() => setActiveTab('diversity')}
            >
              Diversity
            </button>
            <button 
              className={`tab-button ${activeTab === 'taxonomy' ? 'active' : ''}`}
              onClick={() => setActiveTab('taxonomy')}
            >
              Taxonomy
            </button>
            <button 
              className={`tab-button ${activeTab === 'novelty' ? 'active' : ''}`}
              onClick={() => setActiveTab('novelty')}
            >
              Novelty
            </button>
          </div>

          {/* Tab content */}
          {activeTab === 'qc' && (
            <>
              {renderQCPanel(qcChartData)}
            </>
          )}
          {activeTab === 'diversity' && (
            <>
              {renderAlphaDiversity()}
              {renderBetaDiversity()}
            </>
          )}
          {activeTab === 'taxonomy' && renderTaxonomyPanel()}
          {activeTab === 'novelty' && (
            <>
              {renderSamplingMap()}
              {/* Existing novelty table */}
            </>
          )}
        </div>

        // ...existing code...
        {/* Novelty Table */}
        <div className="novelty-table-container">
          <h4>Novel Taxa Candidates</h4>
          <table className="novelty-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Novelty Score</th>
                <th>VAE Loss</th>
                <th>FAISS Dist</th>
                <th>EPA-ng Annotation</th>
                <th>DIAMOND Hit</th>
                <th>Abundance</th>
                <th>Depth (m)</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
            {visibleRows.map((item, index) => {
                const score = Number(item.noveltyScore);
                const level = score >= 0.8 ? 'high' : score >= 0.5 ? 'medium' : 'low';
                return (
                  <tr key={index}>
                    <td className="id-cell">{item.id}</td>
                    <td>
                      <span className={`novelty-badge ${level}`}>{item.noveltyScore}</span>
                    </td>
                    <td>{item.vaeloss}</td>
                    <td>{item.faissDist}</td>
                    <td className="annotation-cell">{item.epaAnnotation}</td>
                    <td>
                      <span className={`status-badge ${item.diamondHit === 'Yes' ? 'success' : 'neutral'}`}>
                        {item.diamondHit}
                      </span>
                    </td>
                    {/* Ensure fallbacks so cells never render empty/undefined */}
                    <td>{fmt(item.abundance)}</td>
                    <td>{fmt(item.depth)}</td>
                    <td>{fmt(item.location)}</td>
                    <td className="actions-cell">
                      <button className="table-action" onClick={() => handleViewNovelty(item)}>View</button>
                      <button className="table-action">Download</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {results.noveltyTable.length > 5 && (
            <div className="table-footer">
              <button className="show-more-btn" onClick={() => setShowAll(!showAll)}>
                {showAll ? 'Show Less' : `Show ${results.noveltyTable.length - 5} More`}
              </button>
            </div>
          )}
        </div>


        {/* Downloads Section */}
        <div className="downloads-card">
          <div className="card-header">
            <h3 className="card-title">Downloads</h3>
          </div>
          <div className="downloads-content">
            <div className="download-main">
              <button className="primary-button" onClick={handleDownloadAll}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                Download All Results (ZIP)
              </button>
              <p className="download-info">
                All files are reproducible, generated with tracked database versions and pipeline parameters.
              </p>
            </div>
            
            <div className="downloads-grid">
              <h4 className="downloads-subtitle">Individual Files</h4>
              <div className="file-list">
                {results.artifacts.map((artifact, index) => (
                  <a key={index} href={artifact.url} className="file-item" download>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="file-name">{artifact.filename}</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16" className="download-icon">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Novelty Details */}
      {showModal && selectedNovelty && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">ASV Details: {selectedNovelty.id}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="24" height="24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="modal-body">
              {/* Novelty Score Summary */}
              <div className="detail-section">
                <h3 className="section-title">Novelty Assessment</h3>
                <div className="score-grid">
                  <div className="score-item">
                    <span className="score-label">Overall Score</span>
                    <span className="score-value novelty-high">{selectedNovelty.noveltyScore}</span>
                  </div>
                  <div className="score-item">
                    <span className="score-label">VAE Loss</span>
                    <span className="score-value">{selectedNovelty.vaeloss}</span>
                  </div>
                  <div className="score-item">
                    <span className="score-label">FAISS Distance</span>
                    <span className="score-value">{selectedNovelty.faissDist}</span>
                  </div>
                </div>
              </div>

              {/* Sequence Information */}
              <div className="detail-section">
                
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Length</span>
                    <span className="info-value">{selectedNovelty.length} bp</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">GC Content</span>
                    <span className="info-value">{selectedNovelty.gcContent}%</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Quality Score</span>
                    <span className="info-value">{selectedNovelty.qualityScore}</span>
                  </div>
                </div>
                <div className="sequence-preview">
                  <code>{selectedNovelty.sequence}</code>
                </div>
              </div>

              {/* Taxonomy Path */}
              <div className="detail-section">
                <h3 className="section-title">Taxonomic Classification</h3>
                <div className="taxonomy-path">
                  {selectedNovelty.taxonomyPath.map((level, index) => (
                    <div key={index} className="taxonomy-level">
                      <span className="level-name">{level.level}:</span>
                      <span className={`level-value ${level.name === 'Unknown' ? 'unknown' : ''}`}>
                        {level.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cluster Information */}
              <div className="detail-section">
                <h3 className="section-title">Cluster Analysis</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Cluster ID</span>
                    <span className="info-value">{selectedNovelty.clusterInfo.clusterId}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Cluster Size</span>
                    <span className="info-value">{selectedNovelty.clusterInfo.clusterSize} ASVs</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Distance to Center</span>
                    <span className="info-value">{selectedNovelty.clusterInfo.distanceToCenter}</span>
                  </div>
                </div>
              </div>

              {/* Visualizations */}
              
            </div>

            <div className="modal-footer">
              <button className="text-button" onClick={() => setShowModal(false)}>Close</button>
              <button className="primary-button">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download ASV Data
              </button>
            </div>
          </div>
        </div>
      )}

      {showMetricModal && selectedMetric && (
        <div className="modal-overlay" onClick={() => setShowMetricModal(false)}>
          <div className="metric-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{selectedMetric.title}</h2>
              <button className="modal-close" onClick={() => setShowMetricModal(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="24" height="24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="metric-modal-body">
              <p className="metric-description">{selectedMetric.description}</p>
              
              <div className="metric-details">
                {selectedMetric.title.includes('ASVs Assigned') && (
                  <div className="rank-breakdown">
                    <h3>Taxonomic Assignment by Rank</h3>
                    {Object.entries(selectedMetric.details).map(([rank, value]) => (
                      <div key={rank} className="rank-item">
                        <span className="rank-name">{rank.charAt(0).toUpperCase() + rank.slice(1)}</span>
                        <div className="rank-bar">
                          <div className="rank-fill" style={{ width: value }}></div>
                        </div>
                        <span className="rank-value">{value}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {selectedMetric.title.includes('Shannon') && (
                  <div className="diversity-details">
                    <div className="diversity-stats">
                      <div className="stat-item">
                        <span className="stat-label">Current Value</span>
                        <span className="stat-value">{selectedMetric.details.value}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Typical Range</span>
                        <span className="stat-value">{selectedMetric.details.range}</span>
                      </div>
                    </div>
                    <h3>Sample Breakdown</h3>
                    <div className="sample-values">
                      {Object.entries(selectedMetric.details.samples).map(([sample, value]) => (
                        <div key={sample} className="sample-item">
                          <span>{sample}</span>
                          <span>{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedMetric.title.includes('Novel ASVs') && (
                  <div className="novelty-breakdown">
                    <div className="confidence-levels">
                      <div className="confidence-item high">
                        <span>High Confidence</span>
                        <span className="confidence-count">{selectedMetric.details.highConfidence}</span>
                      </div>
                      <div className="confidence-item medium">
                        <span>Medium Confidence</span>
                        <span className="confidence-count">{selectedMetric.details.mediumConfidence}</span>
                      </div>
                      <div className="confidence-item low">
                        <span>Low Confidence</span>
                        <span className="confidence-count">{selectedMetric.details.lowConfidence}</span>
                      </div>
                    </div>
                    <h3>Detection Criteria</h3>
                    <ul className="criteria-list">
                      {selectedMetric.details.criteria.map((criterion, index) => (
                        <li key={index}>{criterion}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="metric-interpretation">
                <h3>Interpretation</h3>
                <p>{selectedMetric.interpretation}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Results;