// API Configuration
// For Android emulator use: 10.0.2.2
// For iOS simulator use: localhost
// For physical device use: your computer's IP address (e.g., 192.168.1.100)

import { Platform } from 'react-native';

const getApiUrl = () => {
  if (__DEV__) {
    // Development mode
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:5000/api';
    }

    // iOS - IMPORTANT: Change this based on your setup
    // For iOS Simulator: use 'localhost'
    // For iOS Physical Device: use your computer's IP address (find it with 'ipconfig' on Windows or 'ifconfig' on Mac)

    // OPTION 1: Uncomment this line if using iOS Simulator
    // return 'http://localhost:5000/api';

    // OPTION 2: Use this for iOS Physical Device
    // Replace 'YOUR_COMPUTER_IP' with your actual IP address (e.g., 192.168.1.100)
    return 'http://192.168.100.14:5000/api';
  }

  // Production mode - replace with your production API URL
  return 'https://your-production-api.com/api';
};

export const API_URL = getApiUrl();

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_URL}/auth/login`,
    REGISTER: `${API_URL}/auth/register`,
    ME: `${API_URL}/auth/me`,
  },
  USERS: {
    PROFILE: `${API_URL}/users/profile`,
    STATS: `${API_URL}/users/stats`,
  },
  INCIDENTS: {
    BASE: `${API_URL}/incidents`,
    NEARBY: `${API_URL}/incidents/nearby`,
    MY_INCIDENTS: `${API_URL}/incidents/user/my-incidents`,
    LOST_PETS: `${API_URL}/incidents/lost-pets`,
    LOST_PETS_NEARBY: `${API_URL}/incidents/lost-pets/nearby`,
    ADOPTION_PETS: `${API_URL}/incidents/adoption-pets`,
    ADOPTION_PETS_NEARBY: `${API_URL}/incidents/adoption-pets/nearby`,
  },
  UPLOAD: {
    SINGLE: `${API_URL}/upload/single`,
    MULTIPLE: `${API_URL}/upload/multiple`,
    DELETE: `${API_URL}/upload`,
  },
  COMMENTS: {
    CREATE: (incidentId: string) => `${API_URL}/comments/incident/${incidentId}`,
    GET_BY_INCIDENT: (incidentId: string) => `${API_URL}/comments/incident/${incidentId}`,
    MY_COMMENTS: `${API_URL}/comments/my-comments`,
    UPDATE: (commentId: string) => `${API_URL}/comments/${commentId}`,
    DELETE: (commentId: string) => `${API_URL}/comments/${commentId}`,
  },
};
