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

* `profiles` (usuarios con saldo, XP, nivel, racha, fechas de botín/racha, etc.)
* `auctions` (subastas activas/finalizadas)
* `bids` (historial de pujas, incluye pujas de invitados con `is_guest` y `user_id` NULL)
* `user_achievements` (logros desbloqueados)
* `favorites` (subastas favoritas de cada usuario)
* `daily_bid_counts`, `daily_custom_bids`, `daily_ad_views_mission`, `daily_category_bids` (misiones diarias)
* `categories` (categorías dinámicas desde admin)
* `user_items` (inventario de objetos de cada usuario)
* `objetos_automaticos` (catálogo para generación automática de subastas)

### Funciones RPC (backend)

**Subastas y pujas:**
- `place_bid` → Realiza una puja con bloqueo atómico (solo usuarios registrados).
- `place_guest_bid` → Realiza una puja como invitado (sin autenticación).
- `migrate_guest_bids` → Migra pujas de invitado a una cuenta real al registrarse.
- `check_and_close_auction` → Cierra subastas expiradas y genera certificados.
- `create_auction` → Crea una subasta (desde admin).
- `generar_subasta_automatica` → Genera subastas automáticas cada hora.

**Economía y recompensas:**
- `add_ad_reward` → Da recompensa por ver anuncios (500€ normal, 1000€ GOAT).
- `add_mission_reward` → Da recompensa al completar misiones.
- `add_xp` → Suma XP, con recompensa por subir de nivel.
- `reclamar_bonus_diario` → Reclama el bono de 1.000€ al completar misiones.
- `check_streak_and_reward` → Controla la racha de inicio de sesión. Devuelve JSON.
- `reclamar_botin_diario` → Ruleta diaria con premios de 50€ a 1000€. Devuelve JSON.

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

**Funciones y triggers automáticos:**
- `handle_new_user()` → Crea automáticamente la fila en `profiles` al registrarse.
- Trigger `on_auth_user_created` → Ejecuta `handle_new_user()` tras cada registro.

---

## 🔒 Seguridad

* **Row Level Security (RLS):** Activo en todas las tablas.
  * `profiles`: `(auth.uid() = id)` — Cada usuario solo ve su propia fila.
  * `auctions` y `bids`: Lectura pública (catálogo visible).
  * `favorites`: Solo el propio usuario puede ver/crear/eliminar sus favoritos.
* **Funciones RPC:** Usan `SECURITY DEFINER` para ejecutar lógica financiera en el servidor.
* **Prevención de Race Conditions:** `place_bid` usa `FOR UPDATE` para evitar duplicados.
* **RPCs de administrador protegidas:** Todas las funciones `admin_*` verifican `is_admin = true`.
* **Pujas de invitado:** `place_guest_bid` permite `user_id` NULL y usa `p_guest_name`.
* **Creación automática de perfil:** Trigger `on_auth_user_created` + política RLS de INSERT.

---

## ✨ Funcionalidades implementadas

### 🔐 Autenticación y usuarios
- ✅ Registro/login **solo con alias y contraseña** (email interno `alias@abrozon.beta`)
- ✅ Sin verificación de email durante la beta (`Confirm email` desactivado)
- ✅ Creación automática del perfil mediante trigger `handle_new_user`
- ✅ Modo Invitado: saldo temporal de **1.000 €** y hasta 3 pujas
- ✅ Registro diferido
- ✅ Migración de datos del invitado al registrarse
- ✅ Cambio de alias y contraseña desde perfil
- ✅ Zona de baja de cuenta (contacto por email)

### 🏛️ Subastas y catálogo
- ✅ Subastas en tiempo real
- ✅ Cierre automático al visitar el catálogo
- ✅ Sistema de rarezas (6 niveles)
- ✅ Último pujador visible
- ✅ Filtro "Novedades"
- ✅ Barra de ordenación
- ✅ Buscador sin acentos
- ✅ Pestaña "Finalizadas"
- ✅ Certificados automáticos

