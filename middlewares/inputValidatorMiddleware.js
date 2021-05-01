const nodeInputValidator = require('node-input-validator');

nodeInputValidator.extendMessages({
    required: 'The :attribute field must not be empty.',
    email: 'Email must be a valid email address.'
});

function emailAndContentValidator (req, res, next) {

    const validator = new nodeInputValidator.Validator(req.body, {
        email: 'required|email',
        message: 'required'
    });

    validator.check().then((matched) => {
        if (!matched) {
            return res.status(422).send(validator.errors);
        } else {
            next();
        }
    });
}

module.exports = {
    emailAndContentValidator: emailAndContentValidator
}