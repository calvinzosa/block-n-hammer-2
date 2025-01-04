import {
	Workspace,
} from '@rbxts/services';

// import { SpeedLinesGui } from './archive/GuiHandler';

import { clampAroundRadius3D, rng, unpackVector3 } from 'shared/Utils';
import Spring from 'shared/Spring';
import 'easing-functions';

export class CameraController {
	public camera: Camera;
	
	private springCameraPosition = new Spring(Vector3.zero, 0.75, 15);
	private springCameraRotation = new Spring(Vector3.zero, 0.75, 25);
	private speedIndex = 0;
	
	private speedImages = [
		'rbxassetid://13484709347',
		'rbxassetid://13484709591',
		'rbxassetid://13484709832',
		'rbxassetid://13484710115',
		'rbxassetid://13484710536',
	];
	
	public get target() {
		return new CFrame(this.springCameraPosition.Target).mul(CFrame.fromOrientation(...unpackVector3(this.springCameraRotation.Target)));
	}
	
	public get position() {
		return this.springCameraPosition.Position;
	}
	
	public get rotation() {
		return this.springCameraRotation.Position;
	}
	
	constructor(camera: Camera) {
		this.camera = camera;
	}
	
	public DoImpulse(position: Vector3, rotation: Vector3 = Vector3.zero) {
		this.springCameraPosition.Impulse(position);
		this.springCameraRotation.Impulse(rotation);
	}
	
	public Shake(magnitude: number) {
		const impulsePosition = rng.NextUnitVector().mul(magnitude);
		const impulseRotation = rng.NextUnitVector().mul(math.log10(magnitude));
		
		this.DoImpulse(impulsePosition, impulseRotation);
	}
	
	public Reset(cframe: CFrame) {
		this.springCameraPosition.Reset(cframe.Position);
		this.springCameraRotation.Reset(new Vector3(...cframe.ToOrientation()));
	}
	
	public SetTarget(cframe: CFrame) {
		this.springCameraPosition.Target = cframe.Position;
		this.springCameraRotation.Target = new Vector3(...cframe.ToOrientation());
	}
	
	public RenderStepped(dt: number) {
		const [clampedPosition, didClamp] = clampAroundRadius3D(this.springCameraPosition.Position, this.springCameraPosition.Target, 15);
		
		if (didClamp) {
			this.springCameraPosition.Position = clampedPosition;
		}
		
		if (this.springCameraPosition.Velocity.Magnitude > 80) {
			this.camera.FieldOfView = 70 + 50 * math.min((this.springCameraPosition.Velocity.Magnitude - 80) / 100, 1);
			
			const speedSize = math.max(200 / this.springCameraPosition.Velocity.Magnitude, 1);
			
			this.speedIndex = (this.speedIndex + 15 * dt) % this.speedImages.size();
			
			// SpeedLinesGui.Image.Size = UDim2.fromScale(speedSize, speedSize);
			// SpeedLinesGui.Image.Image = speedImages[math.floor(speedIndex)];
			// SpeedLinesGui.Image.Visible = true;
		} else {
			// SpeedLinesGui.Image.Visible = false;
			this.camera.FieldOfView = 70;
		}
		
		this.camera.CameraType = Enum.CameraType.Scriptable;
		this.camera.CFrame = CFrame.lookAlong(clampedPosition, new Vector3(0, 0, 1));
	}
	
	public ViewportPointToRay(position: Vector2) {
		return this.camera.ViewportPointToRay(position.X, position.Y);
	}
}

const cameraController = new CameraController(Workspace.CurrentCamera ?? Workspace.WaitForChild('Camera') as Camera);

export default cameraController;
