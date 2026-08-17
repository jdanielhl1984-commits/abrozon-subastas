# 🚀 aBROzon.subastas

**Descripción breve:** Web de subastas de broma con moneda ficticia, misiones, logros, rankings y PWA. Parodia de Amazon + Catawiki, temática de streamers y fútbol.

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
* `PROYECTO.md` → Documentación del proyecto (este archivo)

---

## 🗃 Base de datos (Supabase)

### Tablas principales

* `profiles` → Usuarios (saldo, XP, nivel, racha, fechas de botín/racha)
* `auctions` → Subastas activas/finalizadas
* `bids` → Historial de pujas (incluye pujas de invitados)
* `user_achievements` → Logros desbloqueados
* `favorites` → Subastas favoritas de cada usuario
* `daily_*` → Misiones diarias (4 tablas)
* `categories` → Categorías dinámicas desde admin
* `user_items` → Inventario de objetos de cada usuario
* `objetos_automaticos` → Catálogo para generación automática (242 objetos) 🆕

---

### Funciones RPC principales

| Función | Descripción |
|---------|-------------|
| `place_bid` | Puja con bloqueo atómico |
| `place_guest_bid` | Puja como invitado (sin autenticación) |
| `migrate_guest_bids` | Migra pujas de invitado a cuenta real |
| `check_and_close_auction` | Cierra subastas y **solo reliquida rarezas Rara o superior** 🆕 |
| `generar_subasta_automatica` | Genera subasta cada hora (usa categoría y rareza del objeto) 🆕 |
| `create_auction` | Crear subasta desde admin |
| `add_ad_reward` | Recompensa por ver anuncios |
| `add_mission_reward` | Recompensa por completar misiones |
| `add_xp` | Suma XP y da recompensa al subir nivel |
| `reclamar_bonus_diario` | Bono de 1.000€ al completar misiones |
| `check_streak_and_reward` | Racha de inicio de sesión (devuelve JSON) 🆕 |
| `reclamar_botin_diario` | Ruleta diaria (50€-1000€, devuelve JSON) 🆕 |
| `vender_en_mercado` | Publicar objeto en mercado C2C |
| `comprar_directo` | Compra directa con 30% comisión |
| `cancelar_venta_mercado` | Cancela venta (no devuelve fianza) |
| `desguazar_objeto` | Recicla objetos (20% del precio) |
| `admin_*` | Funciones de administración (protegidas con `is_admin`) |
| `unlock_achievement` | Desbloquea logros |
| `toggle_goat` | Activa/desactiva modo GOAT |
| `get_daily_missions` | Obtiene progreso de misiones diarias |
| `get_hall_of_fame` | Rankings del Hall of Fame |
| `username_disponible` | Verifica si el alias está libre |
| `actualizar_mi_alias` | Cambia el alias del usuario |

### Triggers automáticos

| Trigger | Descripción |
|---------|-------------|
| `handle_new_user()` | Crea automáticamente la fila en `profiles` al registrarse 🆕 |
| `on_auth_user_created` | Ejecuta `handle_new_user()` tras cada registro 🆕 |

---

## 🔒 Seguridad

* **RLS activo** en todas las tablas
* **Funciones RPC** con `SECURITY DEFINER`
* **Prevención de Race Conditions** (`FOR UPDATE` en `place_bid`)
* **RPCs admin** protegidas con verificación `is_admin`
* **Pujas de invitado** con `user_id NULL`
* **Creación automática de perfil** evita errores 406 🆕

---

## ✨ Funcionalidades implementadas

### 🔐 Autenticación y usuarios
- ✅ Registro/login **solo con alias y contraseña** (email interno automático)
- ✅ Sin verificación de email durante la beta
- ✅ Creación automática del perfil mediante trigger 🆕
- ✅ Modo Invitado (1.000€ y 3 pujas)
- ✅ Registro diferido (solo al pujar o agotar pujas)
- ✅ Migración de datos de invitado a cuenta real
- ✅ Cambio de alias y contraseña
- ✅ Zona de baja de cuenta

### 🏛️ Subastas y catálogo
- ✅ Subastas en tiempo real con temporizadores
- ✅ Cierre automático al visitar el catálogo
- ✅ Sistema de rarezas completo (6 niveles)
- ✅ Último pujador visible
- ✅ Filtro "Novedades" (últimas 24h)
- ✅ Barra de ordenación (fecha, duración, rareza, precio)
- ✅ Buscador sin acentos
- ✅ Pestaña "Finalizadas"
- ✅ Certificados automáticos con código único
- ✅ **Reliquidación selectiva:** solo Rara, Épica, Legendaria, Mítica 🆕

