# 🚀 aBROzon.subastas

**Descripción breve:** Web de subastas de broma con moneda ficticia, misiones, logros, rankings y PWA. Parodia de Amazon + Catawiki, temática de streamers y fútbol.

## 🛠 Tecnologías

* **Frontend:** HTML, CSS, JavaScript (un solo archivo `index.html` principal)
* **Backend:** Supabase (PostgreSQL, Auth, Realtime, Storage)
* **Despliegue:** GitHub Pages (con archivo `.nojekyll` para evitar errores de Jekyll)

## 📁 Estructura del proyecto

* `index.html` → Toda la aplicación (frontend + lógica)
* `calculadora.html` → Calculadora de economía independiente (abrir en navegador)
* `manifest.json`, `service-worker.js` → PWA
* `icon-192.png`, `icon-512.png` → Iconos de la PWA (un símbolo "A")
* `.nojekyll` → Archivo vacío para que GitHub Pages no use Jekyll

---

## 🗃 Base de datos (Supabase)

### Tablas principales

* `profiles` (usuarios con saldo, XP, nivel, racha, etc.)
* `auctions` (subastas activas/finalizadas)
* `bids` (historial de pujas)
* `user_achievements` (logros desbloqueados)
* `daily_bid_counts`, `daily_custom_bids`, `daily_ad_views_mission`, `daily_category_bids` (misiones diarias)
* `categories` (categorías dinámicas desde admin)
* `user_items` (inventario de objetos de cada usuario)
* `objetos_automaticos` (catálogo para generación automática de subastas)

### Funciones RPC (backend)

**Subastas y pujas:**
- `place_bid` → Realiza una puja con bloqueo atómico.
- `check_and_close_auction` → Cierra subastas expiradas y genera certificados.
- `create_auction` → Crea una subasta (desde admin).
- `generar_subasta_automatica` → Genera subastas automáticas cada hora.

**Economía y recompensas:**
- `add_ad_reward` → Da recompensa por ver anuncios (500€ normal, 1000€ GOAT).
- `add_mission_reward` → Da recompensa al completar misiones.
- `add_xp` → Suma XP, con recompensa por subir de nivel.
- `reclamar_bonus_diario` → Reclama el bono de 1.000€ al completar misiones.
- `check_streak_and_reward` → Controla la racha de inicio de sesión.
- `reclamar_botin_diario` → Ruleta diaria con premios de 50€ a 1000€.

**Inventario y mercado:**
- `vender_en_mercado` → Publica un objeto en el mercado C2C.
- `comprar_directo` → Compra directa con 30% de comisión.
- `cancelar_venta_mercado` → Cancela una venta (no devuelve fianza).
- `desguazar_objeto` → Recicla objetos a cambio de monedas (20% del precio).

**Administración (protegidas con `is_admin`):**
- `admin_buscar_usuario`, `admin_set_saldo`, `admin_toggle_ban`
- `admin_delete_auction`, `admin_forzar_cierre_y_adjudicar`
- `admin_listar_usuarios`, `admin_add_category`, `admin_delete_category`

**Utilidades y gamificación:**
- `unlock_achievement` → Desbloquea logros.
- `check_all_achievements` → Verifica y desbloquea logros retroactivos.
- `toggle_goat` → Activa/desactiva el modo GOAT.
- `get_daily_missions` → Obtiene el progreso de misiones diarias.
- `get_hall_of_fame` → Devuelve los rankings del Hall of Fame.
- `username_disponible`, `actualizar_mi_alias` → Gestión de perfiles.

---

## 🔒 Seguridad

* **Row Level Security (RLS):** Activo en todas las tablas.
  * `profiles`: `(auth.uid() = id)` — Cada usuario solo ve su propia fila.
  * `auctions` y `bids`: Lectura pública (catálogo visible).
* **Funciones RPC:** Usan `SECURITY DEFINER` para ejecutar lógica financiera en el servidor.
* **Prevención de Race Conditions:** `place_bid` usa `FOR UPDATE` para evitar duplicados.
* **RPCs de administrador protegidas:** Todas las funciones `admin_*` verifican `is_admin = true` antes de ejecutarse.

---

