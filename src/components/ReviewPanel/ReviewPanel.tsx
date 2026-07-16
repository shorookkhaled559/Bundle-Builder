import type { ProductData, ReviewLine } from '../../types';
import type { BuilderState } from '../../hooks/useBuilderState';
import {
  buildReviewLines,
  groupLinesByCategory,
  computeTotals,
  currency,
  getProductById,
} from '../../utils/pricing';
import { ProductThumb } from '../Icons/Icons';
import QuantityStepper from '../QuantityStepper/QuantityStepper';
import styles from './ReviewPanel.module.css';

interface ReviewPanelProps {
  productData: ProductData;
  selections: BuilderState['selections'];
  setQuantity: BuilderState['setQuantity'];
  saveForLater: BuilderState['saveForLater'];
  justSaved: boolean;
}

function GuaranteeBadge() {
  return (
    <div className={styles.badgeWrap} aria-hidden="true">
      <svg viewBox="0 0 100 100" className={styles.badgeSvg} fill="currentColor">
        <path d="M50 2l6 8 9-4 4 9 9 2-1 10 8 5-5 8 5 8-8 5 1 10-9 2-4 9-9-4-6 8-6-8-9 4-4-9-9-2 1-10-8-5 5-8-5-8 8-5-1-10 9-2 4-9 9 4z" />
      </svg>
      <div className={styles.badgeText}>
        <div className={styles.badgePercent}>100%</div>
        <div className={styles.badgeBody}>
          Wyze
          <br />
          satisfaction
          <br />
          guarantee
        </div>
      </div>
    </div>
  );
}

/**
 * Live review / checkout sidebar.
 * Quantities here call the same setQuantity helper as product cards,
 * so both views stay perfectly in sync.
 */
export default function ReviewPanel({
  productData,
  selections,
  setQuantity,
  saveForLater,
  justSaved,
}: ReviewPanelProps) {
  const lines = buildReviewLines(selections);
  const groups = groupLinesByCategory(lines);
  const totals = computeTotals(lines);

  const handleLineQuantityChange = (line: ReviewLine, nextQty: number) => {
    const found = getProductById(line.productId);
    const exclusiveGroup =
      found?.step.singleSelect && found.step.products.length
        ? found.step.products.map((p) => p.id)
        : [];

    setQuantity({
      productId: line.productId,
      variantKey: line.variantId || 'default',
      quantity: nextQty,
      min: line.minQuantity,
      max: line.maxQuantity,
      exclusiveGroup,
    });
  };

  return (
    <aside className={styles.panel}>
      <div className={styles.reviewLabel}>REVIEW</div>
      <h2 className={styles.title}>{productData.plan.reviewTitle}</h2>
      <p className={styles.subtitle}>{productData.plan.reviewSubtitle}</p>

      <div className={styles.divider} />

      <div className={styles.groups}>
        {groups.map((group) => (
          <div key={group.category}>
            <div className={styles.groupLabel}>
              {group.category === 'Plan'
                ? 'PLAN'
                : group.category.toUpperCase()}
            </div>

            <div className={styles.lines}>
              {group.lines.map((line) =>
                group.category === 'Plan' ? (
                  <div
                    key={`${line.productId}-${line.variantId}`}
                    className={styles.planLine}
                  >
                    <div className={styles.lineLeft}>
                      <ProductThumb name={line.icon} image={line.image} size="sm" />
                      <span className={styles.lineName}>
                        {line.nameAccent
                          ? line.name.replace(line.nameAccent, '').trim()
                          : line.name}{' '}
                        {line.nameAccent && (
                          <span className={styles.accent}>{line.nameAccent}</span>
                        )}
                      </span>
                    </div>
                    <div className={styles.linePriceBlock}>
                      {line.compareAtPrice != null && (
                        <div className={styles.lineCompare}>
                          {currency(line.compareAtPrice)}
                          {line.billingSuffix}
                        </div>
                      )}
                      <div className={styles.linePrice}>
                        {currency(line.unitPrice)}
                        {line.billingSuffix}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    key={`${line.productId}-${line.variantId}`}
                    className={styles.productLine}
                  >
                    <div className={styles.lineLeft}>
                      <ProductThumb name={line.icon} image={line.image} size="sm" />
                      <span className={styles.lineName}>{line.name}</span>
                    </div>
                    <div className={styles.lineRight}>
                      <QuantityStepper
                        size="sm"
                        quantity={line.quantity}
                        min={line.minQuantity}
                        max={line.maxQuantity}
                        disabled={line.stepperDisabled}
                        onChange={(q) => handleLineQuantityChange(line, q)}
                      />
                      <div className={styles.linePriceBlockWide}>
                        {line.lineCompareTotal != null &&
                          line.lineCompareTotal !== line.lineTotal && (
                            <div className={styles.lineCompare}>
                              {currency(line.lineCompareTotal)}
                            </div>
                          )}
                        <div className={styles.linePrice}>
                          {line.priceLabelOverride ?? currency(line.lineTotal)}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        ))}

        <div className={styles.divider} />

        {/* Shipping row */}
        <div className={styles.planLine}>
          <div className={styles.lineLeft}>
            <ProductThumb name="shipping" size="sm" />
            <span className={styles.lineName}>{productData.plan.shipping.label}</span>
          </div>
          <div className={styles.linePriceBlock}>
            <div className={styles.lineCompare}>
              {currency(productData.plan.shipping.compareAtPrice)}
            </div>
            <div className={styles.linePrice}>
              {productData.plan.shipping.price === 0
                ? 'FREE'
                : currency(productData.plan.shipping.price)}
            </div>
          </div>
        </div>

        {/* Guarantee */}
        <div className={styles.guarantee}>
          <GuaranteeBadge />
          <div>
            <div className={styles.guaranteeTitle}>
              {productData.plan.guarantee.title}
            </div>
            <p className={styles.guaranteeBody}>{productData.plan.guarantee.body}</p>
          </div>
        </div>

        {/* Total + financing */}
        <div className={styles.totalRow}>
          {totals.monthly > 0 && (
            <span className={styles.financing}>
              {productData.plan.financingPrefix}{' '}
              {currency(Math.round(totals.monthly * 1.92 * 100) / 100)}
              {productData.plan.financingSuffix}
            </span>
          )}
          <div className={styles.totalBlock}>
            {totals.savings > 0 && (
              <div className={styles.totalCompare}>{currency(totals.compareTotal)}</div>
            )}
            <div className={styles.total}>{currency(totals.total)}</div>
          </div>
        </div>

        {totals.savings > 0 && (
          <p className={styles.savings}>
            Congrats! You&apos;re saving {currency(totals.savings)} on your security
            bundle!
          </p>
        )}

        <button
          type="button"
          className={styles.checkout}
          onClick={() => alert('Order submitted! Thank you for building your system.')}
        >
          Checkout
        </button>

        <button type="button" className={styles.saveLater} onClick={saveForLater}>
          {justSaved ? 'System saved!' : 'Save my system for later'}
        </button>
      </div>
    </aside>
  );
}
