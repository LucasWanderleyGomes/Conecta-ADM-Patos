import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import NetworkDecoration from '../components/NetworkDecoration';
import OptionGroup, { OTHER } from '../components/OptionGroup';
import { loadConfig, DEFAULT_CONFIG } from '../lib/config';
import { registerAttendee } from '../lib/registrations';
import { formatCpf, isValidCpf } from '../lib/cpf';
import { VINCULO_OPTIONS, CONCERN_OPTIONS, INTEREST_OPTIONS } from '../data/formOptions';

const INITIAL = {
  name: '',
  cpf: '',
  email: '',
  vinculo: '',
  vinculoOther: '',
  institution: '',
  concerns: [],
  concernsOther: '',
  interests: [],
  interestsOther: '',
  question: '',
  consent: false,
  website: '' // isca para robôs: pessoas nunca veem nem preenchem
};

// Ordem em que os campos aparecem na tela (usada para rolar até o primeiro erro).
const FIELD_ORDER = ['name', 'cpf', 'email', 'vinculo', 'institution', 'concerns', 'interests', 'consent'];

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function validate(f) {
  const e = {};
  if (f.name.trim().split(/\s+/).filter(Boolean).length < 2) e.name = 'Informe o nome completo.';
  if (!isValidCpf(f.cpf)) e.cpf = 'CPF inválido. Confira os números.';
  if (!EMAIL_RE.test(f.email.trim())) e.email = 'Informe um e-mail válido.';

  if (!f.vinculo) e.vinculo = 'Selecione uma opção.';
  else if (f.vinculo === OTHER && !f.vinculoOther.trim()) e.vinculo = 'Especifique o seu vínculo em "Outro".';

  if (!f.institution.trim()) e.institution = 'Informe a instituição, empresa ou organização.';

  if (f.concerns.length === 0) e.concerns = 'Selecione ao menos uma opção.';
  else if (f.concerns.includes(OTHER) && !f.concernsOther.trim()) e.concerns = 'Especifique a opção "Outro".';

  if (f.interests.length === 0) e.interests = 'Selecione ao menos uma opção.';
  else if (f.interests.includes(OTHER) && !f.interestsOther.trim()) e.interests = 'Especifique a opção "Outro".';

  if (!f.consent) e.consent = 'É necessário concordar para concluir a inscrição.';
  return e;
}

// Troca o marcador interno OTHER por "Outro: texto digitado".
function resolveOther(values, otherText) {
  return values.map((v) => (v === OTHER ? `Outro: ${otherText.trim()}` : v));
}

