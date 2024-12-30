import React, { useEffect, useRef, useState } from '@rbxts/react';
import { ContentProvider, RunService, TweenService } from '@rbxts/services';
import { $print, $warn } from 'rbxts-transform-debug';
import * as Easing from '@rbxts/easing-functions';
import Tween, { PseudoTween } from '@rbxts/tween';

import { AssetIds } from 'shared/Constants';

interface Props {
	OnFinished: () => void;
}

export function LoadingScreen(props: Props) {
	const {
		OnFinished,
	} = props;
	
	const [isPreloading, setIsPreloading] = useState<boolean>(false);
	const [percent, setPercent] = useState<number>(0);
	const containerRef = useRef<Frame>();
	const frameRef = useRef<Frame>();
	const imageRef = useRef<ImageLabel>();
	
	let currentTween: PseudoTween | undefined = undefined;
	
	useEffect(() => {
		if (isPreloading) {
			return;
		}
		
		setIsPreloading(true);
		
		let i = 0;
		
		ContentProvider.PreloadAsync(AssetIds, (contentId, status) => {
			i++;
			setPercent(i / AssetIds.size());
			
			switch (status) {
				case Enum.AssetFetchStatus.Success: {
					if (RunService.IsStudio()) {
						$print(`Loaded ${contentId} successfully`);
					}
					break;
				}
				default: {
					$warn(`Cannot load ${contentId}, failed with status '${status.Name}'`);
					break;
				}
			}
			
			if (i === AssetIds.size()) {
				setPercent(1);
				
				OnFinished();
				
				if (containerRef.current) {
					TweenService.Create(containerRef.current, new TweenInfo(1, Enum.EasingStyle.Sine, Enum.EasingDirection.In, 0, false, 0), {
						AnchorPoint: new Vector2(0, 1),
					}).Play();
				}
			}
		});
	}, []);
	
	useEffect(() => {
		if (!frameRef.current || !imageRef.current || percent <= frameRef.current.Size.X.Scale) {
			return;
		}
		
		currentTween?.Cancel();
		
		currentTween = Tween<number>(
			0.5,
			Easing.OutSine,
			(p) => {
				if (frameRef.current && imageRef.current) {
					frameRef.current.Size = UDim2.fromScale(p, 1);
					imageRef.current.Size = UDim2.fromScale(1 / p, 1);
				}
			},
			frameRef.current.Size.X.Scale,
			percent,
		);
	}, [frameRef, imageRef, percent]);
	
	return (
		<frame
			ref={containerRef}
			Position={UDim2.fromScale(0, 0)}
			Size={UDim2.fromScale(1, 1)}
			BackgroundColor3={Color3.fromRGB(0, 0, 0)}
			ZIndex={2}
		>
			<imagelabel
				Image={'rbxassetid://80028419934896'}
				ImageColor3={Color3.fromRGB(128, 128, 128)}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(1, 0.3)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundTransparency={1}
			>
				<uiaspectratioconstraint
					AspectRatio={2.996}
				/>
				<frame
					ref={frameRef}
					Size={UDim2.fromScale(0, 1)}
					ClipsDescendants={true}
					BackgroundTransparency={1}
				>
					<imagelabel
						ref={imageRef}
						Image={'rbxassetid://80028419934896'}
						Position={UDim2.fromScale(0, 0)}
						Size={UDim2.fromScale(0, 1)}
						AnchorPoint={new Vector2(0, 0)}
						BackgroundTransparency={1}
					/>
				</frame>
			</imagelabel>
		</frame>
	);
}
