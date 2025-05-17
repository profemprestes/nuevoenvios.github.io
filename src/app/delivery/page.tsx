
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DeliveryForm from "@/components/forms/DeliveryForm";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { getSolicitudesPorTipo, deleteSolicitud } from "@/services/firestoreService";
import type { DeliveryRequestData, SolicitudDataWithId } from "@/types/requestTypes";
import { SolicitudStatus } from "@/types/requestTypes";
import { useToast } from "@/hooks/use-toast";
import { Edit, Trash2, PlusCircle } from "lucide-react";
import { Timestamp } from "firebase/firestore";

const formatTimestampForDisplay = (timestamp?: Timestamp): string => {
  if (!timestamp) return "N/A";
  return timestamp.toDate().toLocaleString('es-UY', { dateStyle: 'short', timeStyle: 'short' });
};

export default function DeliveryPage() {
  const [solicitudes, setSolicitudes] = useState<DeliveryRequestData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSolicitud, setSelectedSolicitud] = useState<(DeliveryRequestData & { id: string }) | null>(null);
  const [solicitudToDeleteId, setSolicitudToDeleteId] = useState<string | null>(null);

  const { toast } = useToast();

  const fetchSolicitudes = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getSolicitudesPorTipo("delivery");
      setSolicitudes(data as DeliveryRequestData[]);
    } catch (error) {
      console.error("Error fetching delivery solicitudes:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las solicitudes de delivery.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchSolicitudes();
  }, [fetchSolicitudes]);

  const handleCreateNew = () => {
    setSelectedSolicitud(null);
    setIsCreateModalOpen(true);
  };

  const handleEdit = (solicitud: DeliveryRequestData & { id: string }) => {
    setSelectedSolicitud(solicitud);
    setIsEditModalOpen(true);
  };

  const handleDeleteConfirmation = (id: string) => {
    setSolicitudToDeleteId(id);
  };

  const handleDelete = async () => {
    if (!solicitudToDeleteId) return;
    try {
      await deleteSolicitud(solicitudToDeleteId);
      toast({
        title: "Solicitud Eliminada",
        description: "La solicitud de delivery ha sido eliminada.",
      });
      fetchSolicitudes(); 
    } catch (error) {
      console.error("Error deleting solicitud:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la solicitud.",
        variant: "destructive",
      });
    } finally {
      setSolicitudToDeleteId(null);
    }
  };

  const handleSaveSuccess = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedSolicitud(null);
    fetchSolicitudes();
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card className="shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-semibold">Gestión de Delivery</CardTitle>
            <CardDescription>
              Visualice, cree, edite o elimine solicitudes de delivery.
            </CardDescription>
          </div>
          <Button onClick={handleCreateNew} className="bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] hover:bg-[hsl(var(--accent)/0.9)]">
            <PlusCircle className="mr-2 h-4 w-4" /> Nueva Solicitud
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Cargando solicitudes...</p>
          ) : solicitudes.length === 0 ? (
             <p className="text-center text-muted-foreground py-4">No hay solicitudes de delivery registradas.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
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
                    <TableCell className="font-medium truncate max-w-xs">{solicitud.direccionOrigen}</TableCell>
                    <TableCell className="truncate max-w-xs">{solicitud.direccionDestino}</TableCell>
                    <TableCell className="hidden md:table-cell">{solicitud.nombreDestinatario}</TableCell>
                    <TableCell className="hidden lg:table-cell">{formatTimestampForDisplay(solicitud.fechaEntregaDeseada)}</TableCell>
                     <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        solicitud.estado === SolicitudStatus.PENDIENTE ? 'bg-yellow-200 text-yellow-800' :
                        solicitud.estado === SolicitudStatus.EN_PROCESO ? 'bg-blue-200 text-blue-800' :
                        solicitud.estado === SolicitudStatus.COMPLETADO ? 'bg-green-200 text-green-800' :
                        solicitud.estado === SolicitudStatus.CANCELADO ? 'bg-red-200 text-red-800' : 'bg-gray-200 text-gray-800'
                      }`}>
                        {solicitud.estado}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                       <Button variant="ghost" size="icon" onClick={() => handleEdit(solicitud as SolicitudDataWithId as DeliveryRequestData & {id:string})} title="Editar">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteConfirmation(solicitud.id!)} title="Eliminar" className="text-destructive hover:text-destructive/80">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nueva Solicitud de Delivery</DialogTitle>
            <DialogDescription>
              Especifique las ubicaciones de recogida y entrega para su delivery.
            </DialogDescription>
          </DialogHeader>
          <DeliveryForm onSaveSuccess={handleSaveSuccess} />
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Solicitud de Delivery</DialogTitle>
            <DialogDescription>
             Modifique los detalles de la solicitud existente.
            </DialogDescription>
          </DialogHeader>
          {selectedSolicitud && (
            <DeliveryForm
              initialData={selectedSolicitud}
              onSaveSuccess={handleSaveSuccess}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!solicitudToDeleteId} onOpenChange={() => setSolicitudToDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente la solicitud de delivery.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSolicitudToDeleteId(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
