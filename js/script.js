let currSong = new Audio();
let songs = [];
let currFolder = "songs/bollywood";

// Adjust paths for GitHub Pages
let basePath = window.location.origin.includes("github.io") 
    ? "/your-repo-name" 
    : "";

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    seconds = Math.floor(seconds);
    return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}

async function getSongs(folder) {
    currFolder = folder;
    try {
        let response = await fetch(`${basePath}/${folder}/index.json`);
        let data = await response.json();
        songs = data.songs;
    } catch (error) {
        console.error("Error fetching songs:", error);
        return;
    }

    let songUl = document.querySelector(".songList ul");
    songUl.innerHTML = "";
    songs.forEach(song => {
        songUl.innerHTML += `
            <li>
                <img class="invert" src="${basePath}/spotify/imgs/music.svg" alt="">
                <div class="info">
                  <div>${song.title}</div>
                  <div>Bhagyesh</div>
                </div>
                <img class="invert" src="${basePath}/spotify/imgs/play.svg" alt="">
            </li>`;
    });
}

document.querySelector(".songList ul").addEventListener("click", (e) => {
    let songElement = e.target.closest("li");
    if (songElement) {
        let songTitle = songElement.querySelector(".info div").innerText.trim();
        let songObj = songs.find(s => s.title === songTitle);
        if (songObj) playMusic(songObj.file);
    }
});

const playMusic = (track, pause = false) => {
    currSong.src = `${basePath}/${currFolder}/${track}`;
    if (!pause) currSong.play();
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
};

async function displayAlbums() {
    try {
        let response = await fetch(`${basePath}/songs/albums.json`);
        let data = await response.json();
        let cardContainer = document.querySelector(".cardContainer");
        cardContainer.innerHTML = "";
        data.albums.forEach(album => {
            cardContainer.innerHTML += `
                <div data-folder="${album.folder}" class="card">
                    <div class="play">▶</div>
                    <img src="${basePath}/songs/${album.folder}/cover.jpg" alt="">
                    <h2>${album.title}</h2>
                    <p>${album.description}</p>
                </div>`;
        });
    } catch (error) {
        console.error("Error fetching albums:", error);
    }
}

document.querySelector(".cardContainer").addEventListener("click", async (e) => {
    let card = e.target.closest(".card");
    if (card) {
        let folder = card.dataset.folder;
        await getSongs(`songs/${folder}`);
        playMusic(songs[0].file);
    }
});

async function main() {
    await getSongs("songs/bollywood");
    if (songs.length > 0) playMusic(songs[0].file, true);
    displayAlbums();
}

main();
