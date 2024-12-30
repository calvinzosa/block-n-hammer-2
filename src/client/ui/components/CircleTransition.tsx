import React, { useEffect, useRef } from '@rbxts/react';
import { TweenService } from '@rbxts/services';

interface Props {
	Position: UDim2;
	Size: UDim2;
	Color3: Color3;
	Duration: number;
	Animate?: boolean;
}

export function CircleTransition(props: Props) {
	const {
		Position,
		Size,
		Color3,
		Duration,
		Animate,
	} = props;
	
	const containerRef = useRef<Frame>();
	
	let tween: Tween | undefined = undefined;
	
	useEffect(() => {
		if (!containerRef.current) {
			return;
		}
		
		tween?.Cancel();
		
		if (Animate) {
			containerRef.current.Visible = true;
			
			tween = TweenService.Create(containerRef.current, new TweenInfo(Duration, Enum.EasingStyle.Sine, Enum.EasingDirection.Out, 0, false, 0), {
				Size: UDim2.fromScale(0, 0),
			});
			
			tween.Play();
		} else {
			tween = TweenService.Create(containerRef.current, new TweenInfo(Duration, Enum.EasingStyle.Sine, Enum.EasingDirection.Out, 0, false, 0), {
				Size: Size,
			});
			
			tween.Completed.Connect(() => {
				if (containerRef.current) {
					containerRef.current.Visible = false;
				}
			});
			
			tween.Play();
		}
	}, [Animate, containerRef]);
	
	return (
		<frame
			ref={containerRef}
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={Position}
			Size={Size}
			BackgroundTransparency={1}
			ZIndex={9999}
		>
			<imagelabel
				Image={'rbxassetid://113163672569760'}
				Position={UDim2.fromScale(0, 0)}
				Size={UDim2.fromScale(1, 1)}
				ImageColor3={Color3}
				BackgroundTransparency={1}
			/>
			<frame
				BackgroundColor3={Color3}
				BorderSizePixel={0}
				Position={UDim2.fromScale(0, 0.5)}
				AnchorPoint={new Vector2(1, 0.5)}
				Size={Size}
			/>
			<frame
				BackgroundColor3={Color3}
				BorderSizePixel={0}
				Position={UDim2.fromScale(1, 0.5)}
				AnchorPoint={new Vector2(0, 0.5)}
				Size={Size}
			/>
			<frame
				BackgroundColor3={Color3}
				BorderSizePixel={0}
				Position={UDim2.fromScale(0.5, 0)}
				AnchorPoint={new Vector2(0.5, 1)}
				Size={Size}
			/>
			<frame
				BackgroundColor3={Color3}
				BorderSizePixel={0}
				Position={UDim2.fromScale(0.5, 1)}
				AnchorPoint={new Vector2(0.5, 0)}
				Size={Size}
			/>
		</frame>
	);
}
