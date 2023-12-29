export interface IReturnData<T> {
    code: number;
    messages?: string[];
    data?: T;
}

export class ReturnData<T> implements IReturnData<T> {
    code = 200;
    messages?: string[];
    data?: T | undefined;

    /* eslint-disable-next-line @typescript-eslint/no-empty-function */
    constructor() {
        /* Do nothing */
    }

    addMessage(message: string) {
        if (!this.messages) {
            this.messages = [];
        }
        if (message && message.length > 0) {
            this.messages.push(message);
        }
    }

    clear() {
        this.messages = [];
    }
}