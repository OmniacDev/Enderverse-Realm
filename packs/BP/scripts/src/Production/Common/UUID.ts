export type UUID = string

export namespace UUID {
  const LUT: string[] = Array.from<string, string>({ length: 256 }, (_v, i) => {
    return (i < 16 ? '0' : '') + i.toString(16)
  })

  /**
   * Generates a random UUID (RFC4122 version 4 compliant).
   * @returns {string} The generated UUID.
   */
  export function Generate(): string {
    const r = (Math.random() * 0x100000000) >>> 0
    const s = (Math.random() * 0x100000000) >>> 0
    const t = (Math.random() * 0x100000000) >>> 0
    const u = (Math.random() * 0x100000000) >>> 0

    return [
      LUT[r & 0xff],
      LUT[(r >> 8) & 0xff],
      LUT[(r >> 16) & 0xff],
      LUT[(r >> 24) & 0xff],
      '-',
      LUT[s & 0xff],
      LUT[(s >> 8) & 0xff],
      '-',
      LUT[((s >> 16) & 0x0f) | 0x40],
      LUT[(s >> 24) & 0xff],
      '-',
      LUT[(t & 0x3f) | 0x80],
      LUT[(t >> 8) & 0xff],
      '-',
      LUT[(t >> 16) & 0xff],
      LUT[(t >> 24) & 0xff],
      LUT[u & 0xff],
      LUT[(u >> 8) & 0xff],
      LUT[(u >> 16) & 0xff],
      LUT[(u >> 24) & 0xff]
    ].join('')
  }

  /**
   * Validates whether a given string is a valid UUID.
   * @param {string} uuid - The string to validate as a UUID.
   * @returns {boolean} - Returns true if the string is a valid UUID, false otherwise.
   */
  export function IsValid(uuid: string): boolean {
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    return regex.test(uuid)
  }
}

export default UUID
