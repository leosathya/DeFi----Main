// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/uniswap/Uniswap.sol";

interface IUniswapV2Callee{
    function uniswapV2Call(
        address sender,
        uint amount0,
        uint amount1,
        bytes calldata data
    )external;
}

contract TestUniswapFlashloan is IUniswapV2Callee{
    address private constant WETH = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    address private constant FACTORY = 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;

    event Log(string msg, uint value);

    function testFlashloanSwap(address _tokenBorrow, uint _amount) external{
        address pair = IUniswapV2Factory(FACTORY).getPair(_tokenBorrow, WETH);
        require(pair != address(0), "This pair not available");

        address token0 = IUniswapV2Pair(pair).token0();
        address token1 = IUniswapV2Pair(pair).token1();

        uint amount0Out = _tokenBorrow == token0 ? _amount : 0;
        uint amount1Out = _tokenBorrow == token1 ? _amount : 0;

        bytes memory data = abi.encode(_tokenBorrow, _amount);

        IUniswapV2Pair(pair).swap(amount0Out, amount1Out, address(this), data);
    }

    // Function that Uniswap will call to get his (Borrowed amount + Fee) back
    function uniswapV2Call(address _sender, uint _amount0, uint _amount1, bytes calldata _data) external override{
        address token0 = IUniswapV2Pair(msg.sender).token0();
        address token1 = IUniswapV2Pair(msg.sender).token1();

        address pair = IUniswapV2Factory(FACTORY).getPair(token0, token1);

        require(msg.sender == pair, "Not Pair");
        require(_sender == address(this), "Not sender");

        (address tokenBorrow, uint amount) = abi.decode(_data, (address, uint));

        // Fee 0.3%
        uint fee = ((amount * 3)/997) + 1;
        uint amountToPay = amount + fee;

        // Here will be My Coustome Code for Arbritage etc
        emit Log("amount", amount);
        emit Log("amount0", _amount0);
        emit Log("amount1", _amount1);
        emit Log("fee", fee);
        emit Log("amount to Repay", amountToPay);


        // That code which repay Amount to Uniswap
        IERC20(tokenBorrow).transfer(pair, amountToPay);
    }    
}