const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const audio = new Audio("./Assets/audio.mp3");

const score = document.querySelector(".score-value");
const finalScore = document.querySelector(".final-score > span");
const menu = document.querySelector(".menu-screen");
const buttonPlay = document.querySelector(".btn-play");

const size = 30;

const inicialPosition = { 
    x: 300,
    y: 300
}

let snake = [
    {x: 300, y:300},
]

let direction, loopId;

const incrementScore = () => {
    /* the plus sign is to convert the socre into a number, because its a string */
    score.innerText = +score.innerText + 10;
}

const randomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min)
}

const randomPosition = () => 
{
    const number = randomNumber(0, canvas.width - size);
    return Math.round(number/30) * 30;
}

const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: "orange"
}

const checkEat = () => 
{
    const head = snake[snake.length- 1]

    if(head.x == food.x && head.y == food.y)
    {
        audio.play();
        incrementScore();

        snake.push(head);

        let x = randomPosition();
        let y = randomPosition();

        /* verify if the food is generate abode the snake */ 
        while(snake.find((position)=>position.x == x && position.y == y))
        {
             x = randomPosition();
             y = randomPosition();
        }

        food.x= x;
        food.y= y;

    }
}

const drawFood = () => 
{
    const {x, y , color } = food;

    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 30;
    ctx.fillRect(food.x, food.y,size,size);
    ctx.shadowBlur = 0;

}

const drawGrid = () => {
    ctx.lineWidth = 1;
    ctx.strokeStyle = "red";

    for(let i = 30; i < canvas.width; i += 30)
    {   
        ctx.beginPath();
        ctx.lineTo(i,0);
        ctx.lineTo(i,canvas.height);
        ctx.stroke();
    
        ctx.beginPath();
        ctx.lineTo(0,i);
        ctx.lineTo(canvas.width,i);
        ctx.stroke();
    }
}

const drawSnake = () => {

    ctx.fillStyle = "#ddd";
    
    /* draw all the elements of the snake*/
    snake.forEach((position, index) =>
    {
        //last element has a different color
        if(index == snake.length-1)
        {
            ctx.fillStyle = "white";
        }

        ctx.fillRect(position.x,position.y,size,size);
    })
}

const moveSnake = () => {

    if(!direction) return;

    const head = snake.at(-1);

    //before move remove the first element
    snake.shift();

    if(direction == "right")
    {
        snake.push({x:head.x + size ,y: head.y})
    }
    
    if(direction == "left")
    {
        snake.push({x:head.x - size ,y: head.y})
    }
    
    if(direction == "up")
    {
        snake.push({x:head.x ,y: head.y - size})
    }
    
    if(direction == "down")
    {
        snake.push({x:head.x ,y: head.y + size })
    }
}

const checkColision = () => 
{
    const head = snake[snake.length-1];
    const canvasLimit = canvas.width - size;

    const wallColision = head.x < 0 || head.x > 570 || head.y < 0 || head.y > 570;

    const selfColision = snake.find((position, index)=>{

        if(index < snake.length - 2)
         return position.x == head.x && position.y == head.y;
    })
    
    if(wallColision || selfColision)
    {
       gameOver();
    }
}

const gameOver = () =>
{
    direction = undefined;
    menu.style.display = "flex";
    finalScore.innerText = score.innerText;
    canvas.style.filter = "blur(2px)";

}

const gameLoop = () => {
    clearInterval(loopId);

    /* clear the canvas */ 
    ctx.clearRect(0,0,600,600);

    drawGrid();
    moveSnake();
    drawSnake();
    drawFood();
    checkEat();
    checkColision()

    loopId = setInterval(() => {
        gameLoop();
    }, 300);
}

document.addEventListener("keydown", ({key}) => {
    
    if(key == "ArrowRight" && direction != "left")
        direction = "right";

    if(key == "ArrowLeft" && direction != "right")
        direction = "left";

    if(key == "ArrowDown" && direction != "up")
        direction = "down";

    if(key == "ArrowUp" && direction != "down")
        direction = "up";
})

buttonPlay.addEventListener("click", ()=>{
    score.innerText = "00";
    menu.style.display = "none";
    canvas.style.filter = "none";

    snake = [inicialPosition];
})

gameLoop();