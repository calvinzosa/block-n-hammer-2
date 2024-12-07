type CheckboxInput = Frame & {
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
		Checkbox: TextButton & {
			Background: ImageLabel;
			Value: ImageLabel;
			UIAspectRatioConstraint: UIAspectRatioConstraint;
		};
		UIFlexItem: UIFlexItem;
	};
};

export default CheckboxInput;