### ❤️ Favoritos (Watchlist)
- ✅ Botón de corazón en tarjetas
- ✅ Solo visible para usuarios registrados
- ✅ Pestaña "Mis Favoritos"
- ✅ Actualización dinámica
- ✅ Corrección de errores 406 con `.maybeSingle()`

### 💬 Historial de Pujas (Live Feed)
- ✅ Reubicado junto al botón de puja
- ✅ Scroll interno y auto-scroll
- ✅ Animación de entrada
- ✅ Mensajes GOAT con burbuja
- ✅ Límite de 80 caracteres
- ✅ Pujas de invitado visibles

### 🎮 Gamificación y progreso
- ✅ Sistema de XP y niveles
- ✅ Recompensa por subir de nivel
- ✅ 30 logros/insignias
- ✅ Verificación retroactiva de logros
- ✅ Racha diaria (Streak Bonus de 7 días) con notificación
- ✅ Misiones diarias (4 + bono)
- ✅ Botín Diario (Ruleta) con contador y notificación
- ✅ Modo GOAT

### 🛒 Mercado C2C e inventario
- ✅ Vitrina de objetos
- ✅ Publicar en mercado
- ✅ Compra directa
- ✅ Cancelar venta
- ✅ Reciclaje/Desguace
- ✅ Confirmación antes de reciclar
- ✅ Actualización automática
- ✅ Efectos visuales según rareza

### 🏆 Rankings y comunidad
- ✅ Hall of Fame (6 rankings)
- ✅ Corrección ranking "Broker"
- ✅ Pestaña "Mis pujas"
- ✅ **Pestaña "Superadas"**
- ✅ **Paginación en Mis Pujas**
- ✅ Botones de compartir
- ✅ Sistema de notificaciones persistente

### 🎨 Interfaz y experiencia
- ✅ Modo oscuro/claro
- ✅ PWA instalable
- ✅ Página de Ayuda/Tutorial/FAQ
- ✅ Banner de **Beta Abierta**
- ✅ Toasts en lugar de `alert()`
- ✅ Feedback visual
- ✅ Evitar spam de toasts
- ✅ Corrección doble símbolo €
- ✅ Scrollbars personalizados
- ✅ Tooltips en botones
- ✅ Header compacto rediseñado
- ✅ Fix overflow horizontal móvil
- ✅ Consola sin errores

### 🛠️ Administración
- ✅ Panel completo
- ✅ Corrección error al eliminar categorías

### 🤖 Automatización
- ✅ Generación automática de subastas
- ✅ Contador de próxima subasta
- ✅ Reliquidación selectiva
- ✅ Metadata flexible
- ✅ Categoría "Velada de Boxeo"
- ✅ Lógica de rarezas corregida
- ✅ Tabla `objetos_automaticos` con 242 objetos

### 📜 Legal y compliance
- ✅ Textos legales completos
- ✅ Titular persona física
- ✅ Google Analytics

---

## 🚧 Roadmap actualizado

### ✅ Fase 1: MVP (COMPLETADA)

Autenticación, subastas, pujas, mercado básico y panel admin.

**Incluye:**
- Registro/login con email
- Creación de subastas manuales
- Pujas básicas
- Panel de administración inicial
- Mercado C2C básico
- Vitrina de objetos
- Certificados automáticos
- Sistema de rarezas

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
13. ✅ Controles Anti-Pay-to-Win básicos
14. ✅ Botín Diario (Ruleta)
15. ✅ Sistema de notificaciones

### ✅ Fase 2.5: Correcciones Beta (COMPLETADA)

