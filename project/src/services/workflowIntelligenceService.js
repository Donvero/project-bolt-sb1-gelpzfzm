// SAMS™ Workflow Intelligence Service
// Smart automation system for municipal financial processes
// Part of Phase 3: Smart Automation & Workflow Intelligence

class WorkflowIntelligenceService {
  constructor() {
    this.workflows = new Map();
    this.templates = new Map();
    this.activeInstances = new Map();
    this.approvalQueue = [];
    this.documentQueue = [];
    this.subscribers = new Set();
    this.initialized = false;

    // Initialize with default templates
    this._initializeDefaultTemplates();
  }

  /**
   * Initialize the service with default workflow templates
   * @private
   */
  _initializeDefaultTemplates() {
    // Budget approval workflow template
    const budgetApprovalTemplate = {
      id: 'budget-approval-workflow',
      name: 'Budget Approval Process',
      description: 'Standard workflow for budget approval with risk-based routing',
      stages: [
        {
          id: 'submission',
          name: 'Submission',
          type: 'start',
          roles: ['clerk', 'manager'],
          nextStages: ['validation'],
          autoTransition: true
        },
        {
          id: 'validation',
          name: 'Validation',
          type: 'automated',
          action: 'validateBudgetRequest',
          nextStages: ['low-risk-approval', 'medium-risk-approval', 'high-risk-approval'],
          transitionRules: [
            { condition: 'risk < 30', target: 'low-risk-approval' },
            { condition: 'risk >= 30 && risk < 70', target: 'medium-risk-approval' },
            { condition: 'risk >= 70', target: 'high-risk-approval' }
          ]
        },
        {
          id: 'low-risk-approval',
          name: 'Low Risk Approval',
          type: 'approval',
          roles: ['manager'],
          nextStages: ['notification', 'rejection'],
          sla: { hours: 24 }
        },
        {
          id: 'medium-risk-approval',
          name: 'Medium Risk Approval',
          type: 'approval',
          roles: ['manager', 'finance-director'],
          nextStages: ['notification', 'rejection'],
          sla: { hours: 48 }
        },
        {
          id: 'high-risk-approval',
          name: 'High Risk Approval',
          type: 'approval',
          roles: ['finance-director', 'cfo'],
          nextStages: ['notification', 'rejection'],
          sla: { hours: 72 }
        },
        {
          id: 'rejection',
          name: 'Rejection',
          type: 'end',
          notifyRoles: ['clerk', 'manager', 'requester']
        },
        {
          id: 'notification',
          name: 'Approval Notification',
          type: 'end',
          notifyRoles: ['clerk', 'manager', 'requester']
        }
      ]
    };

    // Procurement workflow template
    const procurementWorkflowTemplate = {
      id: 'procurement-workflow',
      name: 'Procurement Process',
      description: 'End-to-end procurement workflow with compliance checks',
      stages: [
        {
          id: 'request-creation',
          name: 'Request Creation',
          type: 'start',
          roles: ['clerk', 'manager'],
          nextStages: ['document-validation'],
          autoTransition: true
        },
        {
          id: 'document-validation',
          name: 'Document Validation',
          type: 'automated',
          action: 'validateProcurementDocuments',
          nextStages: ['compliance-check', 'document-correction'],
          transitionRules: [
            { condition: 'documentsValid', target: 'compliance-check' },
            { condition: '!documentsValid', target: 'document-correction' }
          ]
        },
        {
          id: 'document-correction',
          name: 'Document Correction',
          type: 'task',
          roles: ['clerk'],
          nextStages: ['document-validation'],
          sla: { hours: 24 }
        },
        {
          id: 'compliance-check',
          name: 'Compliance Check',
          type: 'automated',
          action: 'checkProcurementCompliance',
          nextStages: ['department-approval', 'compliance-correction'],
          transitionRules: [
            { condition: 'compliant', target: 'department-approval' },
            { condition: '!compliant', target: 'compliance-correction' }
          ]
        },
        {
          id: 'compliance-correction',
          name: 'Compliance Correction',
          type: 'task',
          roles: ['manager', 'compliance-officer'],
          nextStages: ['compliance-check'],
          sla: { hours: 48 }
        },
        {
          id: 'department-approval',
          name: 'Department Approval',
          type: 'approval',
          roles: ['department-head'],
          nextStages: ['finance-approval', 'rejection'],
          sla: { hours: 72 }
        },
        {
          id: 'finance-approval',
          name: 'Finance Approval',
          type: 'approval',
          roles: ['finance-director'],
          nextStages: ['final-approval', 'rejection'],
          sla: { hours: 48 }
        },
        {
          id: 'final-approval',
          name: 'Final Approval',
          type: 'approval',
          roles: ['cfo'],
          nextStages: ['order-creation', 'rejection'],
          sla: { hours: 48 },
          conditionRules: [
            { condition: 'amount > 100000', required: true },
            { condition: 'amount <= 100000', bypass: true, target: 'order-creation' }
          ]
        },
        {
          id: 'order-creation',
          name: 'Purchase Order Creation',
          type: 'automated',
          action: 'createPurchaseOrder',
          nextStages: ['completion'],
          autoTransition: true
        },
        {
          id: 'rejection',
          name: 'Request Rejected',
          type: 'end',
          notifyRoles: ['clerk', 'manager', 'requester', 'department-head']
        },
        {
          id: 'completion',
          name: 'Procurement Completed',
          type: 'end',
          notifyRoles: ['clerk', 'manager', 'requester', 'department-head']
        }
      ]
    };

    // Document approval workflow template
    const documentApprovalTemplate = {
      id: 'document-approval-workflow',
      name: 'Document Approval Process',
      description: 'Workflow for document review and approval with intelligence',
      stages: [
        {
          id: 'upload',
          name: 'Document Upload',
          type: 'start',
          roles: ['clerk', 'manager', 'officer'],
          nextStages: ['classification'],
          autoTransition: true
        },
        {
          id: 'classification',
          name: 'Document Classification',
          type: 'automated',
          action: 'classifyDocument',
          nextStages: ['data-extraction'],
          autoTransition: true
        },
        {
          id: 'data-extraction',
          name: 'Data Extraction',
          type: 'automated',
          action: 'extractDocumentData',
          nextStages: ['validation'],
          autoTransition: true
        },
        {
          id: 'validation',
          name: 'Document Validation',
          type: 'automated',
          action: 'validateDocumentData',
          nextStages: ['review', 'correction'],
          transitionRules: [
            { condition: 'validationPassed', target: 'review' },
            { condition: '!validationPassed', target: 'correction' }
          ]
        },
        {
          id: 'correction',
          name: 'Data Correction',
          type: 'task',
          roles: ['clerk', 'officer'],
          nextStages: ['validation'],
          sla: { hours: 24 }
        },
        {
          id: 'review',
          name: 'Document Review',
          type: 'approval',
          roles: ['manager'],
          nextStages: ['approval', 'rejection'],
          sla: { hours: 48 }
        },
        {
          id: 'approval',
          name: 'Final Approval',
          type: 'approval',
          roles: ['department-head', 'finance-director'],
          nextStages: ['processing', 'rejection'],
          sla: { hours: 72 }
        },
        {
          id: 'processing',
          name: 'Document Processing',
          type: 'automated',
          action: 'processApprovedDocument',
          nextStages: ['archiving'],
          autoTransition: true
        },
        {
          id: 'archiving',
          name: 'Document Archiving',
          type: 'automated',
          action: 'archiveDocument',
          nextStages: ['completion'],
          autoTransition: true
        },
        {
          id: 'rejection',
          name: 'Document Rejected',
          type: 'end',
          notifyRoles: ['clerk', 'manager', 'requester']
        },
        {
          id: 'completion',
          name: 'Document Processing Completed',
          type: 'end',
          notifyRoles: ['clerk', 'manager', 'requester']
        }
      ]
    };

    // Add templates to the store
    this.templates.set(budgetApprovalTemplate.id, budgetApprovalTemplate);
    this.templates.set(procurementWorkflowTemplate.id, procurementWorkflowTemplate);
    this.templates.set(documentApprovalTemplate.id, documentApprovalTemplate);
  }

