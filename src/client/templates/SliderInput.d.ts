type SliderInput = Frame & {
	Text: TextLabel & {
		UIPadding: UIPadding;
		UIStroke: UIStroke;
	};
	UIListLayout: UIListLayout;
	Info: ImageLabel & {
		UIAspectRatioConstraint: UIAspectRatioConstraint;
	};
	Modified: TextLabel & {
		UIStroke: UIStroke;
	};
	Input: Frame & {
		TextBox: TextBox & {
			UICorner: UICorner;
		};
		UIListLayout: UIListLayout;
		Slider: TextButton & {
			UIFlexItem: UIFlexItem;
			Frame: Frame & {
				UICorner: UICorner;
			};
			Input: Frame & {
				UICorner: UICorner;
			};
		};
		UIFlexItem: UIFlexItem;
	};
};

export default SliderInput;