## ✨ Funcionalidades implementadas

### 🔐 Autenticación y usuarios
- ✅ Registro/login con email (Supabase Auth + recuperación de contraseña)
- ✅ Modal de registro solo al intentar pujar (no al entrar)
- ✅ Cambio de alias y contraseña desde perfil
- ✅ Zona de baja de cuenta (contacto por email)

### 🏛️ Subastas y catálogo
- ✅ Subastas en tiempo real (pujas, temporizadores con días/horas)
- ✅ Cierre automático al visitar el catálogo
- ✅ Sistema de rarezas completo (6 niveles con colores y chips visuales)
- ✅ Último pujador visible en cada tarjeta
- ✅ Filtro "Novedades" (últimas 24 horas)
- ✅ Barra de ordenación (fecha, duración, rareza, precio)
- ✅ Buscador de subastas
- ✅ Pestaña "Finalizadas" para ver subastas cerradas
- ✅ Certificados automáticos con código único al ganar una subasta

### 🎮 Gamificación y progreso
- ✅ Sistema de XP y niveles (Lurker → Final Boss/Admin)
- ✅ **Recompensa por subir de nivel** (monedas extra al alcanzar niveles clave)
- ✅ **30 logros/insignias** desbloqueables (escalonados por nivel, saldo, subastas, etc.)
- ✅ **Verificación retroactiva de logros** (para usuarios con progreso previo)
- ✅ Racha de inicio de sesión (Streak Bonus de 7 días: 100€ → 1000€)
- ✅ Misiones diarias (4 misiones + bono de 1.000€ al completarlas todas)
- ✅ **Botín Diario (Ruleta)** en la cabecera con premios de 50€ a 1000€
- ✅ Modo GOAT (activación, recargas premium de 1000€, comentarios en pujas)

### 🛒 Mercado C2C e inventario
- ✅ Inventario de usuarios (vitrina)
- ✅ Publicar objetos en el mercado (con fianzas del 10%)
- ✅ Compra directa con 30% de comisión
- ✅ Cancelar venta (no devuelve fianza)
- ✅ **Reciclaje/Desguace de objetos:** Comunes, Poco comunes, Raras y Épicas (20% del precio con mín/máx)
- ✅ Actualización automática de la vitrina tras vender/comprar/reciclar
- ✅ **Efectos visuales en vitrina** (brillos y animaciones según rareza)

### 🏆 Rankings y comunidad
- ✅ Hall of Fame renovado (6 rankings con podios)
- ✅ Pestaña "Mis pujas" (solo muestra la última puja por subasta)
- ✅ **Filtros por estado en "Mis pujas"** (Todas, Activas, Ganadas, Perdidas)
- ✅ Botones de compartir en X y copiar enlace
- ✅ **Sistema de notificaciones** (campanita con panel de notificaciones)

### 🎨 Interfaz y experiencia
- ✅ Modo oscuro/claro
- ✅ PWA instalable (manifest.json + service-worker)
- ✅ Página de Ayuda/Tutorial/FAQ (pestaña "❓ Ayuda")
- ✅ Banner de beta privada con enlace a formulario de feedback
- ✅ Reemplazo de `alert()` por toasts (notificaciones emergentes)
- ✅ Feedback visual (spinners y botones deshabilitados durante acciones)
- ✅ **Evitar spam de toasts** (limitado a 1 cada 30 segundos)

### 🛠️ Administración
- ✅ Panel de administración completo:
  - Crear/eliminar subastas (con duraciones de 1 min, 1h, 6h, 24h, 3d, 7d, 14d, 30d)
  - Gestionar usuarios (buscar, fijar saldo, banear)
  - Ver lista completa de usuarios
  - Añadir/eliminar categorías dinámicas
  - Adjudicar subastas al admin para pruebas

### 🤖 Automatización
- ✅ Generación automática de subastas (cron job cada 1 hora)
- ✅ Contador de próxima subasta sincronizado
- ✅ Sistema de reliquidación (subastas sin pujas se re-publican con 10% de descuento)
- ✅ Metadata flexible (JSONB) para efectos visuales

