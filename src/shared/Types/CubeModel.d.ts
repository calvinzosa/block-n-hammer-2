type Cube = Model & {
	AlignOrientation: AlignOrientation;
	AlignPosition: AlignPosition;
	Hammer: Model & {
		WeldConstraint: WeldConstraint;
		Handle: Part & {
			Attachment0: Attachment;
		};
		Head: Part & {
			Attachment0: Attachment;
		};
	};
	Cube: Part & {
		AlignOrientation: AlignOrientation;
		TargetAttachment: Attachment;
		Attachment1: Attachment;
		PlaneConstraint: PlaneConstraint;
		Face: Decal;
	};
	HumanoidRootPart: Part & {
		Attachment0: Attachment;
		WeldConstraint: WeldConstraint;
	};
};

export default Cube;
