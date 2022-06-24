const BN = require("bn.js");

const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const WBTC = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599";
const WBTC_WHALE = "0x56178a0d5f301baf6cf3e1cd53d9863437345bf9";

const IERC20 = artifacts.require("IERC20");
const TestUniswap = artifacts.require("SwapTokenUniswap");

function sendEther(web3, from, to, amount) {
	return web3.eth.sendTransaction({
		from,
		to,
		value: web3.utils.toWei(amount.toString(), "ether"),
	});
}

contract("TestUniswap", (accounts) => {
	const WHALE = WBTC_WHALE;
	const AMOUNT_IN = 100000000;
	const AMOUNT_OUT_MIN = 1;
	const TOKEN_IN = WBTC;
	const TOKEN_OUT = DAI;
	const TO = accounts[0];

	let testUniswap;
	let tokenIn;
	let tokenOut;
	beforeEach(async () => {
		tokenIn = await IERC20.at(TOKEN_IN);
		tokenOut = await IERC20.at(TOKEN_OUT);
		testUniswap = await TestUniswap.new();

		// make sure WHALE has enough ETH to send tx
		await sendEther(web3, accounts[0], WHALE, 1);
		await tokenIn.approve(testUniswap.address, AMOUNT_IN, { from: WHALE });
	});

	it("should swapping occure", async () => {
		console.log(
			`Before Swapping My DAI Balance :: ${await tokenOut.balanceOf(TO)}`
		);
		console.log(
			`Before Swapping Whale WBTC Balance :: ${await tokenIn.balanceOf(WHALE)}`
		);

		console.log(
			"====================================================================="
		);
		await testUniswap.swap(
			tokenIn.address,
			tokenOut.address,
			AMOUNT_IN,
			AMOUNT_OUT_MIN,
			TO,
			{
				from: WHALE,
			}
		);

		console.log(`in ${AMOUNT_IN}`);
		console.log(`After Swapping My Balance :: ${await tokenOut.balanceOf(TO)}`);
		console.log(
			`After Swapping Whale WBTC Balance :: ${await tokenIn.balanceOf(WHALE)}`
		);
	});
});
