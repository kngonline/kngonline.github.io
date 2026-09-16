const playlistData = [
   {
        title: "Angel Baby",
        artist: "DJ Komang Rimex • Troye Sivan",
        duration: "4:24",
        cover: "assets/img/DJ-Komang-Rimex.jpeg",
        audio: "assets/mp3/DJ-Komang-Rimex-DJ-Angel-Baby.mp3"
    },
    {
        title: "APT.",
        artist: "DJ Komang Rimex • Rose ft Bruno Mars",
        duration: "4:22",
        cover: "assets/img/DJ-Komang-Rimex.jpeg",
        audio: "assets/mp3/DJ-Komang-Rimex-DJ-APT.mp3"
    },
    {
        title: "Ghost",
        artist: "DJ Komang Rimex • Justin Bieber",
        duration: "3:47",
        cover: "assets/img/DJ-Komang-Rimex.jpeg",
        audio: "assets/mp3/DJ-Komang-DJ-Ghost.mp3"
    },
    {
        title: "Hold On",
        artist: "DJ Komang Rimex • Chord Overstreet",
        duration: "4:21",
        cover: "assets/img/DJ-Komang-Rimex.jpeg",
        audio: "assets/mp3/DJ-Komang-Rimex-DJ-Hold-On.mp3"
    },
    {
        title: "I Don't Know Why",
        artist: "DJ Komang Rimex • Moony, Alessandro Viale, DJ Ross",
        duration: "4:27",
        cover: "assets/img/DJ-Komang-Rimex.jpeg",
        audio: "assets/mp3/DJ-Komang-Rimex-I-Dont-Know-Why.mp3"
    },
    {
        title: "Last Friday Night (T.G.I.F.)",
        artist: "DJ Komang Rimex • Katy Perry",
        duration: "4:02",
        cover: "assets/img/DJ-Komang-Rimex.jpeg",
        audio: "assets/mp3/DJ-Komang-Rimex-DJ-Last-Friday-Night.mp3"
    },
    {
        title: "Let Her GO",
        artist: "DJ Komang Rimex • Passager",
        duration: "4:01",
        cover: "assets/img/DJ-Komang-Rimex.jpeg",
        audio: "assets/mp3/DJ-Komang-Rimex-DJ-Let-Her-Go.mp3"
    },
    {
        title: "Night Change",
        artist: "DJ Komang Rimex • One Direction",
        duration: "4:15",
        cover: "assets/img/DJ-Komang-Rimex.jpeg",
        audio: "assets/mp3/DJ-Komang-DJ-Night-Change.mp3"
    },
    {
        title: "Silence",
        artist: "DJ Komang Rimex • Marshmello, Khalid",
        duration: "4:12",
        cover: "assets/img/DJ-Komang-Rimex.jpeg",
        audio: "assets/mp3/DJ-Komang-Rimex-DJ-Silence.mp3"
    },
    {
        title: "Starship",
        artist: "DJ Komang Rimex • Nicki Minaj",
        duration: "4:01",
        cover: "assets/img/DJ-Komang-Rimex.jpeg",
        audio: "assets/mp3/DJ-Komang-Rimex-DJ-Starship.mp3"
    },
    {
        title: "Strong",
        artist: "DJ Komang Rimex • One Direction",
        duration: "4:01",
        cover: "assets/img/DJ-Komang-Rimex.jpeg",
        audio: "assets/mp3/DJ-Komang-Rimex-DJ-Strong.mp3"
    },
    {
        title: "Teenage Monalisa",
        artist: "DJ Komang Rimex • Alfie Castley",
        duration: "4:08",
        cover: "assets/img/DJ-Komang-Rimex.jpeg",
        audio: "assets/mp3/DJ-Komang-Rimex-DJ-Teenage-Monalisa.mp3"
    },
    {
        title: "Wrecking Ball",
        artist: "DJ Komang Rimex • Miley Cyrus",
        duration: "4:30",
        cover: "assets/img/DJ-Komang-Rimex.jpeg",
        audio: "assets/mp3/DJ-Komang-Rimex-DJ-Wrecking-Ball.mp3"
    }
];

let currentSongIndex = 0;
let isShuffle = false;
let repeatMode = 0; // 0 = Off, 1 = Repeat All, 2 = Repeat 1

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

// Tombol Multi-Repeat (0 -> 1 -> 2)
repeatBtn.addEventListener('click', () => {
    repeatMode = (repeatMode + 1) % 3;
    
    if (repeatMode === 0) {
        repeatBtn.style.color = '#8c9ac2';
        repeatBtn.style.textShadow = 'none';
        repeatIndicator.style.display = 'none';
    } else if (repeatMode === 1) {
        repeatBtn.style.color = '#0099ff';
        repeatBtn.style.textShadow = '0 0 10px rgba(0, 153, 255, 0.6)';
        repeatIndicator.style.display = 'none';
    } else if (repeatMode === 2) {
        repeatBtn.style.color = '#0099ff';
        repeatBtn.style.textShadow = '0 0 10px rgba(0, 153, 255, 0.6)';
        repeatIndicator.style.display = 'block';
    }
});

// Logika Habis Lagu
audio.addEventListener('ended', () => {
    if (repeatMode === 2) {
        audio.currentTime = 0;
        playSong();
    } else if (repeatMode === 1) {
        nextSong();
    } else {
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

// Share Sosmed Aktif
const currentUrl = window.location.href;
const shareText = "Dengarkan musik keren di KNG ONLINE!";

document.getElementById('shareFB').href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
document.getElementById('shareMsg').href = `fb-messenger://share?link=${encodeURIComponent(currentUrl)}`;
document.getElementById('shareWA').href = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + currentUrl)}`;

document.getElementById('shareBtn').addEventListener('click', () => {
    if (navigator.share) {
        navigator.share({
            title: 'KNG ONLINE',
            text: shareText,
            url: currentUrl,
        }).catch(() => {});
    } else {
        alert("Link web disalin / silakan bagikan: " + currentUrl);
    }
});

loadSong(currentSongIndex);
