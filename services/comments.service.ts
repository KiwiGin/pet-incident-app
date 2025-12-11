import { API_ENDPOINTS } from '../constants/api';
import { authService } from './auth.service';

export interface Comment {
  _id: string;
  incidentId: string;
  userId: string;
  content: string;
  imageUrls: string[];
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    _id: string;
    fullName: string;
    photoURL?: string;
  };
}

export interface CreateCommentData {
  content: string;
  imageUrls?: string[];
}

export interface UpdateCommentData {
  content: string;
}

interface CommentsResponse {
  status: string;
  data: {
    comments: Comment[];
    pagination: {
      total: number;
      page: number;
      pages: number;
    };
  };
}

interface SingleCommentResponse {
  status: string;
  data: {
    comment: Comment;
  };
}

export const commentsService = {
  // Get comments for an incident
  async getCommentsByIncident(
    incidentId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ comments: Comment[]; pagination: any }> {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const url = `${API_ENDPOINTS.COMMENTS.GET_BY_INCIDENT(incidentId)}?${queryParams.toString()}`;

      const response = await fetch(url);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch comments');
      }

      const result: CommentsResponse = await response.json();
      return {
        comments: result.data.comments,
        pagination: result.data.pagination,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please check your connection.');
    }
  },

  // Create a comment
  async createComment(
    incidentId: string,
    data: CreateCommentData
  ): Promise<Comment> {
    try {
      const token = await authService.getToken();

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(API_ENDPOINTS.COMMENTS.CREATE(incidentId), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create comment');
      }

      const result: SingleCommentResponse = await response.json();
      return result.data.comment;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please check your connection.');
    }
  },

  // Update a comment
  async updateComment(
    commentId: string,
    data: UpdateCommentData
  ): Promise<Comment> {
    try {
      const token = await authService.getToken();

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(API_ENDPOINTS.COMMENTS.UPDATE(commentId), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update comment');
      }

      const result: SingleCommentResponse = await response.json();
      return result.data.comment;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please check your connection.');
    }
  },

  // Delete a comment
  async deleteComment(commentId: string): Promise<void> {
    try {
      const token = await authService.getToken();

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(API_ENDPOINTS.COMMENTS.DELETE(commentId), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete comment');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please check your connection.');
    }
  },

  // Get my comments
  async getMyComments(
    page: number = 1,
    limit: number = 10
  ): Promise<{ comments: Comment[]; pagination: any }> {
    try {
      const token = await authService.getToken();

      if (!token) {
        throw new Error('No authentication token found');
      }

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const url = `${API_ENDPOINTS.COMMENTS.MY_COMMENTS}?${queryParams.toString()}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch my comments');
      }

      const result: CommentsResponse = await response.json();
      return {
        comments: result.data.comments,
        pagination: result.data.pagination,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please check your connection.');
    }
  },
};
