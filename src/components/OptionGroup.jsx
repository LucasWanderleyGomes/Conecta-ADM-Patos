// Grupo de opções com "Outro:" no final.
// type="radio": escolha única. type="checkbox": várias escolhas.
// O valor especial OTHER indica que "Outro:" está marcado; o texto digitado
// fica em otherText (o componente pai monta "Outro: texto" na hora de enviar).

export const OTHER = '__outro__';

export default function OptionGroup({
  groupId,
  type,
  legend,
  hint,
  required,
  options,
  selected,
  onChange,
  otherText,
  onOtherChange,
  error
}) {
  const isChecked = (value) => (type === 'radio' ? selected === value : selected.includes(value));

  function toggle(value) {
    if (type === 'radio') {
      onChange(value);
    } else {
      onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);
    }
  }

  function ensureOtherChecked() {
    if (!isChecked(OTHER)) toggle(OTHER);
  }

  return (
    <fieldset className={`opt-group ${error ? 'has-error' : ''}`} id={groupId}>
      <legend>
        {legend}
        {required && <span className="req"> *</span>}
      </legend>
      {hint && <div className="opt-hint">{hint}</div>}

      <div className="opt-list">
        {[...options, OTHER].map((option) => {
          const isOther = option === OTHER;
          const checked = isChecked(option);
          return (
            <label key={option} className={`opt ${checked ? 'checked' : ''}`}>
              <input
                type={type}
                name={groupId}
                checked={checked}
                onChange={() => toggle(option)}
              />
              <span className="opt-label">{isOther ? 'Outro:' : option}</span>
              {isOther && (
                <input
                  type="text"
                  className="opt-other"
                  value={otherText}
                  maxLength={120}
                  placeholder="Especifique"
                  aria-label={`${legend} — outro`}
                  onFocus={ensureOtherChecked}
                  onChange={(e) => {
                    ensureOtherChecked();
                    onOtherChange(e.target.value);
                  }}
                />
              )}
            </label>
          );
        })}
      </div>

      {error && (
        <div className="field-error" role="alert">
          {error}
        </div>
      )}
    </fieldset>
  );
}
