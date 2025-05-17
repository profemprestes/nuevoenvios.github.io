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
    },
  });

  function onSubmit(data: CourierFormValues) {
    console.log(data);
    toast({
      title: "Solicitud Enviada",
      description: "Su solicitud de mensajería ha sido registrada.",
    });
    form.reset();
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
