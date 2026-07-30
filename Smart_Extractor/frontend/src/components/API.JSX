const API_URL = "https://smart-extractor-esws.onrender.com";


export async function extractText(text){

    const response = await fetch(
        `${API_URL}/extract`,
        {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                text:text
            })
        }
    );

    return response.json();
}