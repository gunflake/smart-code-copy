import * as vscode from 'vscode';

/**
 * 파일 확장자에 따른 마크다운 코드 블록 언어 반환
 * @param fileName 파일명
 * @returns 마크다운 언어 식별자
 */
function getLanguageId(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    const languageMap: Record<string, string> = {
        'ts': 'typescript',
        'tsx': 'typescript',
        'js': 'javascript',
        'jsx': 'javascript',
        'py': 'python',
        'rb': 'ruby',
        'java': 'java',
        'kt': 'kotlin',
        'go': 'go',
        'rs': 'rust',
        'c': 'c',
        'cpp': 'cpp',
        'h': 'c',
        'hpp': 'cpp',
        'cs': 'csharp',
        'swift': 'swift',
        'php': 'php',
        'html': 'html',
        'css': 'css',
        'scss': 'scss',
        'sass': 'sass',
        'less': 'less',
        'json': 'json',
        'yaml': 'yaml',
        'yml': 'yaml',
        'xml': 'xml',
        'md': 'markdown',
        'sql': 'sql',
        'sh': 'bash',
        'bash': 'bash',
        'zsh': 'bash',
        'ps1': 'powershell',
        'dockerfile': 'dockerfile',
        'vue': 'vue',
        'svelte': 'svelte',
    };
    return languageMap[ext] || ext;
}

/**
 * 선택 영역 정보 추출
 * @param editor 활성 에디터
 * @returns 경로, 줄 범위, 선택 텍스트, 언어 ID
 */
function getSelectionInfo(editor: vscode.TextEditor) {
    const selection = editor.selection;
    const document = editor.document;

    const relativePath = vscode.workspace.asRelativePath(document.uri, false);
    const startLine = selection.start.line + 1;
    const endLine = selection.end.line + 1;
    const selectedText = document.getText(selection);
    const languageId = getLanguageId(document.fileName);
    const lineRange = startLine === endLine ? `${startLine}` : `${startLine}-${endLine}`;

    return { relativePath, lineRange, selectedText, languageId };
}

/**
 * 확장 프로그램 활성화 시 호출
 * @param context 확장 프로그램 컨텍스트
 */
export function activate(context: vscode.ExtensionContext) {
    // 경로만 복사 (기본)
    const copyPath = vscode.commands.registerCommand('smartCodeCopy.copyPath', async () => {
        const editor = vscode.window.activeTextEditor;

        if (!editor) {
            vscode.window.showWarningMessage('활성 에디터가 없습니다.');
            return;
        }

        if (editor.selection.isEmpty) {
            vscode.window.showWarningMessage('텍스트를 선택해주세요.');
            return;
        }

        const { relativePath, lineRange } = getSelectionInfo(editor);
        const output = `${relativePath}:${lineRange}`;

        await vscode.env.clipboard.writeText(output);
        vscode.window.showInformationMessage(`복사 완료: ${output}`);
    });

    // 경로 + 코드 복사
    const copyWithCode = vscode.commands.registerCommand('smartCodeCopy.copyWithCode', async () => {
        const editor = vscode.window.activeTextEditor;

        if (!editor) {
            vscode.window.showWarningMessage('활성 에디터가 없습니다.');
            return;
        }

        if (editor.selection.isEmpty) {
            vscode.window.showWarningMessage('텍스트를 선택해주세요.');
            return;
        }

        const { relativePath, lineRange, selectedText, languageId } = getSelectionInfo(editor);
        const output = `${relativePath}:${lineRange}\n\`\`\`${languageId}\n${selectedText}\n\`\`\``;

        await vscode.env.clipboard.writeText(output);
        vscode.window.showInformationMessage(`복사 완료: ${relativePath}:${lineRange}`);
    });

    context.subscriptions.push(copyPath, copyWithCode);
}

/**
 * 확장 프로그램 비활성화 시 호출
 */
export function deactivate() { }
