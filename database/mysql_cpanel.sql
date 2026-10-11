-- =============================================================================
-- FYF UNIFORMES - SCRIPT DE BASE DE DATOS MYSQL PARA CPANEL / PHPMYADMIN
-- Compatible con MySQL 5.7+ / MySQL 8.0+ / MariaDB 10.4+
-- =============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------------------
-- 1. Tabla: User (Administradores, Colaboradores y Clientes)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `User` (
  `id` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `username` VARCHAR(191) NULL,
  `passwordHash` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(191) NULL,
  `idNumber` VARCHAR(191) NULL,
  `role` ENUM('ADMIN', 'COLABORADOR', 'CLIENTE') NOT NULL DEFAULT 'CLIENTE',
  `isActive` BOOLEAN NOT NULL DEFAULT true,
  `lastLogin` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `User_email_key` (`email`),
  UNIQUE INDEX `User_username_key` (`username`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 2. Tabla: Address (Direcciones de Clientes)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `Address` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `recipient` VARCHAR(191) NOT NULL,
  `idNumber` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(191) NOT NULL,
  `province` VARCHAR(191) NOT NULL,
  `city` VARCHAR(191) NOT NULL,
  `street` TEXT NOT NULL,
  `reference` TEXT NULL,
  `isDefault` BOOLEAN NOT NULL DEFAULT false,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `Address_userId_idx` (`userId`),
  CONSTRAINT `Address_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 3. Tabla: Category (Categorías del Catálogo)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `Category` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `slug` VARCHAR(191) NOT NULL,
  `description` TEXT NULL,
  `image` VARCHAR(191) NULL,
  `order` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `Category_name_key` (`name`),
  UNIQUE INDEX `Category_slug_key` (`slug`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 4. Tabla: Product (Productos del Catálogo)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `Product` (
  `id` VARCHAR(191) NOT NULL,
  `sku` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `slug` VARCHAR(191) NOT NULL,
  `description` TEXT NOT NULL,
  `material` VARCHAR(191) NULL,
  `categoryId` VARCHAR(191) NOT NULL,
  `mainImage` VARCHAR(191) NOT NULL,
  `images` JSON NULL,
  `hasLogoOption` BOOLEAN NOT NULL DEFAULT false,
  `logoPriceExtra` DECIMAL(10, 2) NOT NULL DEFAULT 0.20,
  `allowCustomSize` BOOLEAN NOT NULL DEFAULT false,
  `isActive` BOOLEAN NOT NULL DEFAULT true,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `Product_sku_key` (`sku`),
  UNIQUE INDEX `Product_slug_key` (`slug`),
  INDEX `Product_categoryId_idx` (`categoryId`),
  CONSTRAINT `Product_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 5. Tabla: ProductVariant (Tallas, Colores y Precios Escalonados)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `ProductVariant` (
  `id` VARCHAR(191) NOT NULL,
  `productId` VARCHAR(191) NOT NULL,
  `code` VARCHAR(191) NULL,
  `sizeLabel` VARCHAR(191) NOT NULL,
  `shape` VARCHAR(191) NULL,
  `color` VARCHAR(191) NULL,
  `unitPrice` DECIMAL(10, 2) NOT NULL,
  `dozenPrice` DECIMAL(10, 2) NOT NULL,
  `wholesalePrice` DECIMAL(10, 2) NOT NULL,
  `stock` INT NOT NULL DEFAULT 999,
  `isActive` BOOLEAN NOT NULL DEFAULT true,
  PRIMARY KEY (`id`),
  INDEX `ProductVariant_productId_idx` (`productId`),
  CONSTRAINT `ProductVariant_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 6. Tabla: Order (Pedidos del E-commerce)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `Order` (
  `id` VARCHAR(191) NOT NULL,
  `orderNumber` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NULL,
  `customerName` VARCHAR(191) NOT NULL,
  `customerIdNumber` VARCHAR(191) NOT NULL,
  `customerEmail` VARCHAR(191) NOT NULL,
  `customerPhone` VARCHAR(191) NOT NULL,
  `shippingAddress` TEXT NOT NULL,
  `shippingCity` VARCHAR(191) NOT NULL,
  `shippingProvince` VARCHAR(191) NOT NULL,
  `shippingReference` TEXT NULL,
  `shippingMethod` VARCHAR(191) NOT NULL DEFAULT 'domicilio',
  `paymentMethod` ENUM('PAYPHONE_CARD', 'WHATSAPP_ORDER', 'TRANSFERENCIA_DIRECTA') NOT NULL,
  `paymentStatus` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
  `payphoneTransactionId` VARCHAR(191) NULL,
  `orderStatus` ENUM('PENDIENTE', 'PAGADO', 'EN_PREPARACION', 'ENVIADO', 'ENTREGADO', 'CANCELADO') NOT NULL DEFAULT 'PENDIENTE',
  `subtotal` DECIMAL(10, 2) NOT NULL,
  `shippingCost` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `total` DECIMAL(10, 2) NOT NULL,
  `notes` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `Order_orderNumber_key` (`orderNumber`),
  INDEX `Order_userId_idx` (`userId`),
  CONSTRAINT `Order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 7. Tabla: OrderItem (Ítems de cada Pedido)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `OrderItem` (
  `id` VARCHAR(191) NOT NULL,
  `orderId` VARCHAR(191) NOT NULL,
  `productId` VARCHAR(191) NULL,
  `productName` VARCHAR(191) NOT NULL DEFAULT 'Producto FYF Uniformes',
  `variantDetails` JSON NOT NULL,
  `quantity` INT NOT NULL,
  `unitPrice` DECIMAL(10, 2) NOT NULL,
  `subtotal` DECIMAL(10, 2) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `OrderItem_orderId_idx` (`orderId`),
  INDEX `OrderItem_productId_idx` (`productId`),
  CONSTRAINT `OrderItem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `OrderItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 8. Tabla: ShippingTracking (Seguimiento de Envíos)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `ShippingTracking` (
  `id` VARCHAR(191) NOT NULL,
  `orderId` VARCHAR(191) NOT NULL,
  `courier` VARCHAR(191) NOT NULL,
  `trackingNumber` VARCHAR(191) NOT NULL,
  `trackingUrl` VARCHAR(191) NULL,
  `shippedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `deliveredAt` DATETIME(3) NULL,
  `notes` TEXT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `ShippingTracking_orderId_key` (`orderId`),
  CONSTRAINT `ShippingTracking_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 9. Tabla: WhatsAppInteraction (Analítica de Cotizaciones por WhatsApp)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `WhatsAppInteraction` (
  `id` VARCHAR(191) NOT NULL,
  `productId` VARCHAR(191) NULL,
  `variantDetails` JSON NOT NULL,
  `calculatedPrice` DECIMAL(10, 2) NOT NULL,
  `quantity` INT NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `WhatsAppInteraction_productId_idx` (`productId`),
  CONSTRAINT `WhatsAppInteraction_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 10. Tabla: StoreSettings (Configuración Global de Tienda y Promociones)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `StoreSettings` (
  `id` VARCHAR(191) NOT NULL DEFAULT 'default',
  `whatsappPrimary` VARCHAR(191) NOT NULL DEFAULT '593993358701',
  `whatsappSecondary` VARCHAR(191) NOT NULL DEFAULT '593988742584',
  `whatsappActiveNumber` VARCHAR(191) NOT NULL DEFAULT '593993358701',
  `whatsappTemplate` VARCHAR(500) NOT NULL DEFAULT 'Hola FYF Uniformes, deseo realizar una cotización/pedido: *{orderNumber}*...',
  `payphoneClientId` VARCHAR(191) NULL,
  `payphoneAppId` VARCHAR(191) NULL,
  `payphoneToken` TEXT NULL,
  `payphoneIsSandbox` BOOLEAN NOT NULL DEFAULT true,
  `shippingBasePichincha` DECIMAL(10, 2) NOT NULL DEFAULT 3.50,
  `shippingBaseNational` DECIMAL(10, 2) NOT NULL DEFAULT 5.50,
  `promotionsJson` JSON NULL,
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE=InnoDB;

-- =============================================================================
-- DATOS INICIALES (SEED)
-- =============================================================================

-- 1. Configuración por defecto de la tienda
INSERT IGNORE INTO `StoreSettings` (
  `id`, `whatsappPrimary`, `whatsappSecondary`, `whatsappActiveNumber`, `whatsappTemplate`,
  `payphoneIsSandbox`, `shippingBasePichincha`, `shippingBaseNational`, `updatedAt`
) VALUES (
  'default', '593993358701', '593988742584', '593993358701',
  'Hola FYF Uniformes, deseo realizar una cotización/pedido: *{orderNumber}*...',
  1, 3.50, 5.50, NOW(3)
);

-- 2. Usuarios iniciales (Contraseñas cifradas con bcrypt: Admin -> FyfAdmin2026* | Colaborador -> FyfColab2026*)
INSERT IGNORE INTO `User` (
  `id`, `email`, `username`, `passwordHash`, `name`, `phone`, `role`, `isActive`, `createdAt`, `updatedAt`
) VALUES
  ('usr_admin_01', 'admin@fyf.com.ec', 'admin', '$2b$10$AdBlSuzynx8GQOHCMO/glOhLkrDX5u/LY8DSwGkKQB8SgNKFq4Q1i', 'Administrador FYF', '0993358701', 'ADMIN', 1, NOW(3), NOW(3)),
  ('usr_colab_01', 'ventas@fyf.com.ec', 'colaborador', '$2b$10$nbf12tXPreaJVRA0ZLlXceYHKuCN9bUIzSOvd8qDt1pP2F3.Y0GxC', 'Colaborador FYF', '0988742584', 'COLABORADOR', 1, NOW(3), NOW(3));

-- 3. Categorías oficiales
INSERT IGNORE INTO `Category` (`id`, `name`, `slug`, `description`, `image`, `order`) VALUES
  ('cat_ropa_termica', 'ROPA TÉRMICA', 'ropa-termica', 'Chompas, chaveras y trajes con aislamiento térmico para cuartos fríos y bajas temperaturas.', '/images/categories/ropa-termica.jpg', 1),
  ('cat_ropa_ignifuga', 'ROPA IGNÍFUGA', 'ropa-ignifuga', 'Overoles y pantalones ignífugos retardantes al fuego con cintas reflectivas de alta visibilidad.', '/images/categories/ropa-ignifuga.jpg', 2),
  ('cat_uniformes_pers', 'UNIFORMES PERSONALIZADOS', 'uniformes-personalizados', 'Camisas, blusas, buzos polo y prendas corporativas con bordado y diseño a la medida.', '/images/categories/uniformes-personalizados.jpg', 3),
  ('cat_ropa_industrial', 'ROPA INDUSTRIAL DE TRABAJO', 'ropa-industrial-trabajo', 'Pantalones, blusas, capuchas y overoles jean 100% algodón prelavado para máxima resistencia.', '/images/categories/ropa-industrial-trabajo.png', 4),
  ('cat_calzado_ind', 'CALZADO INDUSTRIAL', 'calzado-industrial', 'Botines de seguridad dieléctricos con puntera de acero o composite de marcas líderes como Bompel y Marluvas.', '/images/categories/calzado-industrial.jpg', 5),
  ('cat_imp_seguridad', 'IMPLEMENTOS DE SEGURIDAD', 'implementos-seguridad', 'Protección respiratoria, auditiva, guantes de nitrilo/poliuretano y cascos certificados Delta Plus y Libus.', '/images/categories/implementos-seguridad.jpg', 6),
  ('cat_ropa_pvc', 'ROPA INDUSTRIAL PVC', 'ropa-industrial-pvc', 'Trajes impermeables en PVC de alta densidad para trabajo bajo agua, químicos y condiciones extremas.', '/images/categories/ropa-industrial-pvc.jpg', 7);

-- 4. Productos oficiales
INSERT IGNORE INTO `Product` (`id`, `sku`, `name`, `slug`, `description`, `material`, `categoryId`, `mainImage`, `hasLogoOption`, `logoPriceExtra`, `allowCustomSize`, `isActive`, `createdAt`, `updatedAt`) VALUES
  ('prod_term_001', 'FYF-TERM-001', 'Chompa Combinada Térmica Con Cinta Reflectiva Tres Capas / Protección Térmica', 'chompa-combinada-termica-con-cinta-reflectiva-tres-capas-proteccion-termica', 'Chompa térmica combinada de tres capas de alta protección con franjas reflectivas. Diseñada para cuartos fríos y ambientes de temperaturas bajo cero.', 'Poliéster térmico impermeable 3 capas + forro aislante', 'cat_ropa_termica', '/images/products/chompa-combinada-cinta.png', 1, 0.20, 0, 1, NOW(3), NOW(3)),
  ('prod_term_002', 'FYF-TERM-002', 'Chompa Combinada Termica Tres Capas / Protección Para Cuartos Fríos', 'chompa-combinada-termica-tres-capas-proteccion-para-cuartos-frios', 'Chompa térmica de alta visibilidad para operarios de frigoríficos e industrias alimentarias.', 'Tela impermeable 3 capas + fibra siliconada', 'cat_ropa_termica', '/images/products/chompa-combinada-cuartos-frios.png', 1, 0.20, 0, 1, NOW(3), NOW(3)),
  ('prod_term_003', 'FYF-TERM-003', 'Chavera Térmico Impermeable Thinsulate / Protección Para Cuartos Fríos', 'chavera-termico-impermeable-thinsulate-proteccion-para-cuartos-frios-3', 'Chavera térmico ergonómico en color azul rey, impermeable con forro Thinsulate de alta densidad.', 'Thinsulate térmico hidrofóbico', 'cat_ropa_termica', '/images/products/chavera-azul-rey.png', 1, 0.20, 0, 1, NOW(3), NOW(3)),
  ('prod_term_004', 'FYF-TERM-004', 'Chavera Térmico Impermeable Thinsulate / Protección Para Cuartos Fríos (Azul)', 'chavera-termico-impermeable-thinsulate-proteccion-para-cuartos-frios-2', 'Gorro térmico chavera tipo pasamontañas con ajuste anatómico para cuartos frigoríficos.', 'Nylon tafetán impermeable + aislamiento térmico', 'cat_ropa_termica', '/images/products/chavera-azul-marino.png', 0, 0.20, 0, 1, NOW(3), NOW(3)),
  ('prod_term_005', 'FYF-TERM-005', 'Chavera Térmico Impermeable Thinsulate / Protección Para Cuartos Fríos (Gris)', 'chavera-termico-impermeable-thinsulate-proteccion-para-cuartos-frios', 'Chavera térmica impermeable color gris con aislamiento para temperaturas extremas.', 'Thinsulate térmico 150g', 'cat_ropa_termica', '/images/products/chavera-gris.png', 0, 0.20, 0, 1, NOW(3), NOW(3)),
  ('prod_ign_001', 'FYF-IGN-001', 'Overol Clasico Ignifugo Con Cinta Reflectiva / ROPA IGNIFUGA', 'overol-clasico-ignifugo-con-cinta-reflectiva', 'Overol retardante a la flama certificado con costuras reforzadas de aramida y cintas reflectivas 3M ignífugas.', 'Algodón Ignífugo 100% Tratado FR 280g/m²', 'cat_ropa_ignifuga', '/images/products/overol-ignifugo-cinta.jpg', 1, 0.20, 0, 1, NOW(3), NOW(3)),
  ('prod_ign_002', 'FYF-IGN-002', 'Overol Clasico Ignifugo / ROPA IGNIFUGA', 'overol-clasico-ignifugo', 'Overol ignífugo clásico para industria petrolera, minera, soldadura y subestaciones eléctricas.', 'Algodón Ignífugo FR certificado NFPA 2112', 'cat_ropa_ignifuga', '/images/products/overol-ignifugo-clasico.jpg', 0, 0.20, 0, 1, NOW(3), NOW(3)),
  ('prod_ign_003', 'FYF-IGN-003', 'Pantalón Clásico Ignifugo Con Cinta Reflectiva / ROPA REFLECTIVA', 'pantalon-clasico-ignifugo-con-cinta-reflectiva', 'Pantalón ignífugo retardante con cinta reflectiva en piernas, bolsillos funcionales y refuerzo de tiro.', 'Tela ignífuga 8.5 oz', 'cat_ropa_ignifuga', '/images/products/pantalon-ignifugo-cinta.jpg', 0, 0.20, 0, 1, NOW(3), NOW(3)),
  ('prod_ign_004', 'FYF-IGN-004', 'Pantalón Clásico Ignifugo / ROPA IGNIFUGA', 'pantalon-clasico-ignifugo', 'Pantalón de trabajo ignífugo corte clásico para faenas industriales pesadas.', 'Algodón 100% tratamiento retardante', 'cat_ropa_ignifuga', '/images/products/pantalon-ignifugo-clasico.jpg', 0, 0.20, 0, 1, NOW(3), NOW(3)),
  ('prod_ign_005', 'FYF-IGN-005', 'Pantalón Ignifugó Modelo Safari / Retardante Al Fuego / ROPA IGNIFUGA', 'pantalon-ignifugo-modelo-safari-retardante-al-fuego', 'Pantalón ignífugo estilo safari con múltiples bolsillos de carga laterales y cierre de seguridad.', 'Algodón ignífugo 9 oz tipo cargo', 'cat_ropa_ignifuga', '/images/products/pantalon-ignifugo-safari.jpg', 0, 0.20, 0, 1, NOW(3), NOW(3)),
  ('prod_jean_001', 'FYF-JEAN-001', 'Pantalón Jean Stretch Prelavado De Trabajo Para Mujer', 'pantalon-jean-stretch-prelavado-de-trabajo-para-mujer', 'Pantalón de trabajo industrial para dama confeccionado en denim stretch de alta durabilidad y confort anatómico.', 'Denim 12 oz (98% Algodón / 2% Elastano)', 'cat_ropa_industrial', '/images/products/pantalon-jean-mujer.png', 0, 0.20, 0, 1, NOW(3), NOW(3)),
  ('prod_jean_002', 'FYF-JEAN-002', 'Pantalón Jean Stretch De Trabajo Para Hombre', 'pantalon-jean-stretch-de-trabajo-para-hombre', 'Pantalón jean industrial resistente al desgaste con costuras triples y remaches reforzados para hombre.', 'Denim 14 oz 100% Algodón prelavado', 'cat_ropa_industrial', '/images/products/pantalon-jean-hombre.png', 0, 0.20, 0, 1, NOW(3), NOW(3)),
  ('prod_jean_003', 'FYF-JEAN-003', 'Blusa Jean Clasica Prelavada De Trabajo 100% Algodón Con Cinta', 'blusa-jean-clasica-prelavada-de-trabajo-con-cinta', 'Camisa/Blusa denim con franjas reflectivas de 2 pulgadas para alta visibilidad y protección operativa.', 'Denim camisa 7.5 oz 100% Algodón', 'cat_ropa_industrial', '/images/products/blusa-jean-cinta.png', 0, 0.20, 0, 1, NOW(3), NOW(3)),
  ('prod_jean_004', 'FYF-JEAN-004', 'Blusa Jean Clasica Prelavada De Trabajo 100% Algodón', 'blusa-jean-clasica-prelavada-de-trabajo', 'Blusa jean clásica prelavada 100% algodón suave y transpirable, ideal para personal técnico y de campo.', 'Denim camisa 7.5 oz', 'cat_ropa_industrial', '/images/products/blusa-jean-clasica.png', 0, 0.20, 0, 1, NOW(3), NOW(3)),
  ('prod_jean_005', 'FYF-JEAN-005', 'Capucha Jean Clasica De Trabajo 100% Algodón', 'capucha-jean-clasica-de-trabajo', 'Capucha para soldador y protección de cuello y hombros en tela jean resistente a chispas y calor.', 'Denim 14 oz pesado', 'cat_ropa_industrial', '/images/products/capucha-jean.jpg', 0, 0.20, 0, 1, NOW(3), NOW(3)),
  ('prod_calz_001', 'FYF-CALZ-001', 'Botín Bompel 4004 DAMA', 'botin-bompel-4004-dama', 'Botín de seguridad ergonómico para dama con puntera de protección y suela de poliuretano bidensidad antideslizante.', 'Cuero vaqueta legítimo hidrofugado', 'cat_calzado_ind', '/images/products/botin-bompel-4004-dama.jpg', 0, 0.20, 0, 1, NOW(3), NOW(3)),
  ('prod_calz_002', 'FYF-CALZ-002', 'Botín Bompel BT903CDHP', 'botin-bompel-bt903cdhp', 'Calzado de seguridad industrial con plantilla antipunción y puntera compuesta libre de metal.', 'Cuero Nobuck premium hidrofugado', 'cat_calzado_ind', '/images/products/botin-bompel-bt903cdhp.jpg', 0, 0.20, 0, 1, NOW(3), NOW(3)),
  ('prod_calz_003', 'FYF-CALZ-003', 'Botín Bompel BT903CDTC', 'botin-bompel-bt903cdtc', 'Botín petrolero e industrial para trabajo pesado con absorción de impacto en talón.', 'Cuero curtido al cromo resistente a aceites e hidrocarburos', 'cat_calzado_ind', '/images/products/botin-bompel-bt903cdtc.jpg', 0, 0.20, 0, 1, NOW(3), NOW(3)),
  ('prod_calz_004', 'FYF-CALZ-004', 'Botín Bompel BT903CDTC3804', 'botin-bompel-bt903cdtc3804', 'Botín de seguridad dieléctrico negro certificado para riesgos eléctricos de hasta 14.000 voltios.', 'Cuero liso negro flor entera', 'cat_calzado_ind', '/images/products/botin-bompel-bt903cdtc3804.jpg', 0, 0.20, 0, 1, NOW(3), NOW(3)),
  ('prod_calz_005', 'FYF-CALZ-005', 'Botín Bompel BT903ELGI', 'botin-bompel-bt903elgi', 'Botín elástico sin cordones para calce rápido, resistente a desgarres y cortes.', 'Cuero industrial con elásticos laterales reforzados', 'cat_calzado_ind', '/images/products/botin-bompel-bt903elgi.jpg', 0, 0.20, 0, 1, NOW(3), NOW(3)),
  ('prod_seg_001', 'FYF-SEG-001', 'Máscara Para Soldar Screen Delta Plus', 'mascara-para-soldar-screen-delta-plus', 'Careta de soldadura termoformada con visor abatible para protección contra radiación UV e infrarroja.', 'Polipropileno de alto impacto resistente a chispas', 'cat_imp_seguridad', '/images/products/mascara-soldar-screen.png', 0, 0.20, 0, 1, NOW(3), NOW(3)),
  ('prod_seg_002', 'FYF-SEG-002', 'Máscara Media Cara Delta Plus', 'mascara-media-cara-delta-plus', 'Respirador de media cara con doble filtro para vapores orgánicos, gases ácidos y material particulado.', 'Silicone termoplástico hipoalergénico', 'cat_imp_seguridad', '/images/products/mascara-media-cara.png', 0, 0.20, 0, 1, NOW(3), NOW(3)),
  ('prod_seg_003', 'FYF-SEG-003', 'Guante de nylon con recubrimiento de poliuretano en palma | Plux', 'guante-nylon-recubrimiento-poliuretano-plux', 'Guante ligero de excelente destreza para ensamble fino, electrónica y manipulación mecánica.', 'Nylon galga 13 + poliuretano', 'cat_imp_seguridad', '/images/products/guante-nylon-poliuretano.png', 0, 0.20, 0, 1, NOW(3), NOW(3)),
  ('prod_seg_004', 'FYF-SEG-004', 'Guantes Químicos de Nitrilo Liso Delta Plus', 'guantes-quimicos-nitrilo-liso-delta-plus', 'Guantes resistentes a productos químicos agresivos, disolventes, grasas y aceites industriales.', 'Nitrilo de alto grosor floculado en algodón', 'cat_imp_seguridad', '/images/products/guantes-quimicos-nitrilo.png', 0, 0.20, 0, 1, NOW(3), NOW(3)),
  ('prod_seg_005', 'FYF-SEG-005', 'Guante de poliéster con recubrimiento de nitrilo en palma | Plux', 'guante-poliester-recubrimiento-nitrilo-plux', 'Guante con recubrimiento microporoso de nitrilo negro para máxima durabilidad y agarre en seco o húmedo.', 'Poliéster + microespuma de nitrilo', 'cat_imp_seguridad', '/images/products/guante-poliester-nitrilo.png', 0, 0.20, 0, 1, NOW(3), NOW(3));

-- 5. Variantes de Productos (Tallas y Precios)
INSERT IGNORE INTO `ProductVariant` (`id`, `productId`, `sizeLabel`, `unitPrice`, `dozenPrice`, `wholesalePrice`, `stock`, `isActive`) VALUES
  ('var_term_001_s', 'prod_term_001', 'S', 48.00, 45.00, 42.00, 50, 1),
  ('var_term_001_m', 'prod_term_001', 'M', 48.00, 45.00, 42.00, 50, 1),
  ('var_term_001_l', 'prod_term_001', 'L', 48.00, 45.00, 42.00, 50, 1),
  ('var_term_001_xl', 'prod_term_001', 'XL', 52.00, 48.50, 45.00, 30, 1),
  ('var_term_002_s', 'prod_term_002', 'S', 45.00, 42.00, 39.50, 40, 1),
  ('var_term_002_m', 'prod_term_002', 'M', 45.00, 42.00, 39.50, 40, 1),
  ('var_term_002_l', 'prod_term_002', 'L', 45.00, 42.00, 39.50, 40, 1),
  ('var_term_003_std', 'prod_term_003', 'Estándar', 16.50, 15.25, 14.00, 100, 1),
  ('var_term_004_std', 'prod_term_004', 'Estándar', 16.50, 15.25, 14.00, 80, 1),
  ('var_term_005_std', 'prod_term_005', 'Estándar', 16.50, 15.25, 14.00, 90, 1),
  ('var_ign_001_38', 'prod_ign_001', '38', 58.00, 54.50, 51.00, 40, 1),
  ('var_ign_001_40', 'prod_ign_001', '40', 58.00, 54.50, 51.00, 40, 1),
  ('var_ign_001_42', 'prod_ign_001', '42', 58.00, 54.50, 51.00, 35, 1),
  ('var_ign_002_38', 'prod_ign_002', '38', 52.00, 49.00, 46.00, 30, 1),
  ('var_ign_002_40', 'prod_ign_002', '40', 52.00, 49.00, 46.00, 30, 1),
  ('var_ign_003_30', 'prod_ign_003', '30', 34.00, 31.75, 29.50, 50, 1),
  ('var_ign_003_32', 'prod_ign_003', '32', 34.00, 31.75, 29.50, 50, 1),
  ('var_ign_003_34', 'prod_ign_003', '34', 34.00, 31.75, 29.50, 50, 1),
  ('var_ign_004_30', 'prod_ign_004', '30', 31.00, 29.00, 27.00, 45, 1),
  ('var_ign_004_32', 'prod_ign_004', '32', 31.00, 29.00, 27.00, 45, 1),
  ('var_ign_005_30', 'prod_ign_005', '30', 36.00, 33.50, 31.00, 35, 1),
  ('var_ign_005_32', 'prod_ign_005', '32', 36.00, 33.50, 31.00, 35, 1),
  ('var_ign_005_34', 'prod_ign_005', '34', 36.00, 33.50, 31.00, 35, 1),
  ('var_jean_001_28', 'prod_jean_001', '28', 22.00, 20.25, 18.50, 60, 1),
  ('var_jean_001_30', 'prod_jean_001', '30', 22.00, 20.25, 18.50, 60, 1),
  ('var_jean_001_32', 'prod_jean_001', '32', 22.00, 20.25, 18.50, 60, 1),
  ('var_jean_002_30', 'prod_jean_002', '30', 22.00, 20.25, 18.50, 70, 1),
  ('var_jean_002_32', 'prod_jean_002', '32', 22.00, 20.25, 18.50, 70, 1),
  ('var_jean_002_34', 'prod_jean_002', '34', 22.00, 20.25, 18.50, 70, 1),
  ('var_jean_003_s', 'prod_jean_003', 'S', 24.50, 22.75, 21.00, 40, 1),
  ('var_jean_003_m', 'prod_jean_003', 'M', 24.50, 22.75, 21.00, 40, 1),
  ('var_jean_003_l', 'prod_jean_003', 'L', 24.50, 22.75, 21.00, 40, 1),
  ('var_jean_004_s', 'prod_jean_004', 'S', 21.00, 19.50, 18.00, 50, 1),
  ('var_jean_004_m', 'prod_jean_004', 'M', 21.00, 19.50, 18.00, 50, 1),
  ('var_jean_005_uni', 'prod_jean_005', 'Única', 8.50, 7.70, 6.90, 120, 1),
  ('var_calz_001_35', 'prod_calz_001', '35', 42.00, 39.50, 37.00, 25, 1),
  ('var_calz_001_36', 'prod_calz_001', '36', 42.00, 39.50, 37.00, 25, 1),
  ('var_calz_001_37', 'prod_calz_001', '37', 42.00, 39.50, 37.00, 25, 1),
  ('var_calz_001_38', 'prod_calz_001', '38', 42.00, 39.50, 37.00, 25, 1),
  ('var_calz_002_39', 'prod_calz_002', '39', 46.00, 43.25, 40.50, 30, 1),
  ('var_calz_002_40', 'prod_calz_002', '40', 46.00, 43.25, 40.50, 30, 1),
  ('var_calz_002_41', 'prod_calz_002', '41', 46.00, 43.25, 40.50, 30, 1),
  ('var_calz_002_42', 'prod_calz_002', '42', 46.00, 43.25, 40.50, 30, 1),
  ('var_calz_003_39', 'prod_calz_003', '39', 45.00, 42.00, 39.00, 25, 1),
  ('var_calz_003_40', 'prod_calz_003', '40', 45.00, 42.00, 39.00, 25, 1),
  ('var_calz_003_41', 'prod_calz_003', '41', 45.00, 42.00, 39.00, 25, 1),
  ('var_calz_004_40', 'prod_calz_004', '40', 44.00, 41.25, 38.50, 30, 1),
  ('var_calz_004_41', 'prod_calz_004', '41', 44.00, 41.25, 38.50, 30, 1),
  ('var_calz_004_42', 'prod_calz_004', '42', 44.00, 41.25, 38.50, 30, 1),
  ('var_calz_005_39', 'prod_calz_005', '39', 43.00, 40.25, 37.50, 20, 1),
  ('var_calz_005_40', 'prod_calz_005', '40', 43.00, 40.25, 37.50, 20, 1),
  ('var_calz_005_41', 'prod_calz_005', '41', 43.00, 40.25, 37.50, 20, 1),
  ('var_seg_001_uni', 'prod_seg_001', 'Universal', 18.00, 16.50, 15.00, 60, 1),
  ('var_seg_002_ml', 'prod_seg_002', 'M/L', 22.00, 20.45, 18.90, 50, 1),
  ('var_seg_003_m', 'prod_seg_003', 'M', 2.20, 1.90, 1.65, 500, 1),
  ('var_seg_003_l', 'prod_seg_003', 'L', 2.20, 1.90, 1.65, 500, 1),
  ('var_seg_004_8', 'prod_seg_004', '8', 4.80, 4.35, 3.90, 200, 1),
  ('var_seg_004_9', 'prod_seg_004', '9', 4.80, 4.35, 3.90, 200, 1),
  ('var_seg_005_m', 'prod_seg_005', 'M', 2.50, 2.20, 1.95, 400, 1),
  ('var_seg_005_l', 'prod_seg_005', 'L', 2.50, 2.20, 1.95, 400, 1);

SET FOREIGN_KEY_CHECKS = 1;
