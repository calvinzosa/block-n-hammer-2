import React, { useEffect, useRef } from '@rbxts/react';

import * as Easing from '@rbxts/easing-functions';
import Tween, { PseudoTween } from '@rbxts/tween';

import { Container } from '../components/Container';
import { RoundedButton } from '../components/RoundedButton';
import { useRootSelector } from '../producer';

interface Props {
	OnButtonClick: (button: 'settings' | 'customization' | 'level selector' | 'spectate' | 'start menu') => void;
}

export function SideMenu(props: Props) {
	let {
		OnButtonClick,
	} = props;
	
	const isOpen = useRootSelector((state) => state.isMenuToggled);
	const containerRef = useRef<Frame>();
	
	let currentTween: PseudoTween | undefined = undefined;
	
	useEffect(() => {
		const frame = containerRef.current;
		
		if (frame) {
			currentTween?.Cancel();
			
			currentTween = Tween<UDim2>(
				isOpen ? 1 : 0.5,
				isOpen ? Easing.OutBounce : Easing.InSine,
				(value) => frame.Position = value,
				frame.Position,
				isOpen ? UDim2.fromScale(0, 1) : UDim2.fromScale(-0.6, 1),
			);
			
			return () => {
				currentTween?.Cancel();
			}
		}
	}, [isOpen]);
	
	return (
		<frame
			ref={containerRef}
			AnchorPoint={new Vector2(0, 1)}
			Position={UDim2.fromScale(-0.6, 1)}
			Size={new UDim2(0.4, 0, 1, -16)}
			BackgroundTransparency={1}
		>
			<Container
				Size={UDim2.fromScale(1, 1)}
				ZIndex={2}
				Gap={0}
				PaddingBottom={16}
				PaddingRight={16}
			>
				<Container
					Size={new UDim2(1, 0, 0, 200)}
					PaddingTop={32}
					PaddingRight={16}
				>
					<imagelabel
						Position={UDim2.fromScale(1, 0.5)}
						Size={UDim2.fromScale(0.9, 1)}
						AnchorPoint={new Vector2(1, 0.5)}
						Image={'rbxassetid://80028419934896'}
						BackgroundTransparency={1}
					>
						<uiaspectratioconstraint
							AspectRatio={2.996}
						/>
					</imagelabel>
				</Container>
				<Container
					Size={new UDim2(1, 0, 1, 0)}
					VerticalAlignment={Enum.VerticalAlignment.Bottom}
					Gap={8}
					FlexMode={Enum.UIFlexMode.Fill}
				>
					<RoundedButton
						Text={'settings'}
						IconImage={'rbxassetid://76009150344164'}
						Direction={'right'}
						Size={new UDim2(1, -10, 0, 95)}
						IconSize={0.6}
						InnerPadding={8}
						OnActivated={() => {
							OnButtonClick('settings');
						}}
					/>
					<RoundedButton
						Text={'customization'}
						IconImage={'rbxassetid://109276038017475'}
						Direction={'right'}
						Size={new UDim2(1, -10, 0, 95)}
						IconSize={0.6}
						InnerPadding={8}
						OnActivated={() => {
							OnButtonClick('customization');
						}}
					/>
					<RoundedButton
						Text={'level selector'}
						IconImage={'rbxassetid://127737643587374'}
						Direction={'right'}
						Size={new UDim2(1, -10, 0, 95)}
						IconSize={0.5}
						InnerPadding={8}
						OnActivated={() => {
							OnButtonClick('level selector');
						}}
					/>
					<RoundedButton
						Text={'spectate'}
						IconImage={'rbxassetid://109002304737321'}
						Direction={'right'}
						Size={new UDim2(1, -10, 0, 95)}
						IconSize={0.7}
						InnerPadding={8}
						OnActivated={() => {
							OnButtonClick('spectate');
						}}
					/>
					<RoundedButton
						Text={'start menu'}
						IconImage={'rbxassetid://116118389947605'}
						Direction={'right'}
						Size={new UDim2(1, -10, 0, 95)}
						IconSize={0.6}
						InnerPadding={8}
						OnActivated={() => {
							OnButtonClick('start menu');
						}}
					/>
				</Container>
			</Container>
			<imagelabel
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0, 0)}
				Size={UDim2.fromScale(1, 1)}
				Image={'rbxassetid://133464490130323'}
				ImageTransparency={0.5}
				ImageColor3={Color3.fromRGB(0, 0, 0)}
				ScaleType={Enum.ScaleType.Slice}
				SliceCenter={new Rect(512, 512, 512, 512)}
				SliceScale={0.15}
				ZIndex={1}
			/>
		</frame>
	);
}
