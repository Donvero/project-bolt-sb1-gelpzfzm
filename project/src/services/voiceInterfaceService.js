// Voice Interface Service for SAMS™ Platform
// Enables hands-free operation through voice commands

class VoiceInterfaceService {
  constructor() {
    this.isListening = false;
    this.commandRegistry = new Map();
    this.recognition = null;
    this.isSupported = this.checkSupport();
    this.lastTranscript = '';
    this.confidenceThreshold = 0.7;
    this.language = 'en-US';
    this.callbacks = {
      onStart: () => {},
      onResult: () => {},
      onError: () => {},
      onEnd: () => {}
    };
  }

  // Check if speech recognition is supported
  checkSupport() {
    return 'webkitSpeechRecognition' in window || 
           'SpeechRecognition' in window;
  }

  // Initialize the speech recognition service
  initialize(callbacks = {}) {
    if (!this.isSupported) {
      console.error('Speech recognition is not supported in this browser');
      return false;
    }

    // Set up the speech recognition object
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = this.language;

    // Set up the callbacks
    this.callbacks = { ...this.callbacks, ...callbacks };

    // Handle results
    this.recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
          const confidence = event.results[i][0].confidence;
          
          if (confidence > this.confidenceThreshold) {
            this.processCommand(finalTranscript.trim());
          }
        } else {
          interimTranscript += transcript;
        }
      }

      this.lastTranscript = finalTranscript || interimTranscript;
      this.callbacks.onResult({
        finalTranscript,
        interimTranscript,
        lastTranscript: this.lastTranscript
      });
    };

    // Set up other event handlers
    this.recognition.onstart = () => {
      this.isListening = true;
      this.callbacks.onStart();
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error', event);
      this.callbacks.onError(event);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.callbacks.onEnd();
    };

    // Register default commands
    this.registerDefaultCommands();

    return true;
  }

  // Start listening for voice commands
  startListening() {
    if (!this.recognition) {
      const initialized = this.initialize();
      if (!initialized) return false;
    }

    try {
      this.recognition.start();
      return true;
    } catch (error) {
      console.error('Error starting speech recognition', error);
      return false;
    }
  }

  // Stop listening for voice commands
  stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
        return true;
      } catch (error) {
        console.error('Error stopping speech recognition', error);
        return false;
      }
    }
    return false;
  }

  // Toggle listening state
  toggleListening() {
    return this.isListening ? this.stopListening() : this.startListening();
  }

  // Process a received command
  processCommand(transcript) {
    console.log('Processing command:', transcript);
    
    for (const [pattern, handler] of this.commandRegistry.entries()) {
      if (this.matchCommand(transcript, pattern)) {
        console.log('Command matched:', pattern);
        handler(transcript);
        return true;
      }
    }

    console.log('No matching command found');
    return false;
  }

  // Match a transcript against a command pattern
  matchCommand(transcript, pattern) {
    const lowerTranscript = transcript.toLowerCase();
    
    if (typeof pattern === 'string') {
      return lowerTranscript.includes(pattern.toLowerCase());
    } else if (pattern instanceof RegExp) {
      return pattern.test(lowerTranscript);
    }
    
    return false;
  }

  // Register a voice command with a callback handler
  registerCommand(pattern, handler) {
    if (!pattern || typeof handler !== 'function') {
      console.error('Invalid command registration');
      return false;
    }

    this.commandRegistry.set(pattern, handler);
    return true;
  }

  // Unregister a voice command
  unregisterCommand(pattern) {
    return this.commandRegistry.delete(pattern);
  }

  // Register default navigation and action commands
  registerDefaultCommands() {
    // Navigation commands
    this.registerCommand('go to dashboard', () => window.location.href = '/dashboard');
    this.registerCommand('go to intelligence', () => window.location.href = '/intelligence');
    this.registerCommand('go to compliance', () => window.location.href = '/compliance');
    this.registerCommand('go to budget', () => window.location.href = '/budget');
    this.registerCommand('go to procurement', () => window.location.href = '/procurement');
    this.registerCommand('go to reports', () => window.location.href = '/reports');
    this.registerCommand('go to settings', () => window.location.href = '/settings');
    this.registerCommand('go to alerts', () => window.location.href = '/alerts');
    this.registerCommand('go to workflow', () => window.location.href = '/workflow-intelligence');
    this.registerCommand('go to mobile', () => window.location.href = '/mobile-ux');

    // Application controls
    this.registerCommand('sign out', () => {
      // Find and trigger logout function
      const logoutBtn = document.querySelector('[aria-label="logout"]');
      if (logoutBtn) logoutBtn.click();
    });
    
    this.registerCommand('help', () => {
      alert('Voice commands available: "Go to [page name]", "Sign out", "Search for [term]"');
    });

    // Search command
    this.registerCommand(/search for (.+)/i, (transcript) => {
      const match = /search for (.+)/i.exec(transcript);
      if (match && match[1]) {
        const searchTerm = match[1].trim();
        // Implement search functionality here
        console.log('Searching for:', searchTerm);
        // Could dispatch an event or call a search function
        window.dispatchEvent(new CustomEvent('voice-search', { detail: { searchTerm } }));
      }
    });
  }

  // Get the current status of the voice interface
  getStatus() {
    return {
      supported: this.isSupported,
      listening: this.isListening,
      lastTranscript: this.lastTranscript,
      registeredCommands: Array.from(this.commandRegistry.keys()).map(pattern => {
        return typeof pattern === 'string' ? pattern : pattern.toString();
      }),
      language: this.language
    };
  }

  // Change recognition language
  setLanguage(languageCode) {
    if (!languageCode) return false;
    
    this.language = languageCode;
    if (this.recognition) {
      this.recognition.lang = languageCode;
    }
    return true;
  }

  // Set confidence threshold for command recognition
  setConfidenceThreshold(threshold) {
    if (threshold >= 0 && threshold <= 1) {
      this.confidenceThreshold = threshold;
      return true;
    }
    return false;
  }

  // Training mode for better recognition accuracy
  startTrainingMode(commandsToTrain, callback) {
    // Implementation would depend on the specific speech recognition API
    // This is a simplified placeholder
    return {
      success: false,
      message: 'Training mode not implemented in this version'
    };
  }

  // Get available voices for text-to-speech feedback
  getAvailableVoices() {
    if ('speechSynthesis' in window) {
      return window.speechSynthesis.getVoices();
    }
    return [];
  }

  // Speak text as feedback to user
  speak(text, voiceOptions = {}) {
    if (!('speechSynthesis' in window)) {
      console.error('Text-to-speech not supported');
      return false;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Apply voice options
    if (voiceOptions.voice) utterance.voice = voiceOptions.voice;
    if (voiceOptions.rate) utterance.rate = voiceOptions.rate;
    if (voiceOptions.pitch) utterance.pitch = voiceOptions.pitch;
    if (voiceOptions.volume) utterance.volume = voiceOptions.volume;
    if (voiceOptions.lang) utterance.lang = voiceOptions.lang;
    
    window.speechSynthesis.speak(utterance);
    return true;
  }
}

// Create and export singleton instance
export const voiceInterfaceService = new VoiceInterfaceService();
export default voiceInterfaceService;
