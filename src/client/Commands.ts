import { Centurion } from '@rbxts/centurion';
import { CenturionUI } from '@rbxts/centurion-ui';
import { $print, $warn } from 'rbxts-transform-debug';

import { FontIds } from 'shared/Constants';
import { setTimeout } from 'shared/JS';

setTimeout(() => {
	const commands = Centurion.client();
	
	commands.start()
		.then(() => {
			$print('Centurion is running');
			
			CenturionUI.start(commands, {
				activationKeys: [Enum.KeyCode.Insert],
				hideOnLostFocus: true,
				autoLocalize: true,
				backgroundTransparency: 0,
				size: UDim2.fromScale(0.5, 0.5),
				font: {
					regular: Font.fromId(FontIds.Inter, Enum.FontWeight.Medium, Enum.FontStyle.Normal),
					medium: Font.fromId(FontIds.Inter, Enum.FontWeight.Medium, Enum.FontStyle.Normal),
					bold: Font.fromId(FontIds.Inter, Enum.FontWeight.Bold, Enum.FontStyle.Normal),
				},
			});
		})
		.catch((err) => {
			$warn(`Failed to start Centurion: ${err}`);
		});
}, 500);