### ❤️ Favoritos
- ✅ Botón de corazón en cada tarjeta
- ✅ Solo visible para usuarios registrados
- ✅ Pestaña "Mis Favoritos"
- ✅ Actualización dinámica

### 💬 Historial de Pujas (Live Feed)
- ✅ Reubicado junto al botón de puja
- ✅ Scroll interno (250px)
- ✅ Animación de entrada
- ✅ Auto-scroll al final
- ✅ Mensajes GOAT en burbuja destacada
- ✅ Límite de 80 caracteres
- ✅ Pujas de invitado visibles

### 🎮 Gamificación y progreso
- ✅ Sistema de XP y niveles (Lurker → Final Boss/Admin)
- ✅ Recompensa por subir de nivel
- ✅ 30 logros/insignias
- ✅ Verificación retroactiva de logros
- ✅ Racha de inicio de sesión (100€ → 1000€) con notificación 🆕
- ✅ Misiones diarias (4 misiones + bono 1.000€)
- ✅ Botín Diario (Ruleta) con contador visual y notificación 🆕
- ✅ Modo GOAT (activación, recargas premium, comentarios)

### 🛒 Mercado C2C e inventario
- ✅ Inventario de usuarios (vitrina)
- ✅ Publicar objetos en mercado (con fianzas del 10%)
- ✅ Compra directa con 30% comisión
- ✅ Cancelar venta (no devuelve fianza)
- ✅ Reciclaje/Desguace (20% del precio con mín/máx)
- ✅ Confirmación antes de reciclar
- ✅ Actualización automática de la vitrina
- ✅ Efectos visuales según rareza

### 🏆 Rankings y comunidad
- ✅ Hall of Fame (6 rankings con podios)
- ✅ Corrección ranking "Broker" (NaN €)
- ✅ Pestaña "Mis pujas" (última puja por subasta)
- ✅ Pestaña "Superadas" 🆕
- ✅ Paginación en Mis Pujas (10 por página) 🆕
- ✅ Botones de compartir en X y copiar enlace
- ✅ Sistema de notificaciones con campanita persistente 🆕

### 🎨 Interfaz y experiencia
- ✅ Modo oscuro/claro
- ✅ PWA instalable
- ✅ Página de Ayuda/Tutorial/FAQ
- ✅ Banner de Beta Abierta
- ✅ Toasts en lugar de `alert()`
- ✅ Feedback visual (spinners y botones deshabilitados)
- ✅ Evitar spam de toasts (1 cada 30s)
- ✅ Corrección doble símbolo €
- ✅ Scrollbars personalizados
- ✅ Tooltips en botones
- ✅ Header compacto (38px, responsive)
- ✅ Fix overflow horizontal en móvil
- ✅ **Nuevo menú estilo Amazon:** Megamenú con categorías agrupadas 🆕
- ✅ **Chips de categorías ocultos:** Más limpio y ordenado 🆕

### 🛠️ Administración
- ✅ Panel admin completo
- ✅ Crear/eliminar subastas (1 min → 30 días)
- ✅ Gestionar usuarios (buscar, fijar saldo, banear)
- ✅ Ver lista completa de usuarios
- ✅ Añadir/eliminar categorías dinámicas
- ✅ Adjudicar subastas al admin

### 🤖 Automatización
- ✅ Generación automática cada hora (`pg_cron`)
- ✅ Contador de próxima subasta sincronizado
- ✅ Reliquidación selectiva (solo Rara o superior) 🆕
- ✅ Metadata flexible (JSONB)
- ✅ **242 objetos** en `objetos_automaticos` (12 categorías) 🆕
- ✅ **Función de generación mejorada** (usa categoría y rareza) 🆕
- ✅ **Cron job funcionando** 🆕

### 📜 Legal y compliance
- ✅ Textos legales completos (LSSI-CE/RGPD)
- ✅ Titular: Daniel Hernandez (Granollers)
- ✅ Google Analytics (ID `G-C30L0HE0L7`)

---

## 🚧 Roadmap

### ✅ Fase 1: MVP (COMPLETADA)
### ✅ Fase 2: Pulido UX/UI (COMPLETADA)
### ✅ Fase 2.5: Correcciones Beta (COMPLETADA)

