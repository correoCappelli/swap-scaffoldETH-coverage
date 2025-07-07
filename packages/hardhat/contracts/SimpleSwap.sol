// SPDX-License-Identifier: MIT
// File: @openzeppelin/contracts/token/ERC20/IERC20.sol


// OpenZeppelin Contracts (last updated v5.1.0) (token/ERC20/IERC20.sol)

pragma solidity ^0.8.20;

/**
 * @dev Interface of the ERC-20 standard as defined in the ERC.
 */
interface IERC20 {
    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);

    /**
     * @dev Returns the value of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the value of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves a `value` amount of tokens from the caller's account to `to`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address to, uint256 value) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets a `value` amount of tokens as the allowance of `spender` over the
     * caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 value) external returns (bool);

    /**
     * @dev Moves a `value` amount of tokens from `from` to `to` using the
     * allowance mechanism. `value` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(address from, address to, uint256 value) external returns (bool);
}

// File: @openzeppelin/contracts/interfaces/IERC20.sol


// OpenZeppelin Contracts (last updated v5.0.0) (interfaces/IERC20.sol)

pragma solidity ^0.8.20;


// File: @openzeppelin/contracts/utils/introspection/IERC165.sol


// OpenZeppelin Contracts (last updated v5.1.0) (utils/introspection/IERC165.sol)

pragma solidity ^0.8.20;

/**
 * @dev Interface of the ERC-165 standard, as defined in the
 * https://eips.ethereum.org/EIPS/eip-165[ERC].
 *
 * Implementers can declare support of contract interfaces, which can then be
 * queried by others ({ERC165Checker}).
 *
 * For an implementation, see {ERC165}.
 */
interface IERC165 {
    /**
     * @dev Returns true if this contract implements the interface defined by
     * `interfaceId`. See the corresponding
     * https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified[ERC section]
     * to learn more about how these ids are created.
     *
     * This function call must use less than 30 000 gas.
     */
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}

// File: @openzeppelin/contracts/interfaces/IERC165.sol


// OpenZeppelin Contracts (last updated v5.0.0) (interfaces/IERC165.sol)

pragma solidity ^0.8.20;


// File: @openzeppelin/contracts/interfaces/IERC1363.sol


// OpenZeppelin Contracts (last updated v5.1.0) (interfaces/IERC1363.sol)

pragma solidity ^0.8.20;



/**
 * @title IERC1363
 * @dev Interface of the ERC-1363 standard as defined in the https://eips.ethereum.org/EIPS/eip-1363[ERC-1363].
 *
 * Defines an extension interface for ERC-20 tokens that supports executing code on a recipient contract
 * after `transfer` or `transferFrom`, or code on a spender contract after `approve`, in a single transaction.
 */
interface IERC1363 is IERC20, IERC165 {
    /*
     * Note: the ERC-165 identifier for this interface is 0xb0202a11.
     * 0xb0202a11 ===
     *   bytes4(keccak256('transferAndCall(address,uint256)')) ^
     *   bytes4(keccak256('transferAndCall(address,uint256,bytes)')) ^
     *   bytes4(keccak256('transferFromAndCall(address,address,uint256)')) ^
     *   bytes4(keccak256('transferFromAndCall(address,address,uint256,bytes)')) ^
     *   bytes4(keccak256('approveAndCall(address,uint256)')) ^
     *   bytes4(keccak256('approveAndCall(address,uint256,bytes)'))
     */

    /**
     * @dev Moves a `value` amount of tokens from the caller's account to `to`
     * and then calls {IERC1363Receiver-onTransferReceived} on `to`.
     * @param to The address which you want to transfer to.
     * @param value The amount of tokens to be transferred.
     * @return A boolean value indicating whether the operation succeeded unless throwing.
     */
    function transferAndCall(address to, uint256 value) external returns (bool);

    /**
     * @dev Moves a `value` amount of tokens from the caller's account to `to`
     * and then calls {IERC1363Receiver-onTransferReceived} on `to`.
     * @param to The address which you want to transfer to.
     * @param value The amount of tokens to be transferred.
     * @param data Additional data with no specified format, sent in call to `to`.
     * @return A boolean value indicating whether the operation succeeded unless throwing.
     */
    function transferAndCall(address to, uint256 value, bytes calldata data) external returns (bool);

    /**
     * @dev Moves a `value` amount of tokens from `from` to `to` using the allowance mechanism
     * and then calls {IERC1363Receiver-onTransferReceived} on `to`.
     * @param from The address which you want to send tokens from.
     * @param to The address which you want to transfer to.
     * @param value The amount of tokens to be transferred.
     * @return A boolean value indicating whether the operation succeeded unless throwing.
     */
    function transferFromAndCall(address from, address to, uint256 value) external returns (bool);

