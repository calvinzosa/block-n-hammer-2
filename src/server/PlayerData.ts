import {
	Players,
	RunService,
} from '@rbxts/services';

import { $print, $warn } from 'rbxts-transform-debug';

import ProfileService from '@rbxts/profileservice';
import { Profile } from '@rbxts/profileservice/globals';

import { roundToNearestMultiple, roundToDecimal } from 'shared/Utils';
import ClientSettings from 'shared/ClientSettings';
import Events from 'shared/Events';

export const ProfileTemplate = {
	Leaderstats: {
		Squares: 0,
		Altitude: 0,
	},
	Cube: {
		CustomColor: -1,
		LastSavedPosition: [16, 2, 0],
	},
	Settings: new Map<string, number | boolean>(),
};

export type UserProfile = Profile<typeof ProfileTemplate>;
export const LoadedProfiles = new Map<Player, UserProfile>();

const ProfileStore = ProfileService.GetProfileStore('PlayerData', ProfileTemplate);

Events.UpdateSetting.OnServerInvoke = (player, settingId, newValue) => {
	if (RunService.IsStudio()) {
		$print(`Recieved setting update from ${player.Name} of ${settingId} to ${newValue}`);
	}
	
	const profile = LoadedProfiles.get(player);
	
	if (!profile) {
		$warn(`Unable to find profile for player ${player}!`);
	}
	
	for (const setting of ClientSettings) {
		if (setting.Id === settingId) {
			if (!profile) {
				return setting.Default;
			}
			
			if (setting.Type === 'checkbox') {
				if (typeIs(newValue, 'boolean')) {
					profile.Data.Settings.set(setting.Id, newValue);
					
					return newValue;
				}
			} else if (setting.Type === 'slider') {
				if (typeIs(newValue, 'number')) {
					const sanitizedValue = roundToDecimal(math.clamp(roundToNearestMultiple(newValue, setting.Step), setting.Min, setting.Max), 3);
					
					profile.Data.Settings.set(setting.Id, sanitizedValue);
					
					return sanitizedValue;
				}
			} else if (setting.Type === 'dropdown') {
				$warn('TODO: stanitize dropdown input');
			}
			
			return setting.Default;
		}
	}
	
	return undefined;
}

function profileLoaded(player: Player, profile: UserProfile) {
	const leaderstatsFolder = new Instance('Folder');
	leaderstatsFolder.Name = 'leaderstats';
	
	const altitudeStat = new Instance('StringValue');
	altitudeStat.Name = 'Altitude';
	altitudeStat.Value = '--';
	altitudeStat.Parent = leaderstatsFolder;
	
	const squaresStat = new Instance('IntValue');
	squaresStat.Name = 'Squares';
	squaresStat.Value = profile.Data.Leaderstats.Squares;
	squaresStat.Parent = leaderstatsFolder;
	
	squaresStat.Changed.Connect((newValue) => {
		const finalValue = math.clamp(newValue, 0, 999_999);
		
		squaresStat.Value = finalValue;
		profile.Data.Leaderstats.Squares = finalValue;
	});
	
	leaderstatsFolder.Parent = player;
}

export function playerAdded(player: Player) {
	const userId = player.UserId;
	const profile = ProfileStore.LoadProfileAsync(`player_${userId}`);
	
	if (profile !== undefined) {
		profile.AddUserId(userId);
		profile.Reconcile();
		
		profile.ListenToRelease(() => {
			LoadedProfiles.delete(player);
			player.Kick('Your profile has been unloaded due to it being loaded into another server');
		});
		
		if (player.IsDescendantOf(Players)) {
			LoadedProfiles.set(player, profile);
			profileLoaded(player, profile);
		} else {
			profile.Release();
		}
	} else {
		player.Kick('Your profile could not be loaded! This could be possibly due to another server attempting to load your profile too or an issue with DataStoreService');
	}
}

export function playerLeaving(player: Player) {
	LoadedProfiles.delete(player);
}
