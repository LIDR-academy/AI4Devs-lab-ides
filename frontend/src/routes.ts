export const ROUTES = {
  HOME: '/',
  ADD_CANDIDATE: '/candidates/new',
  EDIT_CANDIDATE: '/candidates/edit/:id',
  VIEW_CANDIDATE: '/candidates/:id',
  CANDIDATE_SUMMARY: '/candidates/:id/summary',
} as const;

export const getRoute = (route: keyof typeof ROUTES, params?: Record<string, string | number>): string => {
  let path: string = ROUTES[route];
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      path = path.replace(`:${key}`, String(value));
    });
  }
  return path;
}; 