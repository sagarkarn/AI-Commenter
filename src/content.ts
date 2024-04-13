import { Actions } from "./enums/Actions";
import { Selector } from "./enums/Selector";

/* eslint-disable no-undef */
let selectedElement: HTMLElement = null;
function addEventListener() {
    document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const parent = target.parentElement;
        if (parent.classList.contains(Selector.COMMENT_BOX_CLASS)) {
            const card = target.closest('.' + Selector.POST_CARD_CLASS)
            const seeMoreButton = card?.querySelector('.' + Selector.SEE_MORE_BUTTON_CLASS) as HTMLElement
            seeMoreButton?.click()
            
            const descriptionElement = card?.querySelector('.' + Selector.DESCRIPTION_CLASS) as HTMLElement
            const description = descriptionElement?.innerText
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            selectedElement = e.target as HTMLElement;
            createDiv(e, () => { 
                chrome.runtime.sendMessage({ action: 'description', description: description });
            }, () => { 
                selectedElement = null;
              });
        }
    });
}

function onCommentReceive(request: any) {
    const comment = request.comment;
    selectedElement.innerText = comment;
    console.log('content.js sending response', comment);
}

function createDiv(event: MouseEvent, confirmCallback: () => void, cancelCallback: () => void) {
    
    if (document.getElementById("ai-commenter-confirmation-box-container") !== null) {
        document.getElementById("ai-commenter-confirmation-box-container").remove();
    }

    let container = document.createElement("div");
    container.id = "ai-commenter-confirmation-box-container"; 
    let btnConfirm = document.createElement("button");
    btnConfirm.id = "ai-commenter-confirmation-box-confirm-btn-1";
    btnConfirm.innerText = "Confirm";
    btnConfirm.style.backgroundColor = "green";
    btnConfirm.style.color = "white";
    btnConfirm.style.padding = "10px";
    btnConfirm.style.margin = "10px";
    btnConfirm.style.border = "none";
    btnConfirm.style.cursor = "pointer";
    btnConfirm.style.borderRadius = "5px";
    btnConfirm.onclick = () => {
        confirmCallback();
        container.remove();
    }

    let btnCancel = document.createElement("button");
    btnCancel.id = "ai-commenter-confirmation-box-confirm-btn-2";
    btnCancel.innerText = "Cancel";
    btnCancel.style.backgroundColor = "red";
    btnCancel.style.color = "white";
    btnCancel.style.padding = "10px";
    btnCancel.style.margin = "10px";
    btnCancel.style.border = "none";
    btnCancel.style.cursor = "pointer";
    btnCancel.style.borderRadius = "5px";
    btnCancel.onclick = () => {
        cancelCallback();
        container.remove();
    }

    container.appendChild(btnConfirm);
    container.appendChild(btnCancel);
    
    document.body.appendChild(container); // Your existing code

    // get the coordinates of the mouse
    let x = event.clientX;     // get the horizontal coordinate
    let y = event.clientY;   // get the vertical coordinate

    // position container using the coordinates
    container.style.position = "fixed"; // fixes el relative to page. Could use absolute.
    container.style.left = x + "px";
    container.style.top = y + "px";
    container.style.zIndex = "1000";
    container.style.backgroundColor = "white";
    container.style.border = "1px solid black";
    container.style.padding = "10px";
    container.style.fontSize = "16px";
    container.style.fontFamily = "Arial";
    container.style.color = "black";
    container.style.textAlign = "left";
    container.style.overflow = "hidden";
}

(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        console.log('content.js received message', request);
        if (request.action === Actions.START) {
            addEventListener();
        }
        if (request.action === Actions.COMMENT) {
            console.log('content.js received comment', request.comment);
            
            onCommentReceive(request);
        }
    })
})()
