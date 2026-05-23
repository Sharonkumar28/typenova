/**
 * ==========================================================================
 * TYPENOVA CENTRAL CORE SYSTEM ENTRYPOINT MAPPING (STABILIZED)
 * ==========================================================================
 */
import { StorageController } from './modules/storage.js';
import { ThemeController } from './modules/theme.js';
import { SynthesizedAudio } from './modules/sound.js';
import { ClassicTypingEngine } from './modules/typingEngine.js';
import { ArcadeGameEngine } from './modules/gameEngine.js';

const GlobalPlatformHub = {
    keyboardLayoutMatrix: [
        ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
        ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";"],
        ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/"],
        ["space"]
    ],

    init() {
        console.log("TypeNova Core Init: Synchronizing architectural dependencies...");
        
        // Safe bracket execution loops setup to prevent framework breakdown parameters crashes
        try { StorageController.verifyStreakRegistration(); } catch(e) { console.error("Storage Fault:", e); }
        try { ThemeController.init(); } catch(e) { console.error("Theme Fault:", e); }
        try { SynthesizedAudio.init(); } catch(e) { console.error("Audio Fault:", e); }
        
        this.paintHardwareVisualizerLayout();
        this.registerGlobalRouterEvents();
        
        try { ClassicTypingEngine.init(); } catch(e) { console.error("Classic Engine Fault:", e); }
        try { ArcadeGameEngine.init(); } catch(e) { console.error("Arcade Engine Fault:", e); }
        
        this.syncDashboardMetricsDisplay();
        this.routePlatformWorkspaceView('classic');
    },

    paintHardwareVisualizerLayout() {
        const rootNode = document.getElementById('virtual-keyboard-dom-node');
        if (!rootNode) return;
        rootNode.innerHTML = '';
        
        this.keyboardLayoutMatrix.forEach(rowGroup => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'keyboard-line-row';
            rowGroup.forEach(charToken => {
                const keyCap = document.createElement('span');
                keyCap.className = `key-cap-node ${charToken === 'space' ? 'space-cap' : ''}`;
                keyCap.textContent = charToken.toUpperCase();
                keyCap.setAttribute('data-nova-key', charToken);
                rowDiv.appendChild(keyCap);
            });
            rootNode.appendChild(rowDiv);
        });
    },

    registerGlobalRouterEvents() {
        const tabClassic = document.getElementById('nav-classic');
        const tabArcade = document.getElementById('nav-arcade');
        const audioBtn = document.getElementById('audio-toggle-btn');

        if (tabClassic) tabClassic.addEventListener('click', () => this.routePlatformWorkspaceView('classic'));
        if (tabArcade) tabArcade.addEventListener('click', () => this.routePlatformWorkspaceView('arcade'));
        
        if (audioBtn) {
            audioBtn.addEventListener('click', () => {
                const isMuted = SynthesizedAudio.toggleMuteState();
                const iconOn = audioBtn.querySelector('.audio-on-icon');
                const iconOff = audioBtn.querySelector('.audio-off-icon');
                if (isMuted) {
                    if (iconOn) iconOn.classList.add('hidden-asset');
                    if (iconOff) iconOff.classList.remove('hidden-asset');
                } else {
                    if (iconOn) iconOn.classList.remove('hidden-asset');
                    if (iconOff) iconOff.classList.add('hidden-asset');
                }
            });
        }
    },

    routePlatformWorkspaceView(targetPaneId) {
        const paneClassic = document.getElementById('classic-workspace-module');
        const paneArcade = document.getElementById('arcade-workspace-module');
        const tabClassic = document.getElementById('nav-classic');
        const tabArcade = document.getElementById('nav-arcade');

        try { ClassicTypingEngine.teardownActiveCycles(); } catch(e){}
        try { ArcadeGameEngine.teardownActiveCycles(); } catch(e){}

        if (targetPaneId === 'classic') {
            if (paneClassic) paneClassic.classList.add('active');
            if (paneArcade) paneArcade.classList.remove('active');
            if (tabClassic) tabClassic.classList.add('active');
            if (tabArcade) tabArcade.classList.remove('active');
            try { ClassicTypingEngine.awakenContext(); } catch(e){}
        } else {
            if (paneClassic) paneClassic.classList.remove('active');
            if (paneArcade) paneArcade.classList.add('active');
            if (tabClassic) tabClassic.classList.remove('active');
            if (tabArcade) tabArcade.classList.add('active');
            try { ArcadeGameEngine.awakenContext(); } catch(e){}
        }
    },

    joltVisualKeyCap(keyStringToken) {
        const capNode = document.querySelector(`.key-cap-node[data-nova-key="${keyStringToken.toLowerCase()}"]`);
        if (capNode) {
            capNode.classList.add('key-depressed-glow');
            setTimeout(() => capNode.classList.remove('key-depressed-glow'), 80);
        }
    },

    syncDashboardMetricsDisplay() {
        const streakNode = document.getElementById('streak-counter-display');
        const pbNode = document.getElementById('live-metric-pb');
        if (streakNode) streakNode.textContent = StorageController.getMetric('tn_streak') || 1;
        if (pbNode) pbNode.textContent = `${StorageController.getMetric('tn_best_wpm') || 0} WPM`;
        this.renderHistoryTelemetryLogView();
    },

    renderHistoryTelemetryLogView() {
        const listRoot = document.getElementById('leaderboard-rendering-root');
        if (!listRoot) return;
        const logsArray = StorageController.getHistoryLogs();
        listRoot.innerHTML = '';

        if (logsArray.length === 0) {
            listRoot.innerHTML = `<div class="telemetry-log-row font-mono text-center text-dimmed" style="justify-content:center;font-size:12px;">No historical telemetry found.</div>`;
            return;
        }

        logsArray.forEach((log, index) => {
            const row = document.createElement('div');
            row.className = `telemetry-log-row ${index === 0 ? 'rank-king-row' : ''}`;
            row.innerHTML = `
                <div class="log-row-meta">
                    <span class="log-row-heading">#0${index + 1} Simulation Node</span>
                    <span class="log-row-timestamp">${log.timestamp}</span>
                </div>
                <div class="log-row-score-metrics">
                    <span class="log-metric-primary">${log.wpm} WPM</span>
                    <span class="log-metric-secondary">acc: ${log.accuracy}%</span>
                </div>
            `;
            listRoot.appendChild(row);
        });
    },

    triggerGlobalSummaryModal(title, subtitle, label1, val1, label2, val2, onCloseCallback) {
        const modalNode = document.getElementById('global-summary-results-modal');
        const dismissBtn = document.getElementById('modal-dismiss-trigger-btn');
        if (!modalNode || !dismissBtn) return;

        document.getElementById('modal-title-injection-node').textContent = title;
        document.getElementById('modal-subtitle-injection-node').textContent = subtitle;
        document.getElementById('modal-metric-1-label').textContent = label1;
        document.getElementById('modal-metric-1-value').textContent = val1;
        document.getElementById('modal-metric-2-label').textContent = label2;
        document.getElementById('modal-metric-2-value').textContent = val2;

        modalNode.classList.remove('hidden-asset');
        
        const internalScopeCleanupHandler = () => {
            modalNode.classList.add('hidden-asset');
            dismissBtn.removeEventListener('click', internalScopeCleanupHandler);
            onCloseCallback();
        };
        dismissBtn.addEventListener('click', internalScopeCleanupHandler);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    GlobalPlatformHub.init();
    window.TypeNovaGlobalHub = GlobalPlatformHub;
});