export default class sbTimer {
    constructor(scoreboard) {
        this.scoreboard = scoreboard;
        this.isInitialized = false;
        this.isPaused = true;
        this.remainingAtPause = null;
        this.animationFrameId = null;
        this.lastTimeLeftCalculated = null;
    }

    // timeTotal is for example: 6:00 (6 minutes and 0 seconds).
    resetTimer(timeTotal) {
        if(!timeTotal.includes(':')) {
            throw new Error('Invalid time: ' + timeTotal);
            return;
        }

        let timeParts = timeTotal.split(':');
        let minutes = parseInt(timeParts[0]);

        console.log('mins: ', minutes);

        let seconds = parseInt(timeParts[1].replace(/^0+/, '')); // Remove leading zero.

        if(isNaN(seconds)) {
            seconds = 0;
        }

        let secondsTotal = seconds + (minutes * 60);

        this.startTime = performance.now();
        this.timeTotal = secondsTotal; // Bspw.: 176 seconds (= 2:56 Minutes)
        this.durationInMs = this.timeTotal * 1000;
        this.remainingAtPause = this.durationInMs;
        this.sbTimerElement = document.getElementById('sb-timer');
        this.isInitialized = true;

        let timerText = this.getTimerText(minutes, seconds);
        this.sbTimerElement.textContent = timerText;
        this.sbTimerElement.classList.remove('round-ended');
    }

    resumeTimer() {
        if (!this.isInitialized || !this.isPaused) {
            return;
        }

        this.isPaused = false;
        this.startTime = performance.now();
        this.durationInMs = this.remainingAtPause;
        this.animationFrameId = requestAnimationFrame(this.updateTimer.bind(this));
    }

    pauseTimer() {
        if (!this.isInitialized || this.animationFrameId === null) {
            return;
        }

        this.remainingAtPause = Math.max(0, this.durationInMs - (performance.now() - this.startTime));
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
        this.isPaused = true;
    }

    updateTimer(now) {
        let elapsed = now - this.startTime;
        let remaining = Math.max(0, this.durationInMs - elapsed);

        let totalSeconds = Math.floor(remaining / 1000);
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = totalSeconds % 60;
        let timerText = this.getTimerText(minutes, seconds);
        this.sbTimerElement.textContent = timerText;

        // Activate blinking in the last 6 seconds.
        // Blinking from 6 remaining seconds on looks better, than blinking from 5 remaining seconds on.
        // The duration of the blink animation is 11 seconds. This is defined in the css animation.
        if(minutes === 0 && seconds <= 6) {
            if(!this.sbTimerElement.classList.contains('timer-end-blink')) {
                this.sbTimerElement.classList.add('timer-end-blink');
            }
        }

        let timeLeftCalculated = this.getTimeLeft(minutes, seconds);

        if(timeLeftCalculated !== this.lastTimeLeftCalculated) {
            this.lastTimeLeftCalculated = timeLeftCalculated;
            this.scoreboard.updateTimeLeft(timeLeftCalculated);
        }

        // If the timer reached the end, display a red color instead of the green one.
        if(timerText === '00:00') {
            this.sbTimerElement.classList.add('round-ended');
        }

        if(remaining > 0) {
            this.animationFrameId = requestAnimationFrame(this.updateTimer.bind(this));
        } else {
            this.sbTimerElement.textContent = "00:00";
            this.isInitialized = false;
            this.playDing();
        }
    }

    getTimerText(minutes, seconds) {
        return (minutes.toString().padStart(2, "0")) + ':' + (seconds.toString().padStart(2, "0"));
    }

    getTimeLeft(minutes, seconds) {
        return (minutes.toString()) + ':' + (seconds.toString().padStart(2, "0"));
    }

    playDing() {
        const ctx = new AudioContext();

  const notes = [
    // Dam        Dam        Dammmm          tü        del       dü
    /*
    { freq: 196, time: 0.0,  duration: 0.3, gain: 0.9 },  // C
    { freq: 220, time: 0.3,  duration: 0.3, gain: 0.9 },  // C
    { freq: 247, time: 0.6,  duration: 0.3, gain: 1.0 },  // G (fröhlicher Sprung)
    { freq: 262, time: 0.9,  duration: 0.6, gain: 0.8 }, // tü - schneller
    */
    { freq: 196, time: 0.0,  duration: 0.3, gain: 0.9, wave: 'noise' },  // C
    { freq: 220, time: 0.3,  duration: 0.3, gain: 0.9, wave: 'noise'  },  // C
    { freq: 247, time: 0.6,  duration: 0.3, gain: 1.0, wave: 'noise'  },  // G (fröhlicher Sprung)
    { freq: 262, time: 0.9,  duration: 0.9, gain: 0.8, wave: 'noise'  }, // tü - schneller

  ];

  notes.forEach(({ freq, time, duration, gain }) => {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.type = 'triangle';

    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 6;       // etwas schnelleres Vibrato = lebendiger
    lfoGain.gain.value = 4;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    lfo.start(ctx.currentTime + time);
    lfo.stop(ctx.currentTime + time + duration);

    const start = ctx.currentTime + time;
    gainNode.gain.setValueAtTime(0, start);
    gainNode.gain.linearRampToValueAtTime(gain, start + 0.03);
    gainNode.gain.setValueAtTime(gain, start + duration * 0.7);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    osc.frequency.value = freq;
    osc.start(start);
    osc.stop(start + duration);
  });
    }
}