**Últimas correcciones aplicadas:**
1. ✅ Ruleta diaria con notificaciones
2. ✅ Racha diaria con notificaciones
3. ✅ Reliquidación solo para rarezas Rara o superior
4. ✅ Corrección error columna `ended_at`
5. ✅ Catálogo de 242 objetos
6. ✅ Menú estilo Amazon con megamenú
7. ✅ Ocultación de chips de categorías
8. ✅ Trigger de creación automática de perfil
9. ✅ Políticas RLS corregidas

---

### ⬜ Fase 3: Gamificación y Retención (PENDIENTE)

1. **Ajuste de economía** ⬜
2. **Sistema de referidos** ⬜
3. **Personalización de avatar** ⬜
4. **Personalización de perfil** ⬜
5. **Beneficios por antigüedad** ⬜
6. **Vitrina Espectacular** ⬜
7. **Notificaciones push/email** ⬜

### 💡 Nuevas ideas para Fase 3

| Idea | Descripción | Estado |
|------|-------------|--------|
| 🎰 Ruleta de Objetos | Loot Box paródica | ⬜ Pendiente |
| 📦 Colecciones de Rarezas | Sets para completar | ⬜ Pendiente |
| ⚡ Subastas Relámpago | 5 minutos de duración | ⬜ Pendiente |
| 🎯 Pujas de Último Segundo | Extensión de 30s al pujar | ⬜ Pendiente |
| 👻 Modo Fantasma | Ocultar último pujador | ⬜ Pendiente |
| 🌍 Retos Diarios | Metas comunitarias | ⬜ Pendiente |
| 🖼️ Títulos y Marcos | Cosméticos de perfil | ⬜ Pendiente |
| 🍀 Modo Duende | Precio secreto reducido | ⬜ Pendiente |

---

### ⬜ Fases 4-8 (Pendientes)

- **Fase 4:** Monetización (Stripe, anuncios reales)
- **Fase 5:** Comunidad, Eventos, PVE
- **Fase 6:** Expansión Técnica (API, Widgets)
- **Fase 7:** Análisis de Audiencia y Publicidad
- **Fase 8:** Equipamiento de Avatar y Stats

---

## 💰 Modelo de monetización (planificado)

* **F2P (Gratis):** Anuncios limitados para moneda virtual
* **Modo GOAT (3.99€/mes):** Sin límites de anuncios, comentarios, insignia
* **Tienda de monedas:** Compra de saldo virtual con Stripe
* **Media Kit:** Informes agregados para patrocinios

---

## 📢 Redes Sociales y Estrategia