  /**
   * Initialize the workflow service
   * @returns {Promise<boolean>} - Success status
   */
  async initialize() {
    if (this.initialized) {
      return true;
    }

    try {
      // In a real implementation, this would load from a database
      console.log('Initializing Workflow Intelligence Service');
      
      // Mock load active workflow instances
      this._loadMockWorkflowInstances();
      
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize workflow service:', error);
      return false;
    }
  }

  /**
   * Load mock workflow instances for demonstration
   * @private
   */
  _loadMockWorkflowInstances() {
    // Create mock workflow instances
    const mockInstances = [
      {
        id: 'wf-1001',
        templateId: 'budget-approval-workflow',
        name: 'Q3 Marketing Budget Approval',
        status: 'in-progress',
        currentStage: 'medium-risk-approval',
        data: {
          department: 'Marketing',
          amount: 75000,
          description: 'Q3 Marketing Campaign Budget',
          risk: 45,
          submittedBy: 'John Smith',
          submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        history: [
          {
            stage: 'submission',
            completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            actor: 'John Smith',
            comments: 'Initial submission for Q3 marketing budget'
          },
          {
            stage: 'validation',
            completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            actor: 'system',
            comments: 'Automatic validation - Medium risk detected'
          }
        ]
      },
      {
        id: 'wf-1002',
        templateId: 'procurement-workflow',
        name: 'IT Equipment Procurement',
        status: 'in-progress',
        currentStage: 'finance-approval',
        data: {
          department: 'IT',
          amount: 125000,
          description: 'New server and networking equipment',
          vendor: 'TechSupply Inc.',
          risk: 35,
          submittedBy: 'Alice Johnson',
          submittedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
        },
        history: [
          {
            stage: 'request-creation',
            completedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            actor: 'Alice Johnson',
            comments: 'Initial procurement request for IT equipment'
          },
          {
            stage: 'document-validation',
            completedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            actor: 'system',
            comments: 'Documents validated successfully'
          },
          {
            stage: 'compliance-check',
            completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            actor: 'system',
            comments: 'Compliance check passed'
          },
          {
            stage: 'department-approval',
            completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            actor: 'Michael Chen',
            comments: 'Approved by IT Department Head'
          }
        ]
      },
      {
        id: 'wf-1003',
        templateId: 'document-approval-workflow',
        name: 'Annual Financial Report Approval',
        status: 'in-progress',
        currentStage: 'review',
        data: {
          documentType: 'Financial Report',
          fiscalYear: '2024-2025',
          department: 'Finance',
          submittedBy: 'Sarah Williams',
          submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        history: [
          {
            stage: 'upload',
            completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            actor: 'Sarah Williams',
            comments: 'Uploaded annual financial report for review'
          },
          {
            stage: 'classification',
            completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            actor: 'system',
            comments: 'Document classified as Financial Report'
          },
          {
            stage: 'data-extraction',
            completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            actor: 'system',
            comments: 'Financial data extracted successfully'
          },
          {
            stage: 'validation',
            completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            actor: 'system',
            comments: 'Document validation passed'
          }
        ]
      }
    ];

    // Add mock instances to the active instances map
    mockInstances.forEach(instance => {
      this.activeInstances.set(instance.id, instance);
    });

    // Add items to approval queue
    this.approvalQueue = [
      {
        id: 'app-1001',
        workflowId: 'wf-1001',
        stage: 'medium-risk-approval',
        name: 'Q3 Marketing Budget Approval',
        priority: 'medium',
        assignedRoles: ['manager', 'finance-director'],
        data: {
          department: 'Marketing',
          amount: 75000,
          description: 'Q3 Marketing Campaign Budget'
        },
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'app-1002',
        workflowId: 'wf-1002',
        stage: 'finance-approval',
        name: 'IT Equipment Procurement',
        priority: 'high',
        assignedRoles: ['finance-director'],
        data: {
          department: 'IT',
          amount: 125000,
          description: 'New server and networking equipment',
          vendor: 'TechSupply Inc.'
        },
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'app-1003',
        workflowId: 'wf-1003',
        stage: 'review',
        name: 'Annual Financial Report Approval',
        priority: 'medium',
        assignedRoles: ['manager'],
        data: {
          documentType: 'Financial Report',
          fiscalYear: '2024-2025',
          department: 'Finance'
        },
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
  }

  /**
   * Get all workflow templates
   * @returns {Array} - List of workflow templates
   */
  getWorkflowTemplates() {
    return Array.from(this.templates.values());
  }

  /**
   * Get a workflow template by ID
   * @param {string} templateId - The template ID
   * @returns {Object|null} - The workflow template or null if not found
   */
  getWorkflowTemplate(templateId) {
    return this.templates.get(templateId) || null;
  }

  /**
   * Create a new workflow template
   * @param {Object} template - The workflow template to create
   * @returns {string} - The ID of the created template
   */
  createWorkflowTemplate(template) {
    const templateId = template.id || `template-${Date.now()}`;
    const newTemplate = {
      ...template,
      id: templateId,
      createdAt: new Date().toISOString()
    };
    
    this.templates.set(templateId, newTemplate);
    return templateId;
  }

  /**
   * Update an existing workflow template
   * @param {string} templateId - The template ID to update
   * @param {Object} updates - The updates to apply
   * @returns {boolean} - Success status
   */
  updateWorkflowTemplate(templateId, updates) {
    const template = this.templates.get(templateId);
    if (!template) {
      return false;
    }
    
    const updatedTemplate = {
      ...template,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    this.templates.set(templateId, updatedTemplate);
    return true;
  }

  /**
   * Get all active workflow instances
   * @param {Object} filters - Optional filters
   * @returns {Array} - List of workflow instances
   */
  getWorkflowInstances(filters = {}) {
    let instances = Array.from(this.activeInstances.values());
    
    // Apply filters if provided
    if (filters.status) {
      instances = instances.filter(instance => instance.status === filters.status);
    }
    
    if (filters.templateId) {
      instances = instances.filter(instance => instance.templateId === filters.templateId);
    }
    
    return instances;
  }

  /**
   * Get a workflow instance by ID
   * @param {string} instanceId - The instance ID
   * @returns {Object|null} - The workflow instance or null if not found
   */
  getWorkflowInstance(instanceId) {
    return this.activeInstances.get(instanceId) || null;
  }

  /**
   * Create a new workflow instance
   * @param {string} templateId - The template ID to use
   * @param {Object} data - The initial data for the workflow
   * @param {string} name - Optional name for the workflow
   * @returns {string} - The ID of the created workflow instance
   */
  createWorkflowInstance(templateId, data, name = '') {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Workflow template not found: ${templateId}`);
    }
    
    const instanceId = `wf-${Date.now()}`;
    const startStage = template.stages.find(stage => stage.type === 'start');
    
    if (!startStage) {
      throw new Error(`No start stage found in template: ${templateId}`);
    }
    
    const instance = {
      id: instanceId,
      templateId,
      name: name || template.name,
      status: 'created',
      currentStage: startStage.id,
      data,
      history: [],
      createdAt: new Date().toISOString()
    };
    
    this.activeInstances.set(instanceId, instance);
    
    // Start the workflow
    this.startWorkflow(instanceId);
    
    return instanceId;
  }

  /**
   * Start a workflow instance
   * @param {string} instanceId - The instance ID
   * @returns {boolean} - Success status
   */
  startWorkflow(instanceId) {
    const instance = this.activeInstances.get(instanceId);
    if (!instance || instance.status !== 'created') {
      return false;
    }
    
    // Update status to in-progress
    instance.status = 'in-progress';
    instance.startedAt = new Date().toISOString();
    
    // Process the current stage
    this._processStage(instance, instance.currentStage);
    
    return true;
  }

  /**
   * Process a workflow stage
   * @param {Object} instance - The workflow instance
   * @param {string} stageId - The stage ID to process
   * @private
   */
  _processStage(instance, stageId) {
    const template = this.templates.get(instance.templateId);
    const stage = template.stages.find(s => s.id === stageId);
    
    if (!stage) {
      console.error(`Stage not found: ${stageId} in workflow ${instance.id}`);
      return;
    }
    
    // Process based on stage type
    switch (stage.type) {
      case 'start':
        // Add to history
        this._addToHistory(instance, stage.id, 'system', 'Workflow started');
        
        // If auto-transition, move to next stage
        if (stage.autoTransition && stage.nextStages && stage.nextStages.length > 0) {
          this._transitionToNextStage(instance, stage.id, stage.nextStages[0]);
        }
        break;
        
      case 'automated':
        // For demo purposes, we'll simulate automated actions
        // In a real implementation, this would call specific functions
        console.log(`Executing automated action: ${stage.action} for workflow ${instance.id}`);
        
        // Add to history
        this._addToHistory(instance, stage.id, 'system', `Automated action: ${stage.action}`);
        
        // Determine next stage based on transition rules
        if (stage.transitionRules && stage.transitionRules.length > 0) {
          // Evaluate rules (simplified for demo)
          const rule = this._evaluateTransitionRules(stage.transitionRules, instance.data);
          if (rule) {
            this._transitionToNextStage(instance, stage.id, rule.target);
          } else if (stage.nextStages && stage.nextStages.length > 0) {
            // Default to first next stage if no rule matches
            this._transitionToNextStage(instance, stage.id, stage.nextStages[0]);
          }
        } else if (stage.autoTransition && stage.nextStages && stage.nextStages.length > 0) {
          // Auto-transition to next stage
          this._transitionToNextStage(instance, stage.id, stage.nextStages[0]);
        }
        break;
        
      case 'approval':
        // Add to approval queue
        this._addToApprovalQueue(instance, stage);
        break;
        
      case 'task':
        // Task stages require user action
        // Add to task queue (would be implemented in a real system)
        console.log(`Adding task for stage ${stage.id} in workflow ${instance.id}`);
        break;
        
      case 'end':
        // End the workflow
        instance.status = 'completed';
        instance.completedAt = new Date().toISOString();
        
        // Add to history
        this._addToHistory(instance, stage.id, 'system', 'Workflow completed');
        
        // Notify roles
        if (stage.notifyRoles && stage.notifyRoles.length > 0) {
          this._notifyRoles(instance, stage.notifyRoles, `Workflow ${instance.name} has been completed`);
        }
        break;
        
      default:
        console.error(`Unknown stage type: ${stage.type} in workflow ${instance.id}`);
    }
  }

  /**
   * Evaluate transition rules
   * @param {Array} rules - The transition rules
   * @param {Object} data - The workflow data
   * @returns {Object|null} - The matching rule or null
   * @private
   */
  _evaluateTransitionRules(rules, data) {
    // This is a simplified rule evaluation for demo purposes
    // In a real implementation, this would use a proper expression evaluator
    
    // For demo, we'll use some hardcoded evaluations based on the rules
    // In reality, you'd evaluate the condition expressions properly
    
    for (const rule of rules) {
      if (rule.condition === 'risk < 30' && data.risk < 30) {
        return rule;
      } else if (rule.condition === 'risk >= 30 && risk < 70' && data.risk >= 30 && data.risk < 70) {
        return rule;
      } else if (rule.condition === 'risk >= 70' && data.risk >= 70) {
        return rule;
      } else if (rule.condition === 'documentsValid' && data.documentsValid) {
        return rule;
      } else if (rule.condition === '!documentsValid' && !data.documentsValid) {
        return rule;
      } else if (rule.condition === 'compliant' && data.compliant) {
        return rule;
      } else if (rule.condition === '!compliant' && !data.compliant) {
        return rule;
      } else if (rule.condition === 'validationPassed' && data.validationPassed) {
        return rule;
      } else if (rule.condition === '!validationPassed' && !data.validationPassed) {
        return rule;
      }
    }
    
    return null;
  }

  /**
   * Transition to the next stage in a workflow
   * @param {Object} instance - The workflow instance
   * @param {string} currentStageId - The current stage ID
   * @param {string} nextStageId - The next stage ID
   * @private
   */
  _transitionToNextStage(instance, currentStageId, nextStageId) {
    // Update the current stage
    instance.currentStage = nextStageId;
    
    // Add transition to history
    this._addToHistory(
      instance, 
      currentStageId, 
      'system', 
      `Transitioned from ${currentStageId} to ${nextStageId}`
    );
    
    // Process the next stage
    this._processStage(instance, nextStageId);
  }

  /**
   * Add an entry to workflow history
   * @param {Object} instance - The workflow instance
   * @param {string} stage - The stage ID
   * @param {string} actor - The actor (user or system)
   * @param {string} comments - Comments for the history entry
   * @private
   */
  _addToHistory(instance, stage, actor, comments) {
    if (!instance.history) {
      instance.history = [];
    }
    
    instance.history.push({
      stage,
      actor,
      comments,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Add a task to the approval queue
   * @param {Object} instance - The workflow instance
   * @param {Object} stage - The stage definition
   * @private
   */
  _addToApprovalQueue(instance, stage) {
    const template = this.templates.get(instance.templateId);
    
    // Calculate priority based on SLA or risk
    let priority = 'medium';
    if (stage.sla && stage.sla.hours) {
      if (stage.sla.hours <= 24) {
        priority = 'high';
      } else if (stage.sla.hours > 72) {
        priority = 'low';
      }
    }
    
    if (instance.data && instance.data.risk) {
      if (instance.data.risk >= 70) {
        priority = 'high';
      }
    }
    
    // Calculate due date based on SLA
    let dueDate = new Date();
    if (stage.sla && stage.sla.hours) {
      dueDate.setHours(dueDate.getHours() + stage.sla.hours);
    } else {
      // Default to 48 hours
      dueDate.setHours(dueDate.getHours() + 48);
    }
    
    // Create approval task
    const approvalTask = {
      id: `app-${Date.now()}`,
      workflowId: instance.id,
      templateId: instance.templateId,
      stage: stage.id,
      name: instance.name,
      priority,
      assignedRoles: stage.roles || [],
      data: instance.data,
      createdAt: new Date().toISOString(),
      dueDate: dueDate.toISOString()
    };
    
    // Add to queue
    this.approvalQueue.push(approvalTask);
    
    // Notify assigned roles
    if (stage.roles && stage.roles.length > 0) {
      this._notifyRoles(
        instance, 
        stage.roles, 
        `New approval task: ${instance.name} is waiting for your approval`
      );
    }
  }

  /**
   * Notify roles about a workflow event
   * @param {Object} instance - The workflow instance
   * @param {Array} roles - The roles to notify
   * @param {string} message - The notification message
   * @private
   */
  _notifyRoles(instance, roles, message) {
    // In a real implementation, this would send notifications to users with these roles
    console.log(`Notifying roles ${roles.join(', ')}: ${message}`);
  }

  /**
   * Get items in the approval queue
   * @param {Object} filters - Optional filters (role, priority, etc.)
   * @returns {Array} - The filtered approval queue
   */
  getApprovalQueue(filters = {}) {
    let queue = [...this.approvalQueue];
    
    // Apply filters
    if (filters.role) {
      queue = queue.filter(item => 
        item.assignedRoles && item.assignedRoles.includes(filters.role)
      );
    }
    
    if (filters.priority) {
      queue = queue.filter(item => item.priority === filters.priority);
    }
    
    // Sort by priority and due date
    queue.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      
      if (priorityDiff !== 0) {
        return priorityDiff;
      }
      
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
    
    return queue;
  }

  /**
   * Process an approval (approve or reject)
   * @param {string} approvalId - The approval ID
   * @param {boolean} approved - Whether the task is approved
   * @param {string} userId - The user ID making the approval
   * @param {string} comments - Comments for the approval
   * @returns {boolean} - Success status
   */
  processApproval(approvalId, approved, userId, comments) {
    const approvalIndex = this.approvalQueue.findIndex(item => item.id === approvalId);
    if (approvalIndex === -1) {
      return false;
    }
    
    const approval = this.approvalQueue[approvalIndex];
    const instance = this.activeInstances.get(approval.workflowId);
    
    if (!instance) {
      return false;
    }
    
    const template = this.templates.get(instance.templateId);
    const stage = template.stages.find(s => s.id === approval.stage);
    
    // Remove from queue
    this.approvalQueue.splice(approvalIndex, 1);
    
    // Add to history
    this._addToHistory(
      instance, 
      approval.stage, 
      userId, 
      `${approved ? 'Approved' : 'Rejected'}: ${comments || 'No comments'}`
    );
    
    // Transition to next stage based on approval
    if (approved) {
      if (stage.nextStages && stage.nextStages.length > 0) {
        // Find the non-rejection stage
        const nextStage = stage.nextStages.find(s => s !== 'rejection');
        if (nextStage) {
          this._transitionToNextStage(instance, approval.stage, nextStage);
        }
      }
    } else {
      // Find the rejection stage
      const rejectionStage = stage.nextStages.find(s => s === 'rejection');
      if (rejectionStage) {
        this._transitionToNextStage(instance, approval.stage, rejectionStage);
      }
    }
    
    return true;
  }

  /**
   * Get workflow analytics and statistics
   * @returns {Object} - Analytics data
   */
  getWorkflowAnalytics() {
    const instances = Array.from(this.activeInstances.values());
    
    // Calculate statistics
    const totalWorkflows = instances.length;
    const activeWorkflows = instances.filter(i => i.status === 'in-progress').length;
    const completedWorkflows = instances.filter(i => i.status === 'completed').length;
    
    // Calculate approval statistics
    const pendingApprovals = this.approvalQueue.length;
    const highPriorityApprovals = this.approvalQueue.filter(i => i.priority === 'high').length;
    
    // Calculate average completion time (simplified)
    let avgCompletionTime = 0;
    const completedInstances = instances.filter(i => i.status === 'completed' && i.startedAt && i.completedAt);
    if (completedInstances.length > 0) {
      const totalTime = completedInstances.reduce((sum, i) => {
        const start = new Date(i.startedAt);
        const end = new Date(i.completedAt);
        return sum + (end - start);
      }, 0);
      
      avgCompletionTime = totalTime / completedInstances.length / (1000 * 60 * 60); // in hours
    }
    
    // Calculate bottlenecks (simplified)
    const stageTimings = {};
    instances.forEach(instance => {
      if (!instance.history || instance.history.length < 2) {
        return;
      }
      
      for (let i = 0; i < instance.history.length - 1; i++) {
        const current = instance.history[i];
        const next = instance.history[i + 1];
        
        const stage = current.stage;
        const startTime = new Date(current.timestamp);
        const endTime = new Date(next.timestamp);
        const duration = (endTime - startTime) / (1000 * 60 * 60); // in hours
        
        if (!stageTimings[stage]) {
          stageTimings[stage] = [];
        }
        
        stageTimings[stage].push(duration);
      }
    });
    
    // Calculate average time per stage
    const stageAvgTimes = {};
    Object.entries(stageTimings).forEach(([stage, times]) => {
      if (times.length > 0) {
        const avg = times.reduce((sum, time) => sum + time, 0) / times.length;
        stageAvgTimes[stage] = avg;
      }
    });
    
    // Find bottlenecks (stages with highest average time)
    const bottlenecks = Object.entries(stageAvgTimes)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([stage, time]) => ({ stage, avgTime: time }));
    
    return {
      totalWorkflows,
      activeWorkflows,
      completedWorkflows,
      pendingApprovals,
      highPriorityApprovals,
      avgCompletionTime,
      bottlenecks,
      stageAvgTimes
    };
  }

  /**
   * Subscribe to workflow events
   * @param {Function} callback - The callback function
   * @returns {string} - Subscription ID
   */
  subscribe(callback) {
    const subscriptionId = `sub-${Date.now()}`;
    this.subscribers.add({ id: subscriptionId, callback });
    return subscriptionId;
  }

  /**
   * Unsubscribe from workflow events
   * @param {string} subscriptionId - The subscription ID
   * @returns {boolean} - Success status
   */
  unsubscribe(subscriptionId) {
    for (const subscriber of this.subscribers) {
      if (subscriber.id === subscriptionId) {
        this.subscribers.delete(subscriber);
        return true;
      }
    }
    return false;
  }
}

export const workflowIntelligenceService = new WorkflowIntelligenceService();
export default workflowIntelligenceService;
