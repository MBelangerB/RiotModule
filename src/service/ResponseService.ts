import { AxiosError } from 'axios';
import { ReturnData } from '../riotmodule.js';

/* eslint-disable @typescript-eslint/no-explicit-any */
export class ResponseService {
  createResponse<T>(data?: T, messages?: string[], code?: number): ReturnData<T> {
    return new ReturnData<T>(code, messages, data);
  }

  addMessage(response: ReturnData<any>, message: string) {
    response.addMessage(message);
  }

  clearMessages(response: ReturnData<any>) {
    response.clear();
  }

  catchError<T>(error: any): ReturnData<T> {
    if (error instanceof AxiosError) {
      return this.createResponse<T>(undefined, [error.message], 500);

    } else if (error.response && error.response.data) {
      return this.createResponse<T>(undefined, [error.response.data], 500);

    } else if (error instanceof Error) {
      const errorMessage = error.message;

      if (errorMessage.includes('deprecated')) {
        return this.createResponse<T>(undefined, ['This feature is obsolete'], 500);

      } else {
        return this.createResponse<T>(undefined, [errorMessage], 500);

      }
    } else {
      return this.createResponse<T>(undefined, ['Unknown error'], 500);
    }

  }
}