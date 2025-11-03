# 🌻 Sunflower Land Helper - UPGRADE v2.0.0

## ✅ UPGRADE COMPLETO REALIZADO!

O bot foi completamente atualizado com todas as funcionalidades solicitadas!

---

## 🆕 NOVIDADES DA VERSÃO 2.0.0

### 1. 🇧🇷 **Tradução Completa para Português (PT-BR)**
- ✅ Interface totalmente em português
- ✅ Suporte para 3 idiomas: Português, English e Indonesia
- ✅ Idioma padrão agora é Português (PT-BR)
- ✅ Troca de idioma em tempo real pelo menu

### 2. 📦 **Auto Baú (Auto Chest)** - NO SOLVER
- ✅ **Localizado no popup "Solver"**
- ✅ Detecta e resolve baús automaticamente
- ✅ Funciona em segundo plano (não precisa clicar manualmente)
- ✅ Verifica a tela a cada 1 segundo
- ✅ Fecha o diálogo automaticamente após resolver
- ✅ Botão toggle ON/OFF no Solver

### 3. 🍳 **Auto Cozinha (Auto Cook)** - Sistema Robusto
- ✅ Sistema de cozimento automático
- ✅ Detecta a fogueira (Fire Pit) com a estrutura:
  ```html
  <img src="https://sunflower-land.com/game-assets/buildings/fire_pit.png">
  ```
- ✅ Verifica se já está cozinhando pelo GIF:
  ```html
  <img src="https://sunflower-land.com/game-assets/npcs/cook_doing.gif">
  ```
- ✅ **Método robusto do arquivo "bot.js do farm da fazenda.js"**
- ✅ Sistema de reconhecimento de receitas por nome
- ✅ Define prato alvo (ex: "Pumpkin Soup")
- ✅ Procura automaticamente a receita no menu
- ✅ Coleta itens prontos automaticamente
- ✅ Calcula tempo de cozimento e agenda próxima verificação
- ✅ Reconhece quando faltam ingredientes

### 4. 📖 **Sistema de Receitas de Cozinha**
- ✅ Novo popup com receitas de cozinha
- ✅ Lista de receitas populares:
  - 🥕 Boiled Eggs (5x Egg)
  - 🌽 Popcorn (5x Corn)
  - 🥔 Bumpkin Broth (10x Potato)
  - 🥗 Cauliflower Burger (5x Cauliflower)
  - 🍲 Mushroom Soup (5x Wild Mushroom)
  - 🥧 Roasted Cauliflower (3x Cauliflower)
  - 🍰 Sunflower Cake (5x Sunflower, 5x Wheat, 5x Egg)
- ✅ Interface organizada com scroll

---

## 🎮 COMO USAR

### 📥 Instalação
1. Instale a extensão **Tampermonkey** no seu navegador
2. Abra o arquivo `bot.js` no Tampermonkey
3. Clique em "Instalar"
4. Acesse https://sunflower-land.com/play/

### 🎯 Menu Principal
O menu aparecerá no canto superior esquerdo com os seguintes botões:

1. **Assistente de Fazenda** - Automações principais
2. **Bloco de Notas** - Salve suas anotações
3. **Teleporte** - Viaje rapidamente
4. **Receitas de Pesca** - Guia de pesca
5. **Receitas de Cozinha** - 🆕 Guia de cozinha
6. **Solver** - Resolver puzzles
7. **Info de Atualização** - Changelog

### 🤖 Funcionalidades Auto

#### No popup "Assistente de Fazenda":

1. **Escanear** - Verifica quantidades de plantas, árvores, solo vazio, pedras, etc.

2. **Auto Fazenda** 
   - Colhe plantas automaticamente
   - Planta em solo vazio
   - Suporta todos os tipos de culturas

3. **Auto Minerar**
   - Minera pedra, ferro ou ouro
   - Selecione o tipo no dropdown

4. **Auto Cortar Árvore**
   - Corta árvores automaticamente

5. **Auto Cozinhar** 🆕
   - Sistema robusto de reconhecimento de receitas
   - Digite o nome do prato alvo (ex: "Pumpkin Soup")
   - Clique em "Salvar Prato" para salvar
   - Clique em "Iniciar Auto Cook"
   - O bot procura a receita, cozinha e coleta automaticamente
   - Calcula o tempo e agenda próxima verificação

