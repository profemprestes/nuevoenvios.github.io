
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Send, Truck, GitFork } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Sección de Bienvenida */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Bienvenido a NuevoEnvios</CardTitle>
          <CardDescription className="text-lg">
            Su plataforma integral para la gestión eficiente de mensajería y envíos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            Desde aquí puede acceder a todos nuestros servicios. Elija una opción a continuación o utilice la barra de navegación lateral para comenzar.
          </p>
        </CardContent>
      </Card>

      {/* Sección de Tarjetas de Servicio */}
      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle className="text-2xl font-semibold">Nuestros Servicios</CardTitle>
            <CardDescription>Seleccione el tipo de envío que desea gestionar.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <ServiceCard
                title="Mensajería"
                description="Envíe documentos y paquetes pequeños de forma rápida y segura."
                href="/mensajeria"
                icon={<Send className="h-8 w-8 text-primary" />}
                cta="Solicitar Mensajería"
                />
                <ServiceCard
                title="Delivery"
                description="Servicio de entrega puerta a puerta para sus productos y mercancías."
                href="/delivery"
                icon={<Truck className="h-8 w-8 text-primary" />}
                cta="Programar Delivery"
                />
                <ServiceCard
                title="Envíos Flex"
                description="Gestione múltiples puntos de entrega con nuestras opciones flexibles."
                href="/envios-flex"
                icon={<GitFork className="h-8 w-8 text-primary" />}
                cta="Configurar Envío Flex"
                />
            </div>
        </CardContent>
      </Card>

      {/* Sección de Ayuda (existente) */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>¿Necesita ayuda?</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Si tiene alguna pregunta o necesita asistencia, no dude en contactarnos. Estamos aquí para ayudarle a optimizar sus operaciones de envío.</p>
        </CardContent>
      </Card>
    </div>
  );
}

interface ServiceCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  cta: string;
}

function ServiceCard({ title, description, href, icon, cta }: ServiceCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-xl">
      <CardHeader className="flex flex-row items-start gap-4 p-4">
        <div className="rounded-lg bg-primary/10 p-3">
           {icon}
        </div>
        <div>
          <CardTitle className="text-xl">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4 pt-0">
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
      <div className="p-4 pt-0">
        <Link href={href} passHref>
          <Button className="w-full bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] hover:bg-[hsl(var(--accent)/0.9)]">
            {cta}
          </Button>
        </Link>
      </div>
    </Card>
  );
}
