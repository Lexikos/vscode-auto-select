import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	
	vscode.languages.getLanguages().then(langs => {
		if (!(langs.includes('ahk') && langs.includes('ahk2'))) {
			vscode.window.showErrorMessage("This extension won't do anything useful unless language extensions are installed for both 'ahk' and 'ahk2'. One or both of these were not found.");
		}
	});
	
	// The simple checks we're performing should typically either find a match close
	// to the top of the file or find no match, so limit the search as below.
	const linesToScan = 50;
	
	const seen = new Set<vscode.Uri>();
	const switched = new Set<vscode.Uri>();

	function tryGetRequires(doc : vscode.TextDocument) : number | undefined {
		let text = doc.getText(new vscode.Range(0, 0, linesToScan, 0));
		// Like the launcher, this doesn't exclude directives found inside block comments
		// or continuation sections (which have different rules between v1 and v2 anyway).
		// If the directive is present, the first apparent match found is used.
		const req = text.match(/^[ \t]*#Requires[ \t]+AutoHotkey[ \t]v(1|2)\b/im);
		return req ? Number.parseInt(req[1]) : undefined;
	}

	function onSwitchFile(ed : vscode.TextEditor | undefined) {
		if (!ed || !/^ahk2?$/.test(ed.document.languageId)) {
			return;
		}
		if (seen.has(ed.document.uri)) {
			return;
		}
		console.log('Checking version of ' + ed.document.fileName);
		seen.add(ed.document.uri);
		const v = tryGetRequires(ed.document);
		if (v) {
			switchLang(ed.document, ['ahk', 'ahk2'][v-1], 'Found #Requires v' + v);
		} else {
			console.log('No #Requires directive');
		}
	}

	function onDiagsChange(event : vscode.DiagnosticChangeEvent) {
		for (const uri of event.uris) {
			const uriString = uri.toString();
			const diags = vscode.languages.getDiagnostics(uri);
			for (const diag of diags) {
				if (diag.message.includes(" v1 ")) {
					const ed = vscode.window.visibleTextEditors.find(
						ed => ed.document.uri.toString() === uriString
							&& ed.document.languageId === "ahk2");
					if (ed) {
						switchLang(ed.document, 'ahk', 'ahk2 lsp thinks this is a v1 script');
					}
				}
			}
		}
	}
	
	function switchLang(doc : vscode.TextDocument, lang : string, reason : string) {
		if (doc.languageId === lang) {
			console.log(`${reason}; but language is already ${lang}.`);
			switched.add(doc.uri);
			return;
		}
		if (switched.has(doc.uri)) {
			// Refuse to switch automatically more than once, to be safe.
			console.log(`${reason}; but we've already switch once, so not trying again.`);
			return;
		}
		switched.add(doc.uri);
		console.log(`${reason}; switching to ${lang}.`);
		vscode.languages.setTextDocumentLanguage(doc, lang)
			.then(
				(doc) => {
					vscode.window.showInformationMessage(`${reason}; switched to ${lang}.`);
				},
				(reason) => {
					vscode.window.showErrorMessage(`Failed switch - ${reason.message}`);
				}
			);
	}

	vscode.window.onDidChangeActiveTextEditor(onSwitchFile, null, context.subscriptions);
	vscode.languages.onDidChangeDiagnostics(onDiagsChange, null, context.subscriptions);
	onSwitchFile(vscode.window.activeTextEditor);
}

export function deactivate() {}

