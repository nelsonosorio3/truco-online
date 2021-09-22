import React, { useState, useEffect } from 'react';
import styles from './styles/game.module.css';
import socket from './socket';



export default function Game() {
    const [player, setPlayer] = useState({
        name: "player",
        score: 0,
        hand: [],
        isTurn: false,
        turnNumber: 1,
        betOptions: [],
        tableRival: [],
        tablePlayer: [],
        bet: false,
        roundResults: [],
      });

      function roundCheckWinner(playerCard, rivalCard){
        console.log(playerCard)
        if(playerCard.truco < rivalCard.truco){
          setPlayer({...player, roundResults: [...player.roundResults, "win"]});
        }
        else if(playerCard.truco > rivalCard.truco){
          setPlayer({...player, roundResults: [...player.roundResults, "loss"]});
        }
        else{
          setPlayer({...player, roundResults: [...player.roundResults, "tie"]});
        }
      }
    const newRoundStarts = async () => {
      player.isTurn && socket.emit('newRoundStarts');
    }

    const bet = async (e) =>{
      player.isTurn && socket.emit("bet", e.target.name);
    }

    const playCard = async (card) =>{
      // if(!player.mesa1) setPlayer({...player, hand: player.hand.filter(cardH=> card.id !== cardH.id), mesa1: card});
      // else if (!player.mesa2) setPlayer({...player, hand: player.hand.filter(cardH=> card.id !== cardH.id), mesa2: card});
      if(player.isTurn){
      setPlayer({...player, hand: player.hand.filter(cardH=> card.id !== cardH.id), tablePlayer: [...player.tablePlayer, card]});
      socket.emit("playCard", card)
      console.log(card)}
    }

    const passTurn = () =>{
      socket.emit('passTurn');
    }

    const changeTurn = () =>{
      socket.emit("changeTurn");
    };
    
    const turnTwo = () =>{
      socket.emit("turnTwo");
    }

    
    useEffect(()=>{
        socket.on("newRoundStarts", hand=>{
          // console.log(hand)
          socket.emit('passTurn')
          setPlayer({...player, hand, tableRival: [], tablePlayer: [], roundResults: []});
        });
        socket.on("bet", betOptions=>{
          // console.log(betOptions);
          setPlayer({...player, betOptions});
          changeTurn();
        });
        socket.on("playCard", card=>{
          // console.log(card)
          setPlayer({...player, tableRival:  [...player.tableRival, card]});
          if(player.tableRival[0] && player.tablePlayer[0]) turnTwo();
          changeTurn();
        });
        socket.on("playerOrder", (isTurn)=>setPlayer({...player, isTurn}));
        return () =>{
          socket.off('newRoundStarts');
          socket.off("bet");
          socket.off("playCard");
          socket.off("playerOrder");
        };
      });

      useEffect(()=>{
        if(player.tablePlayer[0] && player.tableRival[0]){
          socket.on("checkWinnerHand", player.tablePlayer[0], player.tablePlayer[0])
          turnTwo();
        } 
        if(player.tablePlayer[0] && player.tableRival[0] && player.roundResults.length === 0) roundCheckWinner(player.tablePlayer[0], player.tableRival[0])
        if(player.tablePlayer[1] && player.tableRival[1] && player.roundResults.length === 1) roundCheckWinner(player.tablePlayer[1], player.tableRival[1])
        

      }, [player.tablePlayer, player.tableRival])

      useEffect(()=>{
        
      },[player.roundResults])
      console.log(player)
    return(<div>
            {/* <div className={styles.image}>  */}
            {/* </div> */}
            <button onClick={newRoundStarts}>New round Start</button>
            {player.betOptions?.map(betPick=><button onClick={bet} name={betPick} key={betPick} style = {{ padding: "30px" }}>{betPick}</button>)}<br/>
            {player.hand?.map(card => <div onClick={()=>playCard(card)}><h2>{card.suit}</h2><h2>{card.number}</h2></div>)}<br/>
            <div style ={{ display: "flex", flexDirection: "row" }}>
            <ol>{player.tableRival?.map(card => <li key={card.id}style = {{ display: "flex", flexDirection: "row" }}><h2>{card.suit}</h2><h2>{card.number}</h2></li>)}</ol>
            <ol>{player.tablePlayer?.map(card => <div key={card.id}style = {{ display: "flex", flexDirection: "row" }}><h2>{card.suit}</h2><h2>{card.number}</h2></div>)}</ol>
            </div>
            </div>
            
    );
};