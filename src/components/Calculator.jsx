import { useMemo } from 'react';
import { computeCalc, formatSoles, INVESTMENT } from '../utils/calc';
import styles from './Calculator.module.css';

function ResultCard({ label, value, variant = 'positive' }) {
  return (
    <div className={`${styles.card} ${styles[variant]}`}>
      <span className={styles.cardLabel}>{label}</span>
      <span className={styles.cardValue}>{value}</span>
    </div>
  );
}

function InsightBox({ breakEvenMonth, yearOneProfit }) {
  if (!breakEvenMonth) {
    return (
      <div className={`${styles.insight} ${styles.slow}`}>
        <strong>⚠️ Recuperación muy lenta</strong>
        Con estos números, la inversión no se recupera dentro del primer año.
        Considera aumentar los clientes mensuales o el precio del servicio.
        <br /><br />
        Ganancia neta año 1: <strong>{formatSoles(yearOneProfit)}</strong>
      </div>
    );
  }

  if (breakEvenMonth <= 3) {
    return (
      <div className={`${styles.insight} ${styles.fast}`}>
        <strong>✓ Recupera muy rápido</strong>
        En <strong>{breakEvenMonth} {breakEvenMonth === 1 ? 'mes' : 'meses'}</strong> recuperas
        toda tu inversión. Desde el mes <strong>{breakEvenMonth + 1}</strong> es puro profit.
        <br /><br />
        Ganancia neta año 1: <strong>{formatSoles(yearOneProfit)}</strong>
      </div>
    );
  }

  if (breakEvenMonth <= 6) {
    return (
      <div className={`${styles.insight} ${styles.moderate}`}>
        <strong>✓ Recuperación realista</strong>
        En <strong>{breakEvenMonth} meses</strong> recuperas tu inversión. Es un tiempo justo y viable.
        <br /><br />
        Ganancia neta año 1: <strong>{formatSoles(yearOneProfit)}</strong>
      </div>
    );
  }

  return (
    <div className={`${styles.insight} ${styles.slow}`}>
      <strong>⚠️ Recuperación lenta</strong>
      Tardarás <strong>{breakEvenMonth} meses</strong> en recuperar. Considera aumentar
      clientes o el precio — o conversa con nosotros para analizar tu caso.
      <br /><br />
      Ganancia neta año 1: <strong>{formatSoles(yearOneProfit)}</strong>
    </div>
  );
}

function ProjectionTable({ projection, breakEvenMonth }) {
  return (
    <div className={styles.projectionWrap}>
      <h3>Proyección a 12 meses</h3>
      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Mes</th>
              <th>Clientes</th>
              <th>Ganancia</th>
              <th>Flujo acumulado</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {projection.map(({ month, clients, monthlyProfit, cumulative }) => {
              const isPositive = cumulative >= 0;
              const isBreakEvenRow = month === breakEvenMonth;
              return (
                <tr key={month} className={isBreakEvenRow ? styles.breakEvenRow : ''}>
                  <td>Mes {month}</td>
                  <td>{clients}</td>
                  <td className={styles.positive}>+{formatSoles(monthlyProfit)}</td>
                  <td className={isPositive ? styles.positive : styles.negative}>
                    {isPositive ? '' : '-'}{formatSoles(cumulative)}
                  </td>
                  <td>
                    <span className={`${styles.badge} ${isPositive ? styles.badgeProfit : styles.badgeRecovering}`}>
                      {isPositive ? 'Ganancia' : 'Recuperando'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Calculator({ inputs, onChange }) {
  const { serviceName, servicePrice, margin, clientsPerMonth } = inputs;

  const calc = useMemo(
    () => computeCalc({ servicePrice, margin, clientsPerMonth }),
    [servicePrice, margin, clientsPerMonth]
  );

  const serviceLabel = serviceName.trim().length >= 3 ? serviceName.trim() : 'tu servicio';

  const breakEvenLabel = calc.breakEvenMonth
    ? `${calc.breakEvenMonth} ${calc.breakEvenMonth === 1 ? 'mes' : 'meses'}`
    : '> 12 meses';

  return (
    <section className={styles.section} id="calculadora">
      <div className="container">
        <h2 className={styles.title}>Calcula tu retorno real</h2>
        <p className={styles.subtitle}>Ingresa tus números y ve en tiempo real cuánto ganarías.</p>

        <div className={styles.layout}>
          {/* ── INPUTS ── */}
          <div className={styles.inputs}>
            <div className="form-group">
              <label htmlFor="serviceName">¿Cuál es tu servicio más caro?</label>
              <input
                id="serviceName"
                type="text"
                placeholder="Ej: Coloración, Balayage, Alisado"
                maxLength={60}
                value={serviceName}
                onChange={(e) => onChange('serviceName', e.target.value)}
                autoComplete="off"
              />
            </div>

            <div className="form-group">
              <label htmlFor="servicePrice">
                ¿Cuánto cobras por ese servicio? <span className={styles.currency}>(S/)</span>
              </label>
              <input
                id="servicePrice"
                type="number"
                min={200}
                max={1000}
                step={50}
                value={servicePrice}
                onChange={(e) => onChange('servicePrice', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="margin">
                Margen de ganancia estimado:{' '}
                <strong>{margin}%</strong>
              </label>
              <input
                id="margin"
                type="range"
                min={50}
                max={80}
                step={5}
                value={margin}
                onChange={(e) => onChange('margin', e.target.value)}
                className={styles.slider}
              />
              <div className={styles.sliderTicks}>
                <span>50%</span><span>65%</span><span>80%</span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="clients">
                Clientes nuevos en <em className={styles.accentText}>{serviceLabel}</em> por mes:{' '}
                <strong>{clientsPerMonth}</strong>
              </label>
              <input
                id="clients"
                type="range"
                min={2}
                max={12}
                step={1}
                value={clientsPerMonth}
                onChange={(e) => onChange('clientsPerMonth', e.target.value)}
                className={styles.slider}
              />
              <div className={styles.sliderTicks}>
                <span>2</span><span>7</span><span>12</span>
              </div>
            </div>
          </div>

          {/* ── RESULTS ── */}
          <div className={styles.results}>
            <div className={styles.cardsGrid}>
              <ResultCard label="Ganancia por cliente" value={formatSoles(calc.profitPerClient)} variant="positive" />
              <ResultCard label="Ganancia mensual" value={formatSoles(calc.monthlyProfit)} variant="positive" />
              <ResultCard label="Recuperas inversión en" value={breakEvenLabel} variant="neutral" />
              <ResultCard
                label="Ganancia neta año 1"
                value={formatSoles(calc.yearOneProfit)}
                variant={calc.yearOneProfit > 0 ? 'positive' : 'neutral'}
              />
            </div>

            <InsightBox breakEvenMonth={calc.breakEvenMonth} yearOneProfit={calc.yearOneProfit} />
            <ProjectionTable projection={calc.projection} breakEvenMonth={calc.breakEvenMonth} />
          </div>
        </div>
      </div>
    </section>
  );
}
