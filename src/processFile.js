const fs = require('fs').promises
const path = require('path')

async function readFile(name) {
    try {
        const file = await fs.readFile(path.join(__dirname, '..', name), { encoding: 'utf8' })
        // console.log(file[10])
        return file;

    } catch (error) {
        console.log('ErRor' + error)
    }
}

async function separeInPages(file) {
    const fileLen = file.length
    const mainHeaderLen = 1129

    const header = file.slice(0, mainHeaderLen);

    const firstPageLen = 6499
    const pageLen = 7149
    console.log('fileLen: ' + fileLen)

    const headerLen = 644
    const separationPageLen = 784

    const firstPage = file.slice(mainHeaderLen, mainHeaderLen + firstPageLen)

    const pages = [firstPage]
    const lastFooter = 373

    for (let i = mainHeaderLen + firstPageLen + separationPageLen; i < fileLen; i += pageLen + separationPageLen) {
        const page = file.slice(i, i + pageLen)
        if (fileLen < i + pageLen + separationPageLen) {
            const lastPage = page.slice(0, page.length - lastFooter)
            // console.log(lastPage)
            pages.push(lastPage)
            // console.log(count)
            continue
        }
        pages.push(page);
        // console.log(page)
    }
    return pages

}

async function separeInLines(pages) {
    const lines = []
    const lineLen = 130
    pages.forEach((page) => {
        for (let i = 0; i < page.length; i += lineLen) {
            lines.push(page.slice(i, i + lineLen))
        }
    })
    return lines
}

async function separeData(lines) {
    const data = lines.map((line) => {
        const id = line.slice(0, 8).trim()
        const description = line.slice(9, 48).trim()
        const price = Number(line.slice(74, 85).trim().replace(',', '.'))
        console.log(id)
        return { id, description, price }
    })
    return data
}

async function main() {
    const file = await readFile('data.txt')
    const pages = await separeInPages(file)
    const lines = await separeInLines(pages)
    const data = await separeData(lines)

    await fs.writeFile(path.join(__dirname, 'database.json'), JSON.stringify(data), { encoding: 'utf8' })
}

main()