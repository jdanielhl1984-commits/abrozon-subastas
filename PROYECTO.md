# 🚀 aBROzon.subastas

**Descripción breve:** Web de subastas de broma con moneda ficticia, misiones, logros, rankings y PWA. Parodia de Amazon + Catawiki, temática de streamers y fútbol.

---

## 🛠 Tecnologías

* **Frontend:** HTML, CSS, JavaScript (un solo archivo `index.html` principal)
* **Backend:** Supabase (PostgreSQL, Auth, Realtime, Storage)
* **Despliegue:** GitHub Pages (con archivo `.nojekyll` para evitar errores de Jekyll)

---

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
- `generar_subasta_automatica` → Genera subastas automáticas cada hora (con porcentajes de rareza ajustados).

**Economía y recompensas:**
- `add_ad_reward` → Da recompensa por ver anuncios (500€ normal, 1000€ GOAT).
- `add_mission_reward` → Da recompensa al completar misiones (150€, 200€, 250€, 300€).
- `add_xp` → Suma XP, con recompensa por subir de nivel.
- `reclamar_bonus_diario` → Reclama el bono de 1.000€ al completar todas las misiones.
- `check_streak_and_reward` → Controla la racha de inicio de sesión (7 días con recompensas crecientes).

**Inventario y mercado:**
- `vender_en_mercado` → Publica un objeto en el mercado C2C.
- `comprar_directo` → Compra directa con 30% de comisión.
- `cancelar_venta_mercado` → Cancela una venta (no devuelve fianza).
- `desguazar_objeto` → Recicla objetos (Comunes, Poco comunes, Raras y Épicas) a cambio de monedas (20% del precio con mín/máx).

**Administración (protegidas con `is_admin`):**
- `admin_buscar_usuario`, `admin_set_saldo`, `admin_toggle_ban`
- `admin_delete_auction`, `admin_forzar_cierre_y_adjudicar`
- `admin_listar_usuarios`, `admin_add_category`, `admin_delete_category`

**Utilidades y gamificación:**
- `unlock_achievement` → Desbloquea logros.
- `toggle_goat` → Activa/desactiva el modo GOAT.
- `get_daily_missions` → Obtiene el progreso de misiones diarias.
- `get_hall_of_fame` → Devuelve los rankings del Hall of Fame.
- `increment_min_bid`, `increment_custom_bid`, `increment_ad_mission`, `increment_category_bid` → Control de misiones diarias.
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
- ✅ Cierre automático con `check_and_close_auction` al visitar el catálogo
- ✅ Sistema de rarezas completo (6 niveles con colores y chips visuales)
- ✅ Último pujador visible en cada tarjeta
- ✅ Filtro "Novedades" (últimas 24 horas)
- ✅ Barra de ordenación (fecha, duración, rareza, precio)
- ✅ Buscador de subastas
- ✅ Pestaña "Finalizadas" para ver subastas cerradas
- ✅ Certificados automáticos con código único al ganar una subasta

### 🎮 Gamificación y progreso
- ✅ Sistema de XP y niveles (Lurker → Final Boss/Admin)
- ✅ **Recompensa por subir de nivel** (monedas extra al alcanzar niveles clave: 5, 10, 15, 20, 25, 30, 40, 50, 75, 100)
- ✅ 15 logros/insignias desbloqueables (con notificaciones toast)
- ✅ Racha de inicio de sesión (Streak Bonus de 7 días: 100€ → 1000€)
- ✅ Misiones diarias (4 misiones + bono de 1.000€ al completarlas todas)
- ✅ Modo GOAT (activación, recargas premium de 1000€, comentarios en pujas)

### 🛒 Mercado C2C e inventario
- ✅ Inventario de usuarios (vitrina)
- ✅ Publicar objetos en el mercado (con fianzas del 10%)
- ✅ Compra directa con 30% de comisión
- ✅ Cancelar venta (no devuelve fianza)
- ✅ **Reciclaje/Desguace de objetos:** Comunes, Poco comunes, Raras y Épicas (20% del precio con mín/máx)
- ✅ Actualización automática de la vitrina tras vender/comprar/reciclar

