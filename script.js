let apiKey = "AIzaSyBZRtoUoVkUfKD3bCkwdWDwU5U5sDQQKaU";

let player;

let searchBtn = document.getElementById("searchBtn");
let searchInput = document.getElementById("searchInput");
let title = document.getElementById("songTitle");

let recentSongs = [];

let recommendedSongs = [
"Arijit Singh songs",
"lofi chill music",
"workout songs",
"sad songs",
"romantic songs"
];


// LOAD YOUTUBE PLAYER

function onYouTubeIframeAPIReady(){

player = new YT.Player('player',{

height:'0',
width:'0',

events:{
'onStateChange': onPlayerStateChange
}

});

renderRecommended();

}



// VIDEO END

function onPlayerStateChange(event){

if(event.data === 0){

playRecommended();

}

}



// PLAY VIDEO

function playYouTube(videoId){

player.loadVideoById(videoId);

}



// SEARCH YOUTUBE

async function searchYouTube(query){

let url =
`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${apiKey}&type=video&maxResults=1`;

let res = await fetch(url);

let data = await res.json();

let videoId = data.items[0].id.videoId;

let videoTitle = data.items[0].snippet.title;

title.innerText = videoTitle;

playYouTube(videoId);

addRecent(videoTitle);

}



// AI MOOD

function detectMood(text){

text = text.toLowerCase();

if(text.includes("sad")) return "sad songs";

if(text.includes("chill")) return "lofi chill music";

if(text.includes("gym") || text.includes("workout")) return "workout music";

return text;

}



// SEARCH BUTTON

searchBtn.addEventListener("click",function(){

let query = searchInput.value;

let moodQuery = detectMood(query);

searchYouTube(moodQuery);

});



// RECENT SONGS

function addRecent(song){

recentSongs.unshift(song);

if(recentSongs.length > 6){

recentSongs.pop();

}

renderRecent();

}


function renderRecent(){

let container = document.getElementById("recentSongs");

container.innerHTML = "";

recentSongs.forEach(function(song){

let div = document.createElement("div");

div.className = "songCard";

div.innerText = song;

div.onclick = function(){

searchYouTube(song);

};

container.appendChild(div);

});

}



// RECOMMENDED

function renderRecommended(){

let container = document.getElementById("recommendedSongs");

container.innerHTML = "";

recommendedSongs.forEach(function(song){

let div = document.createElement("div");

div.className = "songCard";

div.innerText = song;

div.onclick = function(){

searchYouTube(song);

};

container.appendChild(div);

});

}



// AUTOPLAY NEXT

function playRecommended(){

let randomIndex = Math.floor(Math.random()*recommendedSongs.length);

let nextSong = recommendedSongs[randomIndex];

searchYouTube(nextSong);

}



// VOICE ASSISTANT

let recognition = new webkitSpeechRecognition();

recognition.lang = "en-US";

function startVoice(){

recognition.start();

}

recognition.onresult = function(event){

let voiceText = event.results[0][0].transcript;

searchInput.value = voiceText;

let moodQuery = detectMood(voiceText);

searchYouTube(moodQuery);

};