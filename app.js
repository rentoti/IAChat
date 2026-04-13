document.addEventListener('DOMContentLoaded', function() {
    const modeRadios = document.querySelectorAll('input[name="mode"]');
    const symmetricControls = document.getElementById('symmetric-controls');
    const shiftKeyInput = document.getElementById('shift-key');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const messagesContainer = document.getElementById('chat-messages');

    let currentMode = 'symmetric';

    // Toggle controls based on mode
    modeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            currentMode = this.value;
            if (currentMode === 'symmetric') {
                symmetricControls.style.display = 'block';
            } else {
                symmetricControls.style.display = 'none';
            }
        });
    });

    // Send message
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const message = messageInput.value.trim();
        if (!message) return;

        let encryptedMessage;
        let decryptedMessage;

        if (currentMode === 'symmetric') {
            const shift = parseInt(shiftKeyInput.value) || 3;
            encryptedMessage = caesarEncrypt(message, shift);
            decryptedMessage = caesarDecrypt(encryptedMessage, shift);
        } else {
            // Base64 "asymmetric" demo
            encryptedMessage = btoa(message); // Encode to Base64
            decryptedMessage = atob(encryptedMessage); // Decode from Base64
        }

        // Display the message
        displayMessage(message, encryptedMessage, decryptedMessage);

        // Clear input
        messageInput.value = '';
    }

    function displayMessage(original, encrypted, decrypted) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message';
        messageDiv.innerHTML = `
            <strong>Original:</strong> ${original}<br>
            <strong>Encrypted:</strong> ${encrypted}<br>
            <strong>Decrypted:</strong> ${decrypted}
        `;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Caesar cipher functions
    function caesarEncrypt(text, shift) {
        return text.split('').map(char => {
            if (char.match(/[a-z]/i)) {
                const code = char.charCodeAt(0);
                const base = code >= 65 && code <= 90 ? 65 : 97;
                return String.fromCharCode(((code - base + shift) % 26) + base);
            }
            return char;
        }).join('');
    }

    function caesarDecrypt(text, shift) {
        return caesarEncrypt(text, 26 - shift);
    }
});