function flattenObject(obj) {
    let newObj = {};
    var props = Object.getOwnPropertyNames(obj);

    for(var key of props) {
        newObj[key] = obj[key];
    }

    return newObj;
}

module.exports = function(res, exc, handlerDescriptor){
    res.header('Content-Type', 'application/json');
    
    let exceptionMap = new Map();
    for (let [statusCode, errors] of Object.entries(handlerDescriptor)) {
        for (let error of errors) {
            exceptionMap.set(error, statusCode);
        }
    }
 
    let isExcFound = false;
    for (let [error, statusCode] of exceptionMap.entries()) {
        if (error !== null && exc instanceof error) {
            res.statusCode = statusCode;
            isExcFound = true;
            break;
        }
    }
    
    exc = JSON.stringify(flattenObject(exc));
    if (!isExcFound)
        res.statusCode = exceptionMap.get(null);

    res.end(exc);
}