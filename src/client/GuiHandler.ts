import {
	Players,
	ReplicatedStorage,
} from '@rbxts/services';

import Tween, { PseudoTween } from '@rbxts/tween';
import * as Easing from '@rbxts/easing-functions';
import StringUtils from '@rbxts/string-utils';

import GuiTypes from './ui';
import TemplateTypes from './templates';
import Vars from './Variables';

import { onEvent } from 'shared/Utils';
import { Attributes, ClickInputs } from 'shared/Constants';
import Events from 'shared/Events';

const client = Players.LocalPlayer;
const playerGui = client.WaitForChild('PlayerGui') as PlayerGui;
const templatesFolder = ReplicatedStorage.WaitForChild('Templates');

export const StartGui = playerGui.WaitForChild('StartGui') as GuiTypes.StartGui;
export const PerformanceGui = playerGui.WaitForChild('PerformanceGui') as GuiTypes.PerformanceGui;
export const MenuGui = playerGui.WaitForChild('MenuGui') as GuiTypes.MenuGui;
export const HudGui = playerGui.WaitForChild('HudGui') as GuiTypes.HudGui;
export const SpeedLinesGui = playerGui.WaitForChild('SpeedLines') as GuiTypes.SpeedLines;

export const Templates = {
	SliderInput: templatesFolder.WaitForChild('SliderInput') as TemplateTypes.SliderInput,
	DropdownInput: templatesFolder.WaitForChild('DropdownInput') as TemplateTypes.DropdownInput,
	CheckboxInput: templatesFolder.WaitForChild('CheckboxInput') as TemplateTypes.CheckboxInput,
};

const ongoingTweens = new Map<Instance, PseudoTween>();

const tweens = {
	MenuEnter: Tween<number>(0.5, Easing.OutSine, (x) => MenuGui.MenuContainer.AnchorPoint = new Vector2(x, 0), 1, 0).Cancel(),
	MenuLeave: Tween<number>(0.5, Easing.InSine, (x) => MenuGui.MenuContainer.AnchorPoint = new Vector2(x, 0), 0, 1).Cancel(),
};

for (const button of MenuGui.MenuContainer.Container.Buttons.GetChildren()) {
	if (!button.IsA('TextButton')) {
		continue;
	}
	
	const enterTween = Tween<number>(1, Easing.Spring, (offset) => button.Position = new UDim2(0, offset, 1, button.Position.Y.Offset), -48, -16).Cancel();
	const leaveTween = Tween<number>(1, Easing.Spring, (offset) => button.Position = new UDim2(0, offset, 1, button.Position.Y.Offset), -16, -48).Cancel();
	const clickTween = Tween<number>(0.5, Easing.Spring, (offset) => button.Position = new UDim2(0, offset, 1, button.Position.Y.Offset), -16, -64).Cancel();
	
	const containerFrame = MenuGui.FindFirstChild(`${button.Name}Container`);
	
	onEvent(button, {
		MouseEnter: () => {
			clickTween.Cancel();
			enterTween.Cancel().Play();
			leaveTween.Cancel();
		},
		MouseLeave: () => {
			clickTween.Cancel();
			enterTween.Cancel();
			leaveTween.Cancel().Play();
		},
		MouseButton1Down: () => {
			clickTween.Cancel().Play();
			enterTween.Cancel();
			leaveTween.Cancel();
		},
		MouseButton1Up: () => {
			clickTween.Cancel();
			enterTween.Cancel().Play();
			leaveTween.Cancel();
		},
		Activated: (input, _clickCount) => {
			if (ClickInputs.has(input.UserInputType)) {
				if (containerFrame?.IsA('Frame')) {
					const isOpened = !containerFrame.GetAttribute(Attributes.UI.IsFrameOpened);
					
					for (const otherContainer of MenuGui.GetChildren()) {
						if (otherContainer.IsA('Frame') && otherContainer !== containerFrame && StringUtils.endsWith(otherContainer.Name, 'Container')) {
							if (otherContainer.Name === 'MenuContainer') {
								continue;
							}
							
							if (otherContainer.GetAttribute(Attributes.UI.IsFrameOpened)) {
								otherContainer.SetAttribute(Attributes.UI.IsFrameOpened, false);
								
								ongoingTweens.get(otherContainer)?.Cancel();
								ongoingTweens.set(otherContainer,
									Tween<number>(0.5, Easing.InOutSine, (y) => otherContainer.Position = new UDim2(1, 0, y, 16), 0, -1)
								);
							}
						}
					}
					
					containerFrame.SetAttribute(Attributes.UI.IsFrameOpened, isOpened);
					
					ongoingTweens.get(containerFrame)?.Cancel();
					
					if (isOpened) {
						ongoingTweens.set(containerFrame,
							Tween<number>(0.5, Easing.InOutSine, (x) => containerFrame.Position = new UDim2(x, 0, 0, 16), 1.575, 1)
						);
					} else {
						ongoingTweens.set(containerFrame,
							Tween<number>(0.5, Easing.InOutSine, (y) => containerFrame.Position = new UDim2(1, 0, y, 16), 0, -1)
						);
					}
				} else if (button.Name === 'StartMenu') {
					Events.EnterStartScreen.Fire();
				}
			}
		},
	});
}

export function toggleMenu(toggled?: boolean) {
	Vars.IsMenuOpened = toggled ?? !Vars.IsMenuOpened;
	
	if (Vars.IsInStartScreen) {
		Vars.IsMenuOpened = false;
	}
	
	if (Vars.IsMenuOpened) {
		tweens.MenuLeave.Cancel();
		tweens.MenuEnter.Cancel().Play();
	} else {
		tweens.MenuLeave.Cancel().Play();
		tweens.MenuEnter.Cancel();
	}
}
