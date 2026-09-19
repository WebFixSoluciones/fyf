export interface SeedCategory {
  name: string;
  slug: string;
  description: string;
  order: number;
  image: string;
}

export interface SeedVariant {
  code?: string;
  sizeLabel: string;
  shape?: string;
  color?: string;
  unitPrice: number;
  dozenPrice?: number;
  wholesalePrice: number;
  stock?: number;
}

export interface SeedProduct {
  sku: string;
  name: string;
  slug: string;
  description: string;
  material: string;
  categorySlug: string;
  categoryTag?: string;
  mainImage: string;
  images?: string[];
  hasLogoOption?: boolean;
  logoPriceExtra?: number;
  allowCustomSize?: boolean;
  variants: SeedVariant[];
}

export const CATEGORIES_DATA: SeedCategory[] = [
  {
    name: "ROPA TÉRMICA",
    slug: "ropa-termica",
    description: "Chompas, chaveras y trajes con aislamiento térmico para cuartos fríos y bajas temperaturas.",
    order: 1,
    image: "/images/categories/ropa-termica.jpg",
  },
  {
    name: "ROPA IGNÍFUGA",
    slug: "ropa-ignifuga",
    description: "Overoles y pantalones ignífugos retardantes al fuego con cintas reflectivas de alta visibilidad.",
    order: 2,
    image: "/images/categories/ropa-ignifuga.jpg",
  },
  {
    name: "UNIFORMES PERSONALIZADOS",
    slug: "uniformes-personalizados",
    description: "Camisas, blusas, buzos polo y prendas corporativas con bordado y diseño a la medida.",
    order: 3,
    image: "/images/categories/uniformes-personalizados.jpg",
  },
  {
    name: "ROPA INDUSTRIAL DE TRABAJO",
    slug: "ropa-industrial-trabajo",
    description: "Pantalones, blusas, capuchas y overoles jean 100% algodón prelavado para máxima resistencia.",
    order: 4,
    image: "/images/categories/ropa-industrial-trabajo.png",
  },
  {
    name: "CALZADO INDUSTRIAL",
    slug: "calzado-industrial",
    description: "Botines de seguridad dieléctricos con puntera de acero o composite de marcas líderes como Bompel y Marluvas.",
    order: 5,
    image: "/images/categories/calzado-industrial.jpg",
  },
  {
    name: "IMPLEMENTOS DE SEGURIDAD",
    slug: "implementos-seguridad",
    description: "Protección respiratoria, auditiva, guantes de nitrilo/poliuretano y cascos certificados Delta Plus y Libus.",
    order: 6,
    image: "/images/categories/implementos-seguridad.jpg",
  },
  {
    name: "ROPA INDUSTRIAL PVC",
    slug: "ropa-industrial-pvc",
    description: "Trajes impermeables en PVC de alta densidad para trabajo bajo agua, químicos y condiciones extremas.",
    order: 7,
    image: "/images/categories/ropa-industrial-pvc.jpg",
  },
];

