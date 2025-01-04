import {
	Players,
	ReplicatedStorage,
	UserInputService,
	Workspace,
} from '@rbxts/services';

import CameraController from './Camera';
// import { HudGui } from './archive/GuiHandler';
import * as Effects from './Effects';
import Vars from './Variables';

import { directionTo, studsToMeters, to2D, to3D, clampAroundRadius2D } from 'shared/Utils';
import { Infinity, PI, setTimeout, toFixed } from 'shared/JS';
import Events from 'shared/Events';
import { CubeModel, CubeHammer, CubePart } from 'shared/Types/CubeModel';
import { $print } from 'rbxts-transform-debug';
import { guiProducer } from './ui/producer';

const client = Players.LocalPlayer;

const templateCube = ReplicatedStorage.WaitForChild('Cube') as CubeModel;
const mousePlane = Workspace.WaitForChild('MousePlane') as Part;
const cursorDisplay = Workspace.WaitForChild('CursorDisplay') as Part;
const debugFolder = Workspace.WaitForChild('Debug') as Folder;
const mapFolder = Workspace.WaitForChild('Map') as Folder;

const paramsMousePlane = new RaycastParams();
paramsMousePlane.FilterType = Enum.RaycastFilterType.Include;
paramsMousePlane.FilterDescendantsInstances = [mousePlane];

const altitudeStats = new Map<Cube, StringValue>();

let cube: Cube | undefined = undefined;
let voidRespawnDebounce = false;
let headVelocity = Vector3.zero;

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
		destroying: new Array<() => void>(),
	};
	
	public get Position() { return this.cubePart.Position; }
	public set Position(newPosition: Vector3) { this.cubePart.Position = newPosition; }
	
	public get X() { return this.cubePart.Position.X; }
	public get Y() { return this.cubePart.Position.Y; }
	public get Z() { return this.cubePart.Position.Z; }
	
	public get LinearVelocity() { return this.cubePart.AssemblyLinearVelocity; }
	public get AngularVelocity() { return this.cubePart.AssemblyAngularVelocity; }
	
	public get Pivot() { return this.cubeModel.GetPivot(); }
	public set Pivot(newPivot: CFrame) { this.cubeModel.PivotTo(newPivot); }
	
	public get TargetAttachmentCFrame() { return this.cubePart.TargetAttachment.WorldCFrame; }
	public set TargetAttachmentCFrame(cframe: CFrame) { this.cubePart.TargetAttachment.WorldCFrame = cframe; }
	
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
	
	public IsAlive() {
		return this.cubeModel.PrimaryPart !== undefined
			&& this.cubePart.IsDescendantOf(Workspace)
			&& this.hammerHandle.IsDescendantOf(Workspace)
			&& this.hammerHead.IsDescendantOf(Workspace)
			&& this.rootPart.IsDescendantOf(Workspace);
	}
	
	public SetVelocity(linearVelocity: Vector3 = Vector3.zero, angularVelocity: Vector3 = Vector3.zero) {
		this.cubePart.AssemblyLinearVelocity = linearVelocity;
		this.cubePart.AssemblyAngularVelocity = angularVelocity;
	}
	
	public Equals(otherCube: Cube | CubeModel) {
		if (otherCube instanceof Cube) {
			return otherCube.cubeModel === this.cubeModel;
		}
		
		return otherCube === this.cubeModel;
	}
	
	public Destroy() {
		this.cubeModel.Destroy();
	}
	
	public OnDestroying(callback: () => void) {
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
	
	CameraController.Reset(CFrame.lookAlong(cube.Position.add(new Vector3(0, 0, -25)), new Vector3(0, 0, 1)));
	
	const events = new Array<RBXScriptConnection>();
	
	events.push(cube.OnDestroying(() => onDestroyed(events)));
	events.push(cube.hammerHandle.Destroying.Once(() => onDestroyed(events)));
	events.push(cube.hammerHead.Destroying.Once(() => onDestroyed(events)));
	
	cube.hammerHead.Touched.Connect((otherPart) => {
		if (!cube || !otherPart.IsDescendantOf(mapFolder)) {
			return;
		}
		
		const position = cube.hammerHead.Position.sub(headVelocity.Unit);
		const direction = headVelocity.Unit.mul(6);
		
		const params = new RaycastParams();
		params.FilterDescendantsInstances = [mapFolder];
		params.FilterType = Enum.RaycastFilterType.Include;
		
		const result = Workspace.Raycast(position, direction, params);
		
		if (!result) {
			return;
		}
		
		const target = result.Instance;
		
		Effects.hammerHitMaterial(target, target.GetClosestPointOnSurface(position), result.Normal, headVelocity.Magnitude - 10);
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
		if (cube.Equals(otherCube)) {
			altitudeStats.delete(cube);
			break;
		}
	}
});

