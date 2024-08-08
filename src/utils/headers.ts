import { AxiosInstance } from 'axios';

export const setCommonHeaders = (instance: AxiosInstance): void => {
  instance.defaults.headers.common['Content-Type'] = 'application/json';
  instance.defaults.headers.common['Accept'] = 'application/json';

  // Si tienes un token de autenticación, puedes agregarlo así:
  const token = localStorage.getItem('token');
  if (token) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // Otros encabezados comunes que quieras agregar
  instance.defaults.headers.common['Custom-Header'] = 'customValue';
};
