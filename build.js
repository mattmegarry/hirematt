const { readFile, writeFile } = require('fs/promises')

async function getFileString(path) {
    return await readFile(path, 'utf8')
}

async function overwriteStringToFile(path, string) {
    await writeFile(path, string)
}

(async function main() {
    const indexFilePath = './dist/index.html'
    const indexContent = await getFileString(indexFilePath)

    const templateFilePath = './dist/template.html'
    const templateContent = await getFileString(templateFilePath)

    fullIndexPage = templateContent.replace(
        '{% main_content %}',
        indexContent
    )

    await overwriteStringToFile(indexFilePath, fullIndexPage)
})();


