class TamaCliDemo {
    constructor(container) {
        this.container = container;
        this.mood = 100;
        this.hunger = 5;
        this.health = 100;
        this.username = 'cardiffemde';
        this.hostname = 'Cardiffs-MacBook-air';
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
        }, 5000);
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
            const fullCommand = this.input.value.trim().toLowerCase();
            const [command, ...args] = fullCommand.split(' ');
            
            if (command) {
                this.commandHistory.push(fullCommand);
                this.historyIndex = this.commandHistory.length;
                this.executeCommand(command, args);
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

    executeCommand(command, args) {
        const fullCommand = `${command} ${args.join(' ')}`.trim();
        this.addToOutput(`${this.getPromptText()}${fullCommand}`);

        // Remove 'tamacli' from the start of the command if present
        if (command.startsWith('tamacli ')) {
            const parts = command.split(' ');
            command = parts[1];
            args = parts.slice(2);
        }

        const commands = {
            'help': () => this.showHelp(),
            'tamacli feed': () => this.feed(),
            'tamacli status': () => this.status(),
            'tamacli name': (newName) => this.setName(newName),
            'tamacli doctor': () => this.doctor(),
            'clear': () => this.clear()
        };

        // Try exact command match first
        if (commands[command]) {
            if (command === 'tamacli name') {
                commands[command](args[0]);
            } else {
                commands[command]();
            }
            return;
        }

        // Try full command string match
        if (commands[fullCommand]) {
            commands[fullCommand]();
            return;
        }

        this.addToOutput('Command not found. Type "help" for available commands.');
    }

    showHelp() {
        this.addToOutput(`
Available commands:
  tamacli feed    - Feed your pet when they're hungry
  tamacli status  - Check your pet's current status
  tamacli name    - Give your pet a new name
  tamacli doctor  - Call the doctor when your pet is sick
  help            - Show this help message
  clear           - Clear terminal
        `);
    }

    getMoodText() {
        if (this.mood > 80) return 'happy';
        if (this.mood > 60) return 'good';
        if (this.mood > 40) return 'meh';
        if (this.mood > 20) return 'hungry';
        return 'starving';
    }

    getMoodEmoji() {
        if (this.mood > 80) return '😸';
        if (this.mood > 60) return '😺';
        if (this.mood > 40) return '😿';
        if (this.mood > 20) return '😾';
        return '🙀';
    }

    getPromptText() {
        const emoji = this.getMoodEmoji();
        const moodText = this.getMoodText();
        return `${this.username}@${this.hostname} ${emoji} ${moodText} ~ % `;
    }

    feed() {
        const oldHunger = this.hunger;
        this.hunger = Math.min(10, this.hunger + 3);
        this.mood = Math.min(100, this.mood + 10);
        this.addToOutput(`😋 You fed your Tama! Hunger is now ${this.hunger}.`);
        this.updateMood();
    }

    status() {
        const moodText = this.getMoodText();
        const emoji = this.getMoodEmoji();
        this.addToOutput(`${emoji} Your Tama is ${moodText}! Hunger level: ${this.hunger}/10`);
    }

    doctor() {
        if (this.health >= 100) {
            this.addToOutput(`🌟 Your Tama is already healthy!`);
        } else {
            this.health = 100;
            this.addToOutput(`💊 The doctor helped your Tama feel better!`);
        }
        this.updateMood();
    }

    setName(newName) {
        if (!newName) {
            this.addToOutput('Please provide a name for your Tama: tamacli name <name>');
            return;
        }
        this.addToOutput(`✨ Your Tama's name has been set to ${newName}!`);
        this.mood = Math.min(100, this.mood + 5);
        this.updateMood();
    }

    clear() {
        this.output.innerHTML = '';
    }

    updateMood() {
        if (this.hunger < 3) {
            this.mood = Math.max(0, this.mood - 10);
            this.health = Math.max(0, this.health - 2);
        }
        this.mood = Math.max(0, Math.min(100, this.mood));
        this.updatePrompt();
    }

    addToOutput(text) {
        const line = document.createElement('div');
        line.textContent = text;
        this.output.appendChild(line);
        this.output.scrollTop = this.output.scrollHeight;
    }

    updatePrompt() {
        this.prompt.textContent = this.getPromptText();
    }
} 