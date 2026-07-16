/** Shared types for the security system builder. */

export interface Variant {
  id: string;
  label: string;
  image?: string;
  swatch?: string;
}

export interface Product {
  id: string;
  name: string;
  nameAccent?: string;
  description: string;
  learnMoreUrl?: string;
  icon: string;
  image?: string;
  badge?: string;
  unitPrice: number;
  compareAtPrice?: number;
  billingSuffix?: string;
  priceLabelOverride?: string;
  defaultQuantity: number;
  variants?: Variant[];
  defaultVariantId?: string;
  minQuantity?: number;
  maxQuantity?: number;
  stepperDisabled?: boolean;
}

export interface Step {
  id: string;
  order: number;
  title: string;
  icon: string;
  category: string;
  nextLabel: string | null;
  singleSelect?: boolean;
  products: Product[];
}

export interface PlanCopy {
  title: string;
  reviewTitle: string;
  reviewSubtitle: string;
  shipping: {
    label: string;
    compareAtPrice: number;
    price: number;
  };
  guarantee: {
    badgeText: string;
    title: string;
    body: string;
  };
  financingPrefix: string;
  financingSuffix: string;
}

export interface ProductData {
  plan: PlanCopy;
  steps: Step[];
}

/**
 * One product's selection state.
 * quantities is keyed by variantId (or "default" when no variants).
 * Each variant keeps its own quantity so switching colors never loses counts.
 */
export interface ProductSelection {
  selectedVariantId: string | null;
  quantities: Record<string, number>;
}

export type Selections = Record<string, ProductSelection>;

export interface ReviewLine {
  productId: string;
  variantId: string | null;
  category: string;
  stepId: string;
  name: string;
  nameAccent?: string;
  icon: string;
  image?: string;
  quantity: number;
  unitPrice: number;
  compareAtPrice?: number;
  priceLabelOverride?: string;
  billingSuffix?: string;
  lineTotal: number;
  lineCompareTotal: number | null;
  minQuantity: number;
  maxQuantity: number;
  stepperDisabled: boolean;
}

export interface SavedSystem {
  expandedStepId: string | null;
  selections: Selections;
  savedAt: number;
}