1. ✅ Modo Invitado y Registro Diferido (Lazy Registration)
2. ✅ Buscador sin acentos
3. ✅ Corrección doble símbolo €
4. ✅ Historial de pujas reubicado (Live Feed)
5. ✅ Límite de 80 caracteres en mensajes GOAT
6. ✅ Sistema de Favoritos (Watchlist)
7. ✅ Scrollbars personalizados
8. ✅ Tooltips en botones de cabecera
9. ✅ Confirmación para reciclar objetos
10. ✅ Pujas de invitado visibles en historial
11. ✅ Migración de pujas al registrarse
12. ✅ Corrección errores 406 en favoritos
13. ✅ Cron job configurado con pg_cron
14. ✅ Lógica de rarezas corregida
15. ✅ Saldo de invitado aumentado a 1.000 €
16. ✅ Corrección ranking "Broker" en HoF (NaN €)
17. ✅ Ruleta con contador visual de tiempo restante
18. ✅ Header compacto rediseñado
19. ✅ Corrección error al eliminar categorías (SQL duplicado)
20. ✅ Eliminadas categorías vacías (oldmemes, streamers)
21. ✅ Registro solo con alias y contraseña (sin email real)
22. ✅ Trigger automático de perfil al registrarse
23. ✅ Notificaciones persistentes en campanita
24. ✅ Pestaña "Superadas" en Mis Pujas
25. ✅ Paginación en Mis Pujas
26. ✅ Fix overflow horizontal móvil
27. ✅ Megamenú estilo Amazon
28. ✅ Chips de categorías ocultos
29. ✅ Reliquidación selectiva

---

### ⬜ Fase 3: Gamificación y Retención (PENDIENTE)

1. **Ajuste de la economía (control de inflación)** ⬜ Pendiente
2. **Sistema de referidos** ⬜ Pendiente
3. **Personalización de avatar** ⬜ Pendiente
4. **Personalización de perfil** ⬜ Pendiente
5. **Beneficios por antigüedad** ⬜ Pendiente
6. **Vitrina Espectacular y Compartible** ⬜ Pendiente
7. **Notificaciones push/email** ⬜ Pendiente

### 💡 Nuevas ideas priorizadas para Fase 3

#### 🎰 Ruleta de Objetos (Loot Box Paródica)
- Gastar monedas por objetos aleatorios
- 1 giro gratis diario + giros extra
- Modo Dorado con mejores probabilidades
- Sumidero de monedas para controlar inflación

#### 📦 Colecciones de Rarezas (Sets)
- Agrupar objetos por nombre base
- Recompensa al completar todas las rarezas
- Insignias de coleccionista

#### ⚡ Subastas Relámpago
- 5 minutos de duración
- Generan urgencia y FOMO

#### 🎯 Pujas de Último Segundo
- Extensión de 30s al pujar al final
- Evita el sniping

#### 👻 Modo Fantasma
- Ocultar último pujador
- Añade misterio

#### 🌍 Retos Diarios de Comunidad
- Objetivos colectivos con recompensa
- Fomenta actividad

#### 🖼️ Títulos y Marcos de Perfil
- Cosméticos desbloqueables
- Personalización

#### 🍀 Modo Duende
- Precio secreto reducido una vez al día

---

### ⬜ Fase 4: Monetización (PENDIENTE)

1. **Integración de pagos con Stripe** ⬜ Pendiente
2. **Anuncios reales (Google AdSense)** ⬜ Pendiente
3. **Límite diario de compra de monedas** ⬜ Pendiente
4. **Subastas restringidas para novatos** ⬜ Pendiente
5. **Subastas inversas** ⬜ Pendiente
6. **Pases de temporada** ⬜ Pendiente

---

### ⬜ Fase 5: Comunidad, Eventos, PVE y Equipamiento (PENDIENTE)

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

### ⬜ Fase 6: Expansión Técnica y API (PENDIENTE)

1. **API REST de datos públicos** ⬜ Pendiente
2. **Firmas dinámicas y Widgets** ⬜ Pendiente
3. **Integraciones con terceros** ⬜ Pendiente
4. **Estrategia SEO y Posicionamiento** ⬜ Pendiente

---

### ⬜ Fase 7: Análisis de Audiencia y Publicidad (PENDIENTE)

1. **Perfilado demográfico voluntario** ⬜ Pendiente
2. **Media Kit de Anunciantes** ⬜ Pendiente
3. **Misiones de patrocinadores y afiliación** ⬜ Pendiente
4. **Protección de datos** ⬜ Pendiente

---

