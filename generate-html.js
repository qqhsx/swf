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
            font-family: Arial, sans-serif;
        }
        #directory {
            width: 250px;
            border-right: 1px solid #ccc;
            padding: 10px;
            overflow-y: auto;
            height: 100vh; /* Ensure the directory can scroll vertically */
        }
        #player {
            flex-grow: 1;
            padding: 10px;
        }
        .ruffle-player {
            width: 800px;
            height: 600px;
        }
        .search-bar {
            margin-bottom: 10px;
        }
        .pagination {
            margin-top: 10px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div id="directory">
        <div class="search-bar">
            <input type="text" id="search" placeholder="Search files..." oninput="filterFiles()">
        </div>
        <h2>目录</h2>
        <ul id="file-list">
            <!-- 文件列表将在此处生成 -->
        </ul>
        <div class="pagination" id="pagination">
            <!-- 分页控件将在此处生成 -->
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

            // Sample data for demo purposes
            const files = [
                // Replace this array with your actual file data
                { category: "Category 1", file: "example1.swf" },
                { category: "Category 2", file: "example2.swf" },
                // Add more files here...
            ];

            const itemsPerPage = 10;
            let currentPage = 1;

            function renderFiles() {
                const start = (currentPage - 1) * itemsPerPage;
                const end = start + itemsPerPage;
                const paginatedFiles = files.slice(start, end);

                const fileList = document.getElementById('file-list');
                fileList.innerHTML = '';
                paginatedFiles.forEach(file => {
                    const filePath = `swf/${file.category}/${file.file}`;
                    const li = document.createElement('li');
                    li.innerHTML = `<a href="#" data-src="${filePath}" onclick="loadSWF('${filePath}'); return false;">${file.file}</a>`;
                    fileList.appendChild(li);
                });

                renderPagination();
            }

            function renderPagination() {
                const totalPages = Math.ceil(files.length / itemsPerPage);
                const pagination = document.getElementById('pagination');
                pagination.innerHTML = '';
                for (let i = 1; i <= totalPages; i++) {
                    const button = document.createElement('button');
                    button.textContent = i;
                    button.onclick = () => {
                        currentPage = i;
                        renderFiles();
                    };
                    if (i === currentPage) {
                        button.disabled = true;
                    }
                    pagination.appendChild(button);
                }
            }

            window.loadSWF = function(src) {
                player.load(src).catch(error => {
                    console.error('Error loading SWF:', error);
                });
            };

            function filterFiles() {
                const searchTerm = document.getElementById('search').value.toLowerCase();
                const filteredFiles = files.filter(file => file.file.toLowerCase().includes(searchTerm));
                files.length = 0;
                files.push(...filteredFiles);
                currentPage = 1;
                renderFiles();
            }

            // Initial render
            renderFiles();
        });
    </script>
</body>
</html>
