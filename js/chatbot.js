// chatbot.js - MODERNO/LAB ChatBot Modular con Persistencia
(function() {
    'use strict';

    // Configuración
    const WEBHOOK_URL = 'https://nonelementary-gentler-flora.ngrok-free.dev/webhook/1e361ea6-99ce-4ecc-9da4-f95acd9db618';
    const STORAGE_KEY = 'mamba_chatbot_history';
    const STORAGE_STATE_KEY = 'mamba_chatbot_state';
    
    // Inyectar HTML del chatbot
    function injectChatbotHTML() {
        const chatbotHTML = `
            <!-- Botón flotante del chatbot -->
            <div id="chatbot-button" data-tooltip="¡ChatBot!">
            </div>
                <div id="thought-bubble" class="thought-bubble">
                    <span id="thought-text"></span>
                </div>
            <!-- Contenedor del chatbot -->
            <div id="chatbot-container">
                <div id="chatbot-header">
                    <h3>🎨 MODERNO/LAB - ChatBot</h3>
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <button id="download-chat-button" data-tooltip="Descargar conversación" style="background: none; border: none; color: white; font-size: 18px; cursor: pointer; padding: 0; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; position: relative;">📥</button>
                        <button id="clear-chat-button" data-tooltip="Limpiar conversación" style="background: none; border: none; color: white; font-size: 18px; cursor: pointer; padding: 0; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; position: relative;">🗑️</button>
                        <button id="close-button" data-tooltip="Cerrar ChatBot" style="background: none; border: none; color: white; font-size: 24px; cursor: pointer; padding: 0; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; position: relative;">&times;</button>
                    </div>
                </div>
                <div id="chatbot-messages">
                    <div class="message bot welcome">
                        ¡Bienvenid@ a MODERNO/LAB ChatBot! Podés consultarme sobre todo lo relacionado con el Arte, su conservación y restauración. ¡Espero poder ayudarte!
                    </div>
                </div>
                <div id="chatbot-input-area">
                    <input type="text" id="chatbot-input" placeholder="Escribí tu consulta..." />
                    <button id="send-button">Enviar</button>
                </div>
                <!-- Modal de confirmación personalizado -->
                <div id="confirm-modal-overlay" class="confirm-modal-overlay">
                    <div id="confirm-modal" class="confirm-modal">
                        <div class="confirm-modal-header">
                            <span class="confirm-modal-icon">🗑️</span>
                            <h3>MODERNO/LAB ChatBot</h3>
                        </div>
                        <div class="confirm-modal-body">
                            <p>¿Estás seguro de que querés limpiar toda la conversación?</p>
                        </div>
                        <div class="confirm-modal-footer">
                            <button id="confirm-modal-cancel" class="confirm-modal-btn confirm-modal-btn-cancel">Cancelar</button>
                            <button id="confirm-modal-confirm" class="confirm-modal-btn confirm-modal-btn-confirm">Aceptar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }

    // Inyectar CSS del chatbot
    function injectChatbotCSS() {
        const style = document.createElement('style');
        style.textContent = `
            /* Botón flotante del chatbot */
            #chatbot-button {
                position: fixed;
                bottom: 110px;
                right: 23px;
                width: 80px;
                height: 80px;
                background-color: white;
                background-image: url('../assets/img/logo.png');
                background-size: 100%;
                background-position: center;
                background-repeat: no-repeat;
                border: 4px solid black;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
                transition: transform 0.4s, box-shadow 0.4s;
                z-index: 9998;
                overflow: hidden;
            }

            #chatbot-button:hover {
                transform: scale(1.1);
                box-shadow: 0 12px 36px rgba(0, 0, 0, 0.6);
            }
            /*
            /* Tooltip */
            #chatbot-button::before {
                content: attr(data-tooltip);
                position: absolute;
                bottom: 20px;
                right: -5px;
                background-color: black;
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-family: 'MuseoModerno', cursive;
                font-size: 14px;
                white-space: nowrap;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                z-index: 10000;
            }
            
            #chatbot-button:hover::before {
                opacity: 1;
            }
            
            #chatbot-button::after {
                content: '';
                position: absolute;
                bottom: 62px;
                right: 24px;
                width: 0;
                height: 0;
                border-left: 6px solid transparent;
                border-right: 6px solid transparent;
                border-top: 6px solid black;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s;
            }
            
            #chatbot-button:hover::after {
                  opacity: 1;
            }
            */
            /* Burbuja de pensamiento */
            .thought-bubble {
                position: fixed;
                bottom: 205px; /* Ajustado para estar arriba del botón */
                right: 30px;
                background-color: white;
                border: 4px groove black;
                border-radius: 20px;
                padding: 12px 18px;
                min-width: 120px;
                opacity: 0;
                pointer-events: none;
                z-index: 9999;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                transform-origin: bottom center;
            }
            
            .thought-bubble::before {
                content: '';
                position: absolute;
                bottom: -15px;
                left: 50%;
                transform: translateX(-50%);
                width: 20px;
                height: 20px;
                background-color: white;
                border: 4px groove black;
                border-radius: 50%;
                border-top: none;
                border-left: none;
            }
            
            .thought-bubble::after {
                content: '';
                position: absolute;
                bottom: -28px;
                left: 50%;
                transform: translateX(-50%);
                width: 12px;
                height: 12px;
                background-color: white;
                border: 4px groove black;
                border-radius: 50%;
                border-top: none;
                border-left: none;
            }
            
            .thought-bubble.show {
                animation: bubbleAppear 1.0s ease-out forwards;
            }
            
            .thought-bubble.hide {
                animation: bubbleDisappear 1.5s ease-in forwards;
            }
            
            @keyframes bubbleAppear {
                0% {
                    opacity: 0;
                    transform: scale(0) translateY(10px);
                }
                100% {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
            }
            
            @keyframes bubbleDisappear {
                0% {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
                100% {
                    opacity: 0;
                    transform: scale(0) translateY(10px);
                }
            }
            
            #thought-text {
                font-family: 'MuseoModerno', cursive;
                font-size: 16px;
                font-weight: 600;
                color: black;
                display: block;
                text-align: center;
                white-space: nowrap;
            }
            
            /* Responsive para burbuja */
            @media (max-width: 768px) {
                .thought-bubble {
                    bottom: 90px;
                    right: 20px;
                    padding: 10px 15px;
                    min-width: 100px;
                }
                
                #thought-text {
                    font-size: 14px;
                }
            }
            
            @media (min-width: 769px) and (max-width: 1024px) {
                .thought-bubble {
                    bottom: 95px;
                    right: 25px;
                }
            }
            
            /* Animación de sacudida */
            @keyframes shake {
                0%, 100% { transform: translateX(0) rotate(0deg); }
                10% { transform: translateX(-3px) rotate(-2deg); }
                20% { transform: translateX(3px) rotate(2deg); }
                30% { transform: translateX(-3px) rotate(-2deg); }
                40% { transform: translateX(3px) rotate(2deg); }
                50% { transform: translateX(-3px) rotate(-2deg); }
                60% { transform: translateX(3px) rotate(2deg); }
                70% { transform: translateX(-3px) rotate(-2deg); }
                80% { transform: translateX(3px) rotate(2deg); }
                90% { transform: translateX(-3px) rotate(-2deg); }
            }
            
            /* Animación de caída y rebote */
            @keyframes fallAndBounce {
                0% {
                    transform: translateY(0) rotate(0deg);
                    opacity: 1;
                }
                30% {
                    transform: translateY(0) rotate(10deg);
                }
                50% {
                    transform: translateY(calc(100vh + 100px)) rotate(180deg);
                    opacity: 0.5;
                }
                51% {
                    transform: translateY(calc(100vh + 100px)) rotate(180deg);
                    opacity: 0;
                }
                52% {
                    transform: translateY(-100px) rotate(180deg);
                    opacity: 0;
                }
                70% {
                    transform: translateY(0) rotate(360deg);
                    opacity: 1;
                }
                80% {
                    transform: translateY(-20px) rotate(360deg);
                }
                90% {
                    transform: translateY(0) rotate(360deg);
                }
                95% {
                    transform: translateY(-10px) rotate(360deg);
                }
                100% {
                    transform: translateY(0) rotate(360deg);
                    opacity: 1;
                }
            }
            
            .chatbot-button-shake {
                animation: shake 0.5s ease-in-out;
            }
            
            .chatbot-button-fall {
                animation: fallAndBounce 2s ease-in-out;
            }
            
            /* Contenedor del chatbot */
            #chatbot-container {
                position: fixed;
                bottom: 100px;
                right: 23px;
                width: 380px;
                height: 400px;
                background-color: white;
                border: 2px solid black;
                border-radius: 16px;
                display: none;
                flex-direction: column;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
                z-index: 9999;
                overflow: hidden;
            }

            #chatbot-container.active {
                display: flex;
            }
            
             /* Header del chatbot */
            #chatbot-header {
                background-color: black;
                color: white;
                padding: 10px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            #chatbot-header h3 {
                color: white;
                font-size: 18px;
                font-weight: 600;
                padding-top: 5px;
                padding-bottom: 5px;
                font-family: 'MuseoModerno', cursive;
            }
            
            /* Estilos base para todos los botones del header */
            #close-button,
            #clear-chat-button,
            #download-chat-button {
                position: relative;
            }
            
            #close-button:hover,
            #clear-chat-button:hover,
            #download-chat-button:hover {
                opacity: 1.0;
            }
            
            /* Tooltips para todos los botones del header */
            #download-chat-button::before,
            #clear-chat-button::before,
            #close-button::before {
                content: attr(data-tooltip);
                position: absolute;
                bottom: -55px;
                right: 0;
                background-color: #333;
                color: white;
                padding: 6px 10px;
                border-radius: 6px;
                font-family: 'MuseoModerno', cursive;
                font-size: 12px;
                white-space: nowrap;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.4s;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                z-index: 10000;
            }
            
            #download-chat-button:hover::before,
            #clear-chat-button:hover::before,
            #close-button:hover::before {
                opacity: 1;
            }
            
            /* Flechitas de los tooltips */
            #download-chat-button::after,
            #clear-chat-button::after,
            #close-button::after {
                content: '';
                position: absolute;
                bottom: 27px;
                right: 8px;
                width: 0;
                height: 0;
                border-left: 5px solid transparent;
                border-right: 5px solid transparent;
                border-top: 5px solid #333;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s;
            }
            
            #download-chat-button:hover::after,
            #clear-chat-button:hover::after,
            #close-button:hover::after {
                opacity: 1;
            }
            
            /* Ajuste específico para el botón de cerrar (es más grande) */
            #close-button::after {
                right: 12px;
            }

            /* Área de mensajes */
            #chatbot-messages {
                flex: 1;
                padding: 20px;
                overflow-y: auto;
                background-color: #f9f9f9;
            }

            .message {
                margin-bottom: 15px;
                padding: 12px 16px;
                border-radius: 12px;
                max-width: 80%;
                word-wrap: break-word;
                font-family: 'Consolas', 'Courier New', monospace, 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji';
                font-size: 14px;
                line-height: 1.5;
            }
            
            .message.bot.welcome {
                font-family: 'MuseoModerno', cursive;
                background-color: #EFE4B0 !important;
                font-weight: bold;
                max-width: calc(100% - 20px) !important;
                margin-left: 10px;
                margin-right: 10px;
                border: 1px solid #d4c98a;
            }

            .message.bot {
                background-color: white;
                color: black;
                border: 1px solid #e0e0e0;
                align-self: flex-start;
            }

            .message.user {
                background-color: black;
                color: white;
                margin-left: auto;
                text-align: right;
            }

            .message.error {
                background-color: #ffebee;
                color: #c62828;
                border: 1px solid #ef5350;
                font-size: 14px;
            }

            .message.loading {
                background-color: white;
                color: black;
                border: 1px solid #e0e0e0;
                position: relative;
            }

            /* Animación para mensaje de carga */
            .loading-dots::after {
                content: '';
                animation: loading-dots 1.5s infinite;
            }

            @keyframes loading-dots {
                0%, 20% {
                    content: '';
                }
                40% {
                    content: '.';
                }
                60% {
                    content: '..';
                }
                80%, 100% {
                    content: '...';
                }
            }

            /* Estilos para links en mensajes */
            .message a {
                color: inherit;
                text-decoration: underline;
                word-break: break-all;
            }

            .message.bot a {
                color: #0066cc;
            }

            .message.user a {
                color: #ffffff;
                text-decoration: underline;
            }

            .message a:hover {
                opacity: 0.8;
            }

            /* Área de input */
            #chatbot-input-area {
                padding: 15px;
                border-top: 1px solid #e0e0e0;
                display: flex;
                gap: 10px;
                background-color: white;
            }

            #chatbot-input {
                flex: 1;
                padding: 12px;
                border: 1px solid black;
                border-radius: 8px;
                font-family: 'Consolas', 'Courier New', monospace;
                font-size: 14px;
                outline: none;
            }

            #chatbot-input::placeholder {
                color: #999;
            }

            #send-button {
                background-color: black;
                color: white;
                border: none;
                padding: 12px 20px;
                border-radius: 8px;
                cursor: pointer;
                font-family: 'MuseoModerno', cursive;
                font-weight: 600;
                transition: opacity 0.2s;
            }

            #send-button:hover:not(:disabled) {
                opacity: 0.8;
            }

            #send-button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            /* Scrollbar personalizado */
            #chatbot-messages::-webkit-scrollbar {
                width: 6px;
            }

            #chatbot-messages::-webkit-scrollbar-track {
                background: #f1f1f1;
            }

            #chatbot-messages::-webkit-scrollbar-thumb {
                background: #888;
                border-radius: 3px;
            }

            #chatbot-messages::-webkit-scrollbar-thumb:hover {
                background: #555;
            }

            /* Responsive */
            @media (max-width: 768px) {
                #chatbot-container {
                    width: 100vw;
                    height: 90vh;
                    right: 0;
                    bottom: 0;
                    border-radius: 0;
                    border: none;
                }

                #chatbot-button {
                    bottom: 20px;
                    right: 20px;
                    width: 56px;
                    height: 56px;
                    border-width: 3px;
                }

                #chatbot-header {
                    min-height: 60px;
                }
                
                #chatbot-header h3 {
                    font-size: 16px;
                }
                
                #close-button {
                    padding: 0 16px;
                    font-size: 22px;
                }

                #chatbot-messages {
                    padding: 15px;
                }

                .message {
                    font-size: 14px;
                    max-width: 85%;
                }

                #chatbot-input-area {
                    padding: 12px;
                }

                #chatbot-input {
                    padding: 10px;
                    font-size: 14px;
                }

                #send-button {
                    padding: 10px 16px;
                    font-size: 14px;
                }
            }

            @media (min-width: 769px) and (max-width: 1024px) {
                #chatbot-container {
                    width: 360px;
                    height: 400px;
                }

                #chatbot-button {
                    bottom: 25px;
                    right: 25px;
                }
            }

            @media (min-width: 1025px) {
                #chatbot-container {
                    width: 400px;
                    height: 500px;
                }
            }

            /* Landscape mobile */
            @media (max-width: 768px) and (orientation: landscape) {
                #chatbot-container {
                    height: 100vh;
                }

                #chatbot-messages {
                    padding: 10px;
                }

                .message {
                    margin-bottom: 10px;
                    padding: 10px 14px;
                }
            }

            /* Modal de confirmación personalizado */
            .confirm-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.6);
                display: none;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                animation: fadeIn 0.2s ease-in-out;
            }
            
            .confirm-modal-overlay.active {
                display: flex;
            }
            
            @keyframes fadeIn {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }
            
            .confirm-modal {
                background-color: white;
                border: 2px solid black;
                border-radius: 12px;
                width: 90%;
                max-width: 400px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
                animation: slideIn 0.3s ease-out;
            }
            
            @keyframes slideIn {
                from {
                    transform: translateY(-50px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            
            .confirm-modal-header {
                background-color: black;
                color: white;
                padding: 15px 20px;
                border-radius: 10px 10px 0 0;
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .confirm-modal-icon {
                font-size: 28px;
                line-height: 1;
            }
            
            .confirm-modal-header h3 {
                font-family: 'MuseoModerno', cursive;
                font-size: 18px;
                font-weight: 600;
                margin: 0;
                color: white;
            }
            
            .confirm-modal-body {
                padding: 30px 20px;
                text-align: center;
            }
            
            .confirm-modal-body p {
                font-family: 'Consolas', 'Courier New', monospace;
                font-size: 16px;
                color: #333;
                margin: 0;
                line-height: 1.5;
            }
            
            .confirm-modal-footer {
                padding: 15px 20px 20px;
                display: flex;
                justify-content: flex-end;
                gap: 10px;
            }
            
            .confirm-modal-btn {
                padding: 10px 24px;
                border-radius: 8px;
                font-family: 'MuseoModerno', cursive;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: opacity 0.2s, transform 0.1s;
                border: none;
            }
            
            .confirm-modal-btn:hover {
                opacity: 0.8;
            }
            
            .confirm-modal-btn:active {
                transform: scale(0.95);
            }
            
            .confirm-modal-btn-cancel {
                background-color: #e0e0e0;
                color: #333;
            }
            
            .confirm-modal-btn-confirm {
                background-color: black;
                color: white;
            }
            
            /* Responsive para modal */
            @media (max-width: 768px) {
                .confirm-modal {
                    width: 85%;
                    max-width: 320px;
                }
                
                .confirm-modal-header h3 {
                    font-size: 16px;
                }
                
                .confirm-modal-body {
                    padding: 25px 15px;
                }
                
                .confirm-modal-body p {
                    font-size: 14px;
                }
                
                .confirm-modal-btn {
                    padding: 8px 20px;
                    font-size: 13px;
                }
            }
        `;
        
        document.head.appendChild(style);
    }

    // Variables globales del módulo
    let chatbotButton, chatbotContainer, closeButton, messagesArea, inputField, sendButton, clearChatButton;
    let isProcessing = false;

    // Funciones de almacenamiento
    function saveMessageToStorage(message, type) {
        try {
            const history = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            history.push({ message, type, timestamp: Date.now() });
            localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
        } catch (e) {
            console.error('Error guardando mensaje:', e);
        }
    }

    function loadHistoryFromStorage() {
        try {
            const history = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            return history;
        } catch (e) {
            console.error('Error cargando historial:', e);
            return [];
        }
    }

    function clearHistory() {
        try {
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem(STORAGE_STATE_KEY);
        } catch (e) {
            console.error('Error limpiando historial:', e);
        }
    }

    function saveChatState(isOpen) {
        try {
            localStorage.setItem(STORAGE_STATE_KEY, JSON.stringify({ isOpen }));
        } catch (e) {
            console.error('Error guardando estado:', e);
        }
    }

    function loadChatState() {
        try {
            const state = JSON.parse(localStorage.getItem(STORAGE_STATE_KEY) || '{}');
            return state;
        } catch (e) {
            console.error('Error cargando estado:', e);
            return {};
        }
    }
    
    // Función para agregar mensajes con formato enriquecido
    function addMessage(text, type = 'bot', saveToStorage = true) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        
        // Procesar el texto para convertir URLs en links clickeables
        let processedText = text;
        
        // Regex para detectar URLs
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        processedText = processedText.replace(urlRegex, (url) => {
            return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: underline;">${url}</a>`;
        });
        
        // Usar innerHTML en lugar de textContent para permitir HTML
        messageDiv.innerHTML = processedText;
        
        messagesArea.appendChild(messageDiv);
        
        // Ajustar scroll según el tipo de mensaje
        if (type === 'user') {
            // Si es mensaje del usuario, hacer scroll hasta ese mensaje
            setTimeout(() => {
                messageDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        } else if (type === 'bot') {
            // Si es mensaje del bot, buscar el último mensaje del usuario
            const userMessages = messagesArea.querySelectorAll('.message.user');
            const lastUserMessage = userMessages[userMessages.length - 1];
            
            if (lastUserMessage) {
                // Hacer scroll para mostrar el mensaje del usuario y el inicio de la respuesta
                setTimeout(() => {
                    lastUserMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        }
        
        // Guardar en localStorage (excepto mensajes de carga y bienvenida)
        if (saveToStorage && type !== 'loading' && !messageDiv.classList.contains('welcome')) {
            saveMessageToStorage(text, type);
        }
        
        return messageDiv;
    }

    // Función especial para mensaje de carga con animación
    function addMessageLoading(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message loading';
        
        const textSpan = document.createElement('span');
        textSpan.textContent = text;
        
        const dotsSpan = document.createElement('span');
        dotsSpan.className = 'loading-dots';
        
        messageDiv.appendChild(textSpan);
        messageDiv.appendChild(dotsSpan);
        
        messagesArea.appendChild(messageDiv);
        messagesArea.scrollTop = messagesArea.scrollHeight;
        return messageDiv;
    }

    // Función para restaurar historial
    function restoreHistory() {
        const history = loadHistoryFromStorage();
        
        // Limpiar mensajes actuales excepto el de bienvenida
        const welcomeMsg = messagesArea.querySelector('.message.bot.welcome');
        messagesArea.innerHTML = '';
        if (welcomeMsg) {
            messagesArea.appendChild(welcomeMsg);
        }
        
        // Restaurar mensajes guardados
        history.forEach(item => {
            addMessage(item.message, item.type, false);
        });
    }

    // Función para mostrar modal de confirmación
    function showConfirmModal(onConfirm) {
        const overlay = document.getElementById('confirm-modal-overlay');
        const confirmBtn = document.getElementById('confirm-modal-confirm');
        const cancelBtn = document.getElementById('confirm-modal-cancel');
        
        overlay.classList.add('active');
        
        // Función para cerrar modal
        function closeModal() {
            overlay.classList.remove('active');
            confirmBtn.removeEventListener('click', handleConfirm);
            cancelBtn.removeEventListener('click', closeModal);
            overlay.removeEventListener('click', handleOverlayClick);
        }
        
        // Handler para confirmar
        function handleConfirm() {
            closeModal();
            onConfirm();
        }
        
        // Handler para click fuera del modal
        function handleOverlayClick(e) {
            if (e.target === overlay) {
                closeModal();
            }
        }
        
        // Event listeners
        confirmBtn.addEventListener('click', handleConfirm);
        cancelBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', handleOverlayClick);
        
        // Cerrar con tecla Escape
        function handleEscape(e) {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleEscape);
            }
        }
        document.addEventListener('keydown', handleEscape);
    }
    
    // Función para limpiar conversación
    function clearChat() {
        showConfirmModal(() => {
            clearHistory();
            
            // Limpiar área de mensajes
            const welcomeMsg = messagesArea.querySelector('.message.bot.welcome');
            messagesArea.innerHTML = '';
            if (welcomeMsg) {
                messagesArea.appendChild(welcomeMsg);
            }
            
            //console.log('Conversación limpiada');
        });
    }

    // Función para descargar conversación
    function downloadChat() {
        const history = loadHistoryFromStorage();
        
        if (history.length === 0) {
            alert('No hay conversación para descargar.');
            return;
        }
        
        // Crear contenido del archivo
        let contenido = '===========================================\n';
        contenido += 'CONVERSACIÓN - MODERNO/LAB ChatBot\n';
        contenido += 'Museo Moderno - Laboratorio de Conservación\n';
        contenido += '===========================================\n\n';
        contenido += `Fecha de descarga: ${new Date().toLocaleString('es-AR')}\n`;
        contenido += `Total de mensajes: ${history.length}\n\n`;
        contenido += '===========================================\n\n';
        
        // Agregar mensajes
        history.forEach((item, index) => {
            const fecha = new Date(item.timestamp).toLocaleString('es-AR');
            const tipo = item.type === 'user' ? 'USUARIO' : 'MODERNO';
            contenido += `[${fecha}] ${tipo}:\n${item.message}\n\n`;
            contenido += '-------------------------------------------\n\n';
        });
        
        contenido += '===========================================\n';
        contenido += 'Fin de la conversación\n';
        contenido += '===========================================\n';
        
        // Crear archivo y descargar
        const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        // Nombre del archivo con fecha
        const fechaArchivo = new Date().toISOString().split('T')[0];
        link.download = `Conversacion-Moderno-ChatBot-${fechaArchivo}.txt`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        //console.log('Conversación descargada exitosamente');
    }
    
    // Función para enviar mensaje al webhook
    async function sendToWebhook(userMessage) {
        isProcessing = true;
        sendButton.disabled = true;
        inputField.disabled = true;

        // Agregar mensaje del usuario
        addMessage(userMessage, 'user');

        // Agregar indicador de carga
        const loadingMsg = addMessageLoading('Procesando tu consulta');

        try {
            //console.log('Enviando mensaje al webhook:', userMessage);
            
            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMessage,
                    timestamp: new Date().toISOString(),
                    source: 'chatbot-widget'
                })
            });

            // Remover mensaje de carga
            loadingMsg.remove();

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Respuesta del webhook:', data);

            // Mostrar respuesta del servidor
            if (data.response || data.message) {
                addMessage(data.response || data.message, 'bot');
            } else {
                addMessage('Mensaje recibido correctamente. Pronto recibirás una respuesta.', 'bot');
            }

        } catch (error) {
            console.error('Error al comunicarse con N8N:', error);
            loadingMsg.remove();
            
            // Mensaje de error detallado
            let errorMessage = 'Error al enviar el mensaje:\n';
            if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
                errorMessage += 'No se pudo conectar con el servidor. Verifica:\n• La URL del webhook es correcta\n• El servidor N8N está activo\n• No hay problemas de CORS';
            } else {
                errorMessage += error.message;
            }
            
            addMessage(errorMessage, 'error');
        } finally {
            isProcessing = false;
            sendButton.disabled = false;
            inputField.disabled = false;
            inputField.focus();
        }
    }

    // Inicializar el chatbot
    function initChatbot() {
        // Inyectar CSS y HTML
        injectChatbotCSS();
        injectChatbotHTML();

        // Obtener referencias a elementos del DOM
        chatbotButton = document.getElementById('chatbot-button');
        chatbotContainer = document.getElementById('chatbot-container');
        closeButton = document.getElementById('close-button');
        clearChatButton = document.getElementById('clear-chat-button');
        messagesArea = document.getElementById('chatbot-messages');
        inputField = document.getElementById('chatbot-input');
        sendButton = document.getElementById('send-button');

        // Restaurar historial de conversación
        restoreHistory();

        // Restaurar estado del chat (abierto/cerrado)
        const state = loadChatState();
        if (state.isOpen) {
            chatbotContainer.classList.add('active');
        }

        // Event Listeners
        chatbotButton.addEventListener('click', () => {
            chatbotContainer.classList.add('active');
            saveChatState(true);
            inputField.focus();
        });

        closeButton.addEventListener('click', () => {
            chatbotContainer.classList.remove('active');
            saveChatState(false);
        });

        clearChatButton.addEventListener('click', clearChat);

        // Event listener para descargar conversación
        const downloadChatButton = document.getElementById('download-chat-button');
        downloadChatButton.addEventListener('click', downloadChat);
        
        sendButton.addEventListener('click', () => {
            const message = inputField.value.trim();
            if (message && !isProcessing) {
                sendToWebhook(message);
                inputField.value = '';
            }
        });

        inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !isProcessing) {
                const message = inputField.value.trim();
                if (message) {
                    sendToWebhook(message);
                    inputField.value = '';
                }
            }
        });

        // Cerrar chatbot con tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' || e.key === 'Esc') {
                // Solo cerrar si el chatbot está abierto
                if (chatbotContainer.classList.contains('active')) {
                    // Verificar si no hay un modal abierto
                    const modalOverlay = document.getElementById('confirm-modal-overlay');
                    if (!modalOverlay || !modalOverlay.classList.contains('active')) {
                        chatbotContainer.classList.remove('active');
                        saveChatState(false);
                        //console.log('Chatbot cerrado con ESC');
                    }
                }
            }
        });
        
    }

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChatbot);
    } else {
        initChatbot();
    }


        // ANIMACIONES DEL BOTÓN FLOTANTE
        function typeText(element, text, speed = 150) {
            return new Promise((resolve) => {
                let index = 0;
                element.textContent = '';
                
                const interval = setInterval(() => {
                    if (index < text.length) {
                        element.textContent += text[index];
                        index++;
                    } else {
                        clearInterval(interval);
                        resolve();
                    }
                }, speed);
            });
        }
        
        async function showThoughtBubble() {
            const bubble = document.getElementById('thought-bubble');
            const text = document.getElementById('thought-text');
            
            if (!bubble || !text) return;
            
            // Mostrar burbuja
            bubble.classList.add('show');
            
            // Esperar que aparezca
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // Escribir texto
            await typeText(text, 'ZzZzZz...');
            
            // Esperar un poco antes de ocultar
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Ocultar burbuja
            bubble.classList.remove('show');
            bubble.classList.add('hide');
            
            await new Promise(resolve => setTimeout(resolve, 300));
            bubble.classList.remove('hide');
        }
        
        function shakeAndFallButton() {
            const button = chatbotButton;
            
            if (!button) return;
            
            // Sacudir
            button.classList.add('chatbot-button-shake');
            
            setTimeout(() => {
                button.classList.remove('chatbot-button-shake');
                
                // Esperar un poco y luego caer
                setTimeout(() => {
                    button.classList.add('chatbot-button-fall');
                    
                    setTimeout(() => {
                        button.classList.remove('chatbot-button-fall');
                    }, 2000);
                }, 200);
            }, 500);
        }
        
        async function runRandomAnimation() {
            // No ejecutar si el chat está abierto
            if (chatbotContainer.classList.contains('active')) {
                scheduleNextAnimation();
                return;
            }
            
            // Decidir aleatoriamente qué animación ejecutar
            const animations = [
                showThoughtBubble,
                shakeAndFallButton
            ];
            
            const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
            await randomAnimation();
            
            // Programar la siguiente animación
            scheduleNextAnimation();
        }
        
        function scheduleNextAnimation() {
            // Tiempo aleatorio entre 10 y 30 segundos
            const minTime = 10000; // 10 segundos
            const maxTime = 30000; // 30 segundos
            const randomTime = Math.random() * (maxTime - minTime) + minTime;
            
            setTimeout(runRandomAnimation, randomTime);
        }
        
        // Iniciar el ciclo de animaciones después de 5 segundos
        setTimeout(() => {
            scheduleNextAnimation();
        }, 10000);
    
})();
