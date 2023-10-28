import React from "react";
import './index.css'
const Score = ({score,highScore})=>{
    return(
        <div className="GameDetails">
        <span className="Score">Score: {score}</span>
        <span className="HighScore">High Score: {highScore}</span>
      </div>
    )
}

export default Score;