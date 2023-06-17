let songs = [];
let currentIndex = 0;
let player;

async function fetchSongs() {
  try {
    const response = await fetch('songs.json');
    const data = await response.json();
    songs = data;
    onYouTubeIframeAPIReady();
  } catch (error) {
    console.error('Error fetching songs:', error);
  }
}

fetchSongs();

function onYouTubeIframeAPIReady() {
  player = new YT.Player('youtubePlayer', {
    height: '360',
    width: '640',
    videoId: songs[currentIndex].link,
    playerVars: {
      'autoplay': 1
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });

  renderSongList();
}

function onPlayerReady(event) {
  const playButton = document.getElementById('playButton');
  playButton.addEventListener('click', () => {
    player.playVideo();
  });

  const pauseButton = document.getElementById('pauseButton');
  pauseButton.addEventListener('click', () => {
    player.pauseVideo();
  });

  const previousButton = document.getElementById('previousButton');
  previousButton.addEventListener('click', () => {
    playPreviousSong();
  });

  const nextButton = document.getElementById('nextButton');
  nextButton.addEventListener('click', () => {
    playNextSong();
  });

  updateControls();
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.ENDED) {
    playNextSong();
  }
}

function playNextSong() {
  if (currentIndex < songs.length - 1) {
    currentIndex++;
    player.loadVideoById(songs[currentIndex].link);
  }
  updateControls();
}

function playPreviousSong() {
  if (currentIndex > 0) {
    currentIndex--;
    player.loadVideoById(songs[currentIndex].link);
  }
  updateControls();
}

function updateControls() {
  const previousButton = document.getElementById('previousButton');
  const nextButton = document.getElementById('nextButton');
  previousButton.disabled = currentIndex === 0;
  nextButton.disabled = currentIndex === songs.length - 1;
}
function renderSongList() {
  const songList = document.getElementById('songList');
  songList.innerHTML = '';

  const ul = document.createElement('ul');

  songs.forEach((song, index) => {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.textContent = song.title;
    link.href = '#';
    link.addEventListener('click', () => {
      playSong(index);
    });

    li.appendChild(link);
    ul.appendChild(li);
  });

  songList.appendChild(ul);

  const listItems = songList.getElementsByTagName('li');
  for (let i = 0; i < listItems.length; i++) {
    listItems[i].classList.remove('active'); // Remove 'active' class from all list items
    if (i === currentIndex) {
      listItems[i].classList.add('active'); // Add 'active' class to the current index
    }
  }
}


function playSong(index) {
  currentIndex = index;
  player.loadVideoById(songs[currentIndex].link);
  updateControls();
}

const tag = document.createElement('script');
tag.src = 'https://www.youtube.com/iframe_api';
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