function Field({ id, label, required, error, hint, children }) {
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label htmlFor={id}>
        {label}
        {required && <span className="req"> *</span>}
      </label>
      {children}
      {hint && !error && <div className="field-hint">{hint}</div>}
      {error && (
        <div className="field-error" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}

function FormHero({ config }) {
  return (
    <header className="form-hero">
      <NetworkDecoration variant="corner" className="masthead-net masthead-net-a" />
      <div className="wrap">
        <Link to="/" className="back-link">← Voltar ao site</Link>
        <h1>Inscrição</h1>
        <p className="sub">
          <strong>{config.eventName}</strong> · {config.dateLabel} · {config.timeLabel} · {config.locationLabel}
        </p>
      </div>
    </header>
  );
}

export default function RegistrationPage() {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [result, setResult] = useState(null); // { name, code, warn }

  useEffect(() => {
    loadConfig().then(setConfig);
    window.scrollTo(0, 0);
  }, []);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => (e[field] ? { ...e, [field]: undefined } : e));
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    setSubmitError('');

    const found = validate(form);
    setErrors(found);
    const firstInvalid = FIELD_ORDER.find((key) => found[key]);
    if (firstInvalid) {
      const el = document.getElementById(`field-${firstInvalid}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Campo-isca preenchido = robô. Finge sucesso e não envia nada.
    if (form.website) {
      setResult({ name: form.name.trim(), code: null, warn: false });
      return;
    }

    setSubmitting(true);
    try {
      const { code, warn } = await registerAttendee({
        name: form.name,
        cpf: form.cpf,
        email: form.email,
        vinculo: form.vinculo === OTHER ? `Outro: ${form.vinculoOther.trim()}` : form.vinculo,
        institution: form.institution,
        concerns: resolveOther(form.concerns, form.concernsOther),
        interests: resolveOther(form.interests, form.interestsOther),
        question: form.question,
        consent: form.consent
      });
      setResult({ name: form.name.trim(), code, warn });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setSubmitError(
        err.userFacing
          ? err.message
          : 'Não foi possível concluir a inscrição agora. Tente novamente em instantes.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <>
        <FormHero config={config} />
        <main>
          <div className="wrap form-wrap">
            <div className="form-card success-card">
              <h2>Inscrição confirmada!</h2>
              <p>
                Obrigado, <strong>{result.name}</strong>. Sua inscrição no {config.eventName} foi registrada.
              </p>
              {result.code && (
                <p>
                  Seu código de inscrição: <span className="code-chip">{result.code}</span>
                </p>
              )}
              <p className="success-note">
                Guarde o <strong>e-mail</strong> e o <strong>CPF</strong> que você informou: eles serão
                pedidos para emitir o seu certificado depois do evento.
              </p>
              {result.warn && (
                <p className="success-note">
                  Aviso: o armazenamento permanente não está disponível neste modo de visualização — os
                  dados ficam salvos apenas nesta sessão.
                </p>
              )}
              <Link to="/" className="btn btn-primary">Voltar ao site</Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <FormHero config={config} />
      <main>
        <div className="wrap form-wrap">
          <form className="form-card" onSubmit={handleSubmit} noValidate>
            <p className="form-intro">
              Os campos marcados com <span className="req">*</span> são obrigatórios.
            </p>

            <div className="form-block">
              <h3 className="form-block-title">Seus dados</h3>

              <Field id="field-name" label="Nome completo" required error={errors.name}>
                <input
                  id="field-name"
                  type="text"
                  autoComplete="name"
                  maxLength={150}
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                />
              </Field>

              <div className="form-row">
                <Field id="field-cpf" label="CPF" required error={errors.cpf}>
                  <input
                    id="field-cpf"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="000.000.000-00"
                    maxLength={14}
                    value={form.cpf}
                    onChange={(e) => set('cpf', formatCpf(e.target.value))}
                  />
                </Field>
                <Field id="field-email" label="E-mail" required error={errors.email}>
                  <input
                    id="field-email"
                    type="email"
                    autoComplete="email"
                    maxLength={150}
                    value={form.email}
                    onChange={(e) => set('email', e.target.value)}
                  />
                </Field>
              </div>
            </div>

            <div className="form-block">
              <h3 className="form-block-title">Seu vínculo</h3>

              <OptionGroup
                groupId="field-vinculo"
                type="radio"
                legend="Vínculo"
                required
                options={VINCULO_OPTIONS}
                selected={form.vinculo}
                onChange={(v) => set('vinculo', v)}
                otherText={form.vinculoOther}
                onOtherChange={(t) => set('vinculoOther', t)}
                error={errors.vinculo}
              />

              <Field id="field-institution" label="Instituição / Empresa / Organização em que está vinculado" required error={errors.institution}>
                <input
                  id="field-institution"
                  type="text"
                  autoComplete="organization"
                  maxLength={200}
                  value={form.institution}
                  onChange={(e) => set('institution', e.target.value)}
                />
              </Field>
            </div>

            <div className="form-block">
              <h3 className="form-block-title">Suas expectativas</h3>

              <OptionGroup
                groupId="field-concerns"
                type="checkbox"
                legend="Qual é a sua principal dúvida ou preocupação em relação à carreira em Administração?"
                hint="Você pode marcar mais de uma opção."
                required
                options={CONCERN_OPTIONS}
                selected={form.concerns}
                onChange={(v) => set('concerns', v)}
                otherText={form.concernsOther}
                onOtherChange={(t) => set('concernsOther', t)}
                error={errors.concerns}
              />

              <OptionGroup
                groupId="field-interests"
                type="checkbox"
                legend="O que você mais gostaria de descobrir no Conecta ADM?"
                hint="Você pode marcar mais de uma opção."
                required
                options={INTEREST_OPTIONS}
                selected={form.interests}
                onChange={(v) => set('interests', v)}
                otherText={form.interestsOther}
                onOtherChange={(t) => set('interestsOther', t)}
                error={errors.interests}
              />

              <Field
                id="field-question"
                label="Se pudesse fazer uma pergunta a um profissional de Administração, qual seria?"
                hint="Opcional."
              >
                <textarea
                  id="field-question"
                  rows={4}
                  maxLength={1000}
                  value={form.question}
                  onChange={(e) => set('question', e.target.value)}
                />
              </Field>
            </div>

            {/* Campo-isca anti-robô: escondido de quem usa o site */}
            <input
              type="text"
              name="website"
              className="hp"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              value={form.website}
              onChange={(e) => set('website', e.target.value)}
            />

            <div className={`consent ${errors.consent ? 'has-error' : ''}`} id="field-consent">
              <label className="consent-label">
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={(e) => set('consent', e.target.checked)}
                />
                <span>
                  Concordo com o uso dos meus dados pessoais (inclusive o CPF) pela organização do
                  Conecta ADM Patos, exclusivamente para controle de inscrição, comunicação sobre o
                  evento, planejamento da programação e emissão de certificado.
                </span>
              </label>
              {errors.consent && (
                <div className="field-error" role="alert">
                  {errors.consent}
                </div>
              )}
            </div>

            {submitError && <div className="form-msg show error">{submitError}</div>}

            <button type="submit" className="btn btn-primary form-submit" disabled={submitting}>
              {submitting ? 'Enviando...' : 'Confirmar inscrição'}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
