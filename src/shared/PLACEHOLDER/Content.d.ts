export class Content {
	public readonly Uri?: string;
	public readonly Object?: NewObject;
	public readonly SourceType?: Enum.ContentSourceType;
	
	static fromObject(this: void, object: unknown): Content;
	static fromURi(this: void, uri: string): Content;
	static fromAssetId(this: void, assetId: number): Content;
}
