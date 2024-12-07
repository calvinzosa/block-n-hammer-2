type PerformanceGui = ScreenGui & {
	UISCale: UIScale;
	Stats: Frame & {
		FPS: TextLabel & {
			UIStroke: UIStroke;
		};
		Ping: TextLabel & {
			UIStroke: UIStroke;
		};
	};
};

export default PerformanceGui;
