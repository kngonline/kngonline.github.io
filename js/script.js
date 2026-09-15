const playlistData = [
    {
        title: "DJ Ghost",
        artist: "DJ Komang Rimex • Justine Bieber • 2022",
        duration: "3:47",
        cover: "assets/img/DJ-Komang-Rimex.jpeg",
        audio: "assets/mp3/DJ-Komang-DJ-Ghost.mp3"
    },
    {
        title: "DJ Night Change",
        artist: "DJ Komang Rimex • One Direction • 2022",
        duration: "4:16",
        cover: "assets/img/DJ-Komang-Rimex.jpeg",
        audio: "assets/mp3/DJ-Komang-DJ-Night-Change.mp3"
    },
    {
        title: "Starlight Drift",
        artist: "Luma Coast • Ambient",
        duration: "4:01",
        cover: "assets/img/cover-purple.jpg",
        audio: "assets/mp3/starlight-drift.mp3"
    },
    {
        title: "Ocean Memory",
        artist: "Luma Coast • Deep House",
        duration: "3:25",
        cover: "assets/img/cover-teal.jpg",
        audio: "assets/mp3/ocean-memory.mp3"
    }
];

let currentSongIndex = 0;
let isShuffle = false;
let repeatMode = 0; // 0 = Repeat Off, 1 = Repeat All, 2 = Repeat 1 Lagu

const audio = document.getElementById('audioElement');
const playPauseBtn = document.getElementById('playPauseBtn');
const currentCover = document.getElementById('currentCover');
const songTitle = document.getElementById('songTitle');
const songArtist = document.getElementById('songArtist');
const songListContainer = document.getElementById('songListContainer');
const playlistCount = document.getElementById('playlistCount');
const progressFilled = document.getElementById('progressFilled');
const progressBar = document.getElementById('progressBar');
const currentTimeEl = document.getElementById('currentTime');
const totalDurationEl = document.getElementById('totalDuration');
const volumeSlider = document.getElementById('volumeSlider');

const shuffleBtn = document.getElementById('shuffleBtn');
const repeatBtn = document.getElementById('repeatBtn');
const repeatIndicator = document.getElementById('repeatIndicator');

function initPlaylist() {
    playlistCount.textContent = playlistData.length;
    songListContainer.innerHTML = '';
    
    playlistData.forEach((song, index) => {
        const item = document.createElement('div');
        item.classList.add('song-item');
        if (index === currentSongIndex) item.classList.add('active');
        
        item.innerHTML = `
            <img src="${song.cover}" alt="Thumb">
            <div class="info">
                <h4>${song.title}</h4>
                <p>${song.artist}</p>
            </div>
            ${index === currentSongIndex ? '<i class="fa-solid fa-waveform active-wave"></i>' : `<span class="duration">${song.duration}</span>`}
        `;
        
        item.addEventListener('click', () => {
            currentSongIndex = index;
            loadSong(currentSongIndex);
            playSong();
        });
        
        songListContainer.appendChild(item);
    });
}

function loadSong(index) {
    const song = playlistData[index];
    songTitle.textContent = song.title;
    songArtist.textContent = song.artist;
    currentCover.src = song.cover;
    audio.src = song.audio;
    
    document.body.style.backgroundImage = `url('${song.cover}')`;
    initPlaylist();
}

function playSong() {
    audio.play().then(() => {
        playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    }).catch(error => {
        console.log("Autoplay dicegah browser:", error);
    });
}

function pauseSong() {
    audio.pause();
    playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
}

playPauseBtn.addEventListener('click', () => {
    if (audio.paused) {
        playSong();
    } else {
        pauseSong();
    }
});

document.getElementById('nextBtn').addEventListener('click', () => {
    nextSong();
});

document.getElementById('prevBtn').addEventListener('click', () => {
    currentSongIndex = (currentSongIndex - 1 + playlistData.length) % playlistData.length;
    loadSong(currentSongIndex);
    playSong();
});

function nextSong() {
    if (isShuffle) {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * playlistData.length);
        } while (randomIndex === currentSongIndex && playlistData.length > 1);
        currentSongIndex = randomIndex;
    } else {
        currentSongIndex = (currentSongIndex + 1) % playlistData.length;
    }
    loadSong(currentSongIndex);
    playSong();
}

// Tombol Shuffle
shuffleBtn.addEventListener('click', () => {
    isShuffle = !isShuffle;
    if (isShuffle) {
        shuffleBtn.style.color = '#0099ff';
        shuffleBtn.style.textShadow = '0 0 10px rgba(0, 153, 255, 0.6)';
    } else {
        shuffleBtn.style.color = '#8c9ac2';
        shuffleBtn.style.textShadow = 'none';
    }
});

// Tombol Multi-Repeat (0: Off -> 1: Repeat All -> 2: Repeat 1)
repeatBtn.addEventListener('click', () => {
    repeatMode = (repeatMode + 1) % 3;
    
    if (repeatMode === 0) {
        // Repeat Off
        repeatBtn.style.color = '#8c9ac2';
        repeatBtn.style.textShadow = 'none';
        repeatIndicator.style.display = 'none';
    } else if (repeatMode === 1) {
        // Repeat All (Nyala tanpa angka 1)
        repeatBtn.style.color = '#0099ff';
        repeatBtn.style.textShadow = '0 0 10px rgba(0, 153, 255, 0.6)';
        repeatIndicator.style.display = 'none';
    } else if (repeatMode === 2) {
        // Repeat 1 (Nyala dengan badge angka 1 kecil)
        repeatBtn.style.color = '#0099ff';
        repeatBtn.style.textShadow = '0 0 10px rgba(0, 153, 255, 0.6)';
        repeatIndicator.style.display = 'block';
    }
});

// Logika Lagu Habis Berdasarkan Mode Repeat
audio.addEventListener('ended', () => {
    if (repeatMode === 2) {
        // Repeat 1 Lagu
        audio.currentTime = 0;
        playSong();
    } else if (repeatMode === 1) {
        // Repeat Semua Berurutan / Shuffle
        nextSong();
    } else {
        // Repeat Off (Berhenti jika lagu terakhir habis)
        if (currentSongIndex < playlistData.length - 1) {
            nextSong();
        } else {
            pauseSong();
            audio.currentTime = 0;
        }
    }
});

audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progressFilled.style.width = `${progressPercent}%`;
        
        currentTimeEl.textContent = formatTime(audio.currentTime);
        totalDurationEl.textContent = formatTime(audio.duration);
    }
});

progressBar.addEventListener('click', (e) => {
    const width = progressBar.clientWidth;
    const clickX = e.offsetX;
    audio.currentTime = (clickX / width) * audio.duration;
});

volumeSlider.addEventListener('input', (e) => {
    audio.volume = e.target.value;
});

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

loadSong(currentSongIndex);
