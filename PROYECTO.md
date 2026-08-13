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
* **Reciclaje/Desguace:** `desguazar_objeto` (permite reciclar objetos Comunes, Poco comunes, Raras y Épicas a cambio de monedas, calculando el 20% del precio de salida con mínimos y máximos por rareza)
* **Racha de inicio de sesión:** `check_streak_and_reward` (recompensa progresiva de 7 días: 100€, 200€, 300€, 400€, 500€, 600€, 1000€)

## 🔒 Seguridad

* **Row Level Security (RLS):** Activo y verificado en todas las tablas. 
  * `profiles`: `(auth.uid() = id)` — Cada usuario solo ve su propia fila (saldos protegidos).
  * `auctions` y `bids`: Lectura pública para mantener la fluidez del catálogo.
* **Funciones RPC:** Usan `SECURITY DEFINER` para ejecutar la lógica financiera (saldos, fianzas del 10%, comisiones del 20%) en el servidor.
* **Prevención de Race Conditions:** La RPC `place_bid` incluye bloqueo atómico `FOR UPDATE` para procesar pujas simultáneas en cola sin duplicar saldos ni pujas.
* **RPCs de administrador protegidas:** Todas las funciones `admin_*` verifican que el usuario tenga `is_admin = true` antes de ejecutarse.

## ✨ Funcionalidades implementadas

* ✅ Registro/login con email (Supabase Auth + recuperación de contraseña)
* ✅ Subastas en tiempo real (pujas, temporizadores con días/horas, cierre automático con `check_and_close_auction` al visitar el catálogo)
* ✅ Panel de administración (crear/eliminar subastas, gestionar usuarios, ver lista completa, banear, fijar saldo, añadir/eliminar categorías dinámicas, adjudicar subastas al admin para pruebas)
* ✅ **Sistema de misiones diarias mejorado:** Las 4 misiones (Gatillo Fácil, El Inversor, Patrocinador, Explorador) deben completarse para desbloquear el **Bono Diario de 1.000 €**.
* ✅ **Racha de inicio de sesión (Streak Bonus):** Recompensa diaria creciente (día 1→100€, día 2→200€, día 3→300€, día 4→400€, día 5→500€, día 6→600€, día 7→1000€). Se calcula en el servidor para evitar trampas. ✅ **HECHO**
* ✅ **Reciclaje / Desguace de objetos:** Botón "♻️ Reciclar" en la vitrina para objetos Comunes, Poco comunes, Raras y Épicas. Calcula el 20% del precio de salida con mínimos y máximos por rareza. ✅ **HECHO**
* ✅ **Recompensa por subir de nivel:** Al alcanzar niveles clave (5, 10, 15, 20, 25, 30, 40, 50, 75, 100) se otorgan monedas extra (desde 500€ hasta 50.000€). ✅ **HECHO**
* ✅ **Simulador de anuncios con diferenciación:** Botón +500€ (anuncio normal) y Recargar GOAT (anuncio premium de 1000€). Ambos con contador de 3 segundos y feedback visual. ✅ **HECHO**
* ✅ 15 logros/insignias desbloqueables (con vista en lista y notificaciones toast).
* ✅ Sistema de experiencia (XP) y niveles con títulos equipables (Lurker, Regular, Curador, Broker/Main Character, Whale, Final Boss/Admin)
* ✅ **Sistema de Rarezas completo (6 niveles):**
  * Común (gris, 55% prob, 1-1.000 €, 24h)
  * Poco común (verde, 30% prob, 500-2.000 €, 24h)
  * Rara (azul, 13% prob, 1.001-5.000 €, 24h)
  * Épica (lila, 5% prob, 5.001-10.000 €, 3 días)
  * Legendaria (naranja, 1% prob, 10.001-1.000.000 €, 7 días)
  * Mítica (roja, solo manual/evento, 1.000.001 €+, duración de evento)
