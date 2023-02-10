// https://javascript.info/custom-errors
export class NoDataException extends Error {
    keyName: string;

    constructor(message: string, keyName: string) {
      super(message); // (1)
      this.name = "NoDataException"; // (2)
      this.keyName = keyName;
    }

    public toString = () : string => {
      return `No data in cache for key : (${this.keyName})`;
    }
  }


  // **** Export default **** //

export default {
    NoDataException
} as const;
