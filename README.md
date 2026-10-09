<p align="center">
  <img src="https://img.shields.io/badge/DenixVynix-Baileys-blueviolet?style=for-the-badge" alt="DenixVynix Baileys"/>
</p>

<h1 align="center">🚀 DenixVynix Baileys</h1>

<p align="center">
  <strong>Lightning-fast, rock-solid WhatsApp automation library</strong>
  <br/>
  Build powerful WhatsApp bots & integrations with WebSocket—zero browser overhead
</p>

<p align="center">
  <img src="https://img.shields.io/badge/node-%3E%3D20-brightgreen?style=flat-square" alt="Node 20+"/>
  <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="MIT License"/>
  <img src="https://img.shields.io/badge/multi--device-✓-success?style=flat-square" alt="Multi-device Support"/>
  <img src="https://img.shields.io/badge/websocket-native-orange?style=flat-square" alt="WebSocket Native"/>
</p>

---

## ✨ Quick Overview

DenixVynix Baileys is a **high-performance** TypeScript/JavaScript library for WhatsApp automation. No browser? No problem. We handle WhatsApp's WebSocket protocol so you can focus on building amazing things.

**Perfect for:**
- 🤖 WhatsApp Bots
- 💬 Customer Service Automation
- 🔗 Business Integrations
- 📱 Multi-device WhatsApp Tools
- ⚡ Real-time Message Processing

---

