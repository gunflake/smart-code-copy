# Smart Code Copy - VSCode 확장 프로그램 개발 계획

## 개요
선택한 코드 영역을 `파일경로:시작줄-끝줄` 형식으로 클립보드에 복사하는 VSCode 확장 프로그램

### 출력 형식 예시
```
src/utils/test.py:37-42
```python
<선택한 코드 내용>
```
```

---

## 개발 단계

### 1단계: 프로젝트 초기화
- [ ] Node.js 및 npm 설치 확인
- [ ] Yeoman과 VS Code Extension Generator 설치
  ```bash
  npm install -g yo generator-code
  ```
- [ ] 확장 프로그램 프로젝트 생성
  ```bash
  yo code
  ```
  - **Type**: TypeScript
  - **Name**: smart-code-copy
  - **Identifier**: smart-code-copy
  - **Description**: 코드 선택 영역을 파일 경로와 줄 번호와 함께 복사

### 2단계: 핵심 기능 구현
- [ ] `src/extension.ts`에 확장 기능 구현
  - 활성 에디터에서 선택 영역 가져오기
  - 워크스페이스 루트 기준 상대 경로 계산
  - 시작/끝 줄 번호 추출
  - 형식화된 문자열 생성
  - 클립보드에 복사

### 3단계: package.json 설정
- [ ] 커맨드 등록: `smartCodeCopy.copy`
- [ ] 키보드 단축키 설정 (예: `Ctrl+Shift+C` / `Cmd+Shift+C`)
- [ ] 컨텍스트 메뉴 등록 (우클릭 메뉴)

### 4단계: 테스트 및 디버깅
- [ ] F5로 Extension Development Host 실행
- [ ] 다양한 파일/폴더에서 기능 테스트
- [ ] 엣지 케이스 처리 (단일 줄 선택, 선택 없음 등)

### 5단계: 배포 (선택사항)
- [ ] vsce 설치: `npm install -g @vscode/vsce`
- [ ] VSIX 패키지 생성: `vsce package`
- [ ] Marketplace 배포 또는 로컬 설치

---

## 핵심 코드 구조

```typescript
// src/extension.ts
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('smartCodeCopy.copy', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showWarningMessage('활성 에디터가 없습니다.');
      return;
    }

    const selection = editor.selection;
    const document = editor.document;
    
    // 워크스페이스 기준 상대 경로
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
    const relativePath = workspaceFolder 
      ? vscode.workspace.asRelativePath(document.uri)
      : document.fileName;
    
    // 줄 번호 (1-indexed)
    const startLine = selection.start.line + 1;
    const endLine = selection.end.line + 1;
    
    // 선택한 텍스트
    const selectedText = document.getText(selection);
    
    // 형식화된 출력
    const lineRange = startLine === endLine 
      ? `${startLine}` 
      : `${startLine}-${endLine}`;
    
    const output = `${relativePath}:${lineRange}\n\`\`\`\n${selectedText}\n\`\`\``;
    
    // 클립보드에 복사
    await vscode.env.clipboard.writeText(output);
    vscode.window.showInformationMessage('코드가 복사되었습니다!');
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
```

---

## package.json 주요 설정

```json
{
  "contributes": {
    "commands": [
      {
        "command": "smartCodeCopy.copy",
        "title": "Smart Copy: 경로와 줄 번호 포함 복사"
      }
    ],
    "keybindings": [
      {
        "command": "smartCodeCopy.copy",
        "key": "ctrl+shift+c",
        "mac": "cmd+shift+c",
        "when": "editorTextFocus && editorHasSelection"
      }
    ],
    "menus": {
      "editor/context": [
        {
          "command": "smartCodeCopy.copy",
          "when": "editorHasSelection",
          "group": "9_cutcopypaste"
        }
      ]
    }
  }
}
```

---

## 추가 고려사항
- **언어별 코드 블록**: 파일 확장자에 따라 마크다운 코드 블록 언어 자동 지정
- **설정 옵션**: 출력 형식 커스터마이징 (경로만, 코드만, 전체 등)
- **다중 선택 지원**: 여러 영역 선택 시 처리
