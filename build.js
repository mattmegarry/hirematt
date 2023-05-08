const { readFile, writeFile, readdir } = require('fs/promises')

async function getFileString(path) {
    return await readFile(path, 'utf8')
}

async function overwriteStringToFile(path, string) {
    await writeFile(path, string)
}

(async function main() {
    const outputDirPath = './dist/'
    const pagesDirPath = './dist/pages'
    const pagesDirFiles = await readdir(pagesDirPath)

    const templateFilePath = './dist/templates/template.html'
    const templateContent = await getFileString(templateFilePath)

    pagesDirFiles.forEach(async (filename) => {
        const pageContent = await getFileString("./dist/pages/" + filename)
        const fullPageContent = templateContent.replace(
            '{% main_content %}',
            pageContent
        )
        await overwriteStringToFile(outputDirPath + filename, fullPageContent)
    })
})();


