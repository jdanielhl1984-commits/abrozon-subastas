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
* **Certificados:** Tanto `check_and_close_auction` como `admin_forzar_cierre_y_adjudicar` generan automáticamente un código de certificado único para cada objeto adjudicado.

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
* ✅ **Sistema de misiones diarias mejorado:** Las 4 misiones (Gatillo Fácil, El Inversor, Patrocinador, Explorador) deben completarse para desbloquear el **Bono Diario de 1.000 €** (antes 100 €, y solo reclamable una vez al día tras completarlas todas).
* ✅ 15 logros/insignias desbloqueables (con vista en lista y notificaciones toast). *Pendiente de revisión:* se detectó duplicado ("Bugueado" y "Margin Call" premiaban lo mismo). Se planea ampliar a ~21 logros con temática de jerga Z/Alpha (Glow Up, Inversor Nato, A Full, etc.).
* ✅ Sistema de experiencia (XP) y niveles con títulos equipables (Lurker, Regular, Curador, Broker/Main Character, Whale, Final Boss/Admin)
* ✅ **Sistema de Rarezas completo (6 niveles):**
  * Común (gris, 55% prob, 1-1.000 €, 24h)
  * Poco común (verde, 25% prob, 500-2.000 €, 24h)
  * Rara (azul, 13% prob, 1.001-5.000 €, 24h)
  * Épica (lila, 5% prob, 5.001-10.000 €, 3 días)
  * Legendaria (naranja, 2% prob, 10.001-1.000.000 €, 7 días)
  * Mítica (roja, solo manual, 1.000.001 €+, 14 días)
* ✅ **Marcos y chips visuales por rareza** en catálogo y vista de detalle (incluyendo la corrección de espacios en "Poco común").
* ✅ **Último pujador visible** en cada tarjeta del catálogo (debajo del título).
* ✅ **Filtro "Novedades"** (🆕) que muestra solo las subastas creadas en las últimas 24 horas, ordenadas de más reciente a más antigua.
* ✅ **Generación automática de subastas:**
  * Tabla `objetos_automaticos` con 20 objetos de temática streamers/fútbol.
  * Función `generar_subasta_automatica` que sortea rareza (según %), precio y duración.
  * **Cron job configurado** en `cron-job.org` para ejecutar la generación automáticamente **cada 1 hora** (24 subastas/día).
  * **Contador de próxima subasta sincronizado** con el cron job real.
* ✅ **Sistema de reliquidación:** Si una subasta automática termina sin pujas, se vuelve a publicar automáticamente con un 10% de descuento (hasta un mínimo de 1 €).
* ✅ **Certificados automáticos:** Cada subasta ganada genera un código de certificado único (tanto en cierre normal como en adjudicación del admin).
* ✅ Metadata Flexible (JSONB) para efectos visuales y colecciones temáticas
* ✅ **Mercado C2C (Fase 1 completada):**
  * Inventario de usuarios, pestaña "🛒 Mercado C2C", botón "Vender en Mercado" en la vitrina.
  * Compra directa con 30% de comisión, sistema de fianzas (10%) y comisiones por venta (20%).
  * Se copia la foto real del objeto al publicarlo en el mercado.
  * Cajita de detalles del certificado en la vista de producto (certificado original, fecha de adjudicación y vendedor).
  * Botón "Cancelar venta" (solo para el vendedor, no devuelve la fianza).
* ✅ **Hall of Fame renovado (6 rankings):** El Más Rico, La Cabra, El Más Chetado, El Museo, El Más Old, El Más Broker. Con podios y descripciones.
* ✅ **Pestaña "📋 Mis pujas":** Lista ordenable de todas las pujas del usuario con estado en tiempo real (vas ganando / superado / ganada / perdida).
* ✅ **Botón de compartir en redes:** En la vista de detalle, botones para compartir en X (Twitter) y copiar enlace al portapapeles.
* ✅ **Barra de ordenación en catálogo:** Ordenar las subastas por fecha, duración, rareza o precio (ascendente/descendente).
* ✅ PWA (instalable en móvil como app)
* ✅ Modo GOAT (activación, recargas, comentarios destacados) — actualmente es gratuito y da +5.000 €; en el futuro será la suscripción premium (3.99 €/mes)
* ✅ Buscador de subastas
* ✅ Pestaña de "Finalizadas" para ver subastas cerradas
* ✅ Modo oscuro/claro
* ✅ Subida de fotos para subastas (Storage de Supabase)
* ✅ Galería de imágenes en el detalle del producto
* ✅ Calculadora de economía (archivo aparte)
* ✅ Menús reorganizados (versión moderna, propuesta de Claudio ya integrada)
* ✅ **Textos legales completos y adaptados a LSSI-CE/RGPD** (Aviso Legal, Política de Privacidad, Política de Cookies). El titular figura como persona física (Daniel Hernandez) hasta la constitución formal de una SL. Ubicación en Granollers (Barcelona).
* ✅ **Banner de fase beta**: La web muestra un aviso `🚧 FASE BETA · PRUEBAS EN CURSO 🚧` en la cabecera.
* ✅ **Modal de registro oportuno**: Solo se pide login al intentar pujar, no al entrar.
* ✅ **Google Analytics configurado** con ID `G-C30L0HE0L7` para el dominio `abrozon.com`. Mide tráfico en tiempo real, fuente de usuarios y comportamiento.
* ✅ **Base de datos limpia** — Catálogo, pujas e inventario reseteado para empezar la beta desde cero.

