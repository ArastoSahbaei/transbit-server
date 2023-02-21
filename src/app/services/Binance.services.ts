import InvoiceModel from '../models/Invoice.model'
import BTCPayService from '../../shared/api/services/BTCPayService'
import BinanceService from '../../shared/api/services/BinanceService'
import { invoiceStatus } from '../../shared/enums'

export const validateInvoice = async (storeId: string, invoiceId: string) => {
	try {
		const invoice = await BTCPayService.getInvoice(storeId, invoiceId)
		const isInvoiceLegitimate: boolean = invoice.data.status === invoiceStatus.settled || invoice.data.status === invoiceStatus.inProcess
		return isInvoiceLegitimate
	} catch (error) {
		console.log(error) //TODO: set status to error and send email
		return false
	}
}

export const checkTransactionHistory = async (invoiceId: string) => {
	//TODO: test this function
	try {
		const databaseResponse = await InvoiceModel.findOne({ BTCPAY_invoiceId: invoiceId })
		console.log('databaseResponse: ', databaseResponse)
		const isAlreadySettled = databaseResponse.status === invoiceStatus.settled
		console.log('isAlreadySettled: ', isAlreadySettled)
		return isAlreadySettled
	} catch (error) {
		console.log(error) //TODO: set status to error and send email
		return false
	}
}

export const getInvoicePaymentMethods = async (storeId: string, invoiceId: string) => {
	//TODO: Why does invoiceResponse return an array? Shouldn't it return a single object? in what scenarios does it return multiple objects?
	try {
		const invoice = await BTCPayService.getInvoicePaymentMethods(storeId, invoiceId)
		return invoice
	} catch (error) {
		console.log(error) //TODO: set status to error and send email
		return false
	}
}

export const updateInvoiceStatus = async (invoiceId: string, status: string) => {
	try {
		const databaseResponse = await InvoiceModel.findOneAndUpdate({ BTCPay_invoiceId: invoiceId }, { status: status })
		return !!databaseResponse
	} catch (error) {
		console.log(error) //TODO: set status to error and send email
		return false
	}
}

export const getRoundedDecimals = (amount: number) => {
	return Math.round(amount * 1000) / 1000
}

export const createNewSellOrder = async (amount: number) => {
	try {
		//TODO: Ensure that the amount is not sold for less than required, but higher is ok.
		const { data } = await BinanceService.createTrade(amount.toString())
		return data
	} catch (error) {
		console.log(error) //TODO: set status to error and send email
		return false
	}
}

export const addToQueue = async (invoiceId: string, data: any) => {
	try {
		const databaseResponse = await InvoiceModel.findOneAndUpdate({ BTCPAY_invoiceId: invoiceId }, data)
		return !!databaseResponse
	} catch (error) {
		console.log(error) //TODO: set status to error and send email
		return false
	}
}

export const saveTradeData = async (invoiceId: string, data: any) => {
	try {
		await InvoiceModel.findOneAndUpdate({ BTCPAY_invoiceId: invoiceId }, data)
		return true
	} catch (error) {
		console.log(error) //TODO: set status to error and send email
		return false
	}
}

export const getBitcoinPrice = async () => {
	try {
		const { data } = await BinanceService.getPrice()
		return data
	} catch (error) {
		console.log(error) //TODO: set status to error and send email
		return { price: 0 }
	}
}

export const isAmountSufficient = (satoshis: number, rate: number) => {
	console.log('satoshis: ', satoshis)
	console.log('rate: ', rate)
	const MIN_SATOSHIS = 50
	const MIN_TRADE_VALUE_USD = 10

	const minTradeValueUSD = satoshis * rate
	console.log('minTradeValueUSD: ', minTradeValueUSD)

	const minimumSatoshisRequired = satoshis >= MIN_SATOSHIS
	console.log('minimumSatoshisRequired: ', minimumSatoshisRequired)

	const minimumTradeValueRequired = minTradeValueUSD >= MIN_TRADE_VALUE_USD
	console.log('minimumTradeValueRequired: ', minimumTradeValueRequired)

	const isEligableForInstantSell: boolean = minimumSatoshisRequired && minimumTradeValueRequired
	console.log('isEligableForInstantSell: ', isEligableForInstantSell)
	return isEligableForInstantSell
}