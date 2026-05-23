/**
 * ==========================================================================
 * TYPENOVA CLASSIC MODE SIMULATION LOGIC CORE ENGINE
 * ==========================================================================
 */
import { SynthesizedAudio } from './sound.js';
import { StorageController } from './storage.js';

export const ClassicTypingEngine = {
    phrasesBank: [
        "Advanced deep integration layers optimize pipeline execution boundaries seamlessly across multi threaded server clustering instances.",
        "Beautifully structured application interfaces demand clean typography layout properties matched with glassmorphic style treatments.",
        "Decoupled structural parameters isolate dynamic node contexts directly preventing unexpected performance leaks during runtime tracking steps.",
        "Asynchronous framework logic layers compile high level abstract functional references directly down onto raw structural instructions smoothly."
    ],

    wordsDisplayContainer: document.getElementById('text-display-stream'),
    keystrokeInputProxy: document.getElementById('hidden-typing-input'),
    liveWpmDisplay: document.getElementById('live-metric-wpm'),
    liveAccDisplay: document.getElementById('live-metric-acc'),
    liveTimerDisplay: document.getElementById('live-timer'),

    testDurationLimit: 30,
    secondsRemaining: 30,
    clockIntervalRef: null,
    engineIsActive: false,

    characterPointerIdx: 0,
    cumulativeKeystrokes: 0,
    validatedKeystrokes: 0,
    mistakeCount: 0,

    init() {
        this.keystrokeInputProxy.addEventListener('input', (e) => this.processKeystrokeStream(e));
        document.getElementById('classic-restart-btn').addEventListener('click', () => this.resetSimulationSandbox());
        document.getElementById('typing-focus-proxy-zone').addEventListener('click', () => this.keystrokeInputProxy.focus());
        this.registerTimelineSelectors();
    },

    registerTimelineSelectors() {
        document.querySelectorAll('.time-select-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (this.engineIsActive) return;
                document.querySelectorAll('.time-select-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.testDurationLimit = parseInt(e.target.getAttribute('data-seconds'));
                this.resetSimulationSandbox();
            });
        });
    },

    awakenContext() {
        this.resetSimulationSandbox();
        this.keystrokeInputProxy.focus();
    },

    teardownActiveCycles() {
        clearInterval(this.clockIntervalRef);
        this.engineIsActive = false;
    },

    resetSimulationSandbox() {
        this.teardownActiveCycles();
        this.secondsRemaining = this.testDurationLimit;
        this.characterPointerIdx = 0;
        this.cumulativeKeystrokes = 0;
        this.validatedKeystrokes = 0;
        this.mistakeCount = 0;

        this.keystrokeInputProxy.value = '';
        this.liveWpmDisplay.textContent = '0 WPM';
        this.liveAccDisplay.textContent = '100%';
        if (this.liveTimerDisplay) this.liveTimerDisplay.textContent = this.secondsRemaining;

        const phraseString = this.phrasesBank[Math.floor(Math.random() * this.phrasesBank.length)];
        this.wordsDisplayContainer.innerHTML = '';
        
        phraseString.split('').forEach((char, index) => {
            const charSpan = document.createElement('span');
            charSpan.className = `char ${index === 0 ? 'current' : ''}`;
            charSpan.textContent = char;
            this.wordsDisplayContainer.appendChild(charSpan);
        });
    },

    fireEngineClock() {
        this.engineIsActive = true;
        this.clockIntervalRef = setInterval(() => {
            if (this.secondsRemaining > 0) {
                this.secondsRemaining--;
                if (this.liveTimerDisplay) this.liveTimerDisplay.textContent = this.secondsRemaining;
                this.evaluateLiveDashboardCalculations();
            } else {
                this.terminateSimulationRun();
            }
        }, 1000);
    },

    processKeystrokeStream(e) {
        const val = this.keystrokeInputProxy.value;
        const spans = this.wordsDisplayContainer.querySelectorAll('.char');

        if (!this.engineIsActive && val.length > 0) {
            this.fireEngineClock();
        }

        // Intercept and route delete actions cleanly
        if (val.length < this.characterPointerIdx) {
            if (this.characterPointerIdx > 0) {
                spans[this.characterPointerIdx].classList.remove('current', 'correct', 'incorrect');
                this.characterPointerIdx--;
                spans[this.characterPointerIdx].classList.remove('correct', 'incorrect');
                spans[this.characterPointerIdx].classList.add('current');
            }
            return;
        }

        if (this.characterPointerIdx >= spans.length) return;

        const targetedSpan = spans[this.characterPointerIdx];
        const typedCharacter = val[this.characterPointerIdx];

        this.cumulativeKeystrokes++;
        window.TypeNovaGlobalHub.joltVisualKeyCap(typedCharacter === ' ' ? 'space' : typedCharacter);

        if (typedCharacter === targetedSpan.textContent) {
            targetedSpan.classList.add('correct');
            this.validatedKeystrokes++;
            SynthesizedAudio.triggerTap();
        } else {
            targetedSpan.classList.add('incorrect');
            this.mistakeCount++;
            SynthesizedAudio.triggerError();
        }

        targetedSpan.classList.remove('current');
        this.characterPointerIdx++;

        if (this.characterPointerIdx < spans.length) {
            spans[this.characterPointerIdx].classList.add('current');
        } else {
            this.terminateSimulationRun();
        }
        this.evaluateLiveDashboardCalculations();
    },

    evaluateLiveDashboardCalculations() {
        const standardMinutesElapsed = (this.testDurationLimit - this.secondsRemaining) / 60;
        if (standardMinutesElapsed <= 0) return;

        const computingWpm = Math.round((this.validatedKeystrokes / 5) / standardMinutesElapsed);
        const computingAcc = this.cumulativeKeystrokes > 0 ? Math.round((this.validatedKeystrokes / this.cumulativeKeystrokes) * 100) : 100;

        this.liveWpmDisplay.textContent = `${computingWpm >= 0 ? computingWpm : 0} WPM`;
        this.liveAccDisplay.textContent = `${computingAcc}%`;
    },

    terminateSimulationRun() {
        clearInterval(this.clockIntervalRef);
        this.engineIsActive = false;

        const scoreWpm = parseInt(this.liveWpmDisplay.textContent);
        const ratioAcc = parseInt(this.liveAccDisplay.textContent);

        StorageController.commitSimulationRunLog(scoreWpm, ratioAcc);
        window.TypeNovaGlobalHub.syncDashboardMetricsDisplay();

        window.TypeNovaGlobalHub.triggerGlobalSummaryModal(
            "🏁 Evaluation Matrix Concluded",
            "Hardware speed telemetry files successfully updated inside system storage buffers.",
            "NET VELOCITY", `${scoreWpm} WPM`,
            "ACCURACY RATIO", `${ratioAcc}%`,
            () => this.resetSimulationSandbox()
        );
    }
};