'use strict';

// 핸들이 원래 위치에 있는경우
var HANDLE_STATUS_FIXED = 0;
// 핸들이 떨어지는경우
var HANDLE_STATUS_FALL = 1;
// 핸들이 올라가는경우
var HANDLE_STATUS_GOUP = 2;

// 목표지점
var HANDLE_X = null;
var HANDLE_Y = null;

var LINE_X = null;
var LINE_Y = null;

var app = null;
var conch = null;
var handle = null;
var line = null;


// 페이지 로딩완료
window.onload = function () {
    app = new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    app.renderer.autoResize = true;
    app.renderer.backgroundColor = 0x9bd7d8;
    document.getElementById('canvas-wrapper')
        .appendChild(app.view);

    // 소라고동 설정
    conch = PIXI.Sprite.fromImage('conch.png');
    conch.anchor.set(0.5);
    app.stage.addChild(conch);

    line = new PIXI.Graphics();
    app.stage.addChild(line);

    // 핸들
    handle = new PIXI.Graphics();
    handle.lineStyle(20, 0xffffff);
    handle.beginFill(0x66757f, 0);
    handle.drawCircle(0, 0, 30);
    handle.endFill();
    handle.buttonMode = true;
    handle.interactive = true;

    handle
        .on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove);
    handle.status = HANDLE_STATUS_FIXED;
    app.stage.addChild(handle);
    onRender();
    drawLine(handle.x, handle.y);
    // handle의 움직임
    app.ticker.add(function (delta) {
        // 핸들이 떨어지는경우
        if (handle.status === HANDLE_STATUS_FALL) {
        }
        // 핸들이 올라가는 경우
        if (handle.status === HANDLE_STATUS_GOUP) {
            var height = handle.y - HANDLE_Y;
            var width = handle.x - HANDLE_X;
            var scale = Math.abs(height / width);
            var speed = 10 * Math.abs(width) / Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
            handle.y += scale * speed * (height > 0 ? -1 : 1);
            handle.x += speed * (width > 0 ? -1 : 1);
            if (Math.abs(width) < speed && Math.abs(height < scale * speed)) {
                handle.x = HANDLE_X;
                handle.y = HANDLE_Y;
                handle.status = HANDLE_STATUS_FIXED;
            }
            drawLine(handle.x, handle.y);
        }
        // 핸들이 한계까지 갔을경우
    });
};

// 페이지 사이즈 변경
// Canvas 크기변경 및 모든 리소스 위치수정
window.onresize = function () {
    app.renderer.resize(window.innerWidth, window.innerHeight);
    onRender();
};

// 화면이 크기가 변경되거나 생성되었음
function onRender() {
    conch.x = app.screen.width * 0.5;
    conch.y = app.screen.height * 0.5;
    if (app.screen.width < 512) {
        conch.height = conch.width = app.screen.width;
    } else {
        conch.width = 512;
        conch.height = 512;
    }
    HANDLE_X = app.screen.width / 2 + 90;
    HANDLE_Y = app.screen.height / 2 - 180;
    LINE_X = app.screen.width / 2 + 90;
    LINE_Y = app.screen.height / 2 - 150;
    handle.x = HANDLE_X;
    handle.y = HANDLE_Y;
}

function onDragStart(event) {
    this.data = event.data;
    this.dragging = true;
    handle.status = HANDLE_STATUS_FIXED;
}

function onDragEnd() {
    this.dragging = false;
    this.data = null;
    handle.status = HANDLE_STATUS_GOUP;
}

function onDragMove() {
    if (this.dragging) {
        var newPosition = this.data.getLocalPosition(this.parent);
        this.x = newPosition.x;
        this.y = newPosition.y;
        drawLine(this.x, this.y);
    }
}

function drawLine(x, y) {
    line.clear();
    line.lineStyle(6, 0xffffff);
    line.moveTo(LINE_X, LINE_Y);
    var width = (LINE_X - x);
    var height = (LINE_Y - y);
    var scale = Math.abs(height / width);
    var moveX = Math.sqrt(400 / (Math.pow(scale, 2) + 1)) * (width < 0 ? 1 : -1);
    var moveY = scale * Math.abs(moveX) * (height < 0 ? 1 : -1);
    line.lineTo(x - moveX, y - moveY);
}

function playRandomSound() {
    
}