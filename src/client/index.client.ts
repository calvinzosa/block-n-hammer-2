import {
	GuiService,
	Lighting,
	Players,
	RunService,
	StarterGui,
	UserInputService,
	VoiceChatService,
} from '@rbxts/services';

import { $print, $warn } from 'rbxts-transform-debug';
import * as Easing from '@rbxts/easing-functions';
import Tween from '@rbxts/tween';

import './GuiLoader';
import './Commands';
import { guiProducer } from './ui/producer';

import CameraController from './Camera';
import * as Cube from './Cube';
import Vars from './Variables';

import { Infinity, isNaN, setTimeout } from 'shared/JS';
import { ClickInputs } from 'shared/Constants';
import Events from 'shared/Events';

import './WaterWaves';

const client = Players.LocalPlayer;
const blurEffect = Lighting.WaitForChild('Blur') as BlurEffect;

const tweens = {
	blurIn: Tween<number>(1, Easing.InOutSine, (amount) => blurEffect.Size = amount, 0, 48).Cancel(),
	blurOut: Tween<number>(0.3, Easing.InOutSine, (amount) => blurEffect.Size = amount, 48, 0).Cancel(),
};

const maxFrames = 80;
const frameTimes = new Array<number>(maxFrames);

setTimeout(() => {
	try {
		if (VoiceChatService.IsVoiceEnabledForUserIdAsync(client.UserId)) {
			$print('Enabling voice chat');
			Events.EnableVoiceChat.FireServer();
		}
	} catch (err) {
		$warn(`Failed to check for voice chat, error: ${err}`);
	}
}, 1_000);

UserInputService.InputBegan.Connect((input, gameProcessed) => {
	if (gameProcessed) {
		return;
	}
	
	if (input.KeyCode === Enum.KeyCode.M) {
		guiProducer.ToggleMenu();
	}
});

UserInputService.InputEnded.Connect((input) => {
	if (ClickInputs.has(input.UserInputType)) {
		// Settings.mouseReleased();
	}
});

UserInputService.InputChanged.Connect((input) => {
	if (input.UserInputType === Enum.UserInputType.MouseMovement) {
		// Settings.mouseMoved(input.Position.X);
	}
});

GuiService.MenuOpened.Connect(() => {
	Vars.IsRobloxMenuOpened = true;
	
	tweens.blurOut.Cancel();
	tweens.blurIn.Play();
});

GuiService.MenuClosed.Connect(() => {
	Vars.IsRobloxMenuOpened = false;
	
	tweens.blurIn.Cancel();
	tweens.blurOut.Play();
});

const resetButtonCallback = new Instance('BindableEvent');

resetButtonCallback.Event.Connect(() => {
	Cube.instantRespawn();
});

task.spawn(() => {
	let attempts = 0;
	
	while (true) {
		try {
			StarterGui.SetCore('ResetButtonCallback', resetButtonCallback);
			
			break;
		} catch (err) {
			attempts++;
			
			if (attempts > 15) {
				$warn('An error occured while trying to bind to the ResetButtonCallback Core:', err);
			}
		}
		
		task.wait(0.5);
	}
});

RunService.BindToRenderStep('Camera', Enum.RenderPriority.Camera.Value + 1, (dt) => {
	CameraController.RenderStepped(dt);
});

RunService.RenderStepped.Connect((dt) => {
	Cube.renderStepped(dt);
	
	frameTimes.push(dt);
	
	if (frameTimes.size() > maxFrames) {
		frameTimes.shift();
	}
	
	let averageDeltaTime = 0;
	
	for (const deltaTime of frameTimes) {
		averageDeltaTime += deltaTime;
	}
	
	averageDeltaTime = averageDeltaTime / frameTimes.size();
	
	if (isNaN(averageDeltaTime)) {
		averageDeltaTime = Infinity;
	}
	
	guiProducer.UpdatePerformance(1 / averageDeltaTime, client.GetNetworkPing());
});

RunService.Stepped.Connect((time, dt) => {
	Cube.stepped(time, dt);
});
