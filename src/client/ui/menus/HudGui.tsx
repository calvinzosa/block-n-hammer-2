import React, { useEffect, useState } from '@rbxts/react';
import { $dbg } from 'rbxts-transform-debug';

import { useRootSelector } from '../producer';
import { Container } from '../components/Container';

import { Infinity, toFixed } from 'shared/JS';
import { FontIds } from 'shared/Constants';

export function HudGui() {
	const { altitude: cubeAltitude, speed: cubeSpeed } = useRootSelector((state) => state.cube);
	const { fps: performanceFPS, ping: performancePing } = useRootSelector((state) => state.performance);
	
	const [altitudeText, updateAltitude] = useState<string>('0.0m');
	const [speedText, updateSpeed] = useState<string>('0.0m/s');
	
	const [fpsText, updateFPS] = useState<string>('0.0fps');
	const [pingText, updatePing] = useState<string>('0ms');
	
	const font = Font.fromId(FontIds.Inter, Enum.FontWeight.Bold, Enum.FontStyle.Normal);
	
	useEffect(() => {
		updateAltitude(cubeAltitude !== -Infinity ? `${toFixed(cubeAltitude, 1)}m` : '?.?m');
		updateSpeed(cubeSpeed !== -Infinity ? `${toFixed(cubeSpeed, 1)}m/s` : '?.?m/s');
	}, [cubeAltitude, cubeSpeed]);
	
	useEffect(() => {
		updateFPS(`${toFixed(performanceFPS, 1)}fps`);
		updatePing(`${math.floor(performancePing)}ms`);
	}, [performanceFPS, performancePing]);
	
	return (
		<>
			<Container
				Position={UDim2.fromScale(0.5, 1)}
				Size={UDim2.fromScale(0.6, 0.2)}
				AnchorPoint={new Vector2(0.5, 1)}
				VerticalAlignment={Enum.VerticalAlignment.Bottom}
				Gap={8}
				PaddingBottom={8}
			>
				<textlabel
					Size={UDim2.fromScale(1, 0)}
					AutomaticSize={Enum.AutomaticSize.Y}
					AnchorPoint={new Vector2(0, 1)}
					Text={speedText}
					TextSize={45}
					TextColor3={Color3.fromRGB(88, 88, 88)}
					TextXAlignment={Enum.TextXAlignment.Center}
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
					Text={altitudeText}
					TextSize={75}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextXAlignment={Enum.TextXAlignment.Center}
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
			<Container
				Position={UDim2.fromScale(1, 1)}
				Size={UDim2.fromScale(0.2, 0.2)}
				AnchorPoint={new Vector2(1, 1)}
				VerticalAlignment={Enum.VerticalAlignment.Bottom}
				Gap={8}
				PaddingBottom={8}
				PaddingRight={8}
			>
				<textlabel
					Size={UDim2.fromScale(1, 0)}
					AutomaticSize={Enum.AutomaticSize.Y}
					AnchorPoint={new Vector2(0, 1)}
					Text={pingText}
					TextSize={45}
					TextColor3={Color3.fromRGB(240, 255, 123)}
					TextXAlignment={Enum.TextXAlignment.Right}
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
					Text={fpsText}
					TextSize={65}
					TextColor3={Color3.fromRGB(240, 255, 123)}
					TextXAlignment={Enum.TextXAlignment.Right}
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
		</>
	);
}
