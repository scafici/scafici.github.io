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
            <div id="chatbot-button" data-tooltip="Conversar con MODERNO/LAB ChatBot"></div>

            <!-- Contenedor del chatbot -->
            <div id="chatbot-container">
                <div id="chatbot-header">
                    <h3>🎨 MODERNO/LAB - ChatBot</h3>
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <button id="download-chat-button" data-tooltip="Descargar conversación" style="background: none; border: none; color: white; font-size: 18px; cursor: pointer; padding: 0; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; position: relative;">📥</button>
                        <button id="clear-chat-button" title="Limpiar conversación" style="background: none; border: none; color: white; font-size: 18px; cursor: pointer; padding: 0; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">🗑️</button>
                        <button id="close-button">&times;</button>
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
                width: 60px;
                height: 60px;
                background-color: white;
                background-image: url('../assets/img/LogoChatBot.png');
                background-size: 100%;
                background-position: center;
                background-repeat: no-repeat;
                border: 0px solid white;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                transition: transform 0.2s, box-shadow 0.2s;
                z-index: 9998;
                overflow: hidden;
            }

            #chatbot-button:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
            }
            
            /* Tooltip */
            #chatbot-button::before {
                content: attr(data-tooltip);
                position: absolute;
                bottom: 70px;
                right: 23px;
                background-color: black;
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-family: 'MuseoModerno', cursive;
                font-size: 13px;
                white-space: nowrap;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
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
            
            #close-button {
                background: none;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            #close-button:hover,
            #clear-chat-button:hover {
                opacity: 0.7;
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

            /* Tooltip para botón de descargar */
            #download-chat-button {
                position: relative;
            }
            
            #download-chat-button::before {
                content: attr(data-tooltip);
                position: absolute;
                bottom: -55px;
                right: -50;
                background-color: #333;
                color: white;
                padding: 6px 10px;
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
            
            #download-chat-button:hover::before {
                opacity: 1;
            }
            
            #download-chat-button::after {
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
            
            #download-chat-button:hover::after {
                opacity: 1;
            }
            
            #download-chat-button:hover,
            #clear-chat-button:hover {
                opacity: 0.7;
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
        messagesArea.scrollTop = messagesArea.scrollHeight;
        
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

    // Función para limpiar conversación
    function clearChat() {
        if (confirm('¿Estás seguro de que querés limpiar toda la conversación?')) {
            clearHistory();
            
            // Limpiar área de mensajes
            const welcomeMsg = messagesArea.querySelector('.message.bot.welcome');
            messagesArea.innerHTML = '';
            if (welcomeMsg) {
                messagesArea.appendChild(welcomeMsg);
            }
            
            console.log('Conversación limpiada');
        }
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
        
        console.log('Conversación descargada exitosamente');
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
            console.log('Enviando mensaje al webhook:', userMessage);
            
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

        console.log('MAMBA ChatBot inicializado correctamente');
        console.log('Webhook URL:', WEBHOOK_URL);
        console.log('Historial restaurado con', loadHistoryFromStorage().length, 'mensajes');
    }

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChatbot);
    } else {
        initChatbot();
    }

})();
