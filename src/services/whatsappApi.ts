import axios from 'axios';

interface OnSendConfig {
  apiKey: string;
  instanceId: string;
  baseURL?: string;
}

class WhatsAppAPI {
  private apiKey: string;
  private instanceId: string;
  private baseURL: string;
  private isConnected: boolean = false;

  constructor(config: OnSendConfig) {
    this.apiKey = config.apiKey;
    this.instanceId = config.instanceId;
    this.baseURL = config.baseURL || 'https://api.onsend.io/v1';
  }

  updateConfig(config: Partial<OnSendConfig>) {
    if (config.apiKey) this.apiKey = config.apiKey;
    if (config.instanceId) this.instanceId = config.instanceId;
    if (config.baseURL) this.baseURL = config.baseURL;
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    };
  }

  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      if (!this.apiKey || !this.instanceId) {
        return {
          success: false,
          message: 'API token and Instance ID are required'
        };
      }

      const response = await axios.post(
        `${this.baseURL}/instance/info`,
        { instanceId: this.instanceId },
        { headers: this.getHeaders() }
      );
      
      this.isConnected = response.data.success;
      return {
        success: this.isConnected,
        message: response.data.message || 'Connected to OnSend.io'
      };
    } catch (error) {
      this.isConnected = false;
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Connection failed'
      };
    }
  }

  async sendBulkMessages(messages: Array<{
    to: string;
    message: string;
    attachments?: string[];
  }>): Promise<{ success: boolean; message: string }> {
    try {
      if (!this.isConnected) {
        await this.testConnection();
      }

      const payload = {
        instanceId: this.instanceId,
        messages: messages.map(msg => ({
          to: msg.to.replace(/\D/g, ''),
          message: msg.message,
          ...(msg.attachments?.length && { attachments: msg.attachments })
        }))
      };

      const response = await axios.post(
        `${this.baseURL}/messages/bulk`,
        payload,
        { headers: this.getHeaders() }
      );

      return {
        success: response.data.success,
        message: response.data.message || 'Messages sent successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to send messages'
      };
    }
  }

  async createSequence(sequence: {
    name: string;
    messages: Array<{
      day: number;
      time: string;
      message: string;
      attachments?: string[];
    }>;
    recipients: string[];
  }): Promise<{ success: boolean; message: string; sequenceId?: string }> {
    try {
      if (!this.isConnected) {
        await this.testConnection();
      }

      const payload = {
        instanceId: this.instanceId,
        ...sequence,
        recipients: sequence.recipients.map(to => to.replace(/\D/g, ''))
      };

      const response = await axios.post(
        `${this.baseURL}/sequences/create`,
        payload,
        { headers: this.getHeaders() }
      );

      return {
        success: response.data.success,
        message: response.data.message || 'Sequence created successfully',
        sequenceId: response.data.sequenceId
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create sequence'
      };
    }
  }
}

// Create a singleton instance
const whatsappApi = new WhatsAppAPI({
  apiKey: localStorage.getItem('whatsapp_api_key') || '',
  instanceId: localStorage.getItem('whatsapp_instance_id') || '',
  baseURL: 'https://api.onsend.io/v1'
});

export default whatsappApi;