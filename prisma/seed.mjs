import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const CATEGORIES_DATA = [
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

async function main() {
  console.log("🌱 Iniciando seed de base de datos MySQL para FYF Uniformes...");

  // 1. Configuración de la tienda
  await prisma.storeSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      whatsappPrimary: "593993358701",
      whatsappSecondary: "593988742584",
      whatsappActiveNumber: "593993358701",
      whatsappTemplate: "Hola FYF Uniformes, deseo realizar una cotización/pedido: *{orderNumber}*...",
      shippingBasePichincha: 3.50,
      shippingBaseNational: 5.50,
      payphoneIsSandbox: true,
    },
  });

  // 2. Usuarios administrativos iniciales
  const adminPasswordHash = await bcrypt.hash("FyfAdmin2026*", 10);
  const colabPasswordHash = await bcrypt.hash("FyfColab2026*", 10);

  await prisma.user.upsert({
    where: { email: "admin@fyf.com.ec" },
    update: {},
    create: {
      id: "usr_admin_01",
      name: "Administrador FYF",
      email: "admin@fyf.com.ec",
      username: "admin",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
      isActive: true,
    },
  });

  await prisma.user.upsert({
    where: { email: "ventas@fyf.com.ec" },
    update: {},
    create: {
      id: "usr_colab_01",
      name: "Colaborador FYF",
      email: "ventas@fyf.com.ec",
      username: "colaborador",
      passwordHash: colabPasswordHash,
      role: "COLABORADOR",
      isActive: true,
    },
  });

  // 3. Categorías
  for (const cat of CATEGORIES_DATA) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        image: cat.image,
        order: cat.order,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image: cat.image,
        order: cat.order,
      },
    });
  }

  console.log("✅ Seed completado exitosamente en MySQL.");
}

main()
  .catch((e) => {
    console.error("❌ Error ejecutando seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
