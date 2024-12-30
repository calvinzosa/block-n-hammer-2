import { InferFusionProps, Slider } from '@rbxts/ui-labs';
import React from '@rbxts/react';
import ReactRoblox from '@rbxts/react-roblox';

import { SideMenu } from './SideMenu';
import { $print } from 'rbxts-transform-debug';

const controls = {
	Open: true,
};

const story = {
	react: React,
	reactRoblox: ReactRoblox,
	controls,
	story: (props: InferFusionProps<typeof controls>) => {
		const {
			Open,
		} = props.controls;
		
		return (
			<frame
				Size={UDim2.fromOffset(1920, 1080)}
				BackgroundTransparency={1}
			>
				<SideMenu
					Open={Open}
					Scale={1}
					OnButtonClick={(button) => $print(`button clicked "${button}"`)}
				/>
			</frame>
		);
	},
};

export = story;
