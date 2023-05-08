const { readFile, writeFile, readdir } = require('fs/promises')

async function getFileString(path) {
    return await readFile(path, 'utf8')
}

async function overwriteStringToFile(path, string) {
    await writeFile(path, string)
}

const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
};

(async function main() {
    const pagesDirPath = './dist/pages'
    const pagesDirFiles = await readdir(pagesDirPath)

    const templateFilePath = './dist/templates/template.html'
    const templateContent = await getFileString(templateFilePath)


    await asyncForEach(pagesDirFiles, async (filename) => {
        const isBlog = filename === 'blog.html' ? true : false
        const pageContent = await getFileString("./dist/pages/" + filename)
        const fullPageContent = templateContent.replace(
            '{% main_content %}',
            pageContent
        )
        const outputDirPath = isBlog ? './dist/blog/' : './dist/'
        const outputFilename = isBlog ? 'index.html' : filename
        await overwriteStringToFile(outputDirPath + outputFilename, fullPageContent)
    })

    const blogDirPath = './dist/blog'
    const blogDirFiles = await readdir(blogDirPath)
    const blogListHtmls = [];

    await asyncForEach(blogDirFiles, async (filename) => {
        if (filename === 'index.html') return;
        const blogString = await getFileString("./dist/blog/" + filename)
        const blogPageContent = blogString.split('\n\n').map((chunk, index) => {
            blogListHtmls.push(`<li><a href="./${filename.split('.')[0]}.html">${chunk.split('\n')[0]}</a></li>`)
            if (index === 0) {
                return `<h2>${chunk}</h2>`
            }
            return `<p>${chunk}</p>`
        }).join('')
        const fullPageContent = templateContent.replace(
            '{% main_content %}',
            blogPageContent
        )
        await overwriteStringToFile(`./dist/blog/${filename.split('.')[0]}.html`, fullPageContent)
    })
    const blogListPage = await getFileString('./dist/blog/index.html')
    const blogListFullContent = blogListPage.replace(
        '{% blog_list %}',
        blogListHtmls.join('')
    )
    await overwriteStringToFile(`./dist/blog/index.html`, blogListFullContent)
})();


