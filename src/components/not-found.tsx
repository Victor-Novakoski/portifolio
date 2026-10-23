// Qualquer caminho fora da raiz cai aqui (a Vercel reescreve tudo para o index.html).
export function NotFound() {
  return (
    <main className="lost" id="conteudo">
      <div className="wrap">
        <span className="code">404 · rota desconhecida</span>
        <h1>Caminho sem saída</h1>
        <p>Essa trilha não leva a lugar nenhum. A fogueira continua acesa no começo da rota.</p>
        <a className="btn-main" href="/">
          Voltar à fogueira
        </a>
      </div>
    </main>
  )
}
