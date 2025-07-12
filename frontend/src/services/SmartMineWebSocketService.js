class SmartMineWebSocketService {
  constructor(url) {
    this.url = url;
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000;
    this.listeners = {
      connect: [],
      disconnect: [],
      message: [],
      error: []
    };
  }

  connect() {
    try {
      this.ws = new WebSocket(this.url);
      
      this.ws.onopen = () => {
        console.log('SmartMine WebSocket connected');
        this.reconnectAttempts = 0;
        this.emit('connect');
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.emit('message', data);
        } catch (error) {
          console.error('Error parsing SmartMine WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('SmartMine WebSocket disconnected');
        this.emit('disconnect');
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('SmartMine WebSocket error:', error);
        this.emit('error', error);
      };

    } catch (error) {
      console.error('Error creating SmartMine WebSocket connection:', error);
      this.emit('error', error);
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn('SmartMine WebSocket is not connected');
    }
  }

  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect to SmartMine (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      
      setTimeout(() => {
        this.connect();
      }, this.reconnectDelay);
    } else {
      console.error('Max SmartMine reconnection attempts reached');
    }
  }

  onConnect(callback) {
    this.listeners.connect.push(callback);
  }

  onDisconnect(callback) {
    this.listeners.disconnect.push(callback);
  }

  onMessage(callback) {
    this.listeners.message.push(callback);
  }

  onError(callback) {
    this.listeners.error.push(callback);
  }

  emit(event, data) {
    this.listeners[event].forEach(callback => callback(data));
  }
}

export default SmartMineWebSocketService;
