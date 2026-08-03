const fetchButton = document.querySelector("#fetch-player-stats");
const playerInput = document.querySelector("#player-name");
const stats = document.querySelector("#stats");

const MC_COLORS = {
    "0": "#000000",
    "1": "#0000AA",
    "2": "#00AA00",
    "3": "#00AAAA",
    "4": "#AA0000",
    "5": "#AA00AA",
    "6": "#FFAA00",
    "7": "#AAAAAA",
    "8": "#555555",
    "9": "#5555FF",
    "a": "#55FF55",
    "b": "#55FFFF",
    "c": "#FF5555",
    "d": "#FF55FF",
    "e": "#FFFF55",
    "f": "#FFFFFF"
};

const MODES = {
    BedWars: "BW",
    SkyWars: "SW",
    Duels: "DUELS"
};


fetchButton.addEventListener("click", () => {
    const username = playerInput.value.trim();

    if (!username) {
        alert("Пожалуйста, введите ник игрока.");
        return;
    }

    fetch(`/lib/player/getProfile.php?name=${encodeURIComponent(username)}`)
        .then(response => response.json())
        .then(player => {
            if (player.error) {
                stats.innerHTML = `<p>${player.error}</p>`;
                return;
            }

            console.log(player);

            stats.replaceChildren();

            const card = createPlayerCard(player);

            stats.appendChild(card);

            setupStats(card, player);
            setupTooltips(card);
        })
        .catch(error => {
            console.error(error);
            stats.innerHTML =
                "<p>Ошибка при загрузке статистики игрока.</p>";
        });
});


function mcFormat(text) {
    let html = "";
    let color = "#fff";
    let bold = false;

    for (let i = 0; i < text.length; i++) {

        if (text[i] === "§" && text[i + 1]) {
            const code = text[++i].toLowerCase();

            if (MC_COLORS[code]) {
                color = MC_COLORS[code];
            }
            else if (code === "l") {
                bold = true;
            }
            else if (code === "r") {
                color = "#fff";
                bold = false;
            }

            continue;
        }

        html += `<span style="color:${color};${bold ? "font-weight:600;" : ""}">${text[i]}</span>`;
    }

    return html;
}


function createRankTooltip(ranks) {
    if (!ranks.length) {
        return "<div>No ranks</div>";
    }

    return ranks.map(rank =>
        `<div>${rank.name}${rank.expire === -1 ? "" : ` • expires ${new Date(rank.expire).toLocaleDateString()}`}</div>`
    ).join("");
}


function createPlayerCard(player) {
    const card = document.createElement("div");

    card.className = "player-card";

    const flag = player.language === "RUSSIAN"
        ? "🇷🇺"
        : "🇬🇧";


    card.innerHTML = `
        <div class="player-header">

            <div class="left">

                <div class="display-container">

                    <div class="display-name">
                        ${mcFormat(player.displayName)}
                    </div>

                    <div class="rank-tooltip">
                        ${createRankTooltip(player.ranks)}
                    </div>


                    <div class="status-wrapper">

                        <div class="status-dot ${player.online ? "online" : "offline"}"></div>

                        <div class="server-tooltip">
                            ${player.online
                                ? `Server: ${player.currentServer}`
                                : "Offline"
                            }
                        </div>

                    </div>

                </div>

            </div>


            <div class="player-id">
                ${flag} #${player.userId}
            </div>

        </div>


        <hr>


        <div class="mode-selector">

            ${Object.entries(MODES).map(([name, mode], index) => `
                <button
                    data-mode="${mode}"
                    class="${index === 0 ? "active" : ""}"
                >
                    ${name}
                </button>
            `).join("")}

        </div>


        <div class="stats-container">
            Loading...
        </div>
    `;


    return card;
}

function calculateBedwarsLevel(xp) {
    xp = Number(xp) || 0;

    const level = Math.floor(xp / 5000);

    return {
        level,
        nextLevel: level + 1,
        currentXP: xp % 5000,
        requiredXP: 5000
    };
}


function calculateSkywarsLevel(xp) {
    xp = Number(xp) || 0;

    let level = 1;
    let remainingXP = xp;

    while (remainingXP >= level * 1000) {
        remainingXP -= level * 1000;
        level++;
    }

    return {
        level,
        nextLevel: level + 1,
        currentXP: remainingXP,
        requiredXP: level * 1000
    };
}

function createLevelBar(data) {
    return `
        <div class="level-container">

            <div class="level-bar-wrapper">

                <span class="level-number">
                    ${data.level}
                </span>

                <progress
                    value="${data.currentXP}"
                    max="${data.requiredXP}">
                </progress>

                <span class="level-number">
                    ${data.nextLevel}
                </span>

            </div>

            <div class="level-xp">
                ${data.currentXP.toLocaleString()}
                /
                ${data.requiredXP.toLocaleString()} XP
            </div>

        </div>
    `;
}

function setupStats(card, player) {
    const buttons = card.querySelectorAll(".mode-selector button");
    const container = card.querySelector(".stats-container");

    buttons.forEach(button => {
        button.addEventListener("click", () => {

            buttons.forEach(btn =>
                btn.classList.remove("active")
            );

            button.classList.add("active");

            loadStats(button.dataset.mode);
        });
    });


    loadStats("BW");


    function loadStats(mode) {

        container.textContent = "Loading...";


        fetch(
            `/lib/player/getStats.php?name=${encodeURIComponent(player.username)}&mode=${mode}`
        )
            .then(response => response.json())
            .then(data => {

                console.log("Stats:", data);

                renderStats(
                    container,
                    data,
                    mode
                );

            })
            .catch(error => {

                console.error(error);

                container.textContent =
                    "Failed to load stats";

            });
    }
}


