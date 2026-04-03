import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className="container">

        <div className={styles.badge}>Sistema de Ventas · Salones de Belleza</div>

        <h1 className={styles.headline}>
          Aumentaremos tu facturación en{' '}
          <span className={styles.highlight}>3,000 a 5,000 soles extras</span>
          {' '}al mes
        </h1>
        <svg className={styles.underlineSvg} viewBox="0 0 400 12" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 9 Q50 3 100 9 Q150 15 200 9 Q250 3 300 9 Q350 15 400 9" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round"/>
        </svg>

        <p className={styles.sub}>
          Sin campañas complicadas · Sin dependencia de agencias · Sin suscripciones infinitas
        </p>

        <p className={styles.subStrong}>
          Instalamos tu sistema en{' '}
          <span className={styles.accentUnderline}>60 días</span>
          {' '}— luego es 100% tuyo y tú lo controlas.
        </p>

        <div className={styles.priceTag}>
          ¿El costo? Una sola inversión de <strong>S/ 6,000</strong>. Los ads corren por nosotros.
        </div>

        {/* ── EL DIAGNÓSTICO CRUDO ── */}
        <div className={styles.psContainer}>
          <div className={`${styles.psCard} ${styles.psCardBad}`}>
            <h3 className={styles.psTitle}>Sillas vacías y "agencias"<br/>que no entregan</h3>
            <p className={styles.psText}>
              Tienes a tu equipo mirando el móvil porque la agenda tiene huecos. 
              Estás dependiendo del «boca a boca» que es lindo pero impredecible, o tirando dinero 
              en mensualidades a agencias que prometen todo pero solo te traen curiosos que dejan en visto.
            </p>
          </div>

          <div className={`${styles.psCard} ${styles.psCardGood}`}>
            <div className={styles.glowEffect}></div>
            <h3 className={styles.psTitleGood}>Tracción pura. Autonomía total.</h3>
            <ul className={styles.psList}>
              <li><span className={styles.check}>✓</span> Tráfico predecible y de alto valor hacia tus servicios más rentables.</li>
              <li><span className={styles.check}>✓</span> <strong>El sistema es 100% TUYO</strong> a los 60 días. Cero comisiones, cero retainers infinitos.</li>
              <li><span className={styles.check}>✓</span> Añades de <strong>S/ 3,000 a S/ 5,000 netos</strong> a tu facturación real mensual.</li>
            </ul>
          </div>
        </div>

        {/* ── VS ── */}
        <div className={styles.vsRow}>
          <div className={styles.vsItem}>
            <p className={styles.vsItemLabel}>Agencias tradicionales</p>
            <p className={styles.vsItemText}><s>S/ 1,500/mes</s> · Nunca eres dueño</p>
          </div>
          <span className={styles.vsArrow}>→</span>
          <div className={styles.vsItem}>
            <p className={styles.vsItemLabel + ' ' + styles.vsGoodLabel}>Quant Partners</p>
            <p className={styles.vsItemText}><strong>S/ 6,000 una vez</strong> · El sistema es TUYO</p>
          </div>
        </div>

        <div className={styles.hint}>↓ Calcula tu retorno exacto abajo</div>

      </div>
    </section>
  );
}
