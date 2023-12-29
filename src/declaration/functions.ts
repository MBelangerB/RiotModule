/**
 * Replace a value in a string
 * @param baseString initial string
 * @param search char to replaced
 * @param replaceWith new value
 * @returns
 */
 export function replaceAll(baseString: string, search: string, replaceWith: string) : string {
  const searchRegExp = new RegExp(search, 'gi');
  return baseString.replace(searchRegExp, replaceWith);
}

/**
 * Cast a Object to JSON string
 * @param data
 * @returns
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export function castDataToJSON(data: any) : string {
  return JSON.stringify(data, null, 2);
}

/**
 * Cast a string [xy.x.y] to [xyxy]
 * @param version
 * @returns
 */
export function castToNumber(version: string) : number {
  const replaceValue = replaceAll(version, '[_.]', '');
  return parseInt(replaceValue);
}


/**
 * Wait for a certain number of milliseconds.
 */
export function tick(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, milliseconds);
  });
}

/**
 * Convert any value to a boolean.
 * @param value
 * @returns {boolean} False by default
 */
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export function getBoolean(value: any) : boolean {
  switch (value) {
       case true:
       case 'true':
       case 1:
       case '1':
           return true;
       default:
           return false;
   }
}

export function isNullOrEmpty(value: string) : boolean {
  if (value === null) {
    return true;
  }
  if (value.trim().length === 0) {
    return true;
  }
  return false;
}
