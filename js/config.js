/* =====================================================
   AJUSTES DE MyALove  (aquí cambias lo importante)
   ===================================================== */
window.MYALOVE = {

  // 1) WHATSAPP: código de país + número, SIN espacios, "+" ni guiones.
  //    Perú: 51 + tu número de 9 dígitos. Ejemplo: "51987654321"
  whatsappNumber: "51988954149",

  // 2) SPLINE: pega aquí la URL pública de tu escena (termina en .splinecode).
  //    Si está vacío, se muestra el ramo provisional.
  splineUrl: "",

  // 3) MONEDA
  currency: "S/",

  // 4) PRECIOS DE EXTRAS (null = por definir). Ejemplo: led: 10
  extras: { led: null, plush: null, card: null },

  // 5) REDES SOCIALES (reemplaza "#" por tus enlaces reales)
  social: { instagram: "#", tiktok: "#", facebook: "#" },

  // 6) Días mínimos de anticipación para pedir (tu preparación toma de 3 a 5 días)
  minDaysAhead: 3,

  // 7) CATÁLOGO COMPLETO
  //    Vacío = se usa catalogo.html (se arma solo con tus productos y es un enlace que puedes enviar por WhatsApp).
  //    Si prefieres un catálogo hecho en Canva, pega aquí su enlace público de solo lectura.
  catalogUrl: "",

  // 8) Orden en que aparecen los filtros de categoría (solo se muestran las que tengan ramos)
  categoryOrder: ["Para ella", "Para él", "Flor individual", "Ramos de 2 a 3 flores", "Ramos mixtos", "Con luces LED", "Con peluche", "Temáticos"],

  // 8b) Tipos de flor para filtrar (agrega o quita los que quieras)
  flowerOrder: ["Rosas", "Tulipanes", "Girasoles", "Gerberas", "Lirios", "Flor de loto", "Margaritas", "Claveles", "Hortensias", "Orquídeas", "Peonías"],

  // 9) Colores que ofreces en el personalizador (nombre visible + color)
  colors: [
    { name: "Rosa",     hex: "#F4A9BC" },
    { name: "Blanco",   hex: "#FFFFFF" },
    { name: "Crema",    hex: "#F6E7D6" },
    { name: "Rosa intenso", hex: "#E58AA3" },
    { name: "Lila",     hex: "#CDB8E6" },
    { name: "Rojo",     hex: "#D65A6B" },
    { name: "Amarillo", hex: "#F6D365" },
    { name: "Celeste",  hex: "#A9D3EE" }
  ]
};
