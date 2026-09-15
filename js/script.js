// Data Playlist Lagu (Lu bisa tambah atau ganti file mp3 & gambar covernya di sini)
const playlistData = [
    {
        title: "DJ Ghost",
        artist: "DJ Komang Rimex• Justin Bieber",
        duration: "3:47",
        cover: "assets/img/DJ-Komang-Rimex.jpeg",       // Tema Biru
        audio: "assets/mp3/DJ-Komang-DJ-Ghost.mp3"
    },
    {
        title: "Crimson Sunset",
        artist: "Luma Coast • Synthwave",
        duration: "3:58",
        cover: "assets/img/cover-maroon.jpg",     // Tema Merah Marun
        audio: "assets/mp3/crimson-sunset.mp3"
    },
    {
        title: "Starlight Drift",
        artist: "Luma Coast • Ambient",
        duration: "4:01",
        cover: "assets/img/cover-purple.jpg",     // Tema Ungu
        audio: "assets/mp3/starlight-drift.mp3"
    },
    {
        title: "Ocean Memory",
        artist: "Luma Coast • Deep House",
        duration: "3:25",
        cover: "assets/img/cover-teal.jpg",       // Tema Hijau Toska
        audio: "assets/mp3/ocean-memory.mp3"
    }
];

let currentSongIndex = 0;
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

// Muat Lagu Berdasarkan Index
function loadSong(index) {
    const song = playlistData[index];
    songTitle.textContent = song.title;
    songArtist.textContent = song.artist;
    currentCover.src = song.cover;
    audio.src = song.audio;
    
    // UBAH BACKGROUND WEBSITE SESUAI COVER ART LAGU SECARA DINAMIS
    document.body.style.backgroundImage = `url('${song.cover}')`;
    
    initPlaylist(); // Refresh tampilan list aktif
}

// Play & Pause Control
function playSong() {
    audio.play();
    playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
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

// Tombol Next & Prev
document.getElementById('nextBtn').addEventListener('click', () => {
    currentSongIndex = (currentSongIndex + 1) % playlistData.length;
    loadSong(currentSongIndex);
    playSong();
});

document.getElementById('prevBtn').addEventListener('click', () => {
    currentSongIndex = (currentSongIndex - 1 + playlistData.length) % playlistData.length;
    loadSong(currentSongIndex);
    playSong();
});

// Update Progress Bar & Waktu Audio
audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progressFilled.style.width = `${progressPercent}%`;
        
        // Format waktu berjalan
        currentTimeEl.textContent = formatTime(audio.currentTime);
        totalDurationEl.textContent = formatTime(audio.duration);
    }
});

// Klik pada progress bar untuk lompat waktu lagu
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

// Otomatis lanjut ke lagu berikutnya kalau habis
audio.addEventListener('ended', () => {
    currentSongIndex = (currentSongIndex + 1) % playlistData.length;
    loadSong(currentSongIndex);
    playSong();
});

// Jalankan saat pertama kali dibuka
loadSong(currentSongIndex);
