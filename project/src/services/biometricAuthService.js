// Biometric Authentication Service for SAMS™ Platform
// Enhanced Mobile Security & User Experience

class BiometricAuthService {
  constructor() {
    this.isSupported = this.checkBiometricSupport();
    this.enrolledUsers = new Map();
    this.authAttempts = new Map();
  }

  // Check if biometric authentication is supported
  checkBiometricSupport() {
    return (
      typeof window !== 'undefined' &&
      'credentials' in navigator &&
      'PublicKeyCredential' in window &&
      typeof PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function'
    );
  }

  // Initialize biometric authentication for a user
  async initializeBiometric(userId, userDisplayName) {
    if (!this.isSupported) {
      throw new Error('Biometric authentication is not supported on this device');
    }

    try {
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: new Uint8Array(32),
          rp: {
            name: "SAMS Municipal Platform",
            id: "sams.municipal.gov",
          },
          user: {
            id: new TextEncoder().encode(userId),
            name: userDisplayName,
            displayName: userDisplayName,
          },
          pubKeyCredParams: [{alg: -7, type: "public-key"}],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "required"
          },
          timeout: 60000,
          attestation: "direct"
        }
      });

      // Store the credential for the user
      this.enrolledUsers.set(userId, {
        credentialId: credential.id,
        publicKey: credential.response.publicKey,
        enrollmentDate: new Date(),
        lastUsed: new Date()
      });

      return {
        success: true,
        message: 'Biometric authentication successfully enrolled',
        credentialId: credential.id
      };
    } catch (error) {
      console.error('Biometric enrollment failed:', error);
      return {
        success: false,
        message: 'Failed to enroll biometric authentication',
        error: error.message
      };
    }
  }

  // Authenticate user using biometrics
  async authenticateWithBiometric(userId) {
    if (!this.isSupported) {
      throw new Error('Biometric authentication is not supported');
    }

    if (!this.enrolledUsers.has(userId)) {
      throw new Error('User not enrolled for biometric authentication');
    }

    try {
      const userCredential = this.enrolledUsers.get(userId);
      
      const assertion = await navigator.credentials.get({
        publicKey: {
          challenge: new Uint8Array(32),
          allowCredentials: [{
            id: new TextEncoder().encode(userCredential.credentialId),
            type: 'public-key'
          }],
          userVerification: "required",
          timeout: 60000
        }
      });

      // Update last used timestamp
      userCredential.lastUsed = new Date();
      this.enrolledUsers.set(userId, userCredential);

      // Log successful authentication
      this.logAuthAttempt(userId, true, 'biometric');

      return {
        success: true,
        message: 'Biometric authentication successful',
        timestamp: new Date(),
        method: 'biometric'
      };
    } catch (error) {
      console.error('Biometric authentication failed:', error);
      
      // Log failed authentication
      this.logAuthAttempt(userId, false, 'biometric');

      return {
        success: false,
        message: 'Biometric authentication failed',
        error: error.message
      };
    }
  }

  // Check if user is enrolled for biometric auth
  isUserEnrolled(userId) {
    return this.enrolledUsers.has(userId);
  }

  // Remove biometric enrollment for a user
  async removeBiometricEnrollment(userId) {
    if (this.enrolledUsers.has(userId)) {
      this.enrolledUsers.delete(userId);
      return {
        success: true,
        message: 'Biometric enrollment removed successfully'
      };
    }
    return {
      success: false,
      message: 'User not enrolled for biometric authentication'
    };
  }

  // Get biometric capabilities of the device
  async getBiometricCapabilities() {
    if (!this.isSupported) {
      return {
        supported: false,
        capabilities: []
      };
    }

    try {
      const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      
      return {
        supported: true,
        platformAuthenticator: available,
        capabilities: [
          'fingerprint',
          'face_recognition',
          'voice_recognition',
          'touch_id',
          'face_id'
        ].filter(() => available)
      };
    } catch (error) {
      return {
        supported: false,
        capabilities: [],
        error: error.message
      };
    }
  }

  // Log authentication attempts for audit trail
  logAuthAttempt(userId, success, method) {
    const attempts = this.authAttempts.get(userId) || [];
    attempts.push({
      timestamp: new Date(),
      success,
      method,
      ip: this.getClientIP(),
      userAgent: navigator.userAgent
    });
    
    // Keep only last 10 attempts
    if (attempts.length > 10) {
      attempts.splice(0, attempts.length - 10);
    }
    
    this.authAttempts.set(userId, attempts);
  }

  // Get user's authentication history
  getAuthHistory(userId) {
    return this.authAttempts.get(userId) || [];
  }

  // Get client IP (mock for demo)
  getClientIP() {
    // In a real implementation, this would be handled server-side
    return '192.168.1.1';
  }

  // Enable quick biometric re-authentication
  async quickAuth(userId) {
    const userCredential = this.enrolledUsers.get(userId);
    if (!userCredential) {
      throw new Error('User not enrolled');
    }

    // Check if last authentication was recent (within 5 minutes)
    const timeSinceLastAuth = Date.now() - userCredential.lastUsed.getTime();
    if (timeSinceLastAuth < 5 * 60 * 1000) {
      return {
        success: true,
        message: 'Quick authentication successful',
        method: 'quick_biometric'
      };
    }

    // Perform full biometric authentication
    return await this.authenticateWithBiometric(userId);
  }

  // Get security status for user
  getSecurityStatus(userId) {
    const enrolled = this.isUserEnrolled(userId);
    const history = this.getAuthHistory(userId);
    const lastAuth = history.length > 0 ? history[history.length - 1] : null;

    return {
      biometricEnrolled: enrolled,
      lastAuthentication: lastAuth,
      totalAttempts: history.length,
      successfulAttempts: history.filter(attempt => attempt.success).length,
      securityLevel: enrolled ? 'high' : 'medium'
    };
  }
}

// Create and export singleton instance
export const biometricAuthService = new BiometricAuthService();
export default biometricAuthService;
