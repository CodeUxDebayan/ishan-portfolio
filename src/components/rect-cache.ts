export function createRectCache(element: HTMLElement) {
  let cached = element.getBoundingClientRect();

  const update = () => {
    cached = element.getBoundingClientRect();
  };

  window.addEventListener("resize", update, { passive: true });
  window.addEventListener("scroll", update, { capture: true, passive: true });

  return {
    get current() {
      return cached;
    },
    destroy() {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, { capture: true });
    },
  };
}
