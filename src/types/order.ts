export interface Order {
	id: number
	product_id: number
	customer_name: string
	quantity: number
	unit_price: string
	total: string
	status: string
	product: {
		id: number
		name: string
		price: string
	}
}
