> Integración activa. El panel administrativo y el cuestionario guardan en el proyecto Supabase de Nöte mediante una Edge Function privada. Los datos históricos de D1 fueron migrados el 19 de septiembre de 2026.

# Activar Nöte
1. Mantener los cambios de esquema como migraciones versionadas en Supabase.
2. Configurar NOTE_SUPABASE_BRIDGE_URL, NOTE_SUPABASE_BRIDGE_TOKEN y NOTE_ADMIN_EMAILS como variables del sitio; los tokens se mantienen privados.
3. Rotar el token del puente si se sospecha exposición y volver a desplegar la Edge Function.
Los secretos se usan exclusivamente en el servidor. RLS impide acceso anónimo a los datos personales. Admin exige identidad ChatGPT y lista explícita de correos autorizados.
El catálogo de la imagen se ha transcrito en lib/catalog.json. Las asociaciones de emociones se normalizan para el cuestionario. Los perfiles aromáticos solo se derivan de sensaciones explícitas, sin inventar notas botánicas. Si no hay metadatos aromáticos se omite ese componente y se normaliza el resto; la afinidad no es una probabilidad.
La fotografía es una representación editorial generada, no fotografía del producto comercial. La disponibilidad refleja presencia en el catálogo, no inventario en tiempo real. Las referencias del proveedor conservan sus nombres tal como se leen y deben validarse antes de lanzamiento comercial.
El motor usa lib/catalog.json como catálogo versionado, que debe actualizarse junto con los datos de Supabase al cambiar la colección. El cuestionario y catálogo funcionan sin Supabase; la captura y administración de clientes requieren la conexión. No se simula almacenamiento.
WebMCP: herramienta start_fragrance_discovery registrada cuando el navegador la soporta. No se dispone de contexto autorizado de validación WebMCP en esta ejecución.

## Clasificación inicial por género
El paso 1 exige Hombre o Mujer antes de continuar. Se conserva en el perfil y se valida de nuevo en el servidor. El motor filtra antes de puntuar, también para las dos alternativas. Unisex y referencias que figuran en las dos columnas participan en ambas selecciones. Las repeticiones se consolidan por referencia.
DIORE y TURQUESA no figuran en la imagen por género: permanecen visibles en la colección, pero no se recomiendan hasta confirmar su clasificación. Moschino Toy 2 Bubble Gum figura en la imagen nueva, pero no tiene ficha olfativa en la colección anterior y no se incorpora al motor sin ella. No se inventan intensidad ni notas. ADRIANA se asocia a la referencia Gris NYC compartida; queda documentada para confirmar por la marca.
Las tablas activas son customers, notes, orders y expenses. La Edge Function note-bridge es la única puerta de acceso desde el sitio y valida un token privado antes de ejecutar operaciones.
