import { useState, useEffect } from 'react';
import styles from './FilterModal.module.css';

// ── Constants ────────────────────────────────────────────────
const COUNTRIES = [
  { code: 'PE', flag: '🇵🇪', dial: '+51' },
  { code: 'CO', flag: '🇨🇴', dial: '+57' },
  { code: 'MX', flag: '🇲🇽', dial: '+52' },
  { code: 'AR', flag: '🇦🇷', dial: '+54' },
  { code: 'CL', flag: '🇨🇱', dial: '+56' },
  { code: 'EC', flag: '🇪🇨', dial: '+593' },
  { code: 'BO', flag: '🇧🇴', dial: '+591' },
  { code: 'PY', flag: '🇵🇾', dial: '+595' },
  { code: 'UY', flag: '🇺🇾', dial: '+598' },
  { code: 'VE', flag: '🇻🇪', dial: '+58' },
  { code: 'ES', flag: '🇪🇸', dial: '+34' },
  { code: 'US', flag: '🇺🇸', dial: '+1' },
];

const BUDGET_OPTIONS = [
  { value: 'lt500',    label: 'Menos de S/ 500' },
  { value: '500-1500', label: 'S/ 500 – 1,500' },
  { value: '1500-3000',label: 'S/ 1,500 – 3,000' },
  { value: 'gt3000',   label: 'Más de S/ 3,000' },
];

const PDFS = [
  { value: 'pdf1', label: '5 trucos para traer clientes a tu salón con Google Ads' },
  { value: 'pdf2', label: 'Guía: ¿Cuál es el precio justo para coloración en Perú 2026?' },
  { value: 'pdf3', label: 'Checklist: ¿Está tu salón listo para crecer?' },
  { value: 'pdf4', label: 'Costo real de un cliente en Google Ads vs un Sistema de Ventas' },
];

// TOTAL_STEPS = 4 (steps 0-3). Steps 4+ are result screens.
const TOTAL_STEPS = 4;

function evaluateFilter({ colorista, presupuesto, sucursales }) {
  if (colorista === 'no') return false;
  if (presupuesto === 'lt500') return false;
  if (parseInt(sucursales, 10) < 1) return false;
  return true;
}

// ── Shared: OptionButton ─────────────────────────────────────
function OptionButton({ label, selected, onClick }) {
  return (
    <button
      type="button"
      className={`${styles.optBtn} ${selected ? styles.optBtnSelected : ''}`}
      onClick={onClick}
    >
      {selected && <span className={styles.optCheck}>✓</span>}
      {label}
    </button>
  );
}

// ── Shared: ProgressBar ──────────────────────────────────────
function ProgressBar({ step }) {
  const pct = Math.round(((step + 1) / TOTAL_STEPS) * 100);
  return (
    <div className={styles.progressWrap}>
      <div className={styles.progressTrack}>
        <div className={styles.progressFill} style={{ width: `${pct}%` }} />
      </div>
      <span className={styles.progressLabel}>Paso {step + 1} de {TOTAL_STEPS}</span>
    </div>
  );
}

// ── Step 0: Lead info (name + phone) ────────────────────────
function Step0({ data, onChange, onNext }) {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!data.nombre.trim()) e.nombre = 'Ingresa tu nombre.';
    if (!data.telefono.trim() || data.telefono.trim().length < 6)
      e.telefono = 'Ingresa un número válido.';
    return e;
  };

  const handleNext = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onNext();
  };

  return (
    <div className={styles.stepBody}>
      <h2>Cuéntanos un poco sobre ti</h2>
      <p className={styles.modalSub}>Solo tardará 2 minutos.</p>

      <div className={`form-group ${errors.nombre ? 'has-error' : ''}`}>
        <label>Tu nombre</label>
        <input
          type="text"
          placeholder="María García"
          value={data.nombre}
          onChange={(e) => onChange('nombre', e.target.value)}
          autoFocus
        />
        {errors.nombre && <span className="error-msg">{errors.nombre}</span>}
      </div>

      <div className={`form-group ${errors.telefono ? 'has-error' : ''}`}>
        <label>Número de teléfono / WhatsApp</label>
        <div className={styles.phoneRow}>
          <select
            className={styles.countrySelect}
            value={data.countryCode}
            onChange={(e) => onChange('countryCode', e.target.value)}
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.dial}
              </option>
            ))}
          </select>
          <input
            type="tel"
            className={styles.phoneInput}
            placeholder="987 654 321"
            value={data.telefono}
            onChange={(e) => onChange('telefono', e.target.value)}
          />
        </div>
        {errors.telefono && <span className="error-msg">{errors.telefono}</span>}
      </div>

      <button className="btn-primary btn-full" onClick={handleNext}>
        Continuar →
      </button>
    </div>
  );
}

