import {
	Players,
	ReplicatedStorage,
	UserInputService,
	Workspace,
} from '@rbxts/services';

import { camera, setPosition, setTarget } from './Camera';
// import { HudGui } from './archive/GuiHandler';
import * as Effects from './Effects';
import Vars from './Variables';

import { directionTo, studsToMeters, to2D, to3D, clampAroundRadius2D } from 'shared/Utils';
import { PI, setTimeout, toFixed } from 'shared/JS';
import Events from 'shared/Events';
import { CubeModel, CubeHammer, CubePart } from 'shared/Types/CubeModel';

const client = Players.LocalPlayer;

const templateCube = ReplicatedStorage.WaitForChild('Cube') as CubeModel;
const mousePlane = Workspace.WaitForChild('MousePlane') as Part;
const cursorDisplay = Workspace.WaitForChild('CursorDisplay') as Part;
const mapFolder = Workspace.WaitForChild('Map') as Folder;

const paramsMousePlane = new RaycastParams();
paramsMousePlane.FilterType = Enum.RaycastFilterType.Include;
paramsMousePlane.FilterDescendantsInstances = [mousePlane];

const altitudeStats = new Map<Cube, StringValue>();

let cube: Cube | undefined = undefined;
let voidRespawnDebounce = false;

function onDestroyed(events: Array<RBXScriptConnection>) {
	cube = undefined;
	
	for (const event of events) {
		event.Disconnect();
	}
	
	Events.DoRespawn.FireServer();
}

export class Cube {
	public cubeModel: CubeModel;
	public rootPart: Part;
	public cubePart: CubePart;
	public hammer: CubeHammer;
	public hammerHead: Part;
	public hammerHandle: Part;
	public player: Player;
	
	private events = {
		destroying: [] as Array<() => void>,
	};
	
	public get position() { return this.cubePart.Position; }
	public set position(newPosition: Vector3) { this.cubePart.Position = newPosition; }
	
	public get x() { return this.cubePart.Position.X; }
	public get y() { return this.cubePart.Position.Y; }
	public get z() { return this.cubePart.Position.Z; }
	
	public get linearVelocity() { return this.cubePart.AssemblyLinearVelocity; }
	public get angularVelocity() { return this.cubePart.AssemblyAngularVelocity; }
	
	public get pivot() { return this.cubeModel.GetPivot(); }
	public set pivot(newPivot: CFrame) { this.cubeModel.PivotTo(newPivot); }
	
	public get targetAttachmentCFrame() { return this.cubePart.TargetAttachment.WorldCFrame; }
	public set targetAttachmentCFrame(cframe: CFrame) { this.cubePart.TargetAttachment.WorldCFrame = cframe; }
	
	constructor(cubeModel: CubeModel, player: Player) {
		this.cubeModel = cubeModel;
		this.rootPart = cubeModel.WaitForChild('HumanoidRootPart') as Part;
		this.cubePart = cubeModel.WaitForChild('Cube') as CubePart;
		this.hammer = cubeModel.WaitForChild('Hammer') as CubeHammer;
		this.hammerHead = this.hammer.WaitForChild('Head') as Part;
		this.hammerHandle = this.hammer.WaitForChild('Handle') as Part;
		this.player = player;
		
		cubeModel.Destroying.Connect(() => {
			for (const event of this.events.destroying) {
				event();
			}
		});
	}
	
	public isAlive() {
		return this.cubeModel.PrimaryPart !== undefined
			&& this.cubePart.IsDescendantOf(Workspace)
			&& this.hammerHandle.IsDescendantOf(Workspace)
			&& this.hammerHead.IsDescendantOf(Workspace)
			&& this.rootPart.IsDescendantOf(Workspace);
	}
	
	public setVelocity(linearVelocity: Vector3 = Vector3.zero, angularVelocity: Vector3 = Vector3.zero) {
		this.cubePart.AssemblyLinearVelocity = linearVelocity;
		this.cubePart.AssemblyAngularVelocity = angularVelocity;
	}
	
	public equals(otherCube: Cube | CubeModel) {
		if (otherCube instanceof Cube) {
			return otherCube.cubeModel === this.cubeModel;
		}
		
		return otherCube === this.cubeModel;
	}
	
	public destroy() {
		this.cubeModel.Destroy();
	}
	
	public onDestroying(callback: () => void) {
		const { events } = this;
		events.destroying.push(callback);
		
		return {
			Connected: true,
			Disconnect(this: RBXScriptConnection) {
				const i = events.destroying.findIndex((v) => v === callback);
				
				if (i !== -1) {
					events.destroying.remove(i);
				}
			},
		} as RBXScriptConnection;
	}
}

