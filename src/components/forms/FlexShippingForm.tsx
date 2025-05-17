
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import AddressAutocompleteInput from "@/components/shared/AddressAutocompleteInput";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Trash2 } from "lucide-react";
import { addSolicitud, updateSolicitud } from "@/services/firestoreService";
import type { EnvioFlexRequestData, PuntoEntrega, SolicitudEstado } from "@/types/requestTypes";
import { SolicitudStatus } from "@/types/requestTypes";
import React, { useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const deliveryPointSchema = z.object({
  address: z.string().min(10, "La dirección es requerida."),
  descripcionPaquete: z.string().min(5, "La descripción del paquete es requerida."),
  contactName: z.string().min(2, "El nombre de contacto es requerido.").optional(),
  contactPhone: z.string().min(7, "El teléfono de contacto es requerido.").optional(),
});

const flexShippingFormSchema = z.object({
  originAddress: z.string().min(10, "La dirección de origen es requerida."),
  deliveryPoints: z.array(deliveryPointSchema).min(1, "Se requiere al menos un punto de entrega."),
  shippingPreferences: z.string().optional(),
  requiereConfirmacionEntrega: z.boolean().optional(),
  estado: z.nativeEnum(SolicitudStatus).optional(),
});

export type FlexShippingFormValues = z.infer<typeof flexShippingFormSchema>;

interface FlexShippingFormProps {
  initialData?: EnvioFlexRequestData & { id: string };
  onSaveSuccess: () => void;
}

export default function FlexShippingForm({ initialData, onSaveSuccess }: FlexShippingFormProps) {
  const { toast } = useToast();
  const form = useForm<FlexShippingFormValues>({
    resolver: zodResolver(flexShippingFormSchema),
    defaultValues: {
      originAddress: "",
      deliveryPoints: [{ address: "", descripcionPaquete: "", contactName: "", contactPhone: ""}],
      shippingPreferences: "",
      requiereConfirmacionEntrega: false,
      estado: SolicitudStatus.PENDIENTE,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "deliveryPoints",
  });

  const mode = initialData ? 'edit' : 'create';

  useEffect(() => {
    if (initialData) {
      form.reset({
        originAddress: initialData.originAddress,
        deliveryPoints: initialData.puntosEntrega.map(p => ({
          address: p.direccion,
          descripcionPaquete: p.descripcionPaquete,
          contactName: p.contactName || "",
          contactPhone: p.contactPhone || "",
        })),
        shippingPreferences: initialData.ventanaHorariaPreferida || "",
        requiereConfirmacionEntrega: initialData.requiereConfirmacionEntrega || false,
        estado: initialData.estado || SolicitudStatus.PENDIENTE,
      });
    } else {
        form.reset({
            originAddress: "",
            deliveryPoints: [{ address: "", descripcionPaquete: "", contactName: "", contactPhone: ""}],
            shippingPreferences: "",
            requiereConfirmacionEntrega: false,
            estado: SolicitudStatus.PENDIENTE,
        });
    }
  }, [initialData, form]);

  async function onSubmit(data: FlexShippingFormValues) {
    try {
      const puntosEntrega: PuntoEntrega[] = data.deliveryPoints.map(dp => ({
        direccion: dp.address,
        descripcionPaquete: dp.descripcionPaquete,
        ...(dp.contactName && { contactName: dp.contactName }),
        ...(dp.contactPhone && { contactPhone: dp.contactPhone }),
      }));

      const commonData = {
        originAddress: data.originAddress,
        puntosEntrega: puntosEntrega,
        estado: data.estado || SolicitudStatus.PENDIENTE,
        ...(data.shippingPreferences && { ventanaHorariaPreferida: data.shippingPreferences }),
        ...(data.requiereConfirmacionEntrega && { requiereConfirmacionEntrega: data.requiereConfirmacionEntrega }),
      };

      if (mode === 'edit' && initialData?.id) {
        await updateSolicitud(initialData.id, {
            tipo: "envio_flex",
            ...commonData,
        });
        toast({
          title: "Envío Flex Actualizado",
          description: "La configuración de envío flexible ha sido actualizada.",
        });
      } else {
        const solicitudToCreate: Omit<EnvioFlexRequestData, "id" | "fechaCreacion"> = {
            tipo: "envio_flex",
            ...commonData,
        };
        await addSolicitud(solicitudToCreate);
        toast({
          title: "Envío Flex Configurado",
          description: "Su configuración de envío flexible ha sido guardada.",
        });
      }
      onSaveSuccess();
      if (mode === 'create') form.reset();
    } catch (error) {
      console.error(`Error ${mode === 'edit' ? 'updating' : 'creating'} flex shipping request:`, error);
      toast({
        title: "Error",
        description: `No se pudo ${mode === 'edit' ? 'actualizar' : 'guardar'} la configuración. Intente nuevamente.`,
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Información de Origen</h3>
          <FormField
            control={form.control}
            name="originAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dirección de Origen</FormLabel>
                <FormControl>
                  <Controller
                    name="originAddress"
                    control={form.control}
                    render={({ field: controllerField }) => (
                      <AddressAutocompleteInput
                        value={controllerField.value}
                        onChange={controllerField.onChange}
                        placeholder="Ingrese dirección de origen"
                      />
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Puntos de Entrega</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ address: "", descripcionPaquete: "", contactName: "", contactPhone: "" })}
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Añadir Punto
            </Button>
          </div>
          {fields.map((item, index) => (
            <Card key={item.id} className="p-4 space-y-4 bg-muted/30">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Punto de Entrega #{index + 1}</h4>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <FormField
                control={form.control}
                name={`deliveryPoints.${index}.address`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dirección</FormLabel>
                    <FormControl>
                       <Controller
                        name={`deliveryPoints.${index}.address`}
                        control={form.control}
                        render={({ field: controllerField }) => (
                          <AddressAutocompleteInput
                            value={controllerField.value}
                            onChange={controllerField.onChange}
                            placeholder={`Dirección del punto #${index + 1}`}
                          />
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`deliveryPoints.${index}.descripcionPaquete`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción del Paquete</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Ej: Documentos, caja pequeña" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`deliveryPoints.${index}.contactName`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre Contacto (Opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre de contacto" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`deliveryPoints.${index}.contactPhone`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono Contacto (Opcional)</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="Teléfono de contacto" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>
          ))}
           {form.formState.errors.deliveryPoints && !form.formState.errors.deliveryPoints.root && (
            <p className="text-sm font-medium text-destructive">
              {form.formState.errors.deliveryPoints.message}
            </p>
          )}
          {form.formState.errors.deliveryPoints?.root && (
             <p className="text-sm font-medium text-destructive">
              {form.formState.errors.deliveryPoints.root.message}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Preferencias Adicionales</h3>
          <FormField
            control={form.control}
            name="shippingPreferences"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ventana Horaria / Notas (Opcional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ej: Entregar entre 9 AM y 5 PM, evitar horas pico, contactar antes de llegar."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="requiereConfirmacionEntrega"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    ¿Requiere confirmación de entrega?
                  </FormLabel>
                  <FormDescription>
                    Marque si necesita una confirmación una vez se complete la entrega.
                  </FormDescription>
                </div>
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
          {mode === 'edit' ? 'Actualizar Envío Flex' : 'Cotizá tu envío Flex'}
        </Button>
      </form>
    </Form>
  );
}
