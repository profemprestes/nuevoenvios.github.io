import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CourierForm from "@/components/forms/CourierForm";

export default function MensajeriaPage() {
  return (
    <div className="container mx-auto max-w-3xl py-8">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Solicitud de Mensajería</CardTitle>
          <CardDescription>
            Complete el formulario para solicitar un nuevo servicio de mensajería.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CourierForm />
        </CardContent>
      </Card>
    </div>
  );
}
