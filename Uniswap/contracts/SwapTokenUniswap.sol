// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "./interfaces/IERC20.sol";
import "./interfaces/Uniswap.sol";

contract SwapTokenUniswap{
    address private constant UNISWAP_V2_ROUTER = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    address private constant WETH = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;

    // Functions
    function swap(address tokenIn_, address tokenOut_, uint256 amountIn_, uint256 amountOut_, address to_) external {
        IERC20(tokenIn_).transferFrom(msg.sender, address(this), amountIn_);
        IERC20(tokenIn_).approve(UNISWAP_V2_ROUTER, amountIn_);

        address[] memory path;
        path = new address[](3);
        
        path[0] = tokenIn_;
        path[1] = WETH;
        path[2] = tokenOut_;

        IUniswapV2Router(UNISWAP_V2_ROUTER).swapExactTokensForTokens(amountIn_, amountOut_, path, to_, block.timestamp);
    }
}
