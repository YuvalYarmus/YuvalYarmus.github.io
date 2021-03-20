"use strict";
// const form = document.getElementById("form") as HTMLElement;
// form.addEventListener("submit", (e) => {
//     e.preventDefault()
//     const page_string  = getURLParam("hopping") != null; 
//     if (page_string) {
//         let page :string = getURLParam("hopping")!;
//         alert(`page is ${page}`)
//     }
//     e.preventDefault()
// }); 
function getURLParam(paramName) {
    var params = new URLSearchParams(window.location.search);
    console.log(window.location.search);
    return params.get(paramName);
}
document.write("<h1 style=\"text-align: center\">" + getURLParam("hopping") + "</h1>");
setTimeout(redirect, 500);
function redirect() {
    console.log("in redirect");
    if (getURLParam("hopping") === null) {
        // var node= document.getElementById("html")!;
        // node.querySelectorAll('h1').forEach(n => n.remove());
        // document.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach(tag => tag.remove());
        // node.appendChild(document.createElement("<h1>Missing a param. Please go back to the previous page.</h1>")); 
        var error_message = "<h1 style=\"text-align: center\">Missing a param. Please go back to the previous page.</h1>";
        if (document.querySelector("h1"))
            document.querySelector("h1").innerHTML = error_message;
    }
    else {
        console.log("in redirect else statement");
        var page = "./loadPage.html";
        var pages = getURLParam("hopping");
        if (pages.toString().toLowerCase() === "a") {
        }
        else if (pages.toString().toLowerCase() === "b") {
        }
        else if (pages.toString().toLowerCase() === "c") {
        }
        else {
            window.location.replace(window.location.href + "/404");
        }
        var text = "\n        <form id=\"form\" class=\"form\" action=\"" + page + "\">\n            <input id=\"full_name\" placeholder=\"Plese enter your name\" name=\"full_name\" required>\n            <button type=\"submit\" class=\"btn\">Start the game!</button>\n        </form>\n        ";
        var node = document.getElementById("container2");
        var child = node.appendChild(document.createElement('div'));
        child.innerHTML = text;
    }
}
