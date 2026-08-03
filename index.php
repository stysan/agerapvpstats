<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AgeraPVP Stats</title>
    <link rel="stylesheet" href="style.css">
</head>

<body>
    <div class="sidebar">
        <input type="text" id="player-name" placeholder="Введите ник игрока">

        <button id="fetch-player-stats">
            a <!-- тут буква, чтобы высота кнопки была одинаковой с инпутом -->
        </button>

        <p class="footnote">stysan, 2026<br>больше кнопок будет когда мне перестанет быть лень</p>
    </div>
    <div class="container">
        <div id="stats" class="stats"></div>
    </div>

    <script src="playerStats.js"></script>
</body>

</html>