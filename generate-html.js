<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>SWF Viewer</title>
    <style>
        body, html {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow-x: hidden; /* 禁止水平滚动 */
        }
        #player {
            width: 100%;
            max-width: 100%; /* 确保播放器不会超过屏幕宽度 */
            box-sizing: border-box;
            overflow: hidden; /* 防止超出边界 */
        }
        .ruffle-player {
            width: 100%;
            height: auto;
            max-width: 100%; /* 确保播放器不会超过屏幕宽度 */
        }
    </style>
</head>
<body>
    <div id="player">
        <div class="ruffle-player" id="player-container"></div>
    </div>
    <script src="https://unpkg.com/@ruffle-rs/ruffle"></script>
    <script>
        document.addEventListener("DOMContentLoaded", () => {
            const ruffle = window.RufflePlayer.newest();
            const player = ruffle.createPlayer();
            document.getElementById('player-container').appendChild(player);

            // 自动加载一个 SWF 文件用于测试
            player.load("swf/yourfile.swf").catch(error => {
                console.error('Error loading SWF:', error);
            });
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
