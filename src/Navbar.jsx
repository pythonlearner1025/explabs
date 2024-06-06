import styles from './styles/App.module.css';
import logo from './assets/favicon.ico';

function Navbar() {
  //<img src={null} alt="Logo" className={styles.logo} />
  return (
    <div class={styles.navbar}>
      <h4 className={styles.title}>EigenLabs</h4>
      <div className={styles.navbar_div}></div>
      <div className={styles.navbar_status}>
       <div className={styles.navbar_status_header}>research preview</div>
      </div>
    </div>
  );
}

export default Navbar;
