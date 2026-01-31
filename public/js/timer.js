export default class sbTimer {
    startTimer(secondsTotal) {
        this.startTime = performance.now();
        this.timeTotal = secondsTotal; // Bspw.: 176 seconds (= 2:56 Minutes)
        this.durationInMs = timeTotal * 1000;
        this.sbTimerElement = document.getElementById('sb-timer');
        this.requestAnimationFrame(updateTimer);
    }

    updateTimer(now) {
        let elapsed = now - this.startTime;
        let remaining = Math.max(0, this.durationInMs - elapsed);

        let totalSeconds = Math.floor(remaining / 1000);
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = totalSeconds % 60;
        let timerText = (minutes.toString().padStart(2, "0")) + ':' + (seconds.toString().padStart(2, "0"));
        this.sbTimerElement.textContent = timerText;

        // Activate blinking in the last 6 seconds.
        // Blinking from 6 remaining seconds on looks better, than blinking from 5 remaining seconds on.
        // The duration of the blink animation is 11 seconds. This is defined in the css animation.
        if(minutes === 0 && seconds <= 6) {
            if(!this.sbTimerElement.classList.contains('timer-end-blink')) {
                this.sbTimerElement.classList.add('timer-end-blink');
            }
        }

        // If the timer reached the end, display a red color instead of the green one.
        if(timerText === '00:00') {
            this.sbTimerElement.style.color = '#900';
        }

        if(remaining > 0) {
            this.requestAnimationFrame(updateTimer);
        } else {
            this.sbTimerElement.textContent = "00:00";
        }
    }
}