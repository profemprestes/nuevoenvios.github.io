import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DeliveryForm from "@/components/forms/DeliveryForm";

export default function DeliveryPage() {
  return (
    <div className="container mx-auto max-w-3xl py-8">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Solicitud de Delivery</CardTitle>
          <CardDescription>
            Especifique las ubicaciones de recogida y entrega para su delivery.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DeliveryForm />
        </CardContent>
      </Card>
    </div>
  );
}
