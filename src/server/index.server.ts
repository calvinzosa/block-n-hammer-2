import {
	Players,
} from '@rbxts/services';

import * as PlayerData from './PlayerData';
import * as Cube from './Cube';

Players.PlayerAdded.Connect((player) => {
	PlayerData.playerAdded(player);
	Cube.playerAdded(player);
});

Players.PlayerRemoving.Connect((player) => {
	PlayerData.playerLeaving(player);
	Cube.playerLeaving(player);
});
