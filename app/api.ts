const API_BASE_URL = 'https://lumantra-backend-4.onrender.com/api';

export interface Comment {
  _id?: string;
  author: string;
  text: string;
  createdAt?: string;
}

export interface Workflow {
  _id?: string;
  title: string;
  description?: string;
  dueDate: string;
  assignedTo: string;
  priority: 'High' | 'Medium' | 'Low';
  comments?: Comment[];
  createdAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

class WorkflowAPI {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return response.json();
      } else {
        return response.text() as T;
      }
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Get all workflows
  async getWorkflows(): Promise<Workflow[]> {
    try {
      const response = await this.request<Workflow[]>('/workflow');
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('Error fetching workflows:', error);
      throw error;
    }
  }

  // Create a new workflow
  async createWorkflow(workflow: Omit<Workflow, '_id' | 'createdAt'>): Promise<Workflow> {
    try {
      const response = await this.request<Workflow>('/workflow', {
        method: 'POST',
        body: JSON.stringify(workflow),
      });
      return response;
    } catch (error) {
      console.error('Error creating workflow:', error);
      throw error;
    }
  }

  // Get a single workflow by ID
  async getWorkflow(id: string): Promise<Workflow> {
    try {
      const response = await this.request<Workflow>(`/workflow/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching workflow:', error);
      throw error;
    }
  }

  // Update a workflow
  async updateWorkflow(id: string, updates: Partial<Workflow>): Promise<Workflow> {
    try {
      const response = await this.request<Workflow>(`/workflow/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      return response;
    } catch (error) {
      console.error('Error updating workflow:', error);
      throw error;
    }
  }

  // Delete a workflow
  async deleteWorkflow(id: string): Promise<void> {
    try {
      await this.request(`/workflow/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error deleting workflow:', error);
      throw error;
    }
  }

  // Add a comment to a workflow
  async addComment(workflowId: string, comment: { author: string; text: string }): Promise<Workflow> {
    try {
      const response = await this.request<Workflow>(`/workflow/${workflowId}/comment`, {
        method: 'POST',
        body: JSON.stringify(comment),
      });
      return response;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }

  // Delete a comment from a workflow
  async deleteComment(workflowId: string, commentId: string): Promise<Workflow> {
    try {
      const response = await this.request<Workflow>(`/workflow/${workflowId}/comment/${commentId}`, {
        method: 'DELETE',
      });
      return response;
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }
}

export const workflowAPI = new WorkflowAPI(); 