    /**
     * @dev Moves a `value` amount of tokens from `from` to `to` using the allowance mechanism
     * and then calls {IERC1363Receiver-onTransferReceived} on `to`.
     * @param from The address which you want to send tokens from.
     * @param to The address which you want to transfer to.
     * @param value The amount of tokens to be transferred.
     * @param data Additional data with no specified format, sent in call to `to`.
     * @return A boolean value indicating whether the operation succeeded unless throwing.
     */
    function transferFromAndCall(address from, address to, uint256 value, bytes calldata data) external returns (bool);

    /**
     * @dev Sets a `value` amount of tokens as the allowance of `spender` over the
     * caller's tokens and then calls {IERC1363Spender-onApprovalReceived} on `spender`.
     * @param spender The address which will spend the funds.
     * @param value The amount of tokens to be spent.
     * @return A boolean value indicating whether the operation succeeded unless throwing.
     */
    function approveAndCall(address spender, uint256 value) external returns (bool);

    /**
     * @dev Sets a `value` amount of tokens as the allowance of `spender` over the
     * caller's tokens and then calls {IERC1363Spender-onApprovalReceived} on `spender`.
     * @param spender The address which will spend the funds.
     * @param value The amount of tokens to be spent.
     * @param data Additional data with no specified format, sent in call to `spender`.
     * @return A boolean value indicating whether the operation succeeded unless throwing.
     */
    function approveAndCall(address spender, uint256 value, bytes calldata data) external returns (bool);
}

// File: @openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol


// OpenZeppelin Contracts (last updated v5.3.0) (token/ERC20/utils/SafeERC20.sol)

pragma solidity ^0.8.20;



/**
 * @title SafeERC20
 * @dev Wrappers around ERC-20 operations that throw on failure (when the token
 * contract returns false). Tokens that return no value (and instead revert or
 * throw on failure) are also supported, non-reverting calls are assumed to be
 * successful.
 * To use this library you can add a `using SafeERC20 for IERC20;` statement to your contract,
 * which allows you to call the safe operations as `token.safeTransfer(...)`, etc.
 */
