import styles from './styles/App.module.css';
import logo from './assets/favicon.ico';

function Navbar() {
  return (
    <div class={styles.navbar}>
      <img src={logo} alt="Logo" className={styles.logo} />
      <h1 className={styles.title}>TBD</h1>
    </div>
  );
}

export default Navbar;
