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

### Funciones RPC (backend)

* `place_bid`, `add_ad_reward`, `check_and_close_auction`, `unlock_achievement`, `admin_buscar_usuario`, `admin_set_saldo`, `admin_toggle_ban`, `admin_delete_auction`, `create_auction`, `get_daily_missions`, `get_hall_of_fame`, `increment_min_bid`, `increment_custom_bid`, `increment_ad_mission`, `increment_category_bid`, `toggle_goat`, `reclamar_bonus_diario`, `username_disponible`, `actualizar_mi_alias`, `admin_listar_usuarios`, `add_xp`, `admin_add_category`, `admin_delete_category`
* **Mercado C2C:** `vender_en_mercado`, `cerrar_subasta_mercado`, `comprar_directo`, `admin_forzar_cierre_y_adjudicar`

### Seguridad

* Row Level Security (RLS) activo con políticas personalizadas.
* Las funciones RPC sensibles usan `SECURITY DEFINER` para ejecutar la lógica de negocio en el servidor, no en el navegador del cliente.
* *A futuro (cuando se integren pagos reales):* Se planea añadir `FOR UPDATE` en funciones de puja para evitar condiciones de carrera, y migrar lógica crítica a Edge Functions.

## ✨ Funcionalidades implementadas

* ✅ Registro/login con email (Supabase Auth + recuperación de contraseña)
* ✅ Subastas en tiempo real (pujas, temporizadores con días/horas, cierre automático con `check_and_close_auction` al visitar el catálogo)
* ✅ Panel de administración (crear/eliminar subastas, gestionar usuarios, ver lista completa, banear, fijar saldo, añadir/eliminar categorías dinámicas, adjudicar subastas al admin para pruebas)
* ✅ Sistema de misiones diarias (bono diario, pujas mínimas, puja personalizada, ver anuncios, explorar categorías)
* ✅ 15 logros/insignias desbloqueables (actualmente, con vista en lista y notificaciones toast). *Pendiente de revisión:* se detectó duplicado ("Bugueado" y "Margin Call" premiaban lo mismo). Se planea ampliar a ~21 logros con temática de jerga Z/Alpha (Glow Up, Inversor Nato, A Full, etc.).
* ✅ Sistema de experiencia (XP) y niveles con títulos equipables (Lurker, Regular, Curador, Broker/Main Character, Whale, Final Boss/Admin)
* ✅ Sistema de Rarezas (Común/Rara/Épica/Legendaria) y Metadata Flexible (JSONB) para efectos visuales y colecciones temáticas
* ✅ **Mercado C2C (Fase 1):** inventario de usuarios, pestaña "🛒 Mercado C2C", botón "Vender en Mercado" en la vitrina, compra directa con 30% de comisión, sistema de fianzas (10%) y comisiones por venta (20%)
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

## 🚧 Próximos pasos (Roadmap priorizado para MVP)

### Fase 1: MVP sólido y gratuito (para testear con 5 amigos)

1. **Automatización de cierres de subasta (Cron Job)** ⬜ Pendiente
* Crear una función RPC (`cron_check_auctions`) en Supabase que revise y cierre subastas caducadas.
* Usar un servicio externo gratuito (`cron-job.org`) para ejecutarla cada minuto.
* *Objetivo:* La web funciona 24/7 sin intervención manual.


2. **Vitrina Espectacular y Compartible** ⬜ Pendiente
* Efectos visuales CSS por rareza (brillo azul, holográfico, dorado con partículas).
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
* Suscripción GOAT premium (3.99 €/mes) con ventajas (más anuncios, comentarios en pujas, chapa dorada).
* Tienda de monedas/tokens para comprar saldo virtual con dinero real.


2. **Anuncios reales (Google AdSense)** ⬜ Pendiente
* Reemplazar los anuncios simulados por anuncios reales para monetizar a los usuarios F2P.


3. **Mejoras de seguridad/arquitectura (para producción con pagos)** ⬜ Pendiente
* Implementar `FOR UPDATE` en funciones de puja para evitar condiciones de carrera en subastas.
* Evaluar dividir el `index.html` en módulos JS si el mantenimiento se vuelve complejo.



### Ideas futuras (post-MVP)

* Categoría Legacy / Rage Comics (memes antiguos).
* Misiones sociales (compartir, visitar streamer).
* Dashboard de administrador con estadísticas.
* Colecciones temáticas y eventos especiales.
* Navegación con hash (#) para que funcione la flecha de retroceder del navegador.

## 💰 Modelo de monetización (planificado)

* **F2P (Gratis):** Usuarios ven anuncios limitados para conseguir moneda virtual.
* **Modo GOAT (Suscripción 3.99 €/mes):** Sin límites de anuncios, posibilidad de escribir comentarios en pujas, insignia exclusiva, y otras ventajas.
* **Tienda de monedas:** Compra directa de saldo virtual con Stripe.

## 🌐 Dominio

* **Dominio deseado:** `aBROzon.com` (pendiente de compra tras validar el MVP con testers).
* **URL actual:** [https://jdanielhl1984-commits.github.io/abrozon-subastas/](https://jdanielhl1984-commits.github.io/abrozon-subastas/)

## ⚠️ Notas para la IA

* **Soy un programador novato.** Necesito explicaciones paso a paso, sin tecnicismos innecesarios. Si algún concepto es complejo, por favor, tradúcemelo a un lenguaje sencillo.
* El código principal está en un único archivo `index.html`. Se puede leer completo si es necesario, pero para cambios pequeños prefiero editar fragmentos con el método de "buscar y reemplazar".
* La web se despliega en GitHub Pages. Si hay errores de despliegue, suele ser por la caché del navegador, por falta del archivo `.nojekyll`, o por un error de sintaxis en el HTML/JS.
* **No acortar el código** cuando me pases el archivo completo. Prefiero copiar y pegar el archivo entero aunque sea largo.
* **Forma de trabajar preferida:** Para cambios pequeños, indicar el texto exacto a buscar y su reemplazo (edición quirúrgica). Para cambios grandes (muchas partes tocadas o nuevo sistema), pasar el archivo `index.html` completo verificado.
