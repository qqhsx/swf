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
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>SWF Viewer - ${category} - Page ${page}</title>
    <style>
        body {
            display: flex;
            flex-direction: column; /* stack elements vertically on mobile devices */
            font-family: Arial, sans-serif;
        }
        #directory {
            width: 100%; /* make the directory list full-width on mobile devices */
            border-right: none; /* remove border on mobile devices */
            padding: 10px;
            overflow-y: auto;
        }
        #player {
            flex-grow: 1;
            padding: 10px;
        }
        .ruffle-player {
            width: 100%; /* make the player full-width on mobile devices */
            height: auto;
            max-width: 100%; /* limit the player width to the screen width */
            max-height: 300px; /* limit the player height to a reasonable value */
        }
        /* add media queries to adjust layout for different screen sizes */
        @media only screen and (max-width: 768px) {
            #directory {
                font-size: 14px;
            }
            #player {
                padding: 5px;
            }
            .ruffle-player {
                max-height: 200px;
            }
        }
        @media only screen and (max-width: 480px) {
            #directory {
                font-size: 12px;
            }
            #player {
                padding: 2px;
            }
            .ruffle-player {
                max-height: 150px;
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
        window.addEventListener("orientationchange", () => {
            const player = document.getElementById("player-container");
            player.style.width = "100%";
            player.style.height = "auto";
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
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>SWF Viewer</title>
    <style>
        body {
            display: flex;
            flex-direction: column; /* stack elements vertically on mobile devices */
            font-family: Arial, sans-serif;
        }
        #directory {
            width: 100%; /* make the directory list full-width on mobile devices */
            border-right: none; /* remove border on mobile devices */
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
        window.addEventListener("orientationchange", () => {
            const player = document.getElementById("player-container");
            player.style.width = "100%";
            player.style.height = "auto";
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
