import { useCallback, useEffect, useState } from 'react';
import productData from '../data/products.json';
import type { ProductData, ProductSelection, SavedSystem, Selections } from '../types';
import { loadSavedSystem, saveSystem } from '../utils/persistence';

const data = productData as ProductData;

/** Build default quantities/variants from the JSON defaults. */
function buildInitialSelections(): Selections {
  const selections: Selections = {};

  data.steps.forEach((step) => {
    step.products.forEach((product) => {
      const hasVariants = Boolean(product.variants && product.variants.length);
      const initialVariantId = hasVariants
        ? product.defaultVariantId || product.variants![0].id
        : null;

      const quantities: Record<string, number> = {};
      const key = hasVariants ? (initialVariantId as string) : 'default';
      quantities[key] = product.defaultQuantity || 0;

      selections[product.id] = {
        selectedVariantId: initialVariantId,
        quantities,
      };
    });
  });

  return selections;
}

export interface SetQuantityArgs {
  productId: string;
  variantKey: string;
  quantity: number;
  min?: number;
  max?: number;
  /** When set, picking this product zeroes out every other id in the group (radio). */
  exclusiveGroup?: string[];
}

/**
 * Owns all builder state: open accordion step + per-product selections.
 * Keeps things simple for juniors — no Redux, just useState + helpers.
 */
export function useBuilderState() {
  const [expandedStepId, setExpandedStepId] = useState<string | null>(
    data.steps[0]?.id ?? null
  );
  const [selections, setSelections] = useState<Selections>(buildInitialSelections);
  const [restoredToast, setRestoredToast] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  // Restore from localStorage once on mount
  useEffect(() => {
    const saved = loadSavedSystem();
    if (!saved) return;

    if (saved.selections) setSelections(saved.selections);
    if (saved.expandedStepId !== undefined) setExpandedStepId(saved.expandedStepId);
    setRestoredToast(true);

    const timer = window.setTimeout(() => setRestoredToast(false), 3000);
    return () => window.clearTimeout(timer);
  }, []);

  const toggleStep = useCallback((stepId: string) => {
    setExpandedStepId((current) => (current === stepId ? null : stepId));
  }, []);

  const goToStep = useCallback((stepId: string) => {
    setExpandedStepId(stepId);
  }, []);

  const selectVariant = useCallback((productId: string, variantId: string) => {
    setSelections((prev) => {
      const entry = prev[productId];
      if (!entry) return prev;

      const quantities = { ...entry.quantities };
      if (!(variantId in quantities)) {
        quantities[variantId] = 0;
      }

      return {
        ...prev,
        [productId]: {
          selectedVariantId: variantId,
          quantities,
        },
      };
    });
  }, []);

  const setQuantity = useCallback(
    ({
      productId,
      variantKey,
      quantity,
      min = 0,
      max = 99,
      exclusiveGroup = [],
    }: SetQuantityArgs) => {
      setSelections((prev) => {
        const entry = prev[productId];
        if (!entry) return prev;

        const clamped = Math.max(min, Math.min(max, quantity));
        const next: Selections = {
          ...prev,
          [productId]: {
            ...entry,
            quantities: {
              ...entry.quantities,
              [variantKey]: clamped,
            },
          },
        };

        // Single-select groups (plans): choosing one zeroes out siblings
        if (clamped > 0 && exclusiveGroup.length > 0) {
          exclusiveGroup.forEach((siblingId) => {
            if (siblingId === productId) return;
            const sibling = next[siblingId];
            if (!sibling) return;

            const zeroed: ProductSelection = {
              ...sibling,
              quantities: Object.fromEntries(
                Object.keys(sibling.quantities).map((k) => [k, 0])
              ),
            };
            next[siblingId] = zeroed;
          });
        }

        return next;
      });
    },
    []
  );

  const saveForLater = useCallback(() => {
    const payload: SavedSystem = {
      expandedStepId,
      selections,
      savedAt: Date.now(),
    };
    saveSystem(payload);
    setJustSaved(true);
    window.setTimeout(() => setJustSaved(false), 2500);
  }, [expandedStepId, selections]);

  return {
    expandedStepId,
    selections,
    restoredToast,
    justSaved,
    toggleStep,
    goToStep,
    selectVariant,
    setQuantity,
    saveForLater,
  };
}

export type BuilderState = ReturnType<typeof useBuilderState>;
