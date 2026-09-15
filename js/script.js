// Data Playlist Lagu
const playlistData = [
    {
        title: "DJ Ghost",
        artist: "DJ Komang Rimex • Justin Bieber • 2022",
        duration: "3:48",
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
let isRepeat = false;

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

// Inisialisasi Playlist ke HTML
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

// Muat Lagu Pertama / Berdasarkan Index (Tanpa Auto-Play Paksa agar tidak diblokir browser)
function loadSong(index) {
    const song = playlistData[index];
    songTitle.textContent = song.title;
    songArtist.textContent = song.artist;
    currentCover.src = song.cover;
    audio.src = song.audio;
    
    // Ubah background website dinamis sesuai cover art lagu pertama
    document.body.style.backgroundImage = `url('${song.cover}')`;
    
    initPlaylist();
}

// Play & Pause Control
function playSong() {
    audio.play().then(() => {
        playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    }).catch(error => {
        console.log("Autoplay dicegah oleh browser, tunggu interaksi user:", error);
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

// Logika Tombol Next
document.getElementById('nextBtn').addEventListener('click', () => {
    nextSong();
});

// Logika Tombol Prev
document.getElementById('prevBtn').addEventListener('click', () => {
    currentSongIndex = (currentSongIndex - 1 + playlistData.length) % playlistData.length;
    loadSong(currentSongIndex);
    playSong();
});

// Fungsi Pengatur Lagu Berikutnya (Mendukung Shuffle)
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

// Tombol Shuffle (Acak)
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

// Tombol Repeat (Putar Ulang)
repeatBtn.addEventListener('click', () => {
    isRepeat = !isRepeat;
    if (isRepeat) {
        repeatBtn.style.color = '#0099ff';
        repeatBtn.style.textShadow = '0 0 10px rgba(0, 153, 255, 0.6)';
    } else {
        repeatBtn.style.color = '#8c9ac2';
        repeatBtn.style.textShadow = 'none';
    }
});

// Kondisi ketika sebuah lagu habis
audio.addEventListener('ended', () => {
    if (isRepeat) {
        audio.currentTime = 0;
        playSong();
    } else {
        nextSong();
    }
});

// Update Progress Bar & Waktu Audio
audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progressFilled.style.width = `${progressPercent}%`;
        
        currentTimeEl.textContent = formatTime(audio.currentTime);
        totalDurationEl.textContent = formatTime(audio.duration);
    }
});

// Klik pada progress bar untuk lompat waktu
progressBar.addEventListener('click', (e) => {
    const width = progressBar.clientWidth;
    const clickX = e.offsetX;
    audio.currentTime = (clickX / width) * audio.duration;
});

// Kontrol Volume
volumeSlider.addEventListener('input', (e) => {
    audio.volume = e.target.value;
});

// Format Waktu (Detik ke MM:SS)
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Load otomatis lagu pertama saat web dibuka pertama kali
loadSong(currentSongIndex);
