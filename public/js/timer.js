let startTime = performance.now();
// let timeTotal = (2 * 60) + 56; // Bspw.: Zeit = 2:56
let timeTotal = 10; // Bspw.: Zeit = 2:56
let sbTimerElement = document.getElementById('sb-timer');
let durationInMs = timeTotal * 1000;

function updateTimer(now) {
    let elapsed = now - startTime;
    let remaining = Math.max(0, durationInMs - elapsed);

    let totalSeconds = Math.floor(remaining / 1000);
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;
    let timerText = (minutes.toString().padStart(2, "0")) + ':' + (seconds.toString().padStart(2, "0"));
    sbTimerElement.textContent = timerText;

    // Activate blinking in the last 6 seconds.
    // Blinking from 6 remaining seconds on looks better, than blinking from 5 remaining seconds on.
    // The duration of the blink animation is 11 seconds. This is defined in the css animation.
    if(minutes === 0 && seconds <= 6) {
        if(!sbTimerElement.classList.contains('timer-end-blink')) {
            sbTimerElement.classList.add('timer-end-blink');
        }
    }

    // If the timer reached the end, display a red color instead of the green one.
    if(timerText === '00:00') {
        sbTimerElement.style.color = '#900';
    }

    if(remaining > 0) {
        requestAnimationFrame(updateTimer);
    } else {
        sbTimerElement.textContent = "00:00";
    }
}

requestAnimationFrame(updateTimer);