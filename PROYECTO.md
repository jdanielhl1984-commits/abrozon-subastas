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

### Funciones RPC (backend)
- `place_bid`, `add_ad_reward`, `check_and_close_auction`, `unlock_achievement`, `admin_buscar_usuario`, `admin_set_saldo`, `admin_toggle_ban`, `admin_delete_auction`, `create_auction`, `get_daily_missions`, `get_hall_of_fame`, `increment_min_bid`, `increment_custom_bid`, `increment_ad_mission`, `increment_category_bid`, `toggle_goat`, `reclamar_bonus_diario`, `username_disponible`, `actualizar_mi_alias`, `admin_listar_usuarios`, `add_xp`, `admin_add_category`, `admin_delete_category`

### Seguridad
- Row Level Security (RLS) activo con políticas personalizadas para proteger los datos de los usuarios.

## ✨ Funcionalidades implementadas
- ✅ Registro/login con email (Supabase Auth + recuperación de contraseña)
- ✅ Subastas en tiempo real (pujas, temporizadores con días/horas, cierre automático)
- ✅ Panel de administración (crear/eliminar subastas, gestionar usuarios, ver lista completa de usuarios, banear, fijar saldo, añadir/eliminar categorías dinámicas)
- ✅ Sistema de misiones diarias (bono diario, pujas mínimas, puja personalizada, ver anuncios, explorar categorías)
- ✅ 16 logros/insignias desbloqueables (con vista en lista y notificaciones toast)
- ✅ Sistema de experiencia (XP) y niveles con títulos equipables (Lurker, Regular, Curador, Broker/Main Character, Whale, Final Boss/Admin)
- ✅ Hall of Fame (rankings de ganadores, gastadores y coleccionistas) – se actualiza cada 30 s
- ✅ PWA (instalable en móvil como app)
- ✅ Modo GOAT (activación, recargas, comentarios destacados)
- ✅ Buscador de subastas
- ✅ Pestaña de "Finalizadas" para ver subastas cerradas
- ✅ Modo oscuro/claro
- ✅ Subida de fotos para subastas (Storage de Supabase)
- ✅ Galería de imágenes en el detalle del producto
- ✅ Calculadora de economía (archivo aparte)
- ✅ Barra de navegación reorganizada: categorías dinámicas en menú desplegable, pestañas con scroll horizontal, Hall of Fame y Misiones/Logros en pestañas principales + menú de usuario

## 🚧 Próximos pasos (roadmap actualizado)

1. **Ajuste de la economía** (control de inflación)
   - Limitar anuncios diarios y recargas GOAT usando la calculadora.
   - Ajustar recompensas de misiones.

2. ~~**Sistema de experiencia (XP), niveles y títulos equipables**~~ → ✅ HECHO
   - ~~Ganar XP pujando, ganando subastas, completando misiones, etc.~~
   - ~~Títulos desbloqueables por nivel (Lurker, Regular, Broker, Whale, Final Boss).~~
   - ~~Títulos visibles en el historial de pujas y en el ranking.~~
   - ~~Misiones de progreso: "Gana 500 XP en un día", "Gana 3.000 XP en una semana".~~

3. **Categoría Legacy / Rage Comics (memes antiguos)**
   - Subastas de coleccionables clásicos de internet (Trollface, Forever Alone...).
   - Rareza "Legacy" con diseño retro en la vitrina.
   - Set bonus: reunir la colección completa otorga el título "Vieja Guardia".

4. **Mercado C2C (Sub-a-bro-sta entre jugadores)**
   - Usuarios pueden vender sus propios coleccionables.
   - Fianza por publicar (10% del precio de salida, se devuelve si se vende, se quema si no).
   - Comisión de venta del 20% para la plataforma (se destruye para frenar la inflación).
   - Eventos de "Lunes de Mercado Libre" con comisiones reducidas.
   - Ventajas para suscriptores GOAT.

5. **Misiones sociales**
   - Compartir subasta activa en redes.
   - Visitar el canal del streamer parodiado.

6. **Dashboard de administrador con estadísticas**
   - Usuarios registrados, subastas activas, dinero en circulación, etc.

## ⚠️ Notas para la IA
- **Soy un programador novato.** Necesito explicaciones paso a paso, sin tecnicismos innecesarios. Si algún concepto es complejo, por favor, tradúcemelo a un lenguaje sencillo.
- El código principal está en un único archivo `index.html`. Se puede leer completo si es necesario, pero para cambios pequeños prefiero editar fragmentos con el método de "buscar y reemplazar".
- La web se despliega en GitHub Pages. Si hay errores de despliegue, suele ser por la caché del navegador, por falta del archivo `.nojekyll`, o por un error de sintaxis en el HTML/JS.
- **No acortar el código** cuando me pases el archivo completo. Prefiero copiar y pegar el archivo entero aunque sea largo.
- **Forma de trabajar preferida:** Para cambios pequeños, indicar el texto exacto a buscar y su reemplazo (edición quirúrgica). Para cambios grandes (muchas partes tocadas o nuevo sistema), pasar el archivo `index.html` completo verificado.
