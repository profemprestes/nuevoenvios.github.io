
# NuevoEnvios - Plataforma de Gestión de Envíos

Esta es una aplicación Next.js construida con Firebase Studio para la gestión de servicios de mensajería, delivery y envíos flexibles.

## Tecnologías Principales

*   **Framework:** Next.js (con App Router)
*   **Lenguaje:** TypeScript
*   **UI:** React, ShadCN UI Components
*   **Estilos:** Tailwind CSS
*   **Backend (Base de Datos):** Firebase Cloud Firestore
*   **Funcionalidades AI:** Genkit (para autocompletado de direcciones)

## Estructura de Directorios en `src/`

A continuación se describe la estructura principal de directorios y archivos dentro de la carpeta `src/`:

```
src/
├── ai/
│   ├── dev.ts                   # Punto de entrada para desarrollo de Genkit
│   ├── flows/
│   │   └── address-autocompletion.ts # Flujo Genkit para autocompletar direcciones
│   └── genkit.ts                # Configuración global de Genkit y modelos AI
├── app/
│   ├── delivery/
│   │   └── page.tsx             # Página para solicitudes de Delivery
│   ├── envios-flex/
│   │   └── page.tsx             # Página para solicitudes de Envíos Flex
│   ├── mensajeria/
│   │   └── page.tsx             # Página para solicitudes de Mensajería
│   ├── globals.css              # Estilos globales y variables de tema ShadCN/Tailwind
│   ├── layout.tsx               # Layout principal de la aplicación
│   └── page.tsx                 # Página de inicio (Dashboard)
├── components/
│   ├── forms/                   # Componentes de formulario reutilizables
│   │   ├── CourierForm.tsx      # Formulario para Mensajería
│   │   ├── DeliveryForm.tsx     # Formulario para Delivery
│   │   └── FlexShippingForm.tsx # Formulario para Envíos Flex
│   ├── layout/                  # Componentes estructurales del layout
│   │   ├── Footer.tsx           # Pie de página
│   │   ├── Header.tsx           # Encabezado principal
│   │   ├── MobileNav.tsx        # Menú de navegación para móviles
│   │   └── SidebarNav.tsx       # Barra de navegación lateral para desktop/tablet
│   ├── shared/                  # Componentes compartidos entre varias partes de la app
│   │   └── AddressAutocompleteInput.tsx # Input con autocompletado de direcciones
│   └── ui/                      # Componentes de UI de ShadCN (botones, cards, etc.)
│       ├── accordion.tsx
│       ├── alert-dialog.tsx
│       ├── alert.tsx
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── calendar.tsx
│       ├── card.tsx
│       ├── chart.tsx
│       ├── checkbox.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.tsx
│       ├── form.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── menubar.tsx
│       ├── popover.tsx
│       ├── progress.tsx
│       ├── radio-group.tsx
│       ├── scroll-area.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── sheet.tsx
│       ├── sidebar.tsx
│       ├── skeleton.tsx
│       ├── slider.tsx
│       ├── switch.tsx
│       ├── table.tsx
│       ├── tabs.tsx
│       ├── textarea.tsx
│       ├── toast.tsx
│       ├── toaster.tsx
│       ├── tooltip.tsx
│       └── visually-hidden.tsx
├── config/
│   └── nav.ts                   # Configuración de los ítems de navegación
├── data/
│   └── seed-data.json           # Datos de ejemplo para poblar Firestore
├── hooks/                       # Hooks personalizados de React
│   ├── use-mobile.tsx           # Hook para detectar si se está en un dispositivo móvil
│   ├── use-mounted.tsx          # Hook para detectar si el componente está montado (cliente)
│   └── use-toast.ts             # Hook para gestionar notificaciones (toasts)
├── lib/                         # Utilidades y configuraciones
│   ├── firebase.ts              # Configuración e inicialización de Firebase SDK
│   └── utils.ts                 # Funciones de utilidad (ej. cn para clases)
├── services/
│   └── firestoreService.ts      # Lógica para interactuar con Firebase Cloud Firestore (CRUD)
└── types/
    └── requestTypes.ts          # Definiciones de tipos TypeScript para las solicitudes
```

