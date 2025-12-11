# 🐾 Integración Completa de Incidentes y Upload

## 📦 Servicios Creados

### 1. Upload Service ([services/upload.service.ts](services/upload.service.ts))

Servicio para subir imágenes a Cloudinary.

**Métodos disponibles:**
- `uploadSingle(imageUri)` - Sube 1 imagen
- `uploadMultiple(imageUris)` - Sube hasta 3 imágenes
- `deleteImage(urlOrPublicId)` - Elimina una imagen

### 2. Incidents Service ([services/incidents.service.ts](services/incidents.service.ts))

Servicio completo para gestionar incidentes (mascotas perdidas y en adopción).

**Métodos disponibles:**

#### CRUD Básico:
- `createIncident(data)` - Crear nuevo incidente
- `getIncidentById(id)` - Obtener detalle de un incidente
- `updateIncident(id, data)` - Actualizar incidente
- `deleteIncident(id)` - Eliminar incidente
- `getMyIncidents(params)` - Mis incidentes

#### Consultas Generales:
- `getIncidents(params)` - Listar todos los incidentes con filtros
- `getNearbyIncidents(params)` - Incidentes cerca de una ubicación

#### APIs Especializadas - Mascotas Perdidas:
- `getLostPets(params)` - Listar mascotas perdidas
- `getNearbyLostPets(params)` - Mascotas perdidas cercanas

#### APIs Especializadas - Mascotas en Adopción:
- `getAdoptionPets(params)` - Listar mascotas en adopción
- `getNearbyAdoptionPets(params)` - Mascotas en adopción cercanas

### 3. ImagePicker Component ([components/ImagePickerComponent](components/ImagePickerComponent))

Componente reutilizable para seleccionar imágenes con preview.

---

## 🚀 Ejemplos de Uso

### Ejemplo 1: Crear un Incidente con Imágenes

```typescript
import { useState } from 'react';
import { uploadService } from '@/services/upload.service';
import { incidentsService } from '@/services/incidents.service';
import { ImagePickerComponent } from '@/components/ImagePickerComponent';

function CreateIncidentScreen() {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleCreateIncident = async () => {
    try {
      setIsUploading(true);

      // 1. Subir imágenes primero
      const imageUrls = await uploadService.uploadMultiple(selectedImages);

      // 2. Crear incidente con las URLs
      const incident = await incidentsService.createIncident({
        incidentType: 'lost',
        petName: 'Max',
        petType: 'dog',
        breed: 'Golden Retriever',
        description: 'Mi perro se perdió cerca del parque',
        imageUrls,
        latitude: -12.0464,
        longitude: -77.0428,
        locationName: 'Parque Kennedy, Miraflores',
        contactPhone: '+51987654321',
        contactEmail: 'usuario@ejemplo.com',
      });

      console.log('Incidente creado:', incident);
      Alert.alert('Éxito', 'Incidente publicado correctamente');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View>
      <ImagePickerComponent
        maxImages={3}
        onImagesSelected={setSelectedImages}
      />

      <Button
        title={isUploading ? 'Creando...' : 'Crear Incidente'}
        onPress={handleCreateIncident}
        disabled={isUploading || selectedImages.length === 0}
      />
    </View>
  );
}
```

---

### Ejemplo 2: Listar Mascotas Perdidas

```typescript
import { useEffect, useState } from 'react';
import { incidentsService, Incident } from '@/services/incidents.service';

function LostPetsScreen() {
  const [pets, setPets] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLostPets();
  }, []);

  const loadLostPets = async () => {
    try {
      const { pets } = await incidentsService.getLostPets({
        page: 1,
        limit: 20,
      });
      setPets(pets);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las mascotas');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <FlatList
      data={pets}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <PetCard
          name={item.petName}
          type={item.petType}
          image={item.imageUrls[0]}
          location={item.locationName}
          description={item.description}
          onPress={() => navigation.navigate('PetDetail', { id: item._id })}
        />
      )}
    />
  );
}
```

---

### Ejemplo 3: Buscar Mascotas Perdidas Cercanas

