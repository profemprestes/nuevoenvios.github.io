import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import FlexShippingForm from "@/components/forms/FlexShippingForm";

export default function EnviosFlexPage() {
  return (
    <div className="container mx-auto max-w-3xl py-8">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Configurar Envío Flex</CardTitle>
          <CardDescription>
            Administre múltiples puntos de entrega y preferencias para sus envíos flexibles.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FlexShippingForm />
        </CardContent>
      </Card>
    </div>
  );
}
