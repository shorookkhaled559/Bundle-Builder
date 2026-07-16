import type { Variant } from '../../types';
import styles from './VariantSelector.module.css';

interface VariantSelectorProps {
  variants: Variant[];
  selectedVariantId: string | null;
  onSelect: (variantId: string) => void;
}

/** Option chips for a product. Each chip shows an image thumbnail or a fallback swatch. */
export default function VariantSelector({
  variants,
  selectedVariantId,
  onSelect,
}: VariantSelectorProps) {
  if (!variants || variants.length === 0) return null;

  return (
    <div className={styles.row}>
      {variants.map((variant) => {
        const isActive = variant.id === selectedVariantId;

        return (
          <button
            key={variant.id}
            type="button"
            onClick={() => onSelect(variant.id)}
            aria-pressed={isActive}
            className={`${styles.chip} ${isActive ? styles.chipActive : ''}`}
          >
            {variant.image ? (
              <img
                src={variant.image}
                alt={variant.label}
                className={styles.thumbnail}
                loading="lazy"
              />
            ) : (
              <span
                className={styles.thumbnail}
                style={{ backgroundColor: variant.swatch ?? '#e5e7eb' }}
              />
            )}
            {variant.label}
          </button>
        );
      })}
    </div>
  );
}
