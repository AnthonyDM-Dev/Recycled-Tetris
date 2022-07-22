export default {
    getRadians(angle) {
        return angle * Math.PI / 180;
    },
    getSin(angle) {
        const radians = this.getRadians(angle);
        return Math.sin(radians);
    },
    getCos(angle) {
        const radians = this.getRadians(angle);
        return Math.cos(radians);
    },
    getSinSign(angle) {
        return Number(this.getSin(angle).toFixed(0));
    },
    getCosSign(angle) {
        return Number(this.getCos(angle).toFixed(0));
    },
    getRandomNumInRange(min, max) {
        const randomNumber = Math.floor(Math.random() * (max - min) + min);
        return randomNumber;
    },
    getRotatedCoords(coordsToRotate, centerCoords, angle) {
        const rotatedX = Number((this.getCos(angle) * (coordsToRotate[0] - centerCoords[0]) - this.getSin(angle) * (coordsToRotate[1] - centerCoords[1]) + centerCoords[0]).toFixed(0));
        const rotatedY = Number((this.getSin(angle) * (coordsToRotate[0] - centerCoords[0]) + this.getCos(angle) * (coordsToRotate[1] - centerCoords[1]) + centerCoords[1]).toFixed(0));
        return [rotatedX, rotatedY];
    },
    isMobile() {
        return Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) < 768;
    }
}