// ── Step 1: Selections (colorista + presupuesto) ─────────────
// Auto-advances when BOTH are answered
function Step1({ data, onChange, onNext }) {
  const handleSelect = (key, val) => {
    const updated = { ...data, [key]: val };
    onChange(key, val);
    // Auto-advance once both selections are filled
    if (updated.colorista && updated.presupuesto) {
      setTimeout(onNext, 320);
    }
  };

  return (
    <div className={styles.stepBody}>
      <h2>Dos preguntas rápidas</h2>
      <p className={styles.modalSub}>Selecciona una opción en cada una.</p>

      <div className={styles.qBlock}>
        <p className={styles.qLabel}>¿Tienes un colorista especializado en tu salón?</p>
        <div className={styles.optRow}>
          <OptionButton label="Sí, tengo" selected={data.colorista === 'si'} onClick={() => handleSelect('colorista', 'si')} />
          <OptionButton label="No tengo" selected={data.colorista === 'no'} onClick={() => handleSelect('colorista', 'no')} />
        </div>
      </div>

      <div className={styles.qBlock}>
        <p className={styles.qLabel}>¿Cuánto inviertes al mes en marketing?</p>
        <div className={styles.optGrid}>
          {BUDGET_OPTIONS.map((opt) => (
            <OptionButton
              key={opt.value}
              label={opt.label}
              selected={data.presupuesto === opt.value}
              onClick={() => handleSelect('presupuesto', opt.value)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Step 2: Numbers (sucursales + clientes nuevos) ───────────
function Step2({ data, onChange, onNext, inputs }) {
  const [errors, setErrors] = useState({});
  const serviceLabel = inputs.serviceName.trim().length >= 3 ? inputs.serviceName.trim() : 'tu servicio';

  const validate = () => {
    const e = {};
    if (!data.sucursales || parseInt(data.sucursales, 10) < 1)
      e.sucursales = 'Ingresa al menos 1 sucursal.';
    if (data.clientesNuevos === '')
      e.clientesNuevos = 'Ingresa el número (puede ser 0).';
    return e;
  };

  const handleNext = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onNext();
  };

  return (
    <div className={styles.stepBody}>
      <h2>Tu situación actual</h2>
      <p className={styles.modalSub}>Números aproximados están bien.</p>

      <div className={`form-group ${errors.sucursales ? 'has-error' : ''}`}>
        <label>¿Cuántas sucursales tienes actualmente?</label>
        <input
          type="number"
          min={1}
          max={50}
          placeholder="1"
          value={data.sucursales}
          onChange={(e) => onChange('sucursales', e.target.value)}
        />
        {errors.sucursales && <span className="error-msg">{errors.sucursales}</span>}
      </div>

      <div className={`form-group ${errors.clientesNuevos ? 'has-error' : ''}`}>
        <label>
          En los últimos 3 meses, ¿cuántos clientes nuevos en{' '}
          <em className={styles.accentText}>{serviceLabel}</em> conseguiste?
        </label>
        <input
          type="number"
          min={0}
          max={500}
          placeholder="0"
          value={data.clientesNuevos}
          onChange={(e) => onChange('clientesNuevos', e.target.value)}
        />
        {errors.clientesNuevos && <span className="error-msg">{errors.clientesNuevos}</span>}
      </div>

      <button className="btn-primary btn-full" onClick={handleNext}>
        Continuar →
      </button>
    </div>
  );
}

// ── Step 3: Textareas (desafío + ads) ────────────────────────
function Step3({ data, onChange, onFinish }) {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (data.desafio.trim().length < 50)
      e.desafio = 'Escribe al menos 50 caracteres.';
    if (data.ads.trim().length < 30)
      e.ads = 'Escribe al menos 30 caracteres.';
    return e;
  };

  const handleFinish = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onFinish();
  };

  return (
    <div className={styles.stepBody}>
      <h2>Cuéntanos más</h2>
      <p className={styles.modalSub}>Esto nos ayuda a personalizar la demo para ti.</p>

      <div className={`form-group ${errors.desafio ? 'has-error' : ''}`}>
        <label>¿Cuál es tu mayor desafío para conseguir clientes nuevos?</label>
        <textarea
          rows={3}
          maxLength={300}
          placeholder="Cuéntanos qué está pasando con tu flujo de clientes..."
          value={data.desafio}
          onChange={(e) => onChange('desafio', e.target.value)}
        />
        <span className="char-count">{data.desafio.length} / 300</span>
        {errors.desafio && <span className="error-msg">{errors.desafio}</span>}
      </div>

      <div className={`form-group ${errors.ads ? 'has-error' : ''}`}>
        <label>¿Ya intentaste Google Ads antes? ¿Qué pasó?</label>
        <textarea
          rows={3}
          maxLength={200}
          placeholder="Si no intentaste, escribe 'No' y por qué."
          value={data.ads}
          onChange={(e) => onChange('ads', e.target.value)}
        />
        <span className="char-count">{data.ads.length} / 200</span>
        {errors.ads && <span className="error-msg">{errors.ads}</span>}
      </div>

      <button className="btn-primary btn-full" onClick={handleFinish}>
        Ver mi resultado →
      </button>
    </div>
  );
}

// ── Result: Calendar ─────────────────────────────────────────
function StepCalendar({ inputs, leadName }) {
  const serviceLabel = inputs.serviceName.trim().length >= 3 ? inputs.serviceName.trim() : 'tu servicio';
  const firstName = leadName.trim().split(' ')[0];

  return (
    <div className={styles.stepBody}>
      <div className={styles.successBadge}>✓ Eres un buen candidato</div>
      <h2>{firstName ? `¡Perfecto, ${firstName}!` : '¡Perfecto!'} Agenda tu llamada</h2>
      <p className={styles.modalSub}>
        Tu perfil encaja muy bien. Agenda 30 minutos y te mostramos cómo el sistema
        funcionaría para <em className={styles.accentText}>{serviceLabel}</em>.
      </p>
      <div className={styles.calendarEmbed}>
        <iframe
          src="https://cal.com/the-quant-partners/quant-partners-beauty-edition-llamada-de-demo-vsl?embed=true"
          frameBorder="0"
          width="100%"
          height="520"
          title="Agendar llamada de demo"
          loading="lazy"
        />
      </div>
    </div>
  );
}

// ── Result: PDF ──────────────────────────────────────────────
function StepPdf() {
  const [chosen, setChosen] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSend = () => {
    const e = {};
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Ingresa un email válido.';
    if (!chosen) e.pdf = 'Selecciona un recurso.';
    if (Object.keys(e).length) { setErrors(e); return; }

    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); }, 1000);
  };

  return (
    <div className={styles.stepBody}>
      <h2>Aquí va algo de valor para ti</h2>
      <p className={styles.modalSub}>
        Quizás no sea el momento perfecto, pero queremos que te vayas con algo útil.
        Elige un recurso gratuito:
      </p>

      <div className={styles.pdfGrid}>
        {PDFS.map((pdf) => (
          <label key={pdf.value} className={`${styles.pdfOption} ${chosen === pdf.value ? styles.pdfSelected : ''}`}>
            <input type="radio" name="pdfChoice" value={pdf.value} checked={chosen === pdf.value} onChange={() => setChosen(pdf.value)} />
            <span>{pdf.label}</span>
          </label>
        ))}
      </div>
      {errors.pdf && <span className="error-msg" style={{ marginTop: 8, display: 'block' }}>{errors.pdf}</span>}

      <div className="form-group" style={{ marginTop: 20 }}>
        <label>Tu email</label>
        <input
          type="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <span className="error-msg">{errors.email}</span>}
      </div>

      {sent ? (
        <div className={styles.pdfConfirm}>✓ ¡Listo! Revisa tu bandeja de entrada.</div>
      ) : (
        <button className="btn-primary btn-full" onClick={handleSend} disabled={sending}>
          {sending ? 'Enviando...' : 'Enviar PDF a mi email →'}
        </button>
      )}
    </div>
  );
}

