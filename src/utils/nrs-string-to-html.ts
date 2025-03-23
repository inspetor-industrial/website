type HTMLString = string

export function nrsStringToHtml(str: string): HTMLString {
  let htmlString = ''
  for (const line of str.split('\n')) {
    if (/^\d+.\d+.+/.test(line)) {
      htmlString = htmlString.concat(`<span>${line}</span>`)
    } else {
      htmlString = htmlString.concat(`<span class="pl-6">${line}</span>`)
    }

    htmlString = htmlString.concat('<br />')
  }

  return `<div class="space-y-2">${htmlString}</div>`
}
