# Cambios de esta version

1. Los nombres de las variables de entorno vuelven a los del kit: `PORT`,
   `JWT_SECRET`, `DATABASE_URL` y `NODE_ENV`.
2. El seed no requiere variables adicionales: obtiene los dos digitos finales
   desde `PORT` e incluye en el codigo los datos del estudiante para crear su
   usuario de prueba.
3. `.env-example` y `docker-compose.yml` vuelven a las configuraciones del kit.

