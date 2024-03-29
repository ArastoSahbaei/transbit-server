import http from '../BinanceAPI'
import { signatureSHA256 } from '../../../functions'

const test = () => {
	return http.get('/api/v3/ping')
}

const getAccountInformation = () => {
	const dataQueryString = `recvWindow=60000&timestamp=${Date.now()}`
	return http.get(`/api/v3/account?${dataQueryString + signatureSHA256(dataQueryString)}`)
}

const createTrade = (quantity: string, price: number) => {
	const params = {
		symbol: 'BTCUSDT',
		side: 'SELL',
		type: 'MARKET',
		quantity: quantity,
		timestamp: Date.now()
	}
	/* 	const params = {
			symbol: 'BTCUSDT',
			side: 'SELL',
			type: 'LIMIT',
			timeInForce: 'GTC',
			quantity: quantity,
			price: price,
			timestamp: Date.now()
		} */

	const queryString = Object.keys(params).map(key => `${key}=${params[key]}`).join('&')
	return http.post(`/api/v3/order?${queryString + signatureSHA256(queryString)}`)
}

const getPrice = () => {
	return http.get('/api/v3/ticker/price?symbol=BTCUSDT')
}

export default {
	test,
	createTrade,
	getAccountInformation,
	getPrice,
}