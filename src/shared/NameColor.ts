// slightly modified from https://github.com/RyloRiz/rblx-name-color/blob/main/scripts/generator.ts

function CHAT_COLORS_BY_VERSION_FN() {
	let fakePersimmon = Color3.fromRGB(253, 41, 67);
	let fakeCyan = Color3.fromRGB(1, 162, 255);
	let fakeDarkGreen = Color3.fromRGB(2, 184, 87);
	let brightViolet = Color3.fromRGB(107, 50, 124)
	
	let t = [
		[
			Color3.fromRGB(196, 40, 28),
			Color3.fromRGB(13, 105, 172),
			Color3.fromRGB(39, 70, 45),
			brightViolet
		],
		[
			fakePersimmon,
			fakeCyan,
			fakeDarkGreen,
			brightViolet
		],
		[
			fakePersimmon,
			fakeCyan,
			fakeDarkGreen,
			Color3.fromRGB(180, 128, 255) // Alder
		]
	];
	
	let unchangedColors = [
		Color3.fromRGB(218, 133, 65), // Bright orange
		Color3.fromRGB(245, 205, 48), // Bright yellow
		Color3.fromRGB(232, 186, 200), // Light reddish violet
		Color3.fromRGB(215, 197, 154), // Brick yellow
	];
	
	function move(src: unknown[], a: number, b: number, t: number, dist: any[]) {
		// dist[t], ... = src[a], ..., src[b]
		for (let i = 0; i <= b - a; i++) {
			let srcElement = src[i + a];
			let distIdx = t + i;
			// console.log(a, i, b, t, srcElement, distIdx);
			dist[distIdx] = srcElement;
		}
		return dist;
	}
	
	// for (let i = 0; i < t.size(); i++) {
	for (const i of $range(0, t.size() - 1)) {
		let colors = t[i];
		t[i] = move(unchangedColors, 0, unchangedColors.size() - 1, colors.size(), colors);
	}
	
	table.freeze(t);
	
	return t;
}

let CHAT_COLORS_BY_VERSION = CHAT_COLORS_BY_VERSION_FN();

function ComputeNameValue(username: string) {
	let value = 0;
	
	// for (let index = 0; index <= username.size() - 1; index++) {
	for (const index of $range(0, username.size() - 1)) {
		const cVal = username.sub(index + 1, index + 2)
		let [cValue] = string.byte(cVal.sub(1, 1));
		let reverseIndex = username.size() - index;
		
		if (username.size() % 2 === 1) {
			reverseIndex -= 1;
		}
		
		if (reverseIndex % 4 >= 2) {
			cValue = -cValue;
		}
		
		value += cValue;
	}
	
	return value;
}

function GetNameColor(username: string, version_?: number) {
	let chatColors = CHAT_COLORS_BY_VERSION[(version_ ?? CHAT_COLORS_BY_VERSION.size()) - 1];
	// let value = (ComputeNameValue(username) % chatColors.length); // +1 removed for TS-Lua indices conflict
	let cmv = ComputeNameValue(username);
	let len = chatColors.size();
	let value = cmv - math.floor(cmv / len) * len // Removed cmv % len, the modulus operator is different in Lua when working with negative numbers
	// console.log(cmv, len, value);
	return chatColors[value];
}

export default GetNameColor;
