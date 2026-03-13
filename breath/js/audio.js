// Audio system
const audio = {
    ctx: null,
    freq: { inhale: 528, exhale: 432, hold: 396, prep: 396 },
    
    init() {
        if (this.ctx) return true;
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            const o = this.ctx.createOscillator(), g = this.ctx.createGain();
            o.connect(g).connect(this.ctx.destination);
            g.gain.value = 0;
            o.start(0);
            o.stop(0.001);
            return true;
        } catch { return false; }
    },
    
    tick(phase) {
        if (!this.ctx) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();
        
        const f = this.freq[phase] || this.freq.hold;
        const t = this.ctx.currentTime;
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        
        o.frequency.value = f;
        o.connect(g).connect(this.ctx.destination);
        
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.4, t + 0.01);
        g.gain.setValueAtTime(0.4, t + 0.1);
        g.gain.linearRampToValueAtTime(0, t + 0.12);
        
        o.start(t);
        o.stop(t + 0.12);
    },
    
    stop() {
        if (this.ctx) this.ctx.close();
        this.ctx = null;
    }
};
