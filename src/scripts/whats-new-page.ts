// changelog: the kind filter hides groups, then releases and toc links left without any
export default function (signal: AbortSignal) {
  const radios = [...document.querySelectorAll<HTMLInputElement>('input[name="kind"]')];
  const apply = () => {
    const kind = radios.find((r) => r.checked)?.value ?? 'all';
    document.querySelectorAll<HTMLElement>('.log-group').forEach((g) => (g.hidden = kind !== 'all' && g.dataset.kind !== kind));
    document.querySelectorAll<HTMLElement>('.sec').forEach((sec) => {
      const empty = !sec.querySelector('.log-group:not([hidden])');
      sec.hidden = empty;
      document.querySelector(`[data-toc="${sec.id}"]`)?.parentElement?.toggleAttribute('hidden', empty);
    });
    dispatchEvent(new Event('scroll'));
  };
  radios.forEach((r) => r.addEventListener('change', apply, { signal }));
  apply();
}
