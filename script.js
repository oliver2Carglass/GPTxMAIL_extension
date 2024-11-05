chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    
    if (message.action === "A") {
        let userFullName = "[name]"; // Déclare une variable en dehors de la fonction pour stocker le nom complet

        getFullName(function(fullName) {
            if (fullName) {
                userFullName = fullName; // Assigner la valeur à la variable externe
                console.log("fn",userFullName)
            }
            getApiKey(function(apiKey) {
                var receiver = apiKey; // `receiver` contient maintenant la clé récupérée
                f1(receiver,userFullName)
                console.log("fn",userFullName)
            });
       
        });
        
        
        
    }     
});


function f1(apiKey,id) {
    if (!apiKey){
        alert("please enter an openAI api key")
    }
    console.log("apikey :",apiKey); // Affiche la clé récupérée
    if(document.querySelector('input[name="subjectbox"]').value){
        Object = document.querySelector('input[name="subjectbox"]').value

    }
    else{
        Object = "Il n'y a pas d'objet"
    }

    const BodyP = document.getElementById(':6a');
    if (BodyP && BodyP.children.length > 0 && BodyP.children[0].textContent.trim() !== ""){
        Body = "";
        Array.from(BodyP.children).forEach(child => {
            Body += child.textContent;
        });
    } else {
        Body = "Il n'y a pas de corps pour ce mail";

    


    }
    //si non (BodyP && BodyP.children.length > 0) et non (document.getElementById(':50').value)
    if(!document.getElementById(':50').value && (!BodyP.children[0].textContent.trim() !== "")){
        alert("pas trouvé ton bail zebi")
        return
    }

    console.log("body :" + Body + "Object" + Object)
    console.log("istrue", (BodyP && BodyP.children.length > 0 && BodyP.children[0].textContent.trim() !== ""))
    
    const prompt = `

    Tâche : Correction et reformulation de mail

    Instructions :

    Tu dois corriger et améliorer le mail avec les conditions suivantes :
        - le mail doit etre formuler dans la langue du body et/ou de l'objet
        - si il n'y a pas d'objet, déduit le du corps
        - si il n'y a pas de corps propose en un a partir de l'objet
        - Précise "Objet :" avant de mettre l'objet et "Corps :" avant le corps
        - Les # sont des commentaire contenant informations ou instructions que tu devras prendre en compte la rédaction du mail

    L'objet :
    ${Object}


    Le corps du mail :
    ${Body}

    ${id}
    `;
    chatWithGPT(prompt,apiKey)
    .then(response => {
        // Regex pour capturer l'objet jusqu'au mot "Corps :"
        const objectPattern = /Objet\s*:\s*([\s\S]*?)\n\s*Corps\s*:/;

        // Regex pour capturer le corps à partir de "Corps :" jusqu'à la fin
        const bodyPattern = /Corps\s*:\s*([\s\S]*)/;

        // Extraire l'objet
        const objectMatch = response.match(objectPattern);
        var final_Object = objectMatch ? objectMatch[1].trim() : "Objet non trouvé";

        // Extraire le corps
        const bodyMatch = response.match(bodyPattern);
        var final_Body = bodyMatch ? bodyMatch[1].trim() : "Corps non trouvé";

        // Affichage des résultats
        console.log("Objet :", final_Object);
        console.log("Corps :", final_Body);

        // Mettre à jour les éléments dans le DOM
        const output_Body = document.getElementById(':6a');
        const output_Object = document.getElementById(':50');

        // Assigner les valeurs extraites aux éléments DOM
        if (output_Object) {
            output_Object.value = final_Object; // Remplir le champ de l'objet avec le texte extrait
        }

        if (output_Body) {
            output_Body.children[0].innerText = final_Body; // Remplir le corps avec le texte extrait
        }
    })
    .catch(error => console.error("Error:", error));
}

async function chatWithGPT(prompt,apiKey) {
    // const apiKey =  // You said you will handle this
    const apiUrl = 'https://api.openai.com/v1/chat/completions';

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',  // Keeping it as gpt-3.5-turbo unless 16k is necessary
                messages: [
                    { role: 'system', content: 'You are a helpful assistant.' },
                    { role: 'user', content: prompt },
                ],
                max_tokens: 2000,  // Adjust this based on the expected output length
                temperature: 0.7, // Adjust this to control the creativity level
            }),
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        const responseData = await response.json();
        return responseData.choices[0].message.content.trim();
        
    } catch (error) {
        console.error('Error communicating with GPT API:', error);
        throw error;  // Rethrow the error so the caller knows something went wrong
    }
}


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