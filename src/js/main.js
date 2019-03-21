(function (allModels, player) {
    var tree = {
        main: {
            object: null,
            children: {}
        },
        details: {
            object: null,
            children: {},
            playerObject: null
        }
    };
    var focusMatch = [
        'input',
        'go'
    ];
    var focused = focusMatch[0];
    var imeShown = false;

    function handleArrow () {
        tree.main.children.input.classList.toggle('focused');
        tree.main.children.go.classList.toggle('focused');
        focused = focused === focusMatch[0] ? focusMatch[1] : focusMatch[0];
    }

    function handleOk () {
        focused === focusMatch[0] ? showIme() : switchPage();
    }

    function showIme () {
        imeShown = true;
        tree.main.children.input.firstElementChild.focus();
    }

    function hideIme () {
        imeShown = false;
        tree.main.children.input.firstElementChild.blur();
    }

    function switchPage () {
        if (player.getStatus() === 'PLAYING') {
            player.stop();
            tree.details.playerObject.classList.add('hidden');
        }
        tree.main.object.classList.toggle('hidden');
        tree.details.object.classList.toggle('hidden');
        fillDetails((tree.main.children.input.firstElementChild.value || '').toUpperCase());
    }

    function fillDetails (model) {
        var chosenModel = typeof allModels[model] === 'object' ? allModels[model] : allModels.getCurrent();
        Object.keys(tree.details.children).forEach(function (propName) {
            if (tree.details.children.hasOwnProperty(propName)) {
                tree.details.children[propName].innerHTML = chosenModel[propName];
            }
        });
        if (chosenModel.trailer) {
            tree.details.playerObject.classList.remove('hidden');
            tizen.filesystem.resolve('wgt-package', function (dir) {
                player.init(`${dir.toURI()}/${chosenModel.trailer}`);
                player.play();
            }, function (e) {
                console.log('Error: ' + e.message);
            }, 'r');
        }
    }

    function isMain () {
        return tree.details.object.classList.contains('hidden');
    }

    function deeplinkHandler () {
        var reqAppControl = tizen.application.getCurrentApplication().getRequestedAppControl();

        if (reqAppControl) {
            var data = reqAppControl.appControl.data;

            for (var i = 0; i < data.length; i++) {
                if (data[i].key === 'PAYLOAD') {
                    var jsonObj = JSON.parse(data[i].value[0]);
                    if (isMain()) {
                        tree.main.children.input.firstElementChild.value = jsonObj.values;
                        switchPage();
                    } else {
                        fillDetails(jsonObj.values.toUpperCase());
                    }
                }
            }
        }
    }

    function init () {
        tree.main.object = document.querySelector('.main');
        tree.details.object = document.querySelector('.details');

        tree.main.children = {
            input: document.querySelector('.input'),
            go: document.querySelector('.go')
        };
        tree.details.children = {
            size: document.querySelector('.details-size'),
            year: document.querySelector('.details-year'),
            market: document.querySelector('.details-market'),
            series: document.querySelector('.details-series')
        };
        tree.details.playerObject = document.querySelector('.details-trailer');

        deeplinkHandler();
        window.addEventListener('appcontrol', deeplinkHandler);

        // add eventListener for keydown
        document.addEventListener('keydown', function (e) {
            switch (e.keyCode) {
                case 38: // UP arrow
                case 40: // DOWN arrow
                    if (isMain() && !imeShown) {
                        handleArrow();
                    }
                    break;
                case 13: // OK button
                    if (isMain() && !imeShown) {
                        handleOk();
                    }
                    break;
                case 65376: // Done
                case 65385: // Cancel
                    hideIme();
                    break;
                case 10009: // RETURN button
                    if (imeShown) {
                        hideIme();
                    } else {
                        isMain() ? tizen.application.getCurrentApplication().exit() : switchPage();
                    }
                    break;
                default:
                    console.log('Key code : ' + e.keyCode);
                    break;
            }
        });
    };
    window.onload = init;
})(models, new Player()); // eslint-disable-line no-undef
