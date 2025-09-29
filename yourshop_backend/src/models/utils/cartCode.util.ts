import { randomBytes } from "crypto"

export default function generateCartCode(len = 10){
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    const buf = randomBytes(len)
    const tail = Array.from(buf, b => alphabet[b % alphabet.length]).join('')
    return `CART-${tail}`
}