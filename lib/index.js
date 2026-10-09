import makeWASocket from './Socket/index.js';
import chalk from "chalk";

console.log(chalk.hex("#8b5cf6")(`
█    DENIXVYNIX BAILEYS v1.0.0 
`));

console.log("\n");

console.log(chalk.hex("#8b5cf6")(`
┃ Creator  → DenixVynix
┃ Library    → WhatsApp Automation
┃ Status     → ✨ Installed Successfully
┃ Release    → October 9, 2026
`));
console.log(chalk.yellow("\n$  Modified Baileys \n"));
console.log(chalk.magenta("Hi, Thanks for using Baileys  DenixVynix\n"));
console.log(chalk.cyan("Channel : t.me/Xvynixnow"));;
export * from '../WAProto/index.js';
export * from './Utils/index.js';
export * from './Types/index.js';
export * from './Defaults/index.js';
export * from './WABinary/index.js';
export * from './WAM/index.js';
export * from './WAUSync/index.js';
export * from './Store/index.js';
export { makeWASocket };
export default makeWASocket;
//# sourceMappingURL=index.js.map
export * as MessageBuilder from './Socket/MessageBuilder.js';
export { default as MB } from './Socket/MessageBuilder.js';
