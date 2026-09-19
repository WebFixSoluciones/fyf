import fs from "fs";
import path from "path";

export interface StoredOrderItem {
  productId?: string;
  name: string;
  sizeLabel?: string;
  shape?: string;
  color?: string;
  withLogo?: boolean;
  customDimensions?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface StoredOrder {
  id: string;
  orderNumber: string;
  customerId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerIdNumber?: string;
  shippingAddress: string;
  shippingCity: string;
  shippingProvince: string;
  shippingReference?: string;
  shippingMethod: string;
  shippingCost: number;
  paymentMethod: "payphone" | "whatsapp" | string;
  paymentStatus: "PENDIENTE" | "PAGADO" | "CANCELADO";
  orderStatus: "PENDIENTE" | "PAGADO" | "EN_PREPARACION" | "ENVIADO" | "ENTREGADO";
  subtotal: number;
  total: number;
  items: StoredOrderItem[];
  trackingNumber?: string;
  courier?: string;
  trackingUrl?: string;
  createdAt: string;
  updatedAt: string;
}

const DATA_FILE = path.join(process.cwd(), "data", "orders.json");

function loadStoredOrders(): StoredOrder[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {}
  return [];
}

function saveOrdersToFile(orders: StoredOrder[]): void {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(orders, null, 2), "utf-8");
  } catch (e) {}
}

let ordersStore: StoredOrder[] = loadStoredOrders();

export function saveOrder(order: StoredOrder): StoredOrder {
  const existingIndex = ordersStore.findIndex((o) => o.id === order.id || o.orderNumber === order.orderNumber);
  if (existingIndex >= 0) {
    ordersStore[existingIndex] = { ...ordersStore[existingIndex], ...order, updatedAt: new Date().toISOString() };
  } else {
    ordersStore.unshift(order);
  }
  saveOrdersToFile(ordersStore);
  return order;
}

export function findOrderById(id: string): StoredOrder | undefined {
  return ordersStore.find((o) => o.id === id || o.orderNumber === id);
}

export function findOrderByOrderNumber(orderNumber: string): StoredOrder | undefined {
  const clean = orderNumber.trim().toUpperCase();
  return ordersStore.find((o) => o.orderNumber.toUpperCase() === clean);
}

export function findOrdersByCustomer(customerIdOrEmailOrPhone: string): StoredOrder[] {
  const clean = customerIdOrEmailOrPhone.trim().toLowerCase();
  return ordersStore.filter(
    (o) =>
      (o.customerId && o.customerId.toLowerCase() === clean) ||
      o.customerEmail.toLowerCase() === clean ||
      o.customerPhone.replace(/[^0-9]/g, "") === clean.replace(/[^0-9]/g, "")
  );
}

export function getAllOrders(): StoredOrder[] {
  return ordersStore;
}

export function clearAllOrders(): void {
  ordersStore = [];
  saveOrdersToFile(ordersStore);
}
