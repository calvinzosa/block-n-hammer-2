import {
	Players,
	RunService,
} from '@rbxts/services';

const client = Players.LocalPlayer;

/** `π` ≈ `3.1415` */
export const PI = math.pi;
/** `τ` = `2π` */
export const TAU = (2 * math.pi);
/** `Φ` = `(1 + √5) / 2` */
export const PHI = ((1 + math.sqrt(5)) / 2);
/** `∞` */
export const Infinity = math.huge;
/** `NaN` */
export const NaN = 0 / 0;

export const console = {
	log(...data: Array<unknown>) {
		print(console.timestampNow(), ...data);
	},
	warn(...data: Array<unknown>) {
		warn(console.timestampNow(), ...data);
	},
	debug(...data: Array<unknown>) {
		if (!RunService.IsStudio()) {
			return;
		}
		
		warn(console.timestampNow(), ...data);
	},
	error(message: unknown) {
		throw message;
	},
	assert(condition: boolean, message: unknown) {
		if (!condition) {
			throw message;
		}
	},
	table(tableData: Record<any, any>) {
		print(tableData);
	},
	timestampNow() {
		const currentTime = DateTime.now();
		
		return `[${currentTime.FormatLocalTime('LTS', client !== undefined ? client.LocaleId : 'en-us')}]`;
	},
};

export function slice<T extends defined>(arr: Array<T>, from: number, to: number) {
	const output = [] as Array<T>;
	
	for (const i of $range(from, to - 1)) {
		output.push(arr[i]);
	}
	
	return output;
}

/**
 * @returns `true` if number is `nan`, otherwise `false`
 */
export function isNaN(number: number) {
	return number !== number;
}

/**
 * @returns short for `string.format('%.(D)f', N)`
 */
export function toFixed(number: number, decimals: number) {
	return `%.${decimals}f`.format(number);
}