### 🏆 Rankings y comunidad
- ✅ Hall of Fame renovado (6 rankings con podios)
- ✅ Pestaña "Mis pujas" (solo muestra la última puja por subasta)
- ✅ Botones de compartir en X y copiar enlace

### 🎨 Interfaz y experiencia
- ✅ Modo oscuro/claro
- ✅ PWA instalable (manifest.json + service-worker)
- ✅ Página de Ayuda/Tutorial/FAQ (pestaña "❓ Ayuda")
- ✅ Banner de beta privada con enlace a formulario de feedback
- ✅ Reemplazo de `alert()` por toasts (notificaciones emergentes)
- ✅ Feedback visual (spinners y botones deshabilitados durante acciones)

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

## 🚧 Próximos pasos (Roadmap futuro)

### Fase 3: Gamificación y Retención (Pendiente)
- [ ] Nuevos logros y corrección del duplicado ("Bugueado" y "Margin Call")
- [ ] Ajuste de la economía (control de inflación)
- [ ] Sistema de referidos
- [ ] Personalización de avatar y perfil
- [ ] Beneficios por antigüedad
- [ ] Vitrina espectacular y compartible (efectos CSS por rareza)

### Fase 4: Monetización (cuando haya usuarios recurrentes)
- [ ] Integración de pagos con Stripe
- [ ] Anuncios reales (Google AdSense)
- [ ] Límite diario de compra de monedas
- [ ] Subastas restringidas para novatos
- [ ] Subastas inversas
- [ ] Pases de temporada

### Fase 5: Comunidad, Eventos, PVE y Equipamiento
- [ ] Eventos y desafíos temporales
- [ ] Votaciones comunitarias
- [ ] Sorteos y donaciones
- [ ] Arena PVE "Subasta contra Bots"
- [ ] Zona Raid PVE (farmeo hardcore)
- [ ] Colección Temática "Jägger Lore"
- [ ] Foro / Tablón de anuncios comunitario
- [ ] Sistema de trueque entre usuarios

### Fase 6: Expansión Técnica y API
- [ ] API REST de datos públicos
- [ ] Firmas dinámicas y Widgets
- [ ] Estrategia SEO y posicionamiento

### Fase 7: Análisis de Audiencia y Publicidad
- [ ] Perfilado demográfico voluntario
- [ ] Media Kit de Anunciantes
- [ ] Misiones de patrocinadores y afiliación

### Fase 8: Equipamiento de Avatar y Stats (Loot Freak)
- [ ] Sistema de inventario y equipamiento
- [ ] Catálogo de objetos paródicos
- [ ] Escalado de Stats y manipulación de Bots
- [ ] Efectos sociales y cosméticos

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

## ⚠️ Notas para la IA

* **Soy un programador novato.** Necesito explicaciones paso a paso, sin tecnicismos innecesarios.
* El código principal está en un único archivo `index.html`.
* Para cambios pequeños, indicar texto exacto a buscar y reemplazo.
* Para cambios grandes, pasar archivo completo verificado.
* No acortar el código al pasarlo completo.
* La web se despliega en GitHub Pages. Errores comunes: caché, `.nojekyll`, sintaxis.

---

## ✅ Estado actual: ¡LISTO PARA LANZAR LA BETA PRIVADA! 🚀

Todas las tareas críticas están completadas:
- ✅ Racha de inicio de sesión
- ✅ Reciclaje/Desguace de objetos
- ✅ Recompensa por subir de nivel
- ✅ Anuncios simulados (500€ normal, 1000€ GOAT)
- ✅ Panel admin protegido
- ✅ Página de ayuda/tutorial
- ✅ Toasts y feedback visual
- ✅ Banner de beta con formulario
- ✅ RPCs: `add_mission_reward`, `desguazar_objeto`, `check_streak_and_reward`, etc.

**Próximo paso: Compartir `https://abrozon.com` con los primeros usuarios.** 🎉
