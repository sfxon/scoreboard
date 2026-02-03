export default class sbIncrementAnimator {
    constructor() {
        this.domContainer = document.getElementById('sb-score-display-container');
        this.animatorName = ''; // Thing to be animated.
        this.animationLengthInMs = 3000; // 3 Seconds.
        this.animationStartDelay = 500; // 0.5 Seconds.
        this.points = 0;
        this.delayTimerId = null;
        this.animationTimerId = null;
        this.textToDisplay = '';
    }

    clearAnimationTimer() {
        if (this.animationTimerId !== null) {
            clearTimeout(this.animationTimerId);
            this.animationTimerId = null;
        }
    }

    clearTimer() {
        if (this.delayTimerId !== null) {
            clearTimeout(this.delayTimerId);
            this.delayTimerId = null;
        }
    }

    // Whenever animatorName is replaced in a call, the animationStartDelay will be reset.
    prepareAnimation(animatorName, textToDisplay, pointsToAdd) {
        if(animatorName !== this.animatorName) {
            this.animatorName = animatorName;
            this.points = 0;
            this.textToDisplay = textToDisplay;
        }

        // Calculate points.
        pointsToAdd = parseInt(pointsToAdd);

        if(isNaN(pointsToAdd)) {
            pointsToAdd = 0;
        } else {
            this.points += pointsToAdd;
        }

        // Start Animation Delay.
        this.resetTimer();
    }

    resetTimer() {
        this.startTimer();
    }

    setDisplayText() {
        let nameEl = this.domContainer.querySelector('.name');
        let pointsEl = this.domContainer.querySelector('.points');

        nameEl.textContent = this.textToDisplay;
        pointsEl.textContent = '+' + this.points;

        if(this.points ===  0) {
            pointsEl.style.display = 'none';
        } else {
            pointsEl.style.display = 'inline-block';
        }
    }

    showAnimation() {
        this.clearAnimationTimer();
        this.points = 0;
        this.animatorName = '';
        this.domContainer.style.display = 'flex';
        this.animationTimerId = setTimeout(() => {
            this.stopAnimation();
        }, this.animationLengthInMs);
    }

    startTimer() {
        this.clearTimer();
        this.delayTimerId = setTimeout(() => {
            if(this.points >= 0) {
                this.setDisplayText();
                this.showAnimation();
            } else {
                this.stopAnimation();
            }
        }, this.animationStartDelay);
    }

    stopAnimation() {
        this.domContainer.style.display = 'none';
        this.clearAnimationTimer();
    }
}