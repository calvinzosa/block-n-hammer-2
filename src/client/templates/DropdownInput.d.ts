type DropdownInput = Frame & {
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
		UIFlexItem: UIFlexItem;
		Dropdown: TextButton & {
			Background: ImageLabel;
			Value: TextLabel & {
				UIFlexItem: UIFlexItem;
				UIPadding: UIPadding;
			};
			ImageLabel: ImageLabel & {
				UIAspectRatioConstraint: UIAspectRatioConstraint;
			};
		};
	};
};

export default DropdownInput;
