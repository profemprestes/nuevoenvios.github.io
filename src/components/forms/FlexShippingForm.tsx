"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, useFieldArray } from "react-hook-form";
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
import { PlusCircle, Trash2 } from "lucide-react";

const deliveryPointSchema = z.object({
  address: z.string().min(10, "La dirección es requerida."),
  contactName: z.string().min(2, "El nombre de contacto es requerido.").optional(),
  contactPhone: z.string().min(7, "El teléfono de contacto es requerido.").optional(),
});

const flexShippingFormSchema = z.object({
  originAddress: z.string().min(10, "La dirección de origen es requerida."),
  deliveryPoints: z.array(deliveryPointSchema).min(1, "Se requiere al menos un punto de entrega."),
  shippingPreferences: z.string().optional(),
});

type FlexShippingFormValues = z.infer<typeof flexShippingFormSchema>;

export default function FlexShippingForm() {
  const { toast } = useToast();
  const form = useForm<FlexShippingFormValues>({
    resolver: zodResolver(flexShippingFormSchema),
    defaultValues: {
      originAddress: "",
      deliveryPoints: [{ address: "" , contactName: "", contactPhone: ""}],
      shippingPreferences: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "deliveryPoints",
  });

  function onSubmit(data: FlexShippingFormValues) {
    console.log(data);
    toast({
      title: "Envío Flex Configurado",
      description: "Su configuración de envío flexible ha sido guardada.",
    });
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
              onClick={() => append({ address: "", contactName: "", contactPhone: "" })}
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
          <h3 className="text-lg font-medium">Preferencias de Envío</h3>
          <FormField
            control={form.control}
            name="shippingPreferences"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notas o Preferencias Adicionales (Opcional)</FormLabel>
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
        </div>

        <Button type="submit" className="w-full bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] hover:bg-[hsl(var(--accent)/0.9)]" size="lg">
          Cotizá tu envío Flex
        </Button>
      </form>
    </Form>
  );
}

