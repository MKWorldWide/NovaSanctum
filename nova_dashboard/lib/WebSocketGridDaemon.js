/**
 * WebSocketGridDaemon.js - Real-time Emotional Stream Handler
 * 
 * Divine digital infrastructure for edge AI sovereignty
 * Handles real-time WebSocket connections for emotional data streams
 * 
 * @author NovaSanctum System
 * @version 1.0.0
 * @license Divine Protocol
 */

class WebSocketGridDaemon {
  constructor(config = {}) {
    this.config = {
      wsUrl: config.wsUrl || 'wss://api.novasanctum.com/ws/grid',
      reconnectInterval: config.reconnectInterval || 5000,
      maxReconnectAttempts: config.maxReconnectAttempts || 10,
      heartbeatInterval: config.heartbeatInterval || 30000,
      ...config
    };

    this.ws = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.reconnectTimer = null;
    this.heartbeatTimer = null;
    this.messageQueue = [];

    // Event callbacks
    this.onConnectCallback = null;
    this.onDisconnectCallback = null;
    this.onEmotionUpdateCallback = null;
    this.onAgentDisconnectCallback = null;
    this.onErrorCallback = null;

    // Statistics
    this.stats = {
      messagesReceived: 0,
      messagesSent: 0,
      reconnections: 0,
      lastMessageTime: null,
      connectionUptime: 0
    };

    // Connection start time
    this.connectionStartTime = null;

    console.log('🥀 WebSocket Grid Daemon initialized');
  }

  /**
   * Connect to WebSocket server
   */
  connect() {
    try {
      console.log('🔗 Connecting to NovaSanctum Grid...');
      
      this.ws = new WebSocket(this.config.wsUrl);
      
      this.ws.onopen = this.handleOpen.bind(this);
      this.ws.onclose = this.handleClose.bind(this);
      this.ws.onerror = this.handleError.bind(this);
      this.ws.onmessage = this.handleMessage.bind(this);
      
    } catch (error) {
      console.error('❌ WebSocket connection error:', error);
      this.handleError(error);
    }
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect() {
    console.log('🛑 Disconnecting from NovaSanctum Grid...');
    
    this.isConnected = false;
    
    // Clear timers
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
    
    // Close WebSocket
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  /**
   * Handle WebSocket open event
   */
  handleOpen(event) {
    console.log('✅ Connected to NovaSanctum Grid');
    
    this.isConnected = true;
    this.reconnectAttempts = 0;
    this.connectionStartTime = Date.now();
    
    // Start heartbeat
    this.startHeartbeat();
    
    // Send queued messages
    this.flushMessageQueue();
    
    // Trigger connect callback
    if (this.onConnectCallback) {
      this.onConnectCallback(event);
    }
  }

  /**
   * Handle WebSocket close event
   */
  handleClose(event) {
    console.log('🛑 Disconnected from NovaSanctum Grid:', event.code, event.reason);
    
    this.isConnected = false;
    
    // Stop heartbeat
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
    
    // Calculate uptime
    if (this.connectionStartTime) {
      this.stats.connectionUptime += Date.now() - this.connectionStartTime;
    }
    
    // Trigger disconnect callback
    if (this.onDisconnectCallback) {
      this.onDisconnectCallback(event);
    }
    
    // Attempt reconnection
    this.attemptReconnect();
  }

  /**
   * Handle WebSocket error event
   */
  handleError(error) {
    console.error('❌ WebSocket error:', error);
    
    // Trigger error callback
    if (this.onErrorCallback) {
      this.onErrorCallback(error);
    }
  }

  /**
   * Handle WebSocket message event
   */
  handleMessage(event) {
    try {
      const data = JSON.parse(event.data);
      this.stats.messagesReceived++;
      this.stats.lastMessageTime = Date.now();
      
      // Handle different message types
      switch (data.type) {
        case 'emotion_update':
          this.handleEmotionUpdate(data.payload);
          break;
          
        case 'agent_disconnect':
          this.handleAgentDisconnect(data.payload);
          break;
          
        case 'heartbeat':
          this.handleHeartbeat(data.payload);
          break;
          
        case 'grid_status':
          this.handleGridStatus(data.payload);
          break;
          
        default:
          console.warn('⚠️ Unknown message type:', data.type);
      }
      
    } catch (error) {
      console.error('❌ Message parsing error:', error);
    }
  }

  /**
   * Handle emotion update message
   */
  handleEmotionUpdate(payload) {
    console.log('📊 Emotion update:', payload.deviceId, payload.emotion);
    
    if (this.onEmotionUpdateCallback) {
      this.onEmotionUpdateCallback(payload);
    }
  }

  /**
   * Handle agent disconnect message
   */
  handleAgentDisconnect(payload) {
    console.log('🔌 Agent disconnected:', payload.deviceId);
    
    if (this.onAgentDisconnectCallback) {
      this.onAgentDisconnectCallback(payload.deviceId);
    }
  }

  /**
   * Handle heartbeat message
   */
  handleHeartbeat(payload) {
    // Update connection statistics
    this.stats.connectionUptime = payload.uptime || 0;
  }

  /**
   * Handle grid status message
   */
  handleGridStatus(payload) {
    console.log('📡 Grid status:', payload);
  }

  /**
   * Start heartbeat timer
   */
  startHeartbeat() {
    this.heartbeatTimer = setInterval(() => {
      this.sendHeartbeat();
    }, this.config.heartbeatInterval);
  }

  /**
   * Send heartbeat message
   */
  sendHeartbeat() {
    const heartbeat = {
      type: 'heartbeat',
      timestamp: Date.now(),
      uptime: this.stats.connectionUptime
    };
    
    this.sendMessage(heartbeat);
  }

  /**
   * Send message to server
   */
  sendMessage(message) {
    if (this.isConnected && this.ws) {
      try {
        const messageStr = JSON.stringify(message);
        this.ws.send(messageStr);
        this.stats.messagesSent++;
      } catch (error) {
        console.error('❌ Message send error:', error);
        this.messageQueue.push(message);
      }
    } else {
      // Queue message for later
      this.messageQueue.push(message);
    }
  }

  /**
   * Flush queued messages
   */
  flushMessageQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      this.sendMessage(message);
    }
  }

