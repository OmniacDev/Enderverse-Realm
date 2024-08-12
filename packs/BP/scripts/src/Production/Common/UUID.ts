export namespace UUID {
  /**
   * Generates a random UUID (RFC4122 version 4 compliant).
   * @returns {string} The generated UUID.
   */
  export function Generate(): string {
    const d0 = (Math.random() * 0x100000000) >>> 0;
    const d1 = (Math.random() * 0x100000000) >>> 0;
    const d2 = (Math.random() * 0x100000000) >>> 0;
    const d3 = (Math.random() * 0x100000000) >>> 0;

    const LUT: string[] = Array.from<string, string>({ length: 256 }, (_v, i) => {
      return (i < 16 ? "0" : "") + i.toString(16);
    })

    return (
      LUT[d0 & 0xff] +
      LUT[(d0 >> 8) & 0xff] +
      LUT[(d0 >> 16) & 0xff] +
      LUT[(d0 >> 24) & 0xff] +
      "-" +
      LUT[d1 & 0xff] +
      LUT[(d1 >> 8) & 0xff] +
      "-" +
      LUT[((d1 >> 16) & 0x0f) | 0x40] +
      LUT[(d1 >> 24) & 0xff] +
      "-" +
      LUT[(d2 & 0x3f) | 0x80] +
      LUT[(d2 >> 8) & 0xff] +
      "-" +
      LUT[(d2 >> 16) & 0xff] +
      LUT[(d2 >> 24) & 0xff] +
      LUT[d3 & 0xff] +
      LUT[(d3 >> 8) & 0xff] +
      LUT[(d3 >> 16) & 0xff] +
      LUT[(d3 >> 24) & 0xff]
    );
  }

  /**
   * Validates whether a given string is a valid UUID.
   * @param {string} uuid - The string to validate as a UUID.
   * @returns {boolean} - Returns true if the string is a valid UUID, false otherwise.
   */
  export function IsValid(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
}




export default UUID
