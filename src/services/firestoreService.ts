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
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { SolicitudData, MensajeriaRequestData, DeliveryRequestData, EnvioFlexRequestData } from '@/types/requestTypes';

const SOLICITUDES_COLLECTION = 'solicitudes';

// Create
export async function addSolicitud(
  solicitudData: Omit<SolicitudData, 'id' | 'fechaCreacion'>
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, SOLICITUDES_COLLECTION), {
      ...solicitudData,
      fechaCreacion: serverTimestamp() as Timestamp, // Firestore will set this
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding document: ', error);
    throw new Error('No se pudo crear la solicitud.');
  }
}

// Read
export async function getSolicitud(id: string): Promise<SolicitudData | null> {
  try {
    const docRef = doc(db, SOLICITUDES_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as SolicitudData;
    } else {
      console.log('No such document!');
      return null;
    }
  } catch (error) {
    console.error('Error getting document:', error);
    throw new Error('No se pudo obtener la solicitud.');
  }
}

// Read All (example, might need pagination/filtering for real apps)
export async function getAllSolicitudes(): Promise<SolicitudData[]> {
  try {
    const q = query(collection(db, SOLICITUDES_COLLECTION));
    const querySnapshot = await getDocs(q);
    const solicitudes: SolicitudData[] = [];
    querySnapshot.forEach((doc) => {
      solicitudes.push({ id: doc.id, ...doc.data() } as SolicitudData);
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
  data: Partial<Omit<SolicitudData, 'id' | 'fechaCreacion' | 'tipo'>> // tipo and fechaCreacion usually not updated
): Promise<void> {
  try {
    const docRef = doc(db, SOLICITUDES_COLLECTION, id);
    await updateDoc(docRef, data);
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