### 📜 Legal y compliance
- ✅ Textos legales completos (Aviso Legal, Política de Privacidad, Política de Cookies)
- ✅ Titular como persona física (Daniel Hernandez, Granollers)
- ✅ Google Analytics configurado (ID `G-C30L0HE0L7`)

---

## 🚧 Próximos pasos (Roadmap)

### ✅ Fase 2: Pulido UX/UI y Engagement Temprano (COMPLETADA)

1. ✅ Modal de registro oportuno
2. ✅ Contador de próxima subasta
3. ✅ Marcos y chips de rareza en detalle
4. ✅ Corrección visual objetos Poco Comunes (verdes)
5. ✅ Bono diario por completar todas las misiones (1.000 €)
6. ✅ Pestaña "📋 Mis pujas"
7. ✅ Botón de compartir en redes
8. ✅ Barra de ordenación en catálogo
9. ✅ Racha de inicio de sesión (Streak Bonus de 7 días)
10. ✅ Recompensa por subir de nivel
11. ✅ Reciclaje / Desguace de objetos
12. ✅ Sistema de recompensas por anuncios voluntarios (simulados)
13. ✅ Controles Anti-Pay-to-Win básicos (ajustes finos pendientes)

---

### ⬜ Fase 3: Gamificación y Retención (PENDIENTE)

1. **Ajuste de la economía (control de inflación)** ⬜ Pendiente
   - Revisar precios de reciclaje (objetos Épica y superiores)
   - Ajustar recompensas de misiones y anuncios
   - Limitar la cantidad de anuncios diarios

2. **Sistema de referidos** ⬜ Pendiente
   - Enlace único por usuario
   - Recompensa por invitar amigos (ej: 500€ por referido)

3. **Personalización de avatar** ⬜ Pendiente
   - Subir foto de perfil
   - Equipar objetos coleccionables en el avatar

4. **Personalización de perfil** ⬜ Pendiente
   - Fondos y banners exclusivos equipables
   - Frase personalizada

5. **Beneficios por antigüedad** ⬜ Pendiente
   - Insignias por meses de antigüedad
   - Ventajas para usuarios veteranos

6. **Vitrina Espectacular y Compartible** ⬜ Pendiente
   - Mejores efectos CSS en vitrina
   - Numeración de serie en objetos Legendarios
   - Botón para compartir vitrina

---

### ⬜ Fase 4: Monetización (cuando haya usuarios recurrentes)

1. **Integración de pagos con Stripe** ⬜ Pendiente
2. **Anuncios reales (Google AdSense)** ⬜ Pendiente
3. **Límite diario de compra de monedas** ⬜ Pendiente
4. **Subastas restringidas para novatos** ⬜ Pendiente
5. **Subastas inversas** ⬜ Pendiente
6. **Pases de temporada** ⬜ Pendiente

---

### ⬜ Fase 5: Comunidad, Eventos, PVE y Equipamiento (Pendiente)

1. **Eventos y desafíos temporales** ⬜ Pendiente
2. **Votaciones comunitarias** ⬜ Pendiente
3. **Sorteos comunitarios** ⬜ Pendiente
4. **Donaciones comunitarias** ⬜ Pendiente
5. **Sección FAQ participativo** ⬜ Pendiente
6. **Arena PVE "Subasta contra Bots"** ⬜ Pendiente
7. **Zona Raid PVE** ⬜ Pendiente
8. **Colección Temática "Jägger Lore"** ⬜ Pendiente
9. **Foro / Tablón de anuncios comunitario** ⬜ Pendiente
10. **Sistema de trueque entre usuarios** ⬜ Pendiente

---

### ⬜ Fase 6: Expansión Técnica y API (Pendiente)

1. **API REST de datos públicos** ⬜ Pendiente
2. **Firmas dinámicas y Widgets** ⬜ Pendiente
3. **Integraciones con terceros** ⬜ Pendiente
4. **Estrategia SEO y Posicionamiento** ⬜ Pendiente

---

### ⬜ Fase 7: Análisis de Audiencia y Publicidad (Pendiente)

1. **Perfilado demográfico voluntario** ⬜ Pendiente
2. **Media Kit de Anunciantes** ⬜ Pendiente
3. **Misiones de patrocinadores y afiliación** ⬜ Pendiente
4. **Protección de datos** ⬜ Pendiente

