const BN = require("bn.js");

const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const USDT = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

const DAI_WHALE = "";
const USDC_WHALE = "0x4da085ef29a25af96e3a53a53e6ba899f1766a71";
const USDT_WHALE = "";

const IERC20 = artifacts.require("IERC20");
const TestUniswapFlashloan = artifacts.require("UniswapFlashloan");

// Utility Functions
const sendEther = (web3, from, to, amount) => {
	return web3.eth.sendTransaction({
		from,
		to,
		value: web3.utils.toWei(amount.toString(), "ether"),
	});
};

const cast = (x) => {
	if (x instanceof BN) {
		return x;
	}
	return new BN(x);
};

const pow = (x, y) => {
	x = cast(x);
	y = cast(y);
	return x.pow(y);
};

contract("TestUniswapFlashLoan", (accounts) => {
	const WHALE1 = USDC_WHALE;
	const TOKEN_BORROW1 = USDC;
	const DECIMALS = 6;
	const FUND_AMOUNT1 = pow(10, DECIMALS).mul(new BN(2000));
	const BORROW_AMOUNT1 = pow(10, DECIMALS).mul(new BN(10000));

	let testUniswapFlashloan;
	let token;

	beforeEach(async () => {
		token = await IERC20.at(TOKEN_BORROW1);
		testUniswapFlashloan = await TestUniswapFlashloan.new();

		// sending eth to Whale sothat he can pay for tx
		await sendEther(web3, accounts[0], WHALE1, 1);

		// send enough token to cover fee
		const bal = await token.balanceOf(WHALE1);
		assert(bal.gte(FUND_AMOUNT1), "balance < FUND");
		await token.transfer(TestUniswapFlashloan.address, FUND_AMOUNT1, {
			from: WHALE1,
		});
	});

	it("Should swap and log events", async () => {
		const tx = await testUniswapFlashloan.testFlashloanSwap(
			token.address,
			BORROW_AMOUNT1,
			{
				from: WHALE1,
			}
		);

		for (const log of tx.logs) {
			console.log(log.args.message, log.args.val.toString());
		}
	});
});
