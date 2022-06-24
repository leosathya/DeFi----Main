const { ethers, providers } = require("ethers");
require("dotenv").config();
const abi = require("./contractAbi.json");

const contractAddress = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";

const signer = new ethers.Wallet(
	process.env.PRIVATE_KEY,
	providers.getDefaultProvider("mainnet")
);

const contract = new ethers.Contract(contractAddress, abi, signer);

const from = "0x66fe4806cD41BcD308c9d2f6815AEf6b2e38f9a3";
const to = "0xC41672E349C3F6dAdf8e4031b6D2d3d09De276f9";
const tokenId = 100;

const transaction = async () => {
	const a = await contract.callStatic.transferFrom(from, to, tokenId);
	console.log(a);
};

transaction();

//reason: 'ERC721: transfer caller is not owner nor approved',
//code: 'CALL_EXCEPTION',
//method: 'transferFrom(address,address,uint256)',
//data: '0x08c379a0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000314552433732313a207472616e736665722063616c6c6572206973206e6f74206f776e6572206e6f7220617070726f766564000000000000000000000000000000',
//errorArgs: [ 'ERC721: transfer caller is not owner nor approved' ],
//errorName: 'Error',
//errorSignature: 'Error(string)',
//address: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
