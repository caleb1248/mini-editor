import './splitview.css';

function registerVerticalSplitView(splitElement: HTMLElement) {
  if (!splitElement.classList.contains('split-view')) {
    throw new Error('Element must have class "split-view"');
  }
  const resizeHandle = splitElement.querySelector(
    '> .resize-handle'
  ) as HTMLElement;
  if (!resizeHandle) {
    throw new Error('SplitView must have a child with class "resize-handle"');
  }

  let dragging = false;

  let dragOffset = 0;

  let hoverTimeout: number | null = null;

  resizeHandle.addEventListener('mouseenter', () => {
    hoverTimeout = window.setTimeout(() => {
      resizeHandle.classList.add('hover');
    }, 300);
  });

  resizeHandle.addEventListener('mouseleave', () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      hoverTimeout = null;
    }

    resizeHandle.classList.remove('hover');
  });

  resizeHandle.addEventListener('mousedown', (event) => {
    event.preventDefault();
    dragging = true;
    dragOffset = event.clientX;
    resizeHandle.classList.add('active');
  });

  window.addEventListener('mouseup', () => {
    dragging = false;
    resizeHandle.classList.remove('active');
  });

  window.addEventListener('mousemove', (event) => {
    if (dragging) {
      const { left } = splitElement.getBoundingClientRect();
      const delta = event.clientX - dragOffset;
      const position = left + delta;

      resizeHandle.style.left = `${position}px`;
      (<HTMLElement>splitElement.children[0]).style.width = `${position}px`;
    }
  });
}

export { registerVerticalSplitView };
