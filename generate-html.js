const fs = require('fs');
const path = require('path');

// 目录路径
const swfDir = path.join(__dirname, 'swf');

// 生成分类页面
function generateCategoryPage(category, files) {
    let htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${category} SWF Files</title>
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
    <h1>${category} SWF 文件浏览</h1>
    <a href="index.html">返回首页</a><br><br>
    <div id="swf-container">
`;

    files.forEach(file => {
        const filePath = `swf/${category}/${file}`;
        htmlContent += `
<a href="${filePath}" target="_blank">${file}</a><br>
<div class="ruffle-player" data-src="${filePath}" style="width: 800px; height: 600px;"></div><br><br>
`;
    });

    htmlContent += `
    </div>
</body>
</html>
`;

    const outputFilePath = path.join(__dirname, `${category}.html`);
    fs.writeFileSync(outputFilePath, htmlContent, 'utf8');
    console.log(`${category}.html has been generated!`);
}

// 生成首页
function generateIndexPage(categories) {
    let htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SWF Viewer</title>
</head>
<body>
    <h1>SWF 文件分类浏览</h1>
    <div id="swf-container">
`;

    categories.forEach(category => {
        htmlContent += `<a href="${category}.html">${category}</a><br>\n`;
    });

    htmlContent += `
    </div>
</body>
</html>
`;

    const outputFilePath = path.join(__dirname, 'index.html');
    fs.writeFileSync(outputFilePath, htmlContent, 'utf8');
    console.log('index.html has been generated!');
}

// 主函数
function generateHTML() {
    const categories = fs.readdirSync(swfDir).filter(file => fs.statSync(path.join(swfDir, file)).isDirectory());

    // 生成每个分类页面
    categories.forEach(category => {
        const files = fs.readdirSync(path.join(swfDir, category)).filter(file => file.endsWith('.swf'));
        generateCategoryPage(category, files);
    });

    // 生成首页
    generateIndexPage(categories);
}

generateHTML();
