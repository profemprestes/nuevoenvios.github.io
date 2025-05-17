
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { MensajeriaRequestData } from "@/types/requestTypes";
import { SolicitudStatus } from "@/types/requestTypes";
import { Timestamp } from "firebase/firestore";

const formatTimestampForDisplay = (timestamp?: Timestamp): string => {
  if (!timestamp) return "N/A";
  return timestamp.toDate().toLocaleString('es-UY', { dateStyle: 'long', timeStyle: 'short' });
};

interface CourierDetailsModalProps {
  solicitud: MensajeriaRequestData | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CourierDetailsModal({
  solicitud,
  isOpen,
  onOpenChange,
}: CourierDetailsModalProps) {
  if (!solicitud) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Detalles de Solicitud de Mensajería</DialogTitle>
          <DialogDescription>ID: {solicitud.id}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-sm">
          <div className="grid grid-cols-[150px_1fr] items-center gap-2">
            <span className="font-semibold text-muted-foreground">Estado:</span>
            <span>{solicitud.estado || SolicitudStatus.PENDIENTE}</span>
          </div>
          <div className="grid grid-cols-[150px_1fr] items-center gap-2">
            <span className="font-semibold text-muted-foreground">Tipo de Servicio:</span>
            <span>{solicitud.serviceType}</span>
          </div>
          
          <h4 className="font-semibold mt-2 text-base">Remitente</h4>
          <div className="grid grid-cols-[150px_1fr] items-center gap-2 pl-4">
            <span className="font-semibold text-muted-foreground">Nombre:</span>
            <span>{solicitud.senderName}</span>
            <span className="font-semibold text-muted-foreground">Teléfono:</span>
            <span>{solicitud.senderPhone}</span>
            <span className="font-semibold text-muted-foreground">Origen:</span>
            <span className="break-words">{solicitud.origen}</span>
          </div>

          <h4 className="font-semibold mt-2 text-base">Destinatario</h4>
           <div className="grid grid-cols-[150px_1fr] items-center gap-2 pl-4">
            <span className="font-semibold text-muted-foreground">Nombre:</span>
            <span>{solicitud.recipientName}</span>
            <span className="font-semibold text-muted-foreground">Teléfono:</span>
            <span>{solicitud.recipientPhone}</span>
            <span className="font-semibold text-muted-foreground">Destino:</span>
            <span className="break-words">{solicitud.destino}</span>
          </div>

          <h4 className="font-semibold mt-2 text-base">Paquete</h4>
           <div className="grid grid-cols-[150px_1fr] items-center gap-2 pl-4">
            <span className="font-semibold text-muted-foreground">Descripción:</span>
            <span className="break-words">{solicitud.descripcionPaquete}</span>
            {solicitud.peso && (
              <>
                <span className="font-semibold text-muted-foreground">Peso:</span>
                <span>{solicitud.peso} kg</span>
              </>
            )}
            {solicitud.dimensiones && (
              <>
                <span className="font-semibold text-muted-foreground">Dimensiones:</span>
                <span>{`${solicitud.dimensiones.ancho}cm x ${solicitud.dimensiones.alto}cm x ${solicitud.dimensiones.largo}cm`}</span>
              </>
            )}
          </div>

          <h4 className="font-semibold mt-2 text-base">Fechas</h4>
           <div className="grid grid-cols-[150px_1fr] items-center gap-2 pl-4">
            <span className="font-semibold text-muted-foreground">Recolección Deseada:</span>
            <span>{formatTimestampForDisplay(solicitud.fechaRecoleccionDeseada)}</span>
            <span className="font-semibold text-muted-foreground">Fecha Creación:</span>
            <span>{formatTimestampForDisplay(solicitud.fechaCreacion)}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