// ── Main Modal ───────────────────────────────────────────────
const INITIAL_DATA = {
  nombre: '',
  countryCode: 'PE',
  telefono: '',
  colorista: '',
  presupuesto: '',
  sucursales: '',
  clientesNuevos: '',
  desafio: '',
  ads: '',
};

export default function FilterModal({ isOpen, onClose, inputs }) {
  const [step, setStep] = useState(0);       // 0-3 = form steps, 'calendar' | 'pdf' = result
  const [data, setData] = useState(INITIAL_DATA);
  const [animating, setAnimating] = useState(false);

  // Reset on open
  useEffect(() => {
    if (isOpen) { setStep(0); setData(INITIAL_DATA); }
  }, [isOpen]);

  // Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const onChange = (key, val) => setData((d) => ({ ...d, [key]: val }));

  const goNext = () => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setStep((s) => s + 1);
      setAnimating(false);
    }, 180);
  };

  const finish = () => {
    const passes = evaluateFilter(data);
    setStep(passes ? 'calendar' : 'pdf');
  };

  if (!isOpen) return null;

  const isFormStep = typeof step === 'number' && step < TOTAL_STEPS;

  return (
    <div
      className={styles.overlay}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
    >
      <div className={`${styles.box} ${animating ? styles.fadeOut : styles.fadeIn}`}>
        <button className={styles.close} onClick={onClose} aria-label="Cerrar">✕</button>

        {isFormStep && <ProgressBar step={step} />}

        {step === 0 && <Step0 data={data} onChange={onChange} onNext={goNext} />}
        {step === 1 && <Step1 data={data} onChange={onChange} onNext={goNext} />}
        {step === 2 && <Step2 data={data} onChange={onChange} onNext={goNext} inputs={inputs} />}
        {step === 3 && <Step3 data={data} onChange={onChange} onFinish={finish} />}
        {step === 'calendar' && <StepCalendar inputs={inputs} leadName={data.nombre} />}
        {step === 'pdf' && <StepPdf />}
      </div>
    </div>
  );
}
