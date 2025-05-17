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

const deliveryFormSchema = z.object({
  pickupAddress: z.string().min(10, "La dirección de recogida es requerida."),
  deliveryAddress: z.string().min(10, "La dirección de entrega es requerida."),
  contactNamePickup: z.string().min(2, "El nombre de contacto en recogida es requerido."),
  contactPhonePickup: z.string().min(7, "El teléfono de contacto en recogida es requerido."),
  contactNameDelivery: z.string().min(2, "El nombre de contacto en entrega es requerido."),
  contactPhoneDelivery: z.string().min(7, "El teléfono de contacto en entrega es requerido."),
  packageDetails: z.string().min(5, "Los detalles del paquete son requeridos."),
});

type DeliveryFormValues = z.infer<typeof deliveryFormSchema>;

export default function DeliveryForm() {
  const { toast } = useToast();
  const form = useForm<DeliveryFormValues>({
    resolver: zodResolver(deliveryFormSchema),
    defaultValues: {
      pickupAddress: "",
      deliveryAddress: "",
      contactNamePickup: "",
      contactPhonePickup: "",
      contactNameDelivery: "",
      contactPhoneDelivery: "",
      packageDetails: "",
    },
  });

  function onSubmit(data: DeliveryFormValues) {
    console.log(data);
    toast({
      title: "Solicitud de Delivery Enviada",
      description: "Su solicitud de delivery ha sido registrada.",
    });
    form.reset();
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
          <h3 className="text-lg font-medium">Detalles del Paquete</h3>
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
        </div>

        <Button type="submit" className="w-full bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] hover:bg-[hsl(var(--accent)/0.9)]" size="lg">
          Cotizá tu envío
        </Button>
      </form>
    </Form>
  );
}