* **X:** [@aBROzonsubastas](https://x.com/aBROzonsubastas)
* **Beta Abierta:** Cualquiera puede entrar 🆕
* **Micro-streamers:** Invitar para medir retención
* **Contenido viral:** Clips de subastas absurdas
* **Estrategia:** 1 vídeo/tweet al día durante 2 semanas

---

## 🌐 Dominio

* **Dominio:** `abrozon.com` (GitHub Pages + HTTPS)
* **SSL:** Certificado gestionado por GitHub

---

## 📊 Distribución de objetos (`objetos_automaticos`)

| Categoría | Común | Poco común | Rara | Épica | Legendaria | Mítica | TOTAL |
|-----------|-------|------------|------|-------|------------|--------|-------|
| Cultura Pop y Gastronomía | 9 | 6 | 2 | 2 | 1 | 0 | 20 |
| Eventos Especiales | 8 | 0 | 2 | 3 | 0 | 0 | 13 |
| Famosos y Televisión | 10 | 6 | 5 | 3 | 1 | 0 | 25 |
| Fútbol | 10 | 6 | 4 | 4 | 1 | 0 | 25 |
| General | 6 | 4 | 4 | 4 | 2 | 1 | 21 |
| Memes Autóctonos Españoles | 9 | 6 | 5 | 0 | 0 | 0 | 20 |
| Memes de Internet | 18 | 0 | 5 | 1 | 1 | 0 | 25 |
| Memes Latinoamericanos | 5 | 4 | 4 | 0 | 2 | 0 | 15 |
| Objetos Random y Cultura | 7 | 3 | 5 | 2 | 2 | 1 | 20 |
| Política Española | 12 | 6 | 5 | 1 | 1 | 0 | 25 |
| Política Latinoamericana | 9 | 5 | 7 | 1 | 3 | 0 | 25 |
| Velada de Boxeo | 2 | 0 | 4 | 2 | 0 | 0 | 8 |
| **TOTAL** | **105** | **46** | **52** | **23** | **14** | **2** | **242** |

---

## ⚠️ Notas para la IA

* **Soy un programador novato.** Explicaciones paso a paso, sin tecnicismos innecesarios.
* El código principal está en un único archivo `index.html`.
* Para cambios pequeños: indicar texto exacto a buscar y reemplazo.
* Para cambios grandes: preguntar antes de pasar archivo completo.
* No acortar el código al pasarlo completo.
* La web se despliega en GitHub Pages. Errores comunes: caché, `.nojekyll`, sintaxis.
* El sistema de favoritos requiere la tabla `favorites` en Supabase.
* Las pujas de invitado requieren RPCs `place_guest_bid` y `migrate_guest_bids`.
* La generación automática requiere `pg_cron` activo y tabla `objetos_automaticos`.
* El registro sin email requiere el trigger `handle_new_user` y política RLS de INSERT.
* Las RPCs de ruleta y racha deben devolver JSON.
* Las notificaciones se guardan en `localStorage` (`abrozon_notificaciones`).
* **El menú es un megamenú estilo Amazon** con categorías agrupadas. 🆕
* **La reliquidación SOLO funciona para Rara, Épica, Legendaria y Mítica.** 🆕
* **Hay 242 objetos en `objetos_automaticos`.** 🆕

---

## 🎯 Resumen de mejoras aplicadas (sesión 17/08/2026)

| Mejora | Descripción | Estado |
|--------|-------------|--------|
| Ruleta diaria | RPC con JSON + notificaciones | ✅ |
| Racha diaria | RPC con JSON + notificaciones | ✅ |
| Reliquidación selectiva | Solo Rara, Épica, Legendaria, Mítica | ✅ |
| Corrección `ended_at` | Eliminada referencia a columna inexistente | ✅ |
| Catálogo de objetos | 242 objetos en `objetos_automaticos` | ✅ |
| Menú estilo Amazon | Megamenú con categorías agrupadas | ✅ |
| Ocultación de chips | Categorías solo en megamenú | ✅ |
| Función generadora | Usa categoría y rareza del objeto | ✅ |
| Trigger de perfil | Creación automática al registrarse | ✅ |
| Políticas RLS | Insert permitido para creación de perfil | ✅ |

---

**Última actualización:** 17 de agosto de 2026
Pujas de invitados
ALTER TABLE public.bids ADD COLUMN IF NOT EXISTS is_guest BOOLEAN DEFAULT false;
ALTER TABLE public.bids ALTER COLUMN user_id DROP NOT NULL;

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
Migración de pujas de invitado
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
Trigger de creación de perfil
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

-- Política RLS para permitir inserción del perfil
DROP POLICY IF EXISTS "Usuarios pueden insertar su propio perfil" ON public.profiles;
CREATE POLICY "Usuarios pueden insertar su propio perfil"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- Asegurar columnas para racha y ruleta
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_daily_loot DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_login_date DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS streak_count INT DEFAULT 0;
Habilitar pg_cron
CREATE EXTENSION IF NOT EXISTS pg_cron;

SELECT cron.schedule(
    'generar-subasta-hourly',
    '0 * * * *',
    $$SELECT generar_subasta_automatica();$$
);
Función de reliquidación mejorada (SOLO RARA+)
DROP FUNCTION IF EXISTS public.check_and_close_auction(UUID) CASCADE;

CREATE OR REPLACE FUNCTION public.check_and_close_auction(
    p_auction_id UUID
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
    v record;
    v_new_price integer;
    v_descuento_aplicado integer;
    v_duracion_horas integer;
    v_winner_name text;
    v_cert text;
    v_user_id UUID;
    v_reliquidar boolean;
BEGIN
    SELECT * INTO v FROM public.auctions WHERE id = p_auction_id FOR UPDATE;
    IF NOT FOUND THEN RETURN; END IF;
    IF v.status = 'closed' THEN RETURN; END IF;
    IF v.ends_at > now() THEN RETURN; END IF;

    IF EXISTS (SELECT 1 FROM public.bids WHERE auction_id = p_auction_id) THEN
        -- Tiene pujas → se adjudica
        SELECT user_name, user_id INTO v_winner_name, v_user_id
        FROM public.bids
        WHERE auction_id = p_auction_id
        ORDER BY amount DESC
        LIMIT 1;

        v_cert := 'ABRO-' || upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 8));

        UPDATE public.auctions
        SET status = 'closed',
            winner = v_winner_name,
            certificado_codigo = v_cert
        WHERE id = p_auction_id;

        IF v_user_id IS NOT NULL THEN
            INSERT INTO public.user_items (user_id, auction_id, en_venta)
            VALUES (v_user_id, p_auction_id, false);
        END IF;

    ELSE
        -- Sin pujas → SOLO reliquidar si es Rara o superior
        v_reliquidar := v.rareza IN ('Rara', 'Épica', 'Legendaria', 'Mítica');

        IF v_reliquidar THEN
            v_new_price := floor(v.current_price * 0.90);
            IF v_new_price < 1 THEN v_new_price := 1; END IF;
            
            v_descuento_aplicado := COALESCE((v.metadata->>'descuentos_aplicados')::integer, 0) + 1;

            CASE v.rareza
                WHEN 'Mítica' THEN v_duracion_horas := 336;
                WHEN 'Legendaria' THEN v_duracion_horas := 168;
                WHEN 'Épica' THEN v_duracion_horas := 72;
                ELSE v_duracion_horas := 24;
            END CASE;

            UPDATE public.auctions 
            SET status = 'closed', 
                winner = NULL
            WHERE id = p_auction_id;

            INSERT INTO public.auctions (
                title, description, current_price, starting_price, ends_at,
                category, image_url, status, stock_maximo, rareza, metadata
            ) VALUES (
                '🔥 RELIQUIDACIÓN: ' || v.title,
                v.description,
                v_new_price,
                v_new_price,
                now() + (v_duracion_horas || ' hours')::interval,
                v.category,
                v.image_url,
                'active',
                1,
                v.rareza,
                jsonb_build_object(
                    'descuentos_aplicados', v_descuento_aplicado,
                    'precio_original', COALESCE(v.metadata->>'precio_original', v.current_price::text)
                )
            );
        ELSE
            -- Común o Poco común → se elimina
            UPDATE public.auctions 
            SET status = 'closed', 
                winner = NULL
            WHERE id = p_auction_id;
        END IF;
    END IF;
