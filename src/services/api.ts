import axios from 'axios';
import { SubscriptionInfo, KnowledgeBaseDocument, Agent } from '../types';

const API_BASE = 'https://api.elevenlabs.io/v1';
const CALCOM_API_BASE = 'https://api.cal.com/v2';

export class ElevenLabsAPI {
  private apiKey: string;

  constructor(apiKey?: string) {
    // Use provided key or fall back to environment variable
    this.apiKey = apiKey || import.meta.env.VITE_ELEVENLABS_API_KEY || '';
  }

  private getHeaders() {
    return {
      'xi-api-key': this.apiKey,
      'Content-Type': 'application/json'
    };
  }

  async getSubscription(): Promise<SubscriptionInfo> {
    const response = await axios.get(`${API_BASE}/user/subscription`, {
      headers: this.getHeaders()
    });
    return response.data;
  }
  
  async getSignedWebSocketUrl(agentId: string): Promise<string> {
    try {
      const response = await axios.get(
        `${API_BASE}/convai/conversation/get-signed-url?agent_id=${agentId}`,
        { headers: this.getHeaders() }
      );
      return response.data.signed_url;
    } catch (error: any) {
      console.error('Error getting signed URL:', error);
      // Fall back to direct connection with agent_id
      return `wss://api.elevenlabs.io/v1/convai/conversation?agent_id=${agentId}`;
    }
  }

  async createKnowledgeBaseDocumentFromText(text: string, name: string): Promise<KnowledgeBaseDocument> {
    try {
      console.log(`📤 Creating KB document "${name}" with text endpoint...`);
      const response = await axios.post(
        `${API_BASE}/convai/knowledge-base/text`,
        { text, name },
        { headers: this.getHeaders() }
      );
      
      console.log(`📥 KB Creation Response for "${name}":`, response.data);
      
      // Ensure we have the expected structure
      if (!response.data || !response.data.id) {
        console.error('❌ Invalid response structure:', response.data);
        throw new Error(`Invalid response when creating KB document ${name}`);
      }
      
      return {
        id: response.data.id,
        name: response.data.name || name,
        type: 'text',
        usage_mode: 'auto'
      };
    } catch (error: any) {
      console.error(`❌ Error creating KB document "${name}":`, error.response?.data || error.message);
      throw error;
    }
  }

  async createKnowledgeBaseDocumentFromUrl(url: string, name?: string): Promise<KnowledgeBaseDocument> {
    try {
      console.log(`📤 Creating KB document from URL: ${url}`);
      const response = await axios.post(
        `${API_BASE}/convai/knowledge-base/url`,
        { url, name },
        { headers: this.getHeaders() }
      );
      
      console.log(`📥 KB URL Creation Response:`, response.data);
      
      // Ensure we have the expected structure
      if (!response.data || !response.data.id) {
        console.error('❌ Invalid response structure:', response.data);
        throw new Error(`Invalid response when creating KB document from URL`);
      }
      
      return {
        id: response.data.id,
        name: response.data.name || name || 'url_document',
        type: 'text',
        usage_mode: 'auto'
      };
    } catch (error: any) {
      console.error(`❌ Error creating KB document from URL:`, error.response?.data || error.message);
      throw error;
    }
  }

  // Keep the original method for backward compatibility
  async createKnowledgeBaseDocument(text: string, name: string): Promise<KnowledgeBaseDocument> {
    return this.createKnowledgeBaseDocumentFromText(text, name);
  }

