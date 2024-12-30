import React, { MutableRefObject, ReactNode } from '@rbxts/react';

interface Props {
	Position?: UDim2;
	Size?: UDim2;
	BackgroundTransparency?: number;
	BackgroundColor3?: Color3;
	HorizontalAlignment?: Enum.HorizontalAlignment;
	VerticalAlignment?: Enum.VerticalAlignment;
	Gap?: number;
	Padding?: number;
	PaddingTop?: number;
	PaddingBottom?: number;
	PaddingLeft?: number;
	PaddingRight?: number;
	ZIndex?: number;
	AnchorPoint?: Vector2;
	FlexMode?: Enum.UIFlexMode;
	FlexGrow?: number;
	FlexShrink?: number;
	children?: ReactNode;
}

export function Container(props: Props) {
	const {
		Position,
		Size,
		BackgroundTransparency,
		BackgroundColor3,
		HorizontalAlignment,
		VerticalAlignment,
		Padding,
		PaddingTop,
		PaddingBottom,
		PaddingLeft,
		PaddingRight,
		Gap,
		ZIndex,
		AnchorPoint,
		FlexMode,
		FlexGrow,
		FlexShrink,
		children,
	} = props;
	
	return (
		<frame
			Position={Position}
			Size={Size}
			AnchorPoint={AnchorPoint}
			BackgroundTransparency={BackgroundTransparency ?? 1}
			BackgroundColor3={BackgroundColor3}
			ZIndex={ZIndex}
		>
			<uipadding
				PaddingTop={new UDim(0, PaddingTop ?? Padding)}
				PaddingBottom={new UDim(0, PaddingBottom ?? Padding)}
				PaddingLeft={new UDim(0, PaddingLeft ?? Padding)}
				PaddingRight={new UDim(0, PaddingRight ?? Padding)}
			/>
			{
				HorizontalAlignment !== undefined || VerticalAlignment !== undefined || Gap !== undefined
				? <uilistlayout
					HorizontalAlignment={HorizontalAlignment}
					VerticalAlignment={VerticalAlignment}
					Padding={new UDim(0, Gap)}
					SortOrder={Enum.SortOrder.Name}
				/>
				: undefined
			}
			{
				FlexMode !== undefined || FlexGrow !== undefined || FlexShrink !== undefined
				? <uiflexitem
					FlexMode={FlexMode}
					GrowRatio={FlexGrow}
					ShrinkRatio={FlexShrink}
				/>
				: undefined
			}
			{children}
		</frame>
	);
}
