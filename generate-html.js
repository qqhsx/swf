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
            flex-direction: column;
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            overflow-x: hidden;
        }
        #container {
            display: flex;
            flex-direction: column;
            width: 100%;
            box-sizing: border-box;
            padding: 10px;
        }
        #directory {
            width: 100%;
            padding: 10px;
            overflow-y: auto;
            box-sizing: border-box;
        }
        #player {
            width: 100%;
            padding: 10px;
            box-sizing: border-box;
            flex-grow: 1;
        }
        .ruffle-player {
            width: 100%;
            height: auto;
            max-width: 100%;
        }
        @media only screen and (min-width: 768px) {
            #container {
                flex-direction: row; /* 在较宽屏幕上并排显示 */
            }
            #directory {
                width: 30%; /* 目录占30%宽度 */
            }
            #player {
                width: 70%; /* 播放器占70%宽度 */
            }
        }
        .pagination a {
            margin: 0 5px;
        }
        .pagination button {
            padding: 5px 10px;
            margin-top: 10px;
            cursor: pointer;
        }
        .back-to-home a {
            display: inline-block;
            margin-top: 20px;
            text-decoration: none;
            color: #007bff;
        }
    </style>
</head>
<body>
    <div id="container">
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
    </div>
    <script src="https://unpkg.com/@ruffle-rs/ruffle"></script>
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

            function resizePlayer() {
                const container = document.getElementById("player-container");
                const containerWidth = container.offsetWidth;
                const playerHeight = (containerWidth / 4) * 3; // 按4:3比例计算高度
                player.style.width = "100%";
                player.style.height = playerHeight + "px";
            }

            window.addEventListener("resize", resizePlayer);
            window.addEventListener("orientationchange", resizePlayer);

            // 页面加载时初次调整播放器大小
            resizePlayer();
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
            flex-direction: column;
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            overflow-x: hidden;
        }
        #directory {
            width: 100%;
            padding: 10px;
            overflow-y: auto;
            box-sizing: border-box;
        }
        #directory ul {
            list-style-type: none;
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

    return htmlContent;
}

// 示例使用
const categories = fs.readdirSync(swfDir).filter(file => fs.statSync(path.join(swfDir, file)).isDirectory());

categories.forEach(category => {
    const categoryPath = path.join(swfDir, category);
    const files = fs.readdirSync(categoryPath).filter(file => file.endsWith('.swf'));
    const totalPages = Math.ceil(files.length / filesPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const pageFiles = files.slice((i - 1) * filesPerPage, i * filesPerPage);
        const pageContent = generatePage(i, category, pageFiles, totalPages);
        fs.writeFileSync(`index-page-${category}-${i}.html`, pageContent);
    }
});

const indexContent = generateIndexPage(categories);
fs.writeFileSync('index.html', indexContent);
