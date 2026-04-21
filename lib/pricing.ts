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

export const TARGET_PROFIT = {
  single: 22_000,
  combo2: 40_000,
  combo3: 55_000,
};

export const PLATFORM_NET_RATE = {
  tiktok: 0.7,
  shopee: 0.7,
};

const ROUND_STEP = 1_000;

function ceilTo(value: number, step: number) {
  return Math.ceil(value / step) * step;
}

export function targetSinglePrice(importPrice: number, netRate: number) {
  return ceilTo((importPrice + TARGET_PROFIT.single) / netRate, ROUND_STEP);
}

export function targetCombo2Price(importPrice: number, netRate: number) {
  return ceilTo((importPrice * 2 + TARGET_PROFIT.combo2) / netRate, ROUND_STEP);
}

export function targetCombo3Price(importPrice: number, netRate: number) {
  return ceilTo((importPrice * 3 + TARGET_PROFIT.combo3) / netRate, ROUND_STEP);
}

export const FACEBOOK_PROFIT = {
  combo2: 15_000,
  combo3: 20_000,
};

export const FACEBOOK_SHIP = {
  combo3: 25_000,
};

export function facebookCombo2Price(importPrice: number) {
  return ceilTo(importPrice * 2 + FACEBOOK_PROFIT.combo2, ROUND_STEP);
}

export function facebookCombo3Price(importPrice: number) {
  return ceilTo(importPrice * 3 + FACEBOOK_PROFIT.combo3 + FACEBOOK_SHIP.combo3, ROUND_STEP);
}

export const vnd = (n: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(n);
