# Code-Live-Editor
# Code Editor - README

## 📋 Project Overview

A powerful, feature-rich web-based code editor that allows you to write HTML, CSS, and JavaScript code with real-time preview. This editor provides a complete development environment in your browser with advanced features like undo/redo, file management, and code history.

## ✨ Features

### 🎯 Core Functionality
- **Multi-language Support**: Write HTML, CSS, and JavaScript in separate tabs
- **Real-time Preview**: See your code results instantly as you type
- **Live Updates**: Automatic preview refresh with 1-second delay after changes
- **Responsive Design**: Works perfectly on desktop and mobile devices

### 🔄 Advanced Editing
- **Undo/Redo**: Track changes per language with unlimited undo/redo capability
- **Code Clearing**: Quickly clear code in the current language tab
- **Smart Code Separation**: Automatically separates HTML, CSS, and JS when importing files
- **Syntax Highlighting**: Clean, readable code formatting

### 💾 File Management
- **Save Projects**: Save your work with custom names
- **Export HTML**: Download complete HTML files with embedded CSS and JS
- **Import Files**: Load existing HTML files with automatic code separation
- **File History**: Access and load previously saved projects

### 📚 History & Version Control
- **Code History**: Automatic saving of code versions when you run your code
- **Version Browser**: Browse through previous code states
- **One-Click Restoration**: Restore any previous version with a single click
- **Auto-save**: Automatic history tracking as you code

### 🎨 User Interface
- **Dark Theme**: Easy-on-the-eyes dark color scheme
- **Collapsible Panels**: Maximize preview space by hiding the code panel
- **Toast Notifications**: Visual feedback for all actions
- **Intuitive Sidebar**: Quick access to all major features
- **Tab-based Navigation**: Easy switching between HTML, CSS, and JavaScript

## 🚀 Quick Start

### Option 1: Single File Setup
1. Download `code-editor.html`
2. Open it in any modern web browser
3. Start coding immediately!

### Option 2: Multi-file Setup (Recommended for Development)
1. Create a project folder
2. Download these files into the folder:
   - `index.html`
   - `style.css`
   - `script.js`
3. Open `index.html` in your browser

## 📖 How to Use

### Basic Usage
1. **Write Code**: Use the HTML, CSS, and JavaScript tabs to write your code
2. **Run Code**: Click the "Run" button or wait for auto-refresh (1 second after typing)
3. **View Preview**: See your output in the preview panel on the right

### Advanced Features

#### 🗂️ File Management
- **Save Project**: Enter a filename and click "Save Current Code"
- **Export**: Download your project as a complete HTML file
- **Import**: Load existing HTML files (automatically separates code)

#### ⏪ Undo/Redo
- **Undo (↶)**: Revert changes in the current language tab
- **Redo (↷)**: Restore changes you've undone
- **Per-language**: Each language maintains its own undo history

#### 🗑️ Code Management
- **Clear**: Remove all code from the current language tab
- **History**: Browse and restore previous code versions

#### 🎛️ Interface Controls
- **Toggle Code Panel**: Show/hide the code editor to maximize preview space
- **Sidebar Icons**: 
  - `{ }` - Code Editor
  - `👁️` - Preview Mode
  - `🕒` - Code History
  - `💾` - File Manager

## 💾 Data Storage

All your data is stored locally in your browser using:
- **localStorage**: For code history and saved files
- **Session Storage**: For temporary undo/redo stacks
- **No Server Required**: Everything works offline

### Storage Limits
- **Code History**: Last 15 versions
- **Saved Files**: Last 20 projects
- **Undo/Redo**: Unlimited per session

## 🛠️ Technical Details

### Browser Compatibility
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

### Technologies Used
- **HTML5**: Structure and semantic markup
- **CSS3**: Modern styling with CSS variables and flexbox
- **Vanilla JavaScript**: No frameworks or dependencies
- **localStorage API**: Data persistence
- **File API**: Import/export functionality
- **iframe Sandboxing**: Secure code execution

### Security Features
- **Sandboxed Preview**: Code runs in a secure iframe environment
- **Content Security**: Prevents XSS attacks through proper sandboxing
- **Local Storage Only**: No data sent to external servers