END;
$function$;
Función de generación automática (usa categorías y rarezas)
DROP FUNCTION IF EXISTS public.generar_subasta_automatica() CASCADE;

CREATE OR REPLACE FUNCTION public.generar_subasta_automatica()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
    v_objeto RECORD;
    v_auction_id UUID;
    v_rareza TEXT;
    v_precio_base NUMERIC;
    v_duracion INTERVAL;
    v_categoria TEXT;
BEGIN
    SELECT * INTO v_objeto
    FROM objetos_automaticos
    ORDER BY RANDOM()
    LIMIT 1;
    
    IF v_objeto.id IS NULL THEN
        RAISE EXCEPTION 'No hay objetos en la tabla objetos_automaticos';
    END IF;

    v_rareza := v_objeto.rareza_minima;
    
    CASE v_rareza
        WHEN 'Común' THEN
            v_precio_base := 1 + (RANDOM() * 999)::INT;
            v_duracion := INTERVAL '1 day';
        WHEN 'Poco común' THEN
            v_precio_base := 500 + (RANDOM() * 1500)::INT;
            v_duracion := INTERVAL '1 day';
        WHEN 'Rara' THEN
            v_precio_base := 1001 + (RANDOM() * 3999)::INT;
            v_duracion := INTERVAL '1 day';
        WHEN 'Épica' THEN
            v_precio_base := 5001 + (RANDOM() * 4999)::INT;
            v_duracion := INTERVAL '3 days';
        WHEN 'Legendaria' THEN
            v_precio_base := 10001 + (RANDOM() * 989999)::INT;
            v_duracion := INTERVAL '7 days';
        WHEN 'Mítica' THEN
            v_precio_base := 1000001 + (RANDOM() * 8999999)::INT;
            v_duracion := INTERVAL '30 days';
        ELSE
            v_precio_base := 100 + (RANDOM() * 900)::INT;
            v_duracion := INTERVAL '1 day';
    END CASE;

    v_categoria := COALESCE(v_objeto.categoria, 'General');

    INSERT INTO auctions (
        title,
        description,
        starting_price,
        current_price,
        image_url,
        category,
        rareza,
        status,
        ends_at,
        created_at,
        stock_maximo
    ) VALUES (
        v_objeto.titulo || ' [' || v_rareza || ']',
        v_objeto.descripcion,
        v_precio_base,
        v_precio_base,
        v_objeto.emoji,
        v_categoria,
        v_rareza,
        'active',
        NOW() + v_duracion,
        NOW(),
        0
    )
    RETURNING id INTO v_auction_id;

    RETURN v_auction_id;
END;
$function$;
Función para eliminar categorías (corregida)
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
