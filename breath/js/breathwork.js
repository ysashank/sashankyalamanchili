// Breathing session
const el = {
    name: document.getElementById('name'),
    label: document.getElementById('phase'),
    count: document.getElementById('count'),
    circle: document.querySelector('.circle'),
    toast: document.getElementById('toast')
};

let state = {
    routine: null,
    routineIdx: 0,
    exercise: null,
    phaseIdx: 0,
    phaseTime: 0,
    totalTime: 0,
    lastTick: -1,
    prep: true,
    prepTime: 5,
    running: false,
    lastFrame: 0,
    wake: null
};

// Load exercise
const rt = sessionStorage.routine;
const ex = sessionStorage.exercise;
if (rt) {
    state.routine = routines[rt].map(id => exercises[id]);
    state.exercise = state.routine[0];
} else if (ex) {
    state.exercise = exercises[ex];
} else {
    location.href = 'index.html';
}

el.name.textContent = state.exercise.name;

// Init audio
if (!audio.init()) {
    el.toast.textContent = 'Audio unavailable - visual guidance only';
    el.toast.classList.add('visible');
    setTimeout(() => el.toast.classList.remove('visible'), 3000);
}

// Wake lock
if ('wakeLock' in navigator) {
    navigator.wakeLock.request('screen').then(w => state.wake = w).catch(() => {});
}

// Stop button
document.getElementById('stop').onclick = () => {
    state.running = false;
    audio.stop();
    if (state.wake) state.wake.release();
    sessionStorage.clear();
    location.href = 'index.html';
};

// Animation loop
function update(t) {
    if (!state.running) return;
    const dt = (t - state.lastFrame) / 1000;
    state.lastFrame = t;
    
    if (state.prep) {
        state.prepTime -= dt;
        el.count.textContent = Math.ceil(state.prepTime);
        const sec = Math.floor(5 - state.prepTime);
        if (sec > state.lastTick) {
            audio.tick('prep');
            state.lastTick = sec;
        }
        if (state.prepTime <= 0) {
            state.prep = false;
            state.phaseIdx = 0;
            state.phaseTime = 0;
            state.totalTime = 0;
            state.lastTick = -1;
            updatePhase();
        }
    } else {
        state.phaseTime += dt;
        state.totalTime += dt;
        
        const phase = state.exercise.phases[state.phaseIdx];
        el.count.textContent = Math.ceil(phase.duration - state.phaseTime);
        
        const sec = Math.floor(state.phaseTime);
        if (sec > state.lastTick && sec < phase.duration) {
            audio.tick(phase.type);
            state.lastTick = sec;
        }
        
        if (state.phaseTime >= phase.duration) {
            state.phaseIdx = (state.phaseIdx + 1) % state.exercise.phases.length;
            state.phaseTime = 0;
            state.lastTick = -1;
            updatePhase();
        }
        
        if (state.totalTime >= state.exercise.duration) {
            if (state.routine && state.routineIdx < state.routine.length - 1) {
                state.routineIdx++;
                state.exercise = state.routine[state.routineIdx];
                el.name.textContent = state.exercise.name;
                state.prep = true;
                state.prepTime = 5;
                state.phaseTime = 0;
                state.totalTime = 0;
                state.lastTick = -1;
                el.label.textContent = 'Prepare';
                el.count.textContent = '5';
                el.circle.style.transition = '';
                el.circle.style.transform = 'scale(1)';
            } else {
                document.getElementById('stop').click();
                return;
            }
        }
    }
    
    requestAnimationFrame(update);
}

function updatePhase() {
    const phase = state.exercise.phases[state.phaseIdx];
    const labels = { inhale: 'Inhale', exhale: 'Exhale', hold: 'Hold' };
    el.label.textContent = labels[phase.type] || 'Breathe';
    
    el.circle.style.transition = '';
    el.circle.style.transform = '';
    void el.circle.offsetWidth;
    
    if (phase.type === 'inhale') {
        el.circle.style.transition = `transform ${phase.duration}s ease-in-out`;
        el.circle.style.transform = 'scale(1.8)';
    } else if (phase.type === 'exhale') {
        el.circle.style.transition = `transform ${phase.duration}s ease-in-out`;
        el.circle.style.transform = 'scale(0.6)';
    }
}

state.running = true;
state.lastFrame = performance.now();
update(state.lastFrame);
