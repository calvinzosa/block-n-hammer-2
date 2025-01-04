import {
	RunService,
} from '@rbxts/services';

import { setTimeout } from './JS';

export const rng = new Random(os.clock());

export function randomFloat(min: number, max: number) {
	return rng.NextNumber() * (max - min) + min;
}

export function randomInt(min: number, max: number) {
	return rng.NextInteger(min, max);
}

export function randomUnitVector() {
	return rng.NextUnitVector();
}

export function randomVector(min: Vector3, max: Vector3, float: boolean = true) {
	const func = float ? randomFloat : randomInt;
	
	if (!float) {
		min = min.Floor();
		max = max.Floor();
	}
	
	return new Vector3(func(min.X, max.X), func(min.Y, max.Y), func(min.Z, max.Z));
}

export function to2D(object: Vector3) {
	return new Vector2(object.X, object.Y);
}

export function to3D(object: Vector2, z = 0) {
	return new Vector3(object.X, object.Y, z);
}

export function unpackVector3(object: Vector3) {
	return [object.X, object.Y, object.Z] as [number, number, number];
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

export function roundToDecimal(x: number, decimalPlaces: number) {
	const value = 10 ** decimalPlaces;
	
	return math.round(x * value) / value;
}

export function roundToNearestMultiple(x: number, multipleOf: number) {
	return math.round(x / multipleOf) * multipleOf;
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
	const minWidth = 1054;
	const maxWidth = 1920;
	const minScale = 0.6;
	const maxScale = 1;
	
	const t = math.clamp((resolution.X - minWidth) / (maxWidth - minWidth), 0, 1);
	
	return t * (maxScale - minScale) + minScale;
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

export function getChildrenAdded(instance: Instance, callback: (child: Instance) => void) {
	for (const child of instance.GetChildren()) {
		callback(child);
	}
	
	const connection = instance.ChildAdded.Connect(callback);
	
	return connection;
}

export function destroyAfter(instance: Instance | Array<Instance>, ms: number) {
	setTimeout(() => {
		if (typeIs(instance, 'Instance')) {
			instance.Destroy();
		} else {
			for (const inst of instance) {
				inst.Destroy();
			}
		}
	}, ms);
}
