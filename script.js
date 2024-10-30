let txt_msg = document.querySelector('#prompt')
let submitBtn = document.querySelector('#submit')
let user_chat_container = document.querySelector(".chat-container")
let user_chat_box = document.querySelector('.user-chat-box')
let image_btn = document.getElementById("image")
let image = document.getElementById("#inside_image")
let imageInput = document.querySelector("#image input")


const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyCEmBXVLniXWbDrskTqxw986l_jkjV3QYA'
// AIzaSyCEmBXVLniXWbDrskTqxw986l_jkjV3QYA

let user = {
    data : null,
    file:{
        mime_type:null,
        data:null
    }
}

async function generateResponse(aiChatBox) {
    let text = aiChatBox.querySelector(".ai-chat-area")
    try {
        let response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "contents": [{
                "parts":[{"text": user.data},(user.file.data?[{"inline_data":user.file}]:[])]
                }] // Simplified structure with "text"
            })
        });
          
        let data = await response.json();
        console.log(data)
        //user.data = data
        let apiResponse = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,"$1").trim()
        console.log(apiResponse)
        text.innerHTML = apiResponse

        } catch (error) {
            console.error(error);
            aiChatBox.innerHTML = "An error occurred. Please try again later.";
        }
        finally{            
            user_chat_container.scrollTo({top:user_chat_container.scrollHeight,behavior:"smooth"}) 
            let existingImg = document.querySelector(".prompt-area img.chosen-image");
            if (existingImg) {
                existingImg.remove();
            }   
            user.file={}
        }
    }




const createChatBox = (code , className) =>{
    let chatBox = document.createElement('div')
    chatBox.innerHTML = code
    // chatBox.className.add(className)
    chatBox.className = className
    return chatBox
}

// const 

const handleChatResponse = (text) =>{
    user.data=text
    let html = `
    <img src="https://www.pngarts.com/files/5/Avatar-Face-PNG-Image-Transparent.png" alt="" id="userImage" width="8%">
    <div class="user-chat-area">
        ${text}
        ${user.file.data?`<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseImg" />`:""}
    </div>
    `
    txt_msg.value = ""
    let userChatBox = createChatBox(html,"user-chat-box")
    user_chat_container.appendChild(userChatBox)
    user_chat_container.scrollTo({top:user_chat_container.scrollHeight,behavior:"smooth"})


    setTimeout(()=>{
        let html = `
        <img src="https://cdn4.iconfinder.com/data/icons/chatbot-robot-1/100/chatbot_01_01_03_bot_chat_robot_app_artificial_chatbot_dialog-1024.png" alt="" id="aiImage" width="10%">

        <div class="ai-chat-area">
                <img src="output-onlinegiftools.gif" alt="" width="100px" id="load">

        </div>`
        let aiChatBox = createChatBox(html,"ai-chat-box")
        user_chat_container.appendChild(aiChatBox)
        generateResponse(aiChatBox)
    },600)
}

txt_msg.addEventListener('keydown',(e)=>{
    if(e.key === 'Enter'){
        let msg = txt_msg.value.trim()
        handleChatResponse(msg)
    }
})


submitBtn.addEventListener('click',()=>{
    handleChatResponse(txt_msg.value)
})

// imageInput.addEventListener("change",()=>{
//     let file = imageInput.files[0]
//     if(!file) return
//     let reader = new FileReader()
//     reader.onload=(e)=>{
//         // let img = document.createElement('img')
//         let base64 = e.target.result.split(",")[1]
//         user.file={
//             mime_type:file.type,
//             data:base64
//         }
//         image.src = `data:${user.file.mime_type};base64,${user.file.data}`
//         image.classList.add("choose")
//     }
    
//     reader.readAsDataURL(file)
// })
document.addEventListener("DOMContentLoaded", () => {
    let imageInput = document.getElementById("imageInput"); // Selects the file input
    let promptArea = document.querySelector(".prompt-area"); // Selects the prompt area for appending image

    imageInput.addEventListener("change", () => {
        let file = imageInput.files[0];
        if (!file) return;

        let reader = new FileReader();
        reader.onload = (e) => {
            let base64 = e.target.result.split(",")[1];
            user.file = {
                mime_type: file.type,
                data: base64,
            };

            // Remove any existing image before adding a new one
            let existingImg = document.querySelector(".prompt-area img.chosen-image");
            if (existingImg) {
                existingImg.remove();
            }

            // Create a new image element and set the source
            let img = document.createElement("img");
            img.src = `data:${user.file.mime_type};base64,${user.file.data}`;
            img.classList.add("chosen-image"); // Class to style the chosen image if needed
            

            promptArea.appendChild(img); // Append the image to the prompt area
        };

        reader.readAsDataURL(file);
    });

    // To trigger file input click when the button is clicked
    document.getElementById("imageButton").addEventListener("click", () => {
        imageInput.click();
    });
});


image_btn.addEventListener('click',()=>{
    image_btn.querySelector("input").click()
})
