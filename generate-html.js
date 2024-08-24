const fs = require('fs');
const path = require('path');

// 目录路径
const swfDir = path.join(__dirname, 'swf');
const filesPerPage = 10; // 每页显示的文件数量

// 生成单个页面 HTML 内容
function generatePage(page, category, files, totalPages) {
    let htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SWF Viewer - ${category} - Page ${page}</title>
    <script src="https://unpkg.com/@ruffle-rs/ruffle"></script>
    <style>
        body {
            display: flex;
            flex-direction: row;
            margin: 0;
            font-family: Arial, sans-serif;
            min-height: 100vh;
            box-sizing: border-box;
        }
        #directory {
            width: 300px; /* 固定宽度适合桌面 */
            border-right: 1px solid #ccc;
            padding: 10px;
            box-sizing: border-box;
            background-color: #f9f9f9;
            overflow-y: auto;
        }
        #player {
            flex-grow: 1;
            padding: 10px;
            box-sizing: border-box;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden; /* 避免播放器溢出 */
        }
        .ruffle-player {
            width: 100%;
            max-width: 100%;
            height: auto;
            max-height: 80vh; /* 高度适应视口 */
        }
        .pagination {
            margin-top: 10px;
        }
        .pagination button {
            margin: 2px;
            padding: 5px 10px;
            font-size: 14px;
        }
        .back-to-home {
            margin-top: 10px;
        }
        .back-to-home a {
            text-decoration: none;
            color: #007bff;
        }
        .back-to-home a:hover {
            text-decoration: underline;
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
            body {
                flex-direction: column;
            }
            #directory {
                width: 100%;
                border-right: none;
                border-bottom: 1px solid #ccc;
                overflow-y: auto;
                overflow-x: hidden;
            }
            #player {
                width: 100%;
                padding: 5px;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .pagination button {
                padding: 3px 6px;
                font-size: 12px;
            }
        }
    </style>
</head>
<body>
    <div id="directory">
        <h2>${category}</h2>
        <ul>
`;

    // 生成文件列表
    files.forEach(file => {
        const filePath = `swf/${category}/${file}`;
        htmlContent += `<li><a href="#" data-src="${filePath}" onclick="loadSWF('${filePath}'); return false;">${file}</a></li>`;
    });

    htmlContent += `
        </ul>
        <div class="pagination">
`;

    // 生成分页按钮
    for (let i = 1; i <= totalPages; i++) {
        htmlContent += `<a href="index-page-${category}-${i}.html"><button${i === page ? ' disabled' : ''}>${i}</button></a>`;
    }

    htmlContent += `
        </div>
        <div class="back-to-home">
            <a href="index.html">返回主页</a>
        </div>
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

    return htmlContent;
}







// 生成主页面 HTML 内容
function generateIndexPage(categories) {
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
        #directory {
            width: 250px;
            border-right: 1px solid #ccc;
            padding: 10px;
            overflow-y: auto;
        }
        #player {
            flex-grow: 1;
            padding: 10px;
        }
        #directory ul {
            list-style-type: none; /* 去掉列表的默认样式 */
            padding: 0;
        }
        #directory li {
            margin-bottom: 10px; /* 每个分类项之间的间隔 */
        }
        #directory a {
            text-decoration: none; /* 去掉链接的下划线 */
            color: #007bff; /* 设置链接颜色 */
        }
        #directory a:hover {
            text-decoration: underline; /* 鼠标悬停时下划线 */
        }
    </style>
</head>
<body>
    <div id="directory">
        <h2>目录</h2>
        <ul>
`;

    // 生成分类目录
    categories.forEach(category => {
        htmlContent += `<li><a href="index-page-${category}-1.html">${category}</a></li>`;
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

// 生成所有页面
function generateAllPages() {
    // 读取目录和文件
    const categories = fs.readdirSync(swfDir).filter(file => fs.statSync(path.join(swfDir, file)).isDirectory());

    categories.forEach(category => {
        const files = fs.readdirSync(path.join(swfDir, category)).filter(file => file.endsWith('.swf'));

        // 计算总页数
        const totalFiles = files.length;
        const totalPages = Math.ceil(totalFiles / filesPerPage);

        // 生成每一页
        for (let page = 1; page <= totalPages; page++) {
            const startIndex = (page - 1) * filesPerPage;
            const endIndex = startIndex + filesPerPage;
            const filesForPage = files.slice(startIndex, endIndex);
            const pageContent = generatePage(page, category, filesForPage, totalPages);

            const outputFilePath = path.join(__dirname, `index-page-${category}-${page}.html`);
            fs.writeFileSync(outputFilePath, pageContent, 'utf8');
            console.log(`index-page-${category}-${page}.html has been generated!`);
        }
    });

    // 生成主页面
    generateIndexPage(categories);
}

generateAllPages();
