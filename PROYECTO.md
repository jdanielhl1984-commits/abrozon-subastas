# 🚀 aBROzon.subastas

**Descripción breve:** Web de subastas de broma con moneda ficticia, misiones, logros, rankings y PWA. Parodia de Amazon + Catawiki, temática de streamers y fútbol.

## 🛠 Tecnologías
- **Frontend:** HTML, CSS, JavaScript (un solo archivo `index.html` principal)
- **Backend:** Supabase (PostgreSQL, Auth, Realtime, Storage)
- **Despliegue:** GitHub Pages (con archivo `.nojekyll` para evitar errores de Jekyll)

## 📁 Estructura del proyecto
- `index.html` → Toda la aplicación (frontend + lógica)
- `calculadora.html` → Calculadora de economía independiente (abrir en navegador)
- `manifest.json`, `service-worker.js` → PWA
- `icon-192.png`, `icon-512.png` → Iconos de la PWA (un símbolo "A")
- `.nojekyll` → Archivo vacío para que GitHub Pages no use Jekyll

## 🗃 Base de datos (Supabase)
### Tablas principales
- `profiles`, `auctions`, `bids`, `user_achievements`
- `daily_bid_counts`, `daily_custom_bids`, `daily_ad_views_mission`, `daily_category_bids`
- `categories` (nombre, icono; dinámica desde admin)
- `user_items` (inventario de objetos de cada usuario, relaciona `user_id` con `auction_id`)

### Funciones RPC (backend)
- `place_bid`, `add_ad_reward`, `check_and_close_auction`, `unlock_achievement`, `admin_buscar_usuario`, `admin_set_saldo`, `admin_toggle_ban`, `admin_delete_auction`, `create_auction`, `get_daily_missions`, `get_hall_of_fame`, `increment_min_bid`, `increment_custom_bid`, `increment_ad_mission`, `increment_category_bid`, `toggle_goat`, `reclamar_bonus_diario`, `username_disponible`, `actualizar_mi_alias`, `admin_listar_usuarios`, `add_xp`, `admin_add_category`, `admin_delete_category`
- **Nuevas (Mercado C2C):** `vender_en_mercado`, `cerrar_subasta_mercado`, `comprar_directo`, `admin_forzar_cierre_y_adjudicar`

### Seguridad
- Row Level Security (RLS) activo con políticas personalizadas para proteger los datos de los usuarios.

## ✨ Funcionalidades implementadas
- ✅ Registro/login con email (Supabase Auth + recuperación de contraseña)
- ✅ Subastas en tiempo real (pujas, temporizadores con días/horas, cierre automático)
- ✅ Panel de administración (crear/eliminar subastas, gestionar usuarios, ver lista completa de usuarios, banear, fijar saldo, añadir/eliminar categorías dinámicas, adjudicar subastas al admin para pruebas)
- ✅ Sistema de misiones diarias (bono diario, pujas mínimas, puja personalizada, ver anuncios, explorar categorías)
- ✅ 16 logros/insignias desbloqueables (con vista en lista y notificaciones toast)
- ✅ Sistema de experiencia (XP) y niveles con títulos equipables (Lurker, Regular, Curador, Broker/Main Character, Whale, Final Boss/Admin)
- ✅ Sistema de Rarezas (Común/Rara/Épica/Legendaria) y Metadata Flexible (JSONB) para efectos visuales y colecciones temáticas
- ✅ **Mercado C2C (Fase 1):** inventario de usuarios, pestaña "🛒 Mercado C2C", botón "Vender en Mercado" en la vitrina, compra directa con 30% de comisión, sistema de fianzas (10%) y comisiones por venta (20%)
- ✅ Hall of Fame (rankings de ganadores, gastadores y coleccionistas) – se actualiza cada 30 s
- ✅ PWA (instalable en móvil como app)
- ✅ Modo GOAT (activación, recargas, comentarios destacados)
- ✅ Buscador de subastas
- ✅ Pestaña de "Finalizadas" para ver subastas cerradas
- ✅ Modo oscuro/claro
- ✅ Subida de fotos para subastas (Storage de Supabase)
- ✅ Galería de imágenes en el detalle del producto
- ✅ Calculadora de economía (archivo aparte)

## 🚧 Próximos pasos (roadmap actualizado)

1. **Ajuste de la economía** (control de inflación) ⬜
   - Limitar anuncios diarios y recargas GOAT usando la calculadora.
   - Ajustar recompensas de misiones.

2. ~~**Sistema de experiencia (XP), niveles y títulos equipables**~~ → ✅ HECHO

3. ~~**Sistema de Rarezas y Metadata Flexible**~~ → ✅ HECHO

4. ~~**Mercado C2C (Fase 1)**~~ → ✅ HECHO

5. **Vitrina Espectacular y Compartible** ⬜ Pendiente
   - Efectos visuales CSS por rareza (brillo azul, holográfico, dorado con partículas).
   - Numeración de serie visible en Legendarias.
   - Botón de compartir vitrina en redes sociales.

6. **Automatización de Subastas (Cron Job)** ⬜ Pendiente

7. **Categoría Legacy / Rage Comics (memes antiguos)** ⬜ Pendiente

8. **Misiones sociales** (compartir, visitar streamer) ⬜ Pendiente

9. **Dashboard de administrador con estadísticas** ⬜ Pendiente

## ⚠️ Notas para la IA
- **Soy un programador novato.** Necesito explicaciones paso a paso, sin tecnicismos innecesarios. Si algún concepto es complejo, por favor, tradúcemelo a un lenguaje sencillo.
- El código principal está en un único archivo `index.html`. Se puede leer completo si es necesario, pero para cambios pequeños prefiero editar fragmentos con el método de "buscar y reemplazar".
- La web se despliega en GitHub Pages. Si hay errores de despliegue, suele ser por la caché del navegador, por falta del archivo `.nojekyll`, o por un error de sintaxis en el HTML/JS.
- **No acortar el código** cuando me pases el archivo completo. Prefiero copiar y pegar el archivo entero aunque sea largo.
- **Forma de trabajar preferida:** Para cambios pequeños, indicar el texto exacto a buscar y su reemplazo (edición quirúrgica). Para cambios grandes (muchas partes tocadas o nuevo sistema), pasar el archivo `index.html` completo verificado.
