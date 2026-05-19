# ClinicaStev

Sistema de gestión para clínica dental con Next.js, Tailwind CSS y MySQL.

## Características

- **Sitio web público**: Página de aterrizaje con servicios, horarios y registro de usuarios
- **Panel de usuario**: Dashboard para agendar citas, ver historial, perfil y configuración
- **Panel de administrador**: Dashboard con doble autenticación para gestión completa
  - Gestión de citas (confirmar, cancelar, completar)
  - Gestión de personal (doctores y especialistas)
  - Gestión de servicios
  - Reportes y estadísticas
  - Calendario de citas
- **Diseño minimalista**: Estilo blanco y negro neutro
- **Diseño responsivo**: Navegación estilo WhatsApp en móvil, sidebar en escritorio

## Tecnologías

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- MySQL (local)
- bcryptjs (encriptación de contraseñas)
- jsonwebtoken (autenticación)

## Configuración

### Prerrequisitos

- Node.js 18+
- MySQL/MariaDB
- npm, yarn, pnpm o bun

### Instalación

1. Clonar el repositorio:
```bash
git clone <repository-url>
cd ClinicaStev
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar la base de datos MySQL:
```bash
mysql -u root -p < database/schema.sql
```

4. Configurar variables de entorno (opcional):
```bash
# .env.local
JWT_SECRET=tu-clave-secreta-aqui
```

5. Ejecutar el servidor de desarrollo:
```bash
npm run dev
```

6. Abrir [http://localhost:3000](http://localhost:3000) en el navegador

## Estructura del Proyecto

```
ClinicaStev/
├── database/
│   └── schema.sql              # Esquema de base de datos
├── src/
│   ├── app/
│   │   ├── api/               # Rutas API
│   │   ├── admin/             # Panel de administrador
│   │   ├── dashboard/         # Panel de usuario
│   │   ├── login/             # Página de login
│   │   ├── register/          # Página de registro
│   │   └── page.tsx           # Página principal
│   ├── components/            # Componentes reutilizables
│   └── lib/                   # Utilidades y configuración
└── public/                    # Archivos estáticos
```

## Funcionalidades

### Usuario
- Registro e inicio de sesión
- Agendar citas con selección de servicio y doctor
- Ver historial de citas
- Editar perfil
- Configuración de cuenta

### Administrador
- Doble autenticación para acceso seguro
- Gestión de citas (confirmar, cancelar, completar)
- Gestión de personal (agregar, activar/desactivar, eliminar)
- Gestión de servicios (agregar, eliminar)
- Reportes de ingresos y estadísticas
- Calendario visual de citas
- Perfil y configuración

## Credenciales de Prueba

Después de ejecutar el schema.sql, puedes usar:

**Usuario:**
- Email: (crear uno nuevo en registro)
- Contraseña: (la que elijas)

**Administrador:**
- Email: (crear uno nuevo en la base de datos)
- Contraseña: (la que elijas)

Para crear un administrador manualmente:
```sql
INSERT INTO admins (email, password, name) VALUES ('admin@clinicastev.com', '$2a$10$hashed_password_here', 'Admin');
```

## Licencia

© 2024 ClinicaStev. Todos los derechos reservados.
