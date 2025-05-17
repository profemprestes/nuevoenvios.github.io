
// src/services/firestoreService.ts
import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  getDocs,
  Timestamp,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { SolicitudData, SolicitudDataWithId, SolicitudEstado } from '@/types/requestTypes';
import { SolicitudStatus } from '@/types/requestTypes';

const SOLICITUDES_COLLECTION = 'solicitudes';

// Create
export async function addSolicitud(
  solicitudData: Omit<SolicitudData, 'id' | 'fechaCreacion' | 'estado'> & { estado?: SolicitudEstado }
): Promise<string> {
  try {
    const dataToSave = {
      ...solicitudData,
      estado: solicitudData.estado || SolicitudStatus.PENDIENTE,
      fechaCreacion: serverTimestamp() as Timestamp,
    };
    const docRef = await addDoc(collection(db, SOLICITUDES_COLLECTION), dataToSave);
    return docRef.id;
  } catch (error) {
    console.error('Error adding document: ', error);
    throw new Error('No se pudo crear la solicitud.');
  }
}

// Read
export async function getSolicitud(id: string): Promise<SolicitudDataWithId | null> {
  try {
    const docRef = doc(db, SOLICITUDES_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as SolicitudDataWithId;
    } else {
      console.log('No such document!');
      return null;
    }
  } catch (error) {
    console.error('Error getting document:', error);
    throw new Error('No se pudo obtener la solicitud.');
  }
}

// Read All by Type
export async function getSolicitudesPorTipo(tipo: SolicitudData['tipo']): Promise<SolicitudDataWithId[]> {
  try {
    const q = query(
      collection(db, SOLICITUDES_COLLECTION),
      where('tipo', '==', tipo),
      orderBy('fechaCreacion', 'desc') // Optional: order by creation date
    );
    const querySnapshot = await getDocs(q);
    const solicitudes: SolicitudDataWithId[] = [];
    querySnapshot.forEach((doc) => {
      solicitudes.push({ id: doc.id, ...doc.data() } as SolicitudDataWithId);
    });
    return solicitudes;
  } catch (error) {
    console.error(`Error getting solicitudes for tipo ${tipo}:`, error);
    throw new Error(`No se pudieron obtener las solicitudes de tipo ${tipo}.`);
  }
}


// Read All (example, might need pagination/filtering for real apps)
export async function getAllSolicitudes(): Promise<SolicitudDataWithId[]> {
  try {
    const q = query(collection(db, SOLICITUDES_COLLECTION), orderBy('fechaCreacion', 'desc'));
    const querySnapshot = await getDocs(q);
    const solicitudes: SolicitudDataWithId[] = [];
    querySnapshot.forEach((doc) => {
      solicitudes.push({ id: doc.id, ...doc.data() } as SolicitudDataWithId);
    });
    return solicitudes;
  } catch (error) {
    console.error('Error getting all solicitudes:', error);
    throw new Error('No se pudieron obtener las solicitudes.');
  }
}

// Update
export async function updateSolicitud(
  id: string,
  data: Partial<Omit<SolicitudData, 'id' | 'fechaCreacion'>>
): Promise<void> {
  try {
    const docRef = doc(db, SOLICITUDES_COLLECTION, id);
    // Ensure 'tipo' is not accidentally changed if it's part of 'data'
    const { tipo, ...updateData } = data as any; 
    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error('Error updating document: ', error);
    throw new Error('No se pudo actualizar la solicitud.');
  }
}

// Delete
export async function deleteSolicitud(id: string): Promise<void> {
  try {
    const docRef = doc(db, SOLICITUDES_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting document: ', error);
    throw new Error('No se pudo eliminar la solicitud.');
  }
}
