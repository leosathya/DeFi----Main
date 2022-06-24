const BN = require("bn.js");
const { DAI, DAI_WHALE } = require("./config");

const IERC20 = artifacts.require("IERC20");

contract("IERC20", (accounts) => {
	const TOKEN = DAI;
	const WHALE = DAI_WHALE;

	let token;
	beforeEach(async () => {
		token = await IERC20.at(TOKEN);
	});

	it("should pass", async () => {
		const bal = await token.balanceOf(WHALE);
		console.log(":: DAI-Whale Current Balance ::");
		console.log(`bal: ${bal}`);
	});

	it("should transfer", async () => {
		const bal = await token.balanceOf(WHALE);
		await token.transfer(accounts[0], bal, { from: WHALE });

		console.log(":: Account-0 Balance ::");
		console.log(`MyBal == ${await token.balanceOf(accounts[0])}`);
		console.log(
			"==============================================================="
		);
		console.log(":: Whale Balance ::");
		console.log(`WhaleBal == ${await token.balanceOf(WHALE)}`);
	});
});
