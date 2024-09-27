/**
 * Initializes keyboard focus behavior by adding classes to the body element based on user input.
 * Listens for 'mousedown' and 'keydown' events to determine if user is using mouse or keyboard.
 * Adds 'using-mouse' class when mouse is used and 'using-keyboard' class when keyboard is used.
 */
const initKeyboardFocus = () => {
    window.addEventListener('DOMContentLoaded', () => {
        const $body = $(document.body);
        const mouseClass = 'using-mouse'
        const keyboardClass = 'using-keyboard';
    
        $body.on('mousedown', function () {
            const $this = $(this);
            $this.addClass(mouseClass);
            $this.removeClass(keyboardClass);
        });
    
        $body.on('keydown', function (event) {
            const eventKey = event.key;
            if (!eventKey) {
                return;
            }
    
            const key = eventKey.toLowerCase();
            const isLetter = /^[a-zA-Z0-9]$|^enter$|^backspace$|^\s$/.test(key);
    
            if (!isLetter) {
                const $this = $(this);
                $this.addClass(keyboardClass);
                $this.removeClass(mouseClass);
            }
        });
    });
}


export default initKeyboardFocus;
