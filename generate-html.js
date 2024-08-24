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
        <h2>目录 - ${category}</h2>
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
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        #directory {
            width: 300px;
            margin: 20px;
        }
        #directory ul {
            list-style: none;
            padding: 0;
        }
        #directory li {
            margin-bottom: 10px;
        }
        #directory a {
            text-decoration: none;
            color: #007bff;
        }
        #directory a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div id="directory">
        <h1>SWF Viewer</h1>
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
</body>
</html>
`;

    const outputFilePath = path.join(__dirname, 'index.html');
    fs.writeFileSync(outputFilePath, htmlContent, 'utf8');
    console.log('index.html has been generated!');
}


    // 生成主页面
    generateIndexPage(categories);
}

generateAllPages();
