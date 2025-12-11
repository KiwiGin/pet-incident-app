import { API_ENDPOINTS } from '../constants/api';
import { authService } from './auth.service';

export interface Incident {
  _id: string;
  userId: string;
  incidentType: 'lost' | 'adoption';
  petName: string;
  petType: 'dog' | 'cat' | 'other';
  breed?: string;
  description: string;
  imageUrls: string[];
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  locationName: string;
  contactPhone: string;
  contactEmail: string;
  status: 'active' | 'resolved' | 'closed';
  user?: {
    _id: string;
    fullName: string;
    phone: string;
    email?: string;
    photoURL?: string;
  };
  distance?: number; // Only in nearby searches
  createdAt: string;
  updatedAt: string;
}

export interface CreateIncidentData {
  incidentType: 'lost' | 'adoption';
  petName: string;
  petType: 'dog' | 'cat' | 'other';
  breed?: string;
  description: string;
  imageUrls: string[];
  latitude: number;
  longitude: number;
  locationName: string;
  contactPhone: string;
  contactEmail: string;
}

export interface UpdateIncidentData {
  petName?: string;
  description?: string;
  status?: 'active' | 'resolved' | 'closed';
  latitude?: number;
  longitude?: number;
  locationName?: string;
}

interface IncidentsResponse {
  status: string;
  data: {
    incidents: Incident[];
    pagination: {
      total: number;
      page: number;
      pages: number;
      limit: number;
    };
  };
}

interface SingleIncidentResponse {
  status: string;
  data: {
    incident: Incident;
  };
}

interface NearbyResponse {
  status: string;
  data: {
    incidents: Incident[];
    count: number;
  };
}

interface LostPetsResponse {
  status: string;
  data: {
    lostPets: Incident[];
    pagination: {
      total: number;
      page: number;
      pages: number;
      limit: number;
    };
  };
}

interface AdoptionPetsResponse {
  status: string;
  data: {
    adoptionPets: Incident[];
    pagination: {
      total: number;
      page: number;
      pages: number;
      limit: number;
    };
  };
}

