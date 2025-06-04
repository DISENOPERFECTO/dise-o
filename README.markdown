# Diseño Perfecto

Una aplicación web para personalizar productos con diferentes técnicas, gestionar pedidos y configuraciones.

## Prerrequisitos

Antes de desplegar la aplicación, asegúrate de tener lo siguiente configurado:

1. **MongoDB Atlas**:
   - Crea un clúster en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
   - Obtén la URI de conexión (por ejemplo, `mongodb+srv://<usuario>:<contraseña>@cluster0.mongodb.net/diseño_perfecto?retryWrites=true&w=majority`).

2. **AWS S3**:
   - Crea un bucket en [AWS S3](https://aws.amazon.com/s3/).
   - Obtén las credenciales de acceso (Access Key ID y Secret Access Key).

3. **Servicio de Correo**:
   - Configura un servicio de correo como Gmail o SendGrid para las notificaciones.

## Despliegue en Vercel

1. **Subir el Proyecto a GitHub**:
   - Inicializa un repositorio Git:
     ```bash
     git init
     git add .
     git commit -m "Initial commit"
     git branch -M main
     git remote add origin https://github.com/TU_USUARIO/diseno-perfecto.git
     git push -u origin main
     ```

2. **Configurar Variables de Entorno en Vercel**:
   - Ve a [Vercel](https://vercel.com) y crea un nuevo proyecto.
   - Conecta tu repositorio de GitHub.
   - En "Settings" > "Environment Variables", añade:
     - `MONGODB_URI`: Tu URI de MongoDB Atlas.
     - `NEXTAUTH_URL`: La URL de tu aplicación (por ejemplo, `https://diseno-perfecto.vercel.app`).
     - `NEXTAUTH_SECRET`: Un secreto aleatorio.
     - `ADMIN_EMAIL`: `admin@disenoperfecto.com`.
     - `ADMIN_PASSWORD`: `AdminDiseño2025`.
     - `AWS_ACCESS_KEY_ID`: Tu clave de acceso de AWS.
     - `AWS_SECRET_ACCESS_KEY`: Tu clave secreta de AWS.
     - `AWS_S3_BUCKET_NAME`: El nombre de tu bucket S3.
     - `AWS_REGION`: Tu región de AWS.
     - `EMAIL_HOST`: Por ejemplo, `smtp.gmail.com`.
     - `EMAIL_USER`: Tu correo.
     - `EMAIL_PASS`: Tu contraseña de aplicación.
     - `EMAIL_FROM`: El correo remitente.

3. **Desplegar**:
   - Haz clic en "Deploy" y espera a que Vercel compile y despliegue la aplicación.
   - Accede a la URL proporcionada (por ejemplo, `https://diseno-perfecto.vercel.app`).

## Credenciales de Inicio de Sesión

- **Administrador**: `admin@disenoperfecto.com` / `AdminDiseño2025` (acceso completo).
- **Empleado**: `employee@disenoperfecto.com` / `EmployeeDiseño2025` (solo gestión de pedidos).

## Notas

- Asegúrate de reemplazar las imágenes en la carpeta `public/` con las imágenes reales de tus productos.
- Si encuentras errores durante el despliegue, revisa los logs en Vercel para obtener más detalles.