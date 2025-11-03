// ==UserScript==
// @name         bot farmgg
// @namespace    http://tampermonkey.net/
// @version      1.7.5
// @description  Menu de mod para Sunflower Land com recursos automáticos (auto fazenda, auto mineração, auto corte de árvore, auto cozinhar, auto baú), bloco de notas, teletransporte, receitas de pesca e informações de atualização.
// @match        https://sunflower-land.com/play/*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    /* === Dicionário de Tradução === */
    const translations = {
        pt: {
            mainTitle: "Sunflower Land",
            farmingAssistant: "Assistente de Fazenda",
            notepad: "Bloco de Notas",
            teleport: "Teletransporte",
            fishingRecipes: "Receitas de Pesca",
            updateInfo: "Informações de Atualização",
            language: "Idioma",
            portuguese: "Português",
            creator: "Criador: gu2121gg",
            version: "Versão: 1.7.5",
            // Títulos dos Popups
            farmingAssistantTitle: "Assistente de Fazenda",
            teleportTitle: "Teletransporte",
            updateTitle: "Informações de Atualização",
            notepadTitle: "Bloco de Notas",
            fishingRecipesTitle: "Receitas de Pesca",
            solverTitle: "Solucionador de Quebra-Cabeças",
            // Textos dos Botões dentro dos Popups
            scan: "Escanear",
            autoFarm: "Auto Fazenda: ",
            autoMine: "Auto Mineração: ",
            autoCutTree: "Auto Cortar Árvore: ",
            autoCook: "Auto Cozinhar: ",
            cookItem: "Item para Cozinhar:",
            teleportToHome: "Teletransportar para Casa",
            teleportBtn: "Teletransportar",
            save: "Salvar",
            notepadPlaceholder: "Escreva suas notas aqui...",
            solveChest: "Resolver Quebra-Cabeça de Baú",
            solveOther: "Resolver Outro Quebra-Cabeça",
            solveGoblins: "Resolver Goblins",
            autoChest: "Auto Baú: ",
            autoClose: "Auto Fechar: ",
            scanRecipes: "Verificar Receitas",
            selectRecipe: "Selecione uma Receita",
            cookFastest: "Cozinhar Mais Rápida",
            startAutoCook: "Iniciar Auto-Cozinhar",
            stopAutoCook: "Parar Auto-Cozinhar",
            // Estados do Toggle
            off: "DESLIGADO",
            on: "LIGADO",
            // Conteúdo da Atualização (HTML)
            updateContent: "<p><strong>Versão:</strong> 1.7.5</p><p><strong>Registro de Alterações:</strong></p><ul><li>* <strong>NOVO:</strong> Solver inteligente detecta automaticamente 3 inimigos e resolve sozinho!</li><li>* <strong>MELHORADO:</strong> Auto Baú agora funciona com baús E puzzles de 3 inimigos</li><li>* <strong>NOVO:</strong> Sistema de Auto Baú Automático com fechamento automático</li><li>* Solver usa a mesma lógica do baú (clica na 2ª imagem) para puzzles de monstros</li><li>* Se não tiver 3 inimigos, pede para resolver manualmente</li><li>* Adicionado botão de minimizar na janela principal</li><li>* Auto-fazenda expandida para incluir culturas do tipo árvore</li><li>* Otimizada a funcionalidade de auto cozinhar com MutationObserver</li></ul>"
        }
    };

    let currentLang = "pt"; // Definido como português por padrão

    // Declaração global das variáveis dos popups
    let helperPopup, teleportPopup, updatePopup, notepadPopup, fishingRecipesPopup, solverPopup;

    /* === Carregar Recursos === */
    let linkFont = document.createElement('link');
    linkFont.rel = 'stylesheet';
    linkFont.href = 'https://fonts.googleapis.com/css2?family=Roboto&display=swap';
    document.head.appendChild(linkFont);

    let linkIzi = document.createElement('link');
    linkIzi.rel = 'stylesheet';
    linkIzi.href = 'https://cdnjs.cloudflare.com/ajax/libs/izitoast/1.4.0/css/iziToast.min.css';
    document.head.appendChild(linkIzi);

    let scriptIzi = document.createElement('script');
    scriptIzi.src = 'https://cdnjs.cloudflare.com/ajax/libs/izitoast/1.4.0/js/iziToast.min.js';
    document.head.appendChild(scriptIzi);

    /* === CSS Personalizado === */
    GM_addStyle(`
        /* Fonte Global */
        * { font-family: 'Roboto', sans-serif; font-size: 14px; }

        /* Menu Principal */
        #mainMenu {
            position: fixed;
            top: 10px;
            left: 10px;
            background: #2e2e2e;
            border: 1px solid #444;
            z-index: 9999;
            width: 220px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }
        #mainMenuHeader {
            background: linear-gradient(to right, #4a4a4a, #3a3a3a);
            padding: 8px;
            text-align: center;
            border-bottom: 1px solid #444;
            color: #ffffff;
            font-weight: bold;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
            cursor: move;
        }
        .minimizeMainBtn {
            position: absolute;
            right: 8px;
            top: 5px;
            cursor: pointer;
            color: #eee;
            font-weight: bold;
            font-size: 18px;
        }
        #languageContainer {
            padding: 5px;
            text-align: center;
            display: none;
        }
        #languageContainer label {
            margin-right: 5px;
            color: #eee;
        }
        #languageSelect {
            background: #3a3a3a;
            color: #eee;
            border: 1px solid #444;
            border-radius: 4px;
        }
        #languageSelect option {
            background: #3a3a3a;
            color: #eee;
        }
        #mainMenuContent {
            padding: 5px;
        }
        #mainMenu button {
            margin: 4px 0;
            padding: 8px 10px;
            background: #3a3a3a;
            border: 1px solid #555;
            color: #eee;
            cursor: pointer;
            width: 100%;
            border-radius: 6px;
            transition: background 0.2s, transform 0.2s;
            font-weight: bold;
        }
        #mainMenu button:hover {
            background: #555;
            transform: translateY(-1px);
        }
        #mainMenu button:active {
            background: #666;
            transform: translateY(0);
        }
        #footerInfo {
            text-align: center;
            padding: 5px;
            border-top: 1px solid #444;
            font-size: 12px;
            color: #eee;
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
        }

        /* Estilo do Popup (todos os popups) */
        .popup {
            position: fixed;
            top: 50px;
            left: 50px;
            width: 350px;
            background: #2e2e2e;
            border: 1px solid #444;
            color: #eee;
            z-index: 10000;
            box-shadow: 0 6px 12px rgba(0,0,0,0.4);
            overflow: auto;
            max-height: 85vh;
            border-radius: 10px;
        }
        .popupHeader {
            background: linear-gradient(to right, #4a4a4a, #3a3a3a);
            padding: 8px;
            cursor: move;
            user-select: none;
            position: relative;
            border-bottom: 1px solid #444;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
            font-weight: bold;
        }
        .popupHeader .headerTitle {
            font-weight: bold;
            color: #ffffff;
        }
        .popupHeader .minimizeBtn, .popupHeader .closeBtn {
            position: absolute;
            top: 5px;
            cursor: pointer;
            font-weight: bold;
            font-size: 18px;
            color: #eee;
            transition: color 0.2s;
        }
        .popupHeader .minimizeBtn:hover, .popupHeader .closeBtn:hover {
            color: #fff;
        }
        .popupHeader .minimizeBtn {
            right: 30px;
        }
        .popupHeader .closeBtn {
            right: 10px;
        }
        .popupContent {
            padding: 15px;
        }
        .popupContent button, .popupContent select, .popupContent input[type="text"] {
            width: 100%;
            margin-top: 8px;
            padding: 10px;
            border: 1px solid #555;
            background: #3a3a3a;
            color: #eee;
            cursor: pointer;
            border-radius: 6px;
            transition: background 0.2s, border-color 0.2s;
        }
        .popupContent button:hover, .popupContent select:hover, .popupContent input[type="text"]:hover {
            background: #555;
            border-color: #777;
        }
        .popupContent select option {
            background: #3a3a3a;
            color: #eee;
        }
        #infoSection div {
            margin: 5px 0;
            padding: 5px;
            background: #3a3a3a;
            border-radius: 4px;
            border: 1px solid #444;
        }
        #notepadContent {
            width: 100%;
            height: 180px;
            resize: vertical;
            padding: 10px;
            box-sizing: border-box;
            background: #3a3a3a;
            border: 1px solid #444;
            color: #eee;
            border-radius: 6px;
        }
        iframe {
            border-radius: 6px;
        }
    `);

    /* === Utilitário: Função Arrastável === */
    function makeDraggable(el, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        // — EVENTOS DO MOUSE —
        handle.addEventListener('mousedown', dragMouseStart, false);
        function dragMouseStart(e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.addEventListener('mousemove', dragMouseMove, false);
            document.addEventListener('mouseup', dragMouseEnd, false);
        }
        function dragMouseMove(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            el.style.top = (el.offsetTop - pos2) + "px";
            el.style.left = (el.offsetLeft - pos1) + "px";
        }
        function dragMouseEnd() {
            document.removeEventListener('mousemove', dragMouseMove, false);
            document.removeEventListener('mouseup', dragMouseEnd, false);
        }
        // — EVENTOS DE TOQUE —
        handle.addEventListener('touchstart', dragTouchStart, { passive: false });
        function dragTouchStart(e) {
            e.preventDefault();
            const touch = e.touches[0];
            pos3 = touch.clientX;
            pos4 = touch.clientY;
            document.addEventListener('touchmove', dragTouchMove, { passive: false });
            document.addEventListener('touchend', dragTouchEnd, false);
        }
        function dragTouchMove(e) {
            e.preventDefault();
            const touch = e.touches[0];
            pos1 = pos3 - touch.clientX;
            pos2 = pos4 - touch.clientY;
            pos3 = touch.clientX;
            pos4 = touch.clientY;
            el.style.top = (el.offsetTop - pos2) + "px";
            el.style.left = (el.offsetLeft - pos1) + "px";
        }
        function dragTouchEnd() {
            document.removeEventListener('touchmove', dragTouchMove, { passive: false });
            document.removeEventListener('touchend', dragTouchEnd, false);
        }
    }

    /* === Notificações Personalizadas (Toast) === */
    let activeToasts = [];
    function showToast(type, title, message) {
        if (activeToasts.length >= 3) {
            const oldestToast = activeToasts.shift();
            if (oldestToast) { // Apenas tenta fechar se a notificação existir
                iziToast.hide({ transitionOut: 'fadeOut' }, oldestToast);
            }
        }

        const toastOptions = {
            title: title,
            message: message || '',
            position: 'topRight',
            timeout: 3000,
            onOpened: (instance, toast) => {
                makeDraggable(toast, toast);
                activeToasts.push(toast); // Adiciona o toast à lista apenas quando ele é aberto
            },
            onClosing: (instance, toast, closedBy) => {
                activeToasts = activeToasts.filter(t => t !== toast);
            }
        };

        // Chama a função iziToast correspondente
        if (iziToast[type]) {
            iziToast[type](toastOptions);
        } else {
            iziToast.info(toastOptions); // Fallback para 'info'
        }
    }

    /* === Variáveis de Recursos Automáticos === */
    let autoFarmEnabled = false, autoFarmTimeout;
    let autoMineEnabled = false, autoMineTimeout;
    let autoCutTreeEnabled = false, autoCutTreeTimeout;
    let autoCookEnabled = false, autoCookTimeout;
    let autoChestEnabled = false, autoChestObserver = null;
    let autoCloseEnabled = false, autoCloseInterval;

    function stopAllAutoFeatures() {
        if (autoFarmEnabled) {
            autoFarmEnabled = false;
            clearTimeout(autoFarmTimeout);
            document.getElementById("autoFarmButton").textContent = translations[currentLang].autoFarm + translations[currentLang].off;
        }
        if (autoMineEnabled) {
            autoMineEnabled = false;
            clearTimeout(autoMineTimeout);
            document.getElementById("autoMineButton").textContent = translations[currentLang].autoMine + translations[currentLang].off;
        }
        if (autoCutTreeEnabled) {
            autoCutTreeEnabled = false;
            clearTimeout(autoCutTreeTimeout);
            document.getElementById("autoCutTreeButton").textContent = translations[currentLang].autoCutTree + translations[currentLang].off;
        }
        if (autoCookEnabled) {
            autoCookEnabled = false;
            clearTimeout(autoCookTimeout);
            document.getElementById("autoCookButton").textContent = translations[currentLang].autoCook + translations[currentLang].off;
        }
    }

    /* === MENU PRINCIPAL === */
    let mainMenu = document.createElement("div");
    mainMenu.id = "mainMenu";
    mainMenu.innerHTML = `
        <div id="mainMenuHeader">${translations[currentLang].mainTitle}</div>
        <span class="minimizeMainBtn">–</span>
        <div id="languageContainer">
            <label id="languageLabel" for="languageSelect">${translations[currentLang].language}:</label>
            <select id="languageSelect">
                <option value="pt">${translations[currentLang].portuguese}</option>
            </select>
        </div>
        <div id="mainMenuContent">
            <button id="openFarmingAssistant">${translations[currentLang].farmingAssistant}</button>
            <button id="openNotepad">${translations[currentLang].notepad}</button>
            <button id="openTeleport">${translations[currentLang].teleport}</button>
            <button id="openFishingRecipes">${translations[currentLang].fishingRecipes}</button>
            <button id="openSolver">${translations[currentLang].solverTitle}</button>
            <button id="openUpdate">${translations[currentLang].updateInfo}</button>
        </div>
        <div id="footerInfo">${translations[currentLang].creator} | ${translations[currentLang].version}</div>
    `;
    document.body.appendChild(mainMenu);
    makeDraggable(mainMenu, mainMenu.querySelector("#mainMenuHeader"));

    const mainContent = document.querySelector('#mainMenuContent');
    const footerInfo = document.querySelector('#footerInfo');
    const minimizeBtn = document.querySelector('.minimizeMainBtn');
    minimizeBtn.addEventListener('click', () => {
        if (mainContent.style.display === 'none') {
            mainContent.style.display = 'block';
            footerInfo.style.display = 'block';
            minimizeBtn.textContent = '–';
        } else {
            mainContent.style.display = 'none';
            footerInfo.style.display = 'none';
            minimizeBtn.textContent = '+';
        }
    });

    /* === Atualizar Idioma do Menu Principal === */
    function updateMainMenuLanguage() {
        document.getElementById("mainMenuHeader").textContent = translations[currentLang].mainTitle;
        document.getElementById("openFarmingAssistant").textContent = translations[currentLang].farmingAssistant;
        document.getElementById("openNotepad").textContent = translations[currentLang].notepad;
        document.getElementById("openTeleport").textContent = translations[currentLang].teleport;
        document.getElementById("openFishingRecipes").textContent = translations[currentLang].fishingRecipes;
        document.getElementById("openSolver").textContent = translations[currentLang].solverTitle;
        document.getElementById("openUpdate").textContent = translations[currentLang].updateInfo;
        document.getElementById("footerInfo").innerHTML = translations[currentLang].creator + " | " + translations[currentLang].version;
    }

    /* === Atualizar Idioma do Popup se Aberto === */
    function updateAllPopupsLanguage() {
        if (helperPopup) {
            let header = helperPopup.querySelector(".popupHeader .headerTitle");
            if(header) header.textContent = translations[currentLang].farmingAssistantTitle;
            helperPopup.querySelector("#scanButton").textContent = translations[currentLang].scan;
            helperPopup.querySelector("#autoFarmButton").textContent = translations[currentLang].autoFarm + (autoFarmEnabled ? translations[currentLang].on : translations[currentLang].off);
            helperPopup.querySelector("#autoMineButton").textContent = translations[currentLang].autoMine + (autoMineEnabled ? translations[currentLang].on : translations[currentLang].off);
            helperPopup.querySelector("#autoCutTreeButton").textContent = translations[currentLang].autoCutTree + (autoCutTreeEnabled ? translations[currentLang].on : translations[currentLang].off);
            helperPopup.querySelector("#autoCookButton").textContent = translations[currentLang].autoCook + (autoCookEnabled ? translations[currentLang].on : translations[currentLang].off);
        }
        if (teleportPopup) {
            let header = teleportPopup.querySelector(".popupHeader .headerTitle");
            if(header) header.textContent = translations[currentLang].teleportTitle;
            teleportPopup.querySelector("#teleportToHome").textContent = translations[currentLang].teleportToHome;
            teleportPopup.querySelector("#teleportBtn").textContent = translations[currentLang].teleportBtn;
        }
        if (updatePopup) {
            let header = updatePopup.querySelector(".popupHeader .headerTitle");
            if(header) header.textContent = translations[currentLang].updateTitle;
            updatePopup.querySelector(".popupContent").innerHTML = translations[currentLang].updateContent;
        }
        if (notepadPopup) {
            let header = notepadPopup.querySelector(".popupHeader .headerTitle");
            if(header) header.textContent = translations[currentLang].notepadTitle;
            notepadPopup.querySelector("#saveNotepad").textContent = translations[currentLang].save;
            notepadPopup.querySelector("#notepadContent").placeholder = translations[currentLang].notepadPlaceholder;
        }
        if (fishingRecipesPopup) {
            let header = fishingRecipesPopup.querySelector(".popupHeader .headerTitle");
            if(header) header.textContent = translations[currentLang].fishingRecipesTitle;
        }
        if (solverPopup) {
            let header = solverPopup.querySelector(".popupHeader .headerTitle");
            if(header) header.textContent = translations[currentLang].solverTitle;
            solverPopup.querySelector("#solveChestBtn").textContent = translations[currentLang].solveChest;
            solverPopup.querySelector("#solvePuzzleBtn").textContent = translations[currentLang].solveOther;
            const gobBtn = solverPopup.querySelector("#solveGoblinsBtn");
            if (gobBtn) gobBtn.textContent = translations[currentLang].solveGoblins;
            const autoChestBtn = solverPopup.querySelector("#autoChestBtn");
            if (autoChestBtn) autoChestBtn.textContent = '📦 ' + translations[currentLang].autoChest + (autoChestEnabled ? translations[currentLang].on : translations[currentLang].off);
            const autoCloseBtn = solverPopup.querySelector("#autoCloseBtn");
            if (autoCloseBtn) autoCloseBtn.textContent = '❌ ' + translations[currentLang].autoClose + (autoCloseEnabled ? translations[currentLang].on : translations[currentLang].off);
        }
    }

    /* === POPUP ASSISTENTE DE FAZENDA (Helper) === */
    function openFarmingAssistantPopup() {
        if (!helperPopup) {
            helperPopup = document.createElement("div");
            helperPopup.id = "helperPopup";
            helperPopup.className = "popup";
            helperPopup.innerHTML = `
                <div class="popupHeader">
                    <span class="headerTitle">${translations[currentLang].farmingAssistantTitle}</span>
                    <span class="minimizeBtn">–</span>
                    <span class="closeBtn">x</span>
                </div>
                <div class="popupContent">
                    <button id="scanButton">${translations[currentLang].scan}</button>
                    <div id="infoSection">
                        <div>Plantas Totais: <span id="plantCount">0</span></div>
                        <div>Árvores: <span id="treeCount">0</span></div>
                        <div>Solo Vazio: <span id="emptySoilCount">0</span></div>
                        <div>Pedra: <span id="stoneCount">0</span></div>
                        <div>Minério de Ferro: <span id="ironCount">0</span></div>
                        <div>Minério de Ouro: <span id="goldCount">0</span></div>
                    </div>
                    <button id="autoFarmButton">${translations[currentLang].autoFarm}${translations[currentLang].off}</button>
                    <button id="autoMineButton">${translations[currentLang].autoMine}${translations[currentLang].off}</button>
                    <button id="autoCutTreeButton">${translations[currentLang].autoCutTree}${translations[currentLang].off}</button>
                    <hr>
                    <h4>${translations[currentLang].autoCook}</h4>
                    <div id="cookingSection">
                        <p style="color: #aaa; font-size: 12px; margin-bottom: 10px;">🤖 Cozinha até acabar ingredientes, depois passa para próxima receita</p>
                        <button id="openFirePitButton" class="popup-button">Abrir Fogueira</button>
                        <button id="scanRecipesButton" class="popup-button">${translations[currentLang].scanRecipes}</button>
                        <div id="recipeSelectionContainer" style="display: none;">
                            <select id="recipeSelect" class="popup-select"></select>
                            <button id="toggleAutoCookButton" class="popup-button">${translations[currentLang].startAutoCook}</button>
                        </div>
                        <p style="color: #888; font-size: 11px; margin-top: 5px;">* Rotação automática quando acabar ingredientes</p>
                    </div>
                </div>
            `;
            document.body.appendChild(helperPopup);
            makeDraggable(helperPopup, helperPopup.querySelector(".popupHeader"));

            // Event Listeners
            let minimizeBtn = helperPopup.querySelector(".minimizeBtn");
            let closeBtn = helperPopup.querySelector(".closeBtn");
            let content = helperPopup.querySelector(".popupContent");

            minimizeBtn.addEventListener("click", () => {
                if (content.style.display === "none") {
                    content.style.display = "block";
                    minimizeBtn.textContent = "–";
                } else {
                    content.style.display = "none";
                    minimizeBtn.textContent = "+";
                }
            });

            closeBtn.addEventListener("click", () => {
                stopAllAutoFeatures();
                helperPopup.remove();
                helperPopup = null;
                showToast('info', translations[currentLang].farmingAssistantTitle + ' Fechado', 'Todos os recursos automáticos parados.');
            });

            helperPopup.querySelector("#scanButton").addEventListener("click", scanElements);
            helperPopup.querySelector("#autoFarmButton").addEventListener("click", toggleAutoFarm);
            helperPopup.querySelector("#autoMineButton").addEventListener("click", toggleAutoMine);
            helperPopup.querySelector("#autoCutTreeButton").addEventListener("click", toggleAutoCutTree);

            // Cooking listeners
            document.getElementById("openFirePitButton").addEventListener("click", openFirePit);
            document.getElementById("scanRecipesButton").addEventListener("click", scanAvailableRecipes);
            document.getElementById("toggleAutoCookButton").addEventListener("click", toggleAutoCook);
            document.getElementById('recipeSelect').addEventListener('change', (e) => {
                selectedRecipe = e.target.value;
                lastCookedRecipeIndex = -1; // Reset quando trocar manualmente
            });
        } else {
            helperPopup.style.display = "block";
        }
    }

    /* === POPUP TELETRANSPORTE === */
    function openTeleportPopup() {
        if (!teleportPopup) {
            teleportPopup = document.createElement("div");
            teleportPopup.id = "teleportPopup";
            teleportPopup.className = "popup";
            teleportPopup.innerHTML = `
                <div class="popupHeader">
                    <span class="headerTitle">${translations[currentLang].teleportTitle}</span>
                    <span class="minimizeBtn">–</span>
                    <span class="closeBtn">x</span>
                </div>
                <div class="popupContent">
                    <button id="teleportToHome">${translations[currentLang].teleportToHome}</button>
                    <select id="teleportDropdown">
                        <option value="world/plaza">Praça</option>
                        <option value="world/beach">Praia</option>
                        <option value="world/forest">Floresta</option>
                        <option value="world/retreat">Retiro</option>
                    </select>
                    <button id="teleportBtn">${translations[currentLang].teleportBtn}</button>
                </div>
            `;
            document.body.appendChild(teleportPopup);
            makeDraggable(teleportPopup, teleportPopup.querySelector(".popupHeader"));

            let minimizeBtn = teleportPopup.querySelector(".minimizeBtn");
            let closeBtn = teleportPopup.querySelector(".closeBtn");
            let content = teleportPopup.querySelector(".popupContent");
            minimizeBtn.addEventListener("click", () => {
                if (content.style.display === "none") {
                    content.style.display = "block";
                    minimizeBtn.textContent = "–";
                } else {
                    content.style.display = "none";
                    minimizeBtn.textContent = "+";
                }
            });
            closeBtn.addEventListener("click", () => {
                teleportPopup.remove();
                teleportPopup = null;
            });

            teleportPopup.querySelector("#teleportToHome").addEventListener("click", () => {
                window.location.href = "https://sunflower-land.com/play/#/";
            });
            teleportPopup.querySelector("#teleportBtn").addEventListener("click", () => {
                const dropdown = teleportPopup.querySelector("#teleportDropdown");
                const selected = dropdown.value;
                window.location.href = "https://sunflower-land.com/play/#/" + selected;
            });
        } else {
            teleportPopup.style.display = "block";
        }
    }

    /* === POPUP INFORMAÇÕES DE ATUALIZAÇÃO === */
    function openUpdatePopup() {
        if (!updatePopup) {
            updatePopup = document.createElement("div");
            updatePopup.id = "updatePopup";
            updatePopup.className = "popup";
            updatePopup.innerHTML = `
                <div class="popupHeader">
                    <span class="headerTitle">${translations[currentLang].updateTitle}</span>
                    <span class="minimizeBtn">–</span>
                    <span class="closeBtn">x</span>
                </div>
                <div class="popupContent">
                    ${translations[currentLang].updateContent}
                </div>
            `;
            document.body.appendChild(updatePopup);
            makeDraggable(updatePopup, updatePopup.querySelector(".popupHeader"));

            let minimizeBtn = updatePopup.querySelector(".minimizeBtn");
            let closeBtn = updatePopup.querySelector(".closeBtn");
            let content = updatePopup.querySelector(".popupContent");
            minimizeBtn.addEventListener("click", () => {
                if (content.style.display === "none") {
                    content.style.display = "block";
                    minimizeBtn.textContent = "–";
                } else {
                    content.style.display = "none";
                    minimizeBtn.textContent = "+";
                }
            });
            closeBtn.addEventListener("click", () => {
                updatePopup.remove();
                updatePopup = null;
            });
        } else {
            updatePopup.style.display = "block";
        }
    }

    /* === POPUP BLOCO DE NOTAS === */
    function openNotepadPopup() {
        if (!notepadPopup) {
            notepadPopup = document.createElement("div");
            notepadPopup.id = "notepadPopup";
            notepadPopup.className = "popup";
            notepadPopup.innerHTML = `
                <div class="popupHeader">
                    <span class="headerTitle">${translations[currentLang].notepadTitle}</span>
                    <span class="minimizeBtn">–</span>
                    <span class="closeBtn">x</span>
                </div>
                <div class="popupContent">
                    <textarea id="notepadContent" placeholder="${translations[currentLang].notepadPlaceholder}"></textarea>
                    <button id="saveNotepad">${translations[currentLang].save}</button>
                </div>
            `;
            document.body.appendChild(notepadPopup);
            makeDraggable(notepadPopup, notepadPopup.querySelector(".popupHeader"));

            let minimizeBtn = notepadPopup.querySelector(".minimizeBtn");
            let closeBtn = notepadPopup.querySelector(".closeBtn");
            let content = notepadPopup.querySelector(".popupContent");
            minimizeBtn.addEventListener("click", () => {
                if (content.style.display === "none") {
                    content.style.display = "block";
                    minimizeBtn.textContent = "–";
                } else {
                    content.style.display = "none";
                    minimizeBtn.textContent = "+";
                }
            });
            closeBtn.addEventListener("click", () => {
                notepadPopup.remove();
                notepadPopup = null;
            });

            let textarea = notepadPopup.querySelector("#notepadContent");
            textarea.value = localStorage.getItem("sunflowerNotepad") || "";
            notepadPopup.querySelector("#saveNotepad").addEventListener("click", () => {
                localStorage.setItem("sunflowerNotepad", textarea.value);
                showToast('success', translations[currentLang].save, 'Bloco de notas salvo.');
            });
        } else {
            notepadPopup.style.display = "block";
        }
    }

    /* === POPUP RECEITAS DE PESCA === */
    function openFishingRecipesPopup() {
        if (!fishingRecipesPopup) {
            fishingRecipesPopup = document.createElement("div");
            fishingRecipesPopup.id = "fishingRecipesPopup";
            fishingRecipesPopup.className = "popup";
            fishingRecipesPopup.innerHTML = `
                <div class="popupHeader">
                    <span class="headerTitle">${translations[currentLang].fishingRecipesTitle}</span>
                    <span class="minimizeBtn">–</span>
                    <span class="closeBtn">x</span>
                </div>
                <div class="popupContent">
                    <iframe src="https://sfl.world/util/fishing" style="width:100%; height:500px; border:none; border-radius: 6px;"></iframe>
                </div>
            `;
            document.body.appendChild(fishingRecipesPopup);
            makeDraggable(fishingRecipesPopup, fishingRecipesPopup.querySelector(".popupHeader"));

            let minimizeBtn = fishingRecipesPopup.querySelector(".minimizeBtn");
            let closeBtn = fishingRecipesPopup.querySelector(".closeBtn");
            let content = fishingRecipesPopup.querySelector(".popupContent");
            minimizeBtn.addEventListener("click", () => {
                if (content.style.display === "none") {
                    content.style.display = "block";
                    minimizeBtn.textContent = "–";
                } else {
                    content.style.display = "none";
                    minimizeBtn.textContent = "+";
                }
            });
            closeBtn.addEventListener("click", () => {
                fishingRecipesPopup.remove();
                fishingRecipesPopup = null;
            });
        } else {
            fishingRecipesPopup.style.display = "block";
        }
    }

    /* === Funções de Solver === */
    function closePuzzleDialog() {
        const btns = Array.from(document.querySelectorAll('button'));
        for (const btn of btns) {
            const lbl = btn.querySelector('div.mb-1');
            if (lbl && lbl.textContent.trim().toLowerCase() === 'close') {
                btn.click();
                break;
            }
        }
    }

    const solverPrefixes = [
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAARCAYAAADUryzEAAAAAXNSR0IArs4c6QAAAwRJREFUOE99k29oVXUxn/nnHt2z3Ju2rx35567+8fNe527VspWjAypqDR0gkYqg0Ak8kX+IYJYGGGh4IsJi0QXlEEmvdHAoUEv9I3YiwidTt1ybbu72/0f0zk37zl35/yi1cauZN9Xv++L58Pz5fc8Eo+N4VktFMlERsVx2ThFBVmVsSzQXBIjmV5poaRkCVVHRfzi91A1CA0mOItBXsPk4DRyfR+LptfiX76VVO7WvG7+EfStFt92trCmdTv3bmeo97eA7xH0JWGVB7gPD2tJfnmaps4LZHM3Z7XzAENvFL/caEd4Q4Sp5f5QkSVGD1ltBTW9RQrWMFrTUkisRG/eRDbfXwoIeWKi/2IXWmQIPXIYzSnj7N6NVG3ZRUTrJ/japzhC4uv332T38W7SuYFSQHDZs2Ik3wVU49e3ozoF+o69Qvk7L8LtSnyvHsTtCH5qb2PT0bM4EiTyPdIsRfesFEIWZDKHYKqSUOgjTApcP9KKr20j8al7tDQdRTgmpzt3s+vAGbpPrmPbnitItUadGE1+Qdj3AfH4IXDXMf7ZOQbqKojenWBp6zPwgoufj1zj5cg0+d4wzae+oefdHbR0XUAKeOtFInucgPEx353YwdoNK5iYmETV3ZQ/mEFUOjyNIJmL4rf+4Gp3kp2Hz1CUysim/j0hZDSKmaILxymguDVGkx2El31IPPMjPuMtVFHgTv4HIr423I7KyH/lYC5dNcZzQrEmkagAWca2BYpiYts2wrWI88c2Mzk2zuvtJ0p/YWE8w96YGD5/DqoLZIMyNb8NY9W6sEMZym81439jK6n00JMB+t99UC0U0+ZUx3oaHjSQqBhk5ye/gm1RdCmkU/90oqQLcy4C3pi42/05WuNT0G+Ss/14lwzwaHGUcY/GusDbjOQeS+LCE/x6TDgzKo6YQig25RKYjoqiurBtizJbJvHn7092MAcLemLi5nsv8bBK4vmOy4ztWU+xzs3yg5dJp/7HwRzAr68SY+mTYNoEQvsYvfQVBE2M6H7SmTuzDv4CBb4p31YYNScAAAAASUVORK5II=',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAQCAYAAAAiYZ4HAAAAAXNSR0IArs4c6QAAAnpJRU5Esrgg=',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAQCAYAAADJViUEAAAAAXNSR0IArs4c6QAAAsFJRU5Esrgg=',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAQCAYAAAAbBi9cAAAAAXNSR0IArs4c6QAAAytJRU5Esrgg=',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAQCAYAAAAbBi9cAAAAAXNSR0IArs4c6QAAAxpJRU5Esrgg=',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAZCAYAAAA14t7uAAAAAXNSR0IArs4c6QAABMpJRU5Esrgg=',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAbCAYAAACJISRoAAAAAXNSR0IArs4c6QAABQNJRU5Esrgg=',
    ];

    const goblinPrefixes = [
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABACAYAAADlNHIOAAAFG0lEQVR4X',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAcCAYAAACdz7SqAAAFxk',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABACAYAAADlNHIOAAAFTk'
    ];

    // Prefixos de imagens de monstros (extraídos do arquivo "data dos outro solve .txt").
    // Observação: a lista não precisa ser completa; ela será mesclada com os prefixos salvos no localStorage e aprende dinamicamente.
    const monsterPrefixesSeed = [
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAbCAYAAACJISRoAAAFWUlEQVR4AZSV',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAATCAYAAACQjC21AAADnUlEQVR4Aay',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAARCAYAAAACCvahAAACuElEQVR4Aay',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAARCAYAAAACCvahAAACu0lEQVR4Aay',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAQCAYAAAAbBi9cAAADQUlEQVR4AXSS',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAQCAYAAAAbBi9cAAADQ0lEQVR4AXSS',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAQCAYAAAAbBi9cAAADQklEQVR4AXSS',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAZCAYAAAA14t7uAAAFAklEQVR4AZS',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAQCAYAAADNo/U5AAACoklEQVR4AUyS',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAARCAYAAADUryzEAAADFklEQVR4AWy',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAARCAYAAADUryzEAAADGUlEQVR4AWy',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAQCAYAAAAiYZ4HAAACiElEQVR4AUy'
    ];
    let monsterPrefixes = (() => {
        try {
            const stored = JSON.parse(localStorage.getItem('monster_prefixes') || '[]');
            return Array.from(new Set([...monsterPrefixesSeed, ...stored]));
        } catch (e) {
            return monsterPrefixesSeed.slice();
        }
    })();

    function solveChest() {
        const container = document.querySelector('div.relative.w-full.rounded-md');
        if (!container) {
            showToast('error', translations[currentLang].solverTitle, 'Contêiner do baú não encontrado.');
            return;
        }
        const imgs = container.querySelectorAll('img');
        if (imgs.length < 2) {
            showToast('error', translations[currentLang].solverTitle, `Apenas ${imgs.length} imagens encontradas.`);
            return;
        }
        imgs[1].click();
        showToast('success', translations[currentLang].solverTitle, 'Quebra-cabeça do baú clicado!');
        setTimeout(closePuzzleDialog, 500);
    }

    function solveOtherPuzzle() {
        // Primeiro, verifica se o puzzle tem exatamente 3 inimigos
        const container = document.querySelector('div.relative.w-full.rounded-md');
        if (!container) {
            return showToast('error', translations[currentLang].solverTitle, 'Contêiner do quebra-cabeça não encontrado.');
        }

        const imgs = container.querySelectorAll('img');
        if (imgs.length < 2) {
            return showToast('error', translations[currentLang].solverTitle, `Apenas ${imgs.length} imagens encontradas.`);
        }

        // Conta quantos inimigos diferentes existem
        const uniqueEnemies = new Set();
        imgs.forEach(img => {
            if (img.src && img.src.includes('data:image')) {
                // Extrai os primeiros 100 caracteres da imagem para identificar
                const signature = img.src.substring(0, 100);
                uniqueEnemies.add(signature);
            }
        });

        // Verifica se tem exatamente 3 tipos de inimigos
        if (uniqueEnemies.size === 3) {
            // Usa a mesma lógica do baú: clica na segunda imagem
            imgs[1].click();
            showToast('success', translations[currentLang].solverTitle, '3 inimigos detectados! Puzzle resolvido automaticamente.');
            setTimeout(closePuzzleDialog, 500);
        } else {
            // Não tem 3 inimigos, pede para resolver manualmente
            showToast('warn', translations[currentLang].solverTitle, `Detectados ${uniqueEnemies.size} inimigos. Por favor, resolva manualmente.`);
        }
    }

    function solveGoblins() {
        // Usa a base do arquivo de dados: identifica peças por prefixos de imagem
        const container = document.querySelector('div.relative.w-full.rounded-md');
        if (!container) {
            return showToast('error', translations[currentLang].solverTitle, 'Contêiner do quebra-cabeça não encontrado.');
        }
        const imgs = container.querySelectorAll('img');
        if (!imgs.length) {
            return showToast('error', translations[currentLang].solverTitle, 'Nenhuma imagem encontrada no puzzle.');
        }
        let clicked = 0;
        const foundSet = new Set();
        imgs.forEach(img => {
            if (!img.src) return;
            const matched = monsterPrefixes.find(pref => img.src.startsWith(pref));
            if (matched) {
                foundSet.add(matched);
                const cell = img.closest('div.cursor-pointer') || img.parentElement;
                if (cell && typeof cell.click === 'function') {
                    cell.click();
                    clicked++;
                }
                // Aprende dinamicamente novos prefixos encontrados
            } else if (img.src.startsWith('data:image/png;base64,')) {
                const sig = img.src.substring(0, 60);
                if (!monsterPrefixes.includes(sig)) {
                    monsterPrefixes.push(sig);
                    try { localStorage.setItem('monster_prefixes', JSON.stringify(monsterPrefixes)); } catch (_) {}
                }
            }
        });
        if (clicked > 0) {
            const kinds = foundSet.size;
            showToast('success', translations[currentLang].solverTitle, `Monstros: clicado em ${clicked} item(s), tipos detectados: ${kinds}.`);
            setTimeout(closePuzzleDialog, 500);
        } else {
            showToast('info', translations[currentLang].solverTitle, 'Nenhuma peça de monstro correspondente aos prefixos.');
        }
    }

    /* === Sistema de Auto Baú Automático === */
    function checkAndSolveChest() {
        if (!autoChestEnabled) return;

        // Verifica se um quebra-cabeça está aberto
        const chestContainer = document.querySelector('div.relative.w-full.rounded-md');

        if (chestContainer) {
            // Aguarda um pouco para garantir que o puzzle carregou completamente
            setTimeout(() => {
                if (!autoChestEnabled) return;

                const imgs = chestContainer.querySelectorAll('img');
                if (imgs.length < 2) return;

                // Conta quantos inimigos diferentes existem
                const uniqueEnemies = new Set();
                imgs.forEach(img => {
                    if (img.src && img.src.includes('data:image')) {
                        const signature = img.src.substring(0, 100);
                        uniqueEnemies.add(signature);
                    }
                });

                // Se for puzzle de 3 inimigos, usa solveGoblins(); caso contrário, usa solveChest().
                if (uniqueEnemies.size === 3) {
                    showToast('info', 'Auto', 'Detectado puzzle de 3 inimigos. Resolvendo...');
                    solveGoblins();
                    return;
                } else {
                    solveChest();
                }
            }, 500);
        }
    }

    function toggleAutoChest() {
        autoChestEnabled = !autoChestEnabled;
        const btn = document.getElementById('autoChestBtn');

        if (autoChestEnabled) {
            btn.textContent = translations[currentLang].autoChest + translations[currentLang].on;
            btn.style.backgroundColor = '#28a745';
            showToast('success', translations[currentLang].autoChest + translations[currentLang].on, 'Auto Baú ativado! Abra um baú para testar.');

            // Cria um observer para detectar quando um puzzle é aberto
            autoChestObserver = new MutationObserver(() => {
                checkAndSolveChest();
            });

            autoChestObserver.observe(document.body, {
                childList: true,
                subtree: true
            });

            // Verifica imediatamente se já tem um puzzle aberto
            checkAndSolveChest();
        } else {
            btn.textContent = translations[currentLang].autoChest + translations[currentLang].off;
            btn.style.backgroundColor = '#3a3a3a';
            showToast('error', translations[currentLang].autoChest + translations[currentLang].off, 'Auto Baú desativado.');

            // Desconecta o observer
            if (autoChestObserver) {
                autoChestObserver.disconnect();
                autoChestObserver = null;
            }
        }
    }

    /* === POPUP SOLVER === */
    function openSolverPopup() {
        if (!solverPopup) {
            solverPopup = document.createElement('div');
            solverPopup.className = 'popup';
            solverPopup.innerHTML = `
                <div class="popupHeader">
                    <span class="headerTitle">${translations[currentLang].solverTitle}</span>
                    <span class="minimizeBtn">–</span>
                    <span class="closeBtn">x</span>
                </div>
                <div class="popupContent">
                    <h3 style="color: #fff; margin-top: 0;">🔓 Resolvedores de Quebra-Cabeça</h3>
                    <button id="solveChestBtn">${translations[currentLang].solveChest}</button>
                    <button id="solvePuzzleBtn">${translations[currentLang].solveOther}</button>
                    <button id="solveGoblinsBtn">${translations[currentLang].solveGoblins}</button>
                    <hr style="border: 1px solid #444; margin: 15px 0;">
                    <h3 style="color: #fff; margin-bottom: 10px;">🤖 Automações do Solver</h3>
                    <p style="color: #aaa; font-size: 12px; margin-bottom: 10px;">Funcionalidades automáticas em segundo plano</p>
                    <button id="autoChestBtn" style="font-weight: bold; margin-bottom: 5px;">📦 ${translations[currentLang].autoChest}${translations[currentLang].off}</button>
                    <button id="autoCloseBtn" style="font-weight: bold; background-color: #28a745;">❌ ${translations[currentLang].autoClose}${translations[currentLang].off}</button>
                    <p style="color: #888; font-size: 11px; margin-top: 5px;">* Auto Fechar fecha captchas/puzzles automaticamente (PT/EN)</p>
                </div>
            `;
            document.body.appendChild(solverPopup);
            makeDraggable(solverPopup, solverPopup.querySelector('.popupHeader'));

            const minBtn = solverPopup.querySelector('.minimizeBtn');
            const content = solverPopup.querySelector('.popupContent');
            minBtn.addEventListener('click', () => {
                if (content.style.display === 'none') {
                    content.style.display = 'block';
                    minBtn.textContent = '–';
                } else {
                    content.style.display = 'none';
                    minBtn.textContent = '+';
                }
            });

            solverPopup.querySelector('.closeBtn').addEventListener('click', () => {
                // Desativa o Auto Baú ao fechar
                if (autoChestEnabled) {
                    autoChestEnabled = false;
                    if (autoChestObserver) {
                        autoChestObserver.disconnect();
                        autoChestObserver = null;
                    }
                }
                // Desativa o Auto Close ao fechar
                if (autoCloseEnabled) {
                    autoCloseEnabled = false;
                    if (autoCloseInterval) {
                        clearInterval(autoCloseInterval);
                        autoCloseInterval = null;
                    }
                }
                solverPopup.remove();
                solverPopup = null;
            });

            solverPopup.querySelector('#solveChestBtn').addEventListener('click', () => solveChest());
            solverPopup.querySelector('#solvePuzzleBtn').addEventListener('click', () => solveOtherPuzzle());
            solverPopup.querySelector('#solveGoblinsBtn').addEventListener('click', () => solveGoblins());
            solverPopup.querySelector('#autoChestBtn').addEventListener('click', toggleAutoChest);
            solverPopup.querySelector('#autoCloseBtn').addEventListener('click', toggleAutoClose);
        } else {
            solverPopup.style.display = 'block';
        }
    }

    /* === Event Listener do Menu Principal === */
    document.getElementById("openFarmingAssistant").addEventListener("click", openFarmingAssistantPopup);
    document.getElementById("openNotepad").addEventListener("click", openNotepadPopup);
    document.getElementById("openTeleport").addEventListener("click", openTeleportPopup);
    document.getElementById("openFishingRecipes").addEventListener("click", openFishingRecipesPopup);
    document.getElementById("openUpdate").addEventListener("click", openUpdatePopup);
    document.getElementById('openSolver').addEventListener('click', openSolverPopup);

    /* === Funções Auxiliares === */
    const plantNames = [
        "sunflower", "rhubarb", "carrot", "cabbage", "soybean", "corn", "wheat", "kale", "barley",
        "tomato", "blueberry", "orange", "sunpetal", "bloom", "lavender", "lily", "grape", "rice",
        "olive", "potato", "pumpkin", "zuchinni", "brocolli", "beetroot", "pepper", "cauliflower",
        "parsnip", "eggplant", "onion"
    ];
    const treeTypes = ['orange', 'apple', 'banana', 'tomato'];

    function scanElements() {
        let mainContainer = document.evaluate(
            '/html/body/div[1]/div/div/div[2]/div/div[1]/div',
            document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
        ).singleNodeValue;
        if (!mainContainer) {
            console.warn("XPath não encontrado!");
            return;
        }
        let totalPlantCount = 0;
        plantNames.forEach(plant => {
            let imgs = mainContainer.querySelectorAll('div img[src*="game-assets/crops/' + plant + '/plant.png"]');
            totalPlantCount += imgs.length;
        });
        let treeImgs = mainContainer.querySelectorAll('div img[src*="game-assets/resources/tree/Basic/spring_basic_tree.webp"]');
        let emptySoilImgs = mainContainer.querySelectorAll('div img[src*="game-assets/crops/soil2.png"]');
        let stoneImgs = mainContainer.querySelectorAll('div img[src*="game-assets/resources/stone_small.png"]');
        let ironImgs = mainContainer.querySelectorAll('div img[src*="game-assets/resources/iron_small.png"]');
        let goldImgs = mainContainer.querySelectorAll('div img[src*="game-assets/resources/gold_small.png"]');
        if(document.getElementById("plantCount")) document.getElementById("plantCount").textContent = totalPlantCount;
        if(document.getElementById("treeCount")) document.getElementById("treeCount").textContent = treeImgs.length;
        if(document.getElementById("emptySoilCount")) document.getElementById("emptySoilCount").textContent = emptySoilImgs.length;
        if(document.getElementById("stoneCount")) document.getElementById("stoneCount").textContent = stoneImgs.length;
        if(document.getElementById("ironCount")) document.getElementById("ironCount").textContent = ironImgs.length;
        if(document.getElementById("goldCount")) document.getElementById("goldCount").textContent = goldImgs.length;
        showToast('info', translations[currentLang].scan + " " + translations[currentLang].off,
            "Plantas: " + totalPlantCount + ", Árvores: " + treeImgs.length + ", Solo: " + emptySoilImgs.length +
            ", Pedra: " + stoneImgs.length + ", Ferro: " + ironImgs.length + ", Ouro: " + goldImgs.length);
    }

    function harvestPlants() {
        let mainContainer = document.evaluate(
            '/html/body/div[1]/div/div/div[2]/div/div[1]/div',
            document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
        ).singleNodeValue;
        if (!mainContainer) {
            console.warn("XPath não encontrado!");
            return;
        }
        let allHarvestImgs = [];
        plantNames.forEach(plant => {
            const imgs = Array.from(mainContainer.querySelectorAll(`div img[src*="game-assets/crops/${plant}/plant.png"]`));
            allHarvestImgs = allHarvestImgs.concat(imgs);
        });
        treeTypes.forEach(type => {
            const selector = `div img[src*="game-assets/fruit/${type}/${type}_tree.png"]`;
            const treeImgs = Array.from(mainContainer.querySelectorAll(selector));
            allHarvestImgs = allHarvestImgs.concat(treeImgs);
        });
        let delay = getDelay();
        let i = 0;
        function processNext() {
            if (i >= allHarvestImgs.length) return;
            const img = allHarvestImgs[i];
            const clickableDiv = img.closest('div');
            if (clickableDiv) {
                clickableDiv.click();
                setTimeout(() => {
                    img.click();
                    i++;
                    setTimeout(processNext, delay);
                }, delay);
            } else {
                i++;
                processNext();
            }
        }
        processNext();
    }

    function clickEmptySoil() {
        let mainContainer = document.evaluate(
            '/html/body/div[1]/div/div/div[2]/div/div[1]/div',
            document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
        ).singleNodeValue;
        if (!mainContainer) {
            console.warn("XPath não encontrado!");
            return;
        }
        let emptySoilImgs = Array.from(mainContainer.querySelectorAll('div img[src*="game-assets/crops/soil2.png"]'));
        let delay = getDelay();
        let i = 0;
        function processNext() {
            if (i >= emptySoilImgs.length) return;
            let img = emptySoilImgs[i];
            let clickableDiv = img.closest('div');
            if (clickableDiv) {
                clickableDiv.click();
                setTimeout(() => {
                    img.click();
                    i++;
                    setTimeout(processNext, delay);
                }, delay);
            } else {
                i++;
                processNext();
            }
        }
        processNext();
    }

    function getDelay() {
        return 300;
    }

    function autoCycle() {
        if (!autoFarmEnabled) return;
        harvestPlants();
        setTimeout(() => {
            clickEmptySoil();
            autoFarmTimeout = setTimeout(autoCycle, getDelay());
        }, getDelay() * 2);
    }

    function toggleAutoFarm() {
        autoFarmEnabled = !autoFarmEnabled;
        const btn = document.getElementById("autoFarmButton");
        if (autoFarmEnabled) {
            btn.textContent = translations[currentLang].autoFarm + translations[currentLang].on;
            showToast('success', translations[currentLang].autoFarm + translations[currentLang].on, "Auto Fazenda ativada.");
            autoCycle();
        } else {
            btn.textContent = translations[currentLang].autoFarm + translations[currentLang].off;
            showToast('error', translations[currentLang].autoFarm + translations[currentLang].off, "Auto Fazenda desativada.");
            clearTimeout(autoFarmTimeout);
        }
    }

    function autoMine() {
        let mineType = document.getElementById("mineTypeSelect").value;
        let mainContainer = document.evaluate(
            '/html/body/div[1]/div/div/div[2]/div/div[1]/div',
            document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
        ).singleNodeValue;
        if (!mainContainer) {
            console.warn("Contêiner principal não encontrado!");
            return;
        }
        let resourceImgs = mainContainer.querySelectorAll(`div img[src*="game-assets/resources/${mineType}_small.png"]`);
        let resourceChains = [];
        resourceImgs.forEach(img => {
            let clickableDiv = img.closest('div');
            if (!clickableDiv) return;
            let chain = [];
            let current = clickableDiv;
            while (current && mainContainer.contains(current)) {
                chain.push(current);
                current = current.parentElement;
            }
            resourceChains.push(chain);
        });
        function processChain(index) {
            if (index >= resourceChains.length) return;
            let chain = resourceChains[index];
            function clickChain(rep) {
                if (rep >= 3) {
                    setTimeout(() => processChain(index + 1), 1000);
                    return;
                }
                chain.forEach(el => el.click());
                setTimeout(() => clickChain(rep + 1), 500);
            }
            clickChain(0);
        }
        processChain(0);
    }

    function autoMineCycle() {
        if (!autoMineEnabled) return;
        autoMine();
        autoMineTimeout = setTimeout(autoMineCycle, getDelay());
    }

    function toggleAutoMine() {
        autoMineEnabled = !autoMineEnabled;
        const btn = document.getElementById("autoMineButton");
        if (autoMineEnabled) {
            btn.textContent = translations[currentLang].autoMine + translations[currentLang].on;
            showToast('success', translations[currentLang].autoMine + translations[currentLang].on, "Auto Mineração ativada.");
            autoMineCycle();
        } else {
            btn.textContent = translations[currentLang].autoMine + translations[currentLang].off;
            showToast('error', translations[currentLang].autoMine + translations[currentLang].off, "Auto Mineração desativada.");
            clearTimeout(autoMineTimeout);
        }
    }

    function autoCutTree() {
        const trees = Array.from(document.querySelectorAll('img[src*="trees/"]'))
            .filter(img => !img.src.includes('chopped.webp'));

        if (trees.length === 0) {
            showToast('info', "Nenhuma árvore para cortar.");
        }

        function processChain(index) {
            if (index >= trees.length || !autoCutTreeEnabled) {
                autoCutTreeTimeout = setTimeout(autoCutTreeCycle, getDelay());
                return;
            }

            const tree = trees[index];
            const parentDiv = tree.parentElement;

            function clickChain(rep) {
                if (rep >= 5 || !autoCutTreeEnabled) { // 5 clicks to fell a tree
                    setTimeout(() => processChain(index + 1), 500);
                    return;
                }
                if (parentDiv) {
                    parentDiv.click();
                }
                setTimeout(() => clickChain(rep + 1), 100);
            }

            if (parentDiv) {
                clickChain(0);
            } else {
                processChain(index + 1);
            }
        }
        processChain(0);
    }

    function autoCutTreeCycle() {
        if (!autoCutTreeEnabled) return;
        autoCutTree();
    }

    function toggleAutoCutTree() {
        autoCutTreeEnabled = !autoCutTreeEnabled;
        const btn = document.getElementById("autoCutTreeButton");
        if (autoCutTreeEnabled) {
            btn.textContent = translations[currentLang].autoCutTree + translations[currentLang].on;
            showToast('success', translations[currentLang].autoCutTree + translations[currentLang].on, "Auto Cortar Árvore ativado.");
            autoCutTreeCycle();
        } else {
            btn.textContent = translations[currentLang].autoCutTree + translations[currentLang].off;
            showToast('error', translations[currentLang].autoCutTree + translations[currentLang].off, "Auto Cortar Árvore desativado.");
            clearTimeout(autoCutTreeTimeout);
        }
    }

    /* === FUNÇÕES DE COZIMENTO === */
    let selectedRecipe = null;
    let lastCookedRecipeIndex = -1; // Controla qual foi a última receita cozinhada
    let availableRecipesList = []; // Lista de todas as receitas disponíveis

    function openFirePit() {
        // Nova estrutura: procura pela div container com hover:img-highlight e img fire_pit.png
        const cookingStation = document.querySelector('img[src*="fire_pit.png"]');
        if (cookingStation) {
            const container = cookingStation.closest('div.relative.w-full.h-full.cursor-pointer');
            if (container) {
                // Verifica se já está cozinhando (tem cook_doing.gif)
                const isCooking = container.querySelector('img[src*="cook_doing.gif"]');
                if (isCooking) {
                    showToast('info', 'Fogueira já está cozinhando!', 'Aguarde o término.');
                } else {
                    container.click();
                    showToast('success', 'Fogueira aberta!');
                }
                return;
            }
        }
        showToast('error', 'Fogueira não encontrada!', 'Aproxime-se da fogueira.');
    }

    function parseTime(timeString) {
        if (!timeString) return Infinity;
        const timeValue = parseInt(timeString.replace(/\D/g, ''), 10);
        if (isNaN(timeValue)) return Infinity;

        if (timeString.toLowerCase().includes('m')) {
            return timeValue * 60;
        }
        if (timeString.toLowerCase().includes('h')) {
            return timeValue * 3600;
        }
        return timeValue; // Assume seconds if no unit
    }

    function scanAvailableRecipes() {
        showToast('info', 'Verificando receitas na fogueira...');
        // Nova estrutura: procura pela img fire_pit.png e clica no container
        const cookingStation = document.querySelector('img[src*="fire_pit.png"]');
        if (!cookingStation) {
            showToast('error', 'Estação de cozinha não encontrada!', 'Aproxime-se da fogueira.');
            return;
        }

        const container = cookingStation.closest('div.relative.w-full.h-full.cursor-pointer');
        if (container) {
            container.click();
        } else {
            showToast('error', 'Container da fogueira não encontrado!');
            return;
        }

        setTimeout(() => {
            const recipeSelect = document.getElementById('recipeSelect');
            const recipeSelectionContainer = document.getElementById('recipeSelectionContainer');
            recipeSelect.innerHTML = `<option>${translations[currentLang].selectRecipe}</option>`;

            const recipeElements = document.querySelectorAll('div.w-full.sm\\:w-2\\/5.h-fit');
            const availableRecipes = new Set();

            recipeElements.forEach(el => {
                const nameElement = el.querySelector('span.sm\\:text-center');
                if (nameElement) {
                    availableRecipes.add(nameElement.innerText.trim());
                }
            });

            if (availableRecipes.size > 0) {
                availableRecipesList = Array.from(availableRecipes); // Salva a lista para rotação
                availableRecipesList.forEach(recipeName => {
                    const option = document.createElement('option');
                    option.value = recipeName;
                    option.textContent = recipeName;
                    recipeSelect.appendChild(option);
                });
                recipeSelectionContainer.style.display = 'block';
                showToast('success', `${availableRecipesList.length} receitas encontradas!`);
            } else {
                showToast('warn', 'Nenhuma receita encontrada.');
            }

            const closeButton = document.querySelector('img[src*="close_button.png"]');
            if (closeButton) {
                closeButton.click();
            }
        }, 2000);
    }

    function toggleAutoCook() {
        autoCookEnabled = !autoCookEnabled;
        const btn = document.getElementById("toggleAutoCookButton");

        if (autoCookEnabled) {
            if (!selectedRecipe || selectedRecipe === translations[currentLang].selectRecipe) {
                showToast('error', 'Nenhuma receita selecionada!', 'Verifique as receitas e escolha uma.');
                autoCookEnabled = false;
                return;
            }
            if (availableRecipesList.length === 0) {
                showToast('error', 'Escanei as receitas primeiro!', 'Clique em "Verificar Receitas".');
                autoCookEnabled = false;
                return;
            }
            btn.textContent = translations[currentLang].stopAutoCook;
            showToast('success', 'Auto Cook Ativado!', `Começando com ${selectedRecipe}. Rotação automática ativada!`);
            autoCookCycle();
        } else {
            btn.textContent = translations[currentLang].startAutoCook;
            showToast('info', translations[currentLang].stopAutoCook, 'O ciclo de cozimento irá parar.');
            clearTimeout(autoCookTimeout);
        }
    }

    function autoCookCycle() {
        if (!autoCookEnabled) return;
        autoCook();
    }

    function autoCook() {
        if (!autoCookEnabled) return;

        // 1. Primeiro, verifica se tem algo pronto para coletar
        const collectButtons = Array.from(document.querySelectorAll('button')).filter(btn => {
            const text = btn.innerText.trim().toLowerCase();
            return text.includes('colet') || text.includes('collect') || text.includes('claim');
        });

        if (collectButtons.length > 0) {
            collectButtons[0].click();
            showToast('success', 'Auto Cook', 'Item coletado!');
            autoCookTimeout = setTimeout(autoCook, 2000);
            return;
        }

        // 2. Abre a fogueira
        const cookingStation = document.querySelector('img[src*="fire_pit.png"]');
        if (!cookingStation) {
            showToast('error', 'Fogueira não encontrada!', 'Aproxime-se da fogueira.');
            autoCookTimeout = setTimeout(autoCook, 10000);
            return;
        }
        
        const container = cookingStation.closest('div.relative.w-full.h-full.cursor-pointer');
        if (!container) {
            showToast('error', 'Container da fogueira não encontrado!');
            autoCookTimeout = setTimeout(autoCook, 5000);
            return;
        }

        // Verifica se já está cozinhando
        const isCooking = container.querySelector('img[src*="cook_doing.gif"]');
        if (isCooking) {
            showToast('info', 'Auto Cook', 'Já está cozinhando... aguardando.');
            autoCookTimeout = setTimeout(autoCook, 30000); // Verifica em 30s
            return;
        }

        container.click();

        // 3. Aguarda abrir o menu e tenta cozinhar a receita selecionada
        setTimeout(() => {
            // Encontra o card da receita selecionada
            const recipeNameElement = Array.from(document.querySelectorAll('span.sm\\:text-center'))
                .find(span => span.textContent.trim() === selectedRecipe);
            
            if (!recipeNameElement) {
                showToast('error', `Receita "${selectedRecipe}" não encontrada!`);
                const closeBtn = document.querySelector('img[src*="close_button.png"]');
                if (closeBtn) closeBtn.click();
                autoCookTimeout = setTimeout(autoCook, 5000);
                return;
            }

            // Clica na receita para ver detalhes
            const recipeCard = recipeNameElement.closest('.relative.cursor-pointer, .cursor-pointer');
            if (recipeCard) {
                recipeCard.click();
            }

            setTimeout(() => {
                // Verifica o painel de detalhes da receita
                const detailPanel = document.querySelector('.w-full.sm\\:w-2\\/5.h-fit');
                if (!detailPanel) {
                    showToast('error', 'Painel de detalhes não encontrado!');
                    const closeBtn = document.querySelector('img[src*="close_button.png"]');
                    if (closeBtn) closeBtn.click();
                    autoCookTimeout = setTimeout(autoCook, 5000);
                    return;
                }

                const cookButton = Array.from(detailPanel.querySelectorAll('button')).find(btn => {
                    const text = btn.innerText.trim().toLowerCase();
                    return text.includes('cozinh') || text.includes('cook');
                });

                // Verifica se o botão de cozinhar está disponível (não disabled)
                if (cookButton && !cookButton.disabled) {
                    // Pega o tempo de cozimento
                    const timeElement = detailPanel.querySelector('img[src*="stopwatch.png"]')?.parentElement?.nextElementSibling;
                    const timeText = timeElement ? timeElement.innerText : '60s';
                    const cookTime = parseTime(timeText);

                    // COZINHA!
                    cookButton.click();
                    showToast('success', `Cozinhando: ${selectedRecipe}`, `Tempo: ${cookTime}s`);
                    
                    // Agenda próxima verificação baseada no tempo + 5 segundos
                    autoCookTimeout = setTimeout(() => {
                        showToast('info', 'Auto Cook', `${selectedRecipe} pronto! Coletando...`);
                        autoCook();
                    }, (cookTime + 5) * 1000);
                    return;
                }

                // Sem ingredientes para esta receita → Passa para a PRÓXIMA
                showToast('warn', `Sem ingredientes para ${selectedRecipe}`, 'Passando para próxima receita...');
                
                // Encontra índice atual e passa para a próxima
                const currentIndex = availableRecipesList.indexOf(selectedRecipe);
                const nextIndex = (currentIndex + 1) % availableRecipesList.length;
                selectedRecipe = availableRecipesList[nextIndex];
                
                // Atualiza o select visual
                const recipeSelect = document.getElementById('recipeSelect');
                if (recipeSelect) {
                    recipeSelect.value = selectedRecipe;
                }
                
                showToast('info', 'Próxima receita', `Tentando: ${selectedRecipe}`);
                
                // Fecha e tenta novamente com a próxima receita
                const closeBtn = document.querySelector('img[src*="close_button.png"]');
                if (closeBtn) closeBtn.click();
                autoCookTimeout = setTimeout(autoCook, 3000);
            }, 500);
        }, 1500);
    }

    /* === AUTO CLOSE - Fecha diálogos/captchas automaticamente (PT/EN) === */
    function autoCloseFunction() {
        try {
            // Procura botões com div "Fechar" (PT) ou "Close" (EN)
            const buttons = Array.from(document.querySelectorAll('button'));
            for (const btn of buttons) {
                const closeDiv = btn.querySelector('div.mb-1.w-full.flex.justify-center');
                if (closeDiv) {
                    const text = closeDiv.textContent.trim().toLowerCase();
                    if (text === 'fechar' || text === 'close') {
                        btn.click();
                        showToast('info', 'Auto Fechar', `Diálogo fechado: ${closeDiv.textContent}`);
                        return;
                    }
                }
            }
        } catch (error) {
            console.error('Erro no autoClose:', error);
        }
    }

    function toggleAutoClose() {
        autoCloseEnabled = !autoCloseEnabled;
        const btn = document.getElementById('autoCloseBtn');
        
        if (autoCloseEnabled) {
            btn.textContent = '❌ ' + translations[currentLang].autoClose + translations[currentLang].on;
            btn.style.backgroundColor = '#dc3545';
            showToast('success', 'Auto Fechar Ativado', 'Diálogos serão fechados automaticamente (PT/EN)!');
            autoCloseInterval = setInterval(autoCloseFunction, 800); // Verifica a cada 800ms
        } else {
            btn.textContent = '❌ ' + translations[currentLang].autoClose + translations[currentLang].off;
            btn.style.backgroundColor = '#28a745';
            showToast('info', 'Auto Fechar Desativado', 'Auto fechar foi desligado.');
            clearInterval(autoCloseInterval);
        }
    }

})();