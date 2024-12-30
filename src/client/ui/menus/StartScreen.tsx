import {
	GuiService,
	TweenService,
} from '@rbxts/services';

import React, { useEffect, useRef, useState } from '@rbxts/react';

import { Container } from '../components/Container';
import { RoundedButton } from '../components/RoundedButton';
import { CircleTransition } from '../components/CircleTransition';

interface Props {
	Camera: Camera;
	Scale: number;
	OnPlayButton: () => boolean;
}

export function StartScreen(props: Props) {
	const {
		Camera,
		Scale,
		OnPlayButton,
	} = props;
	
	const [isTransitioning, setTransitioning] = useState<boolean>(false);
	const [transitionPosition, setTransitionPosition] = useState<UDim2>(UDim2.fromOffset(0, 0));
	const backgroundImageRef = useRef<ImageLabel>();
	
	const transitionSize = math.max(Camera.ViewportSize.X, Camera.ViewportSize.Y) * 3;
	
	const doTransition = (x: number, y: number) => {
		if (isTransitioning) {
			return;
		}
		
		y += GuiService.TopbarInset.Height;
		
		x /= Scale;
		y /= Scale;
		
		setTransitionPosition(UDim2.fromOffset(x, y));
		setTransitioning(true);
		
		task.wait(0.8);
	}
	
	const clearTransition = () => {
		setTransitionPosition(UDim2.fromOffset(0, 0));
		setTransitioning(false);
	}
	
	useEffect(() => {
		if (backgroundImageRef.current) {
			TweenService.Create(backgroundImageRef.current, new TweenInfo(3, Enum.EasingStyle.Linear, Enum.EasingDirection.In, -1, false, 0), {
				Position: UDim2.fromOffset(0, -512),
			}).Play();
		}
	}, [backgroundImageRef]);
	
	return (
		<frame
			Position={UDim2.fromScale(0, 0)}
			Size={UDim2.fromScale(1, 1)}
			BackgroundTransparency={1}
			ZIndex={1}
		>
			<imagelabel
				ref={backgroundImageRef}
				Image={'rbxassetid://126053120278617'}
				Position={UDim2.fromOffset(0, 0)}
				Size={new UDim2(1, 0, 1, 512)}
				ImageColor3={Color3.fromRGB(0, 0, 0)}
				ImageTransparency={0.95}
				BackgroundTransparency={1}
				ScaleType={Enum.ScaleType.Tile}
				TileSize={UDim2.fromOffset(128, 128)}
				ZIndex={0}
			/>
			<imagelabel
				Image={'rbxassetid://80028419934896'}
				Position={new UDim2(0, 32, 0, 96)}
				Size={UDim2.fromScale(1, 0.2)}
				BackgroundTransparency={1}
				ZIndex={1}
			>
				<uiaspectratioconstraint
					AspectRatio={2.996}
				/>
			</imagelabel>
			<Container
				AnchorPoint={new Vector2(1, 1)}
				Position={new UDim2(1, 0, 1, -16)}
				Size={new UDim2(0, 500, 1, -16)}
				VerticalAlignment={Enum.VerticalAlignment.Bottom}
				Gap={16}
				ZIndex={2}
			>
				<RoundedButton
					Text={'play'}
					IconImage={'rbxassetid://84962674544300'}
					Direction={'left'}
					IconSize={0.5}
					Size={new UDim2(1, 0, 0, 140)}
					InnerPadding={16}
					OnActivated={(input) => {
						const shouldTransition = OnPlayButton();
						
						if (!shouldTransition) {
							return;
						}
						
						doTransition(input.Position.X, input.Position.Y);
						clearTransition();
					}}
				/>
				<RoundedButton
					Text={'credits'}
					IconImage={''}
					Direction={'left'}
					IconSize={0.5}
					Size={new UDim2(1, 0, 0, 140)}
					InnerPadding={16}
				/>
			</Container>
			{
				isTransitioning
				? <CircleTransition
					Position={transitionPosition}
					Size={UDim2.fromOffset(transitionSize, transitionSize)}
					Color3={Color3.fromRGB(0, 0, 0)}
					Duration={0.6}
					Animate={true}
				/>
				: undefined
			}
		</frame>
	);
}
