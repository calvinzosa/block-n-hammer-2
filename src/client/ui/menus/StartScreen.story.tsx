import {
	Workspace,
} from '@rbxts/services';

import React from '@rbxts/react';
import ReactRoblox from '@rbxts/react-roblox';
import { InferFusionProps } from '@rbxts/ui-labs';
import { $print } from 'rbxts-transform-debug';

import { StartScreen } from './StartScreen';

const controls = { };

const story = {
	react: React,
	reactRoblox: ReactRoblox,
	controls,
	story: (props: InferFusionProps<typeof controls>) => {
		const { } = props.controls;
		
		return (
			<frame
				Size={UDim2.fromOffset(1920, 1080)}
				BackgroundTransparency={1}
			>
				<StartScreen
					Camera={Workspace.CurrentCamera ?? Workspace.WaitForChild('Camera') as Camera}
					Scale={1}
					OnPlayButton={() => {
						$print('start');
						return true;
					}}
				/>
			</frame>
		);
	},
};

export = story;
