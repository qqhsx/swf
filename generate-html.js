const fs = require('fs');
const path = require('path');

// 目录路径
const swfDir = path.join(__dirname, 'swf');
const filesPerPage = 10; // 每页显示的文件数量

// 生成页面 HTML 内容
function generatePage(page, files, totalPages) {
    let htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SWF Viewer - Page ${page}</title>
    <script src="https://unpkg.com/@ruffle-rs/ruffle"></script>
    <style>
        body {
            display: flex;
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
        .ruffle-player {
            width: 100%;
            max-width: 800px;
            height: auto;
            max-height: 600px;
        }
        .pagination {
            margin-top: 10px;
        }
        .pagination button {
            margin-right: 5px;
        }
    </style>
</head>
<body>
    <div id="directory">
        <h2>目录</h2>
        <ul>
`;

    // 生成文件列表
    files.forEach(file => {
        const filePath = `swf/${file.category}/${file.name}`;
        htmlContent += `<li><a href="#" data-src="${filePath}" onclick="loadSWF('${filePath}'); return false;">${file.name}</a></li>`;
    });

    htmlContent += `
        </ul>
        <div class="pagination">
`;

    // 生成分页按钮
    for (let i = 1; i <= totalPages; i++) {
        htmlContent += `<button onclick="changePage(${i})"${i === page ? ' disabled' : ''}>${i}</button>`;
    }

    htmlContent += `
        </div>
    </div>
    <div id="player">
        <div id="swf-container">
            <div class="ruffle-player" id="player-container"></div>
        </div>
    </div>
    <script>
        let currentPage = ${page};

        document.addEventListener("DOMContentLoaded", () => {
            const ruffle = window.RufflePlayer.newest();
            const player = ruffle.createPlayer();
            document.getElementById('player-container').appendChild(player);

            window.loadSWF = function(src) {
                player.load(src).catch(error => {
                    console.error('Error loading SWF:', error);
                });
            };

            window.changePage = function(page) {
                window.location.href = 'index-page-' + page + '.html';
            };
        });
    </script>
</body>
</html>
`;

    return htmlContent;
}

// 生成所有页面
function generateAllPages() {
    // 读取目录和文件
    const categories = fs.readdirSync(swfDir).filter(file => fs.statSync(path.join(swfDir, file)).isDirectory());
    const allFiles = [];

    categories.forEach(category => {
        const files = fs.readdirSync(path.join(swfDir, category)).filter(file => file.endsWith('.swf'));
        files.forEach(file => {
            allFiles.push({ category, name: file });
        });
    });

    // 计算总页数
    const totalFiles = allFiles.length;
    const totalPages = Math.ceil(totalFiles / filesPerPage);

    // 生成每一页
    for (let page = 1; page <= totalPages; page++) {
        const startIndex = (page - 1) * filesPerPage;
        const endIndex = startIndex + filesPerPage;
        const filesForPage = allFiles.slice(startIndex, endIndex);
        const pageContent = generatePage(page, filesForPage, totalPages);

        const outputFilePath = path.join(__dirname, `index-page-${page}.html`);
        fs.writeFileSync(outputFilePath, pageContent, 'utf8');
        console.log(`index-page-${page}.html has been generated!`);
    }
}

generateAllPages();