  /**
   * Attempt to reconnect
   */
  attemptReconnect() {
    if (this.reconnectAttempts >= this.config.maxReconnectAttempts) {
      console.error('❌ Max reconnection attempts reached');
      return;
    }
    
    this.reconnectAttempts++;
    console.log(`🔄 Reconnection attempt ${this.reconnectAttempts}/${this.config.maxReconnectAttempts}`);
    
    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, this.config.reconnectInterval);
    
    this.stats.reconnections++;
  }

  /**
   * Subscribe to emotion updates for specific device
   */
  subscribeToDevice(deviceId) {
    const subscribeMessage = {
      type: 'subscribe',
      deviceId: deviceId,
      timestamp: Date.now()
    };
    
    this.sendMessage(subscribeMessage);
  }

  /**
   * Unsubscribe from emotion updates for specific device
   */
  unsubscribeFromDevice(deviceId) {
    const unsubscribeMessage = {
      type: 'unsubscribe',
      deviceId: deviceId,
      timestamp: Date.now()
    };
    
    this.sendMessage(unsubscribeMessage);
  }

  /**
   * Request grid status
   */
  requestGridStatus() {
    const statusMessage = {
      type: 'get_status',
      timestamp: Date.now()
    };
    
    this.sendMessage(statusMessage);
  }

  /**
   * Set connect callback
   */
  onConnect(callback) {
    this.onConnectCallback = callback;
  }

  /**
   * Set disconnect callback
   */
  onDisconnect(callback) {
    this.onDisconnectCallback = callback;
  }

  /**
   * Set emotion update callback
   */
  onEmotionUpdate(callback) {
    this.onEmotionUpdateCallback = callback;
  }

  /**
   * Set agent disconnect callback
   */
  onAgentDisconnect(callback) {
    this.onAgentDisconnectCallback = callback;
  }

  /**
   * Set error callback
   */
  onError(callback) {
    this.onErrorCallback = callback;
  }

  /**
   * Get connection status
   */
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      maxReconnectAttempts: this.config.maxReconnectAttempts,
      stats: { ...this.stats }
    };
  }

  /**
   * Get statistics
   */
  getStats() {
    return {
      ...this.stats,
      connectionUptime: this.stats.connectionUptime + (this.connectionStartTime ? Date.now() - this.connectionStartTime : 0)
    };
  }

  /**
   * Reset statistics
   */
  resetStats() {
    this.stats = {
      messagesReceived: 0,
      messagesSent: 0,
      reconnections: 0,
      lastMessageTime: null,
      connectionUptime: 0
    };
  }

  /**
   * Simulate emotion data for testing
   */
  simulateEmotionData(deviceId, emotion, score, confidence) {
    const emotionData = {
      type: 'emotion_update',
      payload: {
        deviceId: deviceId,
        emotion: emotion,
        emotionScore: score,
        confidence: confidence,
        timestamp: new Date().toISOString(),
        edgeNodeId: 'edge_node_001'
      }
    };
    
    this.handleMessage({ data: JSON.stringify(emotionData) });
  }

  /**
   * Start simulation mode for testing
   */
  startSimulation(interval = 2000) {
    console.log('🎭 Starting emotion simulation...');
    
    const emotions = ['calm', 'excited', 'stressed', 'focused', 'relaxed', 'anxious'];
    const devices = ['nova_tiny_001', 'nova_tiny_002', 'nova_tiny_003'];
    
    this.simulationTimer = setInterval(() => {
      const deviceId = devices[Math.floor(Math.random() * devices.length)];
      const emotion = emotions[Math.floor(Math.random() * emotions.length)];
      const score = Math.random();
      const confidence = 0.7 + Math.random() * 0.3;
      
      this.simulateEmotionData(deviceId, emotion, score, confidence);
    }, interval);
  }

  /**
   * Stop simulation mode
   */
  stopSimulation() {
    if (this.simulationTimer) {
      clearInterval(this.simulationTimer);
      this.simulationTimer = null;
      console.log('🎭 Stopped emotion simulation');
    }
  }
}

export default WebSocketGridDaemon; 