import React, { useState, useCallback, useRef } from 'react';

const FileUploadZone = ({ onFilesUploaded, maxFiles = 5 }) => {
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [expandedFiles, setExpandedFiles] = useState(new Set());
  const fileInputRef = useRef(null);

  // Detect data type from sample values
  const detectDataType = (values) => {
    const nonEmptyValues = values.filter(v => v !== null && v !== undefined && v !== '');
    if (nonEmptyValues.length === 0) return 'string';
    
    const sample = nonEmptyValues.slice(0, 10);
    
    // Check for dates
    const datePattern = /^\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4}|\d{2}-\d{2}-\d{4}/;
    if (sample.some(v => datePattern.test(String(v)))) return 'date';
    
    // Check for numbers
    const numericCount = sample.filter(v => !isNaN(Number(v))).length;
    if (numericCount / sample.length > 0.8) {
      const hasDecimals = sample.some(v => String(v).includes('.'));
      return hasDecimals ? 'float' : 'int';
    }
    
    return 'string';
  };

  // Parse CSV content
  const parseCSV = (content) => {
    const lines = content.split('\n').filter(line => line.trim());
    if (lines.length === 0) return { headers: [], rows: [], totalRows: 0 };
    
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const rows = lines.slice(1).map(line => 
      line.split(',').map(cell => cell.trim().replace(/"/g, ''))
    );
    
    return { headers, rows, totalRows: rows.length };
  };

  // Parse JSON content
  const parseJSON = (content) => {
    try {
      const data = JSON.parse(content);
      const array = Array.isArray(data) ? data : [data];
      
      if (array.length === 0) return { headers: [], rows: [], totalRows: 0 };
      
      const headers = Object.keys(array[0]);
      const rows = array.map(obj => headers.map(h => obj[h]));
      
      return { headers, rows, totalRows: rows.length };
    } catch (error) {
      throw new Error('Invalid JSON format');
    }
  };

  // Calculate data quality metrics
  const calculateDataQuality = (headers, rows) => {
    const totalCells = headers.length * rows.length;
    if (totalCells === 0) return { missingPercent: 0, outliers: 0 };
    
    let missingCount = 0;
    const columnStats = {};
    
    headers.forEach((header, colIndex) => {
      const columnValues = rows.map(row => row[colIndex]);
      const nonEmpty = columnValues.filter(v => v !== null && v !== undefined && v !== '');
      
      missingCount += columnValues.length - nonEmpty.length;
      
      // Calculate outliers for numeric columns
      const numericValues = nonEmpty.filter(v => !isNaN(Number(v))).map(Number);
      if (numericValues.length > 0) {
        const sorted = numericValues.sort((a, b) => a - b);
        const q1 = sorted[Math.floor(sorted.length * 0.25)];
        const q3 = sorted[Math.floor(sorted.length * 0.75)];
        const iqr = q3 - q1;
        const lowerBound = q1 - 1.5 * iqr;
        const upperBound = q3 + 1.5 * iqr;
        
        columnStats[header] = {
          outliers: numericValues.filter(v => v < lowerBound || v > upperBound).length
        };
      }
    });
    
    const totalOutliers = Object.values(columnStats).reduce((sum, stat) => sum + (stat.outliers || 0), 0);
    
    return {
      missingPercent: Math.round((missingCount / totalCells) * 100),
      outliers: totalOutliers
    };
  };

  // Process uploaded file
  const processFile = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target.result;
          let parsedData;
          
          if (file.name.toLowerCase().endsWith('.csv')) {
            parsedData = parseCSV(content);
          } else if (file.name.toLowerCase().endsWith('.json')) {
            parsedData = parseJSON(content);
          } else {
            throw new Error('Unsupported file format');
          }
          
          const { headers, rows, totalRows } = parsedData;
          const preview = rows.slice(0, 5);
          
          // Detect column types
          const columnTypes = headers.map((header, index) => {
            const columnValues = rows.map(row => row[index]);
            return detectDataType(columnValues);
          });
          
          // Calculate data quality
          const dataQuality = calculateDataQuality(headers, rows);
          
          const fileData = {
            id: Date.now() + Math.random(),
            name: file.name,
            size: file.size,
            type: file.type,
            headers,
            columnTypes,
            preview,
            totalRows,
            totalColumns: headers.length,
            dataQuality,
            rawData: rows
          };
          
          resolve(fileData);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  // Handle file drop
  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    setDragActive(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = droppedFiles.filter(file => 
      file.name.toLowerCase().endsWith('.csv') || file.name.toLowerCase().endsWith('.json')
    );
    
    if (validFiles.length === 0) {
      alert('Please upload CSV or JSON files only');
      return;
    }
    
    if (files.length + validFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }
    
    try {
      const processedFiles = await Promise.all(validFiles.map(processFile));
      const newFiles = [...files, ...processedFiles];
      setFiles(newFiles);
      onFilesUploaded?.(newFiles);
    } catch (error) {
      alert(`Error processing files: ${error.message}`);
    }
  }, [files, maxFiles, onFilesUploaded]);

  // Handle drag events
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragOut = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  // Handle file input change
  const handleFileInput = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter(file => 
      file.name.toLowerCase().endsWith('.csv') || file.name.toLowerCase().endsWith('.json')
    );
    
    if (validFiles.length === 0) {
      alert('Please upload CSV or JSON files only');
      return;
    }
    
    if (files.length + validFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }
    
    try {
      const processedFiles = await Promise.all(validFiles.map(processFile));
      const newFiles = [...files, ...processedFiles];
      setFiles(newFiles);
      onFilesUploaded?.(newFiles);
    } catch (error) {
      alert(`Error processing files: ${error.message}`);
    }
  };

  // Remove file
  const removeFile = (fileId) => {
    const newFiles = files.filter(f => f.id !== fileId);
    setFiles(newFiles);
    setExpandedFiles(prev => {
      const newSet = new Set(prev);
      newSet.delete(fileId);
      return newSet;
    });
    onFilesUploaded?.(newFiles);
  };

  // Toggle file preview expansion
  const toggleExpanded = (fileId) => {
    setExpandedFiles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(fileId)) {
        newSet.delete(fileId);
      } else {
        newSet.add(fileId);
      }
      return newSet;
    });
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="file-upload-container">
      {/* Drop Zone */}
      <div
        className={`drop-zone ${dragActive ? 'drag-active' : ''} ${files.length > 0 ? 'has-files' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDrag}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="drop-zone-content">
          <div className="upload-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7,10 12,15 17,10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </div>
          <div className="drop-zone-text">
            <p className="primary-text">Drag your CSV/JSON files here or click to browse</p>
            <p className="secondary-text">Maximum {maxFiles} files • CSV and JSON formats supported</p>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".csv,.json"
          onChange={handleFileInput}
          style={{ display: 'none' }}
        />
      </div>

      {/* File Queue */}
      {files.length > 0 && (
        <div className="file-queue">
          <h3>Uploaded Files ({files.length}/{maxFiles})</h3>
          {files.map((file) => (
            <div key={file.id} className="file-preview">
              <div className="file-header">
                <div className="file-info">
                  <div className="file-name">{file.name}</div>
                  <div className="file-meta">
                    {formatFileSize(file.size)} • {file.totalRows} rows • {file.totalColumns} columns
                  </div>
                </div>
                <div className="file-actions">
                  <button
                    className="expand-btn"
                    onClick={() => toggleExpanded(file.id)}
                    title={expandedFiles.has(file.id) ? 'Collapse' : 'Expand'}
                  >
                    {expandedFiles.has(file.id) ? '−' : '+'}
                  </button>
                  <button
                    className="remove-btn"
                    onClick={() => removeFile(file.id)}
                    title="Remove file"
                  >
                    ×
                  </button>
                </div>
              </div>

              {expandedFiles.has(file.id) && (
                <div className="file-details">
                  {/* Data Quality Indicators */}
                  <div className="data-quality">
                    <div className="quality-item">
                      <span className="label">Missing Values:</span>
                      <span className={`value ${file.dataQuality.missingPercent > 10 ? 'warning' : 'good'}`}>
                        {file.dataQuality.missingPercent}%
                      </span>
                    </div>
                    <div className="quality-item">
                      <span className="label">Outliers:</span>
                      <span className={`value ${file.dataQuality.outliers > 0 ? 'warning' : 'good'}`}>
                        {file.dataQuality.outliers}
                      </span>
                    </div>
                  </div>

                  {/* Data Preview Table */}
                  <div className="data-preview">
                    <table>
                      <thead>
                        <tr>
                          {file.headers.map((header, index) => (
                            <th key={index}>
                              <div className="header-content">
                                <span className="header-name">{header}</span>
                                <span className={`data-type ${file.columnTypes[index]}`}>
                                  {file.columnTypes[index]}
                                </span>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {file.preview.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                              <td key={cellIndex}>
                                {cell === null || cell === undefined || cell === '' ? (
                                  <span className="empty-cell">—</span>
                                ) : (
                                  String(cell)
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {file.totalRows > 5 && (
                      <div className="preview-note">
                        Showing first 5 of {file.totalRows} rows
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .file-upload-container {
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
        }

        .drop-zone {
          border: 2px dashed #d1d5db;
          border-radius: 12px;
          padding: 40px 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: #f9fafb;
          min-height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .drop-zone:hover {
          border-color: #3b82f6;
          background: #eff6ff;
        }

        .drop-zone.drag-active {
          border-color: #3b82f6;
          background: #dbeafe;
          transform: scale(1.02);
        }

        .drop-zone.has-files {
          min-height: 120px;
          padding: 20px;
        }

        .drop-zone-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .upload-icon {
          color: #6b7280;
          transition: color 0.3s ease;
        }

        .drop-zone:hover .upload-icon {
          color: #3b82f6;
        }

        .drop-zone-text {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .primary-text {
          font-size: 18px;
          font-weight: 600;
          color: #374151;
          margin: 0;
        }

        .secondary-text {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
        }

        .file-queue {
          margin-top: 24px;
        }

        .file-queue h3 {
          margin: 0 0 16px 0;
          font-size: 18px;
          font-weight: 600;
          color: #374151;
        }

        .file-preview {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          margin-bottom: 12px;
          background: white;
          overflow: hidden;
        }

        .file-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: #f9fafb;
        }

        .file-info {
          flex: 1;
        }

        .file-name {
          font-weight: 600;
          color: #374151;
          margin-bottom: 4px;
        }

        .file-meta {
          font-size: 14px;
          color: #6b7280;
        }

        .file-actions {
          display: flex;
          gap: 8px;
        }

        .expand-btn, .remove-btn {
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: bold;
          transition: all 0.2s ease;
        }

        .expand-btn {
          background: #e5e7eb;
          color: #374151;
        }

        .expand-btn:hover {
          background: #d1d5db;
        }

        .remove-btn {
          background: #fee2e2;
          color: #dc2626;
        }

        .remove-btn:hover {
          background: #fecaca;
        }

        .file-details {
          padding: 16px;
          border-top: 1px solid #e5e7eb;
        }

        .data-quality {
          display: flex;
          gap: 24px;
          margin-bottom: 16px;
          padding: 12px;
          background: #f9fafb;
          border-radius: 6px;
        }

        .quality-item {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .quality-item .label {
          font-size: 14px;
          color: #6b7280;
        }

        .quality-item .value {
          font-weight: 600;
          font-size: 14px;
        }

        .quality-item .value.good {
          color: #059669;
        }

        .quality-item .value.warning {
          color: #d97706;
        }

        .data-preview {
          overflow-x: auto;
        }

        .data-preview table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }

        .data-preview th {
          background: #f3f4f6;
          padding: 12px 8px;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
          font-weight: 600;
        }

        .header-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .header-name {
          color: #374151;
        }

        .data-type {
          font-size: 11px;
          font-weight: 500;
          padding: 2px 6px;
          border-radius: 4px;
          text-transform: uppercase;
        }

        .data-type.string {
          background: #dbeafe;
          color: #1e40af;
        }

        .data-type.int {
          background: #dcfce7;
          color: #166534;
        }

        .data-type.float {
          background: #fef3c7;
          color: #92400e;
        }

        .data-type.date {
          background: #fce7f3;
          color: #be185d;
        }

        .data-preview td {
          padding: 8px;
          border-bottom: 1px solid #f3f4f6;
          max-width: 150px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .empty-cell {
          color: #9ca3af;
          font-style: italic;
        }

        .preview-note {
          padding: 8px;
          text-align: center;
          font-size: 12px;
          color: #6b7280;
          background: #f9fafb;
          border-top: 1px solid #e5e7eb;
        }

        @media (max-width: 640px) {
          .drop-zone {
            padding: 20px 16px;
            min-height: 150px;
          }

          .primary-text {
            font-size: 16px;
          }

          .data-quality {
            flex-direction: column;
            gap: 12px;
          }

          .data-preview {
            font-size: 12px;
          }

          .data-preview th,
          .data-preview td {
            padding: 6px 4px;
            max-width: 100px;
          }
        }
      `}</style>
    </div>
  );
};

export default FileUploadZone;