```typescript
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { incidentsService, Incident } from '@/services/incidents.service';

function NearbyLostPetsScreen() {
  const [pets, setPets] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNearbyPets();
  }, []);

  const loadNearbyPets = async () => {
    try {
      // 1. Pedir permisos de ubicación
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Error', 'Se necesitan permisos de ubicación');
        return;
      }

      // 2. Obtener ubicación actual
      const location = await Location.getCurrentPositionAsync({});

      // 3. Buscar mascotas cercanas (radio de 10km)
      const nearbyPets = await incidentsService.getNearbyLostPets({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        radius: 10,
      });

      setPets(nearbyPets);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FlatList
      data={pets}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <PetCard
          name={item.petName}
          type={item.petType}
          image={item.imageUrls[0]}
          location={item.locationName}
          distance={item.distance} // Distancia en km
          description={item.description}
        />
      )}
    />
  );
}
```

---

### Ejemplo 4: Buscar por Nombre

```typescript
function SearchPetsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Incident[]>([]);

  const handleSearch = async () => {
    try {
      const { pets } = await incidentsService.getLostPets({
        petName: searchQuery,
      });
      setResults(pets);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Buscar por nombre..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
      />
      {/* Renderizar resultados */}
    </View>
  );
}
```

---

### Ejemplo 5: Ver Detalle de Incidente

```typescript
function PetDetailScreen({ route }) {
  const { id } = route.params;
  const [pet, setPet] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPetDetail();
  }, [id]);

  const loadPetDetail = async () => {
    try {
      const petData = await incidentsService.getIncidentById(id);
      setPet(petData);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la información');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !pet) {
    return <ActivityIndicator />;
  }

  return (
    <ScrollView>
      <Image source={{ uri: pet.imageUrls[0] }} style={styles.mainImage} />
      <Text>{pet.petName}</Text>
      <Text>{pet.breed}</Text>
      <Text>{pet.description}</Text>
      <Text>{pet.locationName}</Text>

      {/* Botones de contacto */}
      <Button title="Llamar" onPress={() => Linking.openURL(`tel:${pet.contactPhone}`)} />
      <Button title="Email" onPress={() => Linking.openURL(`mailto:${pet.contactEmail}`)} />

      {/* Info del dueño */}
      {pet.user && (
        <View>
          <Text>Publicado por: {pet.user.fullName}</Text>
          {pet.user.photoURL && <Image source={{ uri: pet.user.photoURL }} />}
        </View>
      )}
    </ScrollView>
  );
}
```

---

### Ejemplo 6: Mis Incidentes

```typescript
function MyIncidentsScreen() {
  const [myIncidents, setMyIncidents] = useState<Incident[]>([]);

  useEffect(() => {
    loadMyIncidents();
  }, []);

  const loadMyIncidents = async () => {
    try {
      const { incidents } = await incidentsService.getMyIncidents({
        status: 'active',
      });
      setMyIncidents(incidents);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleMarkAsResolved = async (id: string) => {
    try {
      await incidentsService.updateIncident(id, {
        status: 'resolved',
      });
      Alert.alert('Éxito', 'Incidente marcado como resuelto');
      loadMyIncidents(); // Recargar lista
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      'Confirmar',
      '¿Estás seguro de eliminar este incidente?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await incidentsService.deleteIncident(id);
              Alert.alert('Éxito', 'Incidente eliminado');
              loadMyIncidents();
            } catch (error) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };

  return (
    <FlatList
      data={myIncidents}
      renderItem={({ item }) => (
        <View>
          <PetCard {...item} />
          <Button title="Marcar como resuelto" onPress={() => handleMarkAsResolved(item._id)} />
          <Button title="Eliminar" onPress={() => handleDelete(item._id)} />
        </View>
      )}
    />
  );
}
```

---

### Ejemplo 7: Hook Personalizado para Mascotas Cercanas

