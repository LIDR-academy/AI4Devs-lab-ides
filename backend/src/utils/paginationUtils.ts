import { PaginationParams } from '../middlewares/paginationMiddleware';

/**
 * Interfaz para la información de paginación en la respuesta
 */
export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

/**
 * Interfaz para la respuesta paginada
 */
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationInfo;
}

/**
 * Genera una respuesta paginada
 * @param data Datos a paginar
 * @param total Total de elementos
 * @param pagination Parámetros de paginación
 * @returns Respuesta paginada
 */
export const createPaginatedResponse = <T>(
  data: T[],
  total: number,
  pagination: PaginationParams
): PaginatedResponse<T> => {
  const { page, limit } = pagination;
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    success: true,
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage,
      hasPrevPage,
      nextPage: hasNextPage ? page + 1 : null,
      prevPage: hasPrevPage ? page - 1 : null,
    },
  };
};

/**
 * Genera enlaces de paginación para la cabecera Link
 * @param baseUrl URL base para los enlaces
 * @param pagination Información de paginación
 * @returns Cabecera Link con enlaces de paginación
 */
export const generatePaginationLinks = (
  baseUrl: string,
  pagination: PaginationInfo
): string => {
  const { page, limit, totalPages, hasNextPage, hasPrevPage } = pagination;
  const links: string[] = [];

  // Enlace a la primera página
  links.push(`<${baseUrl}?page=1&limit=${limit}>; rel="first"`);

  // Enlace a la última página
  links.push(`<${baseUrl}?page=${totalPages}&limit=${limit}>; rel="last"`);

  // Enlace a la página siguiente
  if (hasNextPage) {
    links.push(`<${baseUrl}?page=${page + 1}&limit=${limit}>; rel="next"`);
  }

  // Enlace a la página anterior
  if (hasPrevPage) {
    links.push(`<${baseUrl}?page=${page - 1}&limit=${limit}>; rel="prev"`);
  }

  return links.join(', ');
}; 