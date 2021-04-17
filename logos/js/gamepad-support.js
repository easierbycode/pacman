var haveEvents  = 'ongamepadconnected' in window;
var controllers = {};
var keyCodes    = [
{
  L : 37,
  U : 38,
  R : 39,
  D : 40
},
{
  L : 65,
  U : 87,
  R : 68,
  D : 83
}
];

function connecthandler(e) {
  console.log( '.. adding gamepad:' );
  console.log( e.gamepad );
  addgamepad( e.gamepad );
}

function addgamepad(gamepad) {
  controllers[gamepad.index] = gamepad;

  requestAnimationFrame(updateStatus);
}

function disconnecthandler(e) {
  removegamepad(e.gamepad);
}

function removegamepad(gamepad) {
  delete controllers[gamepad.index];
}

function updateStatus() {
  if (!haveEvents) {
    scangamepads();
  }

  for (j in controllers) {

    var controller  = controllers[j];

    for (i = 0; i < controller.buttons.length; i++) {

      //up, down, left, right
      var U = i === 12,
          D = i === 13,
          L = i === 14,
          R = i === 15;

      if (U || D || L || R) {

        var val = controller.buttons[i];
 
        var pressed = val.pressed;

        if ( pressed ) {

          var event = document.createEvent('event');
          event.initEvent('keydown', true, true);
          if (U)  event.keyCode = keyCodes[controller.index].U;
          if (D)  event.keyCode = keyCodes[controller.index].D;
          if (L)  event.keyCode = keyCodes[controller.index].L;
          if (R)  event.keyCode = keyCodes[controller.index].R;
          document.getElementById( 'logo' ).dispatchEvent( event );
        }
      }
    }
  }

  requestAnimationFrame(updateStatus);
}

function scangamepads() {
  var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
  for (var i = 0; i < gamepads.length; i++) {
    if (gamepads[i]) {
      if (gamepads[i].index in controllers) {
        controllers[gamepads[i].index] = gamepads[i];
      } else {
        addgamepad(gamepads[i]);
      }
    }
  }
}


window.addEventListener("gamepadconnected", connecthandler);
window.addEventListener("gamepaddisconnected", disconnecthandler);

if (!haveEvents) scangamepads();