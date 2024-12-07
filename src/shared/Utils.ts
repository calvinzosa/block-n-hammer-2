import { RunService } from '@rbxts/services';

export const rng = new Random(os.clock());

export function to2D(object: Vector3) {
	return new Vector2(object.X, object.Y);
}

export function to3D(object: Vector2, z = 0) {
	return new Vector3(object.X, object.Y, z);
}

export function toUDim2(point: Vector2, method = 'Offset' as 'Scale' | 'Offset') {
	return UDim2[`from${method}`](point.X, point.Y);
}

/**
 * @returns radians
 */
export function directionTo(from: { X: number, Y: number }, to: { X: number, Y: number }) {
	return math.atan2(to.Y - from.Y, to.X - from.X);
}

/**
 * @returns meters
 */
export function studsToMeters(studs: number) {
	return studs * 0.28;
}

/**
 * @returns studs
 */
export function metersToStuds(meters: number) {
	return meters / 0.28;
}

export function lerp(a: number, b: number, t: number, clampT: boolean = true) {
	if (clampT) {
		t = math.clamp(t, 0, 1);
	}
	
	return a + (b - a) * t;
}

/**
 * @returns clamped `point` inside circle at `target` with `radius`
 */
export function clampAroundRadius2D(point: Vector2, target: Vector2, radius: number) {
	const displacement = point.sub(target);
	const distance = displacement.Magnitude;
	
	if (distance < radius) {
		return $tuple(point, false);
	}
	
	const invDistance = 1 / distance;
	
	const clampedPoint = new Vector2(
		target.X + displacement.X * invDistance * radius,
		target.Y + displacement.Y * invDistance * radius,
	);
	
	return $tuple(clampedPoint, true);
}

/**
 * @returns clamped `point` inside circle at `target` with `radius`
 */
export function clampAroundRadius3D(point: Vector3, target: Vector3, radius: number) {
	const displacement = point.sub(target);
	const distance = displacement.Magnitude;
	
	if (distance < radius) {
		return $tuple(point, false);
	}
	
	const invDistance = 1 / distance;
	
	const clampedPoint = new Vector3(
		target.X + displacement.X * invDistance * radius,
		target.Y + displacement.Y * invDistance * radius,
		target.Z + displacement.Z * invDistance * radius,
	);
	
	return $tuple(clampedPoint, true);
}

/**
 * @returns `UIScale` scale property
 */
export function calculateGuiScale(resolution: Vector2) {
	const minAxis = 480;
	const maxAxis = 1920;
	
	const scaleMin = 0.25;
	const scaleMax = 1;
	
	const scale = math.clamp(scaleMin + ((math.max(resolution.X, resolution.Y) - minAxis) / (maxAxis - minAxis)) * (scaleMax - scaleMin), scaleMin, scaleMax);
	
	return scale;
}

/**
 * wait a single `RenderStepped` frame
 * # cannot be used on server
 */
export function waitForRenderFrame() {
	if (RunService.IsServer()) {
		throw 'waitForRenderFrame cannot be used on the server!';
	}
	
	RunService.RenderStepped.Wait();
}

/**
 * waits a single `Stepped` (physics) frame
 */
export function waitForPhysicsUpdate() {
	RunService.Stepped.Wait();
}

// why does the `never` just not work??
type EventsList<T> = {
	[K in keyof T]?: T[K] extends RBXScriptSignal<infer C> ? (...args: Parameters<C>) => void : never;
};

/**
 * connects multiple event callbacks to multiple objects
 */
export function onEvent<T extends Instance>(instance: T, events: EventsList<T>, method: keyof RBXScriptSignal = 'Connect') {
	for (const [event, handler] of pairs(events)) {
		(instance[event as keyof T] as RBXScriptSignal)[method](handler as Callback);
	}
}
