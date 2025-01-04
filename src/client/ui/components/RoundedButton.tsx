import React from '@rbxts/react';

import { FontIds } from 'shared/Constants';

import Tween, { PseudoTween } from '@rbxts/tween';
import * as Easing from '@rbxts/easing-functions';

interface Props {
	Text: string;
	IconImage: string;
	Size: UDim2;
	Order?: number;
	Visible?: boolean;
	TextColor?: Color3;
	FontWeight?: Enum.FontWeight;
	FontStyle?: Enum.FontStyle;
	IconSize?: number;
	Animated?: boolean;
	Direction?: 'left' | 'right';
	InnerPadding?: number;
	BackgroundTransparency?: number;
	ZIndex?: number;
	
	OnActivated?: (inputObject: InputObject, clickCount: number) => void;
	OnMouseUp?: (x: number, y: number) => void;
	OnMouseDown?: (x: number, y: number) => void;
	OnMouseEnter?: (x: number, y: number) => void;
	OnMouseLeave?: (x: number, y: number) => void;
}

export function RoundedButton(props: Props) {
	let {
		Visible,
		Text,
		TextColor,
		FontWeight,
		FontStyle,
		IconImage,
		IconSize,
		Direction,
		InnerPadding,
		Size,
		Order,
		BackgroundTransparency,
		ZIndex,
		Animated,
		OnActivated,
		OnMouseDown,
		OnMouseUp,
		OnMouseEnter,
		OnMouseLeave,
	} = props;
	
	Visible = Visible ?? true;
	TextColor = TextColor ?? Color3.fromRGB(255, 255, 255);
	FontWeight = FontWeight ?? Enum.FontWeight.Bold;
	FontStyle = FontStyle ?? Enum.FontStyle.Normal;
	IconSize = IconSize ?? 0.5;
	Direction = Direction ?? 'left';
	InnerPadding = InnerPadding ?? 12;
	BackgroundTransparency = BackgroundTransparency ?? 0.5;
	Animated = Animated ?? true;
	
	const font = Font.fromId(FontIds.Inter, FontWeight, FontStyle);
	
	const outerIconSize = Size.Y.Offset - InnerPadding * 2;
	const isLeft = Direction === 'left';
	
	let currentTween: PseudoTween | undefined = undefined;
	let currentButtonX = 0;
	
	const moveButton = (button: TextButton, x: number) => {
		currentButtonX = x;
		button.Size = Size.add(UDim2.fromOffset(x, 0));
	}
	
	return (
		<frame
			BackgroundTransparency={1}
			Visible={Visible}
			Size={Size}
			LayoutOrder={Order}
			ZIndex={ZIndex}
		>
			<textbutton
				BackgroundTransparency={1}
				Size={Size}
				Position={UDim2.fromScale(isLeft ? 1 : 0, 0)}
				AnchorPoint={new Vector2(isLeft ? 1 : 0, 0)}
				ZIndex={ZIndex}
				Text={''}
				Event={{
					MouseEnter: (button, x, y) => {
						if (!Animated) {
							return;
						}
						
						if (OnMouseEnter !== undefined) {
							OnMouseEnter(x, y);
						}
						
						currentTween?.Cancel();
						currentTween = Tween<number>(1, Easing.Spring, (t) => moveButton(button, t), currentButtonX, 15);
					},
					MouseLeave: (button, x, y) => {
						if (!Animated) {
							return;
						}
						
						if (OnMouseLeave !== undefined) {
							OnMouseLeave(x, y);
						}
						
						currentTween?.Cancel();
						currentTween = Tween<number>(1, Easing.Spring, (t) => moveButton(button, t), currentButtonX, 0);
					},
					MouseButton1Down: (button, x, y) => {
						if (!Animated) {
							return;
						}
						
						if (OnMouseUp !== undefined) {
							OnMouseUp(x, y);
						}
						
						currentTween?.Cancel();
						currentTween = Tween<number>(1, Easing.Spring, (t) => moveButton(button, t), currentButtonX, -10);
					},
					MouseButton1Up: (button, x, y) => {
						if (!Animated) {
							return;
						}
						
						if (OnMouseDown !== undefined) {
							OnMouseDown(x, y);
						}
						
						currentTween?.Cancel();
						currentTween = Tween<number>(1, Easing.Spring, (t) => moveButton(button, t), currentButtonX, 15);
					},
					Activated: (_button, inputObject, clickCount) => {
						if (OnActivated !== undefined) {
							OnActivated(inputObject, clickCount);
						}
					},
				}}
			>
				<imagelabel
					Image={isLeft ? 'rbxassetid://114536573005404' : 'rbxassetid://99866759095083'}
					BackgroundTransparency={1}
					ImageColor3={Color3.fromRGB(0, 0, 0)}
					ImageTransparency={BackgroundTransparency}
					Size={UDim2.fromScale(1, 1)}
					ScaleType={'Slice'}
					SliceCenter={new Rect(512, 256, 512, 256)}
					SliceScale={1}
					ZIndex={ZIndex}
				/>
				<imagelabel
					BackgroundTransparency={1}
					ImageColor3={Color3.fromRGB(0, 0, 0)}
					ImageTransparency={(1 + BackgroundTransparency) / 2}
					Image={'rbxassetid://131641184474902'}
					AnchorPoint={new Vector2(isLeft ? 0 : 1, 0.5)}
					Position={isLeft ? new UDim2(0, InnerPadding, 0.5, 0) : new UDim2(1, InnerPadding * -1, 0.5, 0)}
					Size={UDim2.fromOffset(outerIconSize, outerIconSize)}
					ZIndex={ZIndex}
				>
					<imagelabel
						Image={IconImage}
						BackgroundTransparency={1}
						AnchorPoint={new Vector2(0.5, 0.5)}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(IconSize, IconSize)}
						ScaleType={'Fit'}
						ZIndex={ZIndex}
					/>
				</imagelabel>
				<textlabel
					Text={Text}
					TextColor3={TextColor}
					TextScaled={true}
					TextXAlignment={isLeft ? Enum.TextXAlignment.Left : Enum.TextXAlignment.Right}
					TextYAlignment={Enum.TextYAlignment.Center}
					AnchorPoint={new Vector2(isLeft ? 0 : 1, 0)}
					Position={isLeft ? new UDim2(0, Size.Y.Offset, 0, InnerPadding) : new UDim2(1, Size.Y.Offset * -1, 0, InnerPadding)}
					Size={new UDim2(1, Size.Y.Offset * -1, 1, InnerPadding * -2)}
					FontFace={font}
					BackgroundTransparency={1}
					ZIndex={ZIndex}
				/>
			</textbutton>
		</frame>
	);
}
