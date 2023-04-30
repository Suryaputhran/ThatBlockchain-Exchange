import { useEffect } from "react";
import config from "../config.json"
import  { useDispatch } from "react-redux";
import { loadProvider, loadNetwork, loadAccount, loadTokens, loadExchange} from "../store/interactions";

function App() {

    const dispatch = useDispatch()
    const loadBlockchainData = async () => {

        // Connect Ethers to blockchain
        const provider = loadProvider(dispatch)

        //Fetch Current Network's chainId(eg. Hardhat: 31337, Kovan: 42, )
        const chainId = await loadNetwork(provider,dispatch)

        //Fetch current account & balance form Metamask
        await loadAccount(provider,dispatch)

        // Load Token Smart Contract
        const Finix = config[chainId].Finix
        const Auriga = config[chainId].Auriga
        await loadTokens(provider, [Finix.address, Auriga.address], dispatch)

        //Load Exchange Smart Contract
        const decentralizedexchangeConfig = config[chainId].decentralizedexchange
        await loadExchange(provider, decentralizedexchangeConfig.address, dispatch)
    }

    useEffect(() => {
        loadBlockchainData()
    })

    return (
        <div>

            {/* Navbar */}

            <main className='exchange grid'>
                <section className='exchange__section--left grid'>

                    {/* Markets */}

                    {/* Balance */}

                    {/* Order */}

                </section>
                <section className='exchange__section--right grid'>

                    {/* PriceChart */}

                    {/* Transactions */}

                    {/* Trades */}

                    {/* OrderBook */}

                </section>
            </main>

            {/* Alert */}

        </div>
    );
}

export default App;