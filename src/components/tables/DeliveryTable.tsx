
"use client";

import type { DeliveryRequestData } from "@/types/requestTypes";
import { SolicitudStatus } from "@/types/requestTypes";
import { Timestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Edit, Trash2 } from "lucide-react";

const formatTimestampForDisplay = (timestamp?: Timestamp): string => {
  if (!timestamp) return "N/A";
  return timestamp.toDate().toLocaleString('es-UY', { dateStyle: 'short', timeStyle: 'short' });
};

interface DeliveryTableProps {
  solicitudes: DeliveryRequestData[];
  onViewDetails: (solicitud: DeliveryRequestData) => void;
  onEdit: (solicitud: DeliveryRequestData) => void;
  onDelete: (id: string) => void;
}

export default function DeliveryTable({
  solicitudes,
  onViewDetails,
  onEdit,
  onDelete,
}: DeliveryTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>Origen</TableHead>
          <TableHead>Destino</TableHead>
          <TableHead className="hidden md:table-cell">Destinatario</TableHead>
          <TableHead className="hidden lg:table-cell">Entrega Deseada</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {solicitudes.map((solicitud) => (
          <TableRow key={solicitud.id}>
            <TableCell className="font-medium truncate max-w-[100px]">{solicitud.id}</TableCell>
            <TableCell className="truncate max-w-xs">{solicitud.direccionOrigen}</TableCell>
            <TableCell className="truncate max-w-xs">{solicitud.direccionDestino}</TableCell>
            <TableCell className="hidden md:table-cell">{solicitud.nombreDestinatario}</TableCell>
            <TableCell className="hidden lg:table-cell">
              {formatTimestampForDisplay(solicitud.fechaEntregaDeseada)}
            </TableCell>
            <TableCell>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  solicitud.estado === SolicitudStatus.PENDIENTE
                    ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                    : solicitud.estado === SolicitudStatus.EN_PROCESO
                    ? "bg-blue-100 text-blue-700 border border-blue-300"
                    : solicitud.estado === SolicitudStatus.COMPLETADO
                    ? "bg-green-100 text-green-700 border border-green-300"
                    : solicitud.estado === SolicitudStatus.CANCELADO
                    ? "bg-red-100 text-red-700 border border-red-300"
                    : "bg-gray-100 text-gray-700 border border-gray-300"
                }`}
              >
                {solicitud.estado}
              </span>
            </TableCell>
            <TableCell className="text-right space-x-1">
              <Button variant="ghost" size="icon" onClick={() => onViewDetails(solicitud)} title="Ver Detalles">
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onEdit(solicitud)} title="Editar">
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(solicitud.id!)}
                title="Eliminar"
                className="text-destructive hover:text-destructive/80"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
