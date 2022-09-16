"use strict"; zoom(); function zoom(classNames = {}, settings = {}) {
    var C_scaleDefault = settings["scaleDefault"] || 2; var C_scaleDifference = settings["scaleDifference"] || 0.5; var C_scaleMax = settings["scaleMax"] || 10; var C_scaleMin = settings["scaleMin"] || 1; var _active = classNames["active"] || "active"; var _dataScale = "data-scale"; var _dataTranslateX = "data-translate-x"; var _dataTranslateY = "data-translate-y"; var _visible = classNames["visible"] || "visible"; var $container; var $element; var $zoom = document.getElementsByClassName(classNames["zoom"] || "zoom"); var capture = false; var doubleClickMonitor = [null]; var containerHeight; var containerWidth; var containerOffsetX; var containerOffsetY; var initialScale; var elementHeight; var elementWidth; var heightDifference; var initialOffsetX; var initialOffsetY; var initialPinchDistance; var initialPointerOffsetX; var initialPointerOffsetX2; var initialPointerOffsetY; var initialPointerOffsetY2; var limitOffsetX; var limitOffsetY; var mousemoveCount = 0; var offset; var pinchOffsetX; var pinchOffsetY; var pointerOffsetX; var pointerOffsetX2; var pointerOffsetY; var pointerOffsetY2; var scaleDirection; var scaleDifference; var targetOffsetX; var targetOffsetY; var targetPinchDistance; var targetScale; var touchable = false; var touchCount; var touchmoveCount = 0; var doubleTapMonitor = [null]; var widthDifference; for (var i = 0; i < $zoom.length; i++) { $container = $zoom[i]; $element = $container.children[0]; $element.setAttribute(_dataScale, 1); $element.setAttribute(_dataTranslateX, 0); $element.setAttribute(_dataTranslateY, 0); }
    window.addEventListener("load", function () {
        for (var i = 0; i < $zoom.length; i++) { $container = $zoom[i]; $element = $container.children[0]; addClass($element, _visible); }
        window.addEventListener("resize", function () {
            for (var i = 0; i < $zoom.length; i++) {
                $container = $zoom[i]; $element = $container.children[0]; if (hasClass($container, _active) === false) { continue; }
                containerHeight = $container.clientHeight; containerWidth = $container.clientWidth; elementHeight = $element.clientHeight; elementWidth = $element.clientWidth; initialOffsetX = parseFloat($element.getAttribute(_dataTranslateX)); initialOffsetY = parseFloat($element.getAttribute(_dataTranslateY)); targetScale = C_scaleDefault; limitOffsetX = ((elementWidth * targetScale) - containerWidth) / 2; limitOffsetY = ((elementHeight * targetScale) - containerHeight) / 2; targetOffsetX = (elementWidth * targetScale) > containerWidth ? minMax(initialOffsetX, limitOffsetX * (-1), limitOffsetX) : 0; targetOffsetY = (elementHeight * targetScale) > containerHeight ? minMax(initialOffsetY, limitOffsetY * (-1), limitOffsetY) : 0; if (targetScale === 1) { removeClass($container, _active); }
                $element.setAttribute(_dataScale, targetScale); $element.setAttribute(_dataTranslateX, targetOffsetX); $element.setAttribute(_dataTranslateY, targetOffsetY); moveScaleElement($element, targetOffsetX + "px", targetOffsetY + "px", targetScale);
            }
        });
    }); massAddEventListener($zoom, "mousedown", mouseDown); massAddEventListener($zoom, "mouseenter", mouseEnter); massAddEventListener($zoom, "mouseleave", mouseLeave); document.addEventListener("mousemove", mouseMove); document.addEventListener("mouseup", mouseUp); document.addEventListener("touchstart", function () { touchable = true; }); massAddEventListener($zoom, "touchstart", touchStart); document.addEventListener("touchmove", touchMove); document.addEventListener("touchend", touchEnd); massAddEventListener($zoom, "wheel", wheel); function mouseEnter() { disableScroll(); }
    function mouseLeave() { enableScroll(); }
    function mouseDown(e) {
        e.preventDefault(); if (touchable === true || e.which !== 1) { return false; }
        $container = this; $element = this.children[0]; initialPointerOffsetX = e.clientX; initialPointerOffsetY = e.clientY; if (doubleClickMonitor[0] === null) {
            doubleClickMonitor[0] = e.target; doubleClickMonitor[1] = initialPointerOffsetX; doubleClickMonitor[2] = initialPointerOffsetY; setTimeout(function () { doubleClickMonitor = [null]; }, 400);
        }
        else if (doubleClickMonitor[0] === e.target && mousemoveCount <= 5 && isWithinRange(initialPointerOffsetX, doubleClickMonitor[1] - 10, doubleClickMonitor[1] + 10) === true && isWithinRange(initialPointerOffsetY, doubleClickMonitor[2] - 10, doubleClickMonitor[2] + 10) === true) {
            if (hasClass($container, _active) === true) { $element.setAttribute(_dataScale, 1); $element.setAttribute(_dataTranslateX, 0); $element.setAttribute(_dataTranslateY, 0); removeClass($container, _active); moveScaleElement($element, 0, 0, 1); }
            else { $element.setAttribute(_dataScale, C_scaleDefault); $element.setAttribute(_dataTranslateX, 0); $element.setAttribute(_dataTranslateY, 0); addClass($container, _active); moveScaleElement($element, 0, 0, C_scaleDefault); }
            doubleClickMonitor = [null]; return false;
        }
        containerOffsetX = $container.offsetLeft; containerOffsetY = $container.offsetTop; containerHeight = $container.clientHeight; containerWidth = $container.clientWidth
        elementHeight = $element.clientHeight; elementWidth = $element.clientWidth; initialOffsetX = parseFloat($element.getAttribute(_dataTranslateX)); initialOffsetY = parseFloat($element.getAttribute(_dataTranslateY)); initialScale = minMax(parseFloat($element.getAttribute(_dataScale)), C_scaleMin, C_scaleMax); mousemoveCount = 0; capture = true;
    }
    function mouseMove(e) {
        if (touchable === true || capture === false) { return false; }
        pointerOffsetX = e.clientX; pointerOffsetY = e.clientY; targetScale = initialScale; limitOffsetX = ((elementWidth * targetScale) - containerWidth) / 2; limitOffsetY = ((elementHeight * targetScale) - containerHeight) / 2; targetOffsetX = (elementWidth * targetScale) <= containerWidth ? 0 : minMax(pointerOffsetX - (initialPointerOffsetX - initialOffsetX), limitOffsetX * (-1), limitOffsetX); targetOffsetY = (elementHeight * targetScale) <= containerHeight ? 0 : minMax(pointerOffsetY - (initialPointerOffsetY - initialOffsetY), limitOffsetY * (-1), limitOffsetY); mousemoveCount++; if (Math.abs(targetOffsetX) === Math.abs(limitOffsetX)) { initialOffsetX = targetOffsetX; initialPointerOffsetX = pointerOffsetX; }
        if (Math.abs(targetOffsetY) === Math.abs(limitOffsetY)) { initialOffsetY = targetOffsetY; initialPointerOffsetY = pointerOffsetY; }
        $element.setAttribute(_dataScale, targetScale); $element.setAttribute(_dataTranslateX, targetOffsetX); $element.setAttribute(_dataTranslateY, targetOffsetY); moveScaleElement($element, targetOffsetX + "px", targetOffsetY + "px", targetScale);
    }
    function mouseUp() {
        if (touchable === true || capture === false) { return false; }
        capture = false;
    }
    function touchStart(e) {
        e.preventDefault(); if (e.touches.length > 2) { return false; }
        $container = this; $element = this.children[0]; containerOffsetX = $container.offsetLeft; containerOffsetY = $container.offsetTop; containerHeight = $container.clientHeight; containerWidth = $container.clientWidth; elementHeight = $element.clientHeight; elementWidth = $element.clientWidth; initialPointerOffsetX = e.touches[0].clientX; initialPointerOffsetY = e.touches[0].clientY; initialScale = minMax(parseFloat($element.getAttribute(_dataScale)), C_scaleMin, C_scaleMax); touchCount = e.touches.length; if (touchCount === 1) {
            if (doubleTapMonitor[0] === null) {
                doubleTapMonitor[0] = e.target; doubleTapMonitor[1] = initialPointerOffsetX; doubleTapMonitor[2] = initialPointerOffsetY; setTimeout(function () { doubleTapMonitor = [null]; }, 400);
            }
            else if (doubleTapMonitor[0] === e.target && touchmoveCount <= 5 && isWithinRange(initialPointerOffsetX, doubleTapMonitor[1] - 30, doubleTapMonitor[1] + 30) === true && isWithinRange(initialPointerOffsetY, doubleTapMonitor[2] - 30, doubleTapMonitor[2] + 25) === true) {
                if (hasClass($container, _active) === true) { $element.setAttribute(_dataScale, 1); $element.setAttribute(_dataTranslateX, 0); $element.setAttribute(_dataTranslateY, 0); removeClass($container, _active); moveScaleElement($element, 0, 0, 1); }
                else { $element.setAttribute(_dataScale, C_scaleDefault); $element.setAttribute(_dataTranslateX, 0); $element.setAttribute(_dataTranslateY, 0); addClass($container, _active); moveScaleElement($element, 0, 0, C_scaleDefault); }
                doubleTapMonitor = [null]; return false;
            }
            initialOffsetX = parseFloat($element.getAttribute(_dataTranslateX)); initialOffsetY = parseFloat($element.getAttribute(_dataTranslateY));
        }
        else if (touchCount === 2) { initialOffsetX = parseFloat($element.getAttribute(_dataTranslateX)); initialOffsetY = parseFloat($element.getAttribute(_dataTranslateY)); initialPointerOffsetX2 = e.touches[1].clientX; initialPointerOffsetY2 = e.touches[1].clientY; pinchOffsetX = (initialPointerOffsetX + initialPointerOffsetX2) / 2; pinchOffsetY = (initialPointerOffsetY + initialPointerOffsetY2) / 2; initialPinchDistance = Math.sqrt(((initialPointerOffsetX - initialPointerOffsetX2) * (initialPointerOffsetX - initialPointerOffsetX2)) + ((initialPointerOffsetY - initialPointerOffsetY2) * (initialPointerOffsetY - initialPointerOffsetY2))); }
        touchmoveCount = 0; capture = true;
    }
    function touchMove(e) {
        e.preventDefault(); if (capture === false) { return false; }
        pointerOffsetX = e.touches[0].clientX; pointerOffsetY = e.touches[0].clientY; touchCount = e.touches.length; touchmoveCount++; if (touchCount > 1) {
            pointerOffsetX2 = e.touches[1].clientX; pointerOffsetY2 = e.touches[1].clientY; targetPinchDistance = Math.sqrt(((pointerOffsetX - pointerOffsetX2) * (pointerOffsetX - pointerOffsetX2)) + ((pointerOffsetY - pointerOffsetY2) * (pointerOffsetY - pointerOffsetY2))); if (initialPinchDistance === null) { initialPinchDistance = targetPinchDistance; }
            if (Math.abs(initialPinchDistance - targetPinchDistance) >= 1) {
                targetScale = minMax(targetPinchDistance / initialPinchDistance * initialScale, C_scaleMin, C_scaleMax); limitOffsetX = ((elementWidth * targetScale) - containerWidth) / 2; limitOffsetY = ((elementHeight * targetScale) - containerHeight) / 2; scaleDifference = targetScale - initialScale; targetOffsetX = (elementWidth * targetScale) <= containerWidth ? 0 : minMax(initialOffsetX - ((((((pinchOffsetX - containerOffsetX) - (containerWidth / 2)) - initialOffsetX) / (targetScale - scaleDifference))) * scaleDifference), limitOffsetX * (-1), limitOffsetX); targetOffsetY = (elementHeight * targetScale) <= containerHeight ? 0 : minMax(initialOffsetY - ((((((pinchOffsetY - containerOffsetY) - (containerHeight / 2)) - initialOffsetY) / (targetScale - scaleDifference))) * scaleDifference), limitOffsetY * (-1), limitOffsetY); if (targetScale > 1) { addClass($container, _active); }
                else { removeClass($container, _active); }
                moveScaleElement($element, targetOffsetX + "px", targetOffsetY + "px", targetScale); initialPinchDistance = targetPinchDistance; initialScale = targetScale; initialOffsetX = targetOffsetX; initialOffsetY = targetOffsetY;
            }
        }
        else {
            targetScale = initialScale; limitOffsetX = ((elementWidth * targetScale) - containerWidth) / 2; limitOffsetY = ((elementHeight * targetScale) - containerHeight) / 2; targetOffsetX = (elementWidth * targetScale) <= containerWidth ? 0 : minMax(pointerOffsetX - (initialPointerOffsetX - initialOffsetX), limitOffsetX * (-1), limitOffsetX); targetOffsetY = (elementHeight * targetScale) <= containerHeight ? 0 : minMax(pointerOffsetY - (initialPointerOffsetY - initialOffsetY), limitOffsetY * (-1), limitOffsetY); if (Math.abs(targetOffsetX) === Math.abs(limitOffsetX)) { initialOffsetX = targetOffsetX; initialPointerOffsetX = pointerOffsetX; }
            if (Math.abs(targetOffsetY) === Math.abs(limitOffsetY)) { initialOffsetY = targetOffsetY; initialPointerOffsetY = pointerOffsetY; }
            $element.setAttribute(_dataScale, initialScale); $element.setAttribute(_dataTranslateX, targetOffsetX); $element.setAttribute(_dataTranslateY, targetOffsetY); moveScaleElement($element, targetOffsetX + "px", targetOffsetY + "px", targetScale);
        }
    }
    function touchEnd(e) {
        touchCount = e.touches.length; if (capture === false) { return false; }
        if (touchCount === 0) { $element.setAttribute(_dataScale, initialScale); $element.setAttribute(_dataTranslateX, targetOffsetX); $element.setAttribute(_dataTranslateY, targetOffsetY); initialPinchDistance = null; capture = false; }
        else if (touchCount === 1) { initialPointerOffsetX = e.touches[0].clientX; initialPointerOffsetY = e.touches[0].clientY; }
        else if (touchCount > 1) { initialPinchDistance = null; }
    }
    function wheel(e) {
        $container = this; $element = this.children[0]; offset = $container.getBoundingClientRect(); containerHeight = $container.clientHeight; containerWidth = $container.clientWidth; elementHeight = $element.clientHeight; elementWidth = $element.clientWidth; containerOffsetX = offset.left; containerOffsetY = offset.top; initialScale = minMax(parseFloat($element.getAttribute(_dataScale), C_scaleMin, C_scaleMax)); initialOffsetX = parseFloat($element.getAttribute(_dataTranslateX)); initialOffsetY = parseFloat($element.getAttribute(_dataTranslateY)); pointerOffsetX = e.clientX; pointerOffsetY = e.clientY; scaleDirection = e.deltaY < 0 ? 1 : -1; scaleDifference = C_scaleDifference * scaleDirection; targetScale = initialScale + scaleDifference; if (targetScale < C_scaleMin || targetScale > C_scaleMax) { return false; }
        limitOffsetX = ((elementWidth * targetScale) - containerWidth) / 2; limitOffsetY = ((elementHeight * targetScale) - containerHeight) / 2; if (targetScale <= 1) { targetOffsetX = 0; targetOffsetY = 0; }
        else { targetOffsetX = (elementWidth * targetScale) <= containerWidth ? 0 : minMax(initialOffsetX - ((((((pointerOffsetX - containerOffsetX) - (containerWidth / 2)) - initialOffsetX) / (targetScale - scaleDifference))) * scaleDifference), limitOffsetX * (-1), limitOffsetX); targetOffsetY = (elementHeight * targetScale) <= containerHeight ? 0 : minMax(initialOffsetY - ((((((pointerOffsetY - containerOffsetY) - (containerHeight / 2)) - initialOffsetY) / (targetScale - scaleDifference))) * scaleDifference), limitOffsetY * (-1), limitOffsetY); }
        if (targetScale > 1) { addClass($container, _active); }
        else { removeClass($container, _active); }
        $element.setAttribute(_dataScale, targetScale); $element.setAttribute(_dataTranslateX, targetOffsetX); $element.setAttribute(_dataTranslateY, targetOffsetY); moveScaleElement($element, targetOffsetX + "px", targetOffsetY + "px", targetScale);
    }
}
function addClass($element, targetClass) {
    if (hasClass($element, targetClass) === false) { $element.className += " " + targetClass; }
}
function disableScroll() {
    if (window.addEventListener) { window.addEventListener('DOMMouseScroll', preventDefault, false); }
    window.onwheel = preventDefault; window.onmousewheel = document.onmousewheel = preventDefault; window.ontouchmove = preventDefault; document.onkeydown = preventDefaultForScrollKeys;
}
function enableScroll() {
    if (window.removeEventListener) { window.removeEventListener('DOMMouseScroll', preventDefault, false); }
    window.onmousewheel = document.onmousewheel = null; window.onwheel = null; window.ontouchmove = null; document.onkeydown = null;
}
function isWithinRange(value, min, max) {
    if (value >= min && value <= max) { return true; }
    else { return false; }
}
function hasClass($element, targetClass) {
    var rgx = new RegExp("(?:^|\\s)" + targetClass + "(?!\\S)", "g"); if ($element.className.match(rgx)) { return true; }
    else { return false; }
}
function massAddEventListener($elements, event, customFunction, useCapture) {
    var useCapture = useCapture || false; for (var i = 0; i < $elements.length; i++) { $elements[i].addEventListener(event, customFunction, useCapture); }
}
function minMax(value, min, max) {
    if (value < min) { value = min; }
    else if (value > max) { value = max; }
    return value;
}
function moveScaleElement($element, targetOffsetX, targetOffsetY, targetScale) { $element.style.cssText = "-moz-transform : translate(" + targetOffsetX + ", " + targetOffsetY + ") scale(" + targetScale + "); -ms-transform : translate(" + targetOffsetX + ", " + targetOffsetY + ") scale(" + targetScale + "); -o-transform : translate(" + targetOffsetX + ", " + targetOffsetY + ") scale(" + targetScale + "); -webkit-transform : translate(" + targetOffsetX + ", " + targetOffsetY + ") scale(" + targetScale + "); transform : translate3d(" + targetOffsetX + ", " + targetOffsetY + ", 0) scale3d(" + targetScale + ", " + targetScale + ", 1);"; }
function preventDefault(e) {
    e = e || window.event; if (e.preventDefault) { e.preventDefault(); }
    e.returnValue = false;
}
function preventDefaultForScrollKeys(e) {
    var keys = { 37: 1, 38: 1, 39: 1, 40: 1 }; if (keys[e.keyCode]) { preventDefault(e); return false; }
}
function removeClass($element, targetClass) { var rgx = new RegExp("(?:^|\\s)" + targetClass + "(?!\\S)", "g"); $element.className = $element.className.replace(rgx, ""); }