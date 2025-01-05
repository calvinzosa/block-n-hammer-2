import {
	ReplicatedStorage,
	RunService,
} from '@rbxts/services';

import { CubeModel } from './Types/CubeModel';

const getMethod = RunService.IsClient() ? 'WaitForChild' : 'FindFirstChild';
const eventsFolder = ReplicatedStorage[getMethod]('Events') as Folder;

export default {
	CubeSpawned: eventsFolder[getMethod]('CubeSpawned') as RemoteEvent<(cube: CubeModel, player: Player) => void>,
	CubeDestroying: eventsFolder[getMethod]('CubeDestroying') as RemoteEvent<(cube: CubeModel, player: Player) => void>,
	
	DoRespawn: eventsFolder[getMethod]('DoRespawn') as RemoteEvent<() => void>,
	OnRespawned: eventsFolder[getMethod]('OnRespawned') as RemoteEvent<(cube: CubeModel, isInstant: boolean) => void>,
	ForceRespawn: eventsFolder[getMethod]('ForceRespawn') as BindableEvent<(player: Player) => void>,
	
	EnterStartScreen: eventsFolder[getMethod]('EnterStartScreen') as BindableEvent<() => void>,
	StartScreenEntered: eventsFolder[getMethod]('StartScreenEntered') as RemoteEvent<() => void>,
	StartScreenEnded: eventsFolder[getMethod]('StartScreenEnded') as RemoteEvent<() => void>,
	
	GetSavedSettings: eventsFolder[getMethod]('GetSavedSettings') as RemoteFunction<() => Record<string, any>>,
	UpdateSetting: eventsFolder[getMethod]('UpdateSetting') as RemoteFunction<(settingId: string, newValue: any) => any>,
	
	EnableVoiceChat: eventsFolder[getMethod]('EnableVoiceChat') as RemoteEvent<() => void>,
};