  async createAgent(config: any): Promise<Agent> {
    try {
      // Log the critical parts for debugging
      console.log('📤 Creating agent with config:');
      console.log('  Name:', config.name);
      
      // Check both possible locations for knowledge_base
      const kbInPrompt = config.conversation_config?.agent?.prompt?.knowledge_base;
      const kbInAgent = config.conversation_config?.agent?.knowledge_base;
      
      if (kbInPrompt && kbInPrompt.length > 0) {
        console.log('  Knowledge base in prompt:', kbInPrompt.length, 'items');
        kbInPrompt.forEach((kb: any, index: number) => {
          console.log(`    [${index}] id: ${kb.id}, name: ${kb.name}, type: ${kb.type}, usage_mode: ${kb.usage_mode}`);
        });
      } else if (kbInAgent && kbInAgent.length > 0) {
        console.log('  Knowledge base in agent (wrong location):', kbInAgent.length, 'items');
        console.warn('  ⚠️ KB is in wrong location - should be in agent.prompt.knowledge_base');
      } else {
        console.log('  No knowledge base configured');
      }
      
      const response = await axios.post(
        `${API_BASE}/convai/agents/create`,
        config,
        { headers: this.getHeaders() }
      );
      
      console.log('📥 Agent creation response:', {
        agent_id: response.data.agent_id,
        name: response.data.name
      });
      
      // Immediately check if KB was linked
      if (response.data.agent_id) {
        try {
          const agentDetails = await this.getAgent(response.data.agent_id);
          // Check the correct location
          const kbInPrompt = agentDetails.conversation_config?.agent?.prompt?.knowledge_base;
          const kbCount = kbInPrompt?.length || 0;
          
          console.log(`📋 Created agent has ${kbCount} KB documents in prompt.knowledge_base`);
          if (kbCount > 0) {
            console.log('✅ Knowledge base successfully linked during creation!');
            console.log('  KB documents:', kbInPrompt.map((kb: any) => `${kb.name || 'unnamed'} (${kb.id})`).join(', '));
          } else {
            // Check old location too
            const oldKbCount = agentDetails.conversation_config?.agent?.knowledge_base?.length || 0;
            if (oldKbCount > 0) {
              console.warn('⚠️ KB found in wrong location (agent.knowledge_base instead of agent.prompt.knowledge_base)');
            }
          }
        } catch (err) {
          console.warn('Could not verify KB linking:', err);
        }
      }
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Error creating agent:', error.response?.data || error.message);
      throw error;
    }
  }

  async listAgents(): Promise<Agent[]> {
    const response = await axios.get(`${API_BASE}/convai/agents`, {
      headers: this.getHeaders()
    });
    return response.data.agents || [];
  }

  async listKnowledgeBase(): Promise<any[]> {
    try {
      const response = await axios.get(`${API_BASE}/convai/knowledge-base`, {
        headers: this.getHeaders()
      });
      console.log('📚 Knowledge base list response:', response.data);
      
      // Handle the response structure - it returns an object with documents array
      if (response.data && response.data.documents) {
        return response.data.documents;
      } else if (Array.isArray(response.data)) {
        return response.data;
      }
      
      return [];
    } catch (error: any) {
      console.error('❌ Error listing knowledge base:', error.response?.data || error.message);
      return [];
    }
  }

