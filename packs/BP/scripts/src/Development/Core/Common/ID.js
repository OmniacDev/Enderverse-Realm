export function generateID(length = 32) {
    let randomArray = []

    for (let i = 0; i < length; i++) {
        let random = Math.floor(Math.random() * 36).toString(36)
        randomArray.push(random)
    }

    return randomArray.join('')
}