interface EditableImageOptions {
	/**
	 * A `Vector2` that specifies the image's desired width and height
	 */
	Size?: Vector2;
}

interface EditableMeshOptions {
	
}

interface AssetService {
	/**
	 * Creates a new `EditableImage`. By default, the resolution is set at 512×512, but you can specify a different size using the method's option table.
	 * If the device‑specific editable memory budget is exhausted, creation fails and this method returns nil.
	 * @param editableImageOptions Options table containing controls for the method.
	 * @returns `EditableImage | undefined`
	 */
	CreateEditableImage(this: AssetService, editableImageOptions: EditableImageOptions): NewEditableImage | undefined;
	/**
	 * Creates a new, empty EditableMesh. Vertices, triangles and their attributes can be added dynamically to it.
	 * If the device‑specific editable memory budget is exhausted, creation will fail and this method will return nil.
	 * @param editableMeshOptions `Dictionary`
	 * @returns `EditableMesh | undefined`
	 */
	CreateEditableMesh(this: AssetService, editableMeshOptions: EditableMeshOptions): EditableMesh | undefined;
	CreateEditableMeshAsync(this: AssetService, content: unknown): EditableMesh;
	CreateMeshPartAsync(this: AssetService, content: unknown): MeshPart;
}

declare namespace math {
	function map(x: number, inmin: number, inmax: number, outmin: number, outmax: number): number;
}

interface NewObject {
	/**
	 * A read-only string representing the class this `Object` belongs to
	 */
	ClassName: string;
	/** @deprecated */
	className: string;
	/**
	 * This method returns an event that behaves exactly like the Changed event, except that it only fires when the given property changes. It's generally a good idea to use this method instead of a connection to Changed with a function that checks the property name. Subsequent calls to this method on the same object with the same property name return the same event.
	 * 
	 * ValueBase objects, such as IntValue and StringValue, use a modified Changed event that fires with the contents of their Value property. As such, this method provides a way to detect changes in other properties of those objects.
	 * 
	 * Note that this event will not pass any arguments to a connected function, so the value of the changed property must be read directly within a script.
	 * 
	 * # Limitations
	 * 
	 * The event returned by this method does not fire for physics-related changes, such as when the CFrame, AssemblyLinearVelocity, AssemblyAngularVelocity, Position, or Orientation properties of a BasePart change due to gravity. To detect changes in these properties, consider using a physics-based event like RunService.PreSimulation.
	 * 
	 * Additionally, the returned event may not fire on every modification of properties that change very frequently, and/or it may not fire for such properties at all. It's recommended that you carefully test for property changes that impact game logic.
	 * 
	 * 
	 */
	GetPropertyChangedSignal<T extends Instance>(this: T, property: keyof InstancePropertyNames<T>): RBXScriptSignal;
	/**
	 * IsA returns true if the object's class is equivalent to or a subclass of a given class. This function is similar to the instanceof operators in other languages, and is a form of type introspection. To ignore class inheritance, test the ClassName property directly instead. For checking native Lua data types (number, string, etc) use the functions type and typeof.
	 * 
	 * Most commonly, this function is used to test if an object is some kind of part, such as Part or WedgePart, which inherits from BasePart (an abstract class). For example, if your goal is to change all of a character's limbs to the same color, you might use GetChildren to iterate over the children, then use IsA to filter non-BasePart objects which lack the BrickColor property:
	 * 
	 * Since all classes inherit from Object, calling `object:IsA("Object")` will always return true.
	 * 
	 * @param className The class against which the Object's class will be checked. Case-sensitive.
	 */
	IsA(className: keyof Instances): boolean;
	/** @deprecated */
	isA(className: keyof Instances): boolean;
}

interface DrawImageTransformedOptions {
	/**
	 * Specifies how the pixels of the source image blend with those of the destination. Default is `Enum.ImageCombineType.AlphaBlend`.
	 */
	CombineType?: Enum.ImageCombineType;
	/**
	 * Specifies the sampling method (e.g. `Default` for bilinear or `Pixelated` for nearest neighbor). Default is `Enum.ResamplerMode.Default`.
	 */
	SamplingMode?: Enum.ResamplerMode;
	/**
	 * Specifies the pivot point within the source image for scaling and rotation. Default is the center of the source image (i.e. `Image.Size / 2`).
	 */
	PivotPoint?: Vector2;
}

