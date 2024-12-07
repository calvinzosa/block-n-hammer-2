type StartGui = ScreenGui & {
	Logo: ImageLabel & {
		UIAspectRatioConstraint: UIAspectRatioConstraint;
	};
	Buttons: Frame & {
		Start: TextButton & {
			Background: ImageLabel;
			Icon: ImageLabel & {
				Icon: ImageLabel & {
					UIAspectRatioConstraint: UIAspectRatioConstraint;
				};
			};
			Text: TextLabel;
		};
		UIListLayout: UIListLayout;
		UIPadding: UIPadding;
		Credits: TextButton & {
			Background: ImageLabel;
			Icon: ImageLabel;
			Text: TextLabel;
		};
	};
	UIScale: UIScale;
	Background: ImageLabel;
};

export default StartGui;
