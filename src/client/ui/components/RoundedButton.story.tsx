import { InferFusionProps, Slider, Choose } from '@rbxts/ui-labs';
import React from '@rbxts/react';
import ReactRoblox from '@rbxts/react-roblox';

import { RoundedButton } from './RoundedButton';

const controls = {
	visible: true,
	text: 'text',
	textColor: Color3.fromRGB(255, 255, 255),
	fontWeight: Choose(['ExtraLight', 'Light', 'Thin', 'Regular', 'Medium', 'SemiBold', 'Bold', 'ExtraBold', 'Heavy'] as Array<Enum.FontWeight['Name']>, 7),
	fontStyle: Choose(['Normal', 'Italic'] as Array<Enum.FontStyle['Name']>, 1),
	iconImage: 'rbxassetid://84962674544300',
	iconSize: Slider(0.5, 0.1, 1, 0.1),
	direction: Choose(['right', 'left'], 2),
	innerPadding: Slider(12, 0, 128, 2),
	width: Slider(650, 10, 1920, 10),
	height: Slider(150, 10, 1080, 10),
	widthScale: Slider(0, 0, 1, 0.1),
	heightScale: Slider(0, 0, 1, 0.1),
	backgroundTransparency: Slider(0.5, 0, 1, 0.1),
	animations: true,
};

const story = {
	react: React,
	reactRoblox: ReactRoblox,
	controls,
	story: (props: InferFusionProps<typeof controls>) => {
		const {
			visible,
			text,
			textColor,
			fontWeight,
			fontStyle,
			iconImage,
			iconSize,
			direction,
			innerPadding,
			width,
			height,
			widthScale,
			heightScale,
			backgroundTransparency,
			animations,
		} = props.controls;
		
		return (
			<RoundedButton
				Visible={visible}
				Text={text}
				TextColor={textColor}
				FontWeight={Enum.FontWeight[fontWeight as Enum.FontWeight['Name']]}
				FontStyle={Enum.FontStyle[fontStyle as Enum.FontStyle['Name']]}
				IconImage={iconImage}
				IconSize={iconSize}
				Direction={direction}
				InnerPadding={innerPadding}
				Size={new UDim2(widthScale, width, heightScale, height)}
				BackgroundTransparency={backgroundTransparency}
				Animated={animations}
			/>
		);
	},
};

export = story;
