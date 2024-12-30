import {
	Workspace,
} from '@rbxts/services';

// import { SpeedLinesGui } from './archive/GuiHandler';

import { clampAroundRadius3D, rng } from 'shared/Utils';
import Spring from 'shared/Spring';
import 'easing-functions';

export const camera = Workspace.CurrentCamera ?? Workspace.WaitForChild('Camera') as Camera;

let speedIndex = 0;

const speedImages = [
	'rbxassetid://13484709347',
	'rbxassetid://13484709591',
	'rbxassetid://13484709832',
	'rbxassetid://13484710115',
	'rbxassetid://13484710536',
];

const springCameraPosition = new Spring(Vector3.zero, 0.75, 15);
const springCameraRotation = new Spring(Vector3.zero, 0.75, 25);

export function setTarget(cf: CFrame) {
	springCameraPosition.Target = cf.Position;
	springCameraRotation.Target = new Vector3(...cf.ToOrientation());
}

export function setPosition(cf: CFrame, reset: boolean = false) {
	if (reset) {
		springCameraPosition.Reset(cf.Position);
		springCameraRotation.Reset(new Vector3(...cf.ToOrientation()));
	} else {
		springCameraPosition.Position = cf.Position;
		springCameraRotation.Position = new Vector3(...cf.ToOrientation());
	}
}

export function doImpulse(position: Vector3, rotation: Vector3 = Vector3.zero) {
	springCameraPosition.Impulse(position);
	springCameraRotation.Impulse(rotation);
}

export function shakeCamera(magnitude: number) {
	const impulsePosition = rng.NextUnitVector().mul(magnitude);
	const impulseRotation = rng.NextUnitVector().mul(math.log10(magnitude));
	
	doImpulse(impulsePosition, impulseRotation);
}

export function renderStepped(dt: number) {
	const [clampedPosition, didClamp] = clampAroundRadius3D(springCameraPosition.Position, springCameraPosition.Target, 15);
	if (didClamp) {
		springCameraPosition.Position = clampedPosition;
	}
	
	if (springCameraPosition.Velocity.Magnitude > 80) {
		camera.FieldOfView = 70 + 50 * math.min((springCameraPosition.Velocity.Magnitude - 80) / 100, 1);
		
		const speedSize = math.max(200 / springCameraPosition.Velocity.Magnitude, 1);
		
		speedIndex = (speedIndex + 15 * dt) % speedImages.size();
		
		// SpeedLinesGui.Image.Size = UDim2.fromScale(speedSize, speedSize);
		// SpeedLinesGui.Image.Image = speedImages[math.floor(speedIndex)];
		// SpeedLinesGui.Image.Visible = true;
	} else {
		// SpeedLinesGui.Image.Visible = false;
		camera.FieldOfView = 70;
	}
	
	camera.CameraType = Enum.CameraType.Scriptable;
	camera.CFrame = CFrame.lookAlong(clampedPosition, new Vector3(0, 0, 1));
}
