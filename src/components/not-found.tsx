// Qualquer caminho fora da raiz cai aqui (a Vercel reescreve tudo para o index.html).
export function NotFound() {
  return (
    <main className="lost wrap" id="conteudo">
      <div>
        <span className="tag">404 · região desconhecida</span>
        <h1>Caminho sem saída</h1>
        <p>Nenhum caçador passou por aqui. A lanterna continua acesa na tela de título.</p>
        <a className="btn gold" href="/">
          Voltar ao início
        </a>
      </div>
    </main>
  )
}
