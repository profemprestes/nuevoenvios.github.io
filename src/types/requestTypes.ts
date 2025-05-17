
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
  estado: SolicitudEstado;
  fechaCreacion: Timestamp;
}

export interface MensajeriaRequestData extends BaseRequest {
  tipo: 'mensajeria';
  senderName: string;
  senderPhone: string;
  origen: string; // Corresponds to originAddress in form
  recipientName: string;
  recipientPhone: string;
  destino: string; // Corresponds to destinationAddress in form
  descripcionPaquete: string;
  serviceType: 'standard' | 'express';
  peso?: number;
  dimensiones?: Dimensiones;
  fechaRecoleccionDeseada: Timestamp;
}

export interface DeliveryRequestData extends BaseRequest {
  tipo: 'delivery';
  direccionOrigen: string; // Corresponds to pickupAddress in form
  contactNamePickup: string;
  contactPhonePickup: string;
  direccionDestino: string; // Corresponds to deliveryAddress in form
  nombreDestinatario: string; // Corresponds to contactNameDelivery in form
  telefonoDestinatario: string; // Corresponds to contactPhoneDelivery in form
  packageDetails: string; // Description of what is being delivered
  instruccionesEspeciales?: string;
  fechaEntregaDeseada: Timestamp;
}

export interface EnvioFlexRequestData extends BaseRequest {
  tipo: 'envio_flex';
  originAddress: string;
  puntosEntrega: PuntoEntrega[];
  ventanaHorariaPreferida?: string; // Corresponds to shippingPreferences in form
  requiereConfirmacionEntrega?: boolean;
}

export type SolicitudData = MensajeriaRequestData | DeliveryRequestData | EnvioFlexRequestData;

// Helper type to ensure ID is present when we know it (e.g., after fetching or for editing)
export type SolicitudDataWithId = SolicitudData & { id: string };
