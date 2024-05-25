interface IOrderItem {
    id: string;
    description: string;
    price: number;
    quantity: number;
    referenceNumber: string;
}

export class Order {
    createdBy: string;
    createdDate: string;
    items: IOrderItem[]
    constructor() {}
}