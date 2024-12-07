type HudGui = ScreenGui & {
	UISCale: UIScale;
	HUD: Frame & {
		Altitude: TextLabel & {
			UIStroke: UIStroke;
		};
		Speedometer: TextLabel & {
			UIStroke: UIStroke;
		};
	};
};

export default HudGui;
