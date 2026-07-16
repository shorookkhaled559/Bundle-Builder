import type { ReactNode } from 'react';
import styles from './Icons.module.css';

/**
 * Simple line icons used for step headers and product thumbnails.
 * We use original iconography rather than copyrighted product photos.
 */

const paths: Record<string, ReactNode> = {
  camera: (
    <>
      <rect x="4" y="8" width="13" height="10" rx="3" />
      <circle cx="10.5" cy="13" r="2.6" />
      <path d="M17 11.5l4-2v7l-4-2" />
    </>
  ),
  'camera-pan': (
    <>
      <circle cx="12" cy="15" r="3.2" />
      <path d="M6 15a6 6 0 0112 0" />
      <path d="M4.5 9.5c1.5-2.5 4-4 7.5-4s6 1.5 7.5 4" />
      <path d="M9 5.5V4M15 5.5V4" />
    </>
  ),
  floodlight: (
    <>
      <rect x="3" y="10" width="7" height="6" rx="1.5" />
      <rect x="14" y="10" width="7" height="6" rx="1.5" />
      <circle cx="6.5" cy="13" r="1.4" />
      <circle cx="17.5" cy="13" r="1.4" />
      <path d="M10 13h4" />
    </>
  ),
  doorbell: (
    <>
      <rect x="8" y="3" width="8" height="18" rx="3" />
      <circle cx="12" cy="9" r="2.4" />
      <path d="M9.5 15h5" />
    </>
  ),
  'battery-cam': (
    <>
      <rect x="8" y="3" width="8" height="18" rx="4" />
      <circle cx="12" cy="8.5" r="2.2" />
      <path d="M10 16h4" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l7 3v5c0 5-3.5 7.5-7 9-3.5-1.5-7-4-7-9V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  sensor: (
    <>
      <path d="M12 4a9 9 0 019 9" />
      <path d="M12 8a5 5 0 015 5" />
      <circle cx="12" cy="17" r="1.6" />
    </>
  ),
  'motion-sensor': (
    <>
      <rect x="6" y="5" width="12" height="9" rx="2" />
      <path d="M9 14v2M15 14v2M8 20h8" />
      <circle cx="12" cy="9.5" r="1.6" />
    </>
  ),
  hub: (
    <>
      <rect x="4" y="9" width="16" height="7" rx="2" />
      <circle cx="8" cy="12.5" r="1" />
      <path d="M12 12.5h6" />
    </>
  ),
  'contact-sensor': (
    <>
      <rect x="4" y="9" width="7" height="7" rx="1.4" />
      <rect x="13" y="9" width="7" height="7" rx="1.4" />
    </>
  ),
  'leak-sensor': (
    <>
      <path d="M12 3c3 4 5 6.8 5 9.5a5 5 0 01-10 0C7 9.8 9 7 12 3z" />
    </>
  ),
  'sd-card': (
    <>
      <path d="M8 3h6l3 3v15H8a1 1 0 01-1-1V4a1 1 0 011-1z" />
      <path d="M9.5 3v4h5" />
    </>
  ),
  warranty: (
    <>
      <path d="M12 3l7 3v5c0 5-3.5 7.5-7 9-3.5-1.5-7-4-7-9V6l7-3z" />
      <path d="M12 8v5l3 2" />
    </>
  ),
  mount: (
    <>
      <rect x="10" y="3" width="4" height="8" rx="1" />
      <path d="M6 21l6-8 6 8" />
    </>
  ),
  grid: (
    <>
      {[0, 1, 2].flatMap((row) =>
        [0, 1, 2].map((col) => (
          <circle key={`${row}-${col}`} cx={7 + col * 5} cy={7 + row * 5} r="1.4" />
        ))
      )}
    </>
  ),
  shipping: (
    <>
      <rect x="2" y="8" width="13" height="9" rx="1.5" />
      <path d="M15 12h4l2 3v2h-6v-5z" />
      <circle cx="7" cy="18" r="1.6" />
      <circle cx="18" cy="18" r="1.6" />
    </>
  ),
};

interface IconProps {
  name: string;
  className?: string;
  strokeWidth?: number;
}

export function Icon({ name, className = '', strokeWidth = 1.8 }: IconProps) {
  const content = paths[name] || paths.grid;

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {content}
    </svg>
  );
}

interface ProductThumbProps {
  name: string;
  image?: string;
  size?: 'sm' | 'md' | 'lg';
  alt?: string;
}

export function ProductThumb({
  name,
  image,
  size = 'md',
  alt = '',
}: ProductThumbProps) {
  const sizeClass =
    size === 'sm' ? styles.thumbSm : size === 'lg' ? styles.thumbLg : styles.thumbMd;

  if (image) {
    return (
      <div className={`${styles.thumb} ${sizeClass}`}>
        <img src={image} alt={alt || name} className={styles.thumbImage} />
      </div>
    );
  }

  return (
    <div className={`${styles.thumb} ${styles.thumbIcon} ${sizeClass}`}>
      <Icon name={name} className={styles.iconInside} strokeWidth={1.5} />
    </div>
  );
}