### ⬜ Fase 8: Equipamiento de Avatar y Stats (PENDIENTE)

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
* **Beta Abierta:** Cualquiera puede entrar y probar sin invitación.
* **Beta con Micro-streamers:** Invitar a streamers pequeños para medir retención.
* **Contenido viral:** Crear clips de subastas absurdas para TikTok/X.
* **Estrategia de confianza:** Publicar vídeos mostrando la web antes de pedir clics.
* **Ideas de distribución orgánica:**
  - Publicar clips en TikTok/Reels/Shorts.
  - Compartir en comunidades de streamers (Discord, Reddit, Telegram).
  - Invitar a micro-streamers (50-500 viewers).
  - Crear polémica sana con objetos absurdos.
  - Ser constante: 1 vídeo o tweet al día durante 2 semanas.

---

## 🌐 Dominio

* **Dominio:** `abrozon.com` — Comprado y conectado a GitHub Pages.
* **HTTPS:** Activado (certificado SSL gestionado por GitHub).

---

## 📊 Resultados de la Beta Privada (14/08/2026)

### Métricas clave
- **Usuarios invitados:** 10 personas
- **Registros completados:** 1 persona (10% conversión)
- **Detección de fricción:** El registro obligatorio al pujar frenaba al 90% de los visitantes
- **Detección de miedo al enlace:** Algunos usuarios no clicaban por temor a virus

### Problemas detectados y soluciones aplicadas
| Problema | Solución | Estado |
|----------|----------|--------|
| Registro obligatorio para pujar | Modo Invitado con saldo temporal y registro diferido | ✅ Implementado |
| Doble símbolo € en el saldo | Eliminado del HTML, solo lo gestiona JS | ✅ Corregido |
| Buscador sensible a acentos | Función `normalizarTexto()` | ✅ Implementado |
| Historial de pujas invisible | Reubicado junto al botón de puja, con animaciones | ✅ Implementado |
| Mensajes GOAT sin límite | Límite de 80 caracteres con contador | ✅ Implementado |
| Sin seguimiento de subastas | Sistema de Favoritos con Watchlist | ✅ Implementado |
| Errores 406 en consola | Cambio de `.single()` a `.maybeSingle()` | ✅ Corregido |
| Pujas de invitado no visibles | RPC `place_guest_bid` + historial actualizado | ✅ Corregido |
| Saldo de invitado insuficiente | Aumentado a 1.000 € | ✅ Corregido |
| Error al eliminar categorías | Función SQL duplicada eliminada | ✅ Corregido |
| Error 406 al crear perfil | Trigger `handle_new_user` + política RLS de INSERT | ✅ Corregido |
| Ruleta sin notificación clara | RPC devuelve JSON y guarda notificación en campanita | ✅ Corregido |
| Racha diaria invisible | `check_streak_and_reward` devuelve JSON y notifica | ✅ Corregido |
| Sin avisos externos | Pendiente para Fase 3 (notificaciones push/email) | ⬜ Pendiente |

### Feedback de betatesters
- **David:** "Mezcla el € con el $ para que sea fake pero realista."
- **David:** "Que el buscador no tenga presente los acentos siempre es cómodo."
- **Usuario anónimo:** La gente no se registra en webs desconocidas, pero sí prueba sin fricción.
- **Usuario anónimo:** Miedo a hacer clic en enlaces desconocidos por posible virus.

---

## ⚠️ Notas para la IA

* **Soy un programador novato.** Necesito explicaciones paso a paso, sin tecnicismos innecesarios.
* El código principal está en un único archivo `index.html`.
* Para cambios pequeños, indicar texto exacto a buscar y reemplazo.
* Para cambios grandes, preguntar antes de pasar archivo completo.
* No acortar el código al pasarlo completo.
* La web se despliega en GitHub Pages. Errores comunes: caché, `.nojekyll`, sintaxis.
* El sistema de favoritos requiere la tabla `favorites` en Supabase.
* Las pujas de invitado requieren las RPCs `place_guest_bid` y `migrate_guest_bids`.
* La generación automática requiere `pg_cron` activo y la tabla `objetos_automaticos` con datos.
* El registro sin email requiere el trigger `handle_new_user` y política RLS de INSERT en `profiles`.
* Las RPCs de ruleta y racha deben devolver JSON para que el frontend las procese bien.
* Las notificaciones se guardan en `localStorage` con la clave `abrozon_notificaciones`.
* Las categorías vacías no deben mostrarse en el chip de categorías del catálogo.

