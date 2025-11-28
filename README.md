# smart copy for cli

A VSCode extension that copies your selected code along with its file path and line numbers in a CLI-friendly format. Perfect for referencing code in issues, pull requests, documentation, or chat tools.

---

## Features

This extension provides **two copy modes**:

| Mode | Shortcut | Description |
|------|----------|-------------|
| **Copy Path Only** | `Alt+Shift+C` | Copies file path and line range only |
| **Copy Path and Code** | `Cmd+Shift+Alt+C` (Mac) / `Ctrl+Shift+Alt+C` (Win) | Copies file path, line range, and code block |

Both commands are also available via the **right-click context menu** when text is selected.

---

## Usage Examples

### Example 1: Copy Path Only

Select lines 37-42 in `src/utils/helper.py` and press `Alt+Shift+C`:

**Clipboard result:**
```
src/utils/helper.py:37-42
```

### Example 2: Copy Path and Code

Select the same lines and press `Cmd+Shift+Alt+C`:

**Clipboard result:**
````
src/utils/helper.py:37-42
```python
def calculate_total(items):
    total = 0
    for item in items:
        total += item.price
    return total
```
````

### Example 3: Single Line Selection

If you select only line 15 in `src/index.ts`:

**Clipboard result:**
```
src/index.ts:15
```

---

## Installation

### From VSIX (Local Install)

1. Build the extension:
   ```bash
   npm install
   npm run compile
   npx vsce package
   ```

2. Install the generated `.vsix` file:
   - Open VSCode
   - Go to Extensions (`Cmd+Shift+X`)
   - Click `...` menu → "Install from VSIX..."
   - Select the `.vsix` file

### For Development

1. Clone this repository
2. Run `npm install`
3. Press `F5` to launch Extension Development Host
4. Test the extension in the new VSCode window

---

## Commands

| Command | Title |
|---------|-------|
| `smartCodeCopy.copyPath` | Smart Copy: Copy Path Only |
| `smartCodeCopy.copyWithCode` | Smart Copy: Copy Path and Code |

---

## Supported Languages

The extension automatically detects the file type and applies the appropriate language tag for Markdown code blocks:

- TypeScript / JavaScript
- Python
- Go, Rust, Java, Kotlin
- C, C++, C#
- HTML, CSS, SCSS
- JSON, YAML, XML
- Bash, PowerShell
- And many more...

---

## Why Use This Extension?

- **Quick code references**: Easily share specific code locations with teammates
- **CLI-friendly format**: Output format works great with grep, git, and other CLI tools
- **Markdown-ready**: Code blocks are properly formatted for GitHub, Notion, Slack, etc.
- **Context preserved**: Always know exactly where the code came from

---

## License

MIT
