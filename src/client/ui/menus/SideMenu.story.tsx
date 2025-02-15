import React from '@rbxts/react';
import ReactRoblox from '@rbxts/react-roblox';
import { $print } from 'rbxts-transform-debug';

import { InferFusionProps, Slider } from '@rbxts/ui-labs';

import { SideMenu } from './SideMenu';
import { guiProducer } from '../producer';
import { ReflexProvider } from '@rbxts/react-reflex';

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
		
		guiProducer.ToggleMenu(Open);
		
		return (
			<ReflexProvider producer={guiProducer}>
				<frame
					Size={UDim2.fromOffset(1920, 1080)}
					BackgroundTransparency={1}
				>
					<uistroke
						Color={Color3.fromRGB(255, 255, 255)}
						Thickness={16}
					/>
					<SideMenu
						OnButtonClick={(button) => $print(`button clicked "${button}"`)}
					/>
				</frame>
			</ReflexProvider>
		);
	},
};

export = story;
