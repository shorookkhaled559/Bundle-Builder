# Frontend Take-Home: Bundle Builder

This repository contains the complete solution for the **Frontend Take-Home Bundle Builder** task.

The application is a responsive React + TypeScript prototype of a multi-step security system bundle builder with a live review panel and JSON-driven product configuration.

## Challenge Summary

The original task asked for a front-end implementation of a bundle builder with the following capabilities:

- Multi-step accordion workflow
- Dynamic product cards rendered from JSON data
- Variant selection with independent quantities per variant
- Live review panel synchronized with product selections
- Quantity synchronization across all components
- Dynamic pricing and savings calculation
- Responsive layout for mobile and desktop
- Client-side persistence via `localStorage`
- No hardcoded product UI: product data should drive the interface

## Figma Design

Design reference:

[https://www.figma.com/design/JYf61etQVqeseX7oY5alGz/Frontend-Test-Figma?node-id=68-8088&t=eItHIh0U1JjjJF8d-1](https://www.figma.com/design/JYf61etQVqeseX7oY5alGz/Frontend-Test-Figma?node-id=68-8088&t=eItHIh0U1JjjJF8d-1)

## Project Overview

This repository implements the bundle builder as a polished, production-quality prototype with a strong focus on:

- component reuse
- clean data flow
- responsiveness
- state synchronization
- clear separation of UI and domain logic

The UI is intentionally data-driven: products, variants, prices, and layout metadata are sourced from a single JSON file under `src/data/products.json`.

## Architecture

### Entry point

- `src/App.tsx` renders the page layout and orchestrates the builder and review panel.
- `src/App.module.css` holds the top-level page layout and responsive grid behavior.

### State management

- `src/hooks/useBuilderState.ts` owns application state:
  - currently expanded accordion step
  - product variant selections
  - quantities per variant
  - restore/save state flags
- Persistence is handled by `src/utils/persistence.ts` using `localStorage`.

### Business logic

- `src/utils/pricing.ts` encapsulates all pricing and review calculations:
  - product total quantity aggregation
  - review line generation
  - category grouping
  - subtotal, shipping, savings, and monthly totals
  - currency formatting

### Component hierarchy

- `src/components/AccordionStep/AccordionStep.tsx` — renders each step in the product selection workflow.
- `src/components/ProductCard/ProductCard.tsx` — renders individual product cards and handles quantity updates.
- `src/components/VariantSelector/VariantSelector.tsx` — renders variant chips and image-based options.
- `src/components/ReviewPanel/ReviewPanel.tsx` — renders the live checkout summary.
- `src/components/QuantityStepper/QuantityStepper.tsx` — reusable quantity selector component.
- `src/components/Icons/Icons.tsx` — renders icons and product thumbnails.

## Folder Structure

```text
public/
  images/                   # static images for products and variant thumbnails
src/
  components/              # reusable UI components
    AccordionStep/
    ProductCard/
    QuantityStepper/
    ReviewPanel/
    VariantSelector/
    Icons/
  data/                    # JSON product and plan data
  hooks/                   # custom hook for builder state and persistence
  types/                   # shared TypeScript interfaces
  utils/                   # pricing logic and persistence helpers
  App.tsx                  # application root
  App.module.css           # root page layout styles
  main.tsx                 # Vite entry point
package.json              # dependencies and scripts
vite.config.ts            # Vite configuration
tsconfig.json             # TypeScript configuration
eslint.config.js          # lint rules
```

## Key Features

### Multi-step accordion

- Implemented as a configurable accordion with open/close state.
- Step headers display current selection count.
- The next-step button advances the workflow.
- Only the active step body renders at any time for performance.

### Product cards

- Each product is rendered from JSON metadata.
- Cards support badges, descriptions, prices, variant selectors, and quantity controls.
- Products that belong to `singleSelect` steps (plans) behave like radio options.

### Variant selector

- Variant chips are image-driven and show active selection state.
- Each variant maintains an independent quantity bucket.
- Variant switching preserves prior quantities for each variant.

### Quantity synchronization

- Quantities are stored centrally in `useBuilderState`.
- Product cards and the review panel both mutate the same source of truth.
- Selecting a plan option zeroes out sibling items in the same `singleSelect` group.

### Review panel

- Displays the current cart in real time.
- Groups review items by category: Cameras, Sensors, Accessories, and Plan.
- Includes shipping, comparison pricing, savings, and total cost.
- Supports quantity updates from the review panel directly.

### Pricing calculations

- One-time product totals and compare-at totals are computed dynamically.
- Shipping price and compare-at shipping price are included in totals.
- Recurring plan pricing is displayed separately when applicable.
- Savings are shown when compare totals exceed actual totals.

### Persistence with localStorage

- User selections are persisted automatically on save.
- Restored selections are rehydrated on page reload.
- The app uses a versioned storage key to avoid stale data conflicts.

### Responsive behavior

- Mobile-first layout stacks builder and review panel.
- Desktop layout uses a two-column design with a sticky review panel.
- Breakpoints at `640px` and `1024px` ensure readability across screen sizes.

## Data Model

The app is driven by `src/data/products.json`.

### Top-level fields

- `plan` — review panel strings, shipping settings, guarantee text, financing copy.
- `steps` — ordered builder steps, each with an ID, title, category, icon, and products.

### Product schema

Each product includes:

- `id`, `name`, `description`
- `icon` and optional `image`
- `badge` and `learnMoreUrl`
- `unitPrice`, optional `compareAtPrice`, optional `priceLabelOverride`
- `billingSuffix` for recurring plan items
- `defaultQuantity`, `minQuantity`, `maxQuantity`, `stepperDisabled`
- optional `variants` array
- optional `defaultVariantId`

### Variant schema

Variants include:

- `id` — variant key used for selection
- `label` — display name
- `image` — thumbnail source for the variant chip
- optional `swatch` — fallback color when image is absent

This schema allows the UI to remain fully data-driven.

## Technical Decisions

### Why no Redux

A custom hook with `useState` keeps the state model simple and easy to understand for a take-home challenge. It also keeps dependencies low and component coupling minimal.

### Why JSON-driven UI

Product composition lives in data rather than business logic. This makes the app easier to extend and more aligned with the challenge requirement to avoid hardcoding UI elements.

### Separation of concerns

- Pricing logic lives in `src/utils/pricing.ts`.
- Persistence lives in `src/utils/persistence.ts`.
- Rendering lives in presentational components.
- Step flow and selection state are orchestrated centrally in `src/hooks/useBuilderState.ts`.

## Trade-offs and Future Improvements

### Trade-offs

- State is centralized in a single hook for clarity rather than distributed across contexts.
- The UI is not fully optimized for accessibility beyond basic semantic markup.
- Animations are intentionally minimal to keep the focus on functionality.

### Future enhancements

- Add keyboard accessibility for accordion panels and variant buttons.
- Add unit tests for state management and pricing logic.
- Add integration tests for workflow interaction.
- Expand JSON schema with inventory, SKU, and product metadata.
- Introduce feature flags for alternate pricing or localization.
- Add a richer animation system using `framer-motion`.

## Setup & Development

### Requirements

- Node.js 20+ recommended
- npm or yarn available

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

## Notes for Contributors

- Keep the UI data-driven: add products and variants through `src/data/products.json`, not by hardcoding new card markup.
- Keep pricing and review logic in `src/utils/pricing.ts`.
- If you add fields to the JSON data, update `src/types/index.ts` to reflect the new schema.
- Maintain the mobile-first responsive layout and sticky review panel behavior.
- Review `src/hooks/useBuilderState.ts` before changing selection or persistence behavior.

## Summary

This repository is a polished frontend solution for the Bundle Builder take-home challenge. It demonstrates a data-driven React architecture, responsive layout, real-time review synchronization, and a production-minded approach to code organization.
