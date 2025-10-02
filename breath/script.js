class SoundManager {
    constructor() {
        this.audioContext = null;
        this.gainNode = null;
        this.initAudio();
    }
    
    initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.gainNode = this.audioContext.createGain();
            this.gainNode.connect(this.audioContext.destination);
            this.gainNode.gain.value = 0.3;
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    }
    
    createTickSound(frequency, duration = 0.1) {
        if (!this.audioContext) return;
        
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        const oscillator = this.audioContext.createOscillator();
        const tickGain = this.audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        
        oscillator.connect(tickGain);
        tickGain.connect(this.gainNode);
        
        const now = this.audioContext.currentTime;
        tickGain.gain.setValueAtTime(0, now);
        tickGain.gain.linearRampToValueAtTime(1, now + 0.01);
        tickGain.gain.exponentialRampToValueAtTime(0.01, now + duration);
        
        oscillator.start(now);
        oscillator.stop(now + duration);
        
        return oscillator;
    }
    
    playInhaleTick() {
        this.createTickSound(40, 0.15);
    }
    
    playExhaleTick() {
        this.createTickSound(10, 0.15);
    }
    
    playHoldTick() {
        this.createTickSound(7.83, 0.12);
    }
    
    playPrepTick() {
        this.createTickSound(111, 0.18);
    }
    
    play(soundType) {
        switch(soundType) {
            case 'inhale':
                this.playInhaleTick();
                break;
            case 'exhale':
                this.playExhaleTick();
                break;
            case 'hold':
                this.playHoldTick();
                break;
            case 'prep':
                this.playPrepTick();
                break;
        }
    }
    
    stop() {
    }
    
    stopAll() {
    }
}

class BreathingExercise {
    constructor(name, pattern) {
        this.name = name;
        this.pattern = pattern;
        this.timer = null;
        this.animationTimer = null;
        this.isRunning = false;
        this.currentPhaseIndex = 0;
        this.currentPhaseTime = 0;
        this.prepTime = 5;
        this.isPrep = true;
        this.soundManager = new SoundManager();
        this.lastTickSecond = -1;
    }

    start() {
        this.isRunning = true;
        this.isPrep = true;
        this.prepTime = 5;
        this.currentPhaseIndex = 0;
        this.currentPhaseTime = 0;
        this.lastTickSecond = -1;
        
        const exerciseName = document.getElementById('exercise-name');
        exerciseName.textContent = this.name;
        exerciseName.style.opacity = '0.5';
        
        this.tick();
        this.timer = setInterval(() => this.tick(), 100);
    }

    stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        if (this.animationTimer) {
            clearInterval(this.animationTimer);
            this.animationTimer = null;
        }
        this.soundManager.stopAll();
        this.isRunning = false;
    }

    tick() {
        if (!this.isRunning) return;
        
        if (this.isPrep) {
            this.handlePrepPhase();
        } else {
            this.handleBreathingPhase();
        }
    }
    
    handlePrepPhase() {
        const secondsLeft = Math.ceil(this.prepTime);
        
        const previousSecondsLeft = Math.ceil(this.prepTime + 0.1);
        if (secondsLeft !== previousSecondsLeft) {
            this.soundManager.play('prep');
        }
        
        this.updateUI({
            label: 'Get ready',
            scale: 0.7,
            count: secondsLeft
        });
        
        this.prepTime -= 0.1;
        
        if (this.prepTime <= 0) {
            this.isPrep = false;
            this.currentPhaseIndex = 0;
            this.currentPhaseTime = 0;
            const exerciseName = document.getElementById('exercise-name');
            exerciseName.style.opacity = '0';
        }
    }
    
    handleBreathingPhase() {
        const currentPhase = this.pattern.phases[this.currentPhaseIndex];
        if (!currentPhase) {
            this.complete();
            return;
        }
        
        const progress = this.currentPhaseTime / currentPhase.duration;
        const secondsLeft = Math.ceil(currentPhase.duration - this.currentPhaseTime);
        
        const isPhaseStart = this.currentPhaseTime === 0;
        const previousSecondsLeft = Math.ceil(currentPhase.duration - (this.currentPhaseTime - 0.1));
        const secondChanged = secondsLeft !== previousSecondsLeft && this.currentPhaseTime > 0;
        
        if (isPhaseStart || secondChanged) {
            this.soundManager.play(currentPhase.type);
        }
        
        let scale;
        if (currentPhase.type === 'inhale') {
            scale = 0.8 + (progress * 0.6);
        } else if (currentPhase.type === 'exhale') {
            scale = 1.4 - (progress * 0.6);
        } else {
            scale = currentPhase.type === 'hold-in' ? 1.4 : 0.8;
        }
        
        this.updateUI({
            label: currentPhase.label,
            scale: scale,
            count: secondsLeft
        });
        
        this.currentPhaseTime += 0.1;
        
        if (this.currentPhaseTime >= currentPhase.duration) {
            this.currentPhaseIndex++;
            this.currentPhaseTime = 0;
            
            if (this.currentPhaseIndex >= this.pattern.phases.length) {
                const totalElapsed = this.getTotalElapsedTime();
                if (totalElapsed >= this.pattern.duration) {
                    this.complete();
                    return;
                }
                this.currentPhaseIndex = 0;
            }
        }
    }
    
    getTotalElapsedTime() {
        const phaseCycleTime = this.pattern.phases.reduce((sum, phase) => sum + phase.duration, 0);
        const completedCycles = Math.floor((this.currentPhaseIndex * this.pattern.phases[0].duration + this.currentPhaseTime) / phaseCycleTime);
        return completedCycles * phaseCycleTime + this.currentPhaseTime;
    }

    updateUI(data) {
        const circle = document.getElementById('breathing-circle');
        const label = document.getElementById('phase-label');
        const count = document.getElementById('phase-count');

        const scale = data.scale;
        circle.style.transform = `scale(${scale})`;
        circle.style.opacity = Math.min(scale * 0.8 + 0.2, 1);

        label.textContent = data.label;
        count.textContent = data.count;
    }

    complete() {
        this.stop();
        setTimeout(() => {
            showHome();
        }, 1500);
    }
}