library SafeERC20 {
    /**
     * @dev An operation with an ERC-20 token failed.
     */
    error SafeERC20FailedOperation(address token);

    /**
     * @dev Indicates a failed `decreaseAllowance` request.
     */
    error SafeERC20FailedDecreaseAllowance(address spender, uint256 currentAllowance, uint256 requestedDecrease);

    /**
     * @dev Transfer `value` amount of `token` from the calling contract to `to`. If `token` returns no value,
     * non-reverting calls are assumed to be successful.
     */
    function safeTransfer(IERC20 token, address to, uint256 value) internal {
        _callOptionalReturn(token, abi.encodeCall(token.transfer, (to, value)));
    }

    /**
     * @dev Transfer `value` amount of `token` from `from` to `to`, spending the approval given by `from` to the
     * calling contract. If `token` returns no value, non-reverting calls are assumed to be successful.
     */
    function safeTransferFrom(IERC20 token, address from, address to, uint256 value) internal {
        _callOptionalReturn(token, abi.encodeCall(token.transferFrom, (from, to, value)));
    }

    /**
     * @dev Variant of {safeTransfer} that returns a bool instead of reverting if the operation is not successful.
     */
    function trySafeTransfer(IERC20 token, address to, uint256 value) internal returns (bool) {
        return _callOptionalReturnBool(token, abi.encodeCall(token.transfer, (to, value)));
    }

    /**
     * @dev Variant of {safeTransferFrom} that returns a bool instead of reverting if the operation is not successful.
     */
    function trySafeTransferFrom(IERC20 token, address from, address to, uint256 value) internal returns (bool) {
        return _callOptionalReturnBool(token, abi.encodeCall(token.transferFrom, (from, to, value)));
    }

    /**
     * @dev Increase the calling contract's allowance toward `spender` by `value`. If `token` returns no value,
     * non-reverting calls are assumed to be successful.
     *
     * IMPORTANT: If the token implements ERC-7674 (ERC-20 with temporary allowance), and if the "client"
     * smart contract uses ERC-7674 to set temporary allowances, then the "client" smart contract should avoid using
     * this function. Performing a {safeIncreaseAllowance} or {safeDecreaseAllowance} operation on a token contract
     * that has a non-zero temporary allowance (for that particular owner-spender) will result in unexpected behavior.
     */
    function safeIncreaseAllowance(IERC20 token, address spender, uint256 value) internal {
        uint256 oldAllowance = token.allowance(address(this), spender);
        forceApprove(token, spender, oldAllowance + value);
    }

    /**
     * @dev Decrease the calling contract's allowance toward `spender` by `requestedDecrease`. If `token` returns no
     * value, non-reverting calls are assumed to be successful.
     *
     * IMPORTANT: If the token implements ERC-7674 (ERC-20 with temporary allowance), and if the "client"
     * smart contract uses ERC-7674 to set temporary allowances, then the "client" smart contract should avoid using
     * this function. Performing a {safeIncreaseAllowance} or {safeDecreaseAllowance} operation on a token contract
     * that has a non-zero temporary allowance (for that particular owner-spender) will result in unexpected behavior.
     */
    function safeDecreaseAllowance(IERC20 token, address spender, uint256 requestedDecrease) internal {
        unchecked {
            uint256 currentAllowance = token.allowance(address(this), spender);
            if (currentAllowance < requestedDecrease) {
                revert SafeERC20FailedDecreaseAllowance(spender, currentAllowance, requestedDecrease);
            }
            forceApprove(token, spender, currentAllowance - requestedDecrease);
        }
    }

    /**
     * @dev Set the calling contract's allowance toward `spender` to `value`. If `token` returns no value,
     * non-reverting calls are assumed to be successful. Meant to be used with tokens that require the approval
     * to be set to zero before setting it to a non-zero value, such as USDT.
     *
     * NOTE: If the token implements ERC-7674, this function will not modify any temporary allowance. This function
     * only sets the "standard" allowance. Any temporary allowance will remain active, in addition to the value being
     * set here.
     */
    function forceApprove(IERC20 token, address spender, uint256 value) internal {
        bytes memory approvalCall = abi.encodeCall(token.approve, (spender, value));

        if (!_callOptionalReturnBool(token, approvalCall)) {
            _callOptionalReturn(token, abi.encodeCall(token.approve, (spender, 0)));
            _callOptionalReturn(token, approvalCall);
        }
    }

    /**
     * @dev Performs an {ERC1363} transferAndCall, with a fallback to the simple {ERC20} transfer if the target has no
     * code. This can be used to implement an {ERC721}-like safe transfer that rely on {ERC1363} checks when
     * targeting contracts.
     *
     * Reverts if the returned value is other than `true`.
     */
    function transferAndCallRelaxed(IERC1363 token, address to, uint256 value, bytes memory data) internal {
        if (to.code.length == 0) {
            safeTransfer(token, to, value);
        } else if (!token.transferAndCall(to, value, data)) {
            revert SafeERC20FailedOperation(address(token));
        }
    }

    /**
     * @dev Performs an {ERC1363} transferFromAndCall, with a fallback to the simple {ERC20} transferFrom if the target
     * has no code. This can be used to implement an {ERC721}-like safe transfer that rely on {ERC1363} checks when
     * targeting contracts.
     *
     * Reverts if the returned value is other than `true`.
     */
    function transferFromAndCallRelaxed(
        IERC1363 token,
        address from,
        address to,
        uint256 value,
        bytes memory data
    ) internal {
        if (to.code.length == 0) {
            safeTransferFrom(token, from, to, value);
        } else if (!token.transferFromAndCall(from, to, value, data)) {
            revert SafeERC20FailedOperation(address(token));
        }
    }

    /**
     * @dev Performs an {ERC1363} approveAndCall, with a fallback to the simple {ERC20} approve if the target has no
     * code. This can be used to implement an {ERC721}-like safe transfer that rely on {ERC1363} checks when
     * targeting contracts.
     *
     * NOTE: When the recipient address (`to`) has no code (i.e. is an EOA), this function behaves as {forceApprove}.
     * Opposedly, when the recipient address (`to`) has code, this function only attempts to call {ERC1363-approveAndCall}
     * once without retrying, and relies on the returned value to be true.
     *
     * Reverts if the returned value is other than `true`.
     */
    function approveAndCallRelaxed(IERC1363 token, address to, uint256 value, bytes memory data) internal {
        if (to.code.length == 0) {
            forceApprove(token, to, value);
        } else if (!token.approveAndCall(to, value, data)) {
            revert SafeERC20FailedOperation(address(token));
        }
    }

    /**
     * @dev Imitates a Solidity high-level call (i.e. a regular function call to a contract), relaxing the requirement
     * on the return value: the return value is optional (but if data is returned, it must not be false).
     * @param token The token targeted by the call.
     * @param data The call data (encoded using abi.encode or one of its variants).
     *
     * This is a variant of {_callOptionalReturnBool} that reverts if call fails to meet the requirements.
     */
    function _callOptionalReturn(IERC20 token, bytes memory data) private {
        uint256 returnSize;
        uint256 returnValue;
        assembly ("memory-safe") {
            let success := call(gas(), token, 0, add(data, 0x20), mload(data), 0, 0x20)
            // bubble errors
            if iszero(success) {
                let ptr := mload(0x40)
                returndatacopy(ptr, 0, returndatasize())
                revert(ptr, returndatasize())
            }
            returnSize := returndatasize()
            returnValue := mload(0)
        }

        if (returnSize == 0 ? address(token).code.length == 0 : returnValue != 1) {
            revert SafeERC20FailedOperation(address(token));
        }
    }

    /**
     * @dev Imitates a Solidity high-level call (i.e. a regular function call to a contract), relaxing the requirement
     * on the return value: the return value is optional (but if data is returned, it must not be false).
     * @param token The token targeted by the call.
     * @param data The call data (encoded using abi.encode or one of its variants).
     *
     * This is a variant of {_callOptionalReturn} that silently catches all reverts and returns a bool instead.
     */
    function _callOptionalReturnBool(IERC20 token, bytes memory data) private returns (bool) {
        bool success;
        uint256 returnSize;
        uint256 returnValue;
        assembly ("memory-safe") {
            success := call(gas(), token, 0, add(data, 0x20), mload(data), 0, 0x20)
            returnSize := returndatasize()
            returnValue := mload(0)
        }
        return success && (returnSize == 0 ? address(token).code.length > 0 : returnValue == 1);
    }
}

