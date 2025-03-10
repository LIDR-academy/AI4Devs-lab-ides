import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import Icon from '../common/Icon';

export interface CandidateCardProps {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position?: string;
  education?: string[];
  skills?: string[];
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

const CandidateCard: React.FC<CandidateCardProps> = ({
  id,
  firstName,
  lastName,
  email,
  phone,
  position,
  education,
  skills,
  onView,
  onEdit,
  onDelete,
  className = '',
}) => {
  const fullName = `${firstName} ${lastName}`;
  
  // Generar iniciales para el avatar
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  
  // Generar un color de fondo aleatorio pero consistente para el avatar
  const getAvatarColor = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 60%)`;
  };
  
  const avatarColor = getAvatarColor(fullName);
  
  // Manejar acciones
  const handleView = () => {
    if (onView) onView(id);
  };
  
  const handleEdit = () => {
    if (onEdit) onEdit(id);
  };
  
  const handleDelete = () => {
    if (onDelete && window.confirm(`¿Estás seguro de que deseas eliminar a ${fullName}?`)) {
      onDelete(id);
    }
  };
  
  return (
    <Card 
      className={className}
      hoverable
      shadow="sm"
      bodyClassName="p-0"
    >
      <div className="flex items-center p-4 border-b border-gray-200">
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg"
          style={{ backgroundColor: avatarColor }}
        >
          {initials}
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-gray-900">{fullName}</h3>
          {position && (
            <p className="text-sm text-gray-600">{position}</p>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <div className="mb-2">
          <span className="text-sm font-medium text-gray-700">Email:</span>
          <span className="text-sm text-gray-900 ml-2">{email}</span>
        </div>
        
        {phone && (
          <div className="mb-2">
            <span className="text-sm font-medium text-gray-700">Teléfono:</span>
            <span className="text-sm text-gray-900 ml-2">{phone}</span>
          </div>
        )}
        
        {education && education.length > 0 && (
          <div className="mb-2">
            <span className="text-sm font-medium text-gray-700">Educación:</span>
            <span className="text-sm text-gray-900 ml-2">
              {education[0]}{education.length > 1 ? ` (+${education.length - 1} más)` : ''}
            </span>
          </div>
        )}
        
        {skills && skills.length > 0 && (
          <div className="mt-3">
            <div className="text-sm font-medium text-gray-700 mb-2">Habilidades:</div>
            <div className="flex flex-wrap gap-1">
              {skills.slice(0, 5).map((skill, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-light bg-opacity-20 text-primary"
                >
                  {skill}
                </span>
              ))}
              {skills.length > 5 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                  +{skills.length - 5} más
                </span>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-gray-200 flex justify-end space-x-2">
        {onView && (
          <Button
            variant="tertiary"
            size="sm"
            onClick={handleView}
            icon={<Icon name="view" size="sm" />}
          >
            Ver
          </Button>
        )}
        
        {onEdit && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleEdit}
            icon={<Icon name="edit" size="sm" />}
          >
            Editar
          </Button>
        )}
        
        {onDelete && (
          <Button
            variant="danger"
            size="sm"
            onClick={handleDelete}
            icon={<Icon name="delete" size="sm" />}
          >
            Eliminar
          </Button>
        )}
      </div>
    </Card>
  );
};

export default CandidateCard; 