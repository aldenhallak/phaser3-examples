var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);
var sprite;
var lockText;

function preload ()
{
    this.load.image('ship', 'assets/sprites/ship.png');
}

function create ()
{
    sprite = this.add.sprite(400, 300, 'ship');

    // Pointer lock will only work after an 'engagement gesture', e.g. mousedown, keypress, etc.
    game.canvas.addEventListener('mousedown', function () {
        game.input.mouse.requestPointerLock();
    });

    // When locked, you will have to use the movementX and movementY properties of the pointer
    // (since a locked cursor's xy position does not update)
    this.input.on('pointermove', function (pointer) {

        if (this.input.mouse.locked)
        {
            sprite.x += pointer.movementX;
            sprite.y += pointer.movementY;

            // Force the sprite to stay on screen
            sprite.x = Phaser.Math.Wrap(sprite.x, 0, game.renderer.width);
            sprite.y = Phaser.Math.Wrap(sprite.y, 0, game.renderer.height);

            if (pointer.movementX > 0) { sprite.setRotation(0.1); }
            else if (pointer.movementX < 0) { sprite.setRotation(-0.1); }
            else { sprite.setRotation(0); }

            updateLockText(true);
        }

    }, this);

    // Exit pointer lock when Q is pressed. Browsers will also exit pointer lock when escape is
    // pressed.
    this.input.keyboard.on('KEY_DOWN_Q', function (event) {
        if (this.input.mouse.locked)
        {
            game.input.mouse.releasePointerLock();
        }
    }, 0, this);

    // Optionally, you can subscribe to the game's pointer lock change event to know when the player
    // enters/exits pointer lock. This is useful if you need to update the UI, change to a custom
    // mouse cursor, etc.
    game.input.on('POINTER_LOCK_CHANGE_EVENT', function (event) {
        updateLockText(event.isPointerLocked, sprite.x, sprite.y);
    }, 0, this);

    lockText = this.add.text(16, 16, '', {
        fontSize: '20px',
        fill: '#ffffff'
    });
    updateLockText(false);
}

function updateLockText (isLocked)
{
    lockText.setText([
        isLocked ? 'The pointer is now locked!' : 'The pointer is now unlocked.',
        'Sprite is at: (' + sprite.x + ',' + sprite.y + ')',
        'Press Q to release pointer lock.'
    ]);
}
