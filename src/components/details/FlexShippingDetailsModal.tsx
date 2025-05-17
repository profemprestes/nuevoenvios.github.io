
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { EnvioFlexRequestData, PuntoEntrega } from "@/types/requestTypes";
import { SolicitudStatus } from "@/types/requestTypes";
import { Timestamp } from "firebase/firestore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formatTimestampForDisplay = (timestamp?: Timestamp): string => {
  if (!timestamp) return "N/A";
  return timestamp.toDate().toLocaleString('es-UY', { dateStyle: 'long', timeStyle: 'short' });
};

interface FlexShippingDetailsModalProps {
  solicitud: EnvioFlexRequestData | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function FlexShippingDetailsModal({
  solicitud,
  isOpen,
  onOpenChange,
}: FlexShippingDetailsModalProps) {
  if (!solicitud) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalles de Envío Flex</DialogTitle>
          <DialogDescription>ID: {solicitud.id}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-6">
          <div className="grid gap-4 py-4 text-sm">
            <div className="grid grid-cols-[180px_1fr] items-start gap-2">
                <span className="font-semibold text-muted-foreground">Estado:</span>
                <span>{solicitud.estado || SolicitudStatus.PENDIENTE}</span>
            </div>
            <div className="grid grid-cols-[180px_1fr] items-start gap-2">
                <span className="font-semibold text-muted-foreground">Dirección de Origen:</span>
                <span className="break-words">{solicitud.originAddress}</span>
            </div>
            
            <h4 className="font-semibold mt-3 text-base">Puntos de Entrega ({solicitud.puntosEntrega.length})</h4>
            {solicitud.puntosEntrega.map((punto, index) => (
              <Card key={index} className="mb-3 bg-muted/30">
                <CardHeader className="pb-2 pt-3 px-4">
                  <CardTitle className="text-sm">Punto de Entrega #{index + 1}</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-[160px_1fr] items-start gap-x-2 gap-y-1 px-4 pb-3">
                  <span className="font-semibold text-muted-foreground">Dirección:</span>
                  <span className="break-words">{punto.direccion}</span>
                  <span className="font-semibold text-muted-foreground">Descripción Paquete:</span>
                  <span className="break-words">{punto.descripcionPaquete}</span>
                  {punto.contactName && (
                    <>
                      <span className="font-semibold text-muted-foreground">Nombre Contacto:</span>
                      <span>{punto.contactName}</span>
                    </>
                  )}
                  {punto.contactPhone && (
                    <>
                      <span className="font-semibold text-muted-foreground">Teléfono Contacto:</span>
                      <span>{punto.contactPhone}</span>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}

            <h4 className="font-semibold mt-2 text-base">Preferencias y Fechas</h4>
            <div className="grid grid-cols-[180px_1fr] items-start gap-2 pl-4">
                {solicitud.ventanaHorariaPreferida && (
                <>
                    <span className="font-semibold text-muted-foreground">Ventana Horaria:</span>
                    <span>{solicitud.ventanaHorariaPreferida}</span>
                </>
                )}
                <span className="font-semibold text-muted-foreground">Confirmación Entrega:</span>
                <span>{solicitud.requiereConfirmacionEntrega ? "Sí" : "No"}</span>
                <span className="font-semibold text-muted-foreground">Fecha Creación:</span>
                <span>{formatTimestampForDisplay(solicitud.fechaCreacion)}</span>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
