'use strict';

var app = null;
var conch = null;
var handle = null;

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

    // 핸들
    handle = new PIXI.Graphics();
    handle.lineStyle(20, 0xccd6dd);
    handle.beginFill(0x66757f, 1);
    handle.drawCircle(0, 0, 30);
    handle.endFill();
    handle.buttonMode = true;
    handle.interactive = true;

    handle
        .on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove);
    app.stage.addChild(handle);
    onRender();
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
}

function onDragStart(event) {
    this.data = event.data;
    this.dragging = true;
}

function onDragEnd() {
    this.dragging = false;
    this.data = null;
}

function onDragMove() {
    if (this.dragging) {
        var newPosition = this.data.getLocalPosition(this.parent);
        this.x = newPosition.x;
        this.y = newPosition.y;
    }
}