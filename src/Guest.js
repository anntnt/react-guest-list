import styles from './Guest.module.css';

export default function Guest(firstName, lastName) {
  return (
    <div className={styles.guest}>
      <div className={styles.firstName}>{firstName}</div>
      <div className={styles.lastName}>{lastName}</div>
    </div>
  );
}
