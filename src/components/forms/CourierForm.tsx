
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
import { addSolicitud } from "@/services/firestoreService";
import type { MensajeriaRequestData } from "@/types/requestTypes";
import { Timestamp } from "firebase/firestore";

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
});

type CourierFormValues = z.infer<typeof courierFormSchema>;

export default function CourierForm() {
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
    },
  });

  async function onSubmit(data: CourierFormValues) {
    try {
      const solicitudData: Omit<MensajeriaRequestData, "id" | "fechaCreacion"> = {
        tipo: "mensajeria",
        senderName: data.senderName,
        senderPhone: data.senderPhone,
        origen: data.originAddress,
        recipientName: data.recipientName,
        recipientPhone: data.recipientPhone,
        destino: data.destinationAddress,
        descripcionPaquete: data.packageDescription,
        serviceType: data.serviceType,
        fechaRecoleccionDeseada: Timestamp.fromDate(new Date(data.fechaRecoleccionDeseada)),
        ...(data.peso && { peso: data.peso }),
        ...(data.dimensionesAncho && data.dimensionesAlto && data.dimensionesLargo && {
          dimensiones: {
            ancho: data.dimensionesAncho,
            alto: data.dimensionesAlto,
            largo: data.dimensionesLargo,
          },
        }),
      };

      await addSolicitud(solicitudData);

      toast({
        title: "Solicitud Enviada",
        description: "Su solicitud de mensajería ha sido registrada en Firestore.",
      });
      form.reset();
    } catch (error) {
      console.error("Error creating mensajeria request:", error);
      toast({
        title: "Error",
        description: "No se pudo registrar la solicitud. Intente nuevamente.",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                  <Input type="number" placeholder="Ej: 2.5" {...field} onChange={event => field.onChange(parseFloat(event.target.value))} />
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
        </div>

        <Button type="submit" className="w-full bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] hover:bg-[hsl(var(--accent)/0.9)]" size="lg">
          Cotizá tu envío
        </Button>
      </form>
    </Form>
  );
}