export function instantRespawn() {
	if (cube) {
		cube.Pivot = templateCube.GetPivot();
		cube.hammer.Head.CFrame = cube.Pivot;
		
		cube.SetVelocity();
		
		return;
	}
	
	Events.DoRespawn.FireServer();
}

export function renderStepped(_dt: number) {
	if (cube?.IsAlive()) {
		mousePlane.Position = cube.Position;
		
		let hammerOffset = Vector2.zero;
		
		const mousePosition = UserInputService.GetMouseLocation();
		const screenPosition = CameraController.ViewportPointToRay(mousePosition);
		
		const result = Workspace.Raycast(screenPosition.Origin, screenPosition.Direction.mul(1024), paramsMousePlane);
		
		const position = result !== undefined ? result.Position : screenPosition.Origin.add(screenPosition.Direction.mul(1024));
		
		const cubePosition = to2D(cube.Position);
		const targetPosition = to2D(position);
		const [headPosition] = clampAroundRadius2D(targetPosition, cubePosition, 12);
		
		hammerOffset = targetPosition.sub(cubePosition);
		
		const offsetRotation = CFrame.fromEulerAngles(PI / 2, PI / 2, 0, Enum.RotationOrder.YXZ);
		
		const actualRotation = directionTo(cubePosition, cube.hammer.Head.Position);
		const cfRotation = CFrame.fromOrientation(0, 0, actualRotation).mul(offsetRotation);
		
		if (!Vars.IsRobloxMenuOpened && !Vars.IsMenuOpened) {
			cube.TargetAttachmentCFrame = new CFrame(to3D(headPosition)).mul(cfRotation);
			
			cursorDisplay.Position = position;
		} else {
			cube.TargetAttachmentCFrame = new CFrame(cube.TargetAttachmentCFrame.Position).mul(cfRotation);
			
			cursorDisplay.Position = cube.hammer.Head.Position;
		}
		
		guiProducer.UpdateHUD(studsToMeters(cube.Y), studsToMeters(cube.LinearVelocity.Magnitude));
		
		const newPosition = cube.Position.add(new Vector3(0, 0, -25)).add(to3D(hammerOffset).div(45));
		
		CameraController.SetTarget(CFrame.lookAlong(newPosition, Vector3.zAxis));
	} else {
		guiProducer.UpdateHUD(-Infinity, -Infinity);
	}
}

export function stepped(_time: number, _dt: number) {
	debugFolder.ClearAllChildren();
	
	if (cube) {
		if (cube.Y < -500 && !voidRespawnDebounce) {
			instantRespawn();
			
			voidRespawnDebounce = true;
			
			setTimeout(() => {
				voidRespawnDebounce = false;
			}, 500);
		}
		
		headVelocity = cube.hammerHead.AssemblyLinearVelocity;
	} else {
		headVelocity = Vector3.zero;
	}
	
	for (const [otherCube, stat] of altitudeStats) {
		if (!otherCube.IsAlive() || !stat.Parent) {
			continue;
		}
		
		if (otherCube.Y) {
			stat.Value = `${toFixed(math.max(studsToMeters(otherCube.Y), 0), 1)}m`;
		} else {
			stat.Value = '--';
		}
	}
}
