import { Link } from 'react-router-dom';

export default function RegisterCta({ registeredCount }) {
  const countLabel =
    registeredCount === null ? 'carregando…' : `${registeredCount} ${registeredCount === 1 ? 'inscrito' : 'inscritos'}`;

  return (
    <section id="inscricao">
      <div className="wrap">
        <div className="sec-head">
          <h2>Inscrição</h2>
          <div className="count">{countLabel}</div>
        </div>
        <div className="register-wrap">
          <div className="register-info">
            <p>
              A inscrição é gratuita e feita em um formulário rápido. Ele pede alguns dados pessoais
              e perguntas sobre a sua expectativa, que ajudam a organização a preparar o encontro.
            </p>
            <ul>
              <li>Tenha o seu CPF à mão — ele é necessário para a inscrição</li>
              <li>Use um e-mail que você acessa: ele também será pedido no certificado</li>
              <li>Certificado liberado após o encerramento do evento</li>
            </ul>
          </div>

          <div className="register-cta-card">
            <h3>Garanta a sua vaga</h3>
            <p>Leva poucos minutos e você recebe o código de inscrição na hora.</p>
            <Link to="/inscricao" className="btn btn-primary">
              Preencher formulário de inscrição
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
