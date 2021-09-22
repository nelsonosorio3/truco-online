import React , { useSelector }from 'react';
import { Link } from 'react-router-dom';

import Logo2 from '../img/Logo2.png'
import styles from './styles/NavBar.module.css'

export default function NavBar(){
     
    // const name = useSelector(state => state.user)
    let name =null;

    return(
        <div className={styles.mainDiv}>
            <nav className={styles.nav}>
                <img src={Logo2} alt="TrucoHenry" className={styles.logo2} />
                <Link to='/rooms' className={styles.a}>Lobbys</Link>
                <Link to='/ranking'className={styles.a}>Ranking</Link> 
                <Link to='/profile' className={styles.a}>My Profile</Link>
            </nav>
         </div>
    );
};