## 📋 Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
  - [QR Code Authentication](#qr-code-authentication)
  - [Pairing Code Authentication](#pairing-code-authentication)
- [Usage Examples](#usage-examples)
- [API Overview](#api-overview)
- [Configuration](#configuration)
- [Technical Stack](#technical-stack)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [Official Channels](#official-channels)
- [License](#license)

---

## ✨ Features

### Core Capabilities
✅ **WebSocket-based** — Direct WhatsApp connection, no browser required  
✅ **Multi-device** — Full support for WhatsApp multi-device mode  
✅ **QR & Pairing Code** — Multiple authentication methods  
✅ **Message Management** — Send, receive, edit, delete messages seamlessly  
✅ **Group Administration** — Create, manage, moderate groups  
✅ **Interactive Features** — Buttons, lists, templates, and more  
✅ **Session Persistence** — Automatic reconnection & state management  
✅ **High Performance** — Lightweight & modular architecture  

### Advanced Features
- 🔐 End-to-end encryption support
- 📞 Call handling & notifications
- 👥 Contact & group management
- 💾 Built-in session storage
- 🌐 Business account compatibility
- 🎯 Precise message timestamps
- 🔄 Event-driven architecture

---

## 📦 Installation

### npm
```bash
npm install @denzz221/baileys
```

### yarn
```bash
yarn add @denzz221/baileys
```

### pnpm
```bash
pnpm add @denzz221/baileys
```

### Using Package Alias
If you need compatibility with existing code using `@whiskeysockets/baileys`:

```json
{
  "dependencies": {
    "@whiskeysockets/baileys": "npm:@denzz221/baileys"
  }
}
```

---

## 🚀 Quick Start

### QR Code Authentication

The simplest way to get started:

```javascript
const {
  default: makeWASocket,
  DisconnectReason,
  useMultiFileAuthState,
} = require('@denzz221/baileys');
const { Boom } = require('@hapi/boom');

async function connectWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
  
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
  });

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    
    if (connection === 'close') {
      const shouldReconnect =
        (lastDisconnect.error instanceof Boom)?.output?.statusCode !==
        DisconnectReason.loggedOut;
      
      console.log('Connection closed. Reconnecting:', shouldReconnect);
      if (shouldReconnect) connectWhatsApp();
    } else if (connection === 'open') {
      console.log('✅ Connected!');
    }
  });

  sock.ev.on('messages.upsert', async (m) => {
    const msg = m.messages[0];
    
    if (!msg.key.fromMe && msg.message?.conversation) {
      console.log('📨 New message:', msg.message.conversation);
      
      // Echo the message back
      await sock.sendMessage(msg.key.remoteJid, {
        text: 'Echo: ' + msg.message.conversation,
      });
    }
  });

  sock.ev.on('creds.update', saveCreds);
}

connectWhatsApp();
```

### Pairing Code Authentication

For headless environments or deployment:

```javascript
const {
  default: makeWASocket,
  fetchLatestWAWebVersion,
} = require('@denzz221/baileys');

async function connectWithPairingCode() {
  const sock = makeWASocket({
    version: await fetchLatestWAWebVersion(),
    printQRInTerminal: false, // Disable QR
  });

  sock.ev.on('connection.update', async (update) => {
    const { connection } = update;
    
    if (connection === 'open') {
      console.log('✅ Connected!');
    }
  });

  // Request pairing code
  const phoneNumber = '62812345678'; // Your WhatsApp number
  const code = await sock.requestPairingCode(phoneNumber.trim());
  
  console.log(`📱 Pairing Code: ${code}`);
  // Share this code with the user to enter in their WhatsApp
}

connectWithPairingCode();
```

---

## 💡 Usage Examples

### Sending Messages

```javascript
// Simple text message
await sock.sendMessage('628XXXXXXXXX@s.whatsapp.net', {
  text: 'Hello from DenixVynix Baileys!',
});

// Message with mentions
await sock.sendMessage(chatId, {
  text: 'Hey @user check this out!',
  mentions: [userJid],
});

// With participant receipt
await sock.sendMessage(chatId, {
  text: 'Message sent!',
}, { 
  ptcp: true  // Enable participant receipts
});
```

### Handling Group Messages

```javascript
sock.ev.on('messages.upsert', async (m) => {
  const msg = m.messages[0];
  
  // Check if group message
  if (msg.key.remoteJid.endsWith('@g.us')) {
    console.log(`📢 Group: ${msg.key.remoteJid}`);
    console.log(`👤 From: ${msg.key.participant}`);
    
    // Auto-respond to group messages
    if (msg.message?.conversation?.includes('!hello')) {
      await sock.sendMessage(msg.key.remoteJid, {
        text: 'Hello everyone! 👋',
      });
    }
  }
});
```

### Status Updates

```javascript
sock.ev.on('presence.update', (presenceUpdate) => {
  console.log('Presence update:', presenceUpdate);
  // Monitor online/offline status
});

sock.ev.on('chats.update', (chatUpdates) => {
  chatUpdates.forEach(chat => {
    console.log(`Chat updated: ${chat.id}`);
  });
});
```

---

## 🔧 API Overview

### Connection Methods

| Method | Returns | Purpose |
|--------|---------|---------|
| `makeWASocket(config)` | `WhatsAppSocket` | Create connection |
| `requestPairingCode(number)` | `string` | Get pairing code |
| `fetchLatestWAWebVersion()` | `string` | Get latest WA version |

### Message API

| Method | Usage |
|--------|-------|
| `sendMessage(jid, content)` | Send any message type |
| `editMessage(jid, msgKey, content)` | Edit existing message |
| `deleteMessage(jid, msgKey)` | Delete message |
| `forwardMessage(jid, message)` | Forward message |

### Events

```javascript
sock.ev.on('connection.update', handler)  // Connection status
sock.ev.on('messages.upsert', handler)    // New messages
sock.ev.on('message.update', handler)     // Message updates
sock.ev.on('presence.update', handler)    // User status
sock.ev.on('groups.upsert', handler)      // New groups
sock.ev.on('chats.update', handler)       // Chat updates
sock.ev.on('contacts.update', handler)    // Contact changes
sock.ev.on('creds.update', handler)       // Credentials update
```

---

## ⚙️ Configuration

### Basic Socket Configuration

```javascript
const sock = makeWASocket({
  // Auth
  auth: authState,
  
  // Browser identification
  browser: Browsers.ubuntu('Chrome'),
  
  // QR display
  printQRInTerminal: true,
  
  // Logging
  logger: P(2),  // 0=verbose, 1=info, 2=warning
  
  // Connection
  retryRequestDelayMs: 10_000,
  maxRetries: 5,
  
  // Message handling
  markOnlineOnConnect: true,
  syncFullHistory: false,
  
  // Advanced
  shouldSyncHistoryMessage: () => false,
  shouldIgnoreJid: (jid) => jid.includes('status@broadcast'),
});
```

### Browser Options

```javascript
const { Browsers } = require('@denzz221/baileys');

// Different browser options
Browsers.ubuntu('Chrome')           // Ubuntu + Chrome
Browsers.ubuntu('Firefox')          // Ubuntu + Firefox
Browsers.ubuntu('Edge')             // Ubuntu + Edge
Browsers.macOS('Safari')            // macOS + Safari
Browsers.windows('Edge')            // Windows + Edge
```

---

## 🛠️ Technical Stack

- **Runtime**: Node.js 20+
- **Language**: TypeScript/JavaScript
- **Protocol**: WebSocket (WhatsApp Web Protocol)
- **Architecture**: Event-driven
- **Crypto**: End-to-end encryption compatible
- **Session**: File-based or custom storage

### System Requirements

- Node.js ≥ 20.0
- npm/yarn/pnpm
- 100+ MB available memory
- Stable internet connection
- Active WhatsApp account

---

## 🐛 Troubleshooting

### Connection Issues

**Problem**: Can't connect to WhatsApp  
**Solution**: 
- Clear `auth_info_baileys` folder
- Check internet connection
- Try pairing code instead of QR
- Verify WhatsApp account is active

### QR Code Not Showing

**Problem**: QR code not printing in terminal  
**Solution**:
```javascript
// Enable QR code
const sock = makeWASocket({
  printQRInTerminal: true,
  qrTimeout: 60000, // Increase timeout
});
```

### Session Expires

**Problem**: "Unauthorized" error after some time  
**Solution**:
```javascript
sock.ev.on('creds.update', async (creds) => {
  // Ensure credentials are saved
  await saveCreds();
});
```

### High CPU Usage

**Problem**: Node.js consuming too much CPU  
**Solution**:
- Disable `syncFullHistory`
- Reduce event listeners
- Implement connection pooling
- Use production log level

---

## 🤝 Contributing

We welcome contributions! Areas we need help with:

- 🐛 Bug reports & fixes
- 📚 Documentation improvements
- ✨ New features
- 🧪 Test coverage
- 🌍 Translation support

### Steps to Contribute

1. Fork this repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📱 Official Channels

Stay connected with the DenixVynix community:

### WhatsApp
🔗 [DenixVynix WhatsApp Channel](https://whatsapp.com/channel/0029VbEXzKLKAwEsOPPRpJ1z)

### Telegram
🔗 [DenixVynix Telegram](https://t.me/denzz221)

### GitHub
🔗 [GitHub Repository](https://github.com/denzz221)



---

## 📄 License

This project is licensed under the **MIT License** — feel free to use, modify, and distribute!

```
MIT License

Copyright (c) 2026 DenixVynix

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software...
```

---

## 🙏 Credits

DenixVynix Baileys is maintained and developed by the **DenixVynix Team** with contributions from the amazing open-source community.

---

<p align="center">
  <br/>
  <strong>Made with ❤️ by DenixVynix</strong>
  <br/>
  <sub>WhatsApp Automation Made Simple</sub>
  <br/><br/>
  <a href="https://github.com/denzz221/baileys">⭐ Star us on GitHub</a>
  •
  <a href="#contributing">Contribute</a>
  •
  <a href="https://t.me/denzz221">creator</a>
</p>
