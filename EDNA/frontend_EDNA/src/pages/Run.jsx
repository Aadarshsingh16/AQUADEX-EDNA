import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader, Compass, Sparkles, Database, ArrowRight } from 'lucide-react';
import { API_BASE } from '../utils/config';
import { DEMO_DATASETS } from '../utils/demoDatasets';
import './run.css';

const Run = ({ onNavigate, setCurrentRunId, onSelectDemo }) => {
  const [files, setFiles] = useState([]);
  const [marker, setMarker] = useState('16S');
  const [readType, setReadType] = useState('short');
  const [isUploading, setIsUploading] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('');
  const [runId, setRunId] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFiles(Array.from(e.dataTransfer.files));
    }
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    try {
      const response = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      const serverRunId = result.run_id || result.runId || result.runID || result.id;
      if (!serverRunId) {
        setStatus('Upload succeeded but no run_id returned from server.');
        return;
      }
      setRunId(serverRunId);
      setCurrentRunId(serverRunId);
      setStatus(`Files uploaded: ${result.saved_files.join(', ')}`);
    } catch (error) {
      setStatus(`Upload error: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const startPipeline = async () => {
    if (!runId) return;

    setIsRunning(true);
    try {
      const response = await fetch(`${API_BASE}/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          run_id: runId,
          marker: marker,
          read_type: readType,
          options: {}
        }),
      });
      const result = await response.json();
      setStatus('Pipeline started successfully!');
      pollStatus();
    } catch (error) {
      setStatus(`Pipeline error: ${error.message}`);
      setIsRunning(false);
    }
  };

  const pollStatus = async () => {
    try {
      const response = await fetch(`${API_BASE}/status/${runId}`);
      const result = await response.json();
      setStatus(`Status: ${result.status} (${Math.round(result.progress * 100)}%)`);
      if (result.status === 'completed') {
        setIsRunning(false);
        setStatus('Pipeline completed! View results.');
      } else if (result.status === 'failed') {
        setIsRunning(false);
        setStatus('Pipeline failed.');
      } else if (result.status === 'running') {
        setTimeout(pollStatus, 5000);
      }
    } catch (error) {
      setStatus(`Status error: ${error.message}`);
      setIsRunning(false);
    }
  };

  const getStatusIcon = () => {
    if (isUploading || isRunning) return <Loader className="status-icon spinning" />;
    if (status.includes('completed')) return <CheckCircle className="status-icon success" />;
    if (status.includes('error') || status.includes('failed')) return <AlertCircle className="status-icon error" />;
    return null;
  };

  return (
    <div className="run-page">
      <div className="run-container">
        <div className="run-header">
          <h1 className="run-title">Run eDNA Analysis</h1>
          <p className="run-subtitle">Upload your FASTA files or explore pre-analyzed deep sea test cases</p>
        </div>

        {/* Demo Datasets Explorer Banner */}
        <div className="demo-explorer-section">
          <div className="demo-section-header">
            <div className="demo-title-group">
              <Compass className="demo-header-icon" />
              <div>
                <h2 className="demo-section-title">Explore Pre-Analyzed Test Cases</h2>
                <p className="demo-section-subtitle">No files to upload? Jump straight into interactive results with curated deep-sea datasets</p>
              </div>
            </div>
          </div>
          
          <div className="demo-cards-grid">
            {DEMO_DATASETS.map((demo) => (
              <div 
                key={demo.id} 
                className="demo-card"
                onClick={() => onSelectDemo(demo.id)}
              >
                <div className="demo-card-badge">{demo.tag}</div>
                <h3 className="demo-card-title">{demo.title}</h3>
                <p className="demo-card-sub">{demo.subtitle}</p>
                <div className="demo-card-meta">
                  <span><strong>Marker:</strong> {demo.marker}</span>
                  <span><strong>Depth:</strong> {demo.depth}</span>
                </div>
                <div className="demo-card-stats">
                  <span className="stat-pill">{demo.readsCount}</span>
                  <span className="stat-pill highlight">{demo.summaryMetrics.find(m => m.label.includes('Novel'))?.value || 'Novel ASVs'}</span>
                </div>
                <button className="demo-card-btn">
                  Explore Results <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="run-divider">
          <span>OR UPLOAD YOUR OWN SEQUENCING DATA</span>
        </div>

        <div className="run-content">
          {/* Upload Section */}
          <div className="upload-section">
            <h2 className="section-title">Upload Files</h2>
            <div 
              className={`upload-area ${dragActive ? 'drag-active' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input 
                type="file" 
                multiple 
                accept=".fasta,.fa,.fas,.fasta.gz,.fa.gz,.fas.gz"
                className="file-input"
                id="file-upload"
                onChange={handleFileChange}
              />
              <label htmlFor="file-upload" className="upload-label">
                <Upload className="upload-icon" />
                <span className="upload-text">Drag & drop your FASTA files here</span>
                <span className="upload-subtext">or click to browse</span>
                <span className="upload-formats">Supported formats: .fasta, .fa, .fas (including .gz)</span>
              </label>
            </div>

            {files.length > 0 && (
              <div className="files-list">
                <h3 className="files-list-title">Selected Files ({files.length})</h3>
                {files.map((file, index) => (
                  <div key={index} className="file-item">
                    <FileText className="file-icon" />
                    <span className="file-name">{file.name}</span>
                    <span className="file-size">{(file.size / 1024).toFixed(1)} KB</span>
                    <button 
                      className="file-remove"
                      onClick={() => removeFile(index)}
                      aria-label="Remove file"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Configuration Section */}
          <div className="config-section">
            <h2 className="section-title">Configuration</h2>
            <div className="config-grid">
              <div className="config-group">
                <label className="config-label" htmlFor="marker">Marker Gene</label>
                <select 
                  id="marker"
                  className="config-select"
                  value={marker}
                  onChange={(e) => setMarker(e.target.value)}
                >
                  <option value="16S">16S rRNA</option>
                  <option value="18S">18S rRNA</option>
                  <option value="COI">COI</option>
                </select>
              </div>
              <div className="config-group">
                <label className="config-label" htmlFor="readType">Read Type</label>
                <select 
                  id="readType"
                  className="config-select"
                  value={readType}
                  onChange={(e) => setReadType(e.target.value)}
                >
                  <option value="short">Short reads</option>
                  <option value="long">Long reads</option>
                </select>
              </div>
            </div>
          </div>

          {/* Status Section */}
          {status && (
            <div className="status-section">
              <div className="status-content">
                {getStatusIcon()}
                <span className="status-text">{status}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="action-section">
            {!runId ? (
              <button 
                className={`btn-primary ${isUploading ? 'loading' : ''}`}
                onClick={uploadFiles}
                disabled={isUploading || files.length === 0}
              >
                {isUploading ? (
                  <>
                    <Loader className="btn-icon spinning" />
                    Uploading...
                  </>
                ) : (
                  'Upload Files'
                )}
              </button>
            ) : !isRunning && status.includes('completed') ? (
              <button 
                className="btn-primary"
                onClick={() => {
                  setCurrentRunId(runId);
                  onNavigate('results');
                }}
              >
                View Results
              </button>
            ) : (
              <button 
                className={`btn-primary ${isRunning ? 'loading' : ''}`}
                onClick={startPipeline}
                disabled={isRunning}
              >
                {isRunning ? (
                  <>
                    <Loader className="btn-icon spinning" />
                    Running Analysis...
                  </>
                ) : (
                  'Start Pipeline'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Run;