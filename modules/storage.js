/**
 * ==========================================================================
 * TYPENOVA LOCALSTORAGE DATABANK CONTROLLER
 * ==========================================================================
 */
export const StorageController = {
    setMetric(key, value) {
        localStorage.setItem(key, String(value));
    },

    getMetric(key) {
        return localStorage.getItem(key);
    },

    verifyStreakRegistration() {
        const todayToken = new Date().toDateString();
        const finalRecordedDate = this.getMetric('tn_last_active_date');
        let calculatedStreak = parseInt(this.getMetric('tn_streak')) || 0;

        if (!finalRecordedDate) {
            this.setMetric('tn_streak', 1);
            this.setMetric('tn_last_active_date', todayToken);
            return;
        }

        if (finalRecordedDate !== todayToken) {
            const differenceDays = Math.floor((new Date(todayToken) - new Date(finalRecordedDate)) / (1000 * 60 * 60 * 24));
            if (differenceDays === 1) {
                calculatedStreak++;
                this.setMetric('tn_streak', calculatedStreak);
            } else if (differenceDays > 1) {
                this.setMetric('tn_streak', 1); // Reset metrics bounds if cycle broke
            }
            this.setMetric('tn_last_active_date', todayToken);
        }
    },

    commitSimulationRunLog(wpm, accuracy) {
        // Manage standard running high score metrics thresholds update path
        const currentBest = parseInt(this.getMetric('tn_best_wpm')) || 0;
        if (wpm > currentBest) {
            this.setMetric('tn_best_wpm', wpm);
        }

        // Commit profile payload history block limits maps directly
        let archive = this.getHistoryLogs();
        archive.push({
            wpm: wpm,
            accuracy: accuracy,
            timestamp: new Date().toLocaleDateString()
        });
        
        // Sort out best performance lists logs configuration maps bound targets limits down to top 5
        archive.sort((a, b) => b.wpm - a.wpm);
        archive = archive.slice(0, 5);
        this.setMetric('tn_history_logs', JSON.stringify(archive));
    },

    getHistoryLogs() {
        const rawJson = this.getMetric('tn_history_logs');
        return rawJson ? JSON.parse(rawJson) : [];
    },

    commitArcadeHighScore(highScore) {
        const recordScore = parseInt(this.getMetric('tn_arcade_pb_score')) || 0;
        if (highScore > recordScore) {
            this.setMetric('tn_arcade_pb_score', highScore);
        }
    }
};