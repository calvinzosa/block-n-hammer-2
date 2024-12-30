import React from '@rbxts/react';
import ReactRoblox from '@rbxts/react-roblox';
import { InferFusionProps } from '@rbxts/ui-labs';
import { $print } from 'rbxts-transform-debug';

import { LoadingScreen } from './LoadingScreen';

const controls = { };

const story = {
	react: React,
	reactRoblox: ReactRoblox,
	controls,
	story: (_props: InferFusionProps<typeof controls>) => {
		return (
			<frame
				Size={UDim2.fromOffset(1920, 1080)}
				BackgroundTransparency={1}
			>
				<LoadingScreen
					OnFinished={() => $print('loading finished')}
				/>
			</frame>
		);
	},
};

export = story;
