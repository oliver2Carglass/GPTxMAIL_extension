document.addEventListener("DOMContentLoaded", function() {
    const btn = document.querySelector('button');
    btn.addEventListener('click',() =>{
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action: "A"});
        });
    })
});