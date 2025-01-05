import {
	Players,
} from '@rbxts/services';

import { CenturionType, Command, CommandContext, CommandGuard, Guard, Register } from '@rbxts/centurion';

import { isInfinity, isNaN } from 'shared/JS';
import Events from 'shared/Events';

const isAdmin: CommandGuard = (context) => {
	if (context.executor.UserId !== 156926145) {
		context.error('Insufficient permission!');
		return false;
	}
	
	return true;
}

const isOwner: CommandGuard = (context) => {
	if (context.executor.UserId !== 156926145) {
		context.error('Insufficient permission!');
		return false;
	}
	
	return true;
}

function formatPlayer(player: Player) {
	return `${player.DisplayName} (@${player.Name} / ${player.UserId})`;
}

@Register()
export class Commands {
	@Command({
		name: 'commands',
		aliases: ['cmds', 'help'],
		description: 'Shows a list of every in-game command',
		arguments: [ ],
	})
	public cmds(context: CommandContext) {
		// would be nice if there was a better way to do this
		context.reply(
`commands | cmds | help
- Shows this message
centurion
- Settings for this interface
(admin) respawn | re
- Force-respawn a player
(admin) kick
- Kick a player from the server
(owner) ban
- Bans a player globally
`);
	}
	
	@Guard(isAdmin)
	@Command({
		name: 'respawn',
		aliases: ['re'],
		description: 'Force-respawn a player',
		arguments: [
			{ name: 'player', description: 'Player to kick', type: CenturionType.Player, optional: false },
		],
	})
	public respawn(context: CommandContext, target: Player) {
		Events.ForceRespawn.Fire(target);
		
		context.reply(`Respawned ${formatPlayer(target)}`);
	}
	
	@Guard(isAdmin)
	@Command({
		name: 'kick',
		description: 'Kick a player from the server',
		arguments: [
			{ name: 'player', description: 'Player to kick', type: CenturionType.Player, optional: false },
			{ name: 'message', description: 'Optional message to show', type: CenturionType.String, optional: true },
		],
	})
	public kick(context: CommandContext, target: Player, message?: string) {
		target.Kick(message ?? `You have been kicked from the server by ${formatPlayer(context.executor)}!`);
		context.reply(`Kicked ${formatPlayer(target)}`);
	}
	
	@Guard(isOwner)
	@Command({
		name: 'ban',
		description: 'Bans a player globally',
		arguments: [
			{ name: 'userId', description: 'UserId to ban', type: CenturionType.Integer, optional: false },
			{ name: 'duration', description: 'Duration of the ban in seconds, set to -1 or 0 for perma-ban', type: CenturionType.Integer, optional: false },
			{ name: 'reason', description: 'Reason for ban', type: CenturionType.String, optional: false },
		],
	})
	public ban(context: CommandContext, userId: number, duration: number, reason: string) {
		if (!isOwner(context)) { // just to make extra sure even though there is already a guard
			return;
		}
		
		if (duration !== undefined && duration !== -1 && (isNaN(duration) || isInfinity(duration) || duration < 0)) {
			context.error('`duration` cannot be `NaN`, `Infinity` or negative (-1 excluded)');
			return;
		}
		
		if (reason.size() >= 256) {
			context.error('`reason` must be less than 256 characters in length');
			return;
		}
		
		try {
			Players.BanAsync({
				UserIds: [userId],
				DisplayReason: `You have been banned by ${formatPlayer(context.executor)} - Reason: ${reason}`,
				PrivateReason: `ban command executed by ${formatPlayer(context.executor)}`,
				Duration: duration,
			});
		} catch (err) {
			context.error(`Failed to ban, error: ${err}`);
			return;
		}
		
		context.reply(`Successfully banned ${userId}`);
	}
}