```typescript
// hooks/useNearbyPets.ts
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { incidentsService, Incident } from '@/services/incidents.service';

export function useNearbyPets(type: 'lost' | 'adoption', radius = 10) {
  const [pets, setPets] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadNearbyPets();
  }, [type, radius]);

  const loadNearbyPets = async () => {
    try {
      setLoading(true);
      setError(null);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Location permission denied');
      }

      const location = await Location.getCurrentPositionAsync({});

      const nearbyPets = type === 'lost'
        ? await incidentsService.getNearbyLostPets({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            radius,
          })
        : await incidentsService.getNearbyAdoptionPets({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            radius,
          });

      setPets(nearbyPets);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return { pets, loading, error, refresh: loadNearbyPets };
}

// Uso:
function NearbyScreen() {
  const { pets, loading, error, refresh } = useNearbyPets('lost', 10);

  if (loading) return <ActivityIndicator />;
  if (error) return <Text>Error: {error}</Text>;

  return (
    <FlatList
      data={pets}
      onRefresh={refresh}
      refreshing={loading}
      renderItem={({ item }) => <PetCard {...item} />}
    />
  );
}
```

---

## 📊 Interfaces TypeScript

### Incident
```typescript
interface Incident {
  _id: string;
  incidentType: 'lost' | 'adoption';
  petName: string;
  petType: 'dog' | 'cat' | 'other';
  breed?: string;
  description: string;
  imageUrls: string[];
  location: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  locationName: string;
  contactPhone: string;
  contactEmail: string;
  status: 'active' | 'resolved' | 'closed';
  user?: {
    fullName: string;
    phone: string;
    photoURL?: string;
  };
  distance?: number; // Solo en búsquedas nearby
  createdAt: string;
  updatedAt: string;
}
```

### CreateIncidentData
```typescript
interface CreateIncidentData {
  incidentType: 'lost' | 'adoption';
  petName: string;
  petType: 'dog' | 'cat' | 'other';
  breed?: string;
  description: string;
  imageUrls: string[]; // URLs de Cloudinary
  latitude: number;
  longitude: number;
  locationName: string;
  contactPhone: string;
  contactEmail: string;
}
```

---

## 🎨 Componente ImagePicker

```typescript
<ImagePickerComponent
  maxImages={3}
  onImagesSelected={(uris) => console.log('Selected:', uris)}
  initialImages={[]}
/>
```

**Props:**
- `maxImages` (opcional): Máximo de imágenes (default: 3)
- `onImagesSelected`: Callback cuando se seleccionan/eliminan imágenes
- `initialImages` (opcional): Array de URIs iniciales

---

## ✅ Flujo Completo: Crear Incidente

```
1. Usuario selecciona imágenes
   ↓ (ImagePickerComponent)

2. Usuario completa formulario
   ↓ (Nombre, tipo, descripción, ubicación)

3. Al presionar "Publicar":
   a. Upload imágenes a Cloudinary
      ↓ (uploadService.uploadMultiple)
      ↓ Retorna URLs

   b. Crear incidente con URLs
      ↓ (incidentsService.createIncident)

   c. Navegar a pantalla de éxito
```

---

## 🗺️ Integración con Ubicación

```typescript
import * as Location from 'expo-location';

// Obtener ubicación actual
const location = await Location.getCurrentPositionAsync({});
const { latitude, longitude } = location.coords;

// Buscar dirección (geocoding reverso)
const address = await Location.reverseGeocodeAsync({
  latitude,
  longitude,
});

console.log(address[0]); // { street, city, region, country }
```

---

## 🔍 Parámetros de Búsqueda

### getLostPets / getAdoptionPets
- `petName` - Búsqueda parcial, case-insensitive
- `petType` - 'dog', 'cat', 'other'
- `breed` - Búsqueda parcial
- `page` - Número de página
- `limit` - Items por página (default: 20)

### getNearbyLostPets / getNearbyAdoptionPets
- `latitude` - **Requerido**
- `longitude` - **Requerido**
- `radius` - Kilómetros (default: 10)
- `petName` - Filtro opcional
- `petType` - Filtro opcional

---

## 🎯 Próximos Pasos

Ahora que tienes todos los servicios integrados, puedes:

1. ✅ Integrar en tus pantallas existentes ([app/(tabs)/explore.tsx](app/(tabs)/explore.tsx), etc.)
2. ✅ Usar el componente ImagePicker en el formulario de creación
3. ✅ Implementar la búsqueda geográfica con "Cerca de mí"
4. ✅ Agregar filtros (tipo de mascota, raza, etc.)
5. ⏳ Implementar comentarios en incidentes

---

¿Necesitas ayuda para integrar en alguna pantalla específica?
