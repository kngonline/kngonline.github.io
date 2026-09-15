const tracks = [
  {
    id: 1,
    title: "DJ Ghost",
    artist: "Justin Bieber",
    meta: "Justin Bieber • DJ Komang Rimex • 2022",
    duration: "3:48",
    src: "/mp3/DJ-Komang-DJ-Ghost.mp3",
    cover: "/img/DJ-Komang-Rimex.jpeg"
  },
  {
    id: 2,
    title: "Night Drive",
    artist: "Luma Coast",
    meta: "Luma Coast • Chillwave • 2024",
    duration: "3:42",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&h=600&fit=crop"
  },
  {
    id: 3,
    title: "Late Night Cruise",
    artist: "Luma Coast",
    meta: "Luma Coast • Lofi • 2024",
    duration: "3:58",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=600&fit=crop"
  },
  {
    id: 4,
    title: "Starlight Drift",
    artist: "Luma Coast",
    meta: "Luma Coast • Ambient • 2024",
    duration: "4:01",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    cover: "https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?w=600&h=600&fit=crop"
  },
  {
    id: 5,
    title: "Ocean Memory",
    artist: "Luma Coast",
    meta: "Luma Coast • Wave • 2024",
    duration: "3:25",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    cover: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600&h=600&fit=crop"
  }
];

let currentIndex = 1; // start at Night Drive like mockup
let isPlaying = false;
let isShuffle = false;
let repeatMode = 0; // 0 off, 1 all, 2 one
let audio = document.getElementById('audioPlayer');
let progressBar = document.getElementById('progressBar');
let progressFill = document.getElementById('progressFill');
let currentTimeEl = document.getElementById('currentTime');
let totalTimeEl = document.getElementById('totalTime');

function loadTrack(index) {
  const track = tracks[index];
  document.getElementById('songTitle').textContent = track.title;
  document.getElementById('songMeta').textContent = track.meta;
  document.getElementById('coverImg').src = track.cover;
  audio.src = track.src;
  document.getElementById('totalTime').textContent = track.duration;
  renderPlaylist();
}

function renderPlaylist() {
  const pl = document.getElementById('playlist');
  pl.innerHTML = tracks.map((t,i) => `
    <div class="track ${i===currentIndex ? 'active' : ''}" data-index="${i}">
      <div class="track-thumb"><img src="${t.cover}" alt=""></div>
      <div class="track-info"><b>${t.title}</b><span>${t.artist} • ${t.duration}</span></div>
      <div class="track-time">${t.duration} ${i===currentIndex ? '<span style="margin-left:6px; width:6px; height:6px; background:#38bdf8; border-radius:50%; display:inline-block; box-shadow:0 0 8px #38bdf8"></span>' : ''}</div>
    </div>
  `).join('');
  document.querySelectorAll('.track').forEach(el => {
    el.addEventListener('click', () => {
      currentIndex = parseInt(el.dataset.index);
      loadTrack(currentIndex);
      play();
    });
  });
  document.getElementById('playlistCount').textContent = tracks.length + ' Songs';
}

function play() {
  audio.play();
  isPlaying = true;
  document.querySelector('.icon-pause').classList.remove('hidden');
  document.querySelector('.icon-play').classList.add('hidden');
}
function pause() {
  audio.pause();
  isPlaying = false;
  document.querySelector('.icon-pause').classList.add('hidden');
  document.querySelector('.icon-play').classList.remove('hidden');
}

document.getElementById('playBtn').addEventListener('click', () => isPlaying ? pause() : play());
document.getElementById('nextBtn').addEventListener('click', () => nextTrack());
document.getElementById('prevBtn').addEventListener('click', () => prevTrack());

function nextTrack() {
  if (isShuffle) {
    currentIndex = Math.floor(Math.random()*tracks.length);
  } else {
    currentIndex = (currentIndex + 1) % tracks.length;
  }
  loadTrack(currentIndex);
  if (isPlaying) play();
}
function prevTrack() {
  currentIndex = (currentIndex - 1 + tracks.length) % tracks.length;
  loadTrack(currentIndex);
  if (isPlaying) play();
}

audio.addEventListener('timeupdate', () => {
  if (!audio.duration) return;
  const pct = (audio.currentTime / audio.duration) * 100;
  progressFill.style.width = pct + '%';
  currentTimeEl.textContent = formatTime(audio.currentTime);
});
audio.addEventListener('loadedmetadata', () => {
  totalTimeEl.textContent = formatTime(audio.duration);
});
audio.addEventListener('ended', () => {
  if (repeatMode === 2) { audio.currentTime=0; play(); }
  else if (repeatMode === 1 || true) { nextTrack(); } // autoplay next default
});
progressBar.addEventListener('click', (e) => {
  const rect = progressBar.getBoundingClientRect();
  const pct = (e.clientX - rect.left) / rect.width;
  audio.currentTime = pct * audio.duration;
});
document.getElementById('shuffleBtn').addEventListener('click', (e) => {
  isShuffle = !isShuffle;
  e.currentTarget.classList.toggle('active', isShuffle);
  document.getElementById('shuffleState').textContent = isShuffle ? 'on' : 'off';
});
document.getElementById('repeatBtn').addEventListener('click', (e) => {
  repeatMode = (repeatMode + 1) % 3;
  e.currentTarget.classList.toggle('active', repeatMode!==0);
});
document.getElementById('volumeSlider')?.addEventListener('input', (e) => {
  audio.volume = e.target.value;
});

function formatTime(s) {
  if (isNaN(s)) return '0:00';
  const m = Math.floor(s/60);
  const sec = Math.floor(s%60).toString().padStart(2,'0');
  return `${m}:${sec}`;
}

// init
loadTrack(currentIndex);
document.getElementById('volumeSlider') && (audio.volume = 0.8);

// Try autoplay on first user interaction
document.body.addEventListener('click', () => {
  if (!isPlaying) { /* don't auto */ }
}, {once:true});
