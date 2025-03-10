import React from 'react';

export type IconName = 
  // Acciones comunes
  | 'add'
  | 'edit'
  | 'delete'
  | 'view'
  | 'search'
  | 'filter'
  | 'sort'
  | 'download'
  | 'upload'
  | 'close'
  // Estados
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  // Navegación
  | 'chevron-up'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'arrow-left'
  | 'arrow-right'
  // Otros
  | 'user'
  | 'calendar'
  | 'clock'
  | 'location'
  | 'mail'
  | 'phone'
  | 'document';

export interface IconProps {
  name: IconName;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  className?: string;
  ariaHidden?: boolean;
  title?: string; // Título para el SVG (accesibilidad)
}

// Mapeo de nombres de iconos a descripciones accesibles
const iconDescriptions: Record<IconName, string> = {
  // Acciones comunes
  'add': 'Añadir',
  'edit': 'Editar',
  'delete': 'Eliminar',
  'view': 'Ver detalles',
  'search': 'Buscar',
  'filter': 'Filtrar',
  'sort': 'Ordenar',
  'download': 'Descargar',
  'upload': 'Subir',
  'close': 'Cerrar',
  // Estados
  'success': 'Éxito',
  'error': 'Error',
  'warning': 'Advertencia',
  'info': 'Información',
  // Navegación
  'chevron-up': 'Flecha hacia arriba',
  'chevron-down': 'Flecha hacia abajo',
  'chevron-left': 'Flecha hacia la izquierda',
  'chevron-right': 'Flecha hacia la derecha',
  'arrow-left': 'Flecha hacia la izquierda',
  'arrow-right': 'Flecha hacia la derecha',
  // Otros
  'user': 'Usuario',
  'calendar': 'Calendario',
  'clock': 'Reloj',
  'location': 'Ubicación',
  'mail': 'Correo electrónico',
  'phone': 'Teléfono',
  'document': 'Documento'
};