export const incidentsService = {
  // Create incident
  async createIncident(data: CreateIncidentData): Promise<Incident> {
    try {
      const token = await authService.getToken();

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(API_ENDPOINTS.INCIDENTS.BASE, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create incident');
      }

      const result: SingleIncidentResponse = await response.json();
      return result.data.incident;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please check your connection.');
    }
  },

  // Get all incidents
  async getIncidents(params?: {
    type?: 'lost' | 'adoption';
    status?: 'active' | 'resolved' | 'closed';
    petType?: 'dog' | 'cat' | 'other';
    page?: number;
    limit?: number;
  }): Promise<{ incidents: Incident[]; pagination: any }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.type) queryParams.append('type', params.type);
      if (params?.status) queryParams.append('status', params.status);
      if (params?.petType) queryParams.append('petType', params.petType);
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const url = `${API_ENDPOINTS.INCIDENTS.BASE}?${queryParams.toString()}`;

      const response = await fetch(url);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch incidents');
      }

      const result: IncidentsResponse = await response.json();
      return {
        incidents: result.data.incidents,
        pagination: result.data.pagination,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please check your connection.');
    }
  },

  // Get nearby incidents
  async getNearbyIncidents(params: {
    latitude: number;
    longitude: number;
    radius?: number;
    type?: 'lost' | 'adoption';
    status?: 'active' | 'resolved' | 'closed';
  }): Promise<Incident[]> {
    try {
      const queryParams = new URLSearchParams({
        latitude: params.latitude.toString(),
        longitude: params.longitude.toString(),
      });

      if (params.radius) queryParams.append('radius', params.radius.toString());
      if (params.type) queryParams.append('type', params.type);
      if (params.status) queryParams.append('status', params.status);

      const url = `${API_ENDPOINTS.INCIDENTS.NEARBY}?${queryParams.toString()}`;

      const response = await fetch(url);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch nearby incidents');
      }

      const result: NearbyResponse = await response.json();
      return result.data.incidents;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please check your connection.');
    }
  },

  // Get lost pets
  async getLostPets(params?: {
    petName?: string;
    petType?: 'dog' | 'cat' | 'other';
    breed?: string;
    page?: number;
    limit?: number;
  }): Promise<{ pets: Incident[]; pagination: any }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.petName) queryParams.append('petName', params.petName);
      if (params?.petType) queryParams.append('petType', params.petType);
      if (params?.breed) queryParams.append('breed', params.breed);
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const url = `${API_ENDPOINTS.INCIDENTS.LOST_PETS}?${queryParams.toString()}`;

      const response = await fetch(url);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch lost pets');
      }

      const result: LostPetsResponse = await response.json();
      return {
        pets: result.data.lostPets,
        pagination: result.data.pagination,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please check your connection.');
    }
  },

  // Get nearby lost pets
  async getNearbyLostPets(params: {
    latitude: number;
    longitude: number;
    radius?: number;
    petName?: string;
    petType?: 'dog' | 'cat' | 'other';
  }): Promise<Incident[]> {
    try {
      const queryParams = new URLSearchParams({
        latitude: params.latitude.toString(),
        longitude: params.longitude.toString(),
      });

      if (params.radius) queryParams.append('radius', params.radius.toString());
      if (params.petName) queryParams.append('petName', params.petName);
      if (params.petType) queryParams.append('petType', params.petType);

      const url = `${API_ENDPOINTS.INCIDENTS.LOST_PETS_NEARBY}?${queryParams.toString()}`;

      const response = await fetch(url);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch nearby lost pets');
      }

      const result: any = await response.json();
      return result.data.lostPets;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please check your connection.');
    }
  },

  // Get adoption pets
  async getAdoptionPets(params?: {
    petName?: string;
    petType?: 'dog' | 'cat' | 'other';
    breed?: string;
    page?: number;
    limit?: number;
  }): Promise<{ pets: Incident[]; pagination: any }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.petName) queryParams.append('petName', params.petName);
      if (params?.petType) queryParams.append('petType', params.petType);
      if (params?.breed) queryParams.append('breed', params.breed);
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const url = `${API_ENDPOINTS.INCIDENTS.ADOPTION_PETS}?${queryParams.toString()}`;

      const response = await fetch(url);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch adoption pets');
      }

      const result: AdoptionPetsResponse = await response.json();
      return {
        pets: result.data.adoptionPets,
        pagination: result.data.pagination,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please check your connection.');
    }
  },

  // Get nearby adoption pets
  async getNearbyAdoptionPets(params: {
    latitude: number;
    longitude: number;
    radius?: number;
    petName?: string;
    petType?: 'dog' | 'cat' | 'other';
  }): Promise<Incident[]> {
    try {
      const queryParams = new URLSearchParams({
        latitude: params.latitude.toString(),
        longitude: params.longitude.toString(),
      });

      if (params.radius) queryParams.append('radius', params.radius.toString());
      if (params.petName) queryParams.append('petName', params.petName);
      if (params.petType) queryParams.append('petType', params.petType);

      const url = `${API_ENDPOINTS.INCIDENTS.ADOPTION_PETS_NEARBY}?${queryParams.toString()}`;

      const response = await fetch(url);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch nearby adoption pets');
      }

      const result: any = await response.json();
      return result.data.adoptionPets;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please check your connection.');
    }
  },

  // Get incident by ID
  async getIncidentById(id: string): Promise<Incident> {
    try {
      const response = await fetch(`${API_ENDPOINTS.INCIDENTS.BASE}/${id}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch incident');
      }

      const result: SingleIncidentResponse = await response.json();
      return result.data.incident;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please check your connection.');
    }
  },

  // Get my incidents
  async getMyIncidents(params?: {
    status?: 'active' | 'resolved' | 'closed';
    page?: number;
    limit?: number;
  }): Promise<{ incidents: Incident[]; pagination: any }> {
    try {
      const token = await authService.getToken();

      if (!token) {
        throw new Error('No authentication token found');
      }

      const queryParams = new URLSearchParams();
      if (params?.status) queryParams.append('status', params.status);
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const url = `${API_ENDPOINTS.INCIDENTS.MY_INCIDENTS}?${queryParams.toString()}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch my incidents');
      }

      const result: IncidentsResponse = await response.json();
      return {
        incidents: result.data.incidents,
        pagination: result.data.pagination,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please check your connection.');
    }
  },

  // Update incident
  async updateIncident(id: string, data: UpdateIncidentData): Promise<Incident> {
    try {
      const token = await authService.getToken();

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_ENDPOINTS.INCIDENTS.BASE}/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update incident');
      }

      const result: SingleIncidentResponse = await response.json();
      return result.data.incident;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please check your connection.');
    }
  },

  // Delete incident
  async deleteIncident(id: string): Promise<void> {
    try {
      const token = await authService.getToken();

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_ENDPOINTS.INCIDENTS.BASE}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete incident');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please check your connection.');
    }
  },
};
