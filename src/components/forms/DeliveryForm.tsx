
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
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
import AddressAutocompleteInput from "@/components/shared/AddressAutocompleteInput";
import { useToast } from "@/hooks/use-toast";
import { addSolicitud } from "@/services/firestoreService";
import type { DeliveryRequestData } from "@/types/requestTypes";
import { Timestamp } from "firebase/firestore";

const deliveryFormSchema = z.object({
  pickupAddress: z.string().min(10, "La dirección de recogida es requerida."),
  contactNamePickup: z.string().min(2, "El nombre de contacto en recogida es requerido."),
  contactPhonePickup: z.string().min(7, "El teléfono de contacto en recogida es requerido."),
  deliveryAddress: z.string().min(10, "La dirección de entrega es requerida."),
  contactNameDelivery: z.string().min(2, "El nombre de contacto en entrega es requerido."),
  contactPhoneDelivery: z.string().min(7, "El teléfono de contacto en entrega es requerido."),
  packageDetails: z.string().min(5, "Los detalles del paquete son requeridos."),
  instruccionesEspeciales: z.string().optional(),
  fechaEntregaDeseada: z.string().min(1, "La fecha de entrega es requerida."),
});

type DeliveryFormValues = z.infer<typeof deliveryFormSchema>;

export default function DeliveryForm() {
  const { toast } = useToast();
  const form = useForm<DeliveryFormValues>({
    resolver: zodResolver(deliveryFormSchema),
    defaultValues: {
      pickupAddress: "",
      contactNamePickup: "",
      contactPhonePickup: "",
      deliveryAddress: "",
      contactNameDelivery: "",
      contactPhoneDelivery: "",
      packageDetails: "",
      instruccionesEspeciales: "",
      fechaEntregaDeseada: "",
    },
  });

  async function onSubmit(data: DeliveryFormValues) {
    try {
      const solicitudData: Omit<DeliveryRequestData, "id" | "fechaCreacion"> = {
        tipo: "delivery",
        direccionOrigen: data.pickupAddress,
        contactNamePickup: data.contactNamePickup,
        contactPhonePickup: data.contactPhonePickup,
        direccionDestino: data.deliveryAddress,
        nombreDestinatario: data.contactNameDelivery,
        telefonoDestinatario: data.contactPhoneDelivery,
        packageDetails: data.packageDetails,
        fechaEntregaDeseada: Timestamp.fromDate(new Date(data.fechaEntregaDeseada)),
        ...(data.instruccionesEspeciales && { instruccionesEspeciales: data.instruccionesEspeciales }),
      };

      await addSolicitud(solicitudData);

      toast({
        title: "Solicitud de Delivery Enviada",
        description: "Su solicitud de delivery ha sido registrada en Firestore.",
      });
      form.reset();
    } catch (error) {
      console.error("Error creating delivery request:", error);
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
          <h3 className="text-lg font-medium">Información de Recogida</h3>
          <FormField
            control={form.control}
            name="pickupAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dirección de Recogida</FormLabel>
                <FormControl>
                  <Controller
                    name="pickupAddress"
                    control={form.control}
                    render={({ field: controllerField }) => (
                      <AddressAutocompleteInput
                        value={controllerField.value}
                        onChange={controllerField.onChange}
                        placeholder="Ingrese dirección de recogida"
                      />
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="contactNamePickup"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre Contacto (Recogida)</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Carlos Ruiz" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactPhonePickup"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono Contacto (Recogida)</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="Ej: 3001234567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Información de Entrega</h3>
          <FormField
            control={form.control}
            name="deliveryAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dirección de Entrega</FormLabel>
                <FormControl>
                   <Controller
                    name="deliveryAddress"
                    control={form.control}
                    render={({ field: controllerField }) => (
                      <AddressAutocompleteInput
                        value={controllerField.value}
                        onChange={controllerField.onChange}
                        placeholder="Ingrese dirección de entrega"
                      />
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="contactNameDelivery"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre Contacto (Entrega)</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Laura Vargas" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactPhoneDelivery"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono Contacto (Entrega)</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="Ej: 3109876543" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Detalles del Paquete e Instrucciones</h3>
          <FormField
            control={form.control}
            name="packageDetails"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción del Paquete</FormLabel>
                <FormControl>
                  <Textarea placeholder="Ej: Caja mediana (10kg), flores, comida preparada" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="instruccionesEspeciales"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instrucciones Especiales (Opcional)</FormLabel>
                <FormControl>
                  <Textarea placeholder="Ej: Entregar en portería, llamar antes de llegar." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="fechaEntregaDeseada"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha y Hora de Entrega Deseada</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
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
