/**
 * ==========================================================================
 * TYPENOVA ARCADE MODE VECTOR GAME CANVAS SYSTEM ENGINE (DIFFICULTY SELECT)
 * ==========================================================================
 */
import { SynthesizedAudio } from './sound.js';
import { StorageController } from './storage.js';

export const ArcadeGameEngine = {
    lexiconBank: [
        "quantum", "cyber", "kernel", "async", "matrix", "vector", "lambda", "buffer",
        "thread", "router", "shader", "binary", "protocol", "vertex", "payload", "syntax"
    ],

    canvas: null,
    keystrokeProxyInput: null,
    splashOverlay: null,
    viewportFrameContainer: null,
    
    healthBarNode: null,
    scoreTextNode: null,
    comboTextNode: null,
    levelTextNode: null,

    canvasCtx: null,
    animationFrameRequestRef: null,
    isLoopRunning: false,

    scoreValue: 0,
    healthValue: 100,
    comboStreakValue: 0,
    difficultyLevel: 1,
    activeTargetsList: [],
    blastParticlesList: [],
    floatingTextsList: [],

    // DIFFICULTY BALANCING PARAMETERS
    currentDifficultySetting: "easy", 
    spawnIntervalTicks: 160,   // Easy context base delay configuration
    tickCounter: 0,
    velocityScaleFactor: 0.35, // Initial speed setting is chala smooth and easy now

    init() {
        this.canvas = document.getElementById('arcade-render-canvas');
        this.keystrokeProxyInput = document.getElementById('arcade-hidden-keystroke-proxy');
        this.splashOverlay = document.getElementById('arcade-start-overlay') || document.getElementById('arcade-splash-overlay');
        this.viewportFrameContainer = document.getElementById('arcade-canvas-viewport-container') || document.getElementById('arcade-canvas-viewport');
        
        this.healthBarNode = document.getElementById('arcade-health-fill');
        this.scoreTextNode = document.getElementById('arcade-hud-score');
        this.comboTextNode = document.getElementById('arcade-hud-combo');
        this.levelTextNode = document.getElementById('arcade-hud-level');

        if (!this.canvas) return;

        this.canvasCtx = this.canvas.getContext('2d');
        this.configureCanvasSizingDimensions();
        
        window.addEventListener('resize', () => this.configureCanvasSizingDimensions());

        if (this.keystrokeProxyInput) {
            this.keystrokeProxyInput.addEventListener('input', (e) => this.evaluateArcadeInput(e));
        }
        
        const triggerBtn = document.getElementById('arcade-start-trigger-btn');
        if (triggerBtn) {
            triggerBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.launchArcadeLoopSequence();
            });
        }

        // Register Difficulty Selector Event Listeners
        this.registerDifficultyEvents();
    },

    registerDifficultyEvents() {
        const diffButtons = document.querySelectorAll('.arcade-diff-btn');
        diffButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (this.isLoopRunning) return; // Stop if game is active
                
                // Play a small click sound
                try { SynthesizedAudio.triggerTap(); } catch(err) {}
                
                // Toggle active classes
                diffButtons.forEach(b => b.classList.remove('active'));
                const target = e.target.closest('.arcade-diff-btn');
                target.classList.add('active');
                
                this.currentDifficultySetting = target.getAttribute('data-diff');
                this.applyDifficultyModifiers();
                
                console.log(`System: Difficulty recalibrated to ${this.currentDifficultySetting.toUpperCase()}`);
            });
        });
    },

    applyDifficultyModifiers() {
        // Difficulty values configurations matrix adjustments
        if (this.currentDifficultySetting === "easy") {
            this.spawnIntervalTicks = 160;   // Words mellaga text targets low rate lo spawn avtayi
            this.velocityScaleFactor = 0.35; // Target speed chala slow and visible ga untundi
        } else if (this.currentDifficultySetting === "medium") {
            this.spawnIntervalTicks = 110;
            this.velocityScaleFactor = 0.65;
        } else if (this.currentDifficultySetting === "hard") {
            this.spawnIntervalTicks = 70;
            this.velocityScaleFactor = 1.1;  // High speed matrix attack layout mode
        }
        this.flushEngineWorkspace();
    },

    configureCanvasSizingDimensions() {
        if (!this.canvas) return;
        const fallbackWidth = this.viewportFrameContainer ? this.viewportFrameContainer.clientWidth : 800;
        const fallbackHeight = this.viewportFrameContainer ? this.viewportFrameContainer.clientHeight : 440;
        this.canvas.width = fallbackWidth || 800;
        this.canvas.height = fallbackHeight || 440;
    },

    awakenContext() {
        if (this.splashOverlay) this.splashOverlay.classList.remove('hidden-asset');
        this.configureCanvasSizingDimensions();
        this.applyDifficultyModifiers(); // Settings reload state check up
    },

    teardownActiveCycles() {
        this.isLoopRunning = false;
        if (this.animationFrameRequestRef) {
            cancelAnimationFrame(this.animationFrameRequestRef);
            this.animationFrameRequestRef = null;
        }
    },

    flushEngineWorkspace() {
        this.scoreValue = 0;
        this.healthValue = 100;
        this.comboStreakValue = 0;
        this.difficultyLevel = 1;
        this.activeTargetsList = [];
        this.blastParticlesList = [];
        this.floatingTextsList = [];
        this.tickCounter = 0;

        if (this.healthBarNode) this.healthBarNode.style.width = '100%';
        if (this.scoreTextNode) this.scoreTextNode.textContent = '00000';
        if (this.comboTextNode) this.comboTextNode.textContent = 'x0';
        if (this.levelTextNode) this.levelTextNode.textContent = '01';
    },

    launchArcadeLoopSequence() {
        this.flushEngineWorkspace();
        if (this.splashOverlay) this.splashOverlay.classList.add('hidden-asset');
        this.isLoopRunning = true;
        
        try {
            if (SynthesizedAudio && SynthesizedAudio.awakenAudioHardwareContext) {
                SynthesizedAudio.awakenAudioHardwareContext();
            }
        } catch(e) {}

        if (this.keystrokeProxyInput) this.keystrokeProxyInput.focus();
        this.animationFrameRequestRef = requestAnimationFrame(() => this.executeTickCycle());
    },

    executeTickCycle() {
        if (!this.isLoopRunning) return;
        this.updateGameMatrixLogicStates();
        this.renderVectorCanvasScene();
        this.animationFrameRequestRef = requestAnimationFrame(() => this.executeTickCycle());
    },

    updateGameMatrixLogicStates() {
        this.tickCounter++;
        
        if (this.tickCounter >= Math.max(35, this.spawnIntervalTicks - (this.difficultyLevel * 8))) {
            this.tickCounter = 0;
            this.spawnTargetVectorNode();
        }

        const dynamicSpeed = this.velocityScaleFactor + (this.difficultyLevel * 0.12);

        for (let i = this.activeTargetsList.length - 1; i >= 0; i--) {
            const target = this.activeTargetsList[i];
            target.y += dynamicSpeed;

            if (this.canvas && target.y > this.canvas.height - 15) {
                this.healthValue -= 20;
                this.comboStreakValue = 0;
                if (this.comboTextNode) this.comboTextNode.textContent = 'x0';
                if (this.healthBarNode) this.healthBarNode.style.width = `${Math.max(0, this.healthValue)}%`;
                
                try { SynthesizedAudio.triggerError(); } catch(e) {}
                this.generateVisualBurstParticles(target.x, target.y, '#f38ba8');
                this.activeTargetsList.splice(i, 1);

                if (this.healthValue <= 0) {
                    this.triggerGameOverSequence();
                    return;
                }
            }
        }

        for (let i = this.blastParticlesList.length - 1; i >= 0; i--) {
            const p = this.blastParticlesList[i];
            p.x += p.vx; p.y += p.vy; p.life -= p.decay;
            if (p.life <= 0) this.blastParticlesList.splice(i, 1);
        }

        for (let i = this.floatingTextsList.length - 1; i >= 0; i--) {
            const ft = this.floatingTextsList[i];
            ft.y += ft.vy; ft.life--;
            if (ft.life <= 0) this.floatingTextsList.splice(i, 1);
        }
    },

    spawnTargetVectorNode() {
        if (!this.canvasCtx || !this.canvas) return;
        const coreWord = this.lexiconBank[Math.floor(Math.random() * this.lexiconBank.length)];
        this.canvasCtx.font = "bold 15px 'JetBrains Mono', monospace";
        const wordWidth = this.canvasCtx.measureText(coreWord).width;

        const padding = 25;
        const availableWidth = this.canvas.width - wordWidth - (padding * 2);
        const randomizedX = padding + Math.random() * (availableWidth > 0 ? availableWidth : 1);

        this.activeTargetsList.push({
            text: coreWord,
            x: randomizedX,
            y: 10,
            typedBufferLength: 0
        });
    },

    evaluateArcadeInput(e) {
        if (!this.isLoopRunning || !this.keystrokeProxyInput) return;
        const currentBufferVal = this.keystrokeProxyInput.value.trim().toLowerCase();
        if (!currentBufferVal) return;

        const terminalPressedChar = currentBufferVal[currentBufferVal.length - 1];
        if (window.TypeNovaGlobalHub) window.TypeNovaGlobalHub.joltVisualKeyCap(terminalPressedChar);

        let validatedMatchRoute = false;

        for (let i = 0; i < this.activeTargetsList.length; i++) {
            const target = this.activeTargetsList[i];
            if (target.text.toLowerCase().startsWith(currentBufferVal)) {
                target.typedBufferLength = currentBufferVal.length;
                validatedMatchRoute = true;
                try { SynthesizedAudio.triggerTap(); } catch(err) {}

                if (currentBufferVal === target.text.toLowerCase()) {
                    this.neutralizeActiveTargetNode(i, target);
                    this.keystrokeProxyInput.value = '';
                    return;
                }
            } else {
                if (target.typedBufferLength > 0 && !target.text.toLowerCase().startsWith(currentBufferVal)) {
                    target.typedBufferLength = 0;
                }
            }
        }

        if (!validatedMatchRoute) {
            this.comboStreakValue = 0;
            if (this.comboTextNode) this.comboTextNode.textContent = 'x0';
            try { SynthesizedAudio.triggerError(); } catch(err) {}
            this.keystrokeProxyInput.value = '';
        }
    },

    neutralizeActiveTargetNode(indexIndex, targetObj) {
        this.comboStreakValue++;
        const calculationsGain = Math.floor(targetObj.text.length * 12 * (1 + this.comboStreakValue * 0.15));
        this.scoreValue += calculationsGain;

        if (this.scoreTextNode) this.scoreTextNode.textContent = this.scoreValue.toString().padStart(5, '0');
        if (this.comboTextNode) this.comboTextNode.textContent = `x${this.comboStreakValue}`;

        if (this.scoreValue > this.difficultyLevel * 800) {
            this.difficultyLevel++;
            if (this.levelTextNode) this.levelTextNode.textContent = this.difficultyLevel.toString().padStart(2, '0');
            try { SynthesizedAudio.triggerCombo(); } catch(e) {}
        }

        if (this.comboStreakValue % 4 === 0) {
            try { SynthesizedAudio.triggerCombo(); } catch(e) {}
            this.joltViewportFrameContainer();
        } else {
            try { SynthesizedAudio.triggerHit(); } catch(e) {}
        }

        this.generateVisualBurstParticles(targetObj.x + 40, targetObj.y, '#89dceb');
        this.floatingTextsList.push({
            text: `+${calculationsGain}`, x: targetObj.x + 20, y: targetObj.y, vy: -1, life: 40
        });

        this.activeTargetsList.splice(indexIndex, 1);
    },

    generateVisualBurstParticles(originX, originY, colorHex) {
        for (let i = 0; i < 15; i++) {
            const headingAngle = Math.random() * Math.PI * 2;
            const kineticSpeed = 1.5 + Math.random() * 3.5;
            this.blastParticlesList.push({
                x: originX, y: originY,
                vx: Math.cos(headingAngle) * kineticSpeed,
                vy: Math.sin(headingAngle) * kineticSpeed,
                radius: 1 + Math.random() * 2, color: colorHex,
                life: 1, decay: 0.025 + Math.random() * 0.02
            });
        }
    },

    joltViewportFrameContainer() {
        if (!this.canvas) return;
        let shakeInterval = setInterval(() => {
            this.canvas.style.transform = `translate(${(Math.random()*4)-2}px, ${(Math.random()*4)-2}px)`;
        }, 20);
        setTimeout(() => {
            clearInterval(shakeInterval);
            this.canvas.style.transform = 'none';
        }, 160);
    },

    renderVectorCanvasScene() {
        if (!this.canvasCtx || !this.canvas) return;
        this.canvasCtx.fillStyle = 'rgba(6, 7, 13, 0.28)';
        this.canvasCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.canvasCtx.textBaseline = "top";
        this.activeTargetsList.forEach(w => {
            this.canvasCtx.font = "bold 15px 'JetBrains Mono', monospace";
            this.canvasCtx.fillStyle = '#475569';
            this.canvasCtx.fillText(w.text, w.x, w.y);

            if (w.typedBufferLength > 0) {
                this.canvasCtx.fillStyle = '#89dceb';
                this.canvasCtx.fillText(w.text.substring(0, w.typedBufferLength), w.x, w.y);
            }
        });

        this.blastParticlesList.forEach(p => {
            this.canvasCtx.save();
            this.canvasCtx.globalAlpha = p.life;
            this.canvasCtx.fillStyle = p.color;
            this.canvasCtx.beginPath();
            this.canvasCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.canvasCtx.fill();
            this.canvasCtx.restore();
        });

        this.canvasCtx.font = "bold 13px 'Plus Jakarta Sans', sans-serif";
        this.canvasCtx.fillStyle = '#a6e3a1';
        this.floatingTextsList.forEach(ft => {
            this.canvasCtx.save();
            this.canvasCtx.globalAlpha = ft.life / 40;
            this.canvasCtx.fillText(ft.text, ft.x, ft.y);
            this.canvasCtx.restore();
        });
    },

    triggerGameOverSequence() {
        this.teardownActiveCycles();
        try { SynthesizedAudio.triggerGameOver(); } catch(e) {}
        try { StorageController.commitArcadeHighScore(this.scoreValue); } catch(e) {}
        
        if (window.TypeNovaGlobalHub && window.TypeNovaGlobalHub.syncDashboardMetricsDisplay) {
            window.TypeNovaGlobalHub.syncDashboardMetricsDisplay();
        }

        if (window.TypeNovaGlobalHub && window.TypeNovaGlobalHub.triggerGlobalSummaryModal) {
            window.TypeNovaGlobalHub.triggerGlobalSummaryModal(
                "🕹️ Database Core Overloaded",
                `Network security layers breached during ${this.currentDifficultySetting.toUpperCase()} run context.`,
                "TOTAL SCORE GAIN", `${this.scoreValue} PTS`,
                "PEAK LEVEL ACQUIRED", `LEVEL ${this.difficultyLevel}`,
                () => this.awakenContext()
            );
        } else {
            this.awakenContext();
        }
    }
};