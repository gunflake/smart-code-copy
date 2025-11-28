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
 * 확장 프로그램 활성화 시 호출
 * @param context 확장 프로그램 컨텍스트
 */
export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('smartCodeCopy.copy', async () => {
        const editor = vscode.window.activeTextEditor;

        if (!editor) {
            vscode.window.showWarningMessage('활성 에디터가 없습니다.');
            return;
        }

        const selection = editor.selection;

        if (selection.isEmpty) {
            vscode.window.showWarningMessage('텍스트를 선택해주세요.');
            return;
        }

        const document = editor.document;

        // 워크스페이스 기준 상대 경로 계산
        const relativePath = vscode.workspace.asRelativePath(document.uri, false);

        // 줄 번호 (1-indexed)
        const startLine = selection.start.line + 1;
        const endLine = selection.end.line + 1;

        // 선택한 텍스트
        const selectedText = document.getText(selection);

        // 언어 식별자
        const languageId = getLanguageId(document.fileName);

        // 줄 범위 문자열 생성
        const lineRange = startLine === endLine
            ? `${startLine}`
            : `${startLine}-${endLine}`;

        // 최종 출력 형식
        const output = `${relativePath}:${lineRange}\n\`\`\`${languageId}\n${selectedText}\n\`\`\``;

        // 클립보드에 복사
        await vscode.env.clipboard.writeText(output);
        vscode.window.showInformationMessage(`복사 완료: ${relativePath}:${lineRange}`);
    });

    context.subscriptions.push(disposable);
}

/**
 * 확장 프로그램 비활성화 시 호출
 */
export function deactivate() { }