// File: @openzeppelin/contracts/security/ReentrancyGuard.sol


// OpenZeppelin Contracts (last updated v4.9.0) (security/ReentrancyGuard.sol)

pragma solidity ^0.8.0;

/**
 * @dev Contract module that helps prevent reentrant calls to a function.
 *
 * Inheriting from `ReentrancyGuard` will make the {nonReentrant} modifier
 * available, which can be applied to functions to make sure there are no nested
 * (reentrant) calls to them.
 *
 * Note that because there is a single `nonReentrant` guard, functions marked as
 * `nonReentrant` may not call one another. This can be worked around by making
 * those functions `private`, and then adding `external` `nonReentrant` entry
 * points to them.
 *
 * TIP: If you would like to learn more about reentrancy and alternative ways
 * to protect against it, check out our blog post
 * https://blog.openzeppelin.com/reentrancy-after-istanbul/[Reentrancy After Istanbul].
 */
abstract contract ReentrancyGuard {
    // Booleans are more expensive than uint256 or any type that takes up a full
    // word because each write operation emits an extra SLOAD to first read the
    // slot's contents, replace the bits taken up by the boolean, and then write
    // back. This is the compiler's defense against contract upgrades and
    // pointer aliasing, and it cannot be disabled.

    // The values being non-zero value makes deployment a bit more expensive,
    // but in exchange the refund on every call to nonReentrant will be lower in
    // amount. Since refunds are capped to a percentage of the total
    // transaction's gas, it is best to keep them low in cases like this one, to
    // increase the likelihood of the full refund coming into effect.
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;

    uint256 private _status;

    constructor() {
        _status = _NOT_ENTERED;
    }

    /**
     * @dev Prevents a contract from calling itself, directly or indirectly.
     * Calling a `nonReentrant` function from another `nonReentrant`
     * function is not supported. It is possible to prevent this from happening
     * by making the `nonReentrant` function external, and making it call a
     * `private` function that does the actual work.
     */
    modifier nonReentrant() {
        _nonReentrantBefore();
        _;
        _nonReentrantAfter();
    }

    function _nonReentrantBefore() private {
        // On the first call to nonReentrant, _status will be _NOT_ENTERED
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");

        // Any calls to nonReentrant after this point will fail
        _status = _ENTERED;
    }

    function _nonReentrantAfter() private {
        // By storing the original value once again, a refund is triggered (see
        // https://eips.ethereum.org/EIPS/eip-2200)
        _status = _NOT_ENTERED;
    }

    /**
     * @dev Returns true if the reentrancy guard is currently set to "entered", which indicates there is a
     * `nonReentrant` function in the call stack.
     */
    function _reentrancyGuardEntered() internal view returns (bool) {
        return _status == _ENTERED;
    }
}

// File: SimpleSwap.sol


pragma solidity ^0.8.20;




/**
 * @title SimpleSwap
 * @author talentoTech AM
 * @notice A simple decentralized exchange implementing constant product AMM (Automated Market Maker)
 * @dev Implements core AMM functionality with reentrancy protection.
 * Features include:
 * - Add/remove liquidity with ERC20 tokens
 * - Swap between token pairs
 * - Price calculation based on constant product formula
 * - Reentrancy protection for all external functions
 * - Sorted token pairs to prevent duplicates
 */
