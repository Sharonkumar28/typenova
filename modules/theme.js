/**
 * ==========================================================================
 * TYPENOVA MODERN INTERFACE PALETTE CONTROLLER
 * ==========================================================================
 */
import { StorageController } from './storage.js';

export const ThemeController = {
    init() {
        const cachedTheme = StorageController.getMetric('tn_interface_theme') || 'dark';
        this.applyThemeState(cachedTheme);

        document.getElementById('theme-toggle-btn').addEventListener('click', () => {
            const evaluatedNextTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            this.applyThemeState(evaluatedNextTheme);
        });
    },

    applyThemeState(themeModeString) {
        document.documentElement.setAttribute('data-theme', themeModeString);
        StorageController.setMetric('tn_interface_theme', themeModeString);
    }
};