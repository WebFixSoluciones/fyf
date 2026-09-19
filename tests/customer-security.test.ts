import { describe, it, expect, beforeEach } from "vitest";
import {
  hashPassword,
  verifyPassword,
  createCustomer,
  findCustomerByEmail,
  recordFailedLoginAttempt,
  resetFailedLoginAttempts,
  checkBruteForceLock,
} from "../src/lib/customers-store";
import {
  saveOrder,
  findOrderById,
  findOrderByOrderNumber,
  findOrdersByCustomer,
  StoredOrder,
} from "../src/lib/orders-store";

describe("Customer Security & Brute-Force Defense", () => {
  const testEmail = `test_sec_${Date.now()}@pasteleria.ec`;
  const testPassword = "MiPasswordSeguro123!";

  it("hashes passwords securely with bcrypt and verifies correctly", async () => {
    const hashed = await hashPassword(testPassword);
    expect(hashed).not.toBe(testPassword);
    expect(hashed.startsWith("$2")).toBe(true);

    const isValid = await verifyPassword(testPassword, hashed);
    expect(isValid).toBe(true);

    const isInvalid = await verifyPassword("WrongPassword!", hashed);
    expect(isInvalid).toBe(false);
  });

  it("creates customer user and normalizes email", async () => {
    const customer = await createCustomer({
      name: "Pastelería Delicias Quito",
      email: `  ${testEmail.toUpperCase()}  `,
      phone: "0998877665",
      password: testPassword,
      idNumber: "1712345678",
    });

    expect(customer.email).toBe(testEmail);
    expect(customer.name).toBe("Pastelería Delicias Quito");

    const found = findCustomerByEmail(testEmail);
    expect(found).toBeDefined();
    expect(found?.id).toBe(customer.id);
  });

  it("triggers brute-force lockout after 5 consecutive failed login attempts", () => {
    const customer = findCustomerByEmail(testEmail);
    expect(customer).toBeDefined();
    if (!customer) return;

    // Reset initially
    resetFailedLoginAttempts(customer.email);
    expect(checkBruteForceLock(customer.email).isLocked).toBe(false);

    // 4 failed attempts should not lock
    for (let i = 1; i < 5; i++) {
      const result = recordFailedLoginAttempt(customer.email);
      expect(result.isLocked).toBe(false);
    }

    // 5th failed attempt must trigger lock
    const lockedOnFifth = recordFailedLoginAttempt(customer.email);
    expect(lockedOnFifth.isLocked).toBe(true);
    expect(lockedOnFifth.remainingMinutes).toBe(15);

    const lockStatus = checkBruteForceLock(customer.email);
    expect(lockStatus.isLocked).toBe(true);

    // Resetting unlocks customer
    resetFailedLoginAttempts(customer.email);
    const unlockedStatus = checkBruteForceLock(customer.email);
    expect(unlockedStatus.isLocked).toBe(false);
  });
});

describe("Order Security & Anti-IDOR (Insecure Direct Object Reference) Protection", () => {
  const orderA: StoredOrder = {
    id: "ord-test-cust-a-001",
    orderNumber: "ALN-2026-9001",
    customerId: "cust-uuid-111",
    customerName: "Cliente A Pastelería",
    customerEmail: "cliente_a@empresa.ec",
    customerPhone: "0991111111",
    shippingAddress: "Av. Amazonas 100",
    shippingCity: "Quito",
    shippingProvince: "Pichincha",
    shippingMethod: "pichincha",
    shippingCost: 3.5,
    paymentMethod: "payphone",
    paymentStatus: "PAGADO",
    orderStatus: "EN_PREPARACION",
    subtotal: 45.0,
    total: 48.5,
    items: [
      {
        name: "Base MDF Redonda 30cm",
        quantity: 12,
        unitPrice: 0.64,
        subtotal: 7.68,
        withLogo: true,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const orderB: StoredOrder = {
    id: "ord-test-cust-b-002",
    orderNumber: "ALN-2026-9002",
    customerId: "cust-uuid-222",
    customerName: "Cliente B Cafetería",
    customerEmail: "cliente_b@panaderia.ec",
    customerPhone: "0992222222",
    shippingAddress: "Av. 9 de Octubre 200",
    shippingCity: "Guayaquil",
    shippingProvince: "Guayas",
    shippingMethod: "national",
    shippingCost: 5.5,
    paymentMethod: "whatsapp",
    paymentStatus: "PENDIENTE",
    orderStatus: "PENDIENTE",
    subtotal: 30.0,
    total: 35.5,
    items: [
      {
        name: "Topper Acrílico Dorado",
        quantity: 5,
        unitPrice: 2.5,
        subtotal: 12.5,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    saveOrder(orderA);
    saveOrder(orderB);
  });

  it("stores and retrieves orders by ID and Order Number", () => {
    const foundById = findOrderById(orderA.id);
    expect(foundById?.orderNumber).toBe(orderA.orderNumber);

    const foundByNum = findOrderByOrderNumber(orderB.orderNumber);
    expect(foundByNum?.customerEmail).toBe(orderB.customerEmail);
  });

  it("isolates customer orders and prevents IDOR data leakage", () => {
    const ordersForCustomerA = findOrdersByCustomer("cliente_a@empresa.ec");
    expect(ordersForCustomerA.length).toBeGreaterThanOrEqual(1);
    expect(ordersForCustomerA.some((o) => o.orderNumber === orderA.orderNumber)).toBe(true);
    // Customer A MUST NEVER see Customer B's orders
    expect(ordersForCustomerA.some((o) => o.orderNumber === orderB.orderNumber)).toBe(false);

    const ordersForCustomerB = findOrdersByCustomer("cliente_b@panaderia.ec");
    expect(ordersForCustomerB.some((o) => o.orderNumber === orderB.orderNumber)).toBe(true);
    expect(ordersForCustomerB.some((o) => o.orderNumber === orderA.orderNumber)).toBe(false);
  });
});
