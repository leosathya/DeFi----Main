const BN = require("bn.js");

const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const DAI_WHALE = "0x5d38b4e4783e34e2301a2a36c39a03c45798c4dd";

const IERC20 = artifacts.require("IERC20");
const TestAaveFlashLoan = artifacts.require("TestAaveFlashLoan");

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

contract("TestAaveFlashLoan", (accounts) => {
	const WHALE = DAI_WHALE;
	const TOKEN_BORROW = DAI;
	const DECIMALS = 18;
	const FUND_AMOUNT = pow(10, DECIMALS).mul(new BN(2000));
	const BORROW_AMOUNT = pow(10, DECIMALS).mul(new BN(1000));

	const ADDRESS_PROVIDER = "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5";

	let testAaveFlashLoan;
	let token;
	beforeEach(async () => {
		token = await IERC20.at(TOKEN_BORROW);
		testAaveFlashLoan = await TestAaveFlashLoan.new(ADDRESS_PROVIDER);

		await sendEther(web3, accounts[0], WHALE, 1);

		// send enough token to cover fee
		console.log(
			`Before => My Contract DAI Balance :: ${await token.balanceOf(
				testAaveFlashLoan.address
			)}`
		);
		const bal = await token.balanceOf(WHALE);
		assert(bal.gte(FUND_AMOUNT), "balance of Whale < FUND");
		await token.transfer(testAaveFlashLoan.address, FUND_AMOUNT, {
			from: WHALE,
		});
		console.log(
			`After => My Contract DAI Balance :: ${await token.balanceOf(
				testAaveFlashLoan.address
			)}`
		);
	});

	it("flash loan", async () => {
		const tx = await testAaveFlashLoan.testFlashLoan(
			token.address,
			BORROW_AMOUNT,
			{
				from: WHALE,
			}
		);
		for (const log of tx.logs) {
			console.log(log.args.message, log.args.val.toString());
		}

		console.log(
			`After FlashLoan My Contract DAI Balance :: ${await token.balanceOf(
				testAaveFlashLoan.address
			)}`
		);
	});
});