export const PRODUCTS_DATA: SeedProduct[] = [
  // --- 1. ROPA TÉRMICA ---
  {
    sku: "FYF-TERM-001",
    name: "Chompa Combinada Térmica Con Cinta Reflectiva Tres Capas / Protección Térmica",
    slug: "chompa-combinada-termica-con-cinta-reflectiva-tres-capas-proteccion-termica",
    description: "Chompa térmica combinada de tres capas de alta protección con franjas reflectivas. Diseñada para cuartos fríos y ambientes de temperaturas bajo cero.",
    material: "Poliéster térmico impermeable 3 capas + forro aislante",
    categorySlug: "ropa-termica",
    categoryTag: "ROPA TÉRMICA",
    mainImage: "/images/products/chompa-combinada-cinta.png",
    hasLogoOption: true,
    variants: [
      { sizeLabel: "S", unitPrice: 48.00, wholesalePrice: 42.00, stock: 50 },
      { sizeLabel: "M", unitPrice: 48.00, wholesalePrice: 42.00, stock: 50 },
      { sizeLabel: "L", unitPrice: 48.00, wholesalePrice: 42.00, stock: 50 },
      { sizeLabel: "XL", unitPrice: 52.00, wholesalePrice: 45.00, stock: 30 },
    ],
  },
  {
    sku: "FYF-TERM-002",
    name: "Chompa Combinada Termica Tres Capas / Protección Para Cuartos Fríos",
    slug: "chompa-combinada-termica-tres-capas-proteccion-para-cuartos-frios",
    description: "Chompa térmica de alta visibilidad para operarios de frigoríficos e industrias alimentarias.",
    material: "Tela impermeable 3 capas + fibra siliconada",
    categorySlug: "ropa-termica",
    categoryTag: "ROPA TÉRMICA",
    mainImage: "/images/products/chompa-combinada-cuartos-frios.png",
    hasLogoOption: true,
    variants: [
      { sizeLabel: "S", unitPrice: 45.00, wholesalePrice: 39.50, stock: 40 },
      { sizeLabel: "M", unitPrice: 45.00, wholesalePrice: 39.50, stock: 40 },
      { sizeLabel: "L", unitPrice: 45.00, wholesalePrice: 39.50, stock: 40 },
    ],
  },
  {
    sku: "FYF-TERM-003",
    name: "Chavera Térmico Impermeable Thinsulate / Protección Para Cuartos Fríos",
    slug: "chavera-termico-impermeable-thinsulate-proteccion-para-cuartos-frios-3",
    description: "Chavera térmico ergonómico en color azul rey, impermeable con forro Thinsulate de alta densidad.",
    material: "Thinsulate térmico hidrofóbico",
    categorySlug: "ropa-termica",
    categoryTag: "ROPA TÉRMICA",
    mainImage: "/images/products/chavera-azul-rey.png",
    hasLogoOption: true,
    variants: [
      { sizeLabel: "Estándar", unitPrice: 16.50, wholesalePrice: 14.00, stock: 100 },
    ],
  },
  {
    sku: "FYF-TERM-004",
    name: "Chavera Térmico Impermeable Thinsulate / Protección Para Cuartos Fríos (Azul)",
    slug: "chavera-termico-impermeable-thinsulate-proteccion-para-cuartos-frios-2",
    description: "Gorro térmico chavera tipo pasamontañas con ajuste anatómico para cuartos frigoríficos.",
    material: "Nylon tafetán impermeable + aislamiento térmico",
    categorySlug: "ropa-termica",
    categoryTag: "ROPA TÉRMICA",
    mainImage: "/images/products/chavera-azul-marino.png",
    variants: [
      { sizeLabel: "Estándar", unitPrice: 16.50, wholesalePrice: 14.00, stock: 80 },
    ],
  },
  {
    sku: "FYF-TERM-005",
    name: "Chavera Térmico Impermeable Thinsulate / Protección Para Cuartos Fríos (Gris)",
    slug: "chavera-termico-impermeable-thinsulate-proteccion-para-cuartos-frios",
    description: "Chavera térmica impermeable color gris con aislamiento para temperaturas extremas.",
    material: "Thinsulate térmico 150g",
    categorySlug: "ropa-termica",
    categoryTag: "ROPA TÉRMICA",
    mainImage: "/images/products/chavera-gris.png",
    variants: [
      { sizeLabel: "Estándar", unitPrice: 16.50, wholesalePrice: 14.00, stock: 90 },
    ],
  },

  // --- 2. ROPA IGNÍFUGA ---
  {
    sku: "FYF-IGN-001",
    name: "Overol Clasico Ignifugo Con Cinta Reflectiva / ROPA IGNIFUGA",
    slug: "overol-clasico-ignifugo-con-cinta-reflectiva",
    description: "Overol retardante a la flama certificado con costuras reforzadas de aramida y cintas reflectivas 3M ignífugas.",
    material: "Algodón Ignífugo 100% Tratado FR 280g/m²",
    categorySlug: "ropa-ignifuga",
    categoryTag: "ROPA IGNÍFUGA",
    mainImage: "/images/products/overol-ignifugo-cinta.jpg",
    hasLogoOption: true,
    variants: [
      { sizeLabel: "38", unitPrice: 58.00, wholesalePrice: 51.00, stock: 40 },
      { sizeLabel: "40", unitPrice: 58.00, wholesalePrice: 51.00, stock: 40 },
      { sizeLabel: "42", unitPrice: 58.00, wholesalePrice: 51.00, stock: 35 },
    ],
  },
  {
    sku: "FYF-IGN-002",
    name: "Overol Clasico Ignifugo / ROPA IGNIFUGA",
    slug: "overol-clasico-ignifugo",
    description: "Overol ignífugo clásico para industria petrolera, minera, soldadura y subestaciones eléctricas.",
    material: "Algodón Ignífugo FR certificado NFPA 2112",
    categorySlug: "ropa-ignifuga",
    categoryTag: "ROPA IGNÍFUGA",
    mainImage: "/images/products/overol-ignifugo-clasico.jpg",
    variants: [
      { sizeLabel: "38", unitPrice: 52.00, wholesalePrice: 46.00, stock: 30 },
      { sizeLabel: "40", unitPrice: 52.00, wholesalePrice: 46.00, stock: 30 },
    ],
  },
  {
    sku: "FYF-IGN-003",
    name: "Pantalón Clásico Ignifugo Con Cinta Reflectiva / ROPA REFLECTIVA",
    slug: "pantalon-clasico-ignifugo-con-cinta-reflectiva",
    description: "Pantalón ignífugo retardante con cinta reflectiva en piernas, bolsillos funcionales y refuerzo de tiro.",
    material: "Tela ignífuga 8.5 oz",
    categorySlug: "ropa-ignifuga",
    categoryTag: "ROPA IGNÍFUGA",
    mainImage: "/images/products/pantalon-ignifugo-cinta.jpg",
    variants: [
      { sizeLabel: "30", unitPrice: 34.00, wholesalePrice: 29.50, stock: 50 },
      { sizeLabel: "32", unitPrice: 34.00, wholesalePrice: 29.50, stock: 50 },
      { sizeLabel: "34", unitPrice: 34.00, wholesalePrice: 29.50, stock: 50 },
    ],
  },
  {
    sku: "FYF-IGN-004",
    name: "Pantalón Clásico Ignifugo / ROPA IGNIFUGA",
    slug: "pantalon-clasico-ignifugo",
    description: "Pantalón de trabajo ignífugo corte clásico para faenas industriales pesadas.",
    material: "Algodón 100% tratamiento retardante",
    categorySlug: "ropa-ignifuga",
    categoryTag: "ROPA IGNÍFUGA",
    mainImage: "/images/products/pantalon-ignifugo-clasico.jpg",
    variants: [
      { sizeLabel: "30", unitPrice: 31.00, wholesalePrice: 27.00, stock: 45 },
      { sizeLabel: "32", unitPrice: 31.00, wholesalePrice: 27.00, stock: 45 },
    ],
  },
  {
    sku: "FYF-IGN-005",
    name: "Pantalón Ignifugó Modelo Safari / Retardante Al Fuego / ROPA IGNIFUGA",
    slug: "pantalon-ignifugo-modelo-safari-retardante-al-fuego",
    description: "Pantalón ignífugo estilo safari con múltiples bolsillos de carga laterales y cierre de seguridad.",
    material: "Algodón ignífugo 9 oz tipo cargo",
    categorySlug: "ropa-ignifuga",
    categoryTag: "ROPA IGNÍFUGA",
    mainImage: "/images/products/pantalon-ignifugo-safari.jpg",
    variants: [
      { sizeLabel: "30", unitPrice: 36.00, wholesalePrice: 31.00, stock: 35 },
      { sizeLabel: "32", unitPrice: 36.00, wholesalePrice: 31.00, stock: 35 },
      { sizeLabel: "34", unitPrice: 36.00, wholesalePrice: 31.00, stock: 35 },
    ],
  },

  // --- 3. ROPA JEAN INDUSTRIAL ---
  {
    sku: "FYF-JEAN-001",
    name: "Pantalón Jean Stretch Prelavado De Trabajo Para Mujer",
    slug: "pantalon-jean-stretch-prelavado-de-trabajo-para-mujer",
    description: "Pantalón de trabajo industrial para dama confeccionado en denim stretch de alta durabilidad y confort anatómico.",
    material: "Denim 12 oz (98% Algodón / 2% Elastano)",
    categorySlug: "ropa-industrial-trabajo",
    categoryTag: "ROPA INDUSTRIAL DE TRABAJO",
    mainImage: "/images/products/pantalon-jean-mujer.png",
    variants: [
      { sizeLabel: "28", unitPrice: 22.00, wholesalePrice: 18.50, stock: 60 },
      { sizeLabel: "30", unitPrice: 22.00, wholesalePrice: 18.50, stock: 60 },
      { sizeLabel: "32", unitPrice: 22.00, wholesalePrice: 18.50, stock: 60 },
    ],
  },
  {
    sku: "FYF-JEAN-002",
    name: "Pantalón Jean Stretch De Trabajo Para Hombre",
    slug: "pantalon-jean-stretch-de-trabajo-para-hombre",
    description: "Pantalón jean industrial resistente al desgaste con costuras triples y remaches reforzados para hombre.",
    material: "Denim 14 oz 100% Algodón prelavado",
    categorySlug: "ropa-industrial-trabajo",
    categoryTag: "ROPA INDUSTRIAL DE TRABAJO",
    mainImage: "/images/products/pantalon-jean-hombre.png",
    variants: [
      { sizeLabel: "30", unitPrice: 22.00, wholesalePrice: 18.50, stock: 70 },
      { sizeLabel: "32", unitPrice: 22.00, wholesalePrice: 18.50, stock: 70 },
      { sizeLabel: "34", unitPrice: 22.00, wholesalePrice: 18.50, stock: 70 },
    ],
  },
  {
    sku: "FYF-JEAN-003",
    name: "Blusa Jean Clasica Prelavada De Trabajo 100% Algodón Con Cinta",
    slug: "blusa-jean-clasica-prelavada-de-trabajo-con-cinta",
    description: "Camisa/Blusa denim con franjas reflectivas de 2 pulgadas para alta visibilidad y protección operativa.",
    material: "Denim camisa 7.5 oz 100% Algodón",
    categorySlug: "ropa-industrial-trabajo",
    categoryTag: "ROPA INDUSTRIAL DE TRABAJO",
    mainImage: "/images/products/blusa-jean-cinta.png",
    variants: [
      { sizeLabel: "S", unitPrice: 24.50, wholesalePrice: 21.00, stock: 40 },
      { sizeLabel: "M", unitPrice: 24.50, wholesalePrice: 21.00, stock: 40 },
      { sizeLabel: "L", unitPrice: 24.50, wholesalePrice: 21.00, stock: 40 },
    ],
  },
  {
    sku: "FYF-JEAN-004",
    name: "Blusa Jean Clasica Prelavada De Trabajo 100% Algodón",
    slug: "blusa-jean-clasica-prelavada-de-trabajo",
    description: "Blusa jean clásica prelavada 100% algodón suave y transpirable, ideal para personal técnico y de campo.",
    material: "Denim camisa 7.5 oz",
    categorySlug: "ropa-industrial-trabajo",
    categoryTag: "ROPA INDUSTRIAL DE TRABAJO",
    mainImage: "/images/products/blusa-jean-clasica.png",
    variants: [
      { sizeLabel: "S", unitPrice: 21.00, wholesalePrice: 18.00, stock: 50 },
      { sizeLabel: "M", unitPrice: 21.00, wholesalePrice: 18.00, stock: 50 },
    ],
  },
  {
    sku: "FYF-JEAN-005",
    name: "Capucha Jean Clasica De Trabajo 100% Algodón",
    slug: "capucha-jean-clasica-de-trabajo",
    description: "Capucha para soldador y protección de cuello y hombros en tela jean resistente a chispas y calor.",
    material: "Denim 14 oz pesado",
    categorySlug: "ropa-industrial-trabajo",
    categoryTag: "ROPA INDUSTRIAL DE TRABAJO",
    mainImage: "/images/products/capucha-jean.jpg",
    variants: [
      { sizeLabel: "Única", unitPrice: 8.50, wholesalePrice: 6.90, stock: 120 },
    ],
  },

  // --- 4. CALZADO INDUSTRIAL ---
  {
    sku: "FYF-CALZ-001",
    name: "Botín Bompel 4004 DAMA",
    slug: "botin-bompel-4004-dama",
    description: "Botín de seguridad ergonómico para dama con puntera de protección y suela de poliuretano bidensidad antideslizante.",
    material: "Cuero vaqueta legítimo hidrofugado",
    categorySlug: "calzado-industrial",
    categoryTag: "CALZADO INDUSTRIAL",
    mainImage: "/images/products/botin-bompel-4004-dama.jpg",
    variants: [
      { sizeLabel: "35", unitPrice: 42.00, wholesalePrice: 37.00, stock: 25 },
      { sizeLabel: "36", unitPrice: 42.00, wholesalePrice: 37.00, stock: 25 },
      { sizeLabel: "37", unitPrice: 42.00, wholesalePrice: 37.00, stock: 25 },
      { sizeLabel: "38", unitPrice: 42.00, wholesalePrice: 37.00, stock: 25 },
    ],
  },
  {
    sku: "FYF-CALZ-002",
    name: "Botín Bompel BT903CDHP",
    slug: "botin-bompel-bt903cdhp",
    description: "Calzado de seguridad industrial con plantilla antipunción y puntera compuesta libre de metal.",
    material: "Cuero Nobuck premium hidrofugado",
    categorySlug: "calzado-industrial",
    categoryTag: "CALZADO INDUSTRIAL",
    mainImage: "/images/products/botin-bompel-bt903cdhp.jpg",
    variants: [
      { sizeLabel: "39", unitPrice: 46.00, wholesalePrice: 40.50, stock: 30 },
      { sizeLabel: "40", unitPrice: 46.00, wholesalePrice: 40.50, stock: 30 },
      { sizeLabel: "41", unitPrice: 46.00, wholesalePrice: 40.50, stock: 30 },
      { sizeLabel: "42", unitPrice: 46.00, wholesalePrice: 40.50, stock: 30 },
    ],
  },
  {
    sku: "FYF-CALZ-003",
    name: "Botín Bompel BT903CDTC",
    slug: "botin-bompel-bt903cdtc",
    description: "Botín petrolero e industrial para trabajo pesado con absorción de impacto en talón.",
    material: "Cuero curtido al cromo resistente a aceites e hidrocarburos",
    categorySlug: "calzado-industrial",
    categoryTag: "CALZADO INDUSTRIAL",
    mainImage: "/images/products/botin-bompel-bt903cdtc.jpg",
    variants: [
      { sizeLabel: "39", unitPrice: 45.00, wholesalePrice: 39.00, stock: 25 },
      { sizeLabel: "40", unitPrice: 45.00, wholesalePrice: 39.00, stock: 25 },
      { sizeLabel: "41", unitPrice: 45.00, wholesalePrice: 39.00, stock: 25 },
    ],
  },
  {
    sku: "FYF-CALZ-004",
    name: "Botín Bompel BT903CDTC3804",
    slug: "botin-bompel-bt903cdtc3804",
    description: "Botín de seguridad dieléctrico negro certificado para riesgos eléctricos de hasta 14.000 voltios.",
    material: "Cuero liso negro flor entera",
    categorySlug: "calzado-industrial",
    categoryTag: "CALZADO INDUSTRIAL",
    mainImage: "/images/products/botin-bompel-bt903cdtc3804.jpg",
    variants: [
      { sizeLabel: "40", unitPrice: 44.00, wholesalePrice: 38.50, stock: 30 },
      { sizeLabel: "41", unitPrice: 44.00, wholesalePrice: 38.50, stock: 30 },
      { sizeLabel: "42", unitPrice: 44.00, wholesalePrice: 38.50, stock: 30 },
    ],
  },
  {
    sku: "FYF-CALZ-005",
    name: "Botín Bompel BT903ELGI",
    slug: "botin-bompel-bt903elgi",
    description: "Botín elástico sin cordones para calce rápido, resistente a desgarres y cortes.",
    material: "Cuero industrial con elásticos laterales reforzados",
    categorySlug: "calzado-industrial",
    categoryTag: "CALZADO INDUSTRIAL",
    mainImage: "/images/products/botin-bompel-bt903elgi.jpg",
    variants: [
      { sizeLabel: "39", unitPrice: 43.00, wholesalePrice: 37.50, stock: 20 },
      { sizeLabel: "40", unitPrice: 43.00, wholesalePrice: 37.50, stock: 20 },
      { sizeLabel: "41", unitPrice: 43.00, wholesalePrice: 37.50, stock: 20 },
    ],
  },

  // --- 5. IMPLEMENTOS DE SEGURIDAD ---
  {
    sku: "FYF-SEG-001",
    name: "Máscara Para Soldar Screen Delta Plus",
    slug: "mascara-para-soldar-screen-delta-plus",
    description: "Careta de soldadura termoformada con visor abatible para protección contra radiación UV e infrarroja.",
    material: "Polipropileno de alto impacto resistente a chispas",
    categorySlug: "implementos-seguridad",
    categoryTag: "IMPLEMENTOS DE SEGURIDAD",
    mainImage: "/images/products/mascara-soldar-screen.png",
    variants: [
      { sizeLabel: "Universal", unitPrice: 18.00, wholesalePrice: 15.00, stock: 60 },
    ],
  },
  {
    sku: "FYF-SEG-002",
    name: "Máscara Media Cara Delta Plus",
    slug: "mascara-media-cara-delta-plus",
    description: "Respirador de media cara con doble filtro para vapores orgánicos, gases ácidos y material particulado.",
    material: "Silicone termoplástico hipoalergénico",
    categorySlug: "implementos-seguridad",
    categoryTag: "IMPLEMENTOS DE SEGURIDAD",
    mainImage: "/images/products/mascara-media-cara.png",
    variants: [
      { sizeLabel: "M/L", unitPrice: 22.00, wholesalePrice: 18.90, stock: 50 },
    ],
  },
  {
    sku: "FYF-SEG-003",
    name: "Guante de nylon con recubrimiento de poliuretano en palma | Plux",
    slug: "guante-nylon-recubrimiento-poliuretano-plux",
    description: "Guante ligero de excelente destreza para ensamble fino, electrónica y manipulación mecánica.",
    material: "Nylon galga 13 + poliuretano",
    categorySlug: "implementos-seguridad",
    categoryTag: "IMPLEMENTOS DE SEGURIDAD",
    mainImage: "/images/products/guante-nylon-poliuretano.png",
    variants: [
      { sizeLabel: "M", unitPrice: 2.20, wholesalePrice: 1.65, stock: 500 },
      { sizeLabel: "L", unitPrice: 2.20, wholesalePrice: 1.65, stock: 500 },
    ],
  },
  {
    sku: "FYF-SEG-004",
    name: "Guantes Químicos de Nitrilo Liso Delta Plus",
    slug: "guantes-quimicos-nitrilo-liso-delta-plus",
    description: "Guantes resistentes a productos químicos agresivos, disolventes, grasas y aceites industriales.",
    material: "Nitrilo de alto grosor floculado en algodón",
    categorySlug: "implementos-seguridad",
    categoryTag: "IMPLEMENTOS DE SEGURIDAD",
    mainImage: "/images/products/guantes-quimicos-nitrilo.png",
    variants: [
      { sizeLabel: "8", unitPrice: 4.80, wholesalePrice: 3.90, stock: 200 },
      { sizeLabel: "9", unitPrice: 4.80, wholesalePrice: 3.90, stock: 200 },
    ],
  },
  {
    sku: "FYF-SEG-005",
    name: "Guante de poliéster con recubrimiento de nitrilo en palma | Plux",
    slug: "guante-poliester-recubrimiento-nitrilo-plux",
    description: "Guante con recubrimiento microporoso de nitrilo negro para máxima durabilidad y agarre en seco o húmedo.",
    material: "Poliéster + microespuma de nitrilo",
    categorySlug: "implementos-seguridad",
    categoryTag: "IMPLEMENTOS DE SEGURIDAD",
    mainImage: "/images/products/guante-poliester-nitrilo.png",
    variants: [
      { sizeLabel: "M", unitPrice: 2.50, wholesalePrice: 1.95, stock: 400 },
      { sizeLabel: "L", unitPrice: 2.50, wholesalePrice: 1.95, stock: 400 },
    ],
  },
];
