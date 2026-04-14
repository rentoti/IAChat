document.addEventListener('DOMContentLoaded', function() {
    const shiftKeyInput = document.getElementById('shift-key');
    const symmetricInput = document.getElementById('symmetric-input');
    const symmetricSend = document.getElementById('symmetric-send');
    const symmetricMessages = document.getElementById('symmetric-messages');

    const asymmetricInput = document.getElementById('asymmetric-input');
    const asymmetricSend = document.getElementById('asymmetric-send');
    const asymmetricMessages = document.getElementById('asymmetric-messages');

    function displayMessage(container, role, title, text, details) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}`;
        messageDiv.innerHTML = `<div><strong>${title}</strong> ${text}</div>`;

        if (details) {
            details.forEach(detail => {
                const extra = document.createElement('div');
                extra.className = 'message-detail';
                extra.textContent = detail;
                messageDiv.appendChild(extra);
            });
        }

        container.appendChild(messageDiv);
        container.scrollTop = container.scrollHeight;
    }

    function sendSymmetricMessage() {
        const message = symmetricInput.value.trim();
        if (!message) return;

        const shift = parseInt(shiftKeyInput.value, 10) || 3;
        const encryptedMessage = caesarEncrypt(message, shift);
        const decryptedMessage = caesarDecrypt(encryptedMessage, shift);

        displayMessage(symmetricMessages, 'user', 'You:', message);
        symmetricInput.value = '';

        setTimeout(function() {
            displayMessage(
                symmetricMessages,
                'reply',
                'Partner:',
                encryptedMessage,
                [`Encrypted (Caesar shift ${shift})`, `Decrypted: ${decryptedMessage}`]
            );
        }, 600);
    }

    function sendAsymmetricMessage() {
        const message = asymmetricInput.value.trim();
        if (!message) return;

        const encryptedMessage = btoa(message);
        const decryptedMessage = atob(encryptedMessage);

        displayMessage(asymmetricMessages, 'user', 'You:', message);
        asymmetricInput.value = '';

        setTimeout(function() {
            displayMessage(
                asymmetricMessages,
                'reply',
                'Partner:',
                encryptedMessage,
                ['Encrypted (Base64)', `Decrypted: ${decryptedMessage}`]
            );
        }, 600);
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

    symmetricSend.addEventListener('click', sendSymmetricMessage);
    symmetricInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendSymmetricMessage();
        }
    });

    asymmetricSend.addEventListener('click', sendAsymmetricMessage);
    asymmetricInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendAsymmetricMessage();
        }
    });
});