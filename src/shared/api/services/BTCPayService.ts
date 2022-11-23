import http from '../BTCPayAPI'
import dotenv from 'dotenv'
import { IcreateStore } from '../../interfaces'
import { isDevelopmentEnv } from '../../../functions'

dotenv.config()
const { WEB_DEV_URL, WEB_PROD_URL } = process.env

const baseURL = () => {
	return isDevelopmentEnv() ? WEB_DEV_URL : WEB_PROD_URL
}

const createStore = (data: IcreateStore) => {
	return http.post('/api/v1/stores', data)
}

const connectWalletToStore = (storeID: string, cryptoCode?: string) => {
	const chain = cryptoCode ? cryptoCode : 'BTC'
	return http.post(`/api/v1/stores/${storeID}/payment-methods/onchain/${chain}/generate`, {})
}

const getStores = () => {
	return http.get('/api/v1/stores')
}

const getInvoice = (storeID: string, invoiceID: string) => {
	return http.get(`/api/v1/stores/${storeID}/invoices/${invoiceID}`)
}

const getInvoices = (storeID: string) => {
	return http.get(`/api/v1/stores/${storeID}/invoices`)
}

const createInvoice = (storeID: string, amount: string) => {
	return http.post(`/api/v1/stores/${storeID}/invoices`, {
		currency: 'SEK',
		amount: amount,
		checkout: {
			defaultLanguage: 'sv',
			redirectAutomatically: true,
			redirectURL: `${baseURL()}/trade-successful/{InvoiceId}`,
		}
	})
}

export default {
	connectWalletToStore,
	createInvoice,
	getInvoices,
	createStore,
	getInvoice,
	getStores,
}