interface NewEditableImage extends NewObject {
	/**
	 * Size of the `EditableImage` in pixels
	 * Maximum size is 1024x1024
	 */
	Size: Vector2;
	/**
	 * Destroys the contents of the image, immediately reclaiming used memory.
	 */
	Destroy(this: NewEditableImage): void;
	/**
	 * Draws another `EditableImage` into this `EditableImage` at the given position.
	 * Positions outside the canvas bounds are allowed such that only part of the new image is drawn.
	 * @param position Position at which the top-left corner of the added image will be drawn.
	 * @param image The `EditableImage` to draw into this `EditableImage`.
	 * @param combineType How the pixels of the source image should be blended with the pixels of the added image.
	 */
	DrawImage(position: Vector2, image: NewObject, combineType: Enum.ImageCombineType): void;
	DrawImageProjected(mesh: NewObject, projection: object, brushConfig: object): void;
	/**
	 * This method lets you draw an `EditableImage` into this `EditableImage` with transformations applied, such as scaling and rotation.
	 * The position parameter specifies where the pivot point of the source image will be placed on this image after transformations.
	 * Positions outside the canvas bounds are allowed such that only part of the new image is drawn.
	 * @param position Position in pixels where the pivot point of the source image will be placed on this image.
	 * @param scale Scaling factors for the source image along the X and Y axes.
	 * @param rotation The rotation angle in degrees, applied around the pivot point of the source image.
	 * @param image The source `EditableImage` to be drawn into this image.
	 * @param options Optional dictionary for additional configuration
	 */
	DrawImageTransformed(position: Vector2, scale: Vector2, rotation: Vector2, image: NewObject, options: DrawImageTransformedOptions): void;
	/**
	 * Draws an anti-aliased line on the `EditableImage` one pixel thick between the two provided points.
	 * @param p1 Start point of the line.
	 * @param p2 End point of the line.
	 * @param color Color of the line.
	 * @param transparency Transparency of the line.
	 * @param combineType How the pixels of the source image are blended with the pixels of the added image.
	 */
	DrawLine(p1: Vector2, p2: Vector2, color: Color3, transparency: number, combineType: Enum.ImageCombineType): void;
	/**
	 * Draws a rectangle on the EditableImage of the given size at the given top-left position.
	 * @param position Position of the top-left of the rectangle. Unlike other drawing methods, this cannot be outside the canvas bounds of the `EditableImage`.
	 * @param size Size of the rectangle to draw, in pixels.
	 * @param color Color of the rectangle.
	 * @param transparency Transparency of the rectangle.
	 * @param combineType How the pixels of the source image are blended with the pixels of the added image.
	 */
	DrawRectangle(position: Vector2, size: Vector2, color: Color3, transparency: number, combineType: Enum.ImageCombineType): void;
	/**
	 * A version of ReadPixels() that returns a buffer instead of a table. Each number in the buffer is a single byte, while each number in the table is 4 bytes, making ReadPixelsBuffer() more memory-efficient than ReadPixels().
	 * Note that this method uses alpha instead of transparency, unlike the EditableImage drawing methods.
	 * @param position Top-left corner of the rectangular region of pixels to read.
	 * @param size Size of the rectangular region of pixels to read.
	 * @returns Buffer where each pixel is represented by four bytes (red, green, blue and alpha respectively). The length of the buffer can be calculated as `Size.X * Size.Y * 4 bytes`.
	 */
	ReadPixelsBuffer(position: Vector2, size: Vector2): buffer;
	/**
	 * A version of WritePixels() that takes a buffer instead of a table. Each number in the buffer is a single byte, while each number in the table is 4 bytes, making WritePixelsBuffer() more memory-efficient than WritePixels().
	 * Note that this method uses alpha instead of transparency, unlike the EditableImage drawing methods.
	 * @param position Top-left corner of the rectangular region to draw the pixels into.
	 * @param size Size of the rectangular region of pixels to write.
	 * @param buffer A buffer where each pixel is represented by four bytes (red, green, blue, and alpha respectively). The length of the buffer should be `Size.X * Size.Y * 4 bytes`.
	 */
	WritePixelsBuffer(position: Vector2, size: Vector2, buffer: buffer): void;
}

interface ImageLabel {
	ImageContent: any;
}
