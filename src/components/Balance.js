import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadBalances, transferTokens } from "../store/interactions";

import finix from "../assets/finix.png";

// import auriga from "../assets/auriga.png";
// import empyrean from "../assets/empyrean.png";
// import helix from "../assets/helix.png";
// import quantum from "../assets/quantum.png";
// import zeroconium from "../assets/zeroconium.png";

const Balance = () => {
    const [token1TransferAmount, setToken1TransferAmount] = useState(0)

    const dispatch = useDispatch()

    const provider = useSelector(state => state.provider.connection)
    const account = useSelector(state => state.provider.account)

    const decentralizedexchange = useSelector(state => state.decentralizedexchange.contract)
    const decentralizedexchangeBalances = useSelector(state => state.decentralizedexchange.balances)
    const transferInProgress = useSelector(state => state.decentralizedexchange.transferInProgress)

    const tokens = useSelector(state => state.tokens.contracts)
    const symbols = useSelector(state => state.tokens.symbols)
    const tokenBalances = useSelector(state => state.tokens.balances)

    const amountHandler = (e, token) => {
        if (token.address === tokens[0].address) {
            setToken1TransferAmount(e.target.value)
        }
    }
    const depositHandler = (e, token) => {
        e.preventDefault()

        if (token.address === tokens[0].address) {
            transferTokens(provider, decentralizedexchange, "Deposit", token, token1TransferAmount, dispatch)
            setToken1TransferAmount(0)
        }
    }

    useEffect(() => {
        if (decentralizedexchange && tokens[0] && tokens[1] && account) {
            loadBalances(decentralizedexchange, tokens, account, dispatch)
        }
    }, [decentralizedexchange, tokens, account, transferInProgress, dispatch])

    return (
        <div className="component exchange__transfers">
            <div className="component__header flex-between">
                <h2>Balance</h2>
                <div className="tabs">
                    <button className="tab tab--active">Deposit</button>
                    <button className="tab">Withdraw</button>
                </div>
            </div>

            {/* Deposit/Withdraw Component 1 (finix) */}

            <div className="exchange__transfers--form">
                <div className="flex-between">
                    <p><small>Token</small><br /><img src={finix} alt="Token Logo" />{symbols && symbols[0]}</p>
                    <p><small>Wallet</small><br />{tokenBalances && tokenBalances[0]}</p>
                    <p><small>Exchange</small><br />{decentralizedexchangeBalances && decentralizedexchangeBalances[0]}</p>
                </div>

                <form onSubmit={(e) => depositHandler(e, tokens[0])}>
                    <label htmlFor="token0">{symbols && symbols[0]} Amount</label>
                    <input
                        type="text"
                        id="token0"
                        placeholder="0.0000"
                        value={token1TransferAmount === 0 ? "" : token1TransferAmount}
                        onChange={(e) => amountHandler(e, tokens[0])} />
                    <button className="button" type="submit">
                        <span>Deposit</span>
                    </button>
                </form>
            </div>

            <hr />

            {/* Deposit/Withdraw Component 2 (Auriga) */}

            <div className="exchange__transfers--form">
                <div className="flex-between">

                </div>

                <form>
                    <label htmlFor="token1"></label>
                    <input type="text" id="token1" placeholder="0.0000" />

                    <button className="button" type="submit">
                        <span></span>
                    </button>
                </form>
            </div>

            <hr />
        </div>
    );
}

export default Balance;