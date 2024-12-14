export class CanvasDrawer {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = this.canvas.getContext("2d");
        this.context.strokeStyle = "#000";
        this.context.lineWidth = 2;
    }

    drawLine(fromX, fromY, toX, toY) {
        this.context.beginPath();
        this.context.moveTo(fromX, fromY);
        this.context.lineTo(toX, toY);
        this.context.stroke();
    }

    drawHead() {
        this.context.beginPath();
        this.context.arc(70, 30, 10, 0, Math.PI * 2, true);
        this.context.stroke();
    }

    drawBody() {
        this.drawLine(70, 40, 70, 80);
    }

    drawLeftArm() {
        this.drawLine(70, 50, 50, 70);
    }

    drawRightArm() {
        this.drawLine(70, 50, 90, 70);
    }

    drawLeftLeg() {
        this.drawLine(70, 80, 50, 110);
    }

    drawRightLeg() {
        this.drawLine(70, 80, 90, 110);
    }

    initialDrawing() {
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        this.drawLine(10, 130, 130, 130);  // Bottom line
        this.drawLine(10, 10, 10, 131);    // Left line
        this.drawLine(10, 10, 70, 10);     // Top line
        this.drawLine(70, 10, 70, 20);     // Small top line
    }
}
