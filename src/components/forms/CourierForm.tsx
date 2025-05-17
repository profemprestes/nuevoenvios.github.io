
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { addSolicitud, updateSolicitud } from "@/services/firestoreService";
import type { MensajeriaRequestData, SolicitudEstado } from "@/types/requestTypes";
import { SolicitudStatus } from "@/types/requestTypes";
import { Timestamp } from "firebase/firestore";
import React, { useEffect } from "react";

// Helper to format Timestamp to datetime-local string
const formatTimestampForInput = (timestamp?: Timestamp): string => {
  if (!timestamp) return "";
  const date = timestamp.toDate();
  // Format: YYYY-MM-DDTHH:mm
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const courierFormSchema = z.object({
  senderName: z.string().min(2, "El nombre del remitente es requerido."),
  senderPhone: z.string().min(7, "El teléfono del remitente es requerido."),
  originAddress: z.string().min(10, "La dirección de origen es requerida."),
  recipientName: z.string().min(2, "El nombre del destinatario es requerido."),
  recipientPhone: z.string().min(7, "El teléfono del destinatario es requerido."),
  destinationAddress: z.string().min(10, "La dirección de destino es requerida."),
  packageDescription: z.string().min(5, "La descripción del paquete es requerida."),
  serviceType: z.enum(["standard", "express"], {
    required_error: "Debe seleccionar un tipo de servicio.",
  }),
  peso: z.coerce.number().positive("El peso debe ser un número positivo.").optional(),
  dimensionesAncho: z.coerce.number().positive("El ancho debe ser positivo.").optional(),
  dimensionesAlto: z.coerce.number().positive("El alto debe ser positivo.").optional(),
  dimensionesLargo: z.coerce.number().positive("El largo debe ser positivo.").optional(),
  fechaRecoleccionDeseada: z.string().min(1, "La fecha de recolección es requerida."),
  estado: z.nativeEnum(SolicitudStatus).optional(),
});

export type CourierFormValues = z.infer<typeof courierFormSchema>;

interface CourierFormProps {
  initialData?: MensajeriaRequestData & { id: string };
  onSaveSuccess: () => void;
}

export default function CourierForm({ initialData, onSaveSuccess }: CourierFormProps) {
  const { toast } = useToast();
  const form = useForm<CourierFormValues>({
    resolver: zodResolver(courierFormSchema),
    defaultValues: {
      senderName: "",
      senderPhone: "",
      originAddress: "",
      recipientName: "",
      recipientPhone: "",
      destinationAddress: "",
      packageDescription: "",
      serviceType: undefined,
      peso: undefined,
      dimensionesAncho: undefined,
      dimensionesAlto: undefined,
      dimensionesLargo: undefined,
      fechaRecoleccionDeseada: "",
      estado: SolicitudStatus.PENDIENTE,
    },
  });

  const mode = initialData ? 'edit' : 'create';

  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        origen: initialData.origen || "",
        destino: initialData.destino || "",
        packageDescription: initialData.descripcionPaquete || "",
        fechaRecoleccionDeseada: formatTimestampForInput(initialData.fechaRecoleccionDeseada),
        peso: initialData.peso ?? undefined,
        dimensionesAncho: initialData.dimensiones?.ancho ?? undefined,
        dimensionesAlto: initialData.dimensiones?.alto ?? undefined,
        dimensionesLargo: initialData.dimensiones?.largo ?? undefined,
        estado: initialData.estado || SolicitudStatus.PENDIENTE,
      });
    } else {
      form.reset({ // Reset to default for create mode
        senderName: "",
        senderPhone: "",
        originAddress: "",
        recipientName: "",
        recipientPhone: "",
        destinationAddress: "",
        packageDescription: "",
        serviceType: undefined,
        peso: undefined,
        dimensionesAncho: undefined,
        dimensionesAlto: undefined,
        dimensionesLargo: undefined,
        fechaRecoleccionDeseada: "",
        estado: SolicitudStatus.PENDIENTE,
      });
    }
  }, [initialData, form]);

  async function onSubmit(data: CourierFormValues) {
    try {
      const commonData = {
        senderName: data.senderName,
        senderPhone: data.senderPhone,
        origen: data.originAddress,
        recipientName: data.recipientName,
        recipientPhone: data.recipientPhone,
        destino: data.destinationAddress,
        descripcionPaquete: data.packageDescription,
        serviceType: data.serviceType,
        fechaRecoleccionDeseada: Timestamp.fromDate(new Date(data.fechaRecoleccionDeseada)),
        estado: data.estado || SolicitudStatus.PENDIENTE,
        ...(data.peso && { peso: data.peso }),
        ...(data.dimensionesAncho && data.dimensionesAlto && data.dimensionesLargo && {
          dimensiones: {
            ancho: data.dimensionesAncho,
            alto: data.dimensionesAlto,
            largo: data.dimensionesLargo,
          },
        }),
      };

      if (mode === 'edit' && initialData?.id) {
        await updateSolicitud(initialData.id, {
            tipo: "mensajeria", // Ensure tipo is maintained correctly
             ...commonData
        });
        toast({
          title: "Solicitud Actualizada",
          description: "La solicitud de mensajería ha sido actualizada.",
        });
      } else {
        const solicitudToCreate: Omit<MensajeriaRequestData, 'id' | 'fechaCreacion'> = {
            tipo: "mensajeria",
            ...commonData,
            // estado will be set by commonData or default in service
        };
        await addSolicitud(solicitudToCreate);
        toast({
          title: "Solicitud Enviada",
          description: "Su solicitud de mensajería ha sido registrada.",
        });
      }
      onSaveSuccess();
      if (mode === 'create') form.reset(); // Reset only for create mode
    } catch (error) {
      console.error(`Error ${mode === 'edit' ? 'updating' : 'creating'} mensajeria request:`, error);
      toast({
        title: "Error",
        description: `No se pudo ${mode === 'edit' ? 'actualizar' : 'registrar'} la solicitud. Intente nuevamente.`,
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Información del Remitente</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="senderName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Remitente</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Juan Pérez" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="senderPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono del Remitente</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="Ej: 3001234567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="originAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dirección de Origen</FormLabel>
                <FormControl>
                  <Textarea placeholder="Ej: Calle 10 # 20-30, Barrio Ejemplo, Ciudad" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Información del Destinatario</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="recipientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Destinatario</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Ana García" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="recipientPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono del Destinatario</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="Ej: 3109876543" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="destinationAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dirección de Destino</FormLabel>
                <FormControl>
                  <Textarea placeholder="Ej: Carrera 5 # 15-25, Edificio Sol, Ciudad" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Detalles del Envío</h3>
          <FormField
            control={form.control}
            name="packageDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción del Paquete</FormLabel>
                <FormControl>
                  <Textarea placeholder="Ej: Documentos importantes, caja pequeña con repuestos" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="peso"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Peso (kg) (Opcional)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" placeholder="Ej: 2.5" {...field} onChange={event => field.onChange(parseFloat(event.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <FormField
              control={form.control}
              name="dimensionesAncho"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ancho (cm) (Opcional)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Ej: 20" {...field} onChange={event => field.onChange(parseFloat(event.target.value))}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dimensionesAlto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alto (cm) (Opcional)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Ej: 15" {...field} onChange={event => field.onChange(parseFloat(event.target.value))}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dimensionesLargo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Largo (cm) (Opcional)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Ej: 30" {...field} onChange={event => field.onChange(parseFloat(event.target.value))}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="fechaRecoleccionDeseada"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha y Hora de Recolección Deseada</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="serviceType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Servicio</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un tipo de servicio" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="standard">Estándar</SelectItem>
                    <SelectItem value="express">Express</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {mode === 'edit' && (
            <FormField
              control={form.control}
              name="estado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un estado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(SolicitudStatus).map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <Button type="submit" className="w-full bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] hover:bg-[hsl(var(--accent)/0.9)]" size="lg">
          {mode === 'edit' ? 'Actualizar Solicitud' : 'Cotizá tu envío'}
        </Button>
      </form>
    </Form>
  );
}
