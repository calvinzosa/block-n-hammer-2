import React, { useEffect, useState } from '@rbxts/react';
import { $dbg } from 'rbxts-transform-debug';

import { useRootSelector } from '../producer';
import { Container } from '../components/Container';

import { Infinity, toFixed } from 'shared/JS';
import { FontIds } from 'shared/Constants';

export function HudGui() {
	const cubeAltitude = useRootSelector((state) => state.cubeAltitude);
	const cubeSpeed = useRootSelector((state) => state.cubeSpeed);
	
	const [altitudeText, updateAltitude] = useState<string>('0.0m');
	const [speedText, updateSpeed] = useState<string>('0.0m/s');
	
	const font = Font.fromId(FontIds.Inter, Enum.FontWeight.Bold, Enum.FontStyle.Normal);
	
	useEffect(() => {
		updateAltitude(cubeAltitude !== -Infinity ? `${toFixed(cubeAltitude, 1)}m` : '?.?m');
	}, [cubeAltitude]);
	
	useEffect(() => {
		updateSpeed(cubeSpeed !== -Infinity ? `${toFixed(cubeSpeed, 1)}m/s` : '?.?m/s');
	}, [cubeSpeed]);
	
	return (
		<Container
			Position={UDim2.fromScale(0.5, 1)}
			Size={UDim2.fromScale(0.7, 0.2)}
			AnchorPoint={new Vector2(0.5, 1)}
			VerticalAlignment={Enum.VerticalAlignment.Bottom}
			Gap={8}
			PaddingBottom={8}
		>
			<textlabel
				Size={UDim2.fromScale(1, 0)}
				AutomaticSize={Enum.AutomaticSize.Y}
				AnchorPoint={new Vector2(0, 1)}
				Text={altitudeText}
				TextSize={75}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				FontFace={font}
				BackgroundTransparency={1}
			>
				<uistroke
					Color={Color3.fromRGB(0, 0, 0)}
					Thickness={7}
					Transparency={0}
					ApplyStrokeMode={Enum.ApplyStrokeMode.Contextual}
					LineJoinMode={Enum.LineJoinMode.Miter}
				/>
			</textlabel>
			<textlabel
				Size={UDim2.fromScale(1, 0)}
				AutomaticSize={Enum.AutomaticSize.Y}
				AnchorPoint={new Vector2(0, 1)}
				Text={speedText}
				TextSize={45}
				TextColor3={Color3.fromRGB(88, 88, 88)}
				FontFace={font}
				BackgroundTransparency={1}
			>
				<uistroke
					Color={Color3.fromRGB(0, 0, 0)}
					Thickness={7}
					Transparency={0}
					ApplyStrokeMode={Enum.ApplyStrokeMode.Contextual}
					LineJoinMode={Enum.LineJoinMode.Miter}
				/>
			</textlabel>
		</Container>
	);
}
