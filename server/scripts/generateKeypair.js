const { secp256k1 } = require('ethereum-cryptography/secp256k1');
const { toHex } = require('ethereum-cryptography/utils');
const fs = require('fs');

const generateKeyPair = (n) => {
    const balances = {};
    const account = {};

    for (let i = 0; i < n; i++) {
        const privateKey = secp256k1.utils.randomPrivateKey();
        const publicKey = secp256k1.getPublicKey(privateKey);

        console.log('Private Key:', toHex(privateKey));
        console.log('Public Key:', toHex(publicKey));
        console.log();

        account[toHex(publicKey)] = toHex(privateKey);
        // Give everyone 50 tokens
        balances[toHex(publicKey)] = 50;
    }

    storeAddressInFile('../accounts.json', account);
    storeAddressInFile('../balances.json', balances);
}

function storeAddressInFile(filename, contents) {
    fs.writeFileSync(
        filename,
        JSON.stringify(contents),
        'utf-8'
    );
}

generateKeyPair(3);