## Funcionalidades CRUD por Página

La aplicación actualmente se enfoca en la creación de nuevas solicitudes a través de formularios dedicados. Las capacidades completas de Leer, Actualizar y Eliminar (CRUD) están disponibles en la capa de servicio (`firestoreService.ts`) pero aún no cuentan con interfaces de usuario dedicadas en todas las páginas.

*   **`src/app/page.tsx` (Dashboard / Inicio):**
    *   **Funcionalidad:** Página principal de bienvenida.
    *   **CRUD:** No realiza operaciones CRUD directas, pero sirve como punto de entrada para acceder a los formularios de creación de los diferentes tipos de solicitudes (Mensajería, Delivery, Envíos Flex).

*   **`src/app/mensajeria/page.tsx` (Solicitud de Mensajería):**
    *   **Funcionalidad:** Presenta el formulario (`CourierForm.tsx`) para que los usuarios ingresen y envíen nuevas solicitudes de mensajería.
    *   **CRUD:**
        *   **Crear (Create):** Permite a los usuarios completar los detalles de una nueva solicitud de mensajería (origen, destino, descripción del paquete, peso, dimensiones, fecha de recolección). Al enviar, se crea un nuevo documento en la colección `solicitudes` de Firestore con `tipo: "mensajeria"`.

*   **`src/app/delivery/page.tsx` (Solicitud de Delivery):**
    *   **Funcionalidad:** Presenta el formulario (`DeliveryForm.tsx`) para que los usuarios ingresen y envíen nuevas solicitudes de delivery.
    *   **CRUD:**
        *   **Crear (Create):** Permite a los usuarios completar los detalles para una nueva solicitud de delivery (dirección de origen y destino, información de contacto, detalles del paquete, fecha de entrega). Al enviar, se crea un nuevo documento en la colección `solicitudes` de Firestore con `tipo: "delivery"`.

*   **`src/app/envios-flex/page.tsx` (Configurar Envío Flex):**
    *   **Funcionalidad:** Presenta el formulario (`FlexShippingForm.tsx`) para que los usuarios configuren y envíen nuevas solicitudes de envíos flexibles, que pueden incluir múltiples puntos de entrega.
    *   **CRUD:**
        *   **Crear (Create):** Permite a los usuarios definir una dirección de origen, múltiples puntos de entrega (cada uno con su dirección y descripción del paquete), y preferencias de envío. Al enviar, se crea un nuevo documento en la colección `solicitudes` de Firestore con `tipo: "envio_flex"`.

### Capacidades CRUD Generales (Servicio Firestore)

El archivo `src/services/firestoreService.ts` encapsula la lógica para interactuar con Cloud Firestore y proporciona las siguientes funciones base para la colección `solicitudes`:

*   `addSolicitud`: Implementa la operación **Crear**.
*   `getSolicitud`: Implementa la operación **Leer** para un documento individual.
*   `getAllSolicitudes`: Implementa la operación **Leer** para obtener todos los documentos de la colección.
*   `updateSolicitud`: Implementa la operación **Actualizar**.
*   `deleteSolicitud`: Implementa la operación **Eliminar**.

Estas funciones de servicio están listas para ser utilizadas por futuros componentes de UI que implementen la visualización de listas de solicitudes, edición de detalles o eliminación de las mismas.

## Próximos Pasos (Sugerencias)

*   Implementar vistas para listar, detallar, editar y eliminar solicitudes.
*   Mejorar la selección de fechas en los formularios con componentes de calendario más interactivos.
*   Configurar reglas de seguridad robustas en Firebase Cloud Firestore.
*   Añadir autenticación de usuarios.
*   Expandir con más colecciones (ej. Usuarios, Estados de Envío).
```
