const tracks = [
  {
    id: 1,
    title: "DJ Ghost",
    artist: "DJ Komang Rimex",
    meta: "DJ Komang Rimex • Justin Bieber • 2022",
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

let currentIndex = 0; // FIX: mulai dari 0 = DJ Ghost, bukan nomor 2 lagi
let isPlaying = false;
let isShuffle = false;
let repeatMode = 0;
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
  // FIX: reset progress ke 0 pas ganti lagu
  audio.src = track.src;
  audio.currentTime = 0;
  progressFill.style.width = '0%';
  currentTimeEl.textContent = '0:00';
  document.getElementById('totalTime').textContent = track.duration;
  renderPlaylist();
}

function renderPlaylist() {
  const pl = document.getElementById('playlist');
  pl.innerHTML = tracks.map((t,i) => `
    <div class="track ${i===currentIndex ? 'active' : ''}" data-index="${i}">
      <div class="track-thumb"><img src="${t.cover}" alt="" onerror="this.parentElement.innerHTML='🎵'"></div>
      <div class="track-info"><b>${t.title}</b><span>${t.artist} • ${t.duration}</span></div>
      <div class="track-time">${t.duration} ${i===currentIndex ? '<span style="margin-left:6px; width:6px; height:6px; background:var(--blue); border-radius:50%; display:inline-block; box-shadow:0 0 8px var(--blue)"></span>' : ''}</div>
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
  audio.play().catch(()=>{});
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
    let next = currentIndex;
    while (next === currentIndex && tracks.length > 1) next = Math.floor(Math.random()*tracks.length);
    currentIndex = next;
  } else {
    currentIndex = (currentIndex + 1) % tracks.length;
  }
  loadTrack(currentIndex);
  if (isPlaying) play();
}
function prevTrack() {
  if (isShuffle) {
    let prev = currentIndex;
    while (prev === currentIndex && tracks.length > 1) prev = Math.floor(Math.random()*tracks.length);
    currentIndex = prev;
  } else {
    currentIndex = (currentIndex - 1 + tracks.length) % tracks.length;
  }
  loadTrack(currentIndex);
  if (isPlaying) play();
}

audio.addEventListener('timeupdate', () => {
  if (!audio.duration) return;
  progressFill.style.width = (audio.currentTime/audio.duration*100) + '%';
  currentTimeEl.textContent = formatTime(audio.currentTime);
});
audio.addEventListener('loadedmetadata', () => {
  // FIX: pas metadata ke-load, jangan langsung 2:14, tetap 0:00 kalo belum play
  if (audio.currentTime < 0.5) {
    totalTimeEl.textContent = formatTime(audio.duration);
    currentTimeEl.textContent = '0:00';
    progressFill.style.width = '0%';
  } else {
    totalTimeEl.textContent = formatTime(audio.duration);
  }
});
audio.addEventListener('ended', () => {
  if (repeatMode === 2) { audio.currentTime=0; play(); }
  else if (repeatMode === 1) { nextTrack(); }
  else { if (currentIndex < tracks.length-1) nextTrack(); else { pause(); audio.currentTime=0; progressFill.style.width='0%'; currentTimeEl.textContent='0:00'; } }
});
progressBar.addEventListener('click', (e) => {
  const rect = progressBar.getBoundingClientRect();
  audio.currentTime = ((e.clientX-rect.left)/rect.width)*audio.duration;
});
document.getElementById('shuffleBtn').addEventListener('click', (e) => {
  isShuffle = !isShuffle;
  e.currentTarget.classList.toggle('active', isShuffle);
  document.getElementById('shuffleState').textContent = isShuffle ? 'on' : 'off';
});
document.getElementById('repeatBtn').addEventListener('click', (e) => {
  repeatMode = (repeatMode + 1) % 3;
  const btn = e.currentTarget;
  btn.classList.toggle('active', repeatMode !== 0);
  btn.style.position = 'relative';
  if (repeatMode === 0) { btn.title = "Repeat Off"; btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>`; }
  else if (repeatMode === 1) { btn.title = "Repeat All"; btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg><span style="position:absolute; bottom:-4px; right:-4px; background:var(--blue); color:#fff; border-radius:50%; width:12px; height:12px; font-size:8px; display:flex; align-items:center; justify-content:center; font-weight:700;">A</span>`; }
  else { btn.title = "Repeat One"; btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg><span style="position:absolute; bottom:-4px; right:-4px; background:var(--blue); color:#fff; border-radius:50%; width:12px; height:12px; font-size:8px; display:flex; align-items:center; justify-content:center; font-weight:700;">1</span>`; }
});
document.getElementById('volumeSlider')?.addEventListener('input', (e) => audio.volume = e.target.value);
function formatTime(s){ if(isNaN(s)) return '0:00'; const m=Math.floor(s/60); const sec=Math.floor(s%60).toString().padStart(2,'0'); return `${m}:${sec}`; }

// THEME TOGGLE - Light default putih elegan
const themeBtn = document.getElementById('themeBtn');
function applyTheme(theme) {
  document.body.className = theme;
  localStorage.setItem('kng-theme', theme);
}
const savedTheme = localStorage.getItem('kng-theme') || 'light';
applyTheme(savedTheme);
themeBtn.addEventListener('click', () => {
  const newTheme = document.body.classList.contains('light') ? 'dark' : 'light';
  applyTheme(newTheme);
});

// INIT - FIX first open bug
loadTrack(currentIndex);
progressFill.style.width = '0%';
currentTimeEl.textContent = '0:00';
totalTimeEl.textContent = tracks[0].duration;
if(document.getElementById('volumeSlider')) audio.volume = 0.8;
