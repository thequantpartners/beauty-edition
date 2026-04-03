import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <p>Quant Partners Beauty Edition</p>
        <a href="mailto:partners@thequantpartners.com" className={styles.email}>
          partners@thequantpartners.com
        </a>
      </div>
    </footer>
  );
}
