const fs = require('fs');
const path = require('path');

const swfDir = path.join(__dirname, 'swf');
const outputDir = path.join(__dirname, 'pages');
const itemsPerPage = 10;

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

function generateHTML(pageNumber) {
    let htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SWF Viewer - Page ${pageNumber}</title>
    <script src="https://unpkg.com/@ruffle-rs/ruffle"></script>
    <script>
        document.addEventListener("DOMContentLoaded", () => {
            const ruffle = window.RufflePlayer.newest();
            document.querySelectorAll('.ruffle-player').forEach(container => {
                const src = container.getAttribute('data-src');
                const player = ruffle.createPlayer();
                container.appendChild(player);
                player.load(src).catch(error => {
                    console.error('Error loading SWF:', error);
                });
            });
        });
    </script>
</head>
<body>
    <h1>SWF 文件分类浏览 - 第 ${pageNumber} 页</h1>
    <div id="swf-container">
`;

    const categories = fs.readdirSync(swfDir).filter(file => fs.statSync(path.join(swfDir, file)).isDirectory());

    let allFiles = [];
    categories.forEach(category => {
        const files = fs.readdirSync(path.join(swfDir, category)).filter(file => file.endsWith('.swf'));
        files.forEach(file => {
            allFiles.push({ category, file });
        });
    });

    const startIndex = (pageNumber - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, allFiles.length);

    for (let i = startIndex; i < endIndex; i++) {
        const { category, file } = allFiles[i];
        const filePath = `swf/${category}/${file}`;
        htmlContent += `
<a href="${filePath}" target="_blank">${file}</a><br>
<div class="ruffle-player" data-src="${filePath}" style="width: 800px; height: 600px;"></div><br><br>
`;
    }

    htmlContent += `
    </div>
    <div class="pagination">
`;

    if (pageNumber > 1) {
        htmlContent += `<a href="page${pageNumber - 1}.html">上一页</a> `;
    }
    if (endIndex < allFiles.length) {
        htmlContent += `<a href="page${pageNumber + 1}.html">下一页</a>`;
    }

    htmlContent += `
    </div>
</body>
</html>
`;

    fs.writeFileSync(path.join(outputDir, `page${pageNumber}.html`), htmlContent, 'utf8');
    console.log(`Page ${pageNumber} has been generated!`);
}

function generateAllPages() {
    const categories = fs.readdirSync(swfDir).filter(file => fs.statSync(path.join(swfDir, file)).isDirectory());

    let allFiles = [];
    categories.forEach(category => {
        const files = fs.readdirSync(path.join(swfDir, category)).filter(file => file.endsWith('.swf'));
        files.forEach(file => {
            allFiles.push({ category, file });
        });
    });

    const totalPages = Math.ceil(allFiles.length / itemsPerPage);
    for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
        generateHTML(pageNumber);
    }
}

generateAllPages();
