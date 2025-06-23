// SAMS™ Document Intelligence Service
// Handles advanced document processing, including classification, data extraction, and validation.
// Part of Phase 3: Smart Automation & Workflow Intelligence

class DocumentIntelligenceService {
  constructor() {
    this.documentQueue = new Map();
    this.processingInterval = null;
    this.subscribers = new Set();
  }

  /**
   * Subscribe to updates from the service.
   * @param {function} callback - The function to call with updates.
   * @returns {function} - A function to unsubscribe.
   */
  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  /**
   * Notify all subscribers of changes.
   * @private
   */
  _notify() {
    const documents = this.getProcessedDocuments();
    for (const callback of this.subscribers) {
      callback(documents);
    }
  }

  /**
   * Add a document to the processing queue.
   * @param {File} file - The file to process.
   * @returns {string} - The ID of the document in the queue.
   */
  addDocument(file) {
    const documentId = `doc-${Date.now()}`;
    const doc = {
      id: documentId,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'queued',
      progress: 0,
      createdAt: new Date().toISOString(),
      stages: [],
      extractedData: null,
      validation: null,
    };
    this.documentQueue.set(documentId, doc);
    this._notify();
    this._startProcessing();
    return documentId;
  }

  /**
   * Start the document processing simulation.
   * @private
   */
  _startProcessing() {
    if (this.processingInterval) return;
    this.processingInterval = setInterval(() => {
      const queuedDocs = Array.from(this.documentQueue.values()).filter(d => d.status !== 'completed' && d.status !== 'failed');
      if (queuedDocs.length === 0) {
        clearInterval(this.processingInterval);
        this.processingInterval = null;
        return;
      }

      // Process one document at a time
      const docToProcess = queuedDocs.find(d => d.status !== 'processing');
      if (docToProcess) {
        this._processDocument(docToProcess.id);
      }
    }, 2000); // Process a new document every 2 seconds
  }

  /**
   * Simulate the multi-stage processing of a single document.
   * @param {string} documentId - The ID of the document to process.
   * @private
   */
  async _processDocument(documentId) {
    const doc = this.documentQueue.get(documentId);
    if (!doc || doc.status === 'processing') return;

    doc.status = 'processing';
    this._notify();

    const stages = [
      { name: 'OCR & Text Extraction', duration: 3000, progress: 25 },
      { name: 'Content Classification', duration: 2000, progress: 50 },
      { name: 'Key Data Extraction', duration: 4000, progress: 75 },
      { name: 'Compliance Validation', duration: 3000, progress: 100 },
    ];

    for (const stage of stages) {
      await new Promise(resolve => setTimeout(resolve, stage.duration));
      doc.progress = stage.progress;
      doc.stages.push({ name: stage.name, status: 'completed', timestamp: new Date().toISOString() });
      this._notify();
    }

    // Simulate final results
    doc.extractedData = this._getMockExtractedData(doc.name);
    doc.validation = this._getMockValidationResult(doc.extractedData);
    doc.status = doc.validation.isValid ? 'completed' : 'failed';
    doc.completedAt = new Date().toISOString();
    this._notify();
  }

  /**
   * Generate mock extracted data based on filename.
   * @private
   */
  _getMockExtractedData(filename) {
    if (filename.toLowerCase().includes('invoice')) {
      return {
        'Document Type': 'Invoice',
        'Invoice Number': `INV-${Math.floor(1000 + Math.random() * 9000)}`,
        'Vendor': 'City Power',
        'Amount': (Math.random() * 5000).toFixed(2),
        'Date': new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      };
    }
    if (filename.toLowerCase().includes('report')) {
      return {
        'Document Type': 'Financial Report',
        'Report Period': 'Q2 2025',
        'Department': 'Treasury',
        'Total Revenue': (Math.random() * 1000000).toFixed(2),
        'Total Expenditure': (Math.random() * 800000).toFixed(2),
      };
    }
    return {
      'Document Type': 'Unknown',
      'Content Snippet': 'No key data points could be automatically extracted.',
    };
  }

  /**
   * Generate mock validation results.
   * @private
   */
  _getMockValidationResult(extractedData) {
    const isValid = Math.random() > 0.2; // 80% chance of success
    if (!isValid) {
      return {
        isValid: false,
        issues: ['Amount exceeds departmental budget limits.', 'Missing required authorization signature.'],
      };
    }
    return {
      isValid: true,
      checks: [
        { rule: 'MFMA Section 32', status: 'passed' },
        { rule: 'Budgetary Alignment', status: 'passed' },
        { rule: 'Vendor Verification', status: 'passed' },
      ],
    };
  }

  /**
   * Get all processed or queued documents.
   * @returns {Array} - A list of all documents.
   */
  getProcessedDocuments() {
    return Array.from(this.documentQueue.values()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
}

export const documentIntelligenceService = new DocumentIntelligenceService();
