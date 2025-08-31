const bar = document.getElementById("bar");
const close = document.getElementById("close");
const nav = document.getElementById("navbar");

if(bar){
    bar.addEventListener("click", () =>{
        nav.classList.add("active");
    })
}

if(close){
    close.addEventListener("click", () =>{
        nav.classList.remove("active");
    })
}

document.addEventListener("DOMContentLoaded", ()=> {
    const shopBtn = document.getElementById("shopBtn");
    if(shopBtn){
        shopBtn.addEventListener("click", async(event) =>{
        event.preventDefault();
        window.location.href = "shop.html";
        });
    }
});


