export type Springable = number | Vector2 | Vector3;

export default class Spring<T extends Springable> {
	/**
	 * @function
	 * @group Constructors
	 * 
	 * Constructs a new Spring at the position and target specified, of type <T>.
	 */
	constructor(initial: T, damping?: number, speed?: number, clock?: (() => number));
	/**
	 * @method
	 * @group Methods
	 * 
	 * Resets the springs' position and target to the target value provided, or 
	 * to the initial value the spring was created with if target is not specified.
	 * Sets the velocity to zero.
	 */
	Reset(target?: T): void;
	/**
	 * @method
	 * @group Methods
	 * Impulses the spring, increasing velocity by the amount given.
	 * This is useful to make something shake.
	 */
	Impulse(velocity: T): void;
	/**'
	 * @method
	 * @group Methods
	 * Instantly skips the spring forwards by the given time.
	 */
	TimeSkip(delta: number): void;
	/** The position of the spring (automatically updated once read) */
	Position: T;
	/** The position of the spring (automatically updated once read) */
	p: T;
	/** The velocity of the spring (automatically updated once read) */
	Velocity: T;
	/** The velocity of the spring (automatically updated once read) */
	v: T;
	/** The target value of the spring */
	Target: T;
	/** The target value of the spring */
	t: T;
	/** The damping of the spring */
	Damping: number;
	/** The damping of the spring */
	d: number;
	/** The speed of the spring */
	Speed: number;
	/** The speed of the spring */
	s: number;
	/** The clock function of the spring */
	Clock: number;
}
