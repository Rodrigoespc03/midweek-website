# MIDWEEK - Sitio Web Oficial

Sitio web oficial de la banda musical mexicana MIDWEEK. Construido con HTML5, CSS3 y JavaScript vanilla, optimizado para rendimiento y con sistema de gestión de contenido (CMS) integrado.

## 🚀 Características

- **Diseño Minimalista y Cinematográfico**: Inspirado en Parcels y Neil Frances
- **100% Responsive**: Optimizado para desktop y móvil
- **Bilingüe**: Español e Inglés con toggle de idioma
- **Netlify CMS**: Sistema de gestión de contenido para editar sin programar
- **Galería de Fotos**: Carruseles interactivos para eventos
- **Animaciones Suaves**: Transiciones y efectos visuales optimizados
- **SEO Optimizado**: Estructura semántica y meta tags

## 📁 Estructura del Proyecto

```
midweek-pi/
├── admin/                 # Panel de administración Netlify CMS
│   ├── config.yml        # Configuración del CMS
│   └── index.html        # Página del admin
├── assets/               # Recursos estáticos
│   └── uploads/         # Imágenes subidas desde CMS
├── data/                 # Archivos JSON editables desde CMS
│   ├── content.json     # Contenido general
│   └── tour/            # Fechas de conciertos
├── eventos/              # Fotos de eventos
│   ├── artemis/
│   ├── foro-indie-rocks/
│   ├── opening-act-balu/
│   └── pepsi-callejon/
├── Carrusel menu/        # Imágenes del carrusel principal
├── sobre nosotros/       # Fotos de la sección About
├── index.html           # Página principal
├── styles.css           # Estilos
├── script.js            # JavaScript
└── logo.png             # Logo de la banda
```

## 🛠️ Instalación y Setup

### Prerrequisitos

- Cuenta de GitHub
- Cuenta de Netlify (gratis)
- Git instalado

### Pasos para Desplegar

1. **Crear repositorio en GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/tu-usuario/midweek-website.git
   git push -u origin main
   ```

2. **Conectar a Netlify**
   - Ve a [Netlify](https://app.netlify.com)
   - Click en "New site from Git"
   - Selecciona tu repositorio de GitHub
   - Netlify detectará automáticamente la configuración

3. **Configurar Netlify Identity (para CMS)**
   - En el panel de Netlify, ve a **Site settings → Identity**
   - Click en **Enable Identity**
   - En **Registration preferences**, selecciona **Invite only** o **Open**
   - Ve a **Services → Git Gateway** y click en **Enable Git Gateway**
   - Esto permite que el CMS edite el repositorio

4. **Configurar Dominio Personalizado (Opcional)**
   - En Netlify, ve a **Domain settings**
   - Click en **Add custom domain**
   - Sigue las instrucciones para conectar tu dominio
   - Netlify configurará SSL automáticamente

## 📝 Uso del CMS

### Acceder al Panel de Administración

1. Ve a: `https://tudominio.com/admin` o `https://tusitio.netlify.app/admin`
2. Inicia sesión con GitHub o Email (según configuración)
3. ¡Ya puedes editar el contenido!

### Qué Puedes Editar

#### 1. Próximas Fechas (Tour)
- Agregar nuevas fechas de conciertos
- Editar fechas existentes
- Cambiar ciudad, venue, estado, link de boletos

#### 2. Eventos Timeline
- Agregar nuevos eventos a la trayectoria
- Editar eventos existentes
- Subir fotos para cada evento

#### 3. Contenido General
- Tagline principal
- Descripción de "About Us"
- Información de contacto
- Links de redes sociales

## 🎨 Personalización

### Colores de Marca

Los colores están definidos en `styles.css` como variables CSS:

```css
--brand-blue: #00a1fe;
--brand-green: #005a00;
--brand-red: #ed220d;
--brand-purple: #0000fe;
--brand-black: #000000;
--brand-yellow: #fdad00;
```

### Tipografía

- **Fuente Principal**: Bai Jamjuree (Google Fonts)
- Configurada en `index.html` y `styles.css`

## 📱 Responsive Design

El sitio está optimizado para:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (hasta 767px)

## 🚀 Optimizaciones

- **Lazy Loading**: Imágenes cargan solo cuando son visibles
- **Debounce**: Eventos de scroll optimizados
- **RequestAnimationFrame**: Animaciones suaves
- **Imágenes Optimizadas**: Comprimidas para carga rápida

## 🔧 Desarrollo Local

Para probar localmente:

```bash
# Opción 1: Con npx serve
npx serve . -l 3000

# Opción 2: Con Python
python -m http.server 8000

# Opción 3: Con PHP
php -S localhost:8000
```

Luego abre: `http://localhost:3000` (o el puerto que uses)

## 📦 Archivos Importantes

- `index.html` - Estructura principal
- `styles.css` - Todos los estilos
- `script.js` - Toda la lógica JavaScript
- `admin/config.yml` - Configuración del CMS
- `data/content.json` - Contenido editable desde CMS

## 🐛 Solución de Problemas

### El CMS no funciona
- Verifica que Netlify Identity esté habilitado
- Verifica que Git Gateway esté habilitado
- Asegúrate de que el repositorio esté conectado a Netlify

### Las imágenes no cargan
- Verifica las rutas de las imágenes
- Asegúrate de que las carpetas existan
- Verifica que las imágenes estén en el repositorio

### Los cambios no aparecen
- Los cambios del CMS pueden tardar unos minutos
- Verifica que el build de Netlify haya terminado
- Limpia la caché del navegador

## 📄 Licencia

© 2025 Midweek. Todos los derechos reservados.

## 👥 Contacto

- **Email**: midweekplay@gmail.com
- **Management**: +52 55 3177 1932

---

**Desarrollado con ❤️ para MIDWEEK**

