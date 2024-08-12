export function sidebarTitle(titleArray: string[]) {
  const newArray: string[] = []

  for (let i = 0; i < titleArray.length; i++) {
    let text = i !== titleArray.length - 1 ? titleArray[i] + `\n§r` : titleArray[i]
    newArray.push(text)
  }

  return newArray
}
