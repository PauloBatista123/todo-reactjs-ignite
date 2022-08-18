import styles from './style.module.css';
import Logo from '../../assets/Logo.svg';

export function Header(){
  return(
    <div className={styles.container}>
      <img src={Logo} alt="logo todo" />
    </div>
  )
}