export const COMBO_DISCOUNT = {
  combo2: 10_000,
  combo3: 20_000,
};

export const PLATFORM_FEE = {
  facebook: 0.1,
  tiktok: 0.1,
  shopee: 0.1,
};

export function combo2Price(base: number) {
  return Math.max(0, base * 2 - COMBO_DISCOUNT.combo2);
}

export function combo3Price(base: number) {
  return Math.max(0, base * 3 - COMBO_DISCOUNT.combo3);
}

export function netReceived(salePrice: number, importPrice: number, feeRate = 0) {
  return Math.round(salePrice * (1 - feeRate)) - importPrice;
}

export const vnd = (n: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(n);