  async getKnowledgeBaseDocument(id: string): Promise<any> {
    try {
      const response = await axios.get(`${API_BASE}/convai/knowledge-base/${id}`, {
        headers: this.getHeaders()
      });
      console.log(`📄 KB document ${id} details:`, response.data);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Error getting KB document ${id}:`, error.response?.data || error.message);
      throw error;
    }
  }

  async getAgent(agentId: string): Promise<any> {
    const response = await axios.get(`${API_BASE}/convai/agents/${agentId}`, {
      headers: this.getHeaders()
    });
    
    // Log the full structure to understand what we're getting
    console.log('📋 Full agent details retrieved:');
    console.log('  Agent ID:', response.data.agent_id);
    console.log('  Name:', response.data.name);
    
    // Check where knowledge_base might be in the response
    const possibleKBLocations = [
      response.data.conversation_config?.agent?.knowledge_base,
      response.data.conversation_config?.agent?.prompt?.knowledge_base,
      response.data.knowledge_base,
      response.data.platform_settings?.knowledge_base
    ];
    
    console.log('  Checking for knowledge_base in different locations:');
    possibleKBLocations.forEach((location, index) => {
      if (location !== undefined) {
        console.log(`    Location ${index}: Found ${Array.isArray(location) ? location.length : 'non-array'} items`);
        if (Array.isArray(location) && location.length > 0) {
          console.log(`    Contents:`, JSON.stringify(location, null, 2));
        }
      }
    });
    
    return response.data;
  }

  async updateAgent(agentId: string, config: any): Promise<any> {
    try {
      console.log(`📤 Updating agent ${agentId} with config:`, JSON.stringify({
        knowledge_base_count: config.conversation_config?.agent?.knowledge_base?.length || config.knowledge_base?.length || 0,
        knowledge_base: config.conversation_config?.agent?.knowledge_base || config.knowledge_base
      }, null, 2));
      
      const response = await axios.patch(
        `${API_BASE}/convai/agents/${agentId}`,
        config,
        { headers: this.getHeaders() }
      );
      
      console.log('📥 Agent update response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error updating agent:', error.response?.data || error.message);
      // Try PUT if PATCH fails
      if (error.response?.status === 405 || error.response?.status === 404) {
        console.log('🔧 Trying PUT method instead...');
        try {
          const response = await axios.put(
            `${API_BASE}/convai/agents/${agentId}`,
            config,
            { headers: this.getHeaders() }
          );
          console.log('📥 Agent update (PUT) response:', response.data);
          return response.data;
        } catch (putError: any) {
          console.error('❌ Error updating agent with PUT:', putError.response?.data || putError.message);
        }
      }
      throw error;
    }
  }

  async addKnowledgeBaseToAgent(agentId: string, knowledgeBaseIds: string[]): Promise<any> {
    try {
      console.log(`📤 Adding knowledge base to agent ${agentId}:`, knowledgeBaseIds);
      
      // Try different possible endpoints
      const endpoints = [
        `${API_BASE}/convai/agents/${agentId}/knowledge-base`,
        `${API_BASE}/convai/agents/${agentId}/knowledge`,
        `${API_BASE}/convai/agents/${agentId}/add-knowledge-base`
      ];
      
      for (const endpoint of endpoints) {
        try {
          console.log(`🔧 Trying endpoint: ${endpoint}`);
          const response = await axios.post(
            endpoint,
            { knowledge_base_ids: knowledgeBaseIds },
            { headers: this.getHeaders() }
          );
          console.log('✅ Successfully added KB via:', endpoint);
          return response.data;
        } catch (err: any) {
          if (err.response?.status !== 404) {
            console.warn(`⚠️ Failed with ${endpoint}:`, err.response?.status, err.response?.data);
          }
        }
      }
      
      throw new Error('Could not find working endpoint to add knowledge base to agent');
    } catch (error: any) {
      console.error('❌ Error adding KB to agent:', error.message);
      throw error;
    }
  }
}

export class CalComAPI {
  private apiKey: string;

  constructor(apiKey?: string) {
    // Use provided key or fall back to environment variable
    this.apiKey = apiKey || import.meta.env.VITE_CALCOM_API_KEY || '';
  }

  private getHeaders() {
    const apiVersion = import.meta.env.VITE_CALCOM_API_VERSION || '2024-08-13';
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'cal-api-version': apiVersion,
      'Content-Type': 'application/json'
    };
  }

  async getAvailableSlots(start: string, end: string, eventTypeId: number) {
    const response = await axios.get(`${CALCOM_API_BASE}/slots`, {
      params: { start, end, eventTypeId },
      headers: this.getHeaders()
    });
    return response.data;
  }

  async createBooking(bookingData: any) {
    const response = await axios.post(
      `${CALCOM_API_BASE}/bookings`,
      bookingData,
      { headers: this.getHeaders() }
    );
    return response.data;
  }
}

