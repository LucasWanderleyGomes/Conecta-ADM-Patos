export default function About() {
  return (
    <section id="sobre">
      <div className="wrap about-grid">
        <div>
          <h2>Sobre o encontro</h2>
          <p>
            O Conecta ADM Patos reúne, em uma noite, estudantes, professores e profissionais do mercado
            para debater os caminhos entre a universidade, a formação em Administração e o mercado de
            trabalho. O evento é aberto ao público e organizado em blocos de apresentações seguidos de
            rodas de conversa com os convidados.
          </p>
          <p>
            Ao final do evento, todos os inscritos com presença confirmada recebem certificado digital
            de participação, emitido automaticamente por esta página.
          </p>
        </div>
        <div className="about-figures">
          <div className="figure">
            <div className="num">04</div>
            <div className="lbl">Palestrantes convidados</div>
          </div>
          <div className="figure">
            <div className="num">01</div>
            <div className="lbl">Noite de programação</div>
          </div>
          <div className="figure">
            <div className="num">100%</div>
            <div className="lbl">Inscrição e certificado on-line</div>
          </div>
        </div>
      </div>
    </section>
  );
}
