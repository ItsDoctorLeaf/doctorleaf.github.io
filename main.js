// IKR this is some pretty awesome code, i made it and is good init

// 0: Main, 1: Games, 2: Plugins, 3: Bots
const PAGE_MAIN = 0;
const PAGE_GAMES = 1;
const PAGE_PLUGINS = 2;
const PAGE_BOTS = 3;

let currentPage = 0;

// ---------------------------------------

let moveUp = false;
let moveDown = false;

let currentHeight = 0;

// ---------------------------------------

// Spawn settings for a star
const spawnInterval = .1;

// Lifetime
const starLifetime = 100;
const starSpinSpeed = 0.5;

// 0% Of the way through
const sizeAtStart = 10;

// 100% of the way through
const sizeAtDeath = 0;

// ---------------------------------------

const coloursForShapes = 
[
    // Default
    "rgb(63, 63, 77)",
    // Games
    "rgb(100, 255, 77)",
    // Plugins
    "rgb(100, 150, 255)",
    // Bots
    "rgb(255, 120, 77)"
]

const shapeScaleMultipliers = 
[
    // Default
    1,
    // Games
    2,
    // Plugins
    3,
    // Bots
    2
]

// ---------------------------------------

const topics = [document.querySelector("#games"),document.querySelector("#plugins"),document.querySelector("#bots")];

// ---------------------------------------

const canvas = document.querySelector("#backgroundElement");
const headBar = document.querySelector(".page");
const ctx = canvas.getContext("2d");

let countdownValue = 0;

// {currentTime:0,x:0,y:0, type:0}
let stars = []

function swapPage(targetPage)
{
    if (moveUp || moveDown) 
    {
        console.log("tried to move whilst still in transit");
        return;
    }
    if (currentPage === targetPage)
    {
        console.log("Attempted to switch to existing page");
        return;
    }
    
    if (targetPage === 0)
    {
        moveDown = true;
        moveUp = false;
        currentHeight = 70;
        console.log("moving down");
    }
    else if (currentPage === 0)
    {
        moveUp = true;
        moveDown = false;
        currentHeight = 0;
        console.log("moving up");
    }
    currentPage = targetPage;

    for (let i = 0; i < topics.length; i++)
    {
        if (i == currentPage-1)
        {
            topics[currentPage-1].style.display = "block";
            fadeUp(topics[currentPage-1].style,10)
        }
        else
        {
            topics[i].style.display = "none";
        }
    }


}

function generateStar()
{
    stars.push({currentTime: 0, x: Math.random() * canvas.width, y: Math.random() * canvas.height,type:currentPage});
}

function draw(e, scale)
{
    ctx.strokeStyle = coloursForShapes[e.type];
    scale *= shapeScaleMultipliers[e.type];
    switch (e.type)
    {
        case PAGE_MAIN:
            ctx.beginPath();
            ctx.arc(e.x,e.y,scale,0,360);
            ctx.stroke();
            break;
        case PAGE_GAMES:
            ctx.beginPath();
            ctx.strokeRect(e.x-(scale/2),e.y-(scale/2),scale,scale);
            ctx.stroke();
            break;
        case PAGE_PLUGINS:
            ctx.beginPath();
            ctx.moveTo(e.x-(scale/2),e.y);
            ctx.lineTo(e.x-(scale/2)+scale,e.y);
            ctx.stroke();
            break;
        case PAGE_BOTS:
            ctx.beginPath();
            ctx.moveTo(e.x,e.y);
            ctx.lineTo(e.x-scale,e.y);
            ctx.lineTo(e.x,e.y-scale);
            ctx.lineTo(e.x+scale,e.y);
            ctx.lineTo(e.x,e.y);
            ctx.stroke();
            break;
    }

}

function fadeUp(e,speedMultiplier)
{
    e.filter = "opacity(0%)"
    let increments = 0;
    const i = setInterval(()=>{
        increments++;
        e.filter = "opacity(" + increments + "%)";
        if (increments >= 100)
        {
            e.filter = "opacity(100%)"
            clearInterval(i);
        }
    },10/speedMultiplier)
}

function animate()
{
    window.requestAnimationFrame( animate );

    ctx.fillStyle = "rgb(27, 27, 31)";
    ctx.fillRect(0,0,canvas.width,canvas.height)

    if (moveDown)
    {
        currentHeight -= currentHeight * 0.1;
        if (currentHeight < 0.1)
        {
            currentHeight = 0;
            moveDown = false;
            moveUp = false;
        }
        headBar.style.bottom = currentHeight + "%";
    }
    else if (moveUp)
    {
        
        currentHeight += (70-currentHeight) * 0.1;
        if (currentHeight > 69.9)
        {
            currentHeight = 70;
            moveDown = false;
            moveUp = false;
        }
        headBar.style.bottom = currentHeight + "%";
    }

    if (stars.length != 0)
    {
        stars.forEach((e)=>{
            e.currentTime+= 1;

            // Percentage value of how much life a star has
            let lifetimeProgress = e.currentTime/starLifetime;

            let scale = (sizeAtDeath*lifetimeProgress) + (sizeAtStart * (1-lifetimeProgress));
            if (scale < 0)
            {
                stars.shift();
                return;
            }
            
            draw(e, scale);

            // Checks whether to destroy
            if (e.currentTime > starLifetime)
            {
                stars.shift();
            }
        });
    }

}

// Runs 10 times per second
function onTick()
{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    countdownValue -= 0.1;

    if (countdownValue <= 0)
    {
        // Spawn a star
        generateStar();
        if (stars.length >= 100)
        {
            return;
        }
        countdownValue = spawnInterval;
    }
}

const tickInterval = setInterval(onTick,100);
animate();
