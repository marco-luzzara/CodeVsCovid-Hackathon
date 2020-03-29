class BodyValidatorError extends Error {
    constructor(msg){
        super(msg);
    }
}

class BodyValidator {

    static validate(body, fields){

        if (fields == undefined || typeof fields !== 'object')
            throw new BodyValidatorError("Fields must be an object");

        if (body == undefined || typeof body !== 'object')
            throw new BodyValidatorError("Body must be an object");
        
        for (var key in fields){
            let type = fields[key];
            if (type!=='object' && type!='number' && type!='array' && type!='boolean' && type!='function' && type!='string')
                throw new BodyValidatorError("Fields object contains non valid types");

            if (body[key] == undefined || typeof body[key] !== type)
                throw new BodyValidatorError("Body object not valid");
        }
        
        return true;
    }
}

module.exports = {
    BodyValidator: BodyValidator,
    BodyValidatorError: BodyValidatorError
}