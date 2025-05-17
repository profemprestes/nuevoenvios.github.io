
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CourierForm from "@/components/forms/CourierForm";
import CourierTable from "@/components/tables/CourierTable";
import CourierDetailsModal from "@/components/details/CourierDetailsModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
} from "@/components/ui/alert-dialog";
import { getSolicitudesPorTipo, deleteSolicitud } from "@/services/firestoreService";
import type { MensajeriaRequestData } from "@/types/requestTypes";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Search } from "lucide-react";

export default function MensajeriaPage() {
  const [solicitudes, setSolicitudes] = useState<MensajeriaRequestData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewDetailsModalOpen, setIsViewDetailsModalOpen] = useState(false);
  const [selectedSolicitud, setSelectedSolicitud] = useState<MensajeriaRequestData | null>(null);
  const [solicitudToDeleteId, setSolicitudToDeleteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { toast } = useToast();

  const fetchSolicitudes = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getSolicitudesPorTipo("mensajeria");
      setSolicitudes(data as MensajeriaRequestData[]);
    } catch (error) {
      console.error("Error fetching mensajeria solicitudes:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las solicitudes de mensajería.",
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

  const handleViewDetails = (solicitud: MensajeriaRequestData) => {
    setSelectedSolicitud(solicitud);
    setIsViewDetailsModalOpen(true);
  };

  const handleEdit = (solicitud: MensajeriaRequestData) => {
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
        description: "La solicitud de mensajería ha sido eliminada.",
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
  
  const filteredSolicitudes = solicitudes.filter(solicitud => {
    const term = searchTerm.toLowerCase();
    return (
      solicitud.id?.toLowerCase().includes(term) ||
      solicitud.origen?.toLowerCase().includes(term) ||
      solicitud.destino?.toLowerCase().includes(term) ||
      solicitud.descripcionPaquete?.toLowerCase().includes(term) ||
      solicitud.senderName?.toLowerCase().includes(term) ||
      solicitud.recipientName?.toLowerCase().includes(term) ||
      solicitud.estado?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card className="shadow-xl">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-semibold">Gestión de Mensajería</CardTitle>
            <CardDescription>
              Visualice, cree, edite o elimine solicitudes de mensajería.
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:max-w-xs">
              <Input 
                type="text"
                placeholder="Filtrar por ID, origen, estado..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full" 
              />
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
            <Button onClick={handleCreateNew} className="bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] hover:bg-[hsl(var(--accent)/0.9)] w-full sm:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" /> Nueva Solicitud
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Cargando solicitudes...</p>
          ) : filteredSolicitudes.length === 0 ? (
             <p className="text-center text-muted-foreground py-4">
              {solicitudes.length > 0 ? "No hay solicitudes que coincidan con su búsqueda." : "No hay solicitudes de mensajería registradas."}
            </p>
          ) : (
            <CourierTable
              solicitudes={filteredSolicitudes}
              onViewDetails={handleViewDetails}
              onEdit={handleEdit}
              onDelete={handleDeleteConfirmation}
            />
          )}
        </CardContent>
      </Card>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nueva Solicitud de Mensajería</DialogTitle>
            <DialogDescription>
              Complete el formulario para registrar una nueva solicitud.
            </DialogDescription>
          </DialogHeader>
          <CourierForm onSaveSuccess={handleSaveSuccess} />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Solicitud de Mensajería</DialogTitle>
            <DialogDescription>
              Modifique los detalles de la solicitud existente.
            </DialogDescription>
          </DialogHeader>
          {selectedSolicitud && (
            <CourierForm
              initialData={selectedSolicitud}
              onSaveSuccess={handleSaveSuccess}
            />
          )}
        </DialogContent>
      </Dialog>

      <CourierDetailsModal
        solicitud={selectedSolicitud}
        isOpen={isViewDetailsModalOpen}
        onOpenChange={setIsViewDetailsModalOpen}
      />
      
      <AlertDialog open={!!solicitudToDeleteId} onOpenChange={() => setSolicitudToDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente la solicitud de mensajería.
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
