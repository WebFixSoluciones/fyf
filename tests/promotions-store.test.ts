import { describe, it, expect, beforeEach } from 'vitest';
import { getPromotionsConfig, updatePromotionsConfig, resetPromotionsConfig, DEFAULT_PROMOTIONS } from '../src/lib/promotions-store';

describe('Promotions and Advertising Store Tests', () => {
  beforeEach(() => {
    resetPromotionsConfig();
  });

  it('retrieves default promotions configuration', () => {
    const config = getPromotionsConfig();
    expect(config).toBeDefined();
    expect(config.popup).toBeDefined();
    expect(config.popup.enabled).toBe(true);
    expect(config.ticker).toBeDefined();
    expect(config.ticker.messages.length).toBeGreaterThan(0);
  });

  it('updates popup settings properly and updates timestamps', () => {
    const updated = updatePromotionsConfig({
      popup: {
        enabled: false,
        badge: 'OFERTA FLASH',
        title: 'Descuentos de fin de semana',
        description: 'Bases MDF con 30% de descuento',
        buttonText: 'Comprar ahora',
        buttonUrl: '/catalogo',
      },
    });

    expect(updated.popup.enabled).toBe(false);
    expect(updated.popup.badge).toBe('OFERTA FLASH');
    expect(updated.popup.updatedAt).toBeDefined();
  });

  it('updates ticker messages and interval', () => {
    const customMessages = [
      { id: 'm1', icon: 'truck' as const, text: 'Envíos a todo Guayaquil y Quito', linkUrl: '/rastreo' }
    ];

    const updated = updatePromotionsConfig({
      ticker: {
        enabled: true,
        intervalSeconds: 2,
        messages: customMessages,
      },
    });

    expect(updated.ticker.intervalSeconds).toBe(2);
    expect(updated.ticker.messages.length).toBe(1);
    expect(updated.ticker.messages[0].text).toBe('Envíos a todo Guayaquil y Quito');
  });

  it('resets configuration back to default values', () => {
    updatePromotionsConfig({
      popup: {
        enabled: false,
        badge: 'CAMBIO',
        title: 'Nuevo título',
        description: 'Desc',
        buttonText: 'Ir',
        buttonUrl: '/ir',
      },
    });

    const reset = resetPromotionsConfig();
    expect(reset.popup.enabled).toBe(DEFAULT_PROMOTIONS.popup.enabled);
    expect(reset.popup.badge).toBe(DEFAULT_PROMOTIONS.popup.badge);
    expect(reset.ticker.messages.length).toBe(DEFAULT_PROMOTIONS.ticker.messages.length);
  });
});
