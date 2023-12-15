let currentX = 0;
const speed = -.2;


let background = document.querySelector("body");
function animate()
{
    window.requestAnimationFrame(animate)
    currentX += speed;
    background.style.backgroundPositionX = currentX + "px";
}

animate()

