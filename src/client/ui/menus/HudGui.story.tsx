import React from '@rbxts/react';
import ReactRoblox from '@rbxts/react-roblox';
import { InferFusionProps, Slider } from '@rbxts/ui-labs';

import { guiProducer } from '../producer';
import { ReflexProvider } from '@rbxts/react-reflex';
import { HudGui } from './HudGui';

const controls = {
	cubeSpeed: Slider(0, 0, 10, 0.5),
	cubeAltitude: Slider(0, 0, 10, 0.5),
};

const story = {
	react: React,
	reactRoblox: ReactRoblox,
	controls,
	story: (props: InferFusionProps<typeof controls>) => {
		const { cubeAltitude, cubeSpeed } = props.controls;
		
		guiProducer.UpdateHUD(cubeAltitude, cubeSpeed);
		
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
					<HudGui />
				</frame>
			</ReflexProvider>
		);
	},
};

export = story;
