chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === "A") {
        f1()
        
    }     
});



function f1() {

    

    if(document.getElementById(':50').value){
        Object = document.getElementById(':50').value
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

    Tu dois corriger et améliorer le mail suivant :
        - le mail doit etre formuler dans la langue du body et/ou de l'objet
        - si il n'y a pas d'objet, déduit le du corps
        - si il n'y a pas de corps propose en un a partir de l'objet
        - Précise "Objet :" avant de mettre l'objet et "Corps :" avant le corps

    L'objet :
    ${Object}


    Le corps du mail :
    ${Body}

    `;
    chatWithGPT(prompt)
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
            output_Body.innerText = final_Body; // Remplir le corps avec le texte extrait
        }
    })
    .catch(error => console.error("Error:", error));
}

async function chatWithGPT(prompt) {
    // const apiKey =  // You said you will handle this
    // I said you will handle this take you credit card and buy an API key
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
                max_tokens: 500,  // Adjust this based on the expected output length
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
