# ATS Frontend

Applicazione frontend per il sistema di tracciamento dei candidati (ATS).

## Miglioramenti recenti

### 1. Sistema di gestione degli errori centralizzato

Abbiamo implementato un sistema di gestione degli errori centralizzato con le seguenti caratteristiche:

- **Classe AppError**: Una classe dedicata che estende l'oggetto Error nativo per gestire gli errori in modo standardizzato.
- **Categorizzazione degli errori**: Gli errori sono categorizzati (rete, validazione, autorizzazione, server, ecc.) per facilitare la gestione specifica.
- **Toast notifications avanzate**: Sistema di notifiche migliorato con supporto per titoli, icone, e pulsanti d'azione.
- **Meccanismo di retry**: Possibilità di riprovare automaticamente le operazioni fallite per errori di rete.
- **Gestione consistente**: Approccio uniforme alla gestione degli errori in tutta l'applicazione.

### 2. Standardizzazione TypeScript

Abbiamo convertito parti chiave dell'applicazione da JavaScript a TypeScript per migliorare:

- **Type safety**: Verifica dei tipi in fase di compilazione.
- **Documentazione integrata**: Le interfacce e i tipi servono come documentazione del codice.
- **Migliore supporto IDE**: Autocompletamento e suggerimenti più accurati.
- **Refactoring più sicuro**: Il compiler di TypeScript rileva gli errori durante il refactoring.

I file convertiti includono:

- `src/components/ui/toast.tsx`: Componente Toast con tipi completi.
- `src/utils/errorHandler.ts`: Sistema di gestione degli errori con enum e interfacce complete.
- `src/contexts/ToastContext.tsx`: Context API per le notifiche toast.
- `src/services/api.ts`: Service layer per le chiamate API con interfacce per i dati.
- `src/components/candidate/CandidateForm.tsx`: Form per la creazione/modifica dei candidati.
- `src/components/layout/Header.tsx`: Componente header con barra di ricerca e filtri.
- `src/components/layout/Layout.tsx`: Componente layout principale dell'applicazione.
- `src/components/shared/StatusIcon.tsx`: Componenti per visualizzare lo stato dei candidati.
- `src/contexts/SearchContext.tsx`: Context API per la funzionalità di ricerca.
- `src/types/globals.d.ts`: Dichiarazioni di tipo globali per moduli esterni.

### 3. Gestione avanzata delle connessioni

Abbiamo implementato un sistema di gestione delle connessioni con le seguenti caratteristiche:

- **Connection pooling**: Limitazione del numero di connessioni simultanee per evitare sovraccarichi.
- **Coda di richieste**: Le richieste in eccesso vengono messe in coda e processate quando si liberano connessioni.
- **Retry automatici**: Implementazione di un meccanismo di retry con backoff esponenziale e jitter.
- **Gestione differenziata degli errori**: Diversi tipi di errori vengono gestiti in modo specifico.
- **Logging dettagliato**: Miglioramento del logging per facilitare il debug.

### 4. Miglioramenti UX nel form candidati

- **Semplificazione del form**: Rimosso il campo status nella creazione di nuovi candidati (sempre PENDING).
- **Validazione migliorata**: Validazione più robusta dei dati inseriti.
- **Feedback dettagliato**: Messaggi di errore più specifici e informativi.
- **Gestione errori API**: Miglioramento della gestione degli errori nelle chiamate API.

### 5. Strumenti di sviluppo

- **Script di pulizia porte**: Aggiunto script `cleanup-ports.sh` per risolvere il problema "address already in use".
- **Configurazione centralizzata**: Implementato un sistema di configurazione centralizzato per l'applicazione.
- **Inizializzazione applicazione**: Aggiunto un sistema di inizializzazione che configura l'applicazione all'avvio.

## Caratteristiche dell'applicazione

- Visualizzazione e gestione dei candidati
- Formulario di creazione e modifica candidati
- Sistema di valutazione dei candidati
- Dashboard con statistiche
- Notifiche toast per feedback all'utente
- Gestione errori robusta

## Tecnologie utilizzate

- React
- TypeScript
- Material UI
- TailwindCSS
- React Router
- Context API per la gestione dello stato

## Sviluppo

### Prerequisiti

- Node.js 14+ e npm/yarn

### Installazione

```bash
npm install
# o
yarn
```

### Avvio in modalità development

```bash
npm start
# o
yarn start
```

### Build per produzione

```bash
npm run build
# o
yarn build
```

## Best practices implementate

1. **Error Handling**: Gestione centralizzata degli errori e feedback all'utente.
2. **TypeScript**: Type safety e documentazione integrata.
3. **Component Structure**: Componenti riutilizzabili e ben strutturati.
4. **Contexty API**: Gestione dello stato applicativo con Context API.
5. **Form Validation**: Validazione avanzata dei form lato client.
6. **Responsive Design**: Layout responsive con Tailwind e Material UI.
7. **Feedback UX**: Sistema di notifiche avanzato per migliorare l'esperienza utente.

## Estructura del Proyecto

```
frontend/src/
├── components/         # Componentes reutilizables
│   ├── candidate/      # Componentes específicos para candidatos
│   ├── dashboard/      # Componentes del dashboard
│   ├── layout/         # Componentes de estructura
│   ├── shared/         # Componentes compartidos
│   └── ui/             # Componentes de UI genéricos
│
├── contexts/           # Contextos de React (SearchContext)
│
├── hooks/              # Hooks personalizados (useCandidates, useToast, etc.)
│
├── pages/              # Páginas de la aplicación
│   └── Dashboard/      # Página del dashboard (incluye estadísticas y lista de candidatos)
│
├── services/           # Servicios para API y lógica de negocio
│
├── styles/             # Estilos globales
│
├── types/              # Definiciones de TypeScript
│
├── utils/              # Utilidades y funciones helpers
│
├── App.tsx             # Componente principal
└── index.tsx           # Punto de entrada
```

## Tecnologías Principales

- React: Framework de UI
- TypeScript: Tipado estático
- TailwindCSS: Estilos
- React Router: Enrutamiento
- Vite: Bundler y servidor de desarrollo

## Comandos Disponibles

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Previsualizar la compilación de producción
npm run preview

# Ejecutar linting
npm run lint
```

## Guía de Desarrollo

### Componentes

- Crear componentes en la carpeta correspondiente (ui, candidate, etc.)
- Usar TypeScript para todos los componentes nuevos
- Seguir el patrón de exportación utilizado en los componentes existentes

### Tipos

- Definir interfaces/tipos en `types/index.ts`
- Usar interfaces para props de componentes
- Usar tipos para uniones y enumeraciones

### Servicios

- Mantener la lógica de API en archivos de servicio
- Usar tipos para las respuestas de la API
- Manejar errores de manera consistente

### Estilos

- Usar TailwindCSS para estilos
- Definir clases personalizadas en `styles/`
- Mantener consistencia en el diseño

## Convenciones de Código

- Usar camelCase para nombres de variables y funciones
- Usar PascalCase para nombres de componentes y clases
- Usar UPPER_CASE para constantes
- Usar descriptive naming
- Prefijo "use" para hooks personalizados
- Prefijo "handle" para manejadores de eventos