## 🚧 Próximos pasos (Roadmap priorizado)

### 🎯 Antes de la Beta Privada (prioridad máxima)

0. **📖 Página de Ayuda / Tutorial / FAQ** ⬜ PENDIENTE — Sección con tutorial rápido (4-5 pasos), guía visual de rarezas, cómo ganar monedas y preguntas frecuentes. Esencial para que los nuevos usuarios no reboten.

---

### Fase 2: Pulido UX/UI y Engagement Temprano
*En progreso — objetivo: completar los puntos restantes antes de la beta privada*

1. ~~**Modal de registro oportuno**~~ → ✅ HECHO
2. ~~**Contador de próxima subasta**~~ → ✅ HECHO
3. ~~**Marcos y chips de rareza en detalle**~~ → ✅ HECHO
4. ~~**Corrección visual objetos Poco Comunes (verdes)**~~ → ✅ HECHO
5. ~~**Bono diario por completar todas las misiones (1.000 €)**~~ → ✅ HECHO
6. ~~**Pestaña "📋 Mis pujas"**~~ → ✅ HECHO
7. ~~**Botón de compartir en redes**~~ → ✅ HECHO
8. ~~**Barra de ordenación en catálogo**~~ → ✅ HECHO
9. **Racha de inicio de sesión (Streak Bonus de 7 días)** ⬜ AHORA — Recompensa diaria creciente que culmina con un gran bote al día 7.
10. **Recompensa por subir de nivel** ⬜ Pendiente — Monedas extra al alcanzar cada nuevo título.
11. **Reciclaje / Desguace de objetos** ⬜ Pendiente — Vender objetos comunes del inventario a cambio de monedas inmediatas.
12. **Sistema de recompensas por anuncios voluntarios** ⬜ Pendiente — Monedas gratis por ver anuncios (simulados o reales en el futuro).
13. **Controles Anti-Pay-to-Win básicos** ⬜ Pendiente — Límite diario de incremento por puja y topes para evitar que el dinero real domine.

### Fase 3: Gamificación y Retención

1. **Nuevos logros y corrección del duplicado** ⬜ Pendiente
   * Reemplazar "Margin Call" por un logro original.
   * Añadir 5-6 logros nuevos (Glow Up, Inversor Nato, A Full, etc.).
2. **Ajuste de la economía (control de inflación)** ⬜ Pendiente — Limitar anuncios diarios y recargas GOAT, ajustar recompensas.
3. **Sistema de referidos** ⬜ Pendiente — Bonificaciones por invitar nuevos usuarios mediante enlace único.
4. **Personalización de avatar** ⬜ Pendiente — Equipar objetos coleccionables en el avatar.
5. **Personalización de perfil** ⬜ Pendiente — Fondos y banners exclusivos equipables.
6. **Beneficios por antigüedad** ⬜ Pendiente — Ventajas e insignias para los usuarios más veteranos.
7. **Vitrina Espectacular y Compartible** ⬜ Pendiente — Efectos CSS por rareza en la vitrina, numeración de serie en Legendarias, botón de compartir.

### Fase 4: Monetización (cuando haya usuarios recurrentes)

1. **Integración de pagos con Stripe** ⬜ Pendiente — Suscripción GOAT premium (3.99 €/mes) y tienda de monedas.
2. **Anuncios reales (Google AdSense)** ⬜ Pendiente — Reemplazar anuncios simulados.
3. **Límite diario de compra de monedas** ⬜ Pendiente — Control de whales e hiperinflación.
4. **Subastas restringidas para novatos** ⬜ Pendiente — Salas exclusivas para cuentas nuevas.
5. **Subastas inversas** ⬜ Pendiente — El precio baja hasta que alguien compra.
6. **Pases de temporada** ⬜ Pendiente — Progresión con recompensas exclusivas (gratis y GOAT).

### Fase 5: Comunidad, Eventos, PVE y Equipamiento

