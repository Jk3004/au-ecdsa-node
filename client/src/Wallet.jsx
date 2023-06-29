import { secp256k1 } from 'ethereum-cryptography/secp256k1';
import { toHex } from 'ethereum-cryptography/utils';

import server from "./server";

function Wallet({
    address,
    setAddress,
    balance,
    setBalance,
    privateKey,
    setPrivateKey,
}) {
    async function onChange(evt) {
        const privateKey = evt.target.value;
        setPrivateKey(privateKey);

        address = ''
        try {
            address = toHex(secp256k1.getPublicKey(evt.target.value).slice(1).slice(-20));
        }
        catch (error) {
            console.log(error);
        }
        console.log(address);
        setAddress(address);

        if (address) {
            const {
                data: { balance },
            } = await server.get(`balance/${address}`);
            setBalance(balance);
        } else {
            setBalance(0);
        }
    }

    return (
        <div className="container wallet">
            <h1>Your Wallet</h1>

            <label>
                Private Key
                <input placeholder="Type in your Private Key" value={privateKey} onChange={onChange}></input>
            </label>

            <div>
                Address: {address}
            </div>

            <div className="balance">Balance: {balance}</div>
        </div>
    );
}

export default Wallet;
