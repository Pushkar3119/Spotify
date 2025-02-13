let currentsong = new Audio();
let currentSongIndex = 0; // Index of the currently playing song
let songs = []; // This will be populated by the `getsongs` function

async function getsongs() {
    let a = await fetch("http://127.0.0.1:5500/songs/");
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1]);
        }
    }
    return songs;
}
const slider = document.getElementById("progress-slider");
const circle = document.querySelector(".circle");

// Update the slider max value and duration when the song metadata loads
currentsong.addEventListener("loadedmetadata", () => {
    slider.max = Math.floor(currentsong.duration);
    slider.value = 0; // Start at the beginning
});

// Update slider and circle position as the song plays
currentsong.addEventListener("timeupdate", () => {
    slider.value = Math.floor(currentsong.currentTime);
    const percentage = (currentsong.currentTime / currentsong.duration) * 100;
    circle.style.left = `${percentage}%`;
});

// Seek the song when the slider value changes
slider.addEventListener("input", () => {
    currentsong.currentTime = slider.value;
    const percentage = (slider.value / slider.max) * 100;
    circle.style.left = `${percentage}%`;
});

// Optional: Pause while dragging the slider and resume on release
slider.addEventListener("mousedown", () => {
    currentsong.pause();
});
slider.addEventListener("mouseup", () => {
    currentsong.play();
});


const volumebutton = document.querySelector(".volumebutton");
const volumeinde = document.querySelector(".volumeinde");
const maxVolumeWidth = 70; // Width of the volume bar

let isDragging = false;

// Update volume based on the button's position
function updateVolume(position) {
    let percentage = Math.max(0, Math.min(position / maxVolumeWidth, 1));
    currentsong.volume = percentage;
    volumebutton.style.left = `${percentage * maxVolumeWidth + 23}px`;
}

// Dragging starts
volumebutton.addEventListener("mousedown", () => {
    isDragging = true;
});

// Dragging ends
document.addEventListener("mouseup", () => {
    isDragging = false;
});

// While dragging
document.addEventListener("mousemove", (e) => {
    if (isDragging) {
        let rect = volumeinde.getBoundingClientRect();
        let position = e.clientX - rect.left;
        updateVolume(position);
    }
});

// Initialize with default volume
currentsong.volume = 0.5; // Default: 50%
updateVolume(currentsong.volume * maxVolumeWidth);




const playmusic = (track,play=true) => {
    currentsong.src = "http://127.0.0.1:5500/songs/" + decodeURI(track);
    if(play){
        currentsong.play();

        // Update the Play/Pause button
        ood.src = "pause.svg";
    }
   

    // Update song info and duration
    document.getElementById('songinfo').innerHTML = decodeURI(track);
    document.getElementById('songtime').innerHTML = "0:00"; // Update dynamically as the song plays

    // Update the progress bar circle
    const circle = document.querySelector(".circle");
    currentsong.addEventListener("timeupdate", () => {
        let minutes = Math.floor(currentsong.currentTime / 60);
        let seconds = Math.floor(currentsong.currentTime % 60);
        let totalminutes = Math.floor(currentsong.duration/60);totalminutes
        let totalsecounds = Math.floor(currentsong.duration%60);
        let formattedtotaltime = `${totalminutes}:${totalsecounds<10?'0'+totalsecounds:totalsecounds}`;
        let formattedTime = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
        document.getElementById('songtime').innerHTML = `${formattedTime} / ${formattedtotaltime}`;
        const progress = (currentsong.currentTime / currentsong.duration) * 100;
        circle.style.left = `${progress}%`;
    });
};

document.getElementById("next").addEventListener("click", () => {
    // Increment the song index
    currentSongIndex = (currentSongIndex + 1) % songs.length; // Wrap around if it exceeds the list
    playmusic(songs[currentSongIndex]);
});

document.getElementById("prev").addEventListener("click", () => {
    // Decrement the song index
    currentSongIndex =
        (currentSongIndex - 1 + songs.length) % songs.length; // Wrap around if it goes below 0
    playmusic(songs[currentSongIndex]);
});
const Left = document.getElementsByClassName("left")[0]; // Get the first element with the class 'left'
const hamburger = document.getElementsByClassName("hamburger")[0]; // Get the first element with the class 'hamburger'
const home = document.getElementsByClassName("home")[0]; // Get the first element with the class 'home'
const footer = document.getElementsByClassName("footer")[0]; // Get the first element with the class 'footer'
const Crr = document.getElementsByClassName("cross")[0]; // Get the first element with the class 'cross'
const Above = document.getElementsByClassName("abovebar")[0];
hamburger.addEventListener("click", () => {
    // Show the 'left' element and update its styles
    Left.style.display = "block";
    Left.style.left = "0%";
    Left.style.zIndex = "3";
    Left.style.width = "min-content";
    Left.style.opacity = "1"; // Make it fully visible
    Left.style.visibility = "visible"; // Make it fully visible
    Above.style.visibility =
    // Show the 'cross' element and apply its styles
    Crr.style.display = "block";
    Crr.style.top = "24px";
    Crr.style.position = "absolute";
    Crr.style.left = "313px";
    Crr.style.cursor = "pointer";
    
    // Hide the 'footer' element
    footer.style.display = "none";
});

// Hide the 'left' element with a smooth transition when the 'cross' is clicked
Crr.addEventListener("click", () => {
    Left.style.opacity = "0"; // Fade out
    Left.style.visibility = "hidden"; // Hide element after fade-out
    Left.style.left = "-100%"; // Slide it out of the screen

    // Optionally, delay the removal of the 'left' display for a smoother transition
    setTimeout(() => {
        Left.style.display = "none"; // Hide the element after the transition is complete
        Crr.style.display = "none"; // Hide the 'cross' element
    }, 300); // 300ms (same duration as the transition)
});





async function main() {
    songs = await getsongs(); // Populate the songs array
    console.log(songs);
    playmusic(songs[0],false);

    // Populate the song list
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songul.innerHTML += `
        <li>
          <img class="invert" src="music.svg" alt="">
          <div class="info">
            <div>${song.replaceAll("%20", " ")}</div>
            <div>Song Artist</div>
          </div>
          <div class="playnow">
            <span>Play Now</span>
            <img class="invert" src="playlist.svg" alt="">
          </div>
        </li>`;
    }

    // Add click listeners to each song in the list
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach((e, index) => {
        e.addEventListener("click", () => {
            currentSongIndex = index; // Set the clicked song as the current song
            playmusic(songs[currentSongIndex]);
        });
    });

    // Play/Pause button functionality
    ood.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play();
            ood.src = "pause.svg";
        } else {
            currentsong.pause();
            ood.src = "playlist.svg";
        }
    });
}

main();
