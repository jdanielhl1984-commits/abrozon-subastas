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

## 🗃 Base de datos (Supabase)

### Tablas principales

* `profiles`, `auctions`, `bids`, `user_achievements`
* `daily_bid_counts`, `daily_custom_bids`, `daily_ad_views_mission`, `daily_category_bids`
* `categories` (nombre, icono; dinámica desde admin)
* `user_items` (inventario de objetos de cada usuario, relaciona `user_id` con `auction_id`)
* `objetos_automaticos` (catálogo de objetos que el sistema usa para generar subastas automáticas)

### Funciones RPC (backend)

* `place_bid`, `add_ad_reward`, `check_and_close_auction`, `unlock_achievement`, `admin_buscar_usuario`, `admin_set_saldo`, `admin_toggle_ban`, `admin_delete_auction`, `create_auction`, `get_daily_missions`, `get_hall_of_fame`, `increment_min_bid`, `increment_custom_bid`, `increment_ad_mission`, `increment_category_bid`, `toggle_goat`, `reclamar_bonus_diario`, `username_disponible`, `actualizar_mi_alias`, `admin_listar_usuarios`, `add_xp`, `admin_add_category`, `admin_delete_category`
* **Mercado C2C:** `vender_en_mercado`, `cerrar_subasta_mercado`, `comprar_directo`, `admin_forzar_cierre_y_adjudicar`, `cancelar_venta_mercado`
* **Generación automática:** `generar_subasta_automatica` (crea subastas aleatorias con rarezas y precios según probabilidades)

## 🔒 Seguridad

* **Row Level Security (RLS):** Activo y verificado en todas las tablas. 
  * `profiles`: `(auth.uid() = id)` — Cada usuario solo ve su propia fila (saldos protegidos).
  * `auctions` y `bids`: Lectura pública para mantener la fluidez del catálogo.
* **Funciones RPC:** Usan `SECURITY DEFINER` para ejecutar la lógica financiera (saldos, fianzas del 10%, comisiones del 20%) en el servidor.
* **Prevención de Race Conditions:** La RPC `place_bid` incluye bloqueo atómico `FOR UPDATE` para procesar pujas simultáneas en cola sin duplicar saldos ni pujas.

## ✨ Funcionalidades implementadas

* ✅ Registro/login con email (Supabase Auth + recuperación de contraseña)
* ✅ Subastas en tiempo real (pujas, temporizadores con días/horas, cierre automático con `check_and_close_auction` al visitar el catálogo)
* ✅ Panel de administración (crear/eliminar subastas, gestionar usuarios, ver lista completa, banear, fijar saldo, añadir/eliminar categorías dinámicas, adjudicar subastas al admin para pruebas)
* ✅ Sistema de misiones diarias (bono diario, pujas mínimas, puja personalizada, ver anuncios, explorar categorías)
* ✅ 15 logros/insignias desbloqueables (con vista en lista y notificaciones toast). *Pendiente de revisión:* se detectó duplicado ("Bugueado" y "Margin Call" premiaban lo mismo). Se planea ampliar a ~21 logros con temática de jerga Z/Alpha (Glow Up, Inversor Nato, A Full, etc.).
* ✅ Sistema de experiencia (XP) y niveles con títulos equipables (Lurker, Regular, Curador, Broker/Main Character, Whale, Final Boss/Admin)
* ✅ **Sistema de Rarezas completo (6 niveles):**
  * Común (gris, 60% prob, 1-1.000 €, 24h)
  * Poco común (verde, 20% prob, 500-2.000 €, 24h)
  * Rara (azul, 15% prob, 1.001-5.000 €, 24h)
  * Épica (lila, 4% prob, 5.001-10.000 €, 3 días)
  * Legendaria (naranja, 1% prob, 10.001-1.000.000 €, 7 días)
  * Mítica (roja, solo manual, 1.000.001 €+, 14 días)
* ✅ **Marcos y chips visuales por rareza:** Cada tarjeta en el catálogo muestra un borde y una etiqueta de color según su rareza.
* ✅ **Último pujador visible** en cada tarjeta del catálogo (debajo del título).
* ✅ **Filtro "Novedades"** (🆕) que muestra solo las subastas creadas en las últimas 24 horas, ordenadas de más reciente a más antigua.
* ✅ **Generación automática de subastas:**
  * Tabla `objetos_automaticos` con 20 objetos de temática streamers/fútbol.
  * Función `generar_subasta_automatica` que sortea rareza (según %), precio y duración.
  * **Cron job configurado** en `cron-job.org` para ejecutar la generación automáticamente cada X horas.
* ✅ **Sistema de reliquidación:** Si una subasta automática termina sin pujas, se vuelve a publicar automáticamente con un 10% de descuento (hasta un mínimo de 1 €).
* ✅ Metadata Flexible (JSONB) para efectos visuales y colecciones temáticas
* ✅ **Mercado C2C (Fase 1 completada):**
  * Inventario de usuarios, pestaña "🛒 Mercado C2C", botón "Vender en Mercado" en la vitrina.
  * Compra directa con 30% de comisión, sistema de fianzas (10%) y comisiones por venta (20%).
  * Se copia la foto real del objeto al publicarlo en el mercado.
  * Cajita de detalles del certificado en la vista de producto (certificado original, fecha de adjudicación y vendedor).
  * Botón "Cancelar venta" (solo para el vendedor, no devuelve la fianza).
