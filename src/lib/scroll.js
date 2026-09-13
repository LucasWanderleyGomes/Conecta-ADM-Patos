// Rola suavemente até uma seção pelo id, sem alterar a URL.
// Isso evita conflito com o HashRouter (que também usa "#" na URL para
// as rotas /  e /admin) — se usássemos <a href="#secao">, o clique
// mudaria a rota em vez de só rolar a página.
export function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
