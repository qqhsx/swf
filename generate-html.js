const fs = require('fs');
const path = require('path');

// 目录路径
const swfDir = path.join(__dirname, 'swf');

// 生成单个页面
function generateSinglePage() {
    let htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SWF Viewer</title>
    <script src="https://unpkg.com/@ruffle-rs/ruffle"></script>
    <style>
        body {
            display: flex;
        }
        #directory {
            width: 250px;
            border-right: 1px solid #ccc;
            padding: 10px;
        }
        #player {
            flex-grow: 1;
            padding: 10px;
        }
        .ruffle-player {
            width: 800px;
            height: 600px;
        }
    </style>
</head>
<body>
    <div id="directory">
        <h2>目录</h2>
        <ul>
`;

    // 读取目录和文件
    const categories = fs.readdirSync(swfDir).filter(file => fs.statSync(path.join(swfDir, file)).isDirectory());
    categories.forEach(category => {
        htmlContent += `<li><strong>${category}</strong><ul>`;
        const files = fs.readdirSync(path.join(swfDir, category)).filter(file => file.endsWith('.swf'));
        files.forEach(file => {
            const filePath = `swf/${category}/${file}`;
            htmlContent += `<li><a href="#" data-src="${filePath}" onclick="loadSWF('${filePath}'); return false;">${file}</a></li>`;
        });
        htmlContent += `</ul></li>`;
    });

    htmlContent += `
        </ul>
    </div>
    <div id="player">
        <div id="swf-container">
            <div class="ruffle-player" id="player-container"></div>
        </div>
    </div>
    <script>
        document.addEventListener("DOMContentLoaded", () => {
            const ruffle = window.RufflePlayer.newest();
            const player = ruffle.createPlayer();
            document.getElementById('player-container').appendChild(player);

            window.loadSWF = function(src) {
                player.load(src).catch(error => {
                    console.error('Error loading SWF:', error);
                });
            };
        });
    </script>
</body>
</html>
`;

    const outputFilePath = path.join(__dirname, 'index.html');
    fs.writeFileSync(outputFilePath, htmlContent, 'utf8');
    console.log('index.html has been generated!');
}

generateSinglePage();
