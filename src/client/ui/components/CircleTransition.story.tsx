import { InferFusionProps, Slider } from '@rbxts/ui-labs';
import React from '@rbxts/react';
import ReactRoblox from '@rbxts/react-roblox';

import { CircleTransition } from './CircleTransition';

const controls = {
	Size: Slider(1920, 1, 1920, 10),
	Color3: Color3.fromRGB(0, 0, 0),
	Duration: Slider(2, 0, 10, 0.5),
	Animate: false,
};

const story = {
	react: React,
	reactRoblox: ReactRoblox,
	controls,
	story: (props: InferFusionProps<typeof controls>) => {
		const {
			Size,
			Color3,
			Duration,
			Animate,
		} = props.controls;
		
		return (
			<CircleTransition
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromOffset(Size, Size)}
				Color3={Color3}
				Duration={Duration}
				Animate={Animate}
			/>
		);
	},
};

export = story;
