import moment from "moment"
import { ethers } from "ethers";
import { createSelector } from "reselect"
import { get, groupBy, reject } from "lodash";

const GREEN = "#25CE8F"
const RED = "#F45353"
const tokens = state => get(state, "tokens.contracts")
const allOrders = state => get(state, "decentralizedexchange.allOrders.data", [])
const cancelledOrders = state => get(state, "decentralizedexchange.cancelledOrders.data", [])
const filledOrders = state => get(state, "decentralizedexchange.filledOrders.data", [])


const openOrders = state => {
    const all = allOrders(state)
    const filled = filledOrders(state)
    const cancelled = cancelledOrders(state)

    const openOrders = reject(all, (order) => {
        const orderFilled = filled.some((o) => o.id.toString() === order.id.toString())
        const orderCancelled = cancelled.some((o) => o.id.toString() === order.id.toString())
        return(orderFilled || orderCancelled)
    })

    return openOrders

}
const decorateOrder = (order, tokens) => {
    let token0Amount, token1Amount

    // Note: Finix should be considered token0, Auriga is considered token1
    // Example: Giving Auriga in decentralizedexchange for Finix
    if (order.tokenGive === tokens[1].address) {
        token0Amount = order.amountGive // The amount of Finix we are giving
        token1Amount = order.amountGet // The amount of Auriga we want...
    } else {
        token0Amount = order.amountGet // The amount of Finix we want
        token1Amount = order.amountGive // The amount of Auriga we are giving...
    }

    // Calculate token price to 5 decimal places
    const precision = 100000
    let tokenPrice = (token1Amount / token0Amount)
    tokenPrice = Math.round(tokenPrice * precision) / precision

    return ({
        ...order,
        token1Amount: ethers.utils.formatUnits(token1Amount, "ether"),
        token0Amount: ethers.utils.formatUnits(token0Amount, "ether"),
        tokenPrice,
        formattedTimestamp: moment.unix(order.timestamp).format("h:mm:ssa d MMM D")
    })
}

// ORDER BOOK
export const orderBookSelector = createSelector(
    openOrders,
    tokens,
    (orders, tokens) => {
        if (!tokens[0] || !tokens[1]) { return }

        // Filter orders by selected tokens
        orders = orders.filter((o) => o.tokenGet === tokens[0].address || o.tokenGet === tokens[1].address)
        orders = orders.filter((o) => o.tokenGive === tokens[0].address || o.tokenGive === tokens[1].address)

        // Decorate orders
        orders = decorateOrderBookOrders(orders, tokens)

        //Group orders by Order Type
        orders = groupBy(orders, "orderType")

        // Fetch BUY Orders
        const buyOrders = get(orders, "buy", [])
        // Sort BUY Orders by Token Price
        orders = {
            ...orders,
            buyOrders: buyOrders.sort((a, b) => b.tokenPrice - a.tokenPrice)
        }

        // Fetch SELL Orders
        const sellOrders = get(orders, "sell", [])
        // Sort SELL Orders by token price
        orders = {
            ...orders,
            sellOrders: sellOrders.sort((a, b) => b.tokenPrice - a.tokenPrice)
        }
        return orders
    }
)

const decorateOrderBookOrders = (orders, tokens) => {
    return(
        orders.map((order) => {
            order = decorateOrder(order, tokens)
            order = decorateOrderBookOrder(order, tokens)
            return(order)
        })
    )
}
const decorateOrderBookOrder = (order, tokens) => {
    const orderType = order.tokenGive === tokens[1].address ? "buy" : "sell"

    return({
        ...order,
        orderType,
        orderTypeClass: (orderType === "buy" ? GREEN : RED),
        orderFillAction: (orderType === "buy" ? "sell" : "buy")
    })
}
