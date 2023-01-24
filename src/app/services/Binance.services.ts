import StatusCode from '../../configurations/StatusCode'
import BTCPayService from '../../shared/api/services/BTCPayService'
import { invoiceStatus } from '../../shared/enums'

export const verifyInvoice = async (storeId: string, invoiceId: string, response: any) => {
	try {
		const invoice = await BTCPayService.getInvoice(storeId, invoiceId)
		const isInvoiceLegitimate: boolean = invoice.data.status === invoiceStatus.settled || invoice.data.status === invoiceStatus.inProcess
		return response.status(StatusCode.METHOD_NOT_ALLOWED).send({ message: 'Invoice not settled' })
		/* if (!isInvoiceLegitimate) {
    } */
	} catch (error) {
		console.log(error)
	}
}