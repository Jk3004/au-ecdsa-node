const validateData = async (req, res, next) => {
    try {
        if (!req.body.data.recipient) throw new Error('Specify the sender!');
        const isValidBalance = +req.body.data.amount > 0;
        if (!isValidBalance) throw new Error('Invalid Amount');
    } catch (error) {
        return res.status(400).send({ message: error.message });
    }
    next();
};

module.exports = validateData;