contract SimpleSwap is ReentrancyGuard {
    using SafeERC20 for IERC20;

    /**
     * @notice Emitted when liquidity is added to a pool
     * @param tokenA Address of the first token in the pair
     * @param tokenB Address of the second token in the pair
     * @param amountA Amount of tokenA added to the pool
     * @param amountB Amount of tokenB added to the pool
     * @param liquidity Amount of LP (Liquidity Provider) tokens minted
     * @param to Address that received the LP tokens
     */
    event LiquidityAdded(
        address indexed tokenA,
        address indexed tokenB,
        uint256 amountA,
        uint256 amountB,
        uint256 liquidity,
        address indexed to
    );

    /**
     * @notice Emitted when liquidity is removed from a pool
     * @param tokenA Address of the first token in the pair
     * @param tokenB Address of the second token in the pair
     * @param amountA Amount of tokenA received
     * @param amountB Amount of tokenB received
     * @param liquidity Amount of LP tokens burned
     * @param to Address that received the underlying tokens
     */
    event LiquidityRemoved(
        address indexed tokenA,
        address indexed tokenB,
        uint256 amountA,
        uint256 amountB,
        uint256 liquidity,
        address indexed to
    );

    /**
     * @notice Emitted when a token swap occurs
     * @param sender Address that initiated the swap
     * @param tokenIn Address of the input token
     * @param tokenOut Address of the output token
     * @param amountIn Amount of input tokens swapped
     * @param amountOut Amount of output tokens received
     * @param to Address that received the output tokens
     */
    event Swap(
        address indexed sender,
        address indexed tokenIn,
        address indexed tokenOut,
        uint256 amountIn,
        uint256 amountOut,
        address to
    );

    /**
     * @dev Pool structure to store reserve and liquidity information
     * @param reserveA Reserve amount of tokenA in the pool
     * @param reserveB Reserve amount of tokenB in the pool
     * @param totalLiquidity Total supply of LP tokens for this pool
     */
    struct Pool {
        uint112 reserveA;
        uint112 reserveB;
        uint112 totalLiquidity;
    }

    /// @dev Mapping from tokenA to tokenB to Pool data structure
    mapping(address => mapping(address => Pool)) internal pools;
    
    /// @dev Mapping from tokenA to tokenB to user address to LP token balance
    mapping(address => mapping(address => mapping(address => uint112))) internal liquidity;

    /**
     * @dev Parameters for adding liquidity to a pool
     * @param tokenA Address of the first token in the pair
     * @param tokenB Address of the second token in the pair
     * @param amountADesired Desired amount of tokenA to add
     * @param amountBDesired Desired amount of tokenB to add
     * @param amountAMin Minimum amount of tokenA that must be added (slippage protection)
     * @param amountBMin Minimum amount of tokenB that must be added (slippage protection)
     * @param to Address that will receive the LP tokens
     * @param deadline Unix timestamp after which the transaction will revert
     */
    struct AddLiquidityParams {
        address tokenA;
        address tokenB;
        uint256 amountADesired;
        uint256 amountBDesired;
        uint256 amountAMin;
        uint256 amountBMin;
        address to;
        uint256 deadline;
    }

    /**
     * @dev Parameters for removing liquidity from a pool
     * @param tokenA Address of the first token in the pair
     * @param tokenB Address of the second token in the pair
     * @param liquidityAmt Amount of LP tokens to burn
     * @param amountAMin Minimum amount of tokenA that must be received (slippage protection)
     * @param amountBMin Minimum amount of tokenB that must be received (slippage protection)
     * @param to Address that will receive the underlying tokens
     * @param deadline Unix timestamp after which the transaction will revert
     */
    struct RemoveLiquidityParams {
        address tokenA;
        address tokenB;
        uint256 liquidityAmt;
        uint256 amountAMin;
        uint256 amountBMin;
        address to;
        uint256 deadline;
    }

    // --- External Functions ---

    /**
     * @notice Add liquidity to a pool for a token pair
     * @dev Tokens should be approved to be transferred by this contract
     * @param tokenA Address of the first token in the pair
     * @param tokenB Address of the second token in the pair
     * @param amountADesired Desired amount of tokenA to add
     * @param amountBDesired Desired amount of tokenB to add
     * @param amountAMin Minimum amount of tokenA that must be added (slippage protection)
     * @param amountBMin Minimum amount of tokenB that must be added (slippage protection)
     * @param to Address that will receive the LP tokens
     * @param deadline Unix timestamp after which the transaction will revert
     * @return amountA Amount of tokenA actually added
     * @return amountB Amount of tokenB actually added
     * @return liquidityMinted Amount of LP tokens minted to the 'to' address
     * @notice Reverts if:
     * - Token addresses are zero or identical
     * - 'to' address is zero
     * - Amounts are zero
     * - Deadline has passed
     * - Slippage is too high (amounts are below minimums)
     */
    function addLiquidity(
        address tokenA,
        address tokenB,
        uint256 amountADesired,
        uint256 amountBDesired,
        uint256 amountAMin,
        uint256 amountBMin,
        address to,
        uint256 deadline
    ) external nonReentrant returns (uint256 amountA, uint256 amountB, uint256 liquidityMinted) {
        require(tokenA != address(0) && tokenB != address(0), "SS:IZA");
        require(to != address(0), "SS:IR");
        require(amountADesired > 0 && amountBDesired > 0, "SS:INA");
        require(deadline >= block.timestamp, "SS:EXP");

        AddLiquidityParams memory params = AddLiquidityParams({
            tokenA: tokenA,
            tokenB: tokenB,
            amountADesired: amountADesired,
            amountBDesired: amountBDesired,
            amountAMin: amountAMin,
            amountBMin: amountBMin,
            to: to,
            deadline: deadline
        });

        return _addLiquidity(params);
    }

    /**
     * @notice Remove liquidity from a pool for a token pair
     * @dev LP tokens should be approved to be transferred by this contract
     * @param tokenA Address of the first token in the pair
     * @param tokenB Address of the second token in the pair
     * @param liquidityAmt Amount of LP tokens to burn
     * @param amountAMin Minimum amount of tokenA that must be received (slippage protection)
     * @param amountBMin Minimum amount of tokenB that must be received (slippage protection)
     * @param to Address that will receive the underlying tokens
     * @param deadline Unix timestamp after which the transaction will revert
     * @return amountA Amount of tokenA received
     * @return amountB Amount of tokenB received
     * @notice Reverts if:
     * - Token addresses are zero or identical
     * - 'to' address is zero
     * - Liquidity amount is zero
     * - Deadline has passed
     * - Slippage is too high (amounts are below minimums)
     * - Insufficient LP token balance
     */
    function removeLiquidity(
        address tokenA,
        address tokenB,
        uint256 liquidityAmt,
        uint256 amountAMin,
        uint256 amountBMin,
        address to,
        uint256 deadline
    ) external nonReentrant returns (uint256 amountA, uint256 amountB) {
        require(tokenA != address(0) && tokenB != address(0), "SS:IZA");
        require(to != address(0), "SS:IR");
        require(liquidityAmt > 0, "SS:IL");
        require(deadline >= block.timestamp, "SS:EXP");

        RemoveLiquidityParams memory params = RemoveLiquidityParams({
            tokenA: tokenA,
            tokenB: tokenB,
            liquidityAmt: liquidityAmt,
            amountAMin: amountAMin,
            amountBMin: amountBMin,
            to: to,
            deadline: deadline
        });

        return _removeLiquidity(params);
    }

    /**
     * @notice Swap an exact amount of input tokens for as many output tokens as possible
     * @dev The first element of path is the input token, the second is the output token
     * @param amountIn Exact amount of input tokens to swap
     * @param amountOutMin Minimum amount of output tokens that must be received (slippage protection)
     * @param path Array with 2 elements: [inputToken, outputToken]
     * @param to Address that will receive the output tokens
     * @param deadline Unix timestamp after which the transaction will revert
     * @notice Reverts if:
     * - Path length is not exactly 2
     * - 'to' address is zero
     * - Input and output tokens are the same
     * - Input amount is zero
     * - Deadline has passed
     * - Insufficient output amount (slippage protection)
     * - Insufficient input token balance or allowance
     */
    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external nonReentrant returns (uint256[] memory amounts) {
        require(path.length == 2, "SS:IPL");
        require(to != address(0), "SS:IR");
        require(path[0] != path[1], "SS:IA");
        require(amountIn > 0, "SS:INA");
        require(deadline >= block.timestamp, "SS:EXP");

        (address input, address output) = (path[0], path[1]);
        (uint112 reserveIn, uint112 reserveOut) = getReserves(input, output);

        uint256 amountOut = getAmountOut(amountIn, reserveIn, reserveOut);
        require(amountOut >= amountOutMin, "SS:IOA");

        _update(input, output, reserveIn + amountIn, reserveOut - amountOut);

        IERC20(input).safeTransferFrom(msg.sender, address(this), amountIn);
        IERC20(output).safeTransfer(to, amountOut);

        emit Swap(msg.sender, input, output, amountIn, amountOut, to);

        amounts = new uint256[](2);
        amounts[0] = amountIn;
        amounts[1] = amountOut;
    }

    /**
    * @notice Returns the liquidity token balance of a user for a given token pair
    * @param tokenA The address of the first token in the pair
    * @param tokenB The address of the second token in the pair
    * @param user The address of the user whose liquidity balance is being queried
    * @return The amount of LP tokens owned by the user for the tokenA-tokenB pair
    */
    function getLiquidity(
        address tokenA, 
        address tokenB, 
        address user
    ) external view returns (uint256) {
        (address t0, address t1) = sortTokens(tokenA, tokenB);
        return liquidity[t0][t1][user];
    }

    // --- Internal Functions ---

    /**
     * @dev Internal function to add liquidity to a pool
     * @param p AddLiquidityParams struct containing token addresses, amounts, and other parameters
     * @return amountA Amount of tokenA actually added
     * @return amountB Amount of tokenB actually added
     * @return liquidityMinted Amount of LP tokens minted
     * @notice This function:
     * - Sorts tokens to ensure consistent ordering
     * - Calculates optimal token amounts based on current reserves
     * - Updates reserves and total liquidity
     * - Mints LP tokens to the specified address
     * - Emits LiquidityAdded event
     */
    function _addLiquidity(
    AddLiquidityParams memory p
) internal returns (uint256 amountA, uint256 amountB, uint256 liquidityMinted) {
    require(p.tokenA != p.tokenB, 'SS:IA');
    require(p.amountADesired > 0 && p.amountBDesired > 0, 'SS:INA');
    require(block.timestamp <= p.deadline, "SS:EXP");
    require(p.to != address(0), "SS:IR");

    address t0;
    address t1;
    (t0, t1) = sortTokens(p.tokenA, p.tokenB);

    Pool storage pool = pools[t0][t1];
    uint112 reserve0 = pool.reserveA;
    uint112 reserve1 = pool.reserveB;

    uint256 amount0;
    uint256 amount1;

    if (reserve0 == 0 && reserve1 == 0) {
        (amount0, amount1) = p.tokenA == t0
            ? (p.amountADesired, p.amountBDesired)
            : (p.amountBDesired, p.amountADesired);
    } else {
        uint256 amount1Optimal = (p.amountADesired * reserve1) / reserve0;
        if (amount1Optimal <= p.amountBDesired) {
            require(amount1Optimal >= p.amountBMin, 'SS:INB');
            amount0 = p.amountADesired;
            amount1 = amount1Optimal;
        } else {
            uint256 amount0Optimal = (p.amountBDesired * reserve0) / reserve1;
            require(amount0Optimal <= p.amountADesired, 'SS:INA');
            require(amount0Optimal >= p.amountAMin, 'SS:INA');
            amount0 = amount0Optimal;
            amount1 = p.amountBDesired;
        }
    }

    IERC20(t0).safeTransferFrom(msg.sender, address(this), amount0);
    IERC20(t1).safeTransferFrom(msg.sender, address(this), amount1);

    uint256 cachedTotalLiquidity = pool.totalLiquidity;
    if (cachedTotalLiquidity == 0) {
        liquidityMinted = sqrt(amount0 * amount1);
        require(liquidityMinted > 0, "SS:ILM");
    } else {
        uint256 liquidity0 = (amount0 * cachedTotalLiquidity) / reserve0;
        uint256 liquidity1 = (amount1 * cachedTotalLiquidity) / reserve1;
        liquidityMinted = liquidity0 < liquidity1 ? liquidity0 : liquidity1;
        require(liquidityMinted > 0, "SS:ILM");
    }

    pool.reserveA = uint112(uint256(reserve0) + amount0);
    pool.reserveB = uint112(uint256(reserve1) + amount1);
    pool.totalLiquidity = uint112(uint256(cachedTotalLiquidity) + liquidityMinted);
    liquidity[t0][t1][p.to] += uint112(liquidityMinted);

    (amountA, amountB) = p.tokenA == t0 ? (amount0, amount1) : (amount1, amount0);

    emit LiquidityAdded(p.tokenA, p.tokenB, amountA, amountB, liquidityMinted, p.to);
}

    /**
     * @dev Internal function to remove liquidity from a pool
     * @param p RemoveLiquidityParams struct containing token addresses, LP amount, and other parameters
     * @return amountA Amount of tokenA received
     * @return amountB Amount of tokenB received
     * @notice This function:
     * - Sorts tokens to ensure consistent ordering
     * - Calculates token amounts based on LP share
     * - Burns LP tokens from the sender
     * - Updates reserves and total liquidity
     * - Transfers tokens to the specified address
     * - Emits LiquidityRemoved event
     */
    function _removeLiquidity(RemoveLiquidityParams memory p) internal returns (uint256 amountA, uint256 amountB) {
        (address t0, address t1) = sortTokens(p.tokenA, p.tokenB);
        Pool storage pool = pools[t0][t1];

        uint112 reserve0 = pool.reserveA;
        uint112 reserve1 = pool.reserveB;
        uint112 total = pool.totalLiquidity;

        require(total > 0, "SS:ITL");
        require(liquidity[t0][t1][msg.sender] >= p.liquidityAmt, "SS:ILB");

        amountA = (p.liquidityAmt * reserve0) / total;
        amountB = (p.liquidityAmt * reserve1) / total;

        require(amountA >= p.amountAMin, "SS:INA");
        require(amountB >= p.amountBMin, "SS:INB");

        liquidity[t0][t1][msg.sender] -= uint112(p.liquidityAmt);

        pool.reserveA = reserve0 - uint112(amountA);
        pool.reserveB = reserve1 - uint112(amountB);
        pool.totalLiquidity = total - uint112(p.liquidityAmt);

        IERC20(t0).safeTransfer(p.to, amountA);
        IERC20(t1).safeTransfer(p.to, amountB);

        emit LiquidityRemoved(t0, t1, amountA, amountB, p.liquidityAmt, p.to);
    }

    // --- View Functions ---

    /**
     * @notice Get the reserves for a token pair
     * @param tokenA Address of the first token in the pair
     * @param tokenB Address of the second token in the pair
     * @return reserveA Reserve amount of tokenA
     * @return reserveB Reserve amount of tokenB
     * @notice Reverts if reserves are not initialized (pool doesn't exist)
     */
    function getReserves(address tokenA, address tokenB) public view returns (uint112 reserveA, uint112 reserveB) {
        (address t0, address t1) = sortTokens(tokenA, tokenB);
        Pool storage pool = pools[t0][t1];
        require(pool.reserveA > 0 && pool.reserveB > 0, "SS:RNI");
        return tokenA == t0 ? (pool.reserveA, pool.reserveB) : (pool.reserveB, pool.reserveA);
    }

    /**
     * @notice Calculate the output amount for a given input amount and reserves
     * @param amountIn Amount of input tokens
     * @param reserveIn Reserve amount of input token
     * @param reserveOut Reserve amount of output token
     * @return amountOut Amount of output tokens that will be received
     * @notice Reverts if:
     * - Input amount is zero
     * - Reserves are zero
     * @dev Uses constant product formula: amountOut = (amountIn * reserveOut) / (reserveIn + amountIn)
     */
    function getAmountOut(uint256 amountIn, uint256 reserveIn, uint256 reserveOut) public pure returns (uint256 amountOut) {
        require(amountIn > 0, "SS:INA");
        require(reserveIn > 0 && reserveOut > 0, "SS:IL");
        uint256 numerator = amountIn * reserveOut;
        uint256 denominator = reserveIn + amountIn;
        amountOut = numerator / denominator;
    }

    /**
     * @notice Get the current price ratio between two tokens
     * @param tokenA Address of the first token in the pair
     * @param tokenB Address of the second token in the pair
     * @return price Price of tokenA in terms of tokenB, scaled by 1e18
     * @notice Reverts if reserves are not initialized (pool doesn't exist)
     * @dev Price is calculated as (reserveB * 1e18) / reserveA when tokenA is token0
     */
    function getPrice(address tokenA, address tokenB) external view returns (uint256 price) {
        (address t0, address t1) = sortTokens(tokenA, tokenB);
        Pool storage pool = pools[t0][t1];
        require(pool.reserveA > 0 && pool.reserveB > 0, "SS:RNI");

        price = tokenA == t0
            ? (uint256(pool.reserveB) * 1e18) / pool.reserveA
            : (uint256(pool.reserveA) * 1e18) / pool.reserveB;
    }

    // --- Internal Helpers ---

    /**
     * @dev Calculate the square root of a number using the Babylonian method
     * @param y The number to calculate the square root of
     * @return z The square root of y
     * @notice Returns 0 if y is 0, 1 if y is between 1 and 3
     */
    function sqrt(uint256 y) internal pure returns (uint256 z) {
        if (y > 3) {
            z = y;
            uint256 x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }

    /**
     * @dev Sorts two tokens to ensure consistent ordering
     * @param tokenA Address of the first token
     * @param tokenB Address of the second token
     * @return token0 The smaller token address
     * @return token1 The larger token address
     * @notice Reverts if:
     * - Token addresses are the same
     * - Either token address is zero
     */
    function sortTokens(address tokenA, address tokenB) internal pure returns (address token0, address token1) {
        require(tokenA != tokenB, "SS:IA");
        (token0, token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        require(token0 != address(0), "SS:IZA");
    }

    /**
     * @dev Internal function to update the reserves for a token pair
     * @param tokenA Address of the first token in the pair
     * @param tokenB Address of the second token in the pair
     * @param reserveA New reserve amount for tokenA
     * @param reserveB New reserve amount for tokenB
     * @notice This function:
     * - Sorts tokens to ensure consistent ordering
     * - Updates the reserves in storage
     * - Performs overflow checks
     */
    function _update(address tokenA, address tokenB, uint256 reserveA, uint256 reserveB) private {
        (address token0, address token1) = sortTokens(tokenA, tokenB);
        Pool storage pool = pools[token0][token1];
        bool isTokenA0 = tokenA == token0;

        require(reserveA <= type(uint112).max && reserveB <= type(uint112).max, "SS:OVERFLOW");
        (pool.reserveA, pool.reserveB) = isTokenA0
            ? (uint112(reserveA), uint112(reserveB))
            : (uint112(reserveB), uint112(reserveA));
    }
}