const patterns = {
    wimHof: {
        name: 'Wim Hof Method',
        duration: 600,
        phases: [
            { type: 'inhale', label: 'Rapid Inhale', duration: 1 },
            { type: 'exhale', label: 'Quick Exhale', duration: 1 }
        ]
    },
    boxBreathing: {
        name: 'Box Breathing',
        duration: 360,
        phases: [
            { type: 'inhale', label: 'Inhale', duration: 6 },
            { type: 'hold-in', label: 'Hold', duration: 6 },
            { type: 'exhale', label: 'Exhale', duration: 6 },
            { type: 'hold-out', label: 'Hold', duration: 6 }
        ]
    },
    coherent: {
        name: 'Coherent Diaphragmatic Breathing',
        duration: 240,
        phases: [
            { type: 'inhale', label: 'Inhale', duration: 5 },
            { type: 'exhale', label: 'Exhale', duration: 5 }
        ]
    },
    nadiShodhana: {
        name: 'Nadi Shodhana',
        duration: 300,
        phases: [
            { type: 'inhale', label: 'Inhale Left', duration: 6 },
            { type: 'hold-in', label: 'Hold', duration: 6 },
            { type: 'exhale', label: 'Exhale Right', duration: 6 },
            { type: 'hold-out', label: 'Hold', duration: 6 }
        ]
    },
    extendedExhale: {
        name: 'Extended Exhale',
        duration: 480,
        phases: [
            { type: 'inhale', label: 'Inhale', duration: 4 },
            { type: 'exhale', label: 'Long Exhale', duration: 16 }
        ]
    },
    bhramari: {
        name: 'Bhramari Pranayama',
        duration: 240,
        phases: [
            { type: 'inhale', label: 'Inhale', duration: 4 },
            { type: 'exhale', label: 'Hum', duration: 8 }
        ]
    }
};

const routines = {
    morning: [patterns.wimHof, patterns.boxBreathing, patterns.coherent],
    midday: [patterns.nadiShodhana],
    evening: [patterns.extendedExhale, patterns.bhramari]
};

let currentExercise = null;
let currentRoutine = [];
let routineIndex = 0;

function showHome() {
    document.getElementById('home').classList.add('active');
    document.getElementById('session').classList.remove('active');
}

function showSession() {
    document.getElementById('home').classList.remove('active');
    document.getElementById('session').classList.add('active');
}

function startRoutine(type) {
    currentRoutine = routines[type];
    routineIndex = 0;
    startNextExercise();
}

function startNextExercise() {
    if (routineIndex >= currentRoutine.length) {
        showHome();
        return;
    }

    const pattern = currentRoutine[routineIndex];
    currentExercise = new BreathingExercise(pattern.name, pattern);
    
    showSession();
    currentExercise.start();

    const originalComplete = currentExercise.complete.bind(currentExercise);
    currentExercise.complete = function() {
        originalComplete();
        routineIndex++;
        setTimeout(() => {
            startNextExercise();
        }, 2000);
    };
}

function stopSession() {
    if (currentExercise) {
        currentExercise.stop();
        currentExercise = null;
    }
    routineIndex = 0;
    currentRoutine = [];
    showHome();
}

document.addEventListener('DOMContentLoaded', () => {
    showHome();
});