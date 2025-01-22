
// Toggle the left menu on button click
document.getElementById("menu-toggle").addEventListener("click", function() {
    const menu = document.getElementById("left-menu");
    menu.classList.toggle("collapsed");
});

// Function to shrink the page based on screen width
function adjustPageSize() {
    const width = window.innerWidth;

    if (width >= 992 && width <= 1600) {
        document.body.style.transform = "scale(0.9)";
        document.body.style.transformOrigin = "top left";
    } else if (width >= 700 && width <= 767) {
        document.body.style.transform = "scale(0.8)";
        document.body.style.transformOrigin = "top left";
    } else if (width >= 600 && width <= 700) {
        document.body.style.transform = "scale(0.75)";
        document.body.style.transformOrigin = "top left";
    } else if (width <= 600) {
        document.body.style.transform = "scale(0.5)";
        document.body.style.transformOrigin = "top left";
    } else {
        document.body.style.transform = "scale(1)";
    }
}

// Adjust page size on load and window resize
window.addEventListener("load", adjustPageSize);
window.addEventListener("resize", adjustPageSize);