function number(value) {
    const result = Number(value);

    return Number.isFinite(result)
        ? result
        : 0;
}


function formatNumber(value) {

    if (typeof value === "string" && value.includes("%")) {
        return value;
    }

    const result = Number(value);

    return Number.isFinite(result)
        ? result.toLocaleString()
        : value;
}


function stat(main, sub) {

    return `
        <span class="main-stat">
            ${formatNumber(main)}
        </span>

        <small>
            ${sub}
        </small>
    `;
}


function renderStats(container, data, mode) {

    const stats = data.values;

    const calculated = {};
    const hidden = new Set([
        "day"
    ]);


    let levelBar = "";


    if (mode === "BW") {

        levelBar = createLevelBar(
            calculateBedwarsLevel(stats.experience)
        );


        const wins = number(stats.wins);
        const games = number(stats.games);

        const kills = number(stats.kills);
        const deaths = number(stats.deaths);

        const finalKills = number(stats.final_kills);
        const finalDeaths = number(stats.final_deaths);


        calculated.FKDR = stat(
            (finalKills / Math.max(finalDeaths, 1)).toFixed(2),
            `${finalKills} finals / ${finalDeaths} final deaths`
        );


        calculated["K/D"] = stat(
            (kills / Math.max(deaths, 1)).toFixed(2),
            `${kills} kills / ${deaths} deaths`
        );


        calculated["Win Rate"] = stat(
            games
                ? `${((wins / games) * 100).toFixed(1)}%`
                : "0%",
            `${wins} wins / ${games} games`
        );


        calculated.Winstreak = stat(
            stats.winstreak,
            `${stats.best_winstreak} best`
        );


        [
            "wins",
            "games",
            "kills",
            "deaths",
            "final_kills",
            "final_deaths",
            "winstreak",
            "best_winstreak"
        ].forEach(key => hidden.add(key));

    }


    if (mode === "SW") {

        levelBar = createLevelBar(
            calculateSkywarsLevel(stats.experience)
        );


        const wins = number(stats.wins);
        const games = number(stats.games);

        const kills = number(stats.kills);
        const deaths = number(stats.deaths);


        calculated["K/D"] = stat(
            (kills / Math.max(deaths, 1)).toFixed(2),
            `${kills} kills / ${deaths} deaths`
        );


        calculated["Win Rate"] = stat(
            games
                ? `${((wins / games) * 100).toFixed(1)}%`
                : "0%",
            `${wins} wins / ${games} games`
        );


        [
            "wins",
            "games",
            "kills",
            "deaths",
            "level"
        ].forEach(key => hidden.add(key));

    }


    if (mode === "DUELS") {

        const wins = number(stats.wins);
        const games = number(stats.games);

        const kills = number(stats.kills);
        const deaths = number(stats.deaths);


        calculated["K/D"] = stat(
            (kills / Math.max(deaths, 1)).toFixed(2),
            `${kills} kills / ${deaths} deaths`
        );


        calculated["Win Rate"] = stat(
            games
                ? `${((wins / games) * 100).toFixed(1)}%`
                : "0%",
            `${wins} wins / ${games} games`
        );


        calculated.Winstreak = stat(
            stats.winstreak,
            `${stats.best_winstreak} best`
        );


        [
            "wins",
            "games",
            "kills",
            "deaths",
            "winstreak",
            "best_winstreak"
        ].forEach(key => hidden.add(key));

    }


    const finalStats = {
        ...calculated,

        ...Object.fromEntries(
            Object.entries(stats)
                .filter(([key]) => !hidden.has(key))
        )
    };


    container.innerHTML =
        levelBar +
        Object.entries(finalStats)
            .map(([key, value]) => `
                <div class="stat-row">

                    <span>
                        ${key.replaceAll("_", " ")}
                    </span>

                    <div class="stat-value">
                        ${value}
                    </div>

                </div>
            `)
            .join("");
}

function setupTooltips(card) {

    const rankTooltip = card.querySelector(".rank-tooltip");
    const serverTooltip = card.querySelector(".server-tooltip");

    const displayName = card.querySelector(".display-name");
    const statusDot = card.querySelector(".status-dot");


    displayName.addEventListener("mouseenter", () => {
        rankTooltip.classList.add("visible");
    });


    displayName.addEventListener("mouseleave", () => {
        rankTooltip.classList.remove("visible");
    });


    statusDot.addEventListener("mouseenter", () => {
        serverTooltip.classList.add("visible");
    });


    statusDot.addEventListener("mouseleave", () => {
        serverTooltip.classList.remove("visible");
    });


    document.addEventListener("mousemove", event => {

        const position = {
            left: `${event.clientX + 12}px`,
            top: `${event.clientY + 12}px`
        };


        if (rankTooltip.classList.contains("visible")) {
            Object.assign(
                rankTooltip.style,
                position
            );
        }


        if (serverTooltip.classList.contains("visible")) {
            Object.assign(
                serverTooltip.style,
                position
            );
        }

    });
}

document.getElementById("home-btn").addEventListener("click", () => {
    stats.innerHTML = `
        <h2>Добро пожаловать!</h2>
        <p>Введите ник игрока в поле поиска, чтобы увидеть его статистику.</p>
    `;
})