* ✅ **Marcos y chips visuales por rareza** en catálogo y vista de detalle (incluyendo la corrección de espacios en "Poco común").
* ✅ **Último pujador visible** en cada tarjeta del catálogo (debajo del título).
* ✅ **Filtro "Novedades"** (🆕) que muestra solo las subastas creadas en las últimas 24 horas.
* ✅ **Generación automática de subastas:** Cron job cada 1 hora (24 subastas/día) con contador sincronizado.
* ✅ **Sistema de reliquidación:** Subastas sin pujas se vuelven a publicar con un 10% de descuento (mínimo 1 €).
* ✅ **Certificados automáticos:** Cada subasta ganada genera un código de certificado único.
* ✅ Metadata Flexible (JSONB) para efectos visuales y colecciones temáticas
* ✅ **Mercado C2C (Fase 1 completada):** Inventario, pestaña "🛒 Mercado C2C", botón "Vender en Mercado" en la vitrina. Compra directa con 30% de comisión, sistema de fianzas (10%) y comisiones por venta (20%).
* ✅ **Hall of Fame renovado (6 rankings):** El Más Rico, La Cabra, El Más Chetado, El Museo, El Más Old, El Más Broker. Con podios y descripciones.
* ✅ **Pestaña "📋 Mis pujas":** Lista ordenable con estado en tiempo real. **Mejora:** solo muestra la última puja por subasta (agrupación automática).
* ✅ **Botón de compartir en redes:** En la vista de detalle, botones para compartir en X (Twitter) y copiar enlace.
* ✅ **Barra de ordenación en catálogo:** Ordenar por fecha, duración, rareza o precio (ascendente/descendente).
* ✅ PWA (instalable en móvil como app)
* ✅ Modo GOAT (activación, recargas premium de 1000€, comentarios destacados)
* ✅ Buscador de subastas
* ✅ Pestaña de "Finalizadas" para ver subastas cerradas
* ✅ Modo oscuro/claro
* ✅ Subida de fotos para subastas (Storage de Supabase) con validación de tipo y tamaño
* ✅ Galería de imágenes en el detalle del producto
* ✅ Calculadora de economía (archivo aparte)
* ✅ Menús reorganizados
* ✅ **Textos legales completos y adaptados a LSSI-CE/RGPD** (Aviso Legal, Política de Privacidad, Política de Cookies)
* ✅ **Banner de fase beta**: `🚧 FASE BETA · PRUEBAS EN CURSO 🚧`
* ✅ **Banner de Beta Privada**: Con enlace a formulario de Google para feedback.
* ✅ **Modal de registro oportuno**: Solo se pide login al intentar pujar, no al entrar.
* ✅ **Google Analytics configurado** con ID `G-C30L0HE0L7`
* ✅ **Base de datos limpia** — Catálogo, pujas e inventario reseteado para empezar la beta desde cero.
* ✅ **Página de Ayuda / Tutorial / FAQ** con tutorial rápido, guía de rarezas, cómo ganar monedas y preguntas frecuentes. ✅ **HECHO**
* ✅ **Reemplazo de `alert()` por toasts** en toda la web (salvo algunos confirm críticos). ✅ **HECHO**
* ✅ **Feedback visual** (spinners y botones deshabilitados) durante acciones como pujar, anuncios, etc. ✅ **HECHO**
* ✅ **Actualización automática de la vitrina** tras vender, comprar o cancelar en el mercado. ✅ **HECHO**
* ✅ **Duraciones en panel admin:** 1 min, 1h, 6h, 24h, 3d, 7d, 14 días, 30 días. ✅ **HECHO**

## 🚧 Próximos pasos (Roadmap priorizado)

### Fase 2: Pulido UX/UI y Engagement Temprano (✅ COMPLETADA)

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
13. ✅ Controles Anti-Pay-to-Win básicos (pendiente de ajustes finos)

### Fase 3: Gamificación y Retención (Pendiente)

1. **Nuevos logros y corrección del duplicado** ⬜ Pendiente
2. **Ajuste de la economía (control de inflación)** ⬜ Pendiente
3. **Sistema de referidos** ⬜ Pendiente
4. **Personalización de avatar** ⬜ Pendiente
5. **Personalización de perfil** ⬜ Pendiente
6. **Beneficios por antigüedad** ⬜ Pendiente
7. **Vitrina Espectacular y Compartible** ⬜ Pendiente

