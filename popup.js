document.addEventListener("DOMContentLoaded", function() {

    apibtn=document.getElementById('apibtn')
    namebtn=document.getElementById('namebtn')
    
    
    const btn = document.querySelector('#btn');
    



    btn.addEventListener('click',() =>{
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action: "A"});
        });
    })

});

// Récupérer la clé API et mettre à jour le placeholder
getApiKey(function(apiKey) {
    if (apiKey) {
        apiInput = document.getElementById("api");
        apiInput.placeholder = apiKey; // Mettre à jour le placeholder pour la clé API
    } 
});

// Récupérer le nom complet et mettre à jour le placeholder (ajoute cette partie)
getFullName(function(fullName) {
    if (fullName) {
        nameInput = document.getElementById("name")
        nameInput.placeholder = fullName; // Mettre à jour le placeholder pour le nom
    }
});

apibtn.addEventListener("click", function(){
    apiKey = document.getElementById('api').value
    saveApiKey(apiKey)
    // getApiKey(function(apiKey) {
    //     const receiver = apiKey; // `receiver` contient maintenant la clé récupérée
    //     alert(receiver); // Affiche la clé récupérée
    // });
    })
namebtn.addEventListener("click", function(){
    fullName = document.getElementById('name').value
    saveFullName(fullName);
})


function saveApiKey(apiKey) {
    chrome.storage.sync.set({ apiKey: apiKey }, function() {
        console.log('API Key saved.',apiKey);
    });
}
function getApiKey(callback) {
    chrome.storage.sync.get(['apiKey'], function(result) {
        callback(result.apiKey);
    });
}

// Fonction pour récupérer le nom complet
function getFullName(callback) {
    chrome.storage.sync.get(['Name'], function(result) {
        callback(result.Name);
    });
}

function saveFullName(fullName) {
    chrome.storage.sync.set({ Name: fullName }, function() {
        console.log('Full name saved:', fullName);
    });
}
