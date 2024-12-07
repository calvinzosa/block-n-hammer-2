import {
	ReplicatedStorage,
	RunService,
} from '@rbxts/services';

import Cube from './Types/CubeModel';

const getMethod = RunService.IsClient() ? 'WaitForChild' : 'FindFirstChild';
const eventsFolder = ReplicatedStorage[getMethod]('Events') as Folder;

export default {
	CubeSpawned: eventsFolder[getMethod]('CubeSpawned') as RemoteEvent<(cube: Cube, player: Player) => void>,
	CubeDestroying: eventsFolder[getMethod]('CubeDestroying') as RemoteEvent<(cube: Cube, player: Player) => void>,
	
	DoRespawn: eventsFolder[getMethod]('DoRespawn') as RemoteEvent<() => void>,
	OnRespawned: eventsFolder[getMethod]('OnRespawned') as RemoteEvent<(cube: Cube, isInstant: boolean) => void>,
	
	EnterStartScreen: eventsFolder[getMethod]('EnterStartScreen') as BindableEvent<() => void>,
	StartScreenEntered: eventsFolder[getMethod]('StartScreenEntered') as RemoteEvent<() => void>,
	StartScreenEnded: eventsFolder[getMethod]('StartScreenEnded') as RemoteEvent<() => void>,
};
