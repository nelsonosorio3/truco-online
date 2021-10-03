import React from 'react';
import styles from './styles/Comienzo.module.css'
import game from '../../img/game.webp'

function Comienzo() {
    

    const intro = 'En el “truco”, hay dos formas de jugarse los puntos: al envido y/o al truco_ Cada uno de estos te dara puntos dependiendo lo apostado en cada mano_ El objetivo del juego es llegar a los 15 o 30 puntos.'    
    
    return (
        <div className={styles.board}>
          <div className={styles.title}>
           <h3>{intro}</h3>
           </div>  
           <img src={game} className={styles.game}/>
        </div>
    )
}

export default Comienzo;