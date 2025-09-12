export interface IReturnData<T> {
    code: number;
    messages?: string[];
    data?: T;
}

export class ReturnData<T> implements IReturnData<T> {
    code = 200;
    messages: string[] = [];
    data?: T | undefined;

    constructor(code?: number, messages?: string[], data?: T) {
        if (code) {
            this.code = code;
        }
        if (messages) {
            this.messages = messages;
        }
        if (data) {
            this.data = data;
        }
    }

    addMessage(message: string) {
        if (message && message.length > 0) {
            this.messages.push(message);
        }
    }

    clear() {
        this.messages = [];
    }
}
