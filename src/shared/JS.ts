/** `π` */
export const PI = math.pi;
/** `2π` */
export const TAU = 2 * math.pi;
/** `(1 + √5) / 2` (Golden Ratio) */
export const PHI = (1 + math.sqrt(5)) / 2;
export const Infinity = math.huge;
export const NaN = 0 / 0;

/**
 * if `to === -1`, then `to = arr.size()`
 * @returns `Array` containing items `T` from index `from` until, but not including, index `to`
 */
export function slice<T extends defined>(arr: Array<T>, from: number, to: number) {
	if (to === -1) {
		to = arr.size();
	}
	
	const output = new Array<T>();
	
	for (const i of $range(from, to - 1)) {
		output.push(arr[i]);
	}
	
	return output;
}

/**
 * @returns `true` if `value` is `nan`, otherwise `false`
 */
export function isNaN(value: number | Vector3 | Vector2) {
	if (typeIs(value, 'number')) {
		return value !== value;
	} else if (typeIs(value, 'Vector3')) {
		return value.X !== value.X || value.Y !== value.Y || value.Z !== value.Z;
	} else if (typeIs(value, 'Vector2')) {
		return value.X !== value.X || value.Y !== value.Y;
	}
	
	throw `unknown type: ${typeOf(value)}`;
}

/**
 * @returns `true` if number is `Infinity`, otherwise `false`
 */
export function isInfinity(number: number) {
	return number === Infinity;
}

/**
 * @returns `string.format('%.[D]f', [N])`
 */
export function toFixed(number: number, decimals: number) {
	let formattedString = `%.${decimals}f`.format(number);
	
	if (formattedString === `-0.${'0'.rep(decimals)}`) {
		formattedString = formattedString.sub(2);
	}
	
	return formattedString;
}

export function setTimeout(callback: () => void, ms: number) {
	let stopped = false;
	
	const thread = task.delay(ms / 1_000, () => {
		if (!stopped) callback();
	});
	
	return () => {
		task.cancel(thread);
		stopped = true;
	}
}

export function setInterval(callback: (calls: number) => void, ms: number, callInitially: boolean = false) {
	let thread: thread;
	let stopped = false;
	let calls = 0;
	let checks = 0;
	
	const func = () => {
		if (stopped) {
			return;
		}
		
		if (checks > 0 || callInitially) {
			callback(calls);
			
			calls++;
		}
		
		checks++;
		thread = task.delay(ms / 1_000, func);
	}
	
	func();
	
	return () => {
		task.cancel(thread);
		stopped = true;
	}
}
