import { fetchAuthSession } from 'aws-amplify/auth';
import { isDev } from '../aws-config';

const API_BASE = 'http://localhost:8000';

class ApiService {
  private async getAuthHeaders(): Promise<Record<string, string>> {
    try {
      if (isDev) {
        // Development mode: send mock token
        return {
          'Authorization': 'Bearer mock-dev-token',
          'Content-Type': 'application/json',
        };
      }

      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString() || session.tokens?.accessToken?.toString();

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      return headers;
    } catch (error) {
      console.warn('Error getting auth headers:', error);
      // Continue without token if not authenticated
      return {
        'Content-Type': 'application/json',
      };
    }
  }

  async get(endpoint: string) {
    const headers = await this.getAuthHeaders();

    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async post(endpoint: string, data: any) {
    const headers = await this.getAuthHeaders();

    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ API Error [${response.status}]:`, errorText);
      throw new Error(`API Error: ${response.status} ${response.statusText}\nDetails: ${errorText}`);
    }

    return response.json();
  }

  async put(endpoint: string, data: any) {
    const headers = await this.getAuthHeaders();

    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async delete(endpoint: string) {
    const headers = await this.getAuthHeaders();

    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }
}

export const apiService = new ApiService();