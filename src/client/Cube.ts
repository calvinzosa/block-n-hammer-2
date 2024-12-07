import {
	Players,
	ReplicatedStorage,
	UserInputService,
	Workspace,
} from '@rbxts/services';

import { camera, setPosition, setTarget } from './Camera';
import { HudGui } from './GuiHandler';
import Vars from './Variables';

import { directionTo, studsToMeters, to2D, to3D, clampAroundRadius2D, onEvent } from 'shared/Utils';
import { PI, toFixed } from 'shared/JS';
import Events from 'shared/Events';
import CubeModel from 'shared/Types/CubeModel';

const templateCube = ReplicatedStorage.WaitForChild('Cube') as CubeModel;
const mousePlane = Workspace.WaitForChild('MousePlane') as Part;
const cursorDisplay = Workspace.WaitForChild('CursorDisplay') as Part;

const paramsMousePlane = new RaycastParams();
paramsMousePlane.FilterType = Enum.RaycastFilterType.Include;
paramsMousePlane.FilterDescendantsInstances = [mousePlane];

const altitudeStats = new Map<CubeModel, StringValue>();

let cube: CubeModel | undefined = undefined;
let voidRespawnDebounce = false;

function onDestroyed(events: RBXScriptConnection[]) {
	cube = undefined;
	
	for (const event of events) {
		event.Disconnect();
	}
	
	Events.DoRespawn.FireServer();
}

onEvent(Events.OnRespawned, {
	OnClientEvent: (otherCube: CubeModel) => {
		cube = otherCube;
		
		setPosition(CFrame.lookAlong(cube.Cube.Position.add(new Vector3(0, 0, -25)), new Vector3(0, 0, 1)));
		
		const events = [] as RBXScriptConnection[];
		
		events.push(cube.Destroying.Once(() => onDestroyed(events)));
		events.push(cube.Hammer.Handle.Destroying.Once(() => onDestroyed(events)));
		events.push(cube.Hammer.Head.Destroying.Once(() => onDestroyed(events)));
	}
});

onEvent(Events.CubeSpawned, {
	OnClientEvent: (otherCube: CubeModel, player: Player) => {
		const leaderstats = player?.WaitForChild('leaderstats', 120);
		const altitudeStat = leaderstats?.WaitForChild('Altitude', 120);
		
		if (altitudeStat?.IsA('StringValue')) {
			altitudeStats.set(otherCube, altitudeStat);
		}
	},
});

onEvent(Events.CubeDestroying, {
	OnClientEvent: (otherCube: CubeModel) => {
		altitudeStats.delete(otherCube);
	},
});

export function instantRespawn() {
	if (cube) {
		cube.PivotTo(templateCube.GetPivot());
		cube.Hammer.Head.CFrame = cube.GetPivot();
		
		cube.Cube.AssemblyLinearVelocity = Vector3.zero;
		cube.Cube.AssemblyAngularVelocity = Vector3.zero;
	} else {
		Events.DoRespawn.FireServer();
	}
}

export function renderStepped(_dt: number) {
	if (cube && cube.IsDescendantOf(Workspace)) {
		mousePlane.Position = cube.Cube.Position;
		
		let hammerOffset = Vector2.zero;
		
		const mousePosition = UserInputService.GetMouseLocation();
		const screenPosition = camera.ViewportPointToRay(mousePosition.X, mousePosition.Y);
		
		const result = Workspace.Raycast(screenPosition.Origin, screenPosition.Direction.mul(1024), paramsMousePlane);
		
		const position = result !== undefined ? result.Position : screenPosition.Origin.add(screenPosition.Direction.mul(1024));
		
		const cubePosition = to2D(cube.Cube.Position);
		const targetPosition = to2D(position);
		const [headPosition] = clampAroundRadius2D(targetPosition, cubePosition, 12);
		
		hammerOffset = targetPosition.sub(cubePosition);
		
		const offsetRotation = CFrame.fromEulerAngles(PI / 2, PI / 2, 0, Enum.RotationOrder.YXZ);
		
		const actualRotation = directionTo(cubePosition, cube.Hammer.Head.Position);
		const cfRotation = CFrame.fromOrientation(0, 0, actualRotation).mul(offsetRotation);
		
		if (!Vars.IsRobloxMenuOpened && !Vars.IsMenuOpened) {
			cube.Cube.TargetAttachment.WorldCFrame = new CFrame(to3D(headPosition)).mul(cfRotation);
			
			cursorDisplay.Position = position;
		} else {
			cube.Cube.TargetAttachment.WorldCFrame = new CFrame(cube.Cube.TargetAttachment.WorldPosition).mul(cfRotation);
			
			cursorDisplay.Position = cube.Hammer.Head.Position;
		}
		
		HudGui.HUD.Altitude.Text = `${toFixed(math.max(studsToMeters(cube.Cube.Position.Y), 0), 1)}m`;
		HudGui.HUD.Speedometer.Text = `${toFixed(studsToMeters(cube.Cube.AssemblyLinearVelocity.Magnitude), 1)}m/s`;
		
		setTarget(CFrame.lookAlong(cube.Cube.Position.add(new Vector3(0, 0, -25)).add(to3D(hammerOffset).div(45)), new Vector3(0, 0, 1)));
	} else {
		HudGui.HUD.Altitude.Text = '?.?m';
		HudGui.HUD.Speedometer.Text = '?.?m/s';
	}
}

export function stepped(_time: number, _dt: number) {
	if (cube) {
		if (cube.Cube.Position.Y < -500 && !voidRespawnDebounce) {
			instantRespawn();
			
			voidRespawnDebounce = true;
			task.delay(0.5, () => {
				voidRespawnDebounce = false;
			});
		}
	}
	
	for (const [otherCube, stat] of altitudeStats) {
		if (!otherCube.Parent || !stat.Parent) {
			continue;
		}
		
		if (otherCube.PrimaryPart) {
			stat.Value = `${toFixed(math.max(studsToMeters(otherCube.PrimaryPart.Position.Y), 0), 1)}m`;
		} else {
			stat.Value = '--';
		}
	}
}