1. **Eventos y desafíos temporales** ⬜ Pendiente — Misiones especiales con recompensas únicas.
2. **Votaciones comunitarias** ⬜ Pendiente — La comunidad decide la temática de subastas especiales.
3. **Sorteos comunitarios** ⬜ Pendiente — Sorteos periódicos entre miembros activos.
4. **Donaciones comunitarias** ⬜ Pendiente — Donar objetos o fondos a la comunidad.
5. **Sección FAQ participativo** ⬜ Pendiente — Usuarios responden dudas de novatos.
6. **Arena PVE "Subasta contra Bots" (Farmeo de XP)** ⬜ Pendiente — Sección exclusiva de entrenamiento para usuarios de Nivel 1-4 donde practicar contra bots con personalidades paródicas, ganar XP y monedas sin presión, y aprender la mecánica de subastas antes del PVP.
7. **⚔️ Zona Raid PVE (Farmeo Hardcore de XP)** ⬜ Pendiente — Subastas PVE de alta dificultad (Nivel 5+) con bots ultra agresivos, mayor límite de repujas, multiplicador de XP 3x y objetos de rareza Rara/Épica/Legendaria.
8. **Colección Temática "Jägger Lore"** ⬜ Pendiente — *La Plota, La Caca de Viruzz, Tatuaje Aspiradora Roomba, Guantes de la Velada, El Saltpeper.*
9. **Foro / Tablón de anuncios comunitario** ⬜ Pendiente — Espacio donde los usuarios pueden dejar anuncios de intercambio, peticiones de objetos, compartir noticias de streamers, salseo o simplemente socializar.
10. **Sistema de trueque entre usuarios** ⬜ Pendiente — Intercambio directo de objetos del inventario entre dos usuarios (con o sin comisión).

### Fase 6: Expansión Técnica y API

1. **API REST de datos públicos** ⬜ Pendiente — Endpoint de lectura (`/api/v1/user/:username`) para exponer estadísticas públicas del jugador (nivel, subastas ganadas, título equipado y avatar).
2. **Firmas dinámicas y Widgets** ⬜ Pendiente — Generador de imágenes o snippets HTML para que los usuarios puedan incrustar su tarjeta de perfil de aBROzon en firmas de foros, canales de Discord o webs personales.
3. **Integraciones con terceros** ⬜ Pendiente — Base técnica para que la comunidad desarrolle bots de estado, extensiones o herramientas analíticas.
4. **Estrategia SEO y Posicionamiento** ⬜ Pendiente — Páginas dinámicas indexables con URLs amigables (`/subastas/casco-de-roro`) y metadatos Open Graph para previsualizaciones atractivas al compartir.

### Fase 7: Análisis de Audiencia y Publicidad

1. **Perfilado demográfico voluntario (Progressive Profiling)** ⬜ Pendiente — Encuestas opcionales recompensadas con monedas del juego.
2. **Media Kit de Anunciantes** ⬜ Pendiente — Informes agregados y anonimizados de audiencia para vender patrocinios, banners y acuerdos de afiliación.
3. **Misiones de patrocinadores y afiliación (Opt-in)** ⬜ Pendiente — Recompensas por registro voluntario en ofertas de terceros (marcas, casas de apuestas, juegos) con cumplimiento RGPD.
4. **Protección de datos** ⬜ Pendiente — Comercialización exclusivamente mediante analítica agregada, sin ceder registros individuales ni datos identificables a terceros.

### Fase 8: Equipamiento de Avatar y Stats (Loot Freak)

1. **Sistema de inventario y equipamiento** ⬜ Pendiente — Ranuras de equipo para el avatar (Cabeza, Objeto/Arma en mano, Calzado, Anillo/Accesorio) con bonificaciones pasivas para PVE y Raid.
2. **Catálogo de objetos paródicos** ⬜ Pendiente — "Espada del Rey Liche", "Botas del Bicho", "El Anillo Único del Chino", etc. (evitando conflictos de licencias).
3. **Escalado de Stats** ⬜ Pendiente — Descuentos de monedas (-5%/-7%/-10%), multiplicadores de XP, control de tiempo (Chronos Freeze, Prediction Gauge, Sniper Extension).
4. **Manipulación de Bots** ⬜ Pendiente — Stun/Latencia, Stealth Bidding, Intimidación.
5. **Economía y Cashbacks** ⬜ Pendiente — Seguro de Derrota, Staking Pasivo, Bonus de Snipe.
6. **Suerte y Progresión** ⬜ Pendiente — Magic Find, Objetos Evolutivos, Duplicador de Recompensa.
7. **Efectos Sociales y Cosméticos** ⬜ Pendiente — Auras animadas, Taunts de Chat, Sonido de Entrada.
8. **Interfaz de Inventario estilo ARPG/Diablo** ⬜ Pendiente — Silueta de personaje (Paperdoll), cuadrícula de inventario (mochila), Drag & Drop en escritorio, pestañas en móvil, inspección de perfil público.

### Ideas lejanas (post-MVP)
* Categoría Legacy / Rage Comics (memes antiguos).
* Misiones sociales (compartir, visitar streamer).
* Dashboard de administrador con estadísticas.
* Navegación con hash (#) para que funcione la flecha de retroceder del navegador.

## 💰 Modelo de monetización (planificado)

* **F2P (Gratis):** Usuarios ven anuncios limitados para conseguir moneda virtual.
* **Modo GOAT (Suscripción 3.99 €/mes):** Sin límites de anuncios, posibilidad de escribir comentarios en pujas, insignia exclusiva, y otras ventajas.
* **Tienda de monedas:** Compra directa de saldo virtual con Stripe.
* **Media Kit de Anunciantes:** Informes agregados de audiencia para vender patrocinios y acuerdos de afiliación.
* **Misiones de afiliación (Opt-in):** Recompensas por registro voluntario en ofertas de terceros.

## 📢 Redes Sociales y Estrategia de Lanzamiento

* **X (Twitter):** [@aBROzonsubastas](https://x.com/aBROzonsubastas) — Perfil oficial creado. Primeras interacciones con capturas de subastas y etiquetado a streamers (ej: Jägger).
* **Beta Privada (5-10 usuarios):** Probar con amigos para encontrar bugs y pulir la experiencia.
* **Beta con Micro-streamers:** Si la beta privada funciona, invitar a streamers pequeños para medir la retención real.
* **Contenido viral:** Crear clips de subastas absurdas para TikTok/X que enganchen a la comunidad.

## 🌐 Dominio

* **Dominio:** `abrozon.com` — **Comprado y conectado a GitHub Pages**. La web ya está disponible en [https://abrozon.com](https://abrozon.com).
* **Redirección:** La URL antigua de GitHub Pages redirige automáticamente al nuevo dominio.
* **HTTPS:** Activado (certificado SSL gestionado por GitHub).
---

## 🚀 Plan de acción para la Beta Privada (adicional al roadmap)

Basándonos en el estado actual del proyecto, se han identificado las siguientes tareas **críticas** para poder lanzar una beta privada estable y segura:

### 🔴 Seguridad (prioridad máxima)
- **Proteger todas las RPCs de administrador** (`admin_*`) añadiendo una verificación de `is_admin` al inicio de cada función. Esto evita que usuarios normales puedan ejecutarlas desde la consola.
- **Validar el tipo de archivo** en la subida de imágenes (solo imágenes, tamaño máximo 5 MB).
- **Sanitizar el campo `metadata`** en la creación de subastas (usar `try/catch` al parsear JSON).

### 🟡 Experiencia de usuario (engagement)
- **Crear la página de Ayuda / Tutorial / FAQ** (sección con 4-5 pasos, guía de rarezas, cómo ganar monedas y preguntas frecuentes). Esencial para que los nuevos usuarios no reboten.
- **Implementar la Racha de inicio de sesión (Streak Bonus de 7 días)** con recompensa creciente y bote final.
- **Reemplazar todos los `alert()` por el sistema de toasts** ya implementado, para una experiencia más fluida.
- **Añadir feedback visual** (spinners o botones deshabilitados) durante la ejecución de acciones como pujar, anuncios, etc.

### 🟢 Pulido final
- **Actualizar automáticamente la vitrina** después de vender o comprar en el mercado.
- **Optimizar el catálogo** para que no se recargue entero con cada cambio Realtime (se hará una actualización diferencial).
- **Añadir un banner visible de "Beta Privada"** con un enlace a un formulario de feedback (Google Forms o similar).

**Nota:** Estas tareas son complementarias a las ya planificadas en el roadmap y se consideran imprescindibles antes de abrir la beta a usuarios externos.
## ⚠️ Notas para la IA

* **Soy un programador novato.** Necesito explicaciones paso a paso, sin tecnicismos innecesarios. Si algún concepto es complejo, por favor, tradúcemelo a un lenguaje sencillo.
* El código principal está en un único archivo `index.html`. Se puede leer completo si es necesario, pero para cambios pequeños prefiero editar fragmentos con el método de "buscar y reemplazar".
* La web se despliega en GitHub Pages. Si hay errores de despliegue, suele ser por la caché del navegador, por falta del archivo `.nojekyll`, o por un error de sintaxis en el HTML/JS.
* **No acortar el código** cuando me pases el archivo completo. Prefiero copiar y pegar el archivo entero aunque sea largo.
* **Forma de trabajar preferida:** Para cambios pequeños, indicar el texto exacto a buscar y su reemplazo (edición quirúrgica). Para cambios grandes (muchas partes tocadas o nuevo sistema), pasar el archivo `index.html` completo verificado.
