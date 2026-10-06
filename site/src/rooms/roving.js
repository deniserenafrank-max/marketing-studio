// One tab stop per group; arrows move, Home and End jump, Tab leaves. Used by the move cards,
// the town chips and the evidence words.
export function rovingGroup(items, { selectedIndex = 0, orientation = 'both', onMove } = {}) {
  items.forEach((el, i) => el.setAttribute('tabindex', i === selectedIndex ? '0' : '-1'));
  if (items.__roving) return;
  items.__roving = true;
  const keys = orientation === 'horizontal' ? ['ArrowRight', 'ArrowLeft'] : orientation === 'vertical' ? ['ArrowDown', 'ArrowUp'] : ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'];
  items.forEach((el, i) => {
    el.addEventListener('keydown', (e) => {
      if (!keys.includes(e.key) && e.key !== 'Home' && e.key !== 'End') return;
      e.preventDefault();
      let next = i;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % items.length;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + items.length) % items.length;
      if (e.key === 'Home') next = 0;
      if (e.key === 'End') next = items.length - 1;
      items.forEach((it, j) => it.setAttribute('tabindex', j === next ? '0' : '-1'));
      items[next].focus();
      onMove?.(next);
    });
  });
}
