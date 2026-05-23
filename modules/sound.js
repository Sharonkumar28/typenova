/**
 * ==========================================================================
 * TYPENOVA AUDIO HARDWARE procedurals SYNTHESIZER
 * ==========================================================================
 */
export const SynthesizedAudio = {
    audioContextInstance: null,
    systemIsMuted: false,

    init() {
        // Postpone hardware node verification until standard user interaction cycles trigger handshake safety
        this.systemIsMuted = localStorage.getItem('tn_audio_muted_flag') === 'true';
    },

    awakenAudioHardwareContext() {
        if (!this.audioContextInstance) {
            this.audioContextInstance = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.audioContextInstance.state === 'suspended') {
            this.audioContextInstance.resume();
        }
    },

    toggleMuteState() {
        this.systemIsMuted = !this.systemIsMuted;
        localStorage.setItem('tn_audio_muted_flag', String(this.systemIsMuted));
        return this.systemIsMuted;
    },

    synthesizeProceduralTone(freqHz, durationSecs, shapeType = 'sine', decaySweepTarget = null, baselineGain = 0.06) {
        if (this.systemIsMuted) return;
        this.awakenAudioHardwareContext();

        try {
            const osc = this.audioContextInstance.createOscillator();
            const gainNode = this.audioContextInstance.createGain();

            osc.connect(gainNode);
            gainNode.connect(this.audioContextInstance.destination);

            osc.type = shapeType;
            osc.frequency.setValueAtTime(freqHz, this.audioContextInstance.currentTime);
            
            if (decaySweepTarget) {
                osc.frequency.exponentialRampToValueAtTime(decaySweepTarget, this.audioContextInstance.currentTime + durationSecs);
            }

            gainNode.gain.setValueAtTime(baselineGain, this.audioContextInstance.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.00001, this.audioContextInstance.currentTime + durationSecs);

            osc.start(this.audioContextInstance.currentTime);
            osc.stop(this.audioContextInstance.currentTime + durationSecs);
        } catch (error) {
            // Context capture safety parameters matching active browsers policies overrides
        }
    },

    triggerTap() {
        this.synthesizeProceduralTone(560, 0.04, 'sine', null, 0.05);
    },

    triggerError() {
        this.synthesizeProceduralTone(140, 0.14, 'sawtooth', 70, 0.15);
    },

    triggerHit() {
        this.synthesizeProceduralTone(420, 0.08, 'triangle', 840, 0.1);
    },

    triggerCombo() {
        this.synthesizeProceduralTone(660, 0.15, 'sine', 1320, 0.08);
    },

    triggerGameOver() {
        this.synthesizeProceduralTone(200, 0.5, 'sawtooth', 40, 0.2);
    }
};