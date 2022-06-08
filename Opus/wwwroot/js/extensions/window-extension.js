// Make the DIV element draggable:
dragElement(document.getElementById("dragabble-window"));

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById("windowHeader")) {
        // if present, the header is where you move the DIV from:
        document.getElementById("windowHeader").onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        if ((elmnt.offsetTop - pos2) > 0 && (elmnt.offsetLeft - pos1) > 269) {
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }

    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;

    }
}

function toggleWindow() {
    $('body').css('overflow', 'visible');
    $('nav').css('display', 'block');
    $('')
    $('.main-window').toggle();
    $('#dragabble-window').css({ top: '1px', left: '40%', margin: '-' + ($('#dragabble-window').height() / 2) + 'px 0 0 -' + ($('#dragabble-window').width() / 2) + 'px' });
}
