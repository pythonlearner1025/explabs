import styles from './styles/App.module.css';
import logo from './assets/favicon.ico';

function Navbar() {
  //<img src={null} alt="Logo" className={styles.logo} />
  //<h4 className={styles.title}>Exp Labs</h4>
  // <div className={styles.navbar_status_header}>{"<|experimental|>"}</div>
  return (
    <div class={styles.navbar}>
      <div className={styles.navbar_div}></div>
      <div className={styles.navbar_status}>
      </div>
    </div>
  );
}

export default Navbar;
