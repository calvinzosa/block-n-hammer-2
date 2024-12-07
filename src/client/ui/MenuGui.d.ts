type MenuGui = ScreenGui & {
	UIScale: UIScale;
	MenuContainer: Frame & {
		Background: ImageLabel;
		Container: Frame & {
			LogoContainer: Frame & {
				UIAspectRatioConstraint: UIAspectRatioConstraint;
				Logo: ImageLabel & {
					UIAspectRatioConstraint: UIAspectRatioConstraint;
				};
			};
			UIListLayout: UIListLayout;
			Buttons: Frame & {
				UIListLayout: UIListLayout;
				UIFlexItem: UIFlexItem;
				Customization: TextButton & {
					Background: ImageLabel;
					Icon: ImageLabel & {
						Icon: ImageLabel & {
							UIAspectRatioConstraint: UIAspectRatioConstraint;
						};
					};
					Text: TextLabel;
				};
				LevelSelector: TextButton & {
					Background: ImageLabel;
					Icon: ImageLabel & {
						Icon: ImageLabel & {
							UIAspectRatioConstraint: UIAspectRatioConstraint;
						};
					};
					Text: TextLabel;
				};
				Settings: TextButton & {
					Background: ImageLabel;
					Icon: ImageLabel & {
						Icon: ImageLabel & {
							UIAspectRatioConstraint: UIAspectRatioConstraint;
						};
					};
					Text: TextLabel;
				};
				Spectate: TextButton & {
					Background: ImageLabel;
					Icon: ImageLabel & {
						Icon: ImageLabel & {
							UIAspectRatioConstraint: UIAspectRatioConstraint;
						};
					};
					Text: TextLabel;
				};
				StartMenu: TextButton & {
					Background: ImageLabel;
					Icon: ImageLabel & {
						Icon: ImageLabel & {
							UIAspectRatioConstraint: UIAspectRatioConstraint;
						};
					};
					Text: TextLabel;
				};
			};
		};
	};
};

export default MenuGui;
