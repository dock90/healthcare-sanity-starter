/**
 * First focusable element on every page. Visually hidden until focused.
 * Target is `<main id="main">`.
 */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:inline-flex focus:min-h-target focus:items-center focus:rounded focus:bg-accent focus:px-5 focus:text-ink-inverse focus:font-medium"
    >
      Skip to main content
    </a>
  );
}
