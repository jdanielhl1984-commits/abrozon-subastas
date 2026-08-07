## 🚧 Próximos pasos (roadmap actualizado)

1. **Ajuste de la economía** (control de inflación)
   - Limitar anuncios diarios y recargas GOAT usando la calculadora.
   - Ajustar recompensas de misiones.

2. ~~**Sistema de experiencia (XP), niveles y títulos equipables**~~ → ✅ HECHO

3. **Sistema de Rarezas y Stock Limitado** 🆕
   - Añadir campos `rareza` (Común/Rara/Épica/Legendaria) y `stock_maximo` a las subastas.
   - Numeración de serie para ítems Legendarios (ej: #2/5).
   - Base para que el futuro mercado C2C tenga precios dinámicos según rareza.

4. **Vitrina Espectacular y Compartible** 🆕
   - Efectos visuales CSS por rareza (brillo azul, holográfico, dorado con partículas).
   - Numeración de serie visible en Legendarias.
   - Botón de compartir vitrina en redes sociales (futuro: generar imagen con html2canvas).

5. **Automatización de Subastas (Cron Job)** 🆕
   - Edge Function de Supabase que genere subastas automáticamente cada X horas.
   - Lógica de selección aleatoria respetando rareza y stock disponible.
   - Precio de salida variable según rareza.

6. **Categoría Legacy / Rage Comics (memes antiguos)**
   - Subastas de coleccionables clásicos de internet (Trollface, Forever Alone...).
   - Rareza "Legacy" con diseño retro en la vitrina.
   - Set bonus: reunir la colección completa otorga el título "Vieja Guardia".

7. **Mercado C2C (Sub‑a‑bro‑sta entre jugadores)**
   - Usuarios pueden vender sus propios coleccionables.
   - Fianza por publicar (10% del precio de salida, se devuelve si se vende, se quema si no).
   - Comisión de venta del 20% para la plataforma (se destruye para frenar la inflación).
   - Eventos de "Lunes de Mercado Libre" con comisiones reducidas.
   - Ventajas para suscriptores GOAT.

8. **Misiones sociales**
   - Compartir subasta activa en redes.
   - Visitar el canal del streamer parodiado.

9. **Dashboard de administrador con estadísticas**
   - Usuarios registrados, subastas activas, dinero en circulación, etc.
