// changelog: the kind filter hides groups, then releases left without any
export default function (signal: AbortSignal) {
  const radios = [...document.querySelectorAll<HTMLInputElement>('input[name="kind"]')];
  const apply = () => {
    const kind = radios.find((r) => r.checked)?.value ?? 'all';
    document.querySelectorAll<HTMLElement>('.log-group').forEach((g) => (g.hidden = kind !== 'all' && g.dataset.kind !== kind));
    document.querySelectorAll<HTMLElement>('.sec').forEach((sec) => (sec.hidden = !sec.querySelector('.log-group:not([hidden])')));
  };
  radios.forEach((r) => r.addEventListener('change', apply, { signal }));
  apply();
}
