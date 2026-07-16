import productData from '../data/products.json';
import type { Product, ProductData, ReviewLine, Selections, Step } from '../types';

const data = productData as ProductData;

export function getProductById(productId: string): { product: Product; step: Step } | null {
  for (const step of data.steps) {
    const found = step.products.find((p) => p.id === productId);
    if (found) return { product: found, step };
  }
  return null;
}

/** Total quantity for a product across all of its variant buckets. */
export function productTotalQuantity(
  entry: Selections[string] | undefined
): number {
  if (!entry) return 0;
  return Object.values(entry.quantities).reduce((sum, q) => sum + (q || 0), 0);
}

/** How many products in a step have at least 1 unit selected. */
export function stepSelectedCount(step: Step, selections: Selections): number {
  return step.products.reduce((count, product) => {
    return productTotalQuantity(selections[product.id]) > 0 ? count + 1 : count;
  }, 0);
}

/**
 * Flat list of review-panel lines: one line per product+variant
 * combination that currently has quantity > 0.
 */
export function buildReviewLines(selections: Selections): ReviewLine[] {
  const lines: ReviewLine[] = [];

  data.steps.forEach((step) => {
    step.products.forEach((product) => {
      const entry = selections[product.id];
      if (!entry) return;

      const keys =
        product.variants && product.variants.length > 0
          ? product.variants.map((v) => v.id)
          : ['default'];

      keys.forEach((key) => {
        const qty = entry.quantities[key] || 0;
        if (qty <= 0) return;

        const variant = product.variants?.find((v) => v.id === key) || null;

        lines.push({
          productId: product.id,
          variantId: variant ? variant.id : null,
          category: step.category,
          stepId: step.id,
          name: product.name,
          nameAccent: product.nameAccent,
          icon: product.icon,
          image: product.image,
          quantity: qty,
          unitPrice: product.unitPrice,
          compareAtPrice: product.compareAtPrice,
          priceLabelOverride: product.priceLabelOverride,
          billingSuffix: product.billingSuffix,
          lineTotal: product.unitPrice * qty,
          lineCompareTotal: product.compareAtPrice
            ? product.compareAtPrice * qty
            : null,
          minQuantity: product.minQuantity ?? 0,
          maxQuantity: product.maxQuantity ?? 99,
          stepperDisabled: Boolean(product.stepperDisabled),
        });
      });
    });
  });

  return lines;
}

/** Group review lines by category, keeping the step order from JSON. */
export function groupLinesByCategory(lines: ReviewLine[]) {
  const order = [
    'Cameras',
    'Sensors',
    'Accessories',
    'Plan',
  ];

  const groups: Record<string, ReviewLine[]> = {};

  lines.forEach((line) => {
    if (!groups[line.category]) groups[line.category] = [];
    groups[line.category].push(line);
  });

  return order
    .filter((cat) => groups[cat] && groups[cat].length > 0)
    .map((cat) => ({ category: cat, lines: groups[cat] }));
}

/**
 * Order totals.
 * Recurring items (billingSuffix like "/mo") are listed separately and
 * excluded from the one-time cart total.
 */
export function computeTotals(lines: ReviewLine[]) {
  const oneTime = lines.filter((l) => !l.billingSuffix);
  const subtotal = oneTime.reduce((sum, l) => sum + l.lineTotal, 0);
  const compareSubtotal = oneTime.reduce(
    (sum, l) => sum + (l.lineCompareTotal ?? l.lineTotal),
    0
  );

  const shipping = data.plan.shipping;
  const total = subtotal + shipping.price;
  const compareTotal = compareSubtotal + shipping.compareAtPrice;
  const savings = Math.max(0, compareTotal - total);

  const planLine = lines.find((l) => l.billingSuffix);
  const monthly = planLine ? planLine.unitPrice : 0;

  return {
    subtotal,
    compareSubtotal,
    shipping,
    total,
    compareTotal,
    savings,
    monthly,
  };
}

export function currency(value: number | undefined | null): string {
  const n = Number(value ?? 0);
  return `$${n.toFixed(2)}`;
}

export default data;
