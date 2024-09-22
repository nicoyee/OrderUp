interface ITransaction {
    id: string;
    remainingBalance: number;
    status: 'paid' | 'unpaid';
    createdDate: Date;
}

export class Balance {
    userEmail: string;
    remainingBalance: number;
    status: 'paid' | 'unpaid';
    transactions: ITransaction[];

    constructor(userEmail: string) {
        this.userEmail = userEmail;
        this.remainingBalance = 0;
        this.status = 'unpaid';
        this.transactions = [];
    }

    addTransaction(transaction: ITransaction) {
        this.transactions.push(transaction);
        this.remainingBalance += transaction.remainingBalance;
        this.updateStatus();
    }

    updateStatus() {
        this.status = this.remainingBalance > 0 ? 'unpaid' : 'paid';
    }
}
