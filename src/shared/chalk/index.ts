import { slice } from 'shared/JS';

const unicodeStart = 0xEE00;
let unicodeIndex = unicodeStart;

const styleMap = new Map<string, string>();
const reverseStyleMap = new Map<string, string>();

function getUniqueToken(styles: string[]) {
	const styleKey = styles.sort().join('.');
	
	if (!styleMap.get(styleKey)) {
		const token = utf8.char(unicodeIndex);
		unicodeIndex++;
		
		styleMap.set(styleKey, token);
		reverseStyleMap.set(token, styleKey);
	}
	
	return styleMap.get(styleKey);
}

getUniqueToken([
	'red', 'green', 'blue',
	'bgRed', 'bgGreen', 'bgBlue',
	'bold', 'italic', 'underline', 'strikethrough',
]);

export default function chalk(data: TemplateStringsArray) {
	const text = tostring(data[0]);
	const characters = text.split('');
	
	let parsedText = '';
	let i = 0;
	
	while (i < text.size()) {
		if (characters[i] === '{') {
			const styleStart = i + 2;
			const styleEnd = text.find(' ', styleStart)[0];
			
			if (styleEnd === undefined) throw 'Invalid format: Missing space after styles.';
			
			const styleString = text.sub(styleStart, styleEnd - 1);
			const styles = styleString.split('.');
			
			const textStart = styleEnd + 1;
			const textEnd = text.find('}', textStart)[0];
			
			if (textEnd === undefined) throw 'Invalid format: Missing closing brace.';
			
			const segment = text.sub(textStart, textEnd - 1);
			const token = getUniqueToken(styles);
			
			parsedText += token + segment + token;
			
			i = textEnd;
		} else {
			parsedText += characters[i];
			i++;
		}
	}
	
	return parsedText;
}

export function extractStyles(data: unknown) {
	const styledText = tostring(data);
	
	const startUnicode = 0xEE00;
	const endUnicode = 0xF8FF;
	
	const charCodes = [];
	
	for (const [, charCode] of utf8.codes(styledText)) {
		charCodes.push(charCode);
	}
	
	const length = charCodes.size();
	const output = [];
	
	let index = 0;
	
	while (index < length) {
		const charCode = charCodes[index];
		
		if (charCode >= startUnicode && charCode <= endUnicode) {
			const token = utf8.char(charCode);
			
			let endIndex = index + 1;
			while (endIndex < length && charCodes[endIndex] !== charCode) {
				endIndex++;
			}
			
			if (endIndex < length) {
				const text = utf8.char(...slice(charCodes, index + 1, endIndex));
				const styleKey = reverseStyleMap.get(token);
				
				if (styleKey) {
					output.push({ text, styles: styleKey.split('.') });
				}
				
				index = endIndex + 1;
			} else {
				throw 'Unmatched token found.';
			}
		} else {
			let endIndex = index;
			while (endIndex < length) {
				const nextCharCode = charCodes[endIndex];
				
				if (nextCharCode >= startUnicode && nextCharCode <= endUnicode) break;
				
				endIndex++;
			}
			
			const unstyledText = utf8.char(...slice(charCodes, index, endIndex));
			output.push({ text: unstyledText, styles: [] });
			
			index = endIndex;
		}
	}
	
	return output;
}
