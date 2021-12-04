
function gradient(){
    return [...Array(16).keys()].map(i => i/16)
}

function random_values( event ){
    return [...Array(16).keys()].map(i => Math.random());
}

export {random_values , gradient}