Events.OnRespawned.OnClientEvent.Connect((otherCube) => {
	cube = new Cube(otherCube, client);
	
	setPosition(CFrame.lookAlong(cube.position.add(new Vector3(0, 0, -25)), new Vector3(0, 0, 1)), true);
	
	const events: Array<RBXScriptConnection> = [];
	
	events.push(cube.onDestroying(() => onDestroyed(events)));
	events.push(cube.hammer.Handle.Destroying.Once(() => onDestroyed(events)));
	events.push(cube.hammer.Head.Destroying.Once(() => onDestroyed(events)));
	
	const hammerHead = cube.hammer.Head;
	
	hammerHead.Touched.Connect((otherPart) => {
		if (otherPart.IsDescendantOf(mapFolder)) {
			const strength = hammerHead.AssemblyLinearVelocity.Magnitude - 20;
			
			if (strength > 0) {
				const point = otherPart.GetClosestPointOnSurface(hammerHead.Position);
				const direction = hammerHead.AssemblyLinearVelocity.Unit;
				
				Effects.hammerHitMaterial(otherPart.Material, point, direction, strength);
			}
		}
	});
});

Events.CubeSpawned.OnClientEvent.Connect((otherCube, player) => {
	const leaderstats = player?.WaitForChild('leaderstats', 120);
	const altitudeStat = leaderstats?.WaitForChild('Altitude', 120);
	
	if (altitudeStat?.IsA('StringValue')) {
		altitudeStats.set(new Cube(otherCube, player), altitudeStat);
	}
});

Events.CubeDestroying.OnClientEvent.Connect((otherCube) => {
	for (const [cube] of altitudeStats) {
		if (cube.equals(otherCube)) {
			altitudeStats.delete(cube);
			break;
		}
	}
});

export function instantRespawn() {
	if (cube) {
		cube.pivot = templateCube.GetPivot();
		cube.hammer.Head.CFrame = cube.pivot;
		
		cube.setVelocity();
		
		return;
	}
	
	Events.DoRespawn.FireServer();
}

export function renderStepped(_dt: number) {
	if (cube?.isAlive()) {
		mousePlane.Position = cube.position;
		
		let hammerOffset = Vector2.zero;
		
		const mousePosition = UserInputService.GetMouseLocation();
		const screenPosition = camera.ViewportPointToRay(mousePosition.X, mousePosition.Y);
		
		const result = Workspace.Raycast(screenPosition.Origin, screenPosition.Direction.mul(1024), paramsMousePlane);
		
		const position = result !== undefined ? result.Position : screenPosition.Origin.add(screenPosition.Direction.mul(1024));
		
		const cubePosition = to2D(cube.position);
		const targetPosition = to2D(position);
		const [headPosition] = clampAroundRadius2D(targetPosition, cubePosition, 12);
		
		hammerOffset = targetPosition.sub(cubePosition);
		
		const offsetRotation = CFrame.fromEulerAngles(PI / 2, PI / 2, 0, Enum.RotationOrder.YXZ);
		
		const actualRotation = directionTo(cubePosition, cube.hammer.Head.Position);
		const cfRotation = CFrame.fromOrientation(0, 0, actualRotation).mul(offsetRotation);
		
		if (!Vars.IsRobloxMenuOpened && !Vars.IsMenuOpened) {
			cube.targetAttachmentCFrame = new CFrame(to3D(headPosition)).mul(cfRotation);
			
			cursorDisplay.Position = position;
		} else {
			cube.targetAttachmentCFrame = new CFrame(cube.targetAttachmentCFrame.Position).mul(cfRotation);
			
			cursorDisplay.Position = cube.hammer.Head.Position;
		}
		
		// HudGui.HUD.Altitude.Text = `${toFixed(studsToMeters(cube.y), 1)}m`;
		// HudGui.HUD.Speedometer.Text = `${toFixed(studsToMeters(cube.linearVelocity.Magnitude), 1)}m/s`;
		
		setTarget(CFrame.lookAlong(cube.position.add(new Vector3(0, 0, -25)).add(to3D(hammerOffset).div(45)), new Vector3(0, 0, 1)));
	} else {
		// HudGui.HUD.Altitude.Text = '?.?m';
		// HudGui.HUD.Speedometer.Text = '?.?m/s';
	}
}

export function stepped(_time: number, _dt: number) {
	if (cube) {
		if (cube.y < -500 && !voidRespawnDebounce) {
			instantRespawn();
			
			voidRespawnDebounce = true;
			
			setTimeout(() => {
				voidRespawnDebounce = false;
			}, 500);
		}
	}
	
	for (const [otherCube, stat] of altitudeStats) {
		if (!otherCube.isAlive() || !stat.Parent) {
			continue;
		}
		
		if (otherCube.y) {
			stat.Value = `${toFixed(math.max(studsToMeters(otherCube.y), 0), 1)}m`;
		} else {
			stat.Value = '--';
		}
	}
}
