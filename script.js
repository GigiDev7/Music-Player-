
const wrapper = document.querySelector('.wrapper')
const musicImg = wrapper.querySelector('.img-area img')
const musicName = wrapper.querySelector('.song-details .name')
const musicArtist = wrapper.querySelector('.song-details .artist')
const mainAudio = wrapper.querySelector('#main-audio')
const playPauseBtn = wrapper.querySelector('.play-pause')
const prevBtn = wrapper.querySelector('#prev')
const nextBtn = wrapper.querySelector('#next')
const progressArea = wrapper.querySelector('.progress-area')
const progressBar = wrapper.querySelector('.progress-bar')
const showMoreBtn =  wrapper.querySelector('#more-music')
const hideMusicBtn =  wrapper.querySelector('#close')
const musicList =  wrapper.querySelector('.music-list')


let musicIndex = Math.floor((Math.random() * allMusic.length) + 1)

// load music
const loadMusic = (indexNumb) => {
    musicName.innerText = allMusic[indexNumb - 1].name
    musicArtist.innerText = allMusic[indexNumb - 1].artist
    musicImg.src = `imgs/${allMusic[indexNumb - 1].img}.jpg`
    mainAudio.src = `songs/${allMusic[indexNumb - 1].src}.mp3`
}

window.addEventListener('load', () => {
    loadMusic(musicIndex)
    playingNow()
})

//play pause music
const playMusic = () => {
    wrapper.classList.add('paused')
    playPauseBtn.querySelector('i').innerText = 'pause'
    mainAudio.play()
}

const pauseMusic = () => {
    wrapper.classList.remove('paused')
    playPauseBtn.querySelector('i').innerText = 'play_arrow'
    mainAudio.pause()
}


playPauseBtn.addEventListener('click', () => {
    const isMusicPaused = wrapper.classList.contains('paused')
    isMusicPaused ? pauseMusic() : playMusic()
    playingNow()
})

//next music

const nextMusic = () => {
    musicIndex ++
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex
    loadMusic(musicIndex)
    playMusic()
    playingNow()
}

nextBtn.addEventListener('click', () => {
    nextMusic()
})


// Prev music

const prevMusic = () => {
    musicIndex --
    musicIndex < 1 ?  musicIndex = allMusic.length : musicIndex = musicIndex
    loadMusic(musicIndex)
    playMusic()
    playingNow()
}

prevBtn.addEventListener('click', () => {
    prevMusic()
})


// update progress bar duration time and current time 

mainAudio.addEventListener('timeupdate', e => {
    const currentTime = e.target.currentTime
    const duration = e.target.duration
    let progressWidth = (currentTime / duration) * 100
    progressBar.style.width = `${progressWidth}%`

    let musicCurrentTime = wrapper.querySelector('.current')
    let musicDuration = wrapper.querySelector('.duration')

    mainAudio.addEventListener('loadeddata', () => {
        
        let audioDuration = mainAudio.duration
        let totalMin = Math.floor(audioDuration / 60)
        let totalSec = Math.floor(audioDuration % 60)
        if(totalSec < 10){
            totalSec = `0${totalSec}`
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`
    })
    let currentMin = Math.floor(currentTime / 60)
    let currentSec = Math.floor(currentTime % 60)
    if(currentSec < 10){
        currentSec = `0${currentSec}`
    }
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`
})


// update playing song current time according progress bar width
progressArea.addEventListener('click', e => {
    let progressWidthVal = progressArea.clientWidth
    let clickedOffSetX = e.offsetX
    let songDuration = mainAudio.duration

    mainAudio.currentTime = (clickedOffSetX / progressWidthVal) * songDuration
    playMusic()
})


// repeat, shuffle

const repeatBtn = wrapper.querySelector('#repeat-plist')
repeatBtn.addEventListener('click', () => {
    let getText = repeatBtn.innerText
    switch(getText){
        case 'repeat': 
            repeatBtn.innerText = 'repeat_one'
            repeatBtn.setAttribute('title','Song looped')
            break;
        case 'repeat_one':
            repeatBtn.innerText = 'shuffle'
            repeatBtn.setAttribute('title','Playback shuffle')
            break;
        case 'shuffle':
            repeatBtn.innerText = 'repeat'
            repeatBtn.setAttribute('title','Playlist looped')
            break;
    }
})


mainAudio.addEventListener('ended', () => {
    let getText = repeatBtn.innerText
    switch(getText){
        case 'repeat': 
            nextMusic()
            break;
        case 'repeat_one':
            mainAudio.currentTime = 0
            loadMusic(musicIndex)
            playMusic()
            break;
        case 'shuffle':
            let randIndex = Math.floor((Math.random() * allMusic.length) + 1)
            do {
                randIndex = Math.floor((Math.random() * allMusic.length) + 1)
            }while(musicIndex == randIndex) 
            musicIndex = randIndex
            loadMusic(musicIndex)
            playMusic()
            playingNow()
            break;
    }
})

// show hide buttons

showMoreBtn.addEventListener('click', () => {
    musicList.classList.toggle('show')
})

hideMusicBtn.addEventListener('click', () => {
    showMoreBtn.click()
})


const ulTag = wrapper.querySelector('ul')

for(let i = 0; i < allMusic.length; i++){
    let liTag = `<li li-index="${i + 1}">
                    <div class="row">
                        <span>${allMusic[i].name}</span>
                        <p>${allMusic[i].artist}</p>
                    </div>
                    <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
                    <span id="${allMusic[i].src}" class="audio-duration">9:03</span>
                </li>`

    ulTag.insertAdjacentHTML('beforeend',liTag)  
    
    let liAudioTagDuration = ulTag.querySelector(`#${allMusic[i].src}`)
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`)

    liAudioTag.addEventListener('loadeddata', () => {
        let audioDuration = liAudioTag.duration
        let totalMin = Math.floor(audioDuration / 60)
        let totalSec = Math.floor(audioDuration % 60)
        if(totalSec < 10){
            totalSec = `0${totalSec}`
        }
        liAudioTagDuration.innerText = `${totalMin}:${totalSec}`
        liAudioTagDuration.setAttribute('t-duration', `${totalMin}:${totalSec}`)
    })
}


// play song on click on music list

const allLiTags = ulTag.querySelectorAll('li')
function playingNow(){
    for(let k = 0; k < allLiTags.length; k++){

        let audioTag = allLiTags[k].querySelector('.audio-duration')

        if(allLiTags[k].classList.contains('playing')){
            allLiTags[k].classList.remove('playing')
            let adDuration = audioTag.getAttribute('t-duration')
            audioTag.innerText = adDuration
        }

        if(allLiTags[k].getAttribute('li-index') == musicIndex){
            allLiTags[k].classList.add('playing')
            audioTag.innerText = 'Playing'
        }

        allLiTags[k].setAttribute('onclick', 'clicked(this)')
    }
}

function clicked(element){
    let getLiIndex = element.getAttribute('li-index')
    musicIndex = getLiIndex
    loadMusic(musicIndex)
    playMusic()
    playingNow()
}
