import React, { useState, useEffect }  from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import styles from './styles/NavBar.module.css'

import logo from '../img/logo.png';
import profileIcon from '../img/profileIcon.png';

export default function NavBar() {

    const { user } = useSelector(state => state.logReducer);

    const [isAuth, setIsAuth] = useState(false); 

    useEffect(() => {
        const logged = window.localStorage.getItem("isAuth");
        if(logged) {
          setIsAuth(logged);
        };
    }, []);

    return(
        <nav className={styles.nav}>
            <Link to='/' className={styles.logo}>
                <img src={logo} alt="TrucoHenry" />
            </Link>
            <div className={styles.groupLinks}> 
                <Link to='/rooms' className={styles.links + ' ' + styles.rooms}>Lobbys</Link>
                {
                    isAuth ? 
                    <Link to='/ranking'className={styles.links + ' ' + styles.ranking}>Ranking</Link>
                    :
                    null
                }
            </div>
            <div className={styles.contProfile}>
                {
                    isAuth ? 
                    <Link to='/profile' className={styles.links}>
                        <img src={profileIcon} alt="profile picture" />
                        {`Hi, ${user}!`}
                    </Link>
                    :
                    null
                }
            </div>
        </nav>
    );
};