#### No popup "Solver":

1. **Resolver Baú (Chest)** - Resolve um baú manualmente

2. **Resolver Outro Puzzle** - Resolve outros quebra-cabeças

3. **Auto Baú: DESLIGADO/LIGADO** 🆕
   - Liga/desliga resolução automática de baús
   - Funciona em segundo plano
   - Não precisa clicar manualmente
   - Fecha diálogos automaticamente

### 🌍 Trocar Idioma
No menu principal, use o dropdown para escolher:
- 🇧🇷 Português
- 🇬🇧 English
- 🇮🇩 Indonesia

---

## 🔧 DETALHES TÉCNICOS

### Estruturas Detectadas

#### Auto Baú (Chest)
```html
<div class="relative w-full rounded-md">
  <img> <!-- Primeira imagem -->
  <img> <!-- Segunda imagem (overlay) - Esta é clicada -->
</div>
```

#### Auto Cozinha (Fire Pit)
```html
<div class="relative w-full h-full cursor-pointer hover:img-highlight">
  <img src="https://sunflower-land.com/game-assets/buildings/fire_pit.png">
  <img src="https://sunflower-land.com/game-assets/npcs/cook_doing.gif">
</div>
```

### Intervalos de Verificação
- **Auto Farm**: 300ms entre ações
- **Auto Mine**: 500ms entre cliques + 1s entre recursos
- **Auto Cut Tree**: 1s entre cliques + 1s entre árvores
- **Auto Chest**: Verifica a cada 1s (no Solver)
- **Auto Cook**: Sistema inteligente com agendamento baseado no tempo de cozimento

---

## 📝 CHANGELOG v2.0.0

### ✅ Adicionado
- **Tradução completa para Português (PT-BR)** - Idioma padrão
- **Auto Baú no Solver** - Resolve baús automaticamente em segundo plano
- **Auto Cozinha Robusto** - Sistema inteligente de reconhecimento de receitas
- **Receitas de Cozinha** - Popup com lista de receitas
- **Suporte para 3 idiomas** - PT-BR, English, Indonesia com troca em tempo real

### 🔧 Melhorado
- **Interface mais moderna** - Design atualizado
- **Notificações mais claras** - Feedback visual aprimorado
- **Melhor organização** - Auto Baú movido para Solver
- **Suporte mobile mantido** - Touch e drag funcionando

### 🗑️ Removido
- Auto Close (não era necessário)
- Botões desnecessários do Assistente de Fazenda

---

## 🎨 INTERFACE

O bot possui:
- 🎯 Menu principal minificável
- 📱 Popups arrastáveis
- 🌙 Tema escuro
- 📲 Suporte touch para mobile
- 🔔 Notificações toast (máximo 3 simultâneas)
- 🌐 Seletor de idioma

---

## ⚠️ AVISOS

1. Use o bot com responsabilidade
2. Não deixe todas as automações ligadas ao mesmo tempo
3. Monitore o bot enquanto ele está funcionando
4. O auto cook pode não funcionar se não houver ingredientes
5. O auto chest só funciona se houver baús visíveis na tela

---

## 🆘 SUPORTE

Se encontrar algum problema:
1. Verifique se está na versão 2.0.0
2. Tente desligar e ligar a automação
3. Recarregue a página
4. Verifique o console do navegador (F12)

---

## 🎯 PRÓXIMAS MELHORIAS SUGERIDAS

- 🔄 Auto claim de recompensas
- 🐟 Auto pesca
- 🌾 Seleção de culturas específicas
- 📊 Dashboard com estatísticas
- 💾 Salvamento de configurações
- 🔔 Notificações de conclusão

---

## 👨‍💻 CRÉDITOS

- **Original Bot**: KITTIKONZ/LIVEXORDS
- **Upgrade v2.0.0**: UPGRADED BOT
- **Versão**: 2.0.0
- **Data**: 2024

---

## 📄 LICENÇA

Este script é fornecido "como está", sem garantias.
Use por sua conta e risco.

---

**🌻 Bom jogo no Sunflower Land! 🌻**
