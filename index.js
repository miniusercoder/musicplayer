let offset = 0;
let count = 0;
let seed = Math.floor(Math.random() * 100000);
let audio_tag = document.getElementById("audio");
let pause = document.getElementById("pause");
let download = document.getElementById("download");
let seed_input = document.getElementById("seed");
let track_number = document.getElementById("track_number");
seed_input.value = seed;
track_number.value = offset;

function getAudio() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "getAudio.php?offset=" + offset + "&seed=" + seed, true);
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            let response = xhr.responseText;
            console.log(response);
            if (response === "error") {
                offset = 0;
                seed = Math.floor(Math.random() * 100000);
                seed_input.value = seed;
                getAudio();
                return 0;
            }
            response = JSON.parse(xhr.responseText);
            count = response.count;
            let audio = response.audio;
            track_number.value = offset + 1;
            offset = response.offset;
            audio_tag.src = "playlist/" + audio.track;
            document.title = audio.tags.artist[0] + " - " + audio.tags.title[0];
            document.getElementById("author").innerText = audio.tags.artist[0];
            document.getElementById("name").innerText = audio.tags.title[0];
            document.getElementById("fullname").innerText = audio.tags.artist[0] + " - " + audio.tags.title[0];
            document.getElementById("album").innerText = audio.tags.album[0];
            audio_tag.onended = function () {
                offset = +offset + 1;
                getAudio()
            };
            audio_tag.oncanplay = function () {
                audio_tag.play();
            };
            console.log(audio);
        }
    }
}

getAudio();


document.getElementById("next").onclick = function () {
    offset = +offset + 1;
    getAudio();
};
document.getElementById("previous").onclick = function () {
    if (offset - 1 >= 0) {
        offset = +offset - 1;
        getAudio();
    }
};
pause.onclick = function () {
    if (audio_tag.paused === true)
        audio_tag.play();
    else
        audio_tag.pause();
};
audio_tag.onplay = function () {
    pause.innerText = "Pause";
};
audio_tag.onpause = function () {
    pause.innerText = "Play";
};
download.onclick = function () {
    let link = document.createElement("a");
    link.href = audio_tag.src;
    link.download = document.getElementById("fullname").innerText + ".mp3";
    link.click();
};
seed_input.onchange = function () {
    seed = seed_input.value;
    getAudio();
};
track_number.onchange = function () {
    if (track_number.value <= 0)
        track_number.value = 1;
    if (track_number.value > count)
        track_number.value = 1;
    offset = track_number.value - 1;
    getAudio();
};
document.onkeydown = function (event) {
    if (event.code === "Space") {
        if (audio_tag.paused === true)
            audio_tag.play();
        else
            audio_tag.pause();
    }
};