---

### ⬜ Fase 8: Equipamiento de Avatar y Stats (Pendiente)

1. **Sistema de inventario y equipamiento** ⬜ Pendiente
2. **Catálogo de objetos paródicos** ⬜ Pendiente
3. **Escalado de Stats** ⬜ Pendiente
4. **Manipulación de Bots** ⬜ Pendiente
5. **Economía y Cashbacks** ⬜ Pendiente
6. **Suerte y Progresión** ⬜ Pendiente
7. **Efectos Sociales y Cosméticos** ⬜ Pendiente
8. **Interfaz de Inventario estilo ARPG/Diablo** ⬜ Pendiente

---

## 💰 Modelo de monetización (planificado)

* **F2P (Gratis):** Usuarios ven anuncios limitados para conseguir moneda virtual.
* **Modo GOAT (Suscripción 3.99 €/mes):** Sin límites de anuncios, comentarios en pujas, insignia exclusiva.
* **Tienda de monedas:** Compra directa de saldo virtual con Stripe.
* **Media Kit de Anunciantes:** Informes agregados de audiencia para patrocinios.

---

## 📢 Redes Sociales y Estrategia de Lanzamiento

* **X (Twitter):** [@aBROzonsubastas](https://x.com/aBROzonsubastas) — Perfil oficial creado.
* **Beta Privada (5-10 usuarios):** Probar con amigos para encontrar bugs.
* **Beta con Micro-streamers:** Invitar a streamers pequeños para medir retención.
* **Contenido viral:** Crear clips de subastas absurdas para TikTok/X.

---

## 🌐 Dominio

* **Dominio:** `abrozon.com` — Comprado y conectado a GitHub Pages.
* **HTTPS:** Activado (certificado SSL gestionado por GitHub).

---

## 🚀 Plan de acción para la Beta Privada (✅ COMPLETADO)

Todas las tareas críticas para la beta privada han sido completadas:

### 🔴 Seguridad
- ✅ **Proteger todas las RPCs de administrador** (`admin_*`) añadiendo verificación de `is_admin`.
- ✅ **Validar el tipo de archivo** en la subida de imágenes (solo imágenes, tamaño máximo 5 MB).
- ✅ **Sanitizar el campo `metadata`** en la creación de subastas (usar `try/catch` al parsear JSON).

### 🟡 Experiencia de usuario
- ✅ **Crear la página de Ayuda / Tutorial / FAQ** (pestaña "❓ Ayuda").
- ✅ **Implementar la Racha de inicio de sesión (Streak Bonus de 7 días)**.
- ✅ **Reemplazar todos los `alert()` por el sistema de toasts**.
- ✅ **Añadir feedback visual** (spinners o botones deshabilitados).
- ✅ **Botín Diario (Ruleta)** en la cabecera.
- ✅ **Sistema de notificaciones** (campanita).

### 🟢 Pulido final
- ✅ **Actualizar automáticamente la vitrina** después de vender o comprar.
- ✅ **Efectos visuales en vitrina** según rareza.
- ✅ **Filtros en "Mis pujas"** (Todas, Activas, Ganadas, Perdidas).
- ✅ **30 logros** con verificación retroactiva.
- ⬜ **Optimizar el catálogo** (mejora futura, no crítica).
- ✅ **Añadir un banner visible de "Beta Privada"** con enlace a formulario de feedback.

---

## ⚠️ Notas para la IA

* **Soy un programador novato.** Necesito explicaciones paso a paso, sin tecnicismos innecesarios.
* El código principal está en un único archivo `index.html`.
* Para cambios pequeños, indicar texto exacto a buscar y reemplazo.
* Para cambios grandes, pasar archivo completo verificado.
* No acortar el código al pasarlo completo.
* La web se despliega en GitHub Pages. Errores comunes: caché, `.nojekyll`, sintaxis.

---

## ✅ Estado actual: ¡LISTO PARA LANZAR LA BETA PRIVADA! 🚀

**Todo lo esencial está funcionando. La Fase 3 puede ir añadiéndose durante la beta.**
