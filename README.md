# MyALove · Tienda virtual de ramos de limpiapipas

Sitio estático (HTML + CSS + JavaScript). Sin backend ni base de datos.

## Qué hace cada archivo
| Archivo | Para qué sirve |
|---|---|
| `index.html` | Estructura y textos de la página (FAQ, «Sobre nosotros», pie). |
| `css/styles.css` | Colores (arriba, en `:root`), tipografías y diseño. |
| `js/config.js` | **Tus ajustes:** WhatsApp, Spline, moneda, precios de extras, redes, colores. |
| `data/products.json` | Tus ramos (los edita el panel Pages CMS). |
| `js/main.js` | Lógica: catálogo, personalizador, WhatsApp, animaciones. |
| `.pages.yml` | Define los formularios del panel Pages CMS. |
| `assets/images/` | Fotos de ramos (ahora hay ilustraciones provisionales .svg). |
| `assets/icons/` | Favicon (el logo principal está en `assets/images/logo-ma.webp`). |

## 1. Poner tu número de WhatsApp
En `js/config.js`, cambia `whatsappNumber: "PENDIENTE"` por código de país + número, sin espacios, `+` ni guiones.
Perú: `"51988954149"` (ya configurado).

## 2. Poner tus precios
- Por ramo: en el panel Pages CMS (campo **Precio**) o en `data/products.json` (`"price": 45`). Vacío/`null` = «Precio por definir».
- Extras (LED, peluche, tarjeta): en `js/config.js`, `extras: { led: 10, plush: 25, card: 5 }`.

## 3. Subir fotos
Panel Pages CMS → «Mis ramos». Fotos < 300 KB (squoosh.app).

## 4. Publicar en GitHub Pages
1. Repositorio: `MyALoveStudio/MyALove`. Botón **Add file → Upload files**: arrastra el CONTENIDO de la carpeta (no la carpeta). Asegúrate de que `index.html` quede en la raíz. **Commit changes**.
2. **Settings → Pages → Deploy from a branch → main / (root) → Save**.
3. En 1–2 minutos tu web estará en `https://myalovestudio.github.io/MyALove/`.
4. Revisa: logo, fotos y catálogo cargan. Todas las rutas son relativas, así que funcionan en subcarpeta.
5. Cada cambio que guardes (en el panel o en GitHub) se republica solo.

## 5. Panel de administración (Pages CMS)
Entra a https://app.pagescms.org con GitHub, elige `MyALove`. Ahí editas ramos, precios y fotos.
(El archivo `.pages.yml` debe estar en la raíz del repositorio.)

## 6. Escena 3D de Spline
1. Crea cuenta en spline.design y diseña un ramo simple (esferas/formas rosa, crema y blanco; luz suave).
2. Botón **Export → Public URL**, activa publicación y copia la URL del tipo `https://prod.spline.design/.../scene.splinecode`.
3. Pégala en `js/config.js` → `splineUrl: "..."`.
4. Si falla o tarda, la web sigue mostrando el ramo provisional.
Consejo: pocas formas y materiales simples para que cargue rápido en celular.

## Probar en tu computadora
`fetch` no funciona abriendo el archivo con doble clic. Usa VS Code + extensión **Live Server** → clic derecho en `index.html` → *Open with Live Server*.

## Pendientes marcados con [POR DEFINIR]
Respuestas del FAQ (tiempos, entrega, pago), enlaces de redes (`social` en config.js) y número de WhatsApp.

## Catálogo completo
El botón «Ver catálogo completo» abre `catalogo.html`, que se arma solo con tus productos (agrupados por categoría). Es un enlace que puedes enviar por WhatsApp (botón «Copiar enlace» dentro de esa página). Puedes enviar enlaces filtrados, por ejemplo `.../catalogo.html?flor=Girasoles`. Si prefieres un catálogo de Canva, pega su enlace público de solo lectura en `catalogUrl` (js/config.js).

## Temáticas del mes (Halloween, Navidad, Día de la Madre, San Valentín…)
Todo se maneja en `data/temporada.json` (o en el panel, sección «Temática del mes»):
- `activa: "auto"` → la web cambia sola según las fechas (`desde`/`hasta`, formato mes-día, ej. `10-15`). Esas fechas son una propuesta: ajústalas.
- `activa: "ninguna"` → apaga la temática. O escribe el código de una (ej. `navidad`) para forzarla.
- Cada temática cambia: colores de la web, barra de aviso arriba, etiqueta de la portada, foto del ramo de la portada (opcional) y muestra una sección con los ramos marcados con esa temática (campo «Temática del mes» de cada ramo).
- Para probarla sin cambiar nada: `tu-web/?tema=navidad`.
- Para crear una temática nueva: agrega un bloque en `temporada.json` y su código en las listas `values` de `.pages.yml` (`activa` y `seasons`).

## Tipos de flor
Cada ramo tiene el campo «Tipos de flor» (rosas, tulipanes, girasoles, gerberas, lirios, flor de loto…). La web y el catálogo los muestran como filtros. Para agregar un tipo nuevo, escríbelo en `flowerOrder` (js/config.js) y en la lista `values` del campo `flowers` de `.pages.yml`.

## Cómo subir un ramo nuevo (foto, descripción, qué incluye y precio)
1. Entra a https://app.pagescms.org e inicia sesión con GitHub. Elige el repositorio `MyALove`.
2. Abre **Mis ramos** → **Add an entry** (agregar).
3. Llena: Código único, Nombre, Descripción corta, **¿Qué incluye?** (un elemento por cada cosa), Precio, **Foto principal** (botón para subirla desde tu celular o computadora), categorías, tipos de flor, temática del mes (si es de temporada) y cantidades de flores.
4. **Save**. En 1–2 minutos aparece en la web.
- Las fotos van a `assets/images/`.
- Temática (Halloween, Navidad…): marca la temática en el ramo y sube su foto igual que cualquier otro. Para cambiar el ramo grande de la portada en una temática, usa «Ramo de la portada para esta temática» en la sección **Temática del mes**.
- Sin panel: también puedes subir fotos en GitHub (Add file → Upload files) dentro de `assets/images/`.
- La imagen de la portada y la de «Por qué elegir MyALove» es `assets/images/hero-ramo.webp`. Para cambiarla, sube otra con ese mismo nombre.
