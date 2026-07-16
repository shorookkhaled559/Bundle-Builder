import type { Product } from '../../types';
import type { BuilderState } from '../../hooks/useBuilderState';
import { currency } from '../../utils/pricing';
import { ProductThumb } from '../Icons/Icons';
import QuantityStepper from '../QuantityStepper/QuantityStepper';
import VariantSelector from '../VariantSelector/VariantSelector';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
  /** Ids of products that are mutually exclusive (used for plan radio behavior). */
  exclusiveGroup?: string[];
  selections: BuilderState['selections'];
  selectVariant: BuilderState['selectVariant'];
  setQuantity: BuilderState['setQuantity'];
}

/**
 * One product tile inside an accordion step.
 * Reads its own selection entry and highlights itself when qty > 0.
 */
export default function ProductCard({
  product,
  exclusiveGroup = [],
  selections,
  selectVariant,
  setQuantity,
}: ProductCardProps) {
  const entry = selections[product.id];
  if (!entry) return null;

  const hasVariants = Boolean(product.variants && product.variants.length);
  const activeKey = hasVariants ? (entry.selectedVariantId as string) : 'default';
  const quantity = entry.quantities[activeKey] || 0;
  const isSelected = quantity > 0;
  const min = product.minQuantity ?? 0;
  const max = product.maxQuantity ?? 99;

  const handleQuantityChange = (nextQty: number) => {
    setQuantity({
      productId: product.id,
      variantKey: activeKey,
      quantity: nextQty,
      min,
      max,
      exclusiveGroup,
    });
  };

  return (
    <article
      className={`${styles.card} ${isSelected ? styles.cardSelected : ''}`}
    >
      {product.badge && <span className={styles.badge}>{product.badge}</span>}

      <div className={styles.top}>
        <ProductThumb
          name={product.icon}
          image={product.image}
          size="md"
          alt={product.name}
        />

        <div className={styles.info}>
          <h3 className={styles.name}>{product.name}</h3>
          <p className={styles.description}>{product.description}</p>
          {product.learnMoreUrl && (
            <a
              href={product.learnMoreUrl}
              className={styles.learnMore}
              onClick={(e) => e.preventDefault()}
            >
              Learn More
            </a>
          )}
        </div>
      </div>

      {hasVariants && (
        <VariantSelector
          variants={product.variants!}
          selectedVariantId={entry.selectedVariantId}
          onSelect={(variantId) => selectVariant(product.id, variantId)}
        />
      )}

      <div className={styles.footer}>
        <QuantityStepper
          quantity={quantity}
          min={min}
          max={max}
          disabled={Boolean(product.stepperDisabled)}
          onChange={handleQuantityChange}
        />

        <div className={styles.priceBlock}>
          {product.compareAtPrice != null && (
            <div className={styles.compareAt}>
              {currency(product.compareAtPrice)}
              {product.billingSuffix || ''}
            </div>
          )}
          <div className={styles.price}>
            {product.priceLabelOverride ?? currency(product.unitPrice)}
            {!product.priceLabelOverride ? product.billingSuffix || '' : ''}
          </div>
        </div>
      </div>
    </article>
  );
}
