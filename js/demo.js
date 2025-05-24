class TamaCliDemo {
    constructor(container) {
        this.container = container;
        this.mood = 100;
        this.hunger = 50;
        this.health = 100;
        this.lastCommand = '';
        this.commandHistory = [];
        this.historyIndex = 0;
        
        // Initialize UI
        this.createTerminal();
        this.updatePrompt();
        
        // Start decreasing hunger over time
        setInterval(() => {
            this.hunger = Math.max(0, this.hunger - 1);
            this.updateMood();
            this.updatePrompt();
        }, 3000);
    }

    createTerminal() {
        this.terminal = document.createElement('div');
        this.terminal.className = 'terminal';
        
        this.output = document.createElement('div');
        this.output.className = 'terminal-output';
        
        this.promptLine = document.createElement('div');
        this.promptLine.className = 'prompt-line';
        
        this.prompt = document.createElement('span');
        this.prompt.className = 'prompt';
        
        this.input = document.createElement('input');
        this.input.type = 'text';
        this.input.className = 'terminal-input';
        this.input.setAttribute('autocomplete', 'off');
        this.input.setAttribute('spellcheck', 'false');
        
        this.promptLine.appendChild(this.prompt);
        this.promptLine.appendChild(this.input);
        
        this.terminal.appendChild(this.output);
        this.terminal.appendChild(this.promptLine);
        
        this.container.appendChild(this.terminal);
        
        // Event listeners
        this.input.addEventListener('keydown', (e) => this.handleInput(e));
        this.terminal.addEventListener('click', () => this.input.focus());
        
        // Focus input on load
        this.input.focus();
    }

    handleInput(e) {
        if (e.key === 'Enter') {
            const command = this.input.value.trim().toLowerCase();
            if (command) {
                this.commandHistory.push(command);
                this.historyIndex = this.commandHistory.length;
                this.executeCommand(command);
                this.input.value = '';
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (this.historyIndex > 0) {
                this.historyIndex--;
                this.input.value = this.commandHistory[this.historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (this.historyIndex < this.commandHistory.length - 1) {
                this.historyIndex++;
                this.input.value = this.commandHistory[this.historyIndex];
            } else {
                this.historyIndex = this.commandHistory.length;
                this.input.value = '';
            }
        }
    }

    executeCommand(command) {
        this.lastCommand = command;
        this.addToOutput(`$ ${command}`);

        const commands = {
            'help': () => this.showHelp(),
            'feed': () => this.feed(),
            'status': () => this.status(),
            'pet': () => this.pet(),
            'heal': () => this.heal(),
            'play': () => this.play(),
            'clear': () => this.clear()
        };

        if (commands[command]) {
            commands[command]();
        } else {
            this.addToOutput('Command not found. Type "help" for available commands.');
        }
    }

    showHelp() {
        this.addToOutput(`
Available commands:
  help   - Show this help message
  feed   - Feed your pet
  status - Check pet's status
  pet    - Pet your companion
  heal   - Heal your pet
  play   - Play with your pet
  clear  - Clear terminal
        `);
    }

    feed() {
        if (this.hunger >= 100) {
            this.addToOutput('🤢 Your pet is too full!');
            this.mood -= 10;
        } else {
            this.hunger = Math.min(100, this.hunger + 30);
            this.mood = Math.min(100, this.mood + 10);
            this.addToOutput('😋 Yum yum! Your pet enjoys the food!');
        }
        this.updateMood();
    }

    status() {
        const moodEmoji = this.getMoodEmoji();
        this.addToOutput(`
Status:
  Mood: ${moodEmoji} ${this.mood}%
  Hunger: 🍖 ${this.hunger}%
  Health: ❤️ ${this.health}%
        `);
    }

    pet() {
        this.mood = Math.min(100, this.mood + 15);
        this.addToOutput('😊 Your pet feels loved!');
        this.updateMood();
    }

    heal() {
        if (this.health >= 100) {
            this.addToOutput('🌟 Your pet is already in perfect health!');
        } else {
            this.health = Math.min(100, this.health + 30);
            this.addToOutput('💊 Your pet feels better!');
        }
        this.updateMood();
    }

    play() {
        if (this.hunger < 30) {
            this.addToOutput('😴 Your pet is too hungry to play!');
            this.mood -= 10;
        } else {
            this.hunger = Math.max(0, this.hunger - 20);
            this.mood = Math.min(100, this.mood + 20);
            this.addToOutput('🎾 Your pet had fun playing!');
        }
        this.updateMood();
    }

    clear() {
        this.output.innerHTML = '';
    }

    updateMood() {
        if (this.hunger < 30) {
            this.mood = Math.max(0, this.mood - 5);
        }
        this.mood = Math.max(0, Math.min(100, this.mood));
    }

    getMoodEmoji() {
        if (this.mood > 80) return '😊';
        if (this.mood > 60) return '🙂';
        if (this.mood > 40) return '😐';
        if (this.mood > 20) return '😟';
        return '😢';
    }

    addToOutput(text) {
        const line = document.createElement('div');
        line.textContent = text;
        this.output.appendChild(line);
        this.output.scrollTop = this.output.scrollHeight;
    }

    updatePrompt() {
        const emoji = this.getMoodEmoji();
        this.prompt.textContent = `${emoji} ready ~ `;
    }
} 