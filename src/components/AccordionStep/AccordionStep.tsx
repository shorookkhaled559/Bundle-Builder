import type { Step } from '../../types';
import type { BuilderState } from '../../hooks/useBuilderState';
import { stepSelectedCount } from '../../utils/pricing';
import { Icon } from '../Icons/Icons';
import ProductCard from '../ProductCard/ProductCard';
import styles from './AccordionStep.module.css';

interface AccordionStepProps {
  step: Step;
  index: number;
  totalSteps: number;
  nextStepId?: string;
  expandedStepId: string | null;
  selections: BuilderState['selections'];
  toggleStep: BuilderState['toggleStep'];
  goToStep: BuilderState['goToStep'];
  selectVariant: BuilderState['selectVariant'];
  setQuantity: BuilderState['setQuantity'];
}

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
      aria-hidden="true"
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * One accordion section (e.g. "Choose your cameras").
 * Header always shows "N selected". Body only renders when open.
 */
export default function AccordionStep({
  step,
  index,
  totalSteps,
  nextStepId,
  expandedStepId,
  selections,
  toggleStep,
  goToStep,
  selectVariant,
  setQuantity,
}: AccordionStepProps) {
  const isOpen = expandedStepId === step.id;
  const selectedCount = stepSelectedCount(step, selections);
  const exclusiveGroup = step.singleSelect
    ? step.products.map((p) => p.id)
    : [];

  return (
    <section className={`${styles.step} ${isOpen ? styles.stepOpen : ''}`}>
      <button
        type="button"
        className={styles.header}
        onClick={() => toggleStep(step.id)}
        aria-expanded={isOpen}
      >
        <div className={styles.stepLabel}>
          STEP {index + 1} OF {totalSteps}
        </div>

        <div className={styles.headerRow}>
          <div className={styles.titleGroup}>
            <Icon name={step.icon} className={styles.stepIcon} />
            <span className={styles.title}>{step.title}</span>
          </div>

          <div className={styles.selectedMeta}>
            <span>{selectedCount} selected</span>
            <ChevronDown open={isOpen} />
          </div>
        </div>
      </button>

      {isOpen && (
        <div className={styles.body}>
          <div
            className={`${styles.grid} ${step.id === 'cameras' ? styles.gridCameras : ''}`}
          >
            {step.products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                exclusiveGroup={exclusiveGroup}
                selections={selections}
                selectVariant={selectVariant}
                setQuantity={setQuantity}
              />
            ))}
          </div>

          {step.nextLabel && nextStepId && (
            <button
              type="button"
              className={styles.nextBtn}
              onClick={() => goToStep(nextStepId)}
            >
              {step.nextLabel}
            </button>
          )}
        </div>
      )}
    </section>
  );
}
