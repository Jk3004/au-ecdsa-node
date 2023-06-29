const { secp256k1 } = require('ethereum-cryptography/secp256k1');
const { keccak } = require('ethereum-cryptography/keccak');
const utils = require('ethereum-cryptography/utils');
const fs = require('fs');

const validateData = require('./middleware/validate')

const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = JSON.parse(fs.readFileSync('../balances.json', 'utf-8'));

app.get("/balance/:address", (req, res) => {
    const { address } = req.params;
    // console.log(address);
    const balance = balances[address] || 0;
    res.send({ balance });
});

app.post("/send", validateData, (req, res) => {
    const { messageHash, signature, data } = req.body;

    console.log(signature);
    const amount = data.amount;
    const sender = data.sender;
    const recipient = data.recipient;
    setInitialBalance(sender);
    setInitialBalance(recipient);

    const isValid = isValidSender(messageHash, signature, sender);
    if (!isValid) return res.status(400).send({ message: 'Not a valid sender!' });

    if (balances[sender] < amount) {
        res.status(400).send({ message: "Not enough funds!" });
    } else {
        balances[sender] -= amount;
        balances[recipient] += amount;
        res.send({ balance: balances[sender] });
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
    if (!balances[address]) {
        balances[address] = 0;
    }
}

const isValidSender = (messageHash, signature, sender) => {
    sig = JSON.parse(signature)
    sign1 = new secp256k1.Signature(BigInt(sig['r']), BigInt(sig['s']), parseInt(sig['recovery']))
    const point = sign1.recoverPublicKey(messageHash);

    publicKey = point.toRawBytes()

    const isSigned = secp256k1.verify(sign1.toCompactRawBytes(), messageHash, publicKey);

    const isValidSender = sender.toString() === getAddressFromPublicKey(publicKey);
    if (!isValidSender && isSigned) return false;
    return true;
};

const getAddressFromPublicKey = (publicKey) => {
    const walletAddress = utils.toHex(publicKey.slice(1).slice(-20));
    return walletAddress.toString();
};