* ✅ Hall of Fame (rankings de ganadores, gastadores y coleccionistas) – se actualiza cada 30 s
* ✅ PWA (instalable en móvil como app)
* ✅ Modo GOAT (activación, recargas, comentarios destacados) — actualmente es gratuito y da +5.000 €; en el futuro será la suscripción premium (3.99 €/mes)
* ✅ Buscador de subastas
* ✅ Pestaña de "Finalizadas" para ver subastas cerradas
* ✅ Modo oscuro/claro
* ✅ Subida de fotos para subastas (Storage de Supabase)
* ✅ Galería de imágenes en el detalle del producto
* ✅ Calculadora de economía (archivo aparte)
* ✅ Menús reorganizados (versión moderna, propuesta de Claudio ya integrada)
* ✅ **Textos legales completos y adaptados a LSSI-CE/RGPD** (Aviso Legal, Política de Privacidad, Política de Cookies). Incluyen los datos de aBROzon SL (en constitución), NIF pendiente, ubicación en Granollers (Barcelona). Redactados con ayuda de Gemini para cumplir con la normativa española.
* ✅ **Banner de fase beta**: La web muestra un aviso `🚧 FASE BETA · PRUEBAS EN CURSO 🚧` en la cabecera.

## 🚧 Próximos pasos (Roadmap priorizado para MVP)

### Fase 1: MVP sólido y gratuito (para testear con 5 amigos)

1. ~~**Automatización de cierres de subasta (Cron Job)**~~ → ✅ HECHO (cron-job.org + `generar_subasta_automatica`)
2. **Vitrina Espectacular y Compartible** ⬜ Pendiente
   * Efectos visuales CSS por rareza en la vitrina.
   * Numeración de serie visible en Legendarias.
   * Botón de compartir vitrina en redes sociales (texto/imagen generada).
3. **Nuevos logros y corrección del duplicado** ⬜ Pendiente
   * Reemplazar "Margin Call" por un logro original (ej: ganar la primera venta en el Mercado C2C).
   * Añadir 5-6 logros nuevos inspirados en el DicZionario (Glow Up, Inversor Nato, A Full, etc.) para fomentar la retención.
4. **Ajuste de la economía (control de inflación)** ⬜ Pendiente
   * Limitar anuncios diarios y recargas GOAT usando la calculadora.
   * Ajustar recompensas de misiones según el feedback.

### Fase 2: Monetización (cuando el MVP tenga usuarios recurrentes)

1. **Integración de pagos con Stripe** ⬜ Pendiente
2. **Anuncios reales (Google AdSense)** ⬜ Pendiente
3. **Mejoras de seguridad/arquitectura (para producción con pagos)** ⬜ Pendiente

### Ideas futuras (post-MVP)

* **Colección Temática "Jägger Lore":** *La Plota, La Caca de Viruzz, Tatuaje Aspiradora Roomba, Guantes de la Velada, El Saltpeper.*
* Categoría Legacy / Rage Comics (memes antiguos).
* Misiones sociales (compartir, visitar streamer).
* Dashboard de administrador con estadísticas.
* Navegación con hash (#) para que funcione la flecha de retroceder del navegador.

## 💰 Modelo de monetización (planificado)

* **F2P (Gratis):** Usuarios ven anuncios limitados para conseguir moneda virtual.
* **Modo GOAT (Suscripción 3.99 €/mes):** Sin límites de anuncios, posibilidad de escribir comentarios en pujas, insignia exclusiva, y otras ventajas.
* **Tienda de monedas:** Compra directa de saldo virtual con Stripe.

## 📢 Redes Sociales y Estrategia de Lanzamiento

* **X (Twitter):** [@aBROzonsubastas](https://x.com/aBROzonsubastas) — Perfil oficial creado. Primeras interacciones con capturas de subastas y etiquetado a streamers (ej: Jägger).
* **Beta Privada (5-10 usuarios):** Probar con amigos para encontrar bugs y pulir la experiencia.
* **Beta con Micro-streamers:** Si la beta privada funciona, invitar a streamers pequeños para medir la retención real.
* **Contenido viral:** Crear clips de subastas absurdas para TikTok/X que enganchen a la comunidad.

## 🌐 Dominio

* **Dominio:** `abrozon.com` — **Comprado y conectado a GitHub Pages**. La web ya está disponible en [https://abrozon.com](https://abrozon.com).
* **Redirección:** La URL antigua de GitHub Pages redirige automáticamente al nuevo dominio.
* **HTTPS:** Activado (certificado SSL gestionado por GitHub).

## ⚠️ Notas para la IA

* **Soy un programador novato.** Necesito explicaciones paso a paso, sin tecnicismos innecesarios. Si algún concepto es complejo, por favor, tradúcemelo a un lenguaje sencillo.
* El código principal está en un único archivo `index.html`. Se puede leer completo si es necesario, pero para cambios pequeños prefiero editar fragmentos con el método de "buscar y reemplazar".
* La web se despliega en GitHub Pages. Si hay errores de despliegue, suele ser por la caché del navegador, por falta del archivo `.nojekyll`, o por un error de sintaxis en el HTML/JS.
* **No acortar el código** cuando me pases el archivo completo. Prefiero copiar y pegar el archivo entero aunque sea largo.
* **Forma de trabajar preferida:** Para cambios pequeños, indicar el texto exacto a buscar y su reemplazo (edición quirúrgica). Para cambios grandes (muchas partes tocadas o nuevo sistema), pasar el archivo `index.html` completo verificado.
