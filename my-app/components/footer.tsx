import Link from "next/link";
import styles from "../styles/footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <hr />
      <ul className={styles.navItems}>
        <li className={styles.navItem}>
          <a href="https://github.com/MSBivens/token-boards">GitHub</a>
        </li>
        <li className={styles.navItem}>
          <Link href="/index">
            <a>Home</a>
          </Link>
        </li>
        <li className={styles.navItem}>
          <em>Mike Bivens</em>
        </li>
      </ul>
    </footer>
  );
}
