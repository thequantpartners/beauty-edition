import { useMemo } from 'react';
import { computeCalc, formatSoles } from '../utils/calc';
import styles from './CTA.module.css';

export default function CTA({ inputs, onOpenModal }) {
  const { serviceName, servicePrice, margin, clientsPerMonth } = inputs;

  const calc = useMemo(
    () => computeCalc({ servicePrice, margin, clientsPerMonth }),
    [servicePrice, margin, clientsPerMonth]
  );

  if (!calc.qualifiesCTA) return null;

  const serviceLabel = serviceName.trim().length >= 3 ? serviceName.trim() : 'tu servicio principal';

  return (
    <section className={styles.section}>
      <div className="container">
        <p className={styles.eyebrow}>Tu salón califica</p>

        <h2 className={styles.title}>
          <span className={styles.titleAmount}>{formatSoles(calc.yearOneProfit)}</span>
          <br />
          <span className={styles.titleSub}>de ganancia neta el primer año</span>
        </h2>

        <p className={styles.detail}>
          Con <strong>{clientsPerMonth} clientes/mes</strong> en{' '}
          <em className={styles.em}>{serviceLabel}</em>,
          recuperas tu inversión en{' '}
          <strong>
            {calc.breakEvenMonth} {calc.breakEvenMonth === 1 ? 'mes' : 'meses'}.
          </strong>
        </p>

        <button className={`btn-primary ${styles.ctaBtn}`} onClick={onOpenModal}>
          Agendar llamada de demo →
        </button>

        <p className={styles.footnote}>30 minutos · Sin compromiso · Solo si calificas</p>
      </div>
    </section>
  );
}
