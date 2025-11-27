import { Pet } from '../types';

export interface SimulatedBeacon {
  petId: string;
  latitude: number;
  longitude: number;
  signalStrength: number; // 0-100, higher = closer
  lastSeen: Date;
}

export interface ProximityAlert {
  pet: Pet;
  distance: number; // in meters
  signalStrength: number;
}

const DETECTION_RADIUS_METERS = 500; // 500 meters detection radius
const MOVEMENT_SPEED = 0.00005; // degrees per update (simulates slow walking)

class BLESimulationService {
  private updateInterval: ReturnType<typeof setInterval> | null = null;
  private lostPets: Pet[] = [];
  private onProximityAlert: ((alert: ProximityAlert) => void) | null = null;
  private notifiedPets: Set<string> = new Set();

  // Calculate distance between two coordinates in meters
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  // Simulate random pet movement
  private simulatePetMovement(pet: Pet): Pet {
    if (!pet.location) return pet;

    // Random direction
    const angle = Math.random() * 2 * Math.PI;
    const distance = MOVEMENT_SPEED * (Math.random() + 0.5);

    const newLat = pet.location.latitude + distance * Math.cos(angle);
    const newLng = pet.location.longitude + distance * Math.sin(angle);

    return {
      ...pet,
      location: {
        ...pet.location,
        latitude: newLat,
        longitude: newLng,
      },
    };
  }

  // Start simulating BLE beacons
  startSimulation(
    lostPets: Pet[],
    userLocation: { latitude: number; longitude: number },
    onUpdate: (pets: Pet[]) => void,
    onAlert: (alert: ProximityAlert) => void
  ) {
    this.lostPets = lostPets;
    this.onProximityAlert = onAlert;

    // Update every 2 seconds
    this.updateInterval = setInterval(() => {
      // Move each lost pet slightly
      this.lostPets = this.lostPets.map((pet) => this.simulatePetMovement(pet));

      // Check proximity to user
      this.lostPets.forEach((pet) => {
        if (!pet.location) return;

        const distance = this.calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          pet.location.latitude,
          pet.location.longitude
        );

        // If within detection radius
        if (distance <= DETECTION_RADIUS_METERS) {
          // Calculate signal strength (0-100)
          const signalStrength = Math.max(
            0,
            Math.min(100, 100 - (distance / DETECTION_RADIUS_METERS) * 100)
          );

          // Send proximity alert if first time detecting
          if (!this.notifiedPets.has(pet.id)) {
            this.notifiedPets.add(pet.id);
            if (this.onProximityAlert) {
              this.onProximityAlert({
                pet,
                distance: Math.round(distance),
                signalStrength: Math.round(signalStrength),
              });
            }
          }
        } else {
          // Remove from notified if out of range
          this.notifiedPets.delete(pet.id);
        }
      });

      // Send updated positions
      onUpdate([...this.lostPets]);
    }, 2000);
  }

  // Stop simulation
  stopSimulation() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    this.notifiedPets.clear();
  }

  // Get nearby pets within detection radius
  getNearbyPets(
    userLocation: { latitude: number; longitude: number },
    allPets: Pet[]
  ): ProximityAlert[] {
    return allPets
      .filter((pet) => pet.location && pet.status === 'lost')
      .map((pet) => {
        const distance = this.calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          pet.location!.latitude,
          pet.location!.longitude
        );

        const signalStrength = Math.max(
          0,
          Math.min(100, 100 - (distance / DETECTION_RADIUS_METERS) * 100)
        );

        return {
          pet,
          distance: Math.round(distance),
          signalStrength: Math.round(signalStrength),
        };
      })
      .filter((alert) => alert.distance <= DETECTION_RADIUS_METERS)
      .sort((a, b) => a.distance - b.distance);
  }
}

export const bleSimulationService = new BLESimulationService();