---

## 🗄️ SQL para Supabase (última versión)

```sql
-- Tabla de favoritos
CREATE TABLE IF NOT EXISTS public.favorites (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    auction_id UUID NOT NULL REFERENCES auctions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, auction_id)
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own favorites" ON public.favorites
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites" ON public.favorites
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" ON public.favorites
FOR DELETE USING (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.favorites TO authenticated;
GRANT SELECT ON public.favorites TO anon;
GRANT USAGE, SELECT ON SEQUENCE public.favorites_id_seq TO authenticated;

-- Permitir pujas de invitados
ALTER TABLE public.bids ADD COLUMN IF NOT EXISTS is_guest BOOLEAN DEFAULT false;
ALTER TABLE public.bids ALTER COLUMN user_id DROP NOT NULL;

-- Función para pujas de invitado
CREATE OR REPLACE FUNCTION public.place_guest_bid(
    p_auction_id UUID,
    p_amount NUMERIC,
    p_guest_name TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_current_price NUMERIC;
    v_status TEXT;
BEGIN
    SELECT current_price, status INTO v_current_price, v_status
    FROM auctions
    WHERE id = p_auction_id
    FOR UPDATE;

    IF v_status IS NULL THEN
        RAISE EXCEPTION 'Subasta no encontrada';
    END IF;

    IF v_status = 'closed' THEN
        RAISE EXCEPTION 'Subasta finalizada';
    END IF;

    IF p_amount <= v_current_price THEN
        RAISE EXCEPTION 'La puja debe ser mayor al precio actual';
    END IF;

    INSERT INTO bids (auction_id, user_id, user_name, amount, comment, is_guest, created_at)
    VALUES (p_auction_id, NULL, p_guest_name, p_amount, NULL, true, NOW());

    UPDATE auctions
    SET current_price = p_amount,
        last_bidder = p_guest_name
    WHERE id = p_auction_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.place_guest_bid(UUID, NUMERIC, TEXT) TO anon, authenticated;

-- Función para migrar pujas de invitado
CREATE OR REPLACE FUNCTION public.migrate_guest_bids(
    p_guest_name TEXT,
    p_user_id UUID,
    p_username TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE bids
    SET user_id = p_user_id,
        user_name = p_username,
        is_guest = false
    WHERE user_name = p_guest_name AND is_guest = true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.migrate_guest_bids(TEXT, UUID, TEXT) TO authenticated;

-- Habilitar pg_cron
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Crear cron job para generación automática
SELECT cron.schedule(
    'generar-subasta-hourly',
    '0 * * * *',
    $$SELECT generar_subasta_automatica();$$
);

-- Corregir función de eliminar categoría (evitar duplicados)
DROP FUNCTION IF EXISTS public.admin_delete_category(bigint);
DROP FUNCTION IF EXISTS public.admin_delete_category(integer);

CREATE OR REPLACE FUNCTION public.admin_delete_category(
    p_id BIGINT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND is_admin = true
    ) THEN
        RAISE EXCEPTION 'No tienes permisos de administrador';
    END IF;

    DELETE FROM categories WHERE id = p_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_delete_category(BIGINT) TO authenticated;

-- Trigger para crear perfil automáticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, username, saldo, es_goat, is_admin, xp, level)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', 'Invitado_' || substr(NEW.id::text, 1, 8)),
        1000,
        false,
        false,
        0,
        1
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Política RLS para inserción de perfil
DROP POLICY IF EXISTS "Usuarios pueden insertar su propio perfil" ON public.profiles;
CREATE POLICY "Usuarios pueden insertar su propio perfil"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- Asegurar columnas para racha y ruleta
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_daily_loot DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_login_date DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS streak_count INT DEFAULT 0;
