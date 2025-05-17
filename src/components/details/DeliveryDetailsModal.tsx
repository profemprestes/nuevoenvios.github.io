
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { DeliveryRequestData } from "@/types/requestTypes";
import { SolicitudStatus } from "@/types/requestTypes";
import { Timestamp } from "firebase/firestore";

const formatTimestampForDisplay = (timestamp?: Timestamp): string => {
  if (!timestamp) return "N/A";
  return timestamp.toDate().toLocaleString('es-UY', { dateStyle: 'long', timeStyle: 'short' });
};

interface DeliveryDetailsModalProps {
  solicitud: DeliveryRequestData | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeliveryDetailsModal({
  solicitud,
  isOpen,
  onOpenChange,
}: DeliveryDetailsModalProps) {
  if (!solicitud) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Detalles de Solicitud de Delivery</DialogTitle>
          <DialogDescription>ID: {solicitud.id}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-sm">
          <div className="grid grid-cols-[180px_1fr] items-start gap-2">
            <span className="font-semibold text-muted-foreground">Estado:</span>
            <span>{solicitud.estado || SolicitudStatus.PENDIENTE}</span>
          </div>
          
          <h4 className="font-semibold mt-2 text-base">Recogida</h4>
          <div className="grid grid-cols-[180px_1fr] items-start gap-2 pl-4">
            <span className="font-semibold text-muted-foreground">Dirección Origen:</span>
            <span className="break-words">{solicitud.direccionOrigen}</span>
            <span className="font-semibold text-muted-foreground">Nombre Contacto Recogida:</span>
            <span>{solicitud.contactNamePickup}</span>
            <span className="font-semibold text-muted-foreground">Teléfono Contacto Recogida:</span>
            <span>{solicitud.contactPhonePickup}</span>
          </div>

          <h4 className="font-semibold mt-2 text-base">Entrega</h4>
           <div className="grid grid-cols-[180px_1fr] items-start gap-2 pl-4">
            <span className="font-semibold text-muted-foreground">Dirección Destino:</span>
            <span className="break-words">{solicitud.direccionDestino}</span>
            <span className="font-semibold text-muted-foreground">Nombre Destinatario:</span>
            <span>{solicitud.nombreDestinatario}</span>
             <span className="font-semibold text-muted-foreground">Teléfono Destinatario:</span>
            <span>{solicitud.telefonoDestinatario}</span>
          </div>

          <h4 className="font-semibold mt-2 text-base">Paquete y Fechas</h4>
           <div className="grid grid-cols-[180px_1fr] items-start gap-2 pl-4">
            <span className="font-semibold text-muted-foreground">Detalles del Paquete:</span>
            <span className="break-words">{solicitud.packageDetails}</span>
            {solicitud.instruccionesEspeciales && (
              <>
                <span className="font-semibold text-muted-foreground">Instrucciones Especiales:</span>
                <span className="break-words">{solicitud.instruccionesEspeciales}</span>
              </>
            )}
            <span className="font-semibold text-muted-foreground">Entrega Deseada:</span>
            <span>{formatTimestampForDisplay(solicitud.fechaEntregaDeseada)}</span>
            <span className="font-semibold text-muted-foreground">Fecha Creación:</span>
            <span>{formatTimestampForDisplay(solicitud.fechaCreacion)}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
