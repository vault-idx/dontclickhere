/* ---------------------------------------------------------
   SOUND SOURCES (ROYALTY FREE)
----------------------------------------------------------*/

/* Suspense background music */
const musicURL = "https://cdn.pixabay.com/audio/2022/03/28/audio_18ba153558.mp3";

/* Typewriter click sound */
const typeURL = "https://cdn.pixabay.com/audio/2022/03/15/audio_4f4d9021e5.mp3";

/* Emergency alarm */
const alarmURL = "https://cdn.pixabay.com/audio/2021/08/04/audio_0653514e58.mp3";

/* Mist texture */
const mistImgURL = "https://i.ibb.co/3mCrwvN/smoke-texture.png"; 



/* ---------------------------------------------------------
   ASSIGN SOUNDS TO HTML ELEMENTS
----------------------------------------------------------*/
document.getElementById("bgMusic").src = musicURL;
document.getElementById("typeSound").src = typeURL;
document.getElementById("alarmSound").src = alarmURL;



/* ---------------------------------------------------------
   GLOBAL ELEMENTS
----------------------------------------------------------*/
const firstText = document.getElementById("firstText");
const secondText = document.getElementById("secondText");
const redBtn = document.getElementById("redBtn");
const greenBtn = document.getElementById("greenBtn");
const buttonArea = document.querySelector(".button-area");
const emergencyFlash = document.getElementById("emergencyFlash");
const mistCanvas = document.getElementById("mistCanvas");
const finalReveal = document.getElementById("finalReveal");
const glowNote = document.getElementById("glowNote");
const qrImage = document.getElementById("qrImage");
const passwordText = document.getElementById("passwordText");
const copyPass = document.getElementById("copyPass");



/* ---------------------------------------------------------
   QR CODE GENERATE (auto)
----------------------------------------------------------*/
qrImage.src = "https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=" 
                + encodeURIComponent("https://github.com/rssourav/Surprise");



/* ---------------------------------------------------------
   FINAL NOTE + PASSWORD
----------------------------------------------------------*/
glowNote.textContent =
"Open the QR code on a laptop or desktop. If you're using a phone, enable desktop mode from the three-dot menu before scanning — and of course, open it alone.";

passwordText.textContent = "20.11.2001";



/* ---------------------------------------------------------
   TYPEWRITER FUNCTION
----------------------------------------------------------*/
function typeWriter(element, text, speed = 70, callback = null) {
    let i = 0;
    element.style.opacity = 1;

    let interval = setInterval(() => {
        element.textContent += text.charAt(i);

        /* play type sound */
        const tSound = document.getElementById("typeSound");
        tSound.currentTime = 0;
        tSound.play();

        i++;
        if (i >= text.length) {
            clearInterval(interval);
            if (callback) setTimeout(callback, 600);
        }
    }, speed);
}



/* ---------------------------------------------------------
   ON PAGE LOAD → AUTOPLAY MUSIC + FIRST TEXT
----------------------------------------------------------*/
window.onload = () => {
    const bgMusic = document.getElementById("bgMusic");
    bgMusic.volume = 0.45;
    bgMusic.play().catch(() => {});

    firstSequence();
};



/* ---------------------------------------------------------
   FIRST SEQUENCE: FIRST TEXT → BUTTON SHOW → SECOND TEXT
----------------------------------------------------------*/
function firstSequence() {

    /* first message */
    typeWriter(firstText,
        "Do you want to know what lies behind the darkness?",
        65,
        () => {

            buttonArea.classList.add("show");

            /* second message */
            typeWriter(secondText,
                "If yes, press the red button. If not, press the green button.",
                60
            );
        }
    );
}



/* ---------------------------------------------------------
   GREEN BUTTON ESCAPE SYSTEM
----------------------------------------------------------*/
let greenClicks = 0;

greenBtn.addEventListener("mouseenter", moveGreen);
greenBtn.addEventListener("click", moveGreen);

function moveGreen() {

    greenClicks++;

    /* move button randomly */
    const x = Math.random() * (window.innerWidth - 120);
    const y = Math.random() * (window.innerHeight - 120);

    greenBtn.style.position = "fixed";
    greenBtn.style.left = x + "px";
    greenBtn.style.top = y + "px";

    /* red glow */
    redBtn.classList.add("glowRed");
    setTimeout(() => redBtn.classList.remove("glowRed"), 300);

    /* after 6 tries → show warning (if red not clicked yet) */
    if (greenClicks === 6) {
        typeWriter(secondText,
            "Maybe the green button doesn’t want to let you click it… try the other button.",
            60
        );
    }
}



/* ---------------------------------------------------------
   RED BUTTON CLICK → EMERGENCY FLASH SEQUENCE
----------------------------------------------------------*/
redBtn.addEventListener("click", () => {

    /* stop second message from showing more text */
    greenClicks = 9999;

    emergencyFlash.classList.add("flashAnimate");

    const alarm = document.getElementById("alarmSound");
    alarm.volume = 0.9;
    alarm.play();

    /* after 6 seconds, fade to dark + start mist */
    setTimeout(() => {
        emergencyFlash.classList.remove("flashAnimate");

        fadeToDark();
    }, 6000);
});



/* ---------------------------------------------------------
   DARK FADE BEFORE MIST
----------------------------------------------------------*/
function fadeToDark() {

    firstText.style.opacity = 0;
    secondText.style.opacity = 0;
    buttonArea.style.opacity = 0;

    setTimeout(startMist, 2000);
}



/* ---------------------------------------------------------
   MIST RISING + SCRATCH ENABLE
----------------------------------------------------------*/
function startMist() {

    mistCanvas.style.display = "block";

    /* load mist texture */
    const img = new Image();
    img.src = mistImgURL;

    img.onload = () => {
        const ctx = mistCanvas.getContext("2d");
        mistCanvas.width = window.innerWidth;
        mistCanvas.height = window.innerHeight;

        /* fill canvas with mist texture */
        ctx.drawImage(img, 0, 0, mistCanvas.width, mistCanvas.height);

        mistCanvas.classList.add("riseMist");

        setTimeout(() => {
            enableScratch(img);
        }, 6500);
    };
}



/* ---------------------------------------------------------
   SCRATCH EFFECT SYSTEM
----------------------------------------------------------*/
function enableScratch(img) {

    const ctx = mistCanvas.getContext("2d");

    mistCanvas.addEventListener("mousemove", scratch);
    mistCanvas.addEventListener("touchmove", scratch);

    function scratch(e) {
        const rect = mistCanvas.getBoundingClientRect();
        const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
        const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;

        ctx.globalCompositeOperation = "destination-out";

        ctx.beginPath();
        ctx.arc(x, y, 45, 0, Math.PI * 2);
        ctx.fill();

        /* show final QR */
        finalReveal.classList.add("show");
    }
}



/* ---------------------------------------------------------
   PASSWORD COPY BUTTON
----------------------------------------------------------*/
copyPass.addEventListener("click", () => {
    navigator.clipboard.writeText(passwordText.textContent);
    copyPass.textContent = "Copied!";
    setTimeout(() => copyPass.textContent = "Copy", 1500);
});
