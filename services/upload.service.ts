import { API_ENDPOINTS } from '../constants/api';
import { authService } from './auth.service';

interface UploadResponse {
  status: string;
  data: {
    url: string;
    publicId: string;
    width: number;
    height: number;
    format: string;
    size: number;
  };
}

interface MultipleUploadResponse {
  status: string;
  data: {
    images: Array<{
      url: string;
      publicId: string;
      width: number;
      height: number;
      format: string;
      size: number;
    }>;
    count: number;
  };
}

export const uploadService = {
  async uploadSingle(imageUri: string): Promise<string> {
    try {
      const token = await authService.getToken();

      if (!token) {
        throw new Error('No authentication token found');
      }

      // Create form data
      const formData = new FormData();

      // Get file extension from URI
      const fileExtension = imageUri.split('.').pop() || 'jpg';
      const fileName = `photo_${Date.now()}.${fileExtension}`;

      // Add image to form data
      formData.append('image', {
        uri: imageUri,
        type: `image/${fileExtension}`,
        name: fileName,
      } as any);

      const response = await fetch(`${API_ENDPOINTS.UPLOAD.SINGLE}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }

      const data: UploadResponse = await response.json();
      return data.data.url;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please check your connection.');
    }
  },

  async uploadMultiple(imageUris: string[]): Promise<string[]> {
    try {
      const token = await authService.getToken();

      if (!token) {
        throw new Error('No authentication token found');
      }

      if (imageUris.length > 3) {
        throw new Error('Maximum 3 images allowed');
      }

      // Create form data
      const formData = new FormData();

      // Add all images to form data
      imageUris.forEach((imageUri, index) => {
        const fileExtension = imageUri.split('.').pop() || 'jpg';
        const fileName = `photo_${Date.now()}_${index}.${fileExtension}`;

        formData.append('images', {
          uri: imageUri,
          type: `image/${fileExtension}`,
          name: fileName,
        } as any);
      });

      const response = await fetch(`${API_ENDPOINTS.UPLOAD.MULTIPLE}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }

      const data: MultipleUploadResponse = await response.json();
      return data.data.images.map(img => img.url);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please check your connection.');
    }
  },

  async deleteImage(urlOrPublicId: string): Promise<void> {
    try {
      const token = await authService.getToken();

      if (!token) {
        throw new Error('No authentication token found');
      }

      const body = urlOrPublicId.startsWith('http')
        ? { url: urlOrPublicId }
        : { publicId: urlOrPublicId };

      const response = await fetch(`${API_ENDPOINTS.UPLOAD.DELETE}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Delete failed');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please check your connection.');
    }
  },
};
