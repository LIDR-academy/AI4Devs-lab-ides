import zxcvbn from 'zxcvbn';

interface PasswordValidationResult {
  isValid: boolean;
  message?: string;
  score?: number; // 0-4, donde 4 es la contraseña más fuerte
  feedback?: {
    warning?: string;
    suggestions?: string[];
  };
}

/**
 * Valida la seguridad de una contraseña utilizando zxcvbn
 * 
 * @param password La contraseña a validar
 * @param minScore Puntuación mínima requerida (0-4, donde 4 es la máxima seguridad)
 * @returns Objeto con el resultado de la validación
 */
export const validatePassword = (password: string, minScore = 2): PasswordValidationResult => {
  // Reglas básicas
  if (!password || password.length < 8) {
    return {
      isValid: false,
      message: 'La contraseña debe tener al menos 8 caracteres',
      score: 0
    };
  }

  // Verificar si contiene mayúsculas
  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: 'La contraseña debe contener al menos una letra mayúscula',
      score: 0
    };
  }

  // Verificar si contiene números
  if (!/\d/.test(password)) {
    return {
      isValid: false,
      message: 'La contraseña debe contener al menos un número',
      score: 0
    };
  }

  // Verificar si contiene caracteres especiales
  if (!/[^A-Za-z0-9]/.test(password)) {
    return {
      isValid: false,
      message: 'La contraseña debe contener al menos un carácter especial',
      score: 0
    };
  }

  // Usar zxcvbn para evaluar la fortaleza general
  const result = zxcvbn(password);
  
  // La puntuación va de 0 a 4, siendo 4 la más fuerte
  if (result.score < minScore) {
    const warning = result.feedback.warning || '';
    const suggestions = result.feedback.suggestions || [];
    
    return {
      isValid: false,
      message: `La contraseña es demasiado débil. ${warning}`,
      score: result.score,
      feedback: {
        warning,
        suggestions
      }
    };
  }

  return {
    isValid: true,
    score: result.score,
    feedback: result.feedback
  };
}; 