const Icon: React.FC<IconProps> = ({
  name,
  size = 'md',
  color,
  className = '',
  ariaHidden = true,
  title,
}) => {
  // Mapeo de tamaños a clases
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
  };
  
  // Clases base
  const baseClasses = `inline-block ${sizeClasses[size]}`;
  
  // Clases adicionales
  const classes = `${baseClasses} ${color ? `text-${color}` : ''} ${className}`;
  
  // Estilos inline para color
  const styles = color ? { color } : {};
  
  // Determinar si el icono debe tener un título para accesibilidad
  const shouldHaveTitle = !ariaHidden && (title || iconDescriptions[name]);
  const titleId = shouldHaveTitle ? `icon-${name}-${Math.random().toString(36).substr(2, 9)}` : undefined;
  
  // Renderizar el icono según el nombre
  const renderIcon = () => {
    // Propiedades comunes para todos los SVG
    const svgProps = {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 20 20",
      fill: "currentColor",
      className: classes,
      style: styles,
      'aria-hidden': ariaHidden,
      ...(shouldHaveTitle && {
        'aria-labelledby': titleId,
        role: 'img'
      })
    };
    
    switch (name) {
      // Acciones comunes
      case 'add':
        return (
          <svg {...svgProps}>
            {shouldHaveTitle && <title id={titleId}>{title || iconDescriptions[name]}</title>}
            <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'edit':
        return (
          <svg {...svgProps}>
            {shouldHaveTitle && <title id={titleId}>{title || iconDescriptions[name]}</title>}
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        );
      case 'delete':
        return (
          <svg {...svgProps}>
            {shouldHaveTitle && <title id={titleId}>{title || iconDescriptions[name]}</title>}
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'view':
        return (
          <svg {...svgProps}>
            {shouldHaveTitle && <title id={titleId}>{title || iconDescriptions[name]}</title>}
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
          </svg>
        );
      case 'search':
        return (
          <svg {...svgProps}>
            {shouldHaveTitle && <title id={titleId}>{title || iconDescriptions[name]}</title>}
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        );
      case 'filter':
        return (
          <svg {...svgProps}>
            {shouldHaveTitle && <title id={titleId}>{title || iconDescriptions[name]}</title>}
            <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
          </svg>
        );
      case 'sort':
        return (
          <svg {...svgProps}>
            {shouldHaveTitle && <title id={titleId}>{title || iconDescriptions[name]}</title>}
            <path d="M5 4a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1V5a1 1 0 00-1-1H5zm2 3a1 1 0 000 2h6a1 1 0 100-2H7zm0 4a1 1 0 000 2h6a1 1 0 100-2H7z" />
          </svg>
        );
      case 'download':
        return (
          <svg {...svgProps}>
            {shouldHaveTitle && <title id={titleId}>{title || iconDescriptions[name]}</title>}
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        );
      case 'upload':
        return (
          <svg {...svgProps}>
            {shouldHaveTitle && <title id={titleId}>{title || iconDescriptions[name]}</title>}
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        );
      case 'close':
        return (
          <svg {...svgProps}>
            {shouldHaveTitle && <title id={titleId}>{title || iconDescriptions[name]}</title>}
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        );
      
      // Estados
      case 'success':
        return (
          <svg {...svgProps}>
            {shouldHaveTitle && <title id={titleId}>{title || iconDescriptions[name]}</title>}
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'error':
        return (
          <svg {...svgProps}>
            {shouldHaveTitle && <title id={titleId}>{title || iconDescriptions[name]}</title>}
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      case 'warning':
        return (
          <svg {...svgProps}>
            {shouldHaveTitle && <title id={titleId}>{title || iconDescriptions[name]}</title>}
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'info':
        return (
          <svg {...svgProps}>
            {shouldHaveTitle && <title id={titleId}>{title || iconDescriptions[name]}</title>}
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
      
      // Navegación
      case 'chevron-up':
        return (
          <svg {...svgProps}>
            {shouldHaveTitle && <title id={titleId}>{title || iconDescriptions[name]}</title>}
            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        );
      case 'chevron-down':
        return (
          <svg {...svgProps}>
            {shouldHaveTitle && <title id={titleId}>{title || iconDescriptions[name]}</title>}
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        );
      case 'chevron-left':
        return (
          <svg {...svgProps}>
            {shouldHaveTitle && <title id={titleId}>{title || iconDescriptions[name]}</title>}
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
      case 'chevron-right':
        return (
          <svg {...svgProps}>
            {shouldHaveTitle && <title id={titleId}>{title || iconDescriptions[name]}</title>}
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        );
      case 'arrow-left':
        return (
          <svg {...svgProps}>
            {shouldHaveTitle && <title id={titleId}>{title || iconDescriptions[name]}</title>}
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        );
      case 'arrow-right':
        return (
          <svg {...svgProps}>
            {shouldHaveTitle && <title id={titleId}>{title || iconDescriptions[name]}</title>}
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        );
      
      // Otros
      case 'user':
        return (
          <svg {...svgProps}>
            {shouldHaveTitle && <title id={titleId}>{title || iconDescriptions[name]}</title>}
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        );
      case 'calendar':
        return (
          <svg {...svgProps}>
            {shouldHaveTitle && <title id={titleId}>{title || iconDescriptions[name]}</title>}
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
        );
      case 'clock':
        return (
          <svg {...svgProps}>
            {shouldHaveTitle && <title id={titleId}>{title || iconDescriptions[name]}</title>}
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        );
      case 'location':
        return (
          <svg {...svgProps}>
            {shouldHaveTitle && <title id={titleId}>{title || iconDescriptions[name]}</title>}
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
        );
      case 'mail':
        return (
          <svg {...svgProps}>
            {shouldHaveTitle && <title id={titleId}>{title || iconDescriptions[name]}</title>}
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
        );
      case 'phone':
        return (
          <svg {...svgProps}>
            {shouldHaveTitle && <title id={titleId}>{title || iconDescriptions[name]}</title>}
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
        );
      case 'document':
        return (
          <svg {...svgProps}>
            {shouldHaveTitle && <title id={titleId}>{title || iconDescriptions[name]}</title>}
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };
  
  return renderIcon();
};

export default Icon; 