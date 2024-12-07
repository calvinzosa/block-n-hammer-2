import {
	TweenService,
} from '@rbxts/services';

import Tween, { PseudoTween } from '@rbxts/tween';
import * as Easing from '@rbxts/easing-functions';

import { StartGui, HudGui, MenuGui, PerformanceGui, toggleMenu, SpeedLinesGui } from './GuiHandler';
import Vars from './Variables';

import { ClickInputs } from 'shared/Constants';
import { onEvent } from 'shared/Utils';
import Events from 'shared/Events';
import { console } from 'shared/JS';

const ongoingTweens = new Map<Instance, PseudoTween>();

let backgroundTween: Tween | undefined = undefined;

Events.EnterStartScreen.Event.Connect(() => {
	Events.StartScreenEntered.FireServer();
	
	Vars.IsInStartScreen = true;
	
	toggleMenu(false);
	
	StartGui.Enabled = true;
	HudGui.Enabled = false;
	MenuGui.Enabled = false;
	PerformanceGui.Enabled = false;
	SpeedLinesGui.Enabled = false;
	
	StartGui.Buttons.Start.Position = new UDim2(0, 0, 1, -175);
	StartGui.Buttons.Credits.Position = new UDim2(0, 0, 1, 0);
	StartGui.Background.Position = new UDim2(0, 0, 0, 0);
	
	if (backgroundTween) {
		backgroundTween.Cancel();
		backgroundTween.Destroy();
	}
	
	backgroundTween = TweenService.Create(StartGui.Background, new TweenInfo(2, Enum.EasingStyle.Linear, Enum.EasingDirection.In, -1, false, 0), {
		Position: new UDim2(0, 0, 0, -512),
	});
	
	backgroundTween.Play();
});

const mouseEntered = (button: TextButton) => {
	ongoingTweens.get(button)?.Cancel();
	
	const tween = Tween<number>(0.5, Easing.Spring, (offset) => button.Position = new UDim2(0, offset, 1, button.Position.Y.Offset), 0, -32);
	ongoingTweens.set(button, tween);
}

const mouseLeft = (button: TextButton) => {
	ongoingTweens.get(button)?.Cancel();
	
	const tween = Tween<number>(0.5, Easing.Spring, (offset) => button.Position = new UDim2(0, offset, 1, button.Position.Y.Offset), -32, 0);
	ongoingTweens.set(button, tween);
}

onEvent(StartGui.Buttons.Start, {
	MouseEnter: () => mouseEntered(StartGui.Buttons.Start),
	MouseLeave: () => mouseLeft(StartGui.Buttons.Start),
	Activated: (input, _clickCount) => {
		if (ClickInputs.has(input.UserInputType)) {
			Events.StartScreenEnded.FireServer();
			Vars.IsInStartScreen = false;
			
			if (backgroundTween) {
				backgroundTween.Cancel();
				backgroundTween.Destroy();
				backgroundTween = undefined;
			}
			
			StartGui.Enabled = false;
			HudGui.Enabled = true;
			MenuGui.Enabled = true;
			PerformanceGui.Enabled = true;
			SpeedLinesGui.Enabled = true;
		}
	},
});

onEvent(StartGui.Buttons.Credits, {
	MouseEnter: () => mouseEntered(StartGui.Buttons.Credits),
	MouseLeave: () => mouseLeft(StartGui.Buttons.Credits),
	Activated: (input, _clickCount) => {
		if (ClickInputs.has(input.UserInputType)) {
			console.warn('TODO: Show CreditsUI');
		}
	},
});