### Fase 4: Monetización (cuando haya usuarios recurrentes)

1. **Integración de pagos con Stripe** ⬜ Pendiente
2. **Anuncios reales (Google AdSense)** ⬜ Pendiente
3. **Límite diario de compra de monedas** ⬜ Pendiente
4. **Subastas restringidas para novatos** ⬜ Pendiente
5. **Subastas inversas** ⬜ Pendiente
6. **Pases de temporada** ⬜ Pendiente

### Fase 5: Comunidad, Eventos, PVE y Equipamiento (Pendiente)

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

### Fase 6: Expansión Técnica y API (Pendiente)

1. **API REST de datos públicos** ⬜ Pendiente
2. **Firmas dinámicas y Widgets** ⬜ Pendiente
3. **Integraciones con terceros** ⬜ Pendiente
4. **Estrategia SEO y Posicionamiento** ⬜ Pendiente

### Fase 7: Análisis de Audiencia y Publicidad (Pendiente)

1. **Perfilado demográfico voluntario** ⬜ Pendiente
2. **Media Kit de Anunciantes** ⬜ Pendiente
3. **Misiones de patrocinadores y afiliación** ⬜ Pendiente
4. **Protección de datos** ⬜ Pendiente

### Fase 8: Equipamiento de Avatar y Stats (Pendiente)

1. **Sistema de inventario y equipamiento** ⬜ Pendiente
2. **Catálogo de objetos paródicos** ⬜ Pendiente
3. **Escalado de Stats** ⬜ Pendiente
4. **Manipulación de Bots** ⬜ Pendiente
5. **Economía y Cashbacks** ⬜ Pendiente
6. **Suerte y Progresión** ⬜ Pendiente
7. **Efectos Sociales y Cosméticos** ⬜ Pendiente
8. **Interfaz de Inventario estilo ARPG/Diablo** ⬜ Pendiente

## 💰 Modelo de monetización (planificado)

* **F2P (Gratis):** Usuarios ven anuncios limitados para conseguir moneda virtual.
* **Modo GOAT (Suscripción 3.99 €/mes):** Sin límites de anuncios, posibilidad de escribir comentarios en pujas, insignia exclusiva, y otras ventajas.
* **Tienda de monedas:** Compra directa de saldo virtual con Stripe.
* **Media Kit de Anunciantes:** Informes agregados de audiencia para vender patrocinios y acuerdos de afiliación.
* **Misiones de afiliación (Opt-in):** Recompensas por registro voluntario en ofertas de terceros.

## 📢 Redes Sociales y Estrategia de Lanzamiento

* **X (Twitter):** [@aBROzonsubastas](https://x.com/aBROzonsubastas) — Perfil oficial creado.
* **Beta Privada (5-10 usuarios):** Probar con amigos para encontrar bugs y pulir la experiencia.
* **Beta con Micro-streamers:** Si la beta privada funciona, invitar a streamers pequeños para medir la retención real.
* **Contenido viral:** Crear clips de subastas absurdas para TikTok/X.

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

### 🟢 Pulido final
- ✅ **Actualizar automáticamente la vitrina** después de vender o comprar.
- ⬜ **Optimizar el catálogo** (mejora futura, no crítica).
- ✅ **Añadir un banner visible de "Beta Privada"** con enlace a formulario de feedback.

**Estado actual: ¡LISTO PARA LANZAR LA BETA PRIVADA! 🚀**

---

## ⚠️ Notas para la IA

* **Soy un programador novato.** Necesito explicaciones paso a paso, sin tecnicismos innecesarios.
* El código principal está en un único archivo `index.html`.
* Para cambios pequeños, indicar texto exacto a buscar y reemplazo. Para cambios grandes, pasar archivo completo.
* No acortar el código al pasarlo completo.
* La web se despliega en GitHub Pages. Errores comunes: caché, `.nojekyll`, sintaxis.
