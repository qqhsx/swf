const fs = require('fs');
const path = require('path');

// 目录路径
const swfDir = path.join(__dirname, 'swf');

// 生成单个页面
function generateSinglePage(files) {
    let htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SWF Viewer</title>
    <style>
        body {
            display: flex;
            font-family: Arial, sans-serif;
        }
        #sidebar {
            width: 200px;
            border-right: 1px solid #ddd;
            padding: 10px;
            box-sizing: border-box;
        }
        #main {
            flex-grow: 1;
            padding: 10px;
            box-sizing: border-box;
        }
        .file-link {
            display: block;
            margin-bottom: 10px;
            cursor: pointer;
            text-decoration: underline;
        }
        .file-link:hover {
            color: blue;
        }
    </style>
    <script src="https://unpkg.com/@ruffle-rs/ruffle"></script>
    <script>
        document.addEventListener("DOMContentLoaded", () => {
            const ruffle = window.RufflePlayer.newest();
            const player = ruffle.createPlayer();
            document.querySelector('#main').appendChild(player);

            document.querySelectorAll('.file-link').forEach(link => {
                link.addEventListener('click', (event) => {
                    event.preventDefault();
                    const src = link.getAttribute('data-src');
                    player.load(src).catch(error => {
                        console.error('Error loading SWF:', error);
                    });
                });
            });
        });
    </script>
</head>
<body>
    <div id="sidebar">
        <h2>SWF Files</h2>
`;

    files.forEach(file => {
        const filePath = `swf/${file}`;
        htmlContent += `
<a href="#" class="file-link" data-src="${filePath}">${file}</a>
`;
    });

    htmlContent += `
    </div>
    <div id="main">
        <p>Select a file from the list to view it here.</p>
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
    const files = fs.readdirSync(swfDir).filter(file => file.endsWith('.swf'));
    generateSinglePage(files);
}

generateHTML();
