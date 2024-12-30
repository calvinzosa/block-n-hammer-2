export type CubeHammer = Model & {
	WeldConstraint: WeldConstraint;
	Handle: Part & {
		Attachment0: Attachment;
	};
	Head: Part & {
		Attachment0: Attachment;
	};
};

export type CubePart = Part & {
	AlignOrientation: AlignOrientation;
	TargetAttachment: Attachment;
	Attachment1: Attachment;
	PlaneConstraint: PlaneConstraint;
	Face: Decal;
};

export type CubeRootPart = Part & {
	Attachment0: Attachment;
	WeldConstraint: WeldConstraint;
};

export type CubeModel = Model & {
	AlignOrientation: AlignOrientation;
	AlignPosition: AlignPosition;
	Hammer: CubeHammer;
	Cube: CubePart;
	HumanoidRootPart: CubeRootPart;
};
