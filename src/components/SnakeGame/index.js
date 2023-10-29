import React, { useState, useEffect, useCallback,memo } from 'react';
import Score from '../Score';
import './index.css';

let gameInterval;
const SnakeGame = () => {
  const [snake, setSnake] = useState([
    { x: 5, y: 5 },
    { x: 5, y: 6 },
    { x: 5, y: 7 },
    { x: 5, y: 8 },
    { x: 5, y: 9 },
  ]);
  const [food, setFood] = useState({ x: 10, y: 10 });
  const [direction, setDirection] = useState('RIGHT');
  const [score, setScore] = useState(0);
  const [start,setStart] = useState(false)
  const [highScore, setHighScore] = useState(localStorage.getItem('high-score') || 0);
  
  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          setDirection('UP');
          break;
        case 'ArrowDown':
          setDirection('DOWN');
          break;
        case 'ArrowLeft':
          setDirection('LEFT');
          break;
        case 'ArrowRight':
          setDirection('RIGHT');
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  const getRandomPosition = () => {
    return {
      x: Math.floor(Math.random() * 20),
      y: Math.floor(Math.random() * 20),
    };
  };

  const checkCollision = useCallback((head) => {
    if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20) {
      return true; 
    }

    for (let i = 1; i < snake.length; i++) {
      if (snake[i].x === head.x && snake[i].y === head.y) {
        return true; 
      }
    }

    return false;
  },[snake])

  const updateGame = useCallback(() => {
    const newSnake = [...snake];
    const head = { ...newSnake[0] };

    if (direction === 'UP') head.y--;
    if (direction === 'DOWN') head.y++;
    if (direction === 'LEFT') head.x--;
    if (direction === 'RIGHT') head.x++;

    if (head.x === food.x && head.y === food.y) {
      newSnake.unshift({ ...head });
      setFood(getRandomPosition());
      setScore(score + 1);
      if (score + 1 > highScore) {
        setHighScore(score + 1);
        localStorage.setItem('high-score', score + 1);
      }
    } else {
      newSnake.pop();
      if (checkCollision(head)) {
        clearInterval(gameInterval)
        setSnake([
          { x: 5, y: 5 },
          { x: 5, y: 6 },
          { x: 5, y: 7 },
          { x: 5, y: 8 },
          { x: 5, y: 9 },
        ]);
        window.location.reload()
        setDirection('RIGHT');
        setFood(getRandomPosition());
        setScore(0);
        setStart(false)
        alert('Game Over!');
      }
      newSnake.unshift({ ...head });
    }

    setSnake(newSnake);
  }, [direction, snake, food, score, highScore,checkCollision]);

  const timer = useCallback(()=>{
    if(snake.length <= 9){
      return 500;
    }else if(snake.length<=16){
      return 400;
    }else{
      return 300;
    }

  },[snake])

  useEffect(() => {
    if(start){
        gameInterval = setInterval(updateGame, timer());
        return () => clearInterval(gameInterval);
    }
  }, [start,updateGame,timer]);

  return (
    <center>
    <div  >
        <Score score={score} highScore={highScore}/>
      <div className="GameContainer">
        {Array(20)
          .fill(null)
          .map((_, row) =>
            Array(20)
              .fill(null)
              .map((_, col) => (
                <div
                  key={`${row}-${col}`}
                  className={
                    snake.some((part) => part.x === col && part.y === row)? 'Cell snake': food.x === col && food.y === row ? 'Cell food': 'Cell'
                  }
                />
              ))
          )}
      </div>
      <div className='buttons-container'>
        <button type='button' className='btn1' onClick={()=>setDirection("LEFT")} >&larr;</button>
        <button type='button' className='btn2' onClick={()=>setDirection("UP")}>&uarr;</button>
        <button type='button' className='btn3' onClick={()=>setDirection("DOWN")}>&darr;</button>
        <button type='button' className='btn4' onClick={()=>setDirection("RIGHT")}>&rarr;</button>
      </div>
     
      <button type='button'disabled={start === true} className='btn' onClick={()=>setStart(true)}>Start Game</button>
      <p className='para'>Gopi jami</p>
    </div>
    </center>
  );
};

export default memo(SnakeGame);

