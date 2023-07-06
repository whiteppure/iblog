

function isMobileReq() {
    return /mobile/i.test(navigator.userAgent);
}


function isEmpty(obj){
    return obj === undefined || obj === null
}