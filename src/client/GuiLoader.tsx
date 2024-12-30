import {
	Players,
	RunService,
	Workspace,
} from '@rbxts/services';

import React, { StrictMode } from '@rbxts/react';
import { createPortal, createRoot } from '@rbxts/react-roblox';

import { producer, Screen } from './ui/producer';
import { MainGui } from './ui/MainGui';

import Events from 'shared/Events';
import { ReflexProvider } from '@rbxts/react-reflex';

const camera = Workspace.CurrentCamera ?? Workspace.WaitForChild('Camera') as Camera;
const client = Players.LocalPlayer;
const playerGui = client.WaitForChild('PlayerGui') as PlayerGui;

const root = createRoot(new Instance('Folder'));

const portal = createPortal(
	<ReflexProvider producer={producer}>
		<MainGui
			Camera={camera}
		/>
	</ReflexProvider>,
	playerGui,
);

if (RunService.IsStudio()) {
	if (camera.ViewportSize === Vector2.one) {
		camera.GetPropertyChangedSignal('ViewportSize').Wait();
	}
}

root.render(
	RunService.IsStudio()
	? <StrictMode>
		{portal}
	</StrictMode>
	: portal
);

Events.EnterStartScreen.Event.Connect(() => {
	print('rendering start screen');
	
	Events.StartScreenEntered.FireServer();
	
	producer.toggleMenu(false);
	producer.setScreen(Screen.StartScreen);
});

Events.EnterStartScreen.Fire();
