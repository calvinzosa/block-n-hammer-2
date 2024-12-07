import {
	Players,
} from '@rbxts/services';

import ProfileService from '@rbxts/profileservice';
import { Profile } from '@rbxts/profileservice/globals';

export const ProfileTemplate = {
	Leaderstats: {
		Squares: 0,
		Altitude: 0,
	},
	Cube: {
		CustomColor: -1,
		LastSavedPosition: [16, 2, 0],
	},
};

export type UserProfile = Profile<typeof ProfileTemplate>;

export const LoadedProfiles = new Map<Player, UserProfile>();

const ProfileStore = ProfileService.GetProfileStore('PlayerData', ProfileTemplate);

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
