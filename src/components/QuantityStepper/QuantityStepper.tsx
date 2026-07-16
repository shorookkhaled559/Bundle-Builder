import styles from './QuantityStepper.module.css';

interface QuantityStepperProps {
  quantity: number;
  min?: number;
  max?: number;
  disabled?: boolean;
  onChange: (next: number) => void;
  size?: 'sm' | 'md';
}

/**
 * Reusable - / + quantity control.
 * Used both on product cards and inside the review panel so quantities stay in sync.
 */
export default function QuantityStepper({
  quantity,
  min = 0,
  max = 99,
  disabled = false,
  onChange,
  size = 'md',
}: QuantityStepperProps) {
  const dec = () => onChange(Math.max(min, quantity - 1));
  const inc = () => onChange(Math.min(max, quantity + 1));

  const sizeClass = size === 'sm' ? styles.sm : styles.md;

  return (
    <div className={`${styles.stepper} ${sizeClass}`}>
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={disabled || quantity <= min}
        onClick={dec}
        className={styles.btn}
      >
        −
      </button>
      <span className={styles.value}>{quantity}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={disabled || quantity >= max}
        onClick={inc}
        className={styles.btn}
      >
        +
      </button>
    </div>
  );
}
