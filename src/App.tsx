import productDataJson from './data/products.json';
import type { ProductData } from './types';
import { useBuilderState } from './hooks/useBuilderState';
import AccordionStep from './components/AccordionStep/AccordionStep';
import ReviewPanel from './components/ReviewPanel/ReviewPanel';
import styles from './App.module.css';

const productData = productDataJson as ProductData;

/**
 * Root page: hero heading + two-column layout
 * (accordion builder on the left, live review panel on the right).
 *
 * All interactive state lives in useBuilderState and is passed down as props.
 * No Redux — kept intentionally simple for junior developers to follow.
 */
export default function App() {
  const {
    expandedStepId,
    selections,
    restoredToast,
    justSaved,
    toggleStep,
    goToStep,
    selectVariant,
    setQuantity,
    saveForLater,
  } = useBuilderState();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.heading}>{productData.plan.title}</h1>
      </header>

      {restoredToast && (
        <div className={styles.toast} role="status">
          Welcome back — your saved system has been restored.
        </div>
      )}

      <main className={styles.main}>
        <div className={styles.layout}>
          {/* Left: accordion builder */}
          <div className={styles.builder}>
            {productData.steps.map((step, index) => (
              <AccordionStep
                key={step.id}
                step={step}
                index={index}
                totalSteps={productData.steps.length}
                nextStepId={productData.steps[index + 1]?.id}
                expandedStepId={expandedStepId}
                selections={selections}
                toggleStep={toggleStep}
                goToStep={goToStep}
                selectVariant={selectVariant}
                setQuantity={setQuantity}
              />
            ))}
          </div>

          {/* Right: sticky review / checkout panel */}
          <div className={styles.reviewCol}>
            <div className={styles.reviewSticky}>
              <ReviewPanel
                productData={productData}
                selections={selections}
                setQuantity={setQuantity}
                saveForLater={saveForLater}
                justSaved={justSaved}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
