
// src/types/requestTypes.ts
import type { Timestamp } from 'firebase/firestore';

export const SolicitudStatus = {
  PENDIENTE: "Pendiente",
  EN_PROCESO: "En Proceso",
  COMPLETADO: "Completado",
  CANCELADO: "Cancelado",
} as const;

export type SolicitudEstado = typeof SolicitudStatus[keyof typeof SolicitudStatus];

export interface Dimensiones {
  ancho: number;
  alto: number;
  largo: number;
}

export interface PuntoEntrega {
  direccion: string;
  descripcionPaquete: string;
  contactName?: string;
  contactPhone?: string;
}

interface BaseRequest {
  id?: string; // Firestore document ID
  tipo: 'mensajeria' | 'delivery' | 'envio_flex';
  estado: SolicitudEstado; // Made non-optional here
  fechaCreacion: Timestamp;
}

export interface MensajeriaRequestData extends BaseRequest {
  tipo: 'mensajeria';
  senderName: string;
  senderPhone: string;
  origen: string; 
  recipientName: string;
  recipientPhone: string;
  destino: string; 
  descripcionPaquete: string;
  serviceType: 'standard' | 'express';
  peso?: number;
  dimensiones?: Dimensiones;
  fechaRecoleccionDeseada: Timestamp;
}

export interface DeliveryRequestData extends BaseRequest {
  tipo: 'delivery';
  direccionOrigen: string; 
  contactNamePickup: string;
  contactPhonePickup: string;
  direccionDestino: string; 
  nombreDestinatario: string; 
  telefonoDestinatario: string; 
  packageDetails: string; 
  instruccionesEspeciales?: string;
  fechaEntregaDeseada: Timestamp;
}

export interface EnvioFlexRequestData extends BaseRequest {
  tipo: 'envio_flex';
  originAddress: string;
  puntosEntrega: PuntoEntrega[];
  ventanaHorariaPreferida?: string; 
  requiereConfirmacionEntrega?: boolean;
}

export type SolicitudData = MensajeriaRequestData | DeliveryRequestData | EnvioFlexRequestData;

export type SolicitudDataWithId = SolicitudData & { id: string };

// Specific type for forms where 'estado' might be optional initially or in initialData
export type MensajeriaRequestFormData = Omit<MensajeriaRequestData, 'fechaCreacion' | 'estado'> & { id?: string; estado?: SolicitudEstado };
export type DeliveryRequestFormData = Omit<DeliveryRequestData, 'fechaCreacion' | 'estado'> & { id?: string; estado?: SolicitudEstado };
export type EnvioFlexRequestFormData = Omit<EnvioFlexRequestData, 'fechaCreacion' | 'estado'> & { id?: string; estado?: SolicitudEstado };

