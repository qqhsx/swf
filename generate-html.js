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
        html, body {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            overflow-x: hidden; /* 禁止水平滚动 */
            width: 100%;
            max-width: 100%; /* 限制页面最大宽度 */
        }
        body {
            display: flex;
            flex-direction: column; /* 垂直堆叠元素，适配移动设备 */
            font-family: Arial, sans-serif;
        }
        #directory {
            width: 100%; /* 使目录列表在移动设备上全宽 */
            padding: 10px;
            overflow-y: auto;
            box-sizing: border-box; /* 确保padding和border不会影响宽度 */
        }
        #player {
            flex-grow: 1;
            padding: 10px;
            width: 100%; /* 确保播放器容器宽度不超过屏幕 */
            box-sizing: border-box;
            max-width: 100%; /* 强制限制播放器容器宽度 */
        }
        .ruffle-player {
            width: 100%; /* 使播放器在移动设备上全宽 */
            height: auto;
            max-width: 100%; /* 强制限制播放器宽度 */
            box-sizing: border-box; /* 确保padding和border不会影响宽度 */
        }
        /* 添加媒体查询以调整不同屏幕尺寸的布局 */
        @media only screen and (max-width: 768px) {
            #directory {
                font-size: 14px;
            }
            #player {
                padding: 5px;
            }
            .ruffle-player {
                max-height: none; /* 移除高度限制 */
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
                max-height: none; /* 移除高度限制 */
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
        });

        window.addEventListener("resize", () => {
            const player = document.getElementById("player-container");
            player.style.width = "100%";
            player.style.height = "auto";
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
        html, body {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            overflow-x: hidden; /* 禁止水平滚动 */
            width: 100%;
            max-width: 100%; /* 限制页面最大宽度 */
        }
        body {
            display: flex;
            flex-direction: column; /* 垂直堆叠元素，适配移动设备 */
            font-family: Arial, sans-serif;
        }
        #directory {
            width: 100%; /* 使目录列表在移动设备上全宽 */
            padding: 10px;
            overflow-y: auto;
            box-sizing: border-box; /* 确保padding和border不会影响宽度 */
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
        .back-to-home a {
            display: inline-block;
            margin-top: 20px;
            text-decoration: none;
            color: #007bff;
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
    <div class="back-to-home">
        <a href="index.html">返回主页</a>
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
