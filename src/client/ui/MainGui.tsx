import React, { useEffect, useState } from '@rbxts/react';

import { Screen, useRootProducer, useRootSelector } from './producer';
import { SideMenu } from './menus/SideMenu';
import { StartScreen } from './menus/StartScreen';

import Events from 'shared/Events';
import { calculateGuiScale } from 'shared/Utils';

interface Props {
	Camera: Camera;
}

export function MainGui(props: Props) {
	const {
		Camera,
	} = props;
	
	const [scale, changeScale] = useState<number>(calculateGuiScale(Camera.ViewportSize));
	
	useEffect(() => {
		changeScale(calculateGuiScale(Camera.ViewportSize));
	}, [Camera.ViewportSize]);
	print(scale, Camera.ViewportSize);
	const producer = useRootProducer();
	const currentScreen = useRootSelector((state) => state.currentScreen);
	
	return (
		<>
			<screengui
				ZIndexBehavior={Enum.ZIndexBehavior.Sibling}
				IgnoreGuiInset={true}
				Enabled={currentScreen === Screen.StartScreen}
				ResetOnSpawn={false}
			>
				<uiscale
					Scale={scale}
				/>
				<StartScreen
					Camera={Camera}
					Scale={scale}
					OnPlayButton={() => {
						Events.StartScreenEnded.FireServer();
						
						producer.setScreen(Screen.Main);
					}}
				/>
			</screengui>
			<screengui
				ZIndexBehavior={Enum.ZIndexBehavior.Sibling}
				IgnoreGuiInset={false}
				Enabled={currentScreen === Screen.Main}
				ResetOnSpawn={false}
			>
				<uiscale
					Scale={scale}
				/>
				<SideMenu
					Open={false}
					Scale={scale}
					OnButtonClick={(button) => {
						switch (button) {
							case 'settings': {
								break;
							}
							case 'customization': {
								break;
							}
							case 'level selector': {
								break;
							}
							case 'spectate': {
								break;
							}
							case 'start menu': {
								Events.EnterStartScreen.Fire();
								break;
							}
						}
					}}
				/>
			</screengui>
		</>
	);
}
