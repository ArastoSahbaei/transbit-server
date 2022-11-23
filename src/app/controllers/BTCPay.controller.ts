import StatusCode from '../../configurations/StatusCode'
import BTCPayService from '../../shared/api/services/BTCPayService'

const getInvoice = async (request, response) => {
	try {
		const { data } = await BTCPayService.getInvoice(request.params.storeID, request.params.invoiceID)
		console.log(data)
		response.status(StatusCode.OK).send({ message: data })
	} catch (error) {
		response.status(StatusCode.INTERNAL_SERVER_ERROR).send({ message: error.message })
	}
}

const getInvoices = async (request, response) => {
	const { storeID } = request.body
	try {
		const { data } = await BTCPayService.getInvoices(storeID)
		return response.status(StatusCode.OK).send(data)
	} catch (error) {
		response.status(StatusCode.INTERNAL_SERVER_ERROR).send({ message: error.message })
	}
}

const createInvoice = async (request, response) => {
	const { storeID, amount } = request.body
	try {
		const { data } = await BTCPayService.createInvoice(storeID, amount)
		return response.status(StatusCode.CREATED).send(data)
	} catch (error) {
		response.status(StatusCode.INTERNAL_SERVER_ERROR).send({ message: error.message })
	}
}

export default {
	getInvoice,
	getInvoices,
	createInvoice
}