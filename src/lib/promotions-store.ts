import fs from "fs";
import path from "path";

export interface PopupPromotion {
  enabled: boolean;
  badge: string;
  title: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  imageUrl?: string;
  updatedAt?: string;
}

export interface NavbarPromotionItem {
  id: string;
  icon: "truck" | "gift" | "sparkles" | "credit-card" | "tag";
  text: string;
  highlight?: string;
  linkUrl?: string;
}

export interface PromotionsConfig {
  popup: PopupPromotion;
  ticker: {
    enabled: boolean;
    intervalSeconds: number;
    messages: NavbarPromotionItem[];
  };
  updatedAt?: string;
}

export const DEFAULT_PROMOTIONS: PromotionsConfig = {
  popup: {
    enabled: true,
    badge: "OFERTA MAYORISTA ALINA SHOP",
    title: "¡Precios de Fábrica en Bases MDF & Toppers!",
    description:
      "Aprovecha hasta 25% de ahorro en docenas y bases con corte láser de alta densidad. Personaliza gratis o graba el logotipo de tu marca pastelera.",
    buttonText: "Ver Catálogo Completo",
    buttonUrl: "/catalogo",
    imageUrl: "/images/products/bases-mdf/base-mdf-blanco-wengue.png",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  ticker: {
    enabled: true,
    intervalSeconds: 4,
    messages: [
      {
        id: "msg_1",
        icon: "truck",
        text: "Envíos asegurados a todo el Ecuador por Servientrega y LaarCourier",
        highlight: "todo el Ecuador",
        linkUrl: "/rastreo",
      },
      {
        id: "msg_2",
        icon: "tag",
        text: "Por la compra de la docena obtén precios mayoristas de fábrica",
        highlight: "precios mayoristas",
        linkUrl: "/catalogo",
      },
      {
        id: "msg_3",
        icon: "sparkles",
        text: "Personaliza tus bases con el logo de tu pastelería por solo +$0.20",
        highlight: "logo de tu pastelería",
        linkUrl: "/catalogo?categoria=bases-mdf",
      },
      {
        id: "msg_4",
        icon: "credit-card",
        text: "Pagos 100% seguros con tarjetas Visa, Mastercard o WhatsApp",
        highlight: "Payphone y WhatsApp",
        linkUrl: "/checkout",
      },
    ],
  },
  updatedAt: "2026-01-01T00:00:00.000Z",
};

const DATA_FILE = path.join(process.cwd(), "data", "promotions.json");

function loadStoredPromotions(): PromotionsConfig {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, "utf-8");
      const parsed = JSON.parse(data);
      if (parsed && parsed.popup && parsed.ticker) {
        return parsed;
      }
    }
  } catch (e) {
    // Fallback a configuración inicial
  }
  return JSON.parse(JSON.stringify(DEFAULT_PROMOTIONS));
}

function savePromotionsToFile(config: PromotionsConfig): void {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(config, null, 2), "utf-8");
  } catch (e) {
    // Si estamos en un entorno serverless de sólo lectura, no romper la ejecución
  }
}

// Inicializar tienda con datos guardados o por defecto
let currentPromotions: PromotionsConfig = loadStoredPromotions();

export function getPromotionsConfig(): PromotionsConfig {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, "utf-8");
      currentPromotions = JSON.parse(data);
    }
  } catch (e) {
    // Mantener variable en memoria
  }
  return currentPromotions;
}

export function updatePromotionsConfig(updates: Partial<PromotionsConfig>): PromotionsConfig {
  const timestamp = new Date().toISOString();

  if (updates.popup) {
    currentPromotions.popup = {
      ...currentPromotions.popup,
      ...updates.popup,
      updatedAt: timestamp,
    };
  }

  if (updates.ticker) {
    currentPromotions.ticker = {
      ...currentPromotions.ticker,
      ...updates.ticker,
      messages: updates.ticker.messages || currentPromotions.ticker.messages,
    };
  }

  currentPromotions.updatedAt = timestamp;
  savePromotionsToFile(currentPromotions);
  return currentPromotions;
}

export function resetPromotionsConfig(): PromotionsConfig {
  const timestamp = new Date().toISOString();
  currentPromotions = JSON.parse(JSON.stringify(DEFAULT_PROMOTIONS));
  currentPromotions.updatedAt = timestamp;
  currentPromotions.popup.updatedAt = timestamp;
  savePromotionsToFile(currentPromotions);
  return currentPromotions;
}
