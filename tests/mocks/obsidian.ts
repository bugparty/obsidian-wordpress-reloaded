/**
 * Mock implementation of Obsidian API for testing
 * This file mocks the core Obsidian classes and interfaces used by the plugin
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

// Mock Plugin class
export class Plugin {
  app: any;
  manifest: any;

  constructor(app: any, manifest: any) {
    this.app = app;
    this.manifest = manifest;
  }

  async loadData(): Promise<any> {
    return {};
  }

  async saveData(data: any): Promise<void> {
    // Mock implementation
  }

  addCommand(command: any): void {
    // Mock implementation
  }

  addRibbonIcon(icon: string, title: string, callback: () => void): HTMLElement {
    const el = document.createElement('div');
    el.setAttribute('data-icon', icon);
    el.setAttribute('aria-label', title);
    return el;
  }

  addSettingTab(tab: any): void {
    // Mock implementation
  }

  registerProtocolHandler(protocol: string, callback: (url: string) => void): void {
    // Mock implementation
  }

  registerEvent(eventRef: any): void {
    // Mock implementation
  }

  registerDomEvent(el: Element, type: string, callback: any, options?: any): void {
    // Mock implementation
  }

  onunload(): void {
    // Mock implementation
  }
}

// Mock Notice class
export class Notice {
  message: string;
  timeout?: number;

  constructor(message: string, timeout?: number) {
    this.message = message;
    this.timeout = timeout;
  }

  setMessage(message: string): this {
    this.message = message;
    return this;
  }

  hide(): void {
    // Mock implementation
  }
}

// Mock Modal class
export class Modal {
  app: any;
  containerEl: HTMLElement;
  titleEl: HTMLElement;
  contentEl: HTMLElement;
  modalEl: HTMLElement;

  constructor(app: any) {
    this.app = app;
    this.containerEl = document.createElement('div');
    this.titleEl = document.createElement('div');
    this.contentEl = document.createElement('div');
    this.modalEl = document.createElement('div');
  }

  open(): void {
    this.onOpen();
  }

  close(): void {
    this.onClose();
  }

  onOpen(): void {
    // To be overridden
  }

  onClose(): void {
    // To be overridden
  }
}

// Mock Setting class
export class Setting {
  containerEl: HTMLElement;
  settingEl: HTMLElement;
  nameEl: HTMLElement;
  descEl: HTMLElement;
  controlEl: HTMLElement;

  constructor(containerEl: HTMLElement) {
    this.containerEl = containerEl;
    this.settingEl = document.createElement('div');
    this.nameEl = document.createElement('div');
    this.descEl = document.createElement('div');
    this.controlEl = document.createElement('div');
    containerEl.appendChild(this.settingEl);
  }

  setName(name: string | DocumentFragment): this {
    if (typeof name === 'string') {
      this.nameEl.textContent = name;
    }
    return this;
  }

  setDesc(desc: string | DocumentFragment): this {
    if (typeof desc === 'string') {
      this.descEl.textContent = desc;
    }
    return this;
  }

  setClass(cls: string): this {
    this.settingEl.className = cls;
    return this;
  }

  setTooltip(tooltip: string): this {
    this.settingEl.setAttribute('title', tooltip);
    return this;
  }

  addText(cb: (text: TextComponent) => void): this {
    const text = new TextComponent(this.controlEl);
    cb(text);
    return this;
  }

  addButton(cb: (button: ButtonComponent) => void): this {
    const button = new ButtonComponent(this.controlEl);
    cb(button);
    return this;
  }

  addToggle(cb: (toggle: ToggleComponent) => void): this {
    const toggle = new ToggleComponent(this.controlEl);
    cb(toggle);
    return this;
  }

  addDropdown(cb: (dropdown: DropdownComponent) => void): this {
    const dropdown = new DropdownComponent(this.controlEl);
    cb(dropdown);
    return this;
  }

  addTextArea(cb: (text: TextAreaComponent) => void): this {
    const textArea = new TextAreaComponent(this.controlEl);
    cb(textArea);
    return this;
  }
}

// Mock TextComponent
export class TextComponent {
  inputEl: HTMLInputElement;

  constructor(containerEl: HTMLElement) {
    this.inputEl = document.createElement('input');
    this.inputEl.type = 'text';
    containerEl.appendChild(this.inputEl);
  }

  setValue(value: string): this {
    this.inputEl.value = value;
    return this;
  }

  getValue(): string {
    return this.inputEl.value;
  }

  setPlaceholder(placeholder: string): this {
    this.inputEl.placeholder = placeholder;
    return this;
  }

  onChange(callback: (value: string) => void): this {
    this.inputEl.addEventListener('input', () => callback(this.inputEl.value));
    return this;
  }

  setDisabled(disabled: boolean): this {
    this.inputEl.disabled = disabled;
    return this;
  }
}

// Mock ButtonComponent
export class ButtonComponent {
  buttonEl: HTMLButtonElement;

  constructor(containerEl: HTMLElement) {
    this.buttonEl = document.createElement('button');
    containerEl.appendChild(this.buttonEl);
  }

  setButtonText(text: string): this {
    this.buttonEl.textContent = text;
    return this;
  }

  setCta(): this {
    this.buttonEl.classList.add('mod-cta');
    return this;
  }

  setWarning(): this {
    this.buttonEl.classList.add('mod-warning');
    return this;
  }

  setDisabled(disabled: boolean): this {
    this.buttonEl.disabled = disabled;
    return this;
  }

  onClick(callback: () => void): this {
    this.buttonEl.addEventListener('click', callback);
    return this;
  }
}

// Mock ToggleComponent
export class ToggleComponent {
  toggleEl: HTMLInputElement;

  constructor(containerEl: HTMLElement) {
    this.toggleEl = document.createElement('input');
    this.toggleEl.type = 'checkbox';
    containerEl.appendChild(this.toggleEl);
  }

  setValue(value: boolean): this {
    this.toggleEl.checked = value;
    return this;
  }

  getValue(): boolean {
    return this.toggleEl.checked;
  }

  onChange(callback: (value: boolean) => void): this {
    this.toggleEl.addEventListener('change', () => callback(this.toggleEl.checked));
    return this;
  }

  setDisabled(disabled: boolean): this {
    this.toggleEl.disabled = disabled;
    return this;
  }
}

// Mock DropdownComponent
export class DropdownComponent {
  selectEl: HTMLSelectElement;

  constructor(containerEl: HTMLElement) {
    this.selectEl = document.createElement('select');
    containerEl.appendChild(this.selectEl);
  }

  addOption(value: string, display: string): this {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = display;
    this.selectEl.appendChild(option);
    return this;
  }

  addOptions(options: Record<string, string>): this {
    Object.entries(options).forEach(([value, display]) => {
      this.addOption(value, display);
    });
    return this;
  }

  setValue(value: string): this {
    this.selectEl.value = value;
    return this;
  }

  getValue(): string {
    return this.selectEl.value;
  }

  onChange(callback: (value: string) => void): this {
    this.selectEl.addEventListener('change', () => callback(this.selectEl.value));
    return this;
  }

  setDisabled(disabled: boolean): this {
    this.selectEl.disabled = disabled;
    return this;
  }
}

// Mock TextAreaComponent
export class TextAreaComponent {
  inputEl: HTMLTextAreaElement;

  constructor(containerEl: HTMLElement) {
    this.inputEl = document.createElement('textarea');
    containerEl.appendChild(this.inputEl);
  }

  setValue(value: string): this {
    this.inputEl.value = value;
    return this;
  }

  getValue(): string {
    return this.inputEl.value;
  }

  setPlaceholder(placeholder: string): this {
    this.inputEl.placeholder = placeholder;
    return this;
  }

  onChange(callback: (value: string) => void): this {
    this.inputEl.addEventListener('input', () => callback(this.inputEl.value));
    return this;
  }

  setDisabled(disabled: boolean): this {
    this.inputEl.disabled = disabled;
    return this;
  }
}

// Mock PluginSettingTab
export class PluginSettingTab {
  app: any;
  plugin: Plugin;
  containerEl: HTMLElement;

  constructor(app: any, plugin: Plugin) {
    this.app = app;
    this.plugin = plugin;
    this.containerEl = document.createElement('div');
  }

  display(): void {
    // To be overridden
  }

  hide(): void {
    // To be overridden
  }
}

// Mock TFile
export class TFile {
  path: string;
  name: string;
  basename: string;
  extension: string;
  vault: any;
  parent: any;
  stat: { ctime: number; mtime: number; size: number };

  constructor(path: string) {
    this.path = path;
    this.name = path.split('/').pop() || '';
    const parts = this.name.split('.');
    this.extension = parts.length > 1 ? parts.pop()! : '';
    this.basename = parts.join('.');
    this.stat = {
      ctime: Date.now(),
      mtime: Date.now(),
      size: 0
    };
  }
}

// Mock TFolder
export class TFolder {
  path: string;
  name: string;
  children: any[];

  constructor(path: string) {
    this.path = path;
    this.name = path.split('/').pop() || '';
    this.children = [];
  }
}

// Mock Vault
export class Vault {
  adapter: any;

  async read(file: TFile): Promise<string> {
    return '';
  }

  async cachedRead(file: TFile): Promise<string> {
    return '';
  }

  async modify(file: TFile, data: string): Promise<void> {
    // Mock implementation
  }

  async create(path: string, data: string): Promise<TFile> {
    return new TFile(path);
  }

  async delete(file: TFile): Promise<void> {
    // Mock implementation
  }

  async rename(file: TFile, newPath: string): Promise<void> {
    // Mock implementation
  }

  getAbstractFileByPath(path: string): TFile | TFolder | null {
    return null;
  }

  getFiles(): TFile[] {
    return [];
  }

  getMarkdownFiles(): TFile[] {
    return [];
  }
}

// Mock Workspace
export class Workspace {
  activeEditor: any;

  getActiveFile(): TFile | null {
    return null;
  }

  getActiveViewOfType(type: any): any {
    return null;
  }

  openLinkText(linktext: string, sourcePath: string): Promise<void> {
    return Promise.resolve();
  }

  on(name: string, callback: (...args: any[]) => any): any {
    return { unload: () => {} };
  }
}

// Mock MetadataCache
export class MetadataCache {
  getFileCache(file: TFile): any {
    return null;
  }

  getCache(path: string): any {
    return null;
  }

  on(name: string, callback: (...args: any[]) => any): any {
    return { unload: () => {} };
  }
}

// Mock App
export class App {
  vault: Vault;
  workspace: Workspace;
  metadataCache: MetadataCache;

  constructor() {
    this.vault = new Vault();
    this.workspace = new Workspace();
    this.metadataCache = new MetadataCache();
  }
}

// Mock FileManager
export class FileManager {
  vault: Vault;

  constructor(vault: Vault) {
    this.vault = vault;
  }

  async processFrontMatter(file: TFile, fn: (frontmatter: any) => void): Promise<void> {
    // Mock implementation
  }
}

// Mock Events class
export class Events {
  private handlers: Map<string, Set<(...args: any[]) => void>>;

  constructor() {
    this.handlers = new Map();
  }

  on(event: string, handler: (...args: any[]) => void): { unload: () => void } {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);
    return {
      unload: () => {
        this.off(event, handler);
      }
    };
  }

  off(event: string, handler: (...args: any[]) => void): void {
    const handlers = this.handlers.get(event);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  trigger(event: string, ...args: any[]): void {
    const handlers = this.handlers.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(...args));
    }
  }

  offref(ref: { unload: () => void }): void {
    ref.unload();
  }
}

// Helper function to create mock app
export function createMockApp(): App {
  return new App();
}

// Helper function to create mock vault
export function createMockVault(): Vault {
  return new Vault();
}

// Default exports for common usage
export const mockApp = createMockApp();
export const mockVault = createMockVault();
