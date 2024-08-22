const fs = require('fs');
const path = require('path');

const swfDir = path.join(__dirname, 'swf');
const outputFilePath = path.join(__dirname, 'index.html');

function generateHTML() {
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

    const categories = fs.readdirSync(swfDir).filter(file => fs.statSync(path.join(swfDir, file)).isDirectory());

    categories.forEach(category => {
        htmlContent += `<h2>${category}</h2>\n`;

        const files = fs.readdirSync(path.join(swfDir, category)).filter(file => file.endsWith('.swf'));

        files.forEach(file => {
            const filePath = `${category}/${file}`;
            htmlContent += `
<a href="${filePath}" target="_blank">${file}</a><br>
<object width="800" height="600" data="${filePath}"></object><br><br>
`;
        });
    });

    htmlContent += `
    </div>
</body>
</html>
`;

    fs.writeFileSync(outputFilePath, htmlContent, 'utf8');
    console.log('index.html has been generated!');
}

generateHTML();
