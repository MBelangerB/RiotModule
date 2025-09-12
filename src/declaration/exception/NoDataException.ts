// https://javascript.info/custom-errors

export class NoDataException extends Error {
    keyName: string;

    /**
     * Constructor
     *
     * @param {string} message - The error message
     * @param {string} keyName - The keyName of the data that we are looking for
     *
     * (1) - Call the parent class constructor with the provided message.
     * (2) - Set the name of the exception to 'NoDataException'
     */
    constructor(message: string, keyName: string) {
      super(message); // (1)
      this.name = 'NoDataException'; // (2)
      this.keyName = keyName;
    }

    public toString = () : string => {
      return `No data in cache for key : (${this.keyName})`;
    };
  }


  // **** Export default **** //

export default {
    NoDataException,
} as const;
