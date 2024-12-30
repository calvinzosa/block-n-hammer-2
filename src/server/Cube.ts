import {
	CollectionService,
	Players,
	ReplicatedStorage,
	Workspace,
} from '@rbxts/services';

import Events from 'shared/Events';

import { Tags, Attributes } from 'shared/Constants';
import GetNameColor from 'shared/NameColor';
import { CubeModel } from 'shared/Types/CubeModel';

const templateCube = ReplicatedStorage.FindFirstChild('Cube') as CubeModel;

Events.DoRespawn.OnServerEvent.Connect((player) => {
	const cube = Workspace.FindFirstChild(player.Name) as CubeModel | undefined;
	if (cube?.IsA('Model') && cube.HasTag(Tags.Cube)) {
		cube.Destroy();
	}
});

Events.StartScreenEntered.OnServerEvent.Connect((player) => {
	player.SetAttribute(Attributes.Player.IsInStartScreen, true);
	
	removeCube(player.Name);
});

Events.StartScreenEnded.OnServerEvent.Connect((player) => {
	player.SetAttribute(Attributes.Player.IsInStartScreen, false);
	
	createCube(player);
});

export function createCube(player: Player) {
	if (player.GetAttribute(Attributes.Player.IsInStartScreen)) {
		return;
	}
	
	removeCube(player.Name);
	
	const nameColor = GetNameColor(player.Name, 3);
	
	const cube = templateCube.Clone();
	cube.Cube.Color = nameColor;
	cube.Name = player.Name;
	
	cube.Destroying.Connect(() => {
		if (player.GetAttribute(Attributes.Player.IsInStartScreen)) {
			return;
		}
		
		task.wait(Players.RespawnTime);
		
		if (player.IsDescendantOf(Players)) {
			createCube(player);
		}
	});
	
	player.Character = cube;
	
	cube.Parent = Workspace;
	
	task.delay(0.1, () => {
		cube.Cube.SetNetworkOwner(player);
		cube.Hammer.Head.SetNetworkOwner(player);
		cube.Hammer.Handle.SetNetworkOwner(player);
	});
	
	Events.CubeSpawned.FireAllClients(cube, player);
	Events.OnRespawned.FireClient(player, cube, false);
}

export function removeCube(playerName: string) {
	for (const cube of CollectionService.GetTagged(Tags.Cube)) {
		if (cube.IsA('Model') && cube.Parent === Workspace && cube.Name === playerName) {
			cube.Destroy();
		}
	}
}

export function playerAdded(player: Player) {
	for (const cube of CollectionService.GetTagged(Tags.Cube)) {
		if (cube.IsA('Model') && cube.Parent === Workspace) {
			const otherPlayer = Players.FindFirstChild(cube.Name);
			
			if (otherPlayer?.IsA('Player')) {
				Events.CubeSpawned.FireClient(player, cube as CubeModel, otherPlayer);
			}
		}
	}
}

export function playerLeaving(player: Player) {
	removeCube(player.Name);
}
