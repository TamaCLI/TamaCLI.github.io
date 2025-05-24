class TamaCliDemo {
    constructor(container) {
        this.container = container;
        this.mood = 100;
        this.hunger = 50;
        this.health = 100;
        this.name = "Pet";
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
        this.lastCommand = command;
        this.addToOutput(`$ tamacli ${command} ${args.join(' ')}`.trim());

        const commands = {
            'help': () => this.showHelp(),
            'feed': () => this.feed(),
            'status': () => this.status(),
            'name': (newName) => this.setName(newName),
            'doctor': () => this.doctor(),
            'clear': () => this.clear()
        };

        if (commands[command]) {
            if (command === 'name') {
                commands[command](args[0]);
            } else {
                commands[command]();
            }
        } else {
            this.addToOutput('Command not found. Type "help" for available commands.');
        }
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

    feed() {
        if (this.hunger >= 100) {
            this.addToOutput(`🤢 ${this.name} is too full!`);
            this.mood -= 10;
            this.health = Math.max(0, this.health - 5);
        } else {
            this.hunger = Math.min(100, this.hunger + 30);
            this.mood = Math.min(100, this.mood + 10);
            this.addToOutput(`😋 Yum yum! ${this.name} enjoys the food!`);
        }
        this.updateMood();
    }

    status() {
        const moodEmoji = this.getMoodEmoji();
        this.addToOutput(`
${this.name}'s Status:
  Mood: ${moodEmoji} ${this.mood}%
  Hunger: 🍖 ${this.hunger}%
  Health: ❤️ ${this.health}%
        `);
    }

    setName(newName) {
        if (!newName) {
            this.addToOutput('Please provide a name for your pet: tamacli name <pet-name>');
            return;
        }
        const oldName = this.name;
        this.name = newName.charAt(0).toUpperCase() + newName.slice(1);
        this.addToOutput(`✨ Your pet's name has been changed from ${oldName} to ${this.name}!`);
        this.mood = Math.min(100, this.mood + 5);
        this.updateMood();
    }

    doctor() {
        if (this.health >= 100) {
            this.addToOutput(`🌟 ${this.name} is already in perfect health!`);
        } else {
            this.health = Math.min(100, this.health + 30);
            this.addToOutput(`💊 The doctor helped ${this.name} feel better!`);
        }
        this.updateMood();
    }

    clear() {
        this.output.innerHTML = '';
    }

    updateMood() {
        if (this.hunger < 30) {
            this.mood = Math.max(0, this.mood - 5);
            this.health = Math.max(0, this.health - 2);
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
        this.prompt.textContent = `${emoji} ${this.name} ~ `;
    }
} 