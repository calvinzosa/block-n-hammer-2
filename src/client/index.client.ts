import {
	GuiService,
	Lighting,
	Players,
	RunService,
	StarterGui,
	UserInputService,
} from '@rbxts/services';

import Tween from '@rbxts/tween';
import * as Easing from '@rbxts/easing-functions';

import './GuiLoader';
import './StartScreenHandler';

import { PerformanceGui, toggleMenu } from './GuiHandler';
import * as Cube from './Cube';
import * as Camera from './Camera';
import Vars from './Variables';

import Events from 'shared/Events';
import { console, Infinity, isNaN, toFixed } from 'shared/JS';

const client = Players.LocalPlayer;
const blurEffect = Lighting.WaitForChild('Blur') as BlurEffect;

const tweens = {
	blurIn: Tween<number>(1, Easing.InOutSine, (amount) => blurEffect.Size = amount, 0, 48).Cancel(),
	blurOut: Tween<number>(0.3, Easing.InOutSine, (amount) => blurEffect.Size = amount, 48, 0).Cancel(),
};

const maxFrames = 80;
const frameTimes = new Array<number>(maxFrames);

UserInputService.InputBegan.Connect((input, gameProcessed) => {
	if (gameProcessed) {
		return;
	}
	
	if (input.KeyCode === Enum.KeyCode.M) {
		toggleMenu();
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
				console.warn('An error occured while trying to bind to the ResetButtonCallback Core:', err);
			}
		}
		
		task.wait(0.5);
	}
});

RunService.BindToRenderStep('Camera', Enum.RenderPriority.Camera.Value + 1, (dt) => {
	Camera.renderStepped(dt);
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
	
	PerformanceGui.Stats.FPS.Text = `${toFixed(1 / averageDeltaTime, 1)}fps`;
	PerformanceGui.Stats.Ping.Text = `${toFixed(client.GetNetworkPing() / 1000, 1)}ms`;
});

RunService.Stepped.Connect((time, dt) => {
	Cube.stepped(time, dt);
});

Events